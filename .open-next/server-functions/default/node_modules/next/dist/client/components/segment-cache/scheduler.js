"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelPrefetchTask: null,
    isPrefetchTaskDirty: null,
    needsSpeculativePrefetch: null,
    pingPrefetchScheduler: null,
    pingPrefetchTask: null,
    reschedulePrefetchTask: null,
    schedulePrefetchTask: null,
    startRevalidationCooldown: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelPrefetchTask: function() {
        return cancelPrefetchTask;
    },
    isPrefetchTaskDirty: function() {
        return isPrefetchTaskDirty;
    },
    needsSpeculativePrefetch: function() {
        return needsSpeculativePrefetch;
    },
    pingPrefetchScheduler: function() {
        return pingPrefetchScheduler;
    },
    pingPrefetchTask: function() {
        return pingPrefetchTask;
    },
    reschedulePrefetchTask: function() {
        return reschedulePrefetchTask;
    },
    schedulePrefetchTask: function() {
        return schedulePrefetchTask;
    },
    startRevalidationCooldown: function() {
        return startRevalidationCooldown;
    }
});
const _varypath = require("./vary-path");
const _approutertypes = require("../../../shared/lib/app-router-types");
const _cache = require("./cache");
const _cachekey = require("./cache-key");
const _types = require("./types");
const _lru = require("./lru");
const scheduleMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : (fn)=>Promise.resolve().then(fn).catch((error)=>setTimeout(()=>{
            throw error;
        }));
const taskHeap = [];
let inProgressRequests = 0;
let sortIdCounter = 0;
let didScheduleMicrotask = false;
// The most recently hovered (or touched, etc) link, i.e. the most recent task
// scheduled at Intent priority. There's only ever a single task at Intent
// priority at a time. We reserve special network bandwidth for this task only.
let mostRecentlyHoveredLink = null;
// CDN cache propagation delay after revalidation (in milliseconds)
const REVALIDATION_COOLDOWN_MS = 300;
// Timeout handle for the revalidation cooldown. When non-null, prefetch
// requests are blocked to allow CDN cache propagation.
let revalidationCooldownTimeoutHandle = null;
function startRevalidationCooldown() {
    // Clear any existing timeout in case multiple revalidations happen
    // in quick succession.
    if (revalidationCooldownTimeoutHandle !== null) {
        clearTimeout(revalidationCooldownTimeoutHandle);
    }
    // Schedule the cooldown to expire after the delay.
    revalidationCooldownTimeoutHandle = setTimeout(()=>{
        revalidationCooldownTimeoutHandle = null;
        // Retry the prefetch queue now that the cooldown has expired.
        pingPrefetchScheduler();
    }, REVALIDATION_COOLDOWN_MS);
}
function schedulePrefetchTask(key, renderTreeAtTimeOfPrefetch, fetchStrategy, priority, onInvalidate, navigationLockPrefetch) {
    // Bind the task to the segment cache map that is active right now: the
    // shared map, unless the Instant Navigation Testing lock is held, in which
    // case the task gets the lock scope's private map. This is the single
    // place work is bound to a map based on lock state — everything downstream
    // receives the map explicitly. See `segmentCacheMap` in cache.ts.
    let taskSegmentCacheMap = _cache.segmentCacheMap;
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        const { getNavigationLockSegmentCacheMap } = require('./navigation-testing-lock');
        const lockMap = getNavigationLockSegmentCacheMap();
        if (lockMap !== null) {
            taskSegmentCacheMap = lockMap;
        }
    }
    // Spawn a new prefetch task
    const task = {
        key,
        renderTreeAtTimeOfPrefetch,
        routeCacheVersion: (0, _cache.getCurrentRouteCacheVersion)(),
        segmentCacheVersion: (0, _cache.getCurrentSegmentCacheVersion)(),
        segmentCacheMap: taskSegmentCacheMap,
        priority,
        phase: 2,
        hasBackgroundWork: false,
        hasPendingResponses: false,
        spawnedRuntimePrefetches: null,
        fetchStrategy,
        sortId: sortIdCounter++,
        isCanceled: false,
        fallbackRetryStatus: _cache.EntryStatus.Empty,
        onInvalidate,
        _heapIndex: -1
    };
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        task._navigationLockPrefetch = navigationLockPrefetch;
    }
    trackMostRecentlyHoveredLink(task);
    heapPush(taskHeap, task);
    // Schedule an async task to process the queue.
    //
    // The main reason we process the queue in an async task is for batching.
    // It's common for a single JS task/event to trigger multiple prefetches.
    // By deferring to a microtask, we only process the queue once per JS task.
    // If they have different priorities, it also ensures they are processed in
    // the optimal order.
    pingPrefetchScheduler();
    return task;
}
function cancelPrefetchTask(task) {
    // Remove the prefetch task from the queue. If the task already completed,
    // then this is a no-op.
    //
    // We must also explicitly mark the task as canceled so that a blocked task
    // does not get added back to the queue when it's pinged by the network.
    task.isCanceled = true;
    // A running fallback-retry loop notices `isCanceled` when it next wakes and
    // bails (settling its status to Rejected), so there's nothing to clean up here.
    heapDelete(taskHeap, task);
}
function reschedulePrefetchTask(task, renderTreeAtTimeOfPrefetch, fetchStrategy, priority) {
    // Bump the prefetch task to the top of the queue, as if it were a fresh
    // task. This is essentially the same as canceling the task and scheduling
    // a new one, except it reuses the original object.
    //
    // The primary use case is to increase the priority of a Link-initated
    // prefetch on hover.
    // Un-cancel the task, in case it was previously canceled.
    task.isCanceled = false;
    task.phase = 2;
    // Note: fallback-retry state is deliberately NOT reset here. A retry loop runs
    // at most once per task, even across reschedules, so a re-hover never starts a
    // second loop. A loop already running simply continues (it only stops on
    // cancel); `fallbackRetryStatus` never returns to `Empty` once it leaves it.
    // Assign a new sort ID to move it ahead of all other tasks at the same
    // priority level. (Higher sort IDs are processed first.)
    task.sortId = sortIdCounter++;
    task.priority = // If this task is the most recently hovered link, maintain its
    // Intent priority, even if the rescheduled priority is lower.
    task === mostRecentlyHoveredLink ? _types.PrefetchPriority.Intent : priority;
    task.renderTreeAtTimeOfPrefetch = renderTreeAtTimeOfPrefetch;
    task.fetchStrategy = fetchStrategy;
    trackMostRecentlyHoveredLink(task);
    if (task._heapIndex !== -1) {
        // The task is already in the queue.
        heapResift(taskHeap, task);
    } else {
        heapPush(taskHeap, task);
    }
    pingPrefetchScheduler();
}
function isPrefetchTaskDirty(task, nextUrl, root) {
    // This is used to quickly bail out of a prefetch task if the result is
    // guaranteed to not have changed since the task was initiated. This is
    // strictly an optimization — theoretically, if it always returned true, no
    // behavior should change because a full prefetch task will effectively
    // perform the same checks.
    return task.routeCacheVersion !== (0, _cache.getCurrentRouteCacheVersion)() || task.segmentCacheVersion !== (0, _cache.getCurrentSegmentCacheVersion)() || task.renderTreeAtTimeOfPrefetch !== root || task.key.nextUrl !== nextUrl;
}
function trackMostRecentlyHoveredLink(task) {
    // Track the mostly recently hovered link, i.e. the most recently scheduled
    // task at Intent priority. There must only be one such task at a time.
    if (task.priority === _types.PrefetchPriority.Intent && task !== mostRecentlyHoveredLink) {
        if (mostRecentlyHoveredLink !== null) {
            // Bump the previously hovered link's priority down to Default.
            if (mostRecentlyHoveredLink.priority !== _types.PrefetchPriority.Background) {
                mostRecentlyHoveredLink.priority = _types.PrefetchPriority.Default;
                heapResift(taskHeap, mostRecentlyHoveredLink);
            }
        }
        mostRecentlyHoveredLink = task;
    }
}
function pingPrefetchScheduler() {
    if (didScheduleMicrotask) {
        // Already scheduled a task to process the queue
        return;
    }
    didScheduleMicrotask = true;
    scheduleMicrotask(processQueueInMicrotask);
}
/**
 * Checks if we've exceeded the maximum number of concurrent prefetch requests,
 * to avoid saturating the browser's internal network queue. This is a
 * cooperative limit — prefetch tasks should check this before issuing
 * new requests.
 *
 * Also checks if we're within the revalidation cooldown window, during which
 * prefetch requests are delayed to allow CDN cache propagation.
 */ function hasNetworkBandwidth(task) {
    // When offline, don't issue any prefetch requests. The scheduler will be
    // re-pinged when connectivity is restored.
    if (process.env.__NEXT_USE_OFFLINE) {
        const { getOffline } = require('../offline');
        if (getOffline()) {
            return false;
        }
    }
    // Check if we're within the revalidation cooldown window
    if (revalidationCooldownTimeoutHandle !== null) {
        // We're within the cooldown window. Return false to prevent prefetching.
        // When the cooldown expires, the timeout will call ensureWorkIsScheduled()
        // to retry the queue.
        return false;
    }
    // TODO: Also check if there's an in-progress navigation. We should never
    // add prefetch requests to the network queue if an actual navigation is
    // taking place, to ensure there's sufficient bandwidth for render-blocking
    // data and resources.
    // TODO: Consider reserving some amount of bandwidth for static prefetches.
    if (task.priority === _types.PrefetchPriority.Intent) {
        // The most recently hovered link is allowed to exceed the default limit.
        //
        // The goal is to always have enough bandwidth to start a new prefetch
        // request when hovering over a link.
        //
        // However, because we don't abort in-progress requests, it's still possible
        // we'll run out of bandwidth. When links are hovered in quick succession,
        // there could be multiple hover requests running simultaneously.
        return inProgressRequests < 12;
    }
    // The default limit is lower than the limit for a hovered link.
    return inProgressRequests < 4;
}
function spawnPrefetchSubtask(prefetchSubtask) {
    // When the scheduler spawns an async task, we don't await its result.
    // Instead, the async task writes its result directly into the cache, then
    // pings the scheduler to continue.
    //
    // We process server responses streamingly, so the prefetch subtask will
    // likely resolve before we're finished receiving all the data. The subtask
    // result includes a promise that resolves once the network connection is
    // closed. The scheduler uses this to control network bandwidth by tracking
    // and limiting the number of concurrent requests.
    inProgressRequests++;
    return prefetchSubtask.then((result)=>{
        if (result === null) {
            // The prefetch task errored before it could start processing the
            // network stream. Assume the connection is closed.
            onPrefetchConnectionClosed();
            return null;
        }
        // Wait for the connection to close before freeing up more bandwidth.
        result.closed.then(onPrefetchConnectionClosed);
        return result.value;
    });
}
function onPrefetchConnectionClosed() {
    inProgressRequests--;
    // Notify the scheduler that we have more bandwidth, and can continue
    // processing tasks.
    pingPrefetchScheduler();
}
function pingPrefetchTask(task) {
    // "Ping" a prefetch that's already in progress to notify it of new data.
    if (// Check if prefetch was canceled.
    task.isCanceled || // Check if prefetch is already queued.
    task._heapIndex !== -1) {
        return;
    }
    // Add the task back to the queue.
    heapPush(taskHeap, task);
    pingPrefetchScheduler();
}
function processQueueInMicrotask() {
    didScheduleMicrotask = false;
    // We aim to minimize how often we read the current time. Since nearly all
    // functions in the prefetch scheduler are synchronous, we can read the time
    // once and pass it as an argument wherever it's needed.
    const now = Date.now();
    // Process the task queue until we run out of network bandwidth.
    let task = heapPeek(taskHeap);
    while(task !== null && hasNetworkBandwidth(task)){
        task.routeCacheVersion = (0, _cache.getCurrentRouteCacheVersion)();
        task.segmentCacheVersion = (0, _cache.getCurrentSegmentCacheVersion)();
        const exitStatus = pingRoute(now, task);
        // These fields are only valid for a single "pass" — one pingRoute
        // invocation for a task, which is what the comments here also call an
        // attempt or an iteration. Reset them after each iteration of the
        // task queue.
        const hasBackgroundWork = task.hasBackgroundWork;
        task.hasBackgroundWork = false;
        task.hasPendingResponses = false;
        task.spawnedRuntimePrefetches = null;
        switch(exitStatus){
            case 0:
                // The task yielded because there are too many requests in progress.
                // Stop processing tasks until we have more bandwidth.
                return;
            case 1:
                // The task is blocked. It needs more data before it can proceed.
                // Keep the task out of the queue until the server responds.
                heapPop(taskHeap);
                // Continue to the next task
                task = heapPeek(taskHeap);
                continue;
            case 2:
                if (task.phase === 2) {
                    // Finished prefetching the route tree. The two-phase (Shell then
                    // Speculative) flow only applies to routes that have opted into
                    // Partial Prefetching — either globally via the `partialPrefetching`
                    // config or per segment (`prefetch: 'partial'`), both surfaced as the
                    // `SubtreeHasPartialPrefetching` hint on the route tree. Every other
                    // route skips the Shell phase and goes straight to Speculative.
                    //
                    // The route entry is fulfilled at this point (the RouteTree phase
                    // just completed), so its prefetch hints are available.
                    const route = (0, _cache.readRouteCacheEntry)(now, task.key);
                    const routeHasPartialPrefetching = route !== null && route.status === _cache.EntryStatus.Fulfilled && (route.root.tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0;
                    task.phase = routeHasPartialPrefetching ? 1 : 0;
                    heapResift(taskHeap, task);
                } else if (task.phase === 1) {
                    // Shell phase complete — a Done exit means the pass observed every
                    // response it cares about (otherwise it would have exited Blocked;
                    // see hasPendingResponses). Always advance to Speculative regardless
                    // of whether Shell-phase work fired — Speculative is responsible
                    // for the per-link concrete work and runs even on routes whose
                    // shell phase was a no-op.
                    task.phase = 0;
                    heapResift(taskHeap, task);
                } else if (hasBackgroundWork) {
                    // The task spawned additional background work. Reschedule the task
                    // at background priority.
                    task.priority = _types.PrefetchPriority.Background;
                    heapResift(taskHeap, task);
                } else {
                    // The prefetch is complete. Continue to the next task.
                    //
                    // Completion is terminal in the normal flow: a task only completes
                    // after a full pass observed every response it cares about. In rare
                    // cases, though, a task can complete while still registered on an
                    // entry from an earlier pass whose subtree the final pass no longer
                    // reached; when that entry later settles, it re-pings the completed
                    // task. The re-run is a harmless idempotent no-op, but any
                    // per-completion side effect added here must be idempotent or
                    // once-guarded — in particular, the navigation-lock release below
                    // must not fire twice (hence the nulling).
                    if (process.env.__NEXT_EXPOSE_TESTING_API && task._navigationLockPrefetch != null) {
                        // This locked-navigation prefetch is complete: the final pass
                        // observed every segment response it cares about, so the data the
                        // navigation will read has settled. Resolve the prefetch's
                        // promise (awaited by `ensurePrefetchThenNavigate`) so the
                        // navigation proceeds against present data rather than a
                        // still-in-flight entry.
                        const { resolveNavigationLockPrefetch } = require('./navigation-testing-lock');
                        resolveNavigationLockPrefetch(task._navigationLockPrefetch);
                        // Release at most once per task: a stale registration from an
                        // earlier pass can re-ping a completed task (see above), so it can
                        // pass through here again.
                        task._navigationLockPrefetch = null;
                    }
                    heapPop(taskHeap);
                }
                task = heapPeek(taskHeap);
                continue;
            default:
                exitStatus;
        }
    }
    // Run LRU cleanup only when the scheduler is fully idle: no queued tasks and
    // no in-progress requests. At that point, all active prefetch tasks have
    // finished reading from the cache (moving recently used entries to the front
    // of the list), so only genuinely stale data gets evicted.
    if (task === null && inProgressRequests === 0) {
        (0, _lru.cleanup)();
    }
}
/**
 * Check this during a prefetch task to determine if background work can be
 * performed. If so, it evaluates to `true`. Otherwise, it returns `false`,
 * while also scheduling a background task to run later. Usage:
 *
 * @example
 * if (background(task)) {
 *   // Perform background-pri work
 * }
 *
 * TODO: Model "background" as a phase (like Shell / Speculative) rather
 * than as a priority. Conceptually it's the same pattern: defer work
 * until a later pass over the task. The current priority-based encoding
 * predates the phase model and could be unified.
 */ function background(task) {
    if (task.priority === _types.PrefetchPriority.Background) {
        return true;
    }
    task.hasBackgroundWork = true;
    return false;
}
function pingRoute(now, task) {
    const key = task.key;
    const route = (0, _cache.readOrCreateRouteCacheEntry)(now, task, key);
    const exitStatus = pingRootRouteTree(now, task, route);
    if (exitStatus !== 0 && key.search !== '') {
        // If the URL has a non-empty search string, also prefetch the pathname
        // without the search string. We use the searchless route tree as a base for
        // optimistic routing; see requestOptimisticRouteCacheEntry for details.
        //
        // Note that we don't need to prefetch any of the segment data. Just the
        // route tree.
        //
        // TODO: This is a temporary solution; the plan is to replace this by adding
        // a wildcard lookup method to the TupleMap implementation. This is
        // non-trivial to implement because it needs to account for things like
        // fallback route entries, hence this temporary workaround.
        const url = new URL(key.pathname, location.origin);
        const keyWithoutSearch = (0, _cachekey.createCacheKey)(url.href, key.nextUrl);
        const routeWithoutSearch = (0, _cache.readOrCreateRouteCacheEntry)(now, task, keyWithoutSearch);
        switch(routeWithoutSearch.status){
            case _cache.EntryStatus.Empty:
                {
                    if (background(task)) {
                        routeWithoutSearch.status = _cache.EntryStatus.Pending;
                        spawnPrefetchSubtask((0, _cache.fetchRouteOnCacheMiss)(routeWithoutSearch, keyWithoutSearch));
                    }
                    break;
                }
            case _cache.EntryStatus.Pending:
            case _cache.EntryStatus.Fulfilled:
            case _cache.EntryStatus.Rejected:
                {
                    break;
                }
            default:
                routeWithoutSearch;
        }
    }
    if (exitStatus === 2 && task.hasPendingResponses) {
        // The pass traversed the whole tree, but some segment responses haven't
        // arrived yet, so the current phase isn't actually complete. Block until
        // they do (see blockTaskOnPendingResponse for the full rationale).
        return 1;
    }
    return exitStatus;
}
function pingRootRouteTree(now, task, route) {
    switch(route.status){
        case _cache.EntryStatus.Empty:
            {
                // Route is not yet cached, and there's no request already in progress.
                // Spawn a task to request the route, load it into the cache, and ping
                // the task to continue.
                // TODO: There are multiple strategies in the <Link> API for prefetching
                // a route. Currently we've only implemented the main one: per-segment,
                // static-data only.
                //
                // There's also `<Link prefetch={true}>`
                // which prefetch both static *and* dynamic data.
                // Similarly, we need to fallback to the old, per-page
                // behavior if PPR is disabled for a route (via the incremental opt-in).
                //
                // Those cases will be handled here.
                spawnPrefetchSubtask((0, _cache.fetchRouteOnCacheMiss)(route, task.key));
                // If the request takes longer than a minute, a subsequent request should
                // retry instead of waiting for this one. When the response is received,
                // this value will be replaced by a new value based on the stale time sent
                // from the server.
                // TODO: We should probably also manually abort the fetch task, to reclaim
                // server bandwidth.
                route.staleAt = now + 60 * 1000;
                // Upgrade to Pending so we know there's already a request in progress
                route.status = _cache.EntryStatus.Pending;
            // Intentional fallthrough to the Pending branch
            }
        case _cache.EntryStatus.Pending:
            {
                // Still pending. We can't start prefetching the segments until the route
                // tree has loaded. Add the task to the set of blocked tasks so that it
                // is notified when the route tree is ready.
                const blockedTasks = route.blockedTasks;
                if (blockedTasks === null) {
                    route.blockedTasks = new Set([
                        task
                    ]);
                } else {
                    blockedTasks.add(task);
                }
                return 1;
            }
        case _cache.EntryStatus.Rejected:
            {
                // Route tree failed to load. Treat as a 404.
                return 2;
            }
        case _cache.EntryStatus.Fulfilled:
            {
                if (task.phase === 2) {
                    // Do not prefetch segment data during the route tree phase.
                    return 2;
                }
                // Recursively fill in the segment tree.
                if (!hasNetworkBandwidth(task)) {
                    // Stop prefetching segments until there's more bandwidth.
                    return 0;
                }
                const tree = route.root.tree;
                // A task's fetch strategy gets set to `PPR` for any "auto" prefetch.
                // If it turned out that the route isn't PPR-enabled, we need to use `LoadingBoundary` instead.
                // We don't need to do this for runtime prefetches, because those are only available in
                // `cacheComponents`, where every route is PPR.
                let fetchStrategy;
                if (tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) {
                    // If Partial Prefetching is enabled anywhere on the target route,
                    // ignore the fetch strategy and switch to unified strategy used by
                    // Cache Components (called `PPR` for now, will likely be renamed).
                    //
                    // In practice, this just means that a "full" prefetch (<Link
                    // prefetch={true}>) has no effect. You're meant to use Runtime
                    // Prefetching instead — that's the new pattern that replaces
                    // prefetch={true}.
                    //
                    // The reason we check for the Partial Prefetching opt-in rather than
                    // the `cacheComponents` flag is to support incremental adoption.
                    // `prefetch={true}` will continue to work until you opt into
                    // Partial Prefetching.
                    fetchStrategy = _types.FetchStrategy.PPR;
                } else if (task.fetchStrategy === _types.FetchStrategy.PPR) {
                    fetchStrategy = route.supportsPerSegmentPrefetching ? _types.FetchStrategy.PPR : _types.FetchStrategy.LoadingBoundary;
                } else {
                    fetchStrategy = task.fetchStrategy;
                }
                switch(fetchStrategy){
                    case _types.FetchStrategy.PPR:
                        {
                            // For Cache Components pages, each segment may be prefetched
                            // statically or using a runtime request, based on various
                            // configurations and heuristics. We'll do this in two passes: first
                            // traverse the tree and perform all the static prefetches.
                            //
                            // Then, if there are any segments that need a runtime request,
                            // do another pass to perform a runtime prefetch.
                            // Derive the static walk's parameters once per pass; the walk
                            // functions below receive them as arguments and are phase-agnostic.
                            // During the Shell phase the walk requests each segment's
                            // shell-stage variant (keyed at the shell vary paths); otherwise
                            // it's the ordinary per-segment static strategy. This is the only
                            // place the phase is consulted — everything below keys off
                            // the strategy.
                            const staticWalkStrategy = task.phase === 1 ? _types.FetchStrategy.StaticShell : _types.FetchStrategy.PPR;
                            // In PPF, links may skip speculative prefetching if they only need a shell.
                            if (staticWalkStrategy === _types.FetchStrategy.PPR && !needsSpeculativePrefetch(task.fetchStrategy, route.root.tree.prefetchHints)) {
                                return 2;
                            }
                            // The head is a one-node tree beside the route tree (see
                            // createMetadataRouteTree in cache.ts); it takes the same walk as
                            // a segment the current page doesn't have. If the head was inlined
                            // into a page's bundle (HeadOutlined is NOT set on the root), skip
                            // the standalone walk — the head data will arrive as part of that
                            // page's response, and its runtime-completeness signal is carried
                            // by that page's own entries.
                            const head = route.root.head;
                            if (!process.env.__NEXT_PREFETCH_INLINING || (route.root.tree.prefetchHints & _approutertypes.PrefetchHint.HeadOutlined) !== 0 || // An inlined head that can't attempt a static fetch still deopts
                            // to the runtime request (the first check of the decision point
                            // in pingSegmentInCacheComponentsTree); only the static fetch
                            // itself is skipped for an inlined head.
                            walkCanUseRuntimeRequests(staticWalkStrategy, route) && !shouldSegmentAttemptStaticRequest(staticWalkStrategy, head)) {
                                const headExitStatus = pingNewPartOfCacheComponentsTree(now, task, route, head, null, staticWalkStrategy);
                                if (headExitStatus === 0) {
                                    return 0;
                                }
                            }
                            const exitStatus = pingSharedPartOfCacheComponentsTree(now, task, route, task.renderTreeAtTimeOfPrefetch.tree, tree, null, staticWalkStrategy);
                            if (exitStatus === 0) {
                                // Child yielded without finishing.
                                return 0;
                            }
                            // `pingSegmentInCacheComponentsTree` may have determined that
                            // we need to do a runtime prefetch for one or more segments.
                            // Bail out early if runtime prefetches are not permitted for this route.
                            if (walkCanUseRuntimeRequests(staticWalkStrategy, route)) {
                                const runtimeStrategy = staticWalkStrategy === _types.FetchStrategy.StaticShell ? _types.FetchStrategy.RuntimeShell : _types.FetchStrategy.PPRRuntime;
                                // spawnedRuntimePrefetches was populated during the traversal
                                // above: every subtree in the new part of the tree that needs a
                                // runtime prefetch, the head included — it registers under its
                                // own request key, like any segment, when its own static attempt
                                // was insufficient or never happened.
                                //
                                // If it's null, nothing in the new part of the tree is a candidate
                                // for runtime prefetching, and we don't fetch the head, either —
                                // the head is runtime prefetched only if something is.
                                const spawnedRuntimePrefetches = task.spawnedRuntimePrefetches;
                                if (spawnedRuntimePrefetches !== null) {
                                    const spawnedEntries = new Map();
                                    // The head has no position in the request tree — a runtime
                                    // response carries it beside the segments (see
                                    // writeServerResponseIntoCache in cache.ts) — so the head's
                                    // own request tree is discarded.
                                    pingRouteTreeAndIncludeDynamicData(now, task, route, head, false, spawnedEntries, runtimeStrategy);
                                    const requestTree = pingRuntimePrefetches(now, task, route, tree, spawnedRuntimePrefetches, spawnedEntries, runtimeStrategy);
                                    if (spawnedEntries.size > 0) {
                                        spawnPrefetchSubtask((0, _cache.fetchSegmentPrefetchesUsingRuntimeRequest)(task, route, runtimeStrategy, requestTree, spawnedEntries));
                                    }
                                }
                            }
                            return 2;
                        }
                    case _types.FetchStrategy.Full:
                    case _types.FetchStrategy.PPRRuntime:
                    case _types.FetchStrategy.LoadingBoundary:
                        {
                            if (task.phase === 1) {
                                // Shell phase only does work on routes that use the PPR strategy
                                // (Cache Components routes). Other strategies are Shell no-ops
                                // and fall through to Speculative.
                                return 2;
                            }
                            // Prefetch multiple segments using a single runtime request.
                            // TODO: We can consolidate this branch with previous one by modeling
                            // it as if the first segment in the new tree has runtime prefetching
                            // enabled. Will do this as a follow-up refactor. Might want to remove
                            // the special metatdata case below first. In the meantime, it's not
                            // really that much duplication, just would be nice to remove one of
                            // these codepaths.
                            const spawnedEntries = new Map();
                            // The head has no position in the request tree — a runtime response
                            // carries it beside the segments (see writeServerResponseIntoCache
                            // in cache.ts) — so the head's own request tree is discarded.
                            const head = route.root.head;
                            pingRouteTreeAndIncludeDynamicData(now, task, route, head, false, spawnedEntries, // When prefetching the head, there's no difference between Full
                            // and LoadingBoundary: the head has no loading boundary, so a
                            // LoadingBoundary request would skip it.
                            fetchStrategy === _types.FetchStrategy.LoadingBoundary ? _types.FetchStrategy.Full : fetchStrategy);
                            const dynamicRequestTree = diffRouteTreeAgainstCurrent(now, task, route, task.renderTreeAtTimeOfPrefetch.tree, tree, spawnedEntries, fetchStrategy);
                            let needsDynamicRequest = spawnedEntries.size > 0;
                            if (needsDynamicRequest) {
                                spawnPrefetchSubtask((0, _cache.fetchSegmentPrefetchesUsingRuntimeRequest)(task, route, fetchStrategy, dynamicRequestTree, spawnedEntries));
                            }
                            return 2;
                        }
                    default:
                        fetchStrategy;
                }
                break;
            }
        default:
            {
                route;
            }
    }
    return 2;
}
/**
 * Whether the task can use runtime requests to prefetch the content.
 *
 * This is true for every walk of a route that opts into Partial Prefetching
 * (any segment with a partial-prefetching config, or the global `partialPrefetching`
 * flag, indicated by `SubtreeHasPartialPrefetching` on the route root),
 * in both the Shell and Speculative phases.
 *
 * Note that this does not mean that the route *will* use runtime requests --
 * it might be optimized statically, either because it does not use runtime data
 * in the shell/prefetch, or if it's forced to use static requests by
 * `export const ensureStatic = "shell" | "prefetch" | "navigation"`.
 *
 * Routes without Partial Prefetching never use runtime requests for prefetches
 * (excluding `Full` prefetches)
 */ function walkCanUseRuntimeRequests(staticWalkStrategy, route) {
    if (staticWalkStrategy === _types.FetchStrategy.StaticShell) {
        // `FetchStrategy.StaticShell` is only used on PPF routes.
        return true;
    }
    // `FetchStrategy.PPR` can only use runtime requests if PPF is enabled on the route.
    return (route.root.tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0;
}
/**
 * Whether a static request for this segment should be attempted.
 * This may vary on the static walk's strategy, because we might e.g.
 * have a shell that's static, but a prefetch that requires runtime requests.
 *
 * NOTE: Should only be used on Partial Prefetching routes, where
 * `walkCanUseRuntimeRequests` is true.
 * */ function shouldSegmentAttemptStaticRequest(staticWalkStrategy, tree) {
    const { prefetchHints } = tree;
    switch(staticWalkStrategy){
        case _types.FetchStrategy.StaticShell:
            return (prefetchHints & _approutertypes.PrefetchHint.ShouldAttemptStaticShell) !== 0;
        case _types.FetchStrategy.PPR:
            return (prefetchHints & _approutertypes.PrefetchHint.ShouldAttemptStaticPrefetch) !== 0;
        default:
            staticWalkStrategy;
            return false;
    }
}
/**
 * The runtime counterpart of a pass's static walk strategy: the strategy the
 * batched runtime request uses if this walk deopts. Each phase has exactly one
 * — the Shell phase escalates to a shell-scoped runtime request
 * (RuntimeShell), the Speculative phase to a per-link concrete
 * runtime prefetch.
 */ function getRuntimeStrategyForWalk(staticWalkStrategy) {
    return staticWalkStrategy === _types.FetchStrategy.StaticShell ? _types.FetchStrategy.RuntimeShell : _types.FetchStrategy.PPRRuntime;
}
/**
 * Whether this phase's runtime request would return more content for a
 * fulfilled entry than the entry already holds.
 *
 * An entry records the tier its CONTENT achieved, not the one it was requested
 * at, and that tier spans both axes — so a static response that needed no
 * runtime data records the runtime counterpart of its own variant (see
 * `recordedFetchStrategy` in cache.ts). That makes this a pure tier
 * comparison: an entry at or above the phase's runtime tier has nothing to
 * gain from it.
 */ function wouldRuntimeRequestProvideMore(entry, staticWalkStrategy) {
    return (0, _cache.canNewFetchStrategyProvideMoreContent)(entry.fetchStrategy, getRuntimeStrategyForWalk(staticWalkStrategy));
}
/**
 * Whether a fulfilled shell-tier entry should take a static attempt (a
 * spawned revalidation at the walk's static tier) before its position deopts
 * to a runtime request. A shell-tier recorded entry (StaticShell or
 * RuntimeShell) is not evidence that a static attempt would be pointless —
 * unlike a concrete static (PPR) entry, where a static re-fetch would return
 * the same bytes — so when the segment's hint says a static attempt is
 * worthwhile (the build-time prerender accessed no runtime data), the
 * attempt is taken and its response's own verdict decides whether to
 * escalate afterward.
 *
 * Consults the revalidation slot so an attempt that already ran and settled
 * without healing the entry (a rejected attempt: server miss or network
 * error; a successful one upserts over the shell-tier entry, so the caller
 * reads the healed entry instead) doesn't suppress the runtime deopt
 * forever. The slot read creates an Empty placeholder on first evaluation —
 * there is no read-only variant — which is harmless: when the entry is
 * eligible, the spawn that follows claims the same slot.
 */ function isShellEntryEligibleForStaticAttempt(now, map, entry, tree, fetchStrategy) {
    if (!((entry.fetchStrategy === _types.FetchStrategy.StaticShell || entry.fetchStrategy === _types.FetchStrategy.RuntimeShell) && shouldSegmentAttemptStaticRequest(fetchStrategy, tree) && // if the `fetchStrategy` is `FetchStrategy.PPR`, it might provide more content
    // (e.g. static params that this shell doesn't have)
    (0, _cache.canNewFetchStrategyProvideMoreContent)(entry.fetchStrategy, fetchStrategy))) {
        return false;
    }
    const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, map, fetchStrategy, tree);
    return revalidatingEntry.status === _cache.EntryStatus.Empty || revalidatingEntry.status === _cache.EntryStatus.Pending;
}
/**
 * Register a subtree root (the head is one, under its own request key) for
 * the batched runtime request issued by the gate at the end of
 * pingRootRouteTree.
 */ function addSpawnedRuntimePrefetch(task, requestKey) {
    if (task.spawnedRuntimePrefetches === null) {
        task.spawnedRuntimePrefetches = new Set([
            requestKey
        ]);
    } else {
        task.spawnedRuntimePrefetches.add(requestKey);
    }
}
// TODO: Rename dynamic -> runtime throughout this module
/**
 * The static walk over the part of the target route that also exists on the
 * current page: the current page's node and the target route's node at the
 * same position in the tree. It mirrors the navigation's traversal order (see
 * updateRenderTreeOnNavigation in render-tree.ts): first whether the route
 * position still matches — if not, this node begins the new part of the route
 * (pingNewPartOfCacheComponentsTree) — and then whether any of the node's
 * param values changed — if so, the node and everything below it begin the
 * new part of the route too. The walk does not consult which params a
 * segment read, so it prefetches more than the navigation replaces: the
 * navigation keeps data whose read params did not change and decides each
 * descendant on its own. A node the walk keeps is prefetched at the ordinary
 * static tier.
 * Its children continue here wherever the current page has a child in the
 * same slot; a child in a slot the current page doesn't have enters the new
 * part of the route directly.
 *
 * Bundle chains must not cross the strategy boundary: a kept node walks at
 * PPR while a Shell-phase new part walks at StaticShell, and a chain spanning
 * both would fulfill the kept node's concrete-path entry with shell-variant
 * data. Nor may the chain be finished by fetching the new-part node at PPR
 * — that would prefetch new-part segments at the concrete tier during the
 * Shell phase, which only the Speculative phase is allowed to do. So the
 * chain is dropped wherever the walk hands off to the new part during a
 * StaticShell walk, exactly like the drop sites in
 * pingSegmentInCacheComponentsTree: nothing in a dropped chain was upgraded
 * to Pending, so no entry is stranded, and the inlined kept data is fetched
 * by the Speculative pass whenever its walk of the new part permits the
 * child fetch.
 */ function pingSharedPartOfCacheComponentsTree(now, task, route, currentTree, newTree, parentBundle, // The per-pass static walk strategy; see pingRootRouteTree where
// it's derived.
fetchStrategy) {
    if (!(0, _cache.doesRouteStructureMatch)(currentTree, newTree)) {
        // We're entering the part of the target route that doesn't exist on the
        // current page.
        return pingNewPartOfCacheComponentsTree(now, task, route, newTree, fetchStrategy === _types.FetchStrategy.StaticShell ? null : parentBundle, fetchStrategy);
    }
    if ((0, _varypath.compareParams)(currentTree.varyPath, newTree.varyPath) !== _varypath.ParamsChange.None) {
        // A param changed. The navigation replaces only the data that read it and
        // decides each descendant on its own (see updateRenderTreeOnNavigation in
        // render-tree.ts); this walk doesn't know what each segment read, so it
        // prefetches the whole subtree.
        return pingNewPartOfCacheComponentsTree(now, task, route, newTree, fetchStrategy === _types.FetchStrategy.StaticShell ? null : parentBundle, fetchStrategy);
    }
    // The navigation keeps this segment's current data. A kept segment always
    // performs the ordinary static (PPR) prefetch, regardless of phase.
    // Phase-specific strategies — the runtime shell request and the Shell
    // phase's StaticShell walk — apply only to the new part of the tree, so the
    // per-pass walk strategy is irrelevant here. (The needs-runtime signal is
    // ignored: kept segments are already rendered on the current page, so a
    // runtime prefetch has nothing to add.)
    const bundleInProgress = accumulateSegmentBundle(now, task, route, newTree, parentBundle, _types.FetchStrategy.PPR, true).bundle;
    // Recursively ping the children, continuing in lockstep with the current
    // page wherever it has a child in the same slot.
    const newTreeChildren = newTree.slots;
    if (newTreeChildren !== null) {
        const currentSlots = currentTree.slots;
        for (const [parallelRouteKey, newTreeChild] of newTreeChildren){
            if (!hasNetworkBandwidth(task)) {
                // Stop prefetching segments until there's more bandwidth.
                return 0;
            }
            // Only pass the bundle to the child that accepts it. A parent is
            // only ever bundled into one child.
            const bundleForChild = process.env.__NEXT_PREFETCH_INLINING && bundleInProgress !== null && newTreeChild.prefetchHints & _approutertypes.PrefetchHint.ParentInlinedIntoSelf ? bundleInProgress : null;
            let currentTreeChild = undefined;
            if (currentSlots !== null) {
                currentTreeChild = currentSlots.get(parallelRouteKey);
            }
            let childExitStatus;
            if (currentTreeChild !== undefined) {
                childExitStatus = pingSharedPartOfCacheComponentsTree(now, task, route, currentTreeChild, newTreeChild, bundleForChild, fetchStrategy);
            } else {
                childExitStatus = pingNewPartOfCacheComponentsTree(now, task, route, newTreeChild, fetchStrategy === _types.FetchStrategy.StaticShell ? null : bundleForChild, fetchStrategy);
            }
            if (childExitStatus === 0) {
                // Child yielded without finishing.
                return 0;
            }
        }
    }
    // The static attempt was sufficient for this segment (each child is its
    // own decision point) — or parts of it are still in flight, in which case
    // the task is blocked and the decision re-runs against the received
    // responses.
    return 2;
}
/**
 * The static walk over the part of the target route that doesn't exist on
 * the current page. Nothing here is compared against the current tree: every
 * segment goes through the per-segment decision point.
 */ function pingNewPartOfCacheComponentsTree(now, task, route, tree, parentBundle, // The per-pass static walk strategy; see pingRootRouteTree where
// it's derived.
fetchStrategy) {
    const accumulation = pingSegmentInCacheComponentsTree(now, task, route, tree, parentBundle, fetchStrategy);
    if (accumulation === null) {
        return 2;
    }
    const bundleInProgress = accumulation.bundle;
    // Recursively ping the children.
    const treeChildren = tree.slots;
    if (treeChildren !== null) {
        for (const treeChild of treeChildren.values()){
            if (!hasNetworkBandwidth(task)) {
                // Stop prefetching segments until there's more bandwidth.
                return 0;
            }
            // Only pass the bundle to the child that accepts it. A parent is
            // only ever bundled into one child.
            const bundleForChild = process.env.__NEXT_PREFETCH_INLINING && bundleInProgress !== null && treeChild.prefetchHints & _approutertypes.PrefetchHint.ParentInlinedIntoSelf ? bundleInProgress : null;
            const childExitStatus = pingNewPartOfCacheComponentsTree(now, task, route, treeChild, bundleForChild, fetchStrategy);
            if (childExitStatus === 0) {
                // Child yielded without finishing.
                return 0;
            }
        }
    }
    // The static attempt was sufficient for this segment (each child is its
    // own decision point) — or parts of it are still in flight, in which case
    // the task is blocked and the decision re-runs against the received
    // responses.
    return 2;
}
/**
 * The per-segment decision point of the static walk: the one place that
 * decides how a segment in the new part of the route — one the navigation
 * won't keep — is prefetched (pingNewPartOfCacheComponentsTree).
 *
 * When Cache Components is enabled (or PPR, or a fully static route when PPR
 * is disabled; those cases are treated equivalently to Cache Components), we
 * prefetch each segment individually, statically, at the per-pass strategy
 * derived in pingRootRouteTree.
 *
 * This is where we decide whether we should use runtime requests, if the walk
 * is allowed to do so (see `walkCanUseRuntimeRequests`).
 *
 * If runtime requests are allowed, but the segment's node has one of the
 * `ShouldAttemptStatic{Shell,Prefetch}` hints set (either because the build-time
 * prerender accessed no runtime data, or because of `ensureStatic`), then its
 * subtree should be prefetched statically first.
 * However, the hint may be stale after a revalidation, so we'll also check the
 * `needsRuntimeRequest` promise on the static response, and will follow up with
 * a runtime request if needed.
 * Pending responses block the task, so the attempt is serial, never raced:
 * static attempt → observe → runtime (if needed).
 *
 * The static hints and `needsRuntimeRequest` have no effect if runtime requests
 * are not allowed (i.e. outside of Partial Prefetching).
 *
 * Returns the segment's bundle accumulation when the walk should continue
 * into its children, and null when the walk stops at this segment: the link
 * needs no speculative prefetch, or the segment deopted and the batched
 * runtime request covers the whole subtree.
 */ function pingSegmentInCacheComponentsTree(now, task, route, tree, parentBundle, // The per-pass static walk strategy; see pingRootRouteTree where
// it's derived.
fetchStrategy) {
    // In PPF, links may skip speculative prefetching if they only need a shell.
    if (fetchStrategy === _types.FetchStrategy.PPR && !needsSpeculativePrefetch(task.fetchStrategy, route.root.tree.prefetchHints)) {
        return null;
    }
    // Constant for the whole pass; recomputed here only because the walk is
    // recursive and the check is cheap.
    const canUseRuntimeRequests = walkCanUseRuntimeRequests(fetchStrategy, route);
    // A force-disabled segment deliberately does NOT deopt here: disabling
    // prefetch is passive. It never initiates a request — its accumulation
    // below contributes nothing — and must never be the reason a runtime
    // prefetch spawns, though it may ride along in a runtime response issued
    // on another segment's behalf.
    if (canUseRuntimeRequests && !shouldSegmentAttemptStaticRequest(fetchStrategy, tree)) {
        // Deopt directly to a runtime prefetch, without a static attempt.
        addSpawnedRuntimePrefetch(task, tree.requestKey);
        // If there's a pending static bundle from a parent, we need to finish
        // prefetching it before bailing out to runtime prefetching.
        if (parentBundle !== null) {
            finishStaticBundleOnRuntimeBailout(now, task, route, tree, parentBundle, fetchStrategy);
        }
        return null;
    }
    // Prefetch this segment and its subtree statically, using the normal
    // static bundling walk.
    const accumulation = accumulateSegmentBundle(now, task, route, tree, parentBundle, fetchStrategy, true);
    if (canUseRuntimeRequests && accumulation.needsRuntimeRequest) {
        // The static attempt for this segment was insufficient. Stop the walk
        // and deopt — the runtime prefetch covers the whole subtree. (Unlike the
        // direct deopt above, any open bundle is dropped rather than finished: a
        // fulfilled InlinedIntoChild node can report a true signal while its
        // chain is still open. That's safe — nothing in an un-pinged chain was
        // upgraded to Pending, so no entry is stranded blocking the task, and
        // Empty entries in the dropped chain are re-fetched by a later pass.)
        addSpawnedRuntimePrefetch(task, tree.requestKey);
        return null;
    }
    return accumulation;
}
function diffRouteTreeAgainstCurrent(now, task, route, oldTree, newTree, spawnedEntries, fetchStrategy) {
    // This is a single recursive traversal that does multiple things:
    // - Finds the segments that differ from the current route, comparing each
    //   segment the same way the navigation will (see
    //   updateRenderTreeOnNavigation in render-tree.ts): its route position,
    //   then whether any of its param values changed.
    // - Constructs a request tree (FlightRouterState) that describes which
    //   segments need to be prefetched and which ones are already cached.
    // - Creates a set of pending cache entries for the segments that need to
    //   be prefetched, so that a subsequent prefetch task does not request the
    //   same segments again.
    const oldSlots = oldTree.slots;
    const newTreeChildren = newTree.slots;
    let requestTreeChildren = {};
    if (newTreeChildren !== null) {
        for (const [parallelRouteKey, newTreeChild] of newTreeChildren){
            const oldTreeChild = oldSlots?.get(parallelRouteKey);
            requestTreeChildren[parallelRouteKey] = diffSegmentAgainstCurrent(now, task, route, oldTreeChild, newTreeChild, spawnedEntries, fetchStrategy);
        }
    }
    const requestTree = [
        newTree.segment,
        requestTreeChildren,
        null,
        null
    ];
    if (newTree.prefetchHints !== 0) {
        requestTree[4] = newTree.prefetchHints;
    }
    return requestTree;
}
/**
 * The per-segment decision of a runtime request's tree walk
 * (diffRouteTreeAgainstCurrent): the segment at this position of the target
 * route, and the current page's segment at the same position, if it has one.
 * A segment the navigation keeps — same route position, and none of its param
 * values changed — is omitted from the request and the walk continues into
 * its children. Otherwise this segment begins a part of the tree that needs
 * to be prefetched (unless everything is already cached), requested according
 * to the strategy.
 */ function diffSegmentAgainstCurrent(now, task, route, oldTree, newTree, spawnedEntries, fetchStrategy) {
    if (oldTree !== undefined && (0, _cache.doesRouteStructureMatch)(oldTree, newTree)) {
        // This segment is already part of the current route.
        if ((0, _varypath.compareParams)(oldTree.varyPath, newTree.varyPath) === _varypath.ParamsChange.None) {
            // The navigation keeps its data. Keep traversing.
            return diffRouteTreeAgainstCurrent(now, task, route, oldTree, newTree, spawnedEntries, fetchStrategy);
        }
    }
    // This segment is not part of the current route, or the navigation
    // replaces its data. We're entering a part of the tree that we need to
    // prefetch (unless everything is already cached).
    switch(fetchStrategy){
        case _types.FetchStrategy.LoadingBoundary:
            {
                // When PPR is disabled, we can't prefetch per segment. We must
                // fallback to the old prefetch behavior and send a runtime request.
                // Only routes that include a loading boundary can be prefetched in
                // this way.
                //
                // This is simlar to a "full" prefetch, but we're much more
                // conservative about which segments to include in the request.
                //
                // The server will only render up to the first loading boundary
                // inside new part of the tree. If there's no loading boundary
                // anywhere in the tree, the server will never return any data, so
                // we can skip the request.
                const subtreeHasLoadingBoundary = (newTree.prefetchHints & (_approutertypes.PrefetchHint.SegmentHasLoadingBoundary | _approutertypes.PrefetchHint.SubtreeHasLoadingBoundary)) !== 0;
                if (subtreeHasLoadingBoundary) {
                    return pingPPRDisabledRouteTreeUpToLoadingBoundary(now, task, route, newTree, null, spawnedEntries);
                }
                // There's no loading boundary within this tree. Bail out.
                return (0, _cache.convertRouteTreeToFlightRouterState)(newTree);
            }
        case _types.FetchStrategy.PPRRuntime:
            {
                // This is a runtime prefetch. Fetch all cacheable data in the tree,
                // not just the static PPR shell.
                return pingRouteTreeAndIncludeDynamicData(now, task, route, newTree, false, spawnedEntries, fetchStrategy);
            }
        case _types.FetchStrategy.Full:
            {
                // This is a "full" prefetch. Fetch all the data in the tree, both
                // static and dynamic. We issue roughly the same request that we
                // would during a real navigation. The goal is that once the
                // navigation occurs, the router should not have to fetch any
                // additional data.
                //
                // Although the response will include dynamic data, opting into a
                // Full prefetch — via <Link prefetch={true}> — implicitly
                // instructs the cache to treat the response as "static", or non-
                // dynamic, since the whole point is to cache it for
                // future navigations.
                //
                // Construct a tree (currently a FlightRouterState) that represents
                // which segments need to be prefetched and which ones are already
                // cached. If the tree is empty, then we can exit. Otherwise, we'll
                // send the request tree to the server and use the response to
                // populate the segment cache.
                return pingRouteTreeAndIncludeDynamicData(now, task, route, newTree, false, spawnedEntries, fetchStrategy);
            }
    }
}
function pingPPRDisabledRouteTreeUpToLoadingBoundary(now, task, route, tree, refetchMarkerContext, spawnedEntries) {
    // This function is similar to pingRouteTreeAndIncludeDynamicData, except the
    // server is only going to return a minimal loading state — it will stop
    // rendering at the first loading boundary. Whereas a Full prefetch is
    // intentionally aggressive and tries to pretfetch all the data that will be
    // needed for a navigation, a LoadingBoundary prefetch is much more
    // conservative. For example, it will omit from the request tree any segment
    // that is already cached, regardles of whether it's partial or full. By
    // contrast, a Full prefetch will refetch partial segments.
    // "inside-shared-layout" tells the server where to start looking for a
    // loading boundary.
    let refetchMarker = refetchMarkerContext === null ? 'inside-shared-layout' : null;
    const segment = (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, task.fetchStrategy, tree);
    switch(segment.status){
        case _cache.EntryStatus.Empty:
            {
                // This segment is not cached. Add a refetch marker so the server knows
                // to start rendering here.
                // TODO: Instead of a "refetch" marker, we could just omit this subtree's
                // FlightRouterState from the request tree. I think this would probably
                // already work even without any updates to the server. For consistency,
                // though, I'll send the full tree and we'll look into this later as part
                // of a larger redesign of the request protocol.
                // Add the pending cache entry to the result map.
                const pendingSegment = (0, _cache.upgradeToPendingSegment)(segment, // Set the fetch strategy to LoadingBoundary to indicate that the server
                // might not include it in the pending response. If another route is able
                // to issue a per-segment request, we'll do that in the background.
                _types.FetchStrategy.LoadingBoundary);
                spawnedEntries.set(tree.requestKey, pendingSegment);
                // The pass blocks on every request it spawns, not just requests it
                // finds already in flight.
                blockTaskOnPendingResponse(task, pendingSegment);
                if (refetchMarkerContext !== 'refetch') {
                    refetchMarker = refetchMarkerContext = 'refetch';
                } else {
                // There's already a parent with a refetch marker, so we don't need
                // to add another one.
                }
                break;
            }
        case _cache.EntryStatus.Fulfilled:
            {
                // The segment is already cached.
                const segmentHasLoadingBoundary = (tree.prefetchHints & _approutertypes.PrefetchHint.SegmentHasLoadingBoundary) !== 0;
                if (segmentHasLoadingBoundary) {
                    // This segment has a loading boundary, which means the server won't
                    // render its children. So there's nothing left to prefetch along this
                    // path. We can bail out.
                    return (0, _cache.convertRouteTreeToFlightRouterState)(tree);
                }
                break;
            }
        case _cache.EntryStatus.Pending:
            {
                // There's another prefetch currently in progress. Don't add the refetch
                // marker yet, so the server knows it can skip rendering this segment.
                // The pass still depends on the in-flight response, so wait for it
                // before the phase can complete.
                blockTaskOnPendingResponse(task, segment);
                break;
            }
        case _cache.EntryStatus.Rejected:
            {
                break;
            }
        default:
            segment;
    }
    const requestTreeChildren = {};
    if (tree.slots !== null) {
        for (const [parallelRouteKey, childTree] of tree.slots){
            requestTreeChildren[parallelRouteKey] = pingPPRDisabledRouteTreeUpToLoadingBoundary(now, task, route, childTree, refetchMarkerContext, spawnedEntries);
        }
    }
    const requestTree = [
        tree.segment,
        requestTreeChildren,
        null,
        refetchMarker
    ];
    if (tree.prefetchHints !== 0) {
        requestTree[4] = tree.prefetchHints;
    }
    return requestTree;
}
/**
 * Called during a pass when a segment's response hasn't been received yet —
 * whether the request was just spawned by this pass or was already in flight.
 * Marks the task as blocked: a phase only completes once a full pass observes
 * every segment response it cares about, because later decisions (like
 * whether a segment needs a follow-up runtime request) are made against the
 * contents of those responses, and a phase may need to restart its work based
 * on what they contain. The task is re-pinged (via pingBlockedTasks in
 * cache.ts) when the entry resolves, re-running the pass against the
 * received data. Only a pass that observes every response may advance the
 * phase or complete the task.
 *
 * Never call this for an entry that's already Rejected — nothing ever pings
 * a Rejected entry, so registering on one would strand the task. A rejected
 * segment is simply skipped: the pass keeps prefetching the rest of the tree
 * without it.
 */ function blockTaskOnPendingResponse(task, segment) {
    // This state is reset after each iteration of the task queue. We use it to
    // inform the scheduler that the task is blocked.
    task.hasPendingResponses = true;
    // Add the task to this segment's blocked tasks, so it can be rescheduled
    // once the segment finishes loading.
    if (segment.blockedTasks === null) {
        segment.blockedTasks = new Set([
            task
        ]);
    } else {
        segment.blockedTasks.add(task);
    }
}
function pingRouteTreeAndIncludeDynamicData(now, task, route, tree, isInsideRefetchingParent, spawnedEntries, fetchStrategy) {
    // The tree we're constructing is the same shape as the tree we're navigating
    // to. But even though this is a "new" tree, some of the individual segments
    // may be cached as a result of other route prefetches.
    //
    // So we need to find the first uncached segment along each path add an
    // explicit "refetch" marker so the server knows where to start rendering.
    // Once the server starts rendering along a path, it keeps rendering the
    // entire subtree.
    const segment = (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, // Note that `fetchStrategy` might be different from `task.fetchStrategy`,
    // and we have to use the former here.
    // We can have a task with `FetchStrategy.PPR` where some of its segments are configured to
    // always use runtime prefetching (via `export const prefetch`), and those should check for
    // entries that include search params.
    fetchStrategy, tree);
    let spawnedSegment = null;
    switch(segment.status){
        case _cache.EntryStatus.Empty:
            {
                // This segment is not cached.
                if (fetchStrategy === _types.FetchStrategy.Full) {
                    // Check if there's a matching entry in the bfcache. If so, fulfill the
                    // segment using the bfcache entry instead of issuing a new request.
                    const fulfilled = (0, _cache.attemptToFulfillDynamicSegmentFromBFCache)(now, segment, tree);
                    if (fulfilled !== null) {
                        break;
                    }
                }
                // Include it in the request.
                spawnedSegment = (0, _cache.upgradeToPendingSegment)(segment, fetchStrategy);
                break;
            }
        case _cache.EntryStatus.Fulfilled:
            {
                // The segment is already cached.
                if (segment.isPartial && (0, _cache.canNewFetchStrategyProvideMoreContent)(segment.fetchStrategy, fetchStrategy)) {
                    // The cached segment contains dynamic holes, and was prefetched using a
                    // less specific strategy than the current one. This means we're in one
                    // of these cases:
                    //   - we have a static prefetch, and we're doing a runtime prefetch
                    //   - we have a static or runtime prefetch, and we're doing a Full
                    //     prefetch (or a navigation).
                    // In either case, we need to include it in the request to get a more
                    // specific (or full) version. However, if there's a non-stale bfcache
                    // entry from a previous navigation, prefer that over making a new
                    // request.
                    if (fetchStrategy === _types.FetchStrategy.Full) {
                        const fulfilled = (0, _cache.attemptToUpgradeSegmentFromBFCache)(now, task.segmentCacheMap, tree);
                        if (fulfilled !== null) {
                            break;
                        }
                    }
                    spawnedSegment = pingFullSegmentRevalidation(now, task, tree, fetchStrategy);
                }
                break;
            }
        case _cache.EntryStatus.Pending:
        case _cache.EntryStatus.Rejected:
            {
                // There's either another prefetch currently in progress, or the previous
                // attempt failed. If the new strategy can provide more content, fetch it again.
                if ((0, _cache.canNewFetchStrategyProvideMoreContent)(segment.fetchStrategy, fetchStrategy)) {
                    spawnedSegment = pingFullSegmentRevalidation(now, task, tree, fetchStrategy);
                }
                if (segment.status === _cache.EntryStatus.Pending) {
                    // A response for this segment is still in flight. The pass must
                    // observe it before the phase can complete.
                    blockTaskOnPendingResponse(task, segment);
                } else {
                // The segment failed to load, or the server intentionally omitted it
                // from a response (both are encoded as Rejected). Skip it and keep
                // prefetching the rest of the tree; the entry's staleAt governs when
                // it may be retried. Don't register the task on the rejected entry —
                // nothing ever pings a Rejected entry.
                //
                // TODO: The cache encodes real failures and intentional server
                // omissions identically (both Rejected); with per-segment skipping
                // this has no task-lifecycle consequence, but distinguishing them
                // could still be useful someday.
                }
                break;
            }
        default:
            segment;
    }
    if (spawnedSegment !== null) {
        // A pass must observe the response for every request it spawns before
        // its phase can complete — not just requests it finds already in flight.
        // Block on the entry we just spawned; the task is re-pinged when it's
        // fulfilled or rejected.
        blockTaskOnPendingResponse(task, spawnedSegment);
    }
    const requestTreeChildren = {};
    if (tree.slots !== null) {
        for (const [parallelRouteKey, childTree] of tree.slots){
            requestTreeChildren[parallelRouteKey] = pingRouteTreeAndIncludeDynamicData(now, task, route, childTree, isInsideRefetchingParent || spawnedSegment !== null, spawnedEntries, fetchStrategy);
        }
    }
    if (spawnedSegment !== null) {
        // Add the pending entry to the result map.
        spawnedEntries.set(tree.requestKey, spawnedSegment);
    }
    // Don't bother to add a refetch marker if one is already present in a parent.
    const refetchMarker = !isInsideRefetchingParent && spawnedSegment !== null ? 'refetch' : null;
    const requestTree = [
        tree.segment,
        requestTreeChildren,
        null,
        refetchMarker
    ];
    if (tree.prefetchHints !== 0) {
        requestTree[4] = tree.prefetchHints;
    }
    return requestTree;
}
function pingRuntimePrefetches(now, task, route, tree, spawnedRuntimePrefetches, spawnedEntries, fetchStrategy) {
    // Construct a request tree (FlightRouterState) for a runtime prefetch. If
    // a segment is part of the runtime prefetch, the tree is constructed by
    // diffing against what's already in the prefetch cache. Otherwise, we send
    // a regular FlightRouterState with no special markers.
    //
    // See pingRouteTreeAndIncludeDynamicData for details.
    if (spawnedRuntimePrefetches.has(tree.requestKey)) {
        // This segment needs a runtime prefetch.
        return pingRouteTreeAndIncludeDynamicData(now, task, route, tree, false, spawnedEntries, fetchStrategy);
    }
    let requestTreeChildren = {};
    const slots = tree.slots;
    if (slots !== null) {
        for (const [parallelRouteKey, childTree] of slots){
            requestTreeChildren[parallelRouteKey] = pingRuntimePrefetches(now, task, route, childTree, spawnedRuntimePrefetches, spawnedEntries, fetchStrategy);
        }
    }
    // This segment is not part of the runtime prefetch. Clone the base tree.
    const requestTree = [
        tree.segment,
        requestTreeChildren,
        null,
        null
    ];
    if (tree.prefetchHints !== 0) {
        requestTree[4] = tree.prefetchHints;
    }
    return requestTree;
}
/**
 * Walk a SegmentBundle, apply status-based logic to each entry, and if any
 * entries need data, spawn a single fetch request for the whole bundle.
 *
 * Returns true if a fulfilled entry in the bundle reported that a runtime
 * request would return more content than the entry contains
 * (needsRuntimeRequest, derived at write time from the response that
 * produced the entry). The callers surface this signal to the per-segment
 * decision point in pingSegmentInCacheComponentsTree, which uses it during
 * a static attempt to decide whether to fall back to a runtime prefetch. One
 * exception withholds the signal: a shell-tier entry whose segment carries
 * the static-attempt hint spawns a concrete static attempt first — see the
 * Fulfilled case.
 */ function pingSegmentBundle(now, task, route, routeKey, tree, segments, // Per-pass static walk strategy; see pingRootRouteTree where it's derived.
fetchStrategy, // False when finishing an open bundle chain on a runtime-prefetch bailout
// (finishStaticBundleOnRuntimeBailout). The finish exists only to fetch
// data the batched runtime request won't cover — Empty entries in the
// chain — so it must not spawn revalidations over entries that are
// already settled or in flight: the chain's terminal segments are inside
// the deopted subtree, and re-fetching their static bundle would at best
// duplicate the runtime request and at worst replace a runtime-complete
// entry (e.g. a RuntimeShell-tier entry) with a less complete static
// fallback response.
spawnRevalidations) {
    let needsRuntimeRequest = false;
    // The pending entries this task owns — Empty entries upgraded here, plus
    // any revalidations spawned here — keyed by segment request key. If any
    // accumulate, a single fetch is spawned for the whole bundle, and the
    // response fulfills them.
    let spawnedEntries = null;
    let node = segments;
    while(node !== null){
        const nodeEntry = node.entry;
        const nodeTree = node.tree;
        if (nodeEntry === null || nodeTree === null) {
            node = node.parent;
            continue;
        }
        switch(nodeEntry.status){
            case _cache.EntryStatus.Empty:
                {
                    const pendingEntry = (0, _cache.upgradeToPendingSegment)(nodeEntry, fetchStrategy);
                    if (spawnedEntries === null) {
                        spawnedEntries = new Map();
                    }
                    spawnedEntries.set(nodeTree.requestKey, pendingEntry);
                    // The pass blocks on every request it spawns, not just requests it
                    // finds already in flight.
                    blockTaskOnPendingResponse(task, pendingEntry);
                    break;
                }
            case _cache.EntryStatus.Pending:
                if (spawnRevalidations && // During a static shell attempt, never spawn revalidations — just
                // wait for the in-flight response (blocked below); its sufficiency
                // is checked on the re-run pass.
                fetchStrategy === _types.FetchStrategy.PPR && (0, _cache.canNewFetchStrategyProvideMoreContent)(nodeEntry.fetchStrategy, fetchStrategy)) {
                    const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, nodeTree);
                    if (revalidatingEntry.status === _cache.EntryStatus.Empty) {
                        const pendingEntry = (0, _cache.upgradeToPendingSegment)(revalidatingEntry, fetchStrategy);
                        if (spawnedEntries === null) {
                            spawnedEntries = new Map();
                        }
                        spawnedEntries.set(nodeTree.requestKey, pendingEntry);
                        // Block on the revalidation request we just spawned, in
                        // addition to the original in-flight entry (blocked below).
                        blockTaskOnPendingResponse(task, pendingEntry);
                    }
                }
                blockTaskOnPendingResponse(task, nodeEntry);
                break;
            case _cache.EntryStatus.Rejected:
                if (spawnRevalidations && // During a static shell attempt, a rejected entry is skipped
                // outright: no retry revalidation, and — deliberately — no runtime
                // fallback either (per-segment rejection semantics; the entry's
                // staleAt governs when it may be retried). Note that the cache
                // path encodes "no shell exists" (a static response whose shell
                // byte offset is 0, i.e. the page wasn't produced by staged
                // rendering) as a rejection too, so such segments get no shell
                // prefetch at all — an edge that shouldn't occur for hint-set
                // Cache Components routes.
                fetchStrategy === _types.FetchStrategy.PPR && (0, _cache.canNewFetchStrategyProvideMoreContent)(nodeEntry.fetchStrategy, fetchStrategy)) {
                    const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, nodeTree);
                    if (revalidatingEntry.status === _cache.EntryStatus.Empty) {
                        const pendingEntry = (0, _cache.upgradeToPendingSegment)(revalidatingEntry, fetchStrategy);
                        if (spawnedEntries === null) {
                            spawnedEntries = new Map();
                        }
                        spawnedEntries.set(nodeTree.requestKey, pendingEntry);
                        // Block on the retry revalidation we just spawned, like any
                        // other pending response. If the retry succeeds, its upsert
                        // evicts the rejected entry (see evictShadowingSegmentEntries
                        // in cache.ts) and the re-run pass reads the healed data. If it
                        // rejects too, the re-run observes a settled revalidation and
                        // moves on.
                        blockTaskOnPendingResponse(task, pendingEntry);
                    }
                }
                break;
            case _cache.EntryStatus.Fulfilled:
                {
                    let willBeSupersededByRuntimeRequest = false;
                    if (walkCanUseRuntimeRequests(fetchStrategy, route)) {
                        const runtimeWouldProvideMore = wouldRuntimeRequestProvideMore(nodeEntry, fetchStrategy);
                        // An eligible shell-tier entry takes the static attempt path below
                        // (the revalidation) instead of deopting straight to a runtime
                        // request; see isShellEntryEligibleForStaticAttempt. The attempt
                        // can't recur: its response records at least the concrete static
                        // tier, which fails the shell-tier check on the re-run pass — and an
                        // attempt that already settled without healing the entry reads as
                        // ineligible, so the deopt proceeds after all.
                        const shellEntryEligibleForStaticAttempt = isShellEntryEligibleForStaticAttempt(now, task.segmentCacheMap, nodeEntry, nodeTree, fetchStrategy);
                        if (runtimeWouldProvideMore && !shellEntryEligibleForStaticAttempt) {
                            // A runtime request would return more content for this segment
                            // than the entry contains. Surface it via the return value, so the
                            // caller can deopt this subtree to a runtime prefetch. (An
                            // eligible shell-tier entry withholds the signal for this pass:
                            // the static attempt spawned below blocks the task, and the re-run
                            // pass reads the attempt's result instead.)
                            needsRuntimeRequest = true;
                            // If a runtime request would return more content skip the static path
                            // entirely — unless the entry is an eligible shell-tier entry (see above),
                            // whose static attempt IS this upgrade.
                            // Otherwise the runtime request covers this segment and supersedes
                            // anything a static fetch could add, so a static upgrade would at best
                            // duplicate it — delivering the same content twice — and at worst replace
                            // runtime content with static content.
                            willBeSupersededByRuntimeRequest = true;
                        }
                    }
                    // If this is the speculative phase (not the shell phase), check if we
                    // should attempt to upgrade a fallback ISR response to a concrete
                    // version.
                    //
                    // For entries below this phase's tier, upgrade during the phase
                    // itself — no background deferral, since the whole point of the
                    // Speculative phase is to bring the cache up to the
                    // per-link-concrete tier. `isPartial` ensures a complete entry isn't
                    // re-fetched.
                    //
                    // If we can use runtime requests and a runtime request would provide more
                    // data, we also skip the upgrade (see `willBeSupersededByRuntimeRequest`)
                    const isUpgradeableISRFallbackRetry = fetchStrategy === _types.FetchStrategy.PPR && nodeEntry.isUpgradeableISRFallback && // If the status is empty, then we haven't yet attempted to upgrade
                    // the fallback.
                    //
                    // If the status is fulfilled, then the fallback was
                    // successfully upgraded to a concrete version.
                    //
                    // Do not attempt to upgrade if the status is Pending or Rejected.
                    (task.fallbackRetryStatus === _cache.EntryStatus.Empty || task.fallbackRetryStatus === _cache.EntryStatus.Fulfilled);
                    if (spawnRevalidations && !willBeSupersededByRuntimeRequest && (nodeEntry.isPartial && (0, _cache.canNewFetchStrategyProvideMoreContent)(nodeEntry.fetchStrategy, fetchStrategy) || isUpgradeableISRFallbackRetry)) {
                        const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, nodeTree);
                        if (revalidatingEntry.status === _cache.EntryStatus.Empty) {
                            const pendingEntry = (0, _cache.upgradeToPendingSegment)(revalidatingEntry, fetchStrategy);
                            if (spawnedEntries === null) {
                                spawnedEntries = new Map();
                            }
                            spawnedEntries.set(nodeTree.requestKey, pendingEntry);
                            // The pass blocks on every request it spawns, including
                            // revalidations of an already-fulfilled entry.
                            blockTaskOnPendingResponse(task, pendingEntry);
                        } else {
                            // A non-empty revalidating entry means a request is already in
                            // flight (or recently settled), so we dedupe and don't issue a
                            // competing one — including for ISR-fallback upgrades, which then
                            // share the same revalidation across tasks.
                            if (revalidatingEntry.status === _cache.EntryStatus.Pending) {
                                // The deduped-against revalidation is still in flight, and this
                                // pass depends on its response. Wait for it before the phase
                                // can complete. (A settled revalidation we chose not to use
                                // needs no waiting and is not a prefetch failure — the base
                                // entry here is already Fulfilled. A settled revalidation
                                // can't strand an eligible shell-tier entry either:
                                // isShellEntryEligibleForStaticAttempt reads the slot, so a
                                // settled attempt makes the entry ineligible and the runtime
                                // deopt proceeds above.)
                                blockTaskOnPendingResponse(task, revalidatingEntry);
                            }
                        }
                    }
                    break;
                }
            default:
                nodeEntry;
        }
        node = node.parent;
    }
    if (spawnedEntries !== null) {
        spawnPrefetchSubtask((0, _cache.fetchSegmentPrefetchesUsingStaticRequest)(task, route, routeKey, tree, spawnedEntries, fetchStrategy));
    }
    return needsRuntimeRequest;
}
/**
 * During the tree walk, decide whether this segment should be added to the
 * in-progress bundle (if it has InlinedIntoChild) or finalize the bundle
 * and ping it, triggering a fetch if any of its entries need data (if it
 * doesn't). Returns the updated bundle to pass to children (null if the
 * bundle was finalized here), along with the needs-runtime signal from the
 * bundle ping, if one happened (always false otherwise).
 */ function accumulateSegmentBundle(now, task, route, tree, parentBundle, // Per-pass static walk strategy; see pingRootRouteTree where it's derived.
// PPR for the normal static bundling walk; StaticShell during the Shell
// phase's static shell attempt, whose entries are keyed at the shell
// vary paths.
fetchStrategy, // False when finishing a chain on a runtime-prefetch bailout; see
// pingSegmentBundle.
spawnRevalidations) {
    // Prefetching is disabled for this segment (prefetch: 'force-disabled'):
    // the server emits identity only for its response node, and it
    // participates in the bundle chain with null tree/entry — no cache entry
    // is created for it.
    // (Partial Prefetching segments are NOT in this mask — the server emits
    // static data for them unconditionally.) Intentionally not gated by the
    // prefetch inlining flag: we never statically prefetch unprefetchable
    // segments.
    if (tree.prefetchHints & _approutertypes.StaticPrefetchDisabled) {
        return {
            bundle: {
                tree: null,
                entry: null,
                parent: parentBundle
            },
            needsRuntimeRequest: false
        };
    }
    const segment = (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, tree);
    if (process.env.__NEXT_PREFETCH_INLINING && tree.prefetchHints & _approutertypes.PrefetchHint.InlinedIntoChild) {
        if (segment.status === _cache.EntryStatus.Pending) {
            // The chain this entry joins may be dropped before it's ever pinged
            // (see the drop sites in pingSegmentInCacheComponentsTree), and only
            // the ping blocks on Pending entries. Register on the in-flight
            // response at read time instead, so the pass observes it before the
            // phase can complete even if the chain is dropped. When the chain does
            // get pinged, the ping's own registration dedupes against this one.
            blockTaskOnPendingResponse(task, segment);
        }
        return {
            bundle: {
                tree,
                entry: segment,
                parent: parentBundle
            },
            // No bundle ping happens here, but the node's own entry may already be
            // fulfilled and insufficient. Report that signal directly: the chain
            // ping only reaches the terminal descendant, and if that descendant is
            // itself a decision point it consumes the signal for its own subtree,
            // leaving this ancestor's insufficiency invisible to the decision
            // point above it. An eligible shell-tier entry withholds the signal,
            // the same exception the bundle ping applies: deopting here would
            // pre-empt the static attempt the chain ping spawns for this node when
            // it reaches the terminal descendant (its Fulfilled case runs for
            // every node in the chain).
            needsRuntimeRequest: segment.status === _cache.EntryStatus.Fulfilled && wouldRuntimeRequestProvideMore(segment, fetchStrategy) && !isShellEntryEligibleForStaticAttempt(now, task.segmentCacheMap, segment, tree, fetchStrategy)
        };
    }
    // Not bundled. Build a single-node bundle and ping it. If this page
    // accepts the head (HeadInlinedIntoSelf), prepend the head's cache entry
    // to the bundle.
    let effectiveParent = parentBundle;
    if (process.env.__NEXT_PREFETCH_INLINING && tree.prefetchHints & _approutertypes.PrefetchHint.HeadInlinedIntoSelf) {
        effectiveParent = {
            tree: route.root.head,
            entry: (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, route.root.head),
            parent: parentBundle
        };
    }
    const segments = {
        tree,
        entry: segment,
        parent: effectiveParent
    };
    const needsRuntimeRequest = pingSegmentBundle(now, task, route, task.key, tree, segments, fetchStrategy, spawnRevalidations);
    return {
        bundle: null,
        needsRuntimeRequest
    };
}
function finishStaticBundleOnRuntimeBailout(now, task, route, tree, parentBundle, // The same static walk strategy the parent bundle was accumulated with.
// Any needs-runtime signal from finishing the bundle is dropped: the
// caller is already deopting this subtree to a runtime prefetch.
fetchStrategy) {
    const bundle = accumulateSegmentBundle(now, task, route, tree, parentBundle, fetchStrategy, // The batched runtime request covers the deopted subtree; only fetch
    // Empty entries the chain would otherwise strand — never spawn
    // revalidations over settled or in-flight ones. See pingSegmentBundle.
    false).bundle;
    if (bundle === null) {
        return;
    }
    if (tree.slots !== null) {
        for (const childTree of tree.slots.values()){
            if (childTree.prefetchHints & _approutertypes.PrefetchHint.ParentInlinedIntoSelf) {
                finishStaticBundleOnRuntimeBailout(now, task, route, childTree, bundle, fetchStrategy);
                return;
            }
        }
    }
}
function pingFullSegmentRevalidation(now, task, tree, fetchStrategy) {
    const revalidatingSegment = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, tree);
    if (revalidatingSegment.status === _cache.EntryStatus.Empty) {
        // During a Full/PPRRuntime prefetch, a single runtime request is made for
        // all the segments that we need. So we don't initiate a request here
        // directly. By returning a pending entry from this function, it signals
        // to the caller that this segment should be included in the request
        // that's sent to the server.
        const pendingSegment = (0, _cache.upgradeToPendingSegment)(revalidatingSegment, fetchStrategy);
        // The upsert is handled by writeSegmentDataIntoCache
        // when the runtime request's response is written into the cache.
        return pendingSegment;
    } else {
        // There's already a revalidation in progress.
        const nonEmptyRevalidatingSegment = revalidatingSegment;
        if ((0, _cache.canNewFetchStrategyProvideMoreContent)(nonEmptyRevalidatingSegment.fetchStrategy, fetchStrategy)) {
            // The existing revalidation was fetched using a less specific strategy.
            // Reset it and start a new revalidation.
            const emptySegment = (0, _cache.overwriteRevalidatingSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, tree);
            const pendingSegment = (0, _cache.upgradeToPendingSegment)(emptySegment, fetchStrategy);
            // The upsert is handled by writeSegmentDataIntoCache
            // when the runtime request's response is written into the cache.
            return pendingSegment;
        }
        switch(nonEmptyRevalidatingSegment.status){
            case _cache.EntryStatus.Pending:
                // There's already an in-progress prefetch that includes this segment.
                // The pass needs the contents of that response, too. Wait for it
                // before the phase can complete.
                blockTaskOnPendingResponse(task, nonEmptyRevalidatingSegment);
                return null;
            case _cache.EntryStatus.Fulfilled:
            case _cache.EntryStatus.Rejected:
                // A previous revalidation attempt finished, but we chose not to replace
                // the existing entry in the cache. Don't try again until or unless the
                // revalidation entry expires.
                return null;
            default:
                nonEmptyRevalidatingSegment;
                return null;
        }
    }
}
function needsSpeculativePrefetch(taskfetchStrategy, rootPrefetchHints) {
    if ((rootPrefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0) {
        // PPF - only needs a speculative prefetch if this is a `<Link prefetch={true}>`.
        return taskfetchStrategy === _types.FetchStrategy.Full;
    } else {
        // non-PPF -- all prefetches are speculative.
        return true;
    }
}
// -----------------------------------------------------------------------------
// The remainder of the module is a MinHeap implementation. Try not to put any
// logic below here unless it's related to the heap algorithm. We can extract
// this to a separate module if/when we need multiple kinds of heaps.
// -----------------------------------------------------------------------------
function compareQueuePriority(a, b) {
    // Since the queue is a MinHeap, this should return a positive number if b is
    // higher priority than a, and a negative number if a is higher priority
    // than b.
    // `priority` is an integer, where higher numbers are higher priority.
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) {
        return priorityDiff;
    }
    // If the priority is the same, check which phase the prefetch is in — is it
    // prefetching the route tree, or the segments? Route trees are prioritized.
    const phaseDiff = b.phase - a.phase;
    if (phaseDiff !== 0) {
        return phaseDiff;
    }
    // Finally, check the insertion order. `sortId` is an incrementing counter
    // assigned to prefetches. We want to process the newest prefetches first.
    return b.sortId - a.sortId;
}
function heapPush(heap, node) {
    const index = heap.length;
    heap.push(node);
    node._heapIndex = index;
    heapSiftUp(heap, node, index);
}
function heapPeek(heap) {
    return heap.length === 0 ? null : heap[0];
}
function heapPop(heap) {
    if (heap.length === 0) {
        return null;
    }
    const first = heap[0];
    first._heapIndex = -1;
    const last = heap.pop();
    if (last !== first) {
        heap[0] = last;
        last._heapIndex = 0;
        heapSiftDown(heap, last, 0);
    }
    return first;
}
function heapDelete(heap, node) {
    const index = node._heapIndex;
    if (index !== -1) {
        node._heapIndex = -1;
        if (heap.length !== 0) {
            const last = heap.pop();
            if (last !== node) {
                heap[index] = last;
                last._heapIndex = index;
                heapSiftDown(heap, last, index);
            }
        }
    }
}
function heapResift(heap, node) {
    const index = node._heapIndex;
    if (index !== -1) {
        if (index === 0) {
            heapSiftDown(heap, node, 0);
        } else {
            const parentIndex = index - 1 >>> 1;
            const parent = heap[parentIndex];
            if (compareQueuePriority(parent, node) > 0) {
                // The parent is larger. Sift up.
                heapSiftUp(heap, node, index);
            } else {
                // The parent is smaller (or equal). Sift down.
                heapSiftDown(heap, node, index);
            }
        }
    }
}
function heapSiftUp(heap, node, i) {
    let index = i;
    while(index > 0){
        const parentIndex = index - 1 >>> 1;
        const parent = heap[parentIndex];
        if (compareQueuePriority(parent, node) > 0) {
            // The parent is larger. Swap positions.
            heap[parentIndex] = node;
            node._heapIndex = parentIndex;
            heap[index] = parent;
            parent._heapIndex = index;
            index = parentIndex;
        } else {
            // The parent is smaller. Exit.
            return;
        }
    }
}
function heapSiftDown(heap, node, i) {
    let index = i;
    const length = heap.length;
    const halfLength = length >>> 1;
    while(index < halfLength){
        const leftIndex = (index + 1) * 2 - 1;
        const left = heap[leftIndex];
        const rightIndex = leftIndex + 1;
        const right = heap[rightIndex];
        // If the left or right node is smaller, swap with the smaller of those.
        if (compareQueuePriority(left, node) < 0) {
            if (rightIndex < length && compareQueuePriority(right, left) < 0) {
                heap[index] = right;
                right._heapIndex = index;
                heap[rightIndex] = node;
                node._heapIndex = rightIndex;
                index = rightIndex;
            } else {
                heap[index] = left;
                left._heapIndex = index;
                heap[leftIndex] = node;
                node._heapIndex = leftIndex;
                index = leftIndex;
            }
        } else if (rightIndex < length && compareQueuePriority(right, node) < 0) {
            heap[index] = right;
            right._heapIndex = index;
            heap[rightIndex] = node;
            node._heapIndex = rightIndex;
            index = rightIndex;
        } else {
            // Neither child is smaller. Exit.
            return;
        }
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=scheduler.js.map