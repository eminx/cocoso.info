"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EntryStatus: null,
    MetadataOnlyRequestTree: null,
    attemptToFulfillDynamicSegmentFromBFCache: null,
    attemptToUpgradeSegmentFromBFCache: null,
    bufferPrefetchResponseBody: null,
    canNewFetchStrategyProvideMoreContent: null,
    convertFlightRouterStateToRouteTree: null,
    convertRootFlightRouterStateToRouteTree: null,
    convertRouteTreeToFlightRouterState: null,
    createDetachedSegmentCacheEntry: null,
    createMetadataRouteTree: null,
    createRootRouteTree: null,
    deprecated_requestOptimisticRouteCacheEntry: null,
    doesRouteStructureMatch: null,
    fetchRouteOnCacheMiss: null,
    fetchSegmentPrefetchesUsingRuntimeRequest: null,
    fetchSegmentPrefetchesUsingStaticRequest: null,
    fulfillRouteCacheEntry: null,
    getCurrentRouteCacheVersion: null,
    getCurrentSegmentCacheVersion: null,
    getHeadRequestKey: null,
    getStaleTimeMs: null,
    invalidateEntirePrefetchCache: null,
    invalidateRouteCacheEntries: null,
    invalidateSegmentCacheEntries: null,
    overwriteRevalidatingSegmentCacheEntry: null,
    pingInvalidationListeners: null,
    readOrCreateRevalidatingSegmentEntry: null,
    readOrCreateRouteCacheEntry: null,
    readOrCreateSegmentCacheEntry: null,
    readRouteCacheEntry: null,
    readSegmentCacheEntryForNavigation: null,
    rebaseInactiveRouteTree: null,
    resolveStaleAt: null,
    segmentCacheMap: null,
    spawnStaticStageCacheWrite: null,
    stripIsPartialByte: null,
    upgradeToPendingSegment: null,
    upsertSegmentEntry: null,
    waitForSegmentCacheEntry: null,
    writeRouteIntoCache: null,
    writeRuntimePrefetchStreamIntoCache: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    EntryStatus: function() {
        return _cachemap.EntryStatus;
    },
    MetadataOnlyRequestTree: function() {
        return MetadataOnlyRequestTree;
    },
    attemptToFulfillDynamicSegmentFromBFCache: function() {
        return attemptToFulfillDynamicSegmentFromBFCache;
    },
    attemptToUpgradeSegmentFromBFCache: function() {
        return attemptToUpgradeSegmentFromBFCache;
    },
    bufferPrefetchResponseBody: function() {
        return bufferPrefetchResponseBody;
    },
    canNewFetchStrategyProvideMoreContent: function() {
        return canNewFetchStrategyProvideMoreContent;
    },
    convertFlightRouterStateToRouteTree: function() {
        return convertFlightRouterStateToRouteTree;
    },
    convertRootFlightRouterStateToRouteTree: function() {
        return convertRootFlightRouterStateToRouteTree;
    },
    convertRouteTreeToFlightRouterState: function() {
        return convertRouteTreeToFlightRouterState;
    },
    createDetachedSegmentCacheEntry: function() {
        return createDetachedSegmentCacheEntry;
    },
    createMetadataRouteTree: function() {
        return createMetadataRouteTree;
    },
    createRootRouteTree: function() {
        return createRootRouteTree;
    },
    deprecated_requestOptimisticRouteCacheEntry: function() {
        return deprecated_requestOptimisticRouteCacheEntry;
    },
    doesRouteStructureMatch: function() {
        return doesRouteStructureMatch;
    },
    fetchRouteOnCacheMiss: function() {
        return fetchRouteOnCacheMiss;
    },
    fetchSegmentPrefetchesUsingRuntimeRequest: function() {
        return fetchSegmentPrefetchesUsingRuntimeRequest;
    },
    fetchSegmentPrefetchesUsingStaticRequest: function() {
        return fetchSegmentPrefetchesUsingStaticRequest;
    },
    fulfillRouteCacheEntry: function() {
        return fulfillRouteCacheEntry;
    },
    getCurrentRouteCacheVersion: function() {
        return getCurrentRouteCacheVersion;
    },
    getCurrentSegmentCacheVersion: function() {
        return getCurrentSegmentCacheVersion;
    },
    getHeadRequestKey: function() {
        return getHeadRequestKey;
    },
    getStaleTimeMs: function() {
        return getStaleTimeMs;
    },
    invalidateEntirePrefetchCache: function() {
        return invalidateEntirePrefetchCache;
    },
    invalidateRouteCacheEntries: function() {
        return invalidateRouteCacheEntries;
    },
    invalidateSegmentCacheEntries: function() {
        return invalidateSegmentCacheEntries;
    },
    overwriteRevalidatingSegmentCacheEntry: function() {
        return overwriteRevalidatingSegmentCacheEntry;
    },
    pingInvalidationListeners: function() {
        return pingInvalidationListeners;
    },
    readOrCreateRevalidatingSegmentEntry: function() {
        return readOrCreateRevalidatingSegmentEntry;
    },
    readOrCreateRouteCacheEntry: function() {
        return readOrCreateRouteCacheEntry;
    },
    readOrCreateSegmentCacheEntry: function() {
        return readOrCreateSegmentCacheEntry;
    },
    readRouteCacheEntry: function() {
        return readRouteCacheEntry;
    },
    readSegmentCacheEntryForNavigation: function() {
        return readSegmentCacheEntryForNavigation;
    },
    rebaseInactiveRouteTree: function() {
        return rebaseInactiveRouteTree;
    },
    resolveStaleAt: function() {
        return resolveStaleAt;
    },
    segmentCacheMap: function() {
        return segmentCacheMap;
    },
    spawnStaticStageCacheWrite: function() {
        return spawnStaticStageCacheWrite;
    },
    stripIsPartialByte: function() {
        return stripIsPartialByte;
    },
    upgradeToPendingSegment: function() {
        return upgradeToPendingSegment;
    },
    upsertSegmentEntry: function() {
        return upsertSegmentEntry;
    },
    waitForSegmentCacheEntry: function() {
        return waitForSegmentCacheEntry;
    },
    writeRouteIntoCache: function() {
        return writeRouteIntoCache;
    },
    writeRuntimePrefetchStreamIntoCache: function() {
        return writeRuntimePrefetchStreamIntoCache;
    }
});
const _approutertypes = require("../../../shared/lib/app-router-types");
const _varyparamsdecoding = require("../../../shared/lib/segment-cache/vary-params-decoding");
const _rsctransport = require("../../../shared/lib/rsc-transport");
const _approuterheaders = require("../app-router-headers");
const _fetchserverresponse = require("../router-reducer/fetch-server-response");
const _fetch = require("./fetch");
const _scheduler = require("./scheduler");
const _varypath = require("./vary-path");
const _createhreffromurl = require("../router-reducer/create-href-from-url");
const _cachekey = require("./cache-key");
const _routeparams = require("../../route-params");
const _cachemap = require("./cache-map");
const _segmentvalueencoding = require("../../../shared/lib/segment-cache/segment-value-encoding");
const _flightdatahelpers = require("../../flight-data-helpers");
const _navigatereducer = require("../router-reducer/reducers/navigate-reducer");
const _links = require("../links");
const _types = require("./types");
const _promisewithresolvers = require("../../../shared/lib/promise-with-resolvers");
const _bfcache = require("./bfcache");
const _optimisticroutes = require("./optimistic-routes");
const _decodeserverresponse = require("./decode-server-response");
const _navigationbuildid = require("../../navigation-build-id");
const _constants = require("../../../lib/constants");
function getStaleTimeMs(staleTimeSeconds) {
    return Math.max(staleTimeSeconds, 30) * 1000;
}
// How long a rejected cache entry blocks re-fetching before it may be
// retried (its staleAt is set this far in the future).
const REJECTION_BACKOFF_MS = 10 * 1000;
/**
 * The staleAt to reject entries with when a prefetch fails: if we're
 * offline, expire immediately (-1) so the entry is re-fetched once the
 * scheduler is re-pinged after connectivity is restored; otherwise apply a
 * short backoff. (Unlike navigations and server actions, prefetches don't
 * await `waitForConnection`.)
 */ function getPrefetchErrorStaleAt(error) {
    if (process.env.__NEXT_USE_OFFLINE) {
        const { checkOfflineError } = require('../offline');
        if (checkOfflineError(error)) {
            return -1;
        }
    }
    return Date.now() + REJECTION_BACKOFF_MS;
}
function createRootRouteTree(tree, head) {
    return {
        tree,
        head
    };
}
function doesRouteStructureMatch(currentTree, nextTree) {
    // The request key includes the param names and types, but not the values.
    if (currentTree.requestKey !== nextTree.requestKey) {
        return false;
    }
    // The root request key is always empty (even for global Not Found), so we
    // have to compare the root segment directly.
    return nextTree.requestKey !== _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY || currentTree.segment === nextTree.segment;
}
const isOutputExportMode = process.env.NODE_ENV === 'production' && process.env.__NEXT_CONFIG_OUTPUT === 'export';
const MetadataOnlyRequestTree = [
    '',
    {},
    null,
    'metadata-only'
];
const routeCacheMap = (0, _cachemap.createCacheMap)();
const segmentCacheMap = (0, _cachemap.createCacheMap)();
// All invalidation listeners for the whole cache are tracked in single set.
// Since we don't yet support tag or path-based invalidation, there's no point
// tracking them any more granularly than this. Once we add granular
// invalidation, that may change, though generally the model is to just notify
// the listeners and allow the caller to poll the prefetch cache with a new
// prefetch task if desired.
let invalidationListeners = null;
// Incrementing counters used to track cache invalidations. Route and segment
// caches have separate versions so they can be invalidated independently.
// Invalidation does not eagerly evict anything from the cache; entries are
// lazily evicted when read.
let currentRouteCacheVersion = 0;
let currentSegmentCacheVersion = 0;
function getCurrentRouteCacheVersion() {
    return currentRouteCacheVersion;
}
function getCurrentSegmentCacheVersion() {
    return currentSegmentCacheVersion;
}
function invalidateEntirePrefetchCache(nextUrl, root) {
    currentRouteCacheVersion++;
    currentSegmentCacheVersion++;
    (0, _links.pingVisibleLinks)(nextUrl, root);
    pingInvalidationListeners(nextUrl, root);
}
function invalidateRouteCacheEntries(nextUrl, root) {
    currentRouteCacheVersion++;
    (0, _links.pingVisibleLinks)(nextUrl, root);
    pingInvalidationListeners(nextUrl, root);
}
function invalidateSegmentCacheEntries(nextUrl, root) {
    currentSegmentCacheVersion++;
    (0, _links.pingVisibleLinks)(nextUrl, root);
    pingInvalidationListeners(nextUrl, root);
}
function attachInvalidationListener(task) {
    // This function is called whenever a prefetch task reads a cache entry. If
    // the task has an onInvalidate function associated with it — i.e. the one
    // optionally passed to router.prefetch(onInvalidate) — then we attach that
    // listener to the every cache entry that the task reads. Then, if an entry
    // is invalidated, we call the function.
    if (task.onInvalidate !== null) {
        if (invalidationListeners === null) {
            invalidationListeners = new Set([
                task
            ]);
        } else {
            invalidationListeners.add(task);
        }
    }
}
function notifyInvalidationListener(task) {
    const onInvalidate = task.onInvalidate;
    if (onInvalidate !== null) {
        // Clear the callback from the task object to guarantee it's not called more
        // than once.
        task.onInvalidate = null;
        // This is a user-space function, so we must wrap in try/catch.
        try {
            onInvalidate();
        } catch (error) {
            if (typeof reportError === 'function') {
                reportError(error);
            } else {
                console.error(error);
            }
        }
    }
}
function pingInvalidationListeners(nextUrl, root) {
    // The rough equivalent of pingVisibleLinks, but for onInvalidate callbacks.
    // This is called when the Next-Url or the base tree changes, since those
    // may affect the result of a prefetch task. It's also called after a
    // cache invalidation.
    if (invalidationListeners !== null) {
        const tasks = invalidationListeners;
        invalidationListeners = null;
        for (const task of tasks){
            if ((0, _scheduler.isPrefetchTaskDirty)(task, nextUrl, root)) {
                notifyInvalidationListener(task);
            }
        }
    }
}
function readRouteCacheEntry(now, key) {
    const varyPath = (0, _varypath.getRouteVaryPath)(key.pathname, key.search, key.nextUrl);
    const isRevalidation = false;
    const existingEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentRouteCacheVersion(), routeCacheMap, varyPath, isRevalidation, false);
    if (existingEntry !== null) {
        return existingEntry;
    }
    // No cache hit. Attempt to construct from template using the new
    // optimistic routing mechanism (pattern-based matching).
    if (process.env.__NEXT_OPTIMISTIC_ROUTING) {
        return (0, _optimisticroutes.matchKnownRoute)(now, key.pathname, key.search);
    }
    return null;
}
function readSegmentCacheEntryForNavigation(now, // The map the navigation is bound to: a locked navigation's driving-task
// map, or the shared map otherwise.
map, varyPath, restrictToShell = false) {
    const isRevalidation = false;
    let lookupVaryPath = varyPath;
    if (process.env.__NEXT_EXPOSE_TESTING_API && restrictToShell) {
        // Instant Navigation Testing API: we're navigating to a link that 1) has
        // Partial Prefetching enabled, and 2) does not have a prefetch prop set.
        // Only the shell may render, not anything that varies on concrete route
        // params.
        lookupVaryPath = (0, _varypath.getShellSegmentVaryPath)(varyPath);
    }
    // Prefer a Fulfilled entry (e.g. a cached shell) over a more-specific
    // Pending/Rejected one so it renders immediately instead of blocking on an
    // in-flight entry.
    const fulfilled = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, lookupVaryPath, isRevalidation, true);
    if (fulfilled !== null) {
        return fulfilled;
    }
    return (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, lookupVaryPath, isRevalidation, false);
}
function readRevalidatingSegmentCacheEntry(now, map, varyPath) {
    const isRevalidation = true;
    return (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, varyPath, isRevalidation, false);
}
function waitForSegmentCacheEntry(pendingEntry) {
    // Because the entry is pending, there's already a in-progress request.
    // Attach a promise to the entry that will resolve when the server responds.
    let promiseWithResolvers = pendingEntry.promise;
    if (promiseWithResolvers === null) {
        promiseWithResolvers = pendingEntry.promise = (0, _promisewithresolvers.createPromiseWithResolvers)();
    } else {
    // There's already a promise we can use
    }
    return promiseWithResolvers.promise;
}
function createDetachedRouteCacheEntry() {
    return {
        canonicalUrl: null,
        status: _cachemap.EntryStatus.Empty,
        blockedTasks: null,
        root: null,
        // This is initialized to true because we don't know yet whether the route
        // could be intercepted. It's only set to false once we receive a response
        // from the server.
        couldBeIntercepted: true,
        // Similarly, we don't yet know if the route supports PPR.
        supportsPerSegmentPrefetching: false,
        predictedFrom: null,
        renderedSearch: null,
        // Map-related fields
        ref: null,
        size: 0,
        // Since this is an empty entry, there's no reason to ever evict it. It will
        // be updated when the data is populated.
        staleAt: Infinity,
        version: getCurrentRouteCacheVersion()
    };
}
function readOrCreateRouteCacheEntry(now, task, key) {
    attachInvalidationListener(task);
    const existingEntry = readRouteCacheEntry(now, key);
    if (existingEntry !== null) {
        return existingEntry;
    }
    // Create a pending entry and add it to the cache.
    const pendingEntry = createDetachedRouteCacheEntry();
    const varyPath = (0, _varypath.getRouteVaryPath)(key.pathname, key.search, key.nextUrl);
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(routeCacheMap, varyPath, pendingEntry, isRevalidation);
    return pendingEntry;
}
function deprecated_requestOptimisticRouteCacheEntry(now, requestedUrl, nextUrl) {
    // This function is called during a navigation when there was no matching
    // route tree in the prefetch cache. Before de-opting to a blocking,
    // unprefetched navigation, we will first attempt to construct an "optimistic"
    // route tree by checking the cache for similar routes.
    //
    // Check if there's a route with the same pathname, but with different
    // search params. We can then base our optimistic route tree on this entry.
    //
    // Conceptually, we are simulating what would happen if we did perform a
    // prefetch the requested URL, under the assumption that the server will
    // not redirect or rewrite the request in a different manner than the
    // base route tree. This assumption might not hold, in which case we'll have
    // to recover when we perform the dynamic navigation request. However, this
    // is what would happen if a route were dynamically rewritten/redirected
    // in between the prefetch and the navigation. So the logic needs to exist
    // to handle this case regardless.
    // Look for a route with the same pathname, but with an empty search string.
    // TODO: There's nothing inherently special about the empty search string;
    // it's chosen somewhat arbitrarily, with the rationale that it's the most
    // likely one to exist. But we should update this to match _any_ search
    // string. The plan is to generalize this logic alongside other improvements
    // related to "fallback" cache entries.
    const requestedSearch = requestedUrl.search;
    if (requestedSearch === '') {
        // The caller would have already checked if a route with an empty search
        // string is in the cache. So we can bail out here.
        return null;
    }
    const urlWithoutSearchParams = new URL(requestedUrl);
    urlWithoutSearchParams.search = '';
    const routeWithNoSearchParams = readRouteCacheEntry(now, (0, _cachekey.createCacheKey)(urlWithoutSearchParams.href, nextUrl));
    if (routeWithNoSearchParams === null || routeWithNoSearchParams.status !== _cachemap.EntryStatus.Fulfilled) {
        // Bail out of constructing an optimistic route tree. This will result in
        // a blocking, unprefetched navigation.
        return null;
    }
    // Now we have a base route tree we can "patch" with our optimistic values.
    // Optimistically assume that redirects for the requested pathname do
    // not vary on the search string. Therefore, if the base route was
    // redirected to a different search string, then the optimistic route
    // should be redirected to the same search string. Otherwise, we use
    // the requested search string.
    const canonicalUrlForRouteWithNoSearchParams = new URL(routeWithNoSearchParams.canonicalUrl, requestedUrl.origin);
    const optimisticCanonicalSearch = canonicalUrlForRouteWithNoSearchParams.search !== '' ? canonicalUrlForRouteWithNoSearchParams.search : requestedSearch;
    // Similarly, optimistically assume that rewrites for the requested
    // pathname do not vary on the search string. Therefore, if the base
    // route was rewritten to a different search string, then the optimistic
    // route should be rewritten to the same search string. Otherwise, we use
    // the requested search string.
    const optimisticRenderedSearch = routeWithNoSearchParams.renderedSearch !== '' ? routeWithNoSearchParams.renderedSearch : (0, _routeparams.normalizeRenderedSearch)(requestedSearch);
    const optimisticUrl = new URL(routeWithNoSearchParams.canonicalUrl, location.origin);
    optimisticUrl.search = optimisticCanonicalSearch;
    const optimisticCanonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(optimisticUrl);
    const optimisticRouteTree = deprecated_createOptimisticRouteTree(routeWithNoSearchParams.root.tree, optimisticRenderedSearch);
    const baseMetadataTree = routeWithNoSearchParams.root.head;
    const optimisticMetadataTree = createMetadataRouteTree((0, _varypath.cloneVaryPathWithNewSearchParams)(baseMetadataTree.varyPath, optimisticRenderedSearch), baseMetadataTree.prefetchHints, null);
    // Clone the base route tree, and override the relevant fields with our
    // optimistic values.
    const optimisticEntry = {
        canonicalUrl: optimisticCanonicalUrl,
        status: _cachemap.EntryStatus.Fulfilled,
        // This isn't cloned because it's instance-specific
        blockedTasks: null,
        root: createRootRouteTree(optimisticRouteTree, optimisticMetadataTree),
        couldBeIntercepted: routeWithNoSearchParams.couldBeIntercepted,
        supportsPerSegmentPrefetching: routeWithNoSearchParams.supportsPerSegmentPrefetching,
        predictedFrom: null,
        // Override the rendered search with the optimistic value.
        renderedSearch: optimisticRenderedSearch,
        // Map-related fields
        ref: null,
        size: 0,
        staleAt: routeWithNoSearchParams.staleAt,
        version: routeWithNoSearchParams.version
    };
    // Do not insert this entry into the cache. It only exists so we can
    // perform the current navigation. Just return it to the caller.
    return optimisticEntry;
}
function deprecated_createOptimisticRouteTree(tree, newRenderedSearch) {
    // Create a new route tree that identical to the original one except for
    // the rendered search string, which is contained in the vary path.
    let clonedSlots = null;
    const originalSlots = tree.slots;
    if (originalSlots !== null) {
        clonedSlots = new Map();
        for (const [parallelRouteKey, childTree] of originalSlots){
            clonedSlots.set(parallelRouteKey, deprecated_createOptimisticRouteTree(childTree, newRenderedSearch));
        }
    }
    // The shell vary path Fallbacks search params, so it's unaffected by the
    // new rendered search and can be reused as-is.
    return {
        requestKey: tree.requestKey,
        segment: tree.segment,
        shellVaryPath: tree.shellVaryPath,
        refreshState: tree.refreshState,
        // Optimistic trees are structure-only. (The input tree comes from the
        // route cache, which never carries render output.)
        data: null,
        varyPath: (0, _varypath.cloneVaryPathWithNewSearchParams)(tree.varyPath, newRenderedSearch),
        slots: clonedSlots,
        prefetchHints: tree.prefetchHints
    };
}
function readOrCreateSegmentCacheEntry(now, // The map the calling task operates in (`PrefetchTask.segmentCacheMap`,
// captured when the task was scheduled).
map, fetchStrategy, tree) {
    const existingEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, tree.varyPath, false, false);
    if (existingEntry !== null) {
        return existingEntry;
    }
    return insertEmptySegmentCacheEntry(now, map, fetchStrategy, tree);
}
/**
 * Creates an empty segment cache entry and inserts it into the cache, keyed
 * at the vary path a request made with the given fetch strategy is stored
 * under. The stale time is set to a default value; the actual stale time will
 * be set when the entry is fulfilled with data from the server response.
 */ function insertEmptySegmentCacheEntry(now, map, fetchStrategy, tree) {
    const varyPathForRequest = (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    const emptyEntry = createDetachedSegmentCacheEntry(now);
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(map, varyPathForRequest, emptyEntry, isRevalidation);
    return emptyEntry;
}
function readOrCreateRevalidatingSegmentEntry(now, // The map the calling task operates in (`PrefetchTask.segmentCacheMap`).
map, fetchStrategy, tree) {
    // This function is called when we've already confirmed that a particular
    // segment is cached, but we want to perform another request anyway in case it
    // returns more complete and/or fresher data than we already have. The logic
    // for deciding whether to replace the existing entry is handled elsewhere;
    // this function just handles retrieving a cache entry that we can use to
    // track the revalidation.
    //
    // The reason revalidations are stored in the cache is because we need to be
    // able to dedupe multiple revalidation requests. The reason they have to be
    // handled specially is because we shouldn't overwrite a "normal" entry if
    // one exists at the same keypath. So, for each internal cache location, there
    // is a special "revalidation" slot that is used solely for this purpose.
    //
    // You can think of it as if all the revalidation entries were stored in a
    // separate cache map from the canonical entries, and then transfered to the
    // canonical cache map once the request is complete — this isn't how it's
    // actually implemented, since it's more efficient to store them in the same
    // data structure as the normal entries, but that's how it's modeled
    // conceptually.
    // TODO: Once we implement Fallback behavior for params, where an entry is
    // re-keyed based on response information, we'll need to account for the
    // possibility that the keypath of the previous entry is more generic than
    // the keypath of the revalidating entry. In other words, the server could
    // return a less generic entry upon revalidation. For now, though, this isn't
    // a concern because the keypath is based solely on the prefetch strategy,
    // not on data contained in the response.
    const existingEntry = readRevalidatingSegmentCacheEntry(now, map, tree.varyPath);
    if (existingEntry !== null) {
        return existingEntry;
    }
    // Create a pending entry and add it to the cache. The stale time is set to a
    // default value; the actual stale time will be set when the entry is
    // fulfilled with data from the server response.
    const varyPathForRequest = (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    const pendingEntry = createDetachedSegmentCacheEntry(now);
    const isRevalidation = true;
    (0, _cachemap.setInCacheMap)(map, varyPathForRequest, pendingEntry, isRevalidation);
    return pendingEntry;
}
function overwriteRevalidatingSegmentCacheEntry(now, // The map the calling task operates in (`PrefetchTask.segmentCacheMap`).
map, fetchStrategy, tree) {
    // This function is called when we've already decided to replace an existing
    // revalidation entry. Create a new entry and write it into the cache,
    // overwriting the previous value. The stale time is set to a default value;
    // the actual stale time will be set when the entry is fulfilled with data
    // from the server response.
    const varyPathForRequest = (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    const pendingEntry = createDetachedSegmentCacheEntry(now);
    const isRevalidation = true;
    (0, _cachemap.setInCacheMap)(map, varyPathForRequest, pendingEntry, isRevalidation);
    return pendingEntry;
}
/**
 * Whether an existing cache entry is preferred over an incoming candidate —
 * i.e. the candidate does NOT supersede it. (On an exact tie — same fetch
 * strategy, same partialness — this returns false, so the candidate replaces
 * the existing entry.) This is the precedence rule used both when deciding
 * whether an upsert may replace the entry at its own keypath, and when
 * deciding whether an entry at a more specific keypath may be evicted because
 * it shadows a just-inserted candidate (see `evictShadowingSegmentEntries`).
 *
 * Note that "less/more specific" in the comments below refers to fetch
 * strategy content tiers (how much content a strategy can produce), not the
 * vary-path specificity the eviction docs are concerned with.
 */ function isExistingSegmentEntryPreferred(existingEntry, candidateEntry) {
    if (existingEntry.status === _cachemap.EntryStatus.Empty) {
        // An Empty entry is a placeholder that carries no data, and its
        // fetchStrategy is a spawn-time default, not a fact about any content —
        // it must never win a precedence comparison. (Without this, a candidate
        // fetched at a tier below the placeholder's default would be discarded
        // in favor of an entry with nothing in it.)
        return false;
    }
    return(// We fetched the new segment using a different, less specific fetch
    // strategy than the segment we already have in the cache, so it can't
    // have more content.
    candidateEntry.fetchStrategy !== existingEntry.fetchStrategy && !canNewFetchStrategyProvideMoreContent(existingEntry.fetchStrategy, candidateEntry.fetchStrategy) || // The existing entry isn't partial, but the new one is.
    // (TODO: can this be true if `candidateEntry.fetchStrategy >= existingEntry.fetchStrategy`?)
    !existingEntry.isPartial && candidateEntry.isPartial);
}
function upsertSegmentEntry(now, // The map the whole upsert (existing-entry read, insert, shadow eviction)
// operates in. Prefetch response-write paths pass the spawning task's map
// (`PrefetchTask.segmentCacheMap`), so a response that lands after a
// testing-lock scope boundary still writes into the map its entries
// live in.
map, varyPath, candidateEntry, // The fully concrete vary path a read for this segment position resolves
// against (all concrete param values, i.e. `tree.varyPath`) — the most
// specific path a read would use. Note this is the opposite of the
// generalized keying path that `getSegmentVaryPathForRequest` computes.
// Used to detect and evict stale entries at more specific keypaths that
// would otherwise shadow the candidate. Pass null when there's no request
// context; the shadow check is skipped.
lookupVaryPath) {
    // We have a new entry that has not yet been inserted into the cache. Before
    // we do so, we need to confirm whether it takes precedence over the existing
    // entry (if one exists).
    // TODO: We should not upsert an entry if its key was invalidated in the time
    // since the request was made. We can do that by passing the "owner" entry to
    // this function and confirming it's the same as `existingEntry`.
    if ((0, _cachemap.isValueExpired)(now, getCurrentSegmentCacheVersion(), candidateEntry)) {
        // The entry is expired. We cannot upsert it.
        return null;
    }
    const existingEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, varyPath, false, false);
    if (existingEntry !== null) {
        // Don't replace a more specific segment with a less-specific one. A case where this
        // might happen is if the existing segment was fetched via
        // `<Link prefetch={true}>`.
        if (isExistingSegmentEntryPreferred(existingEntry, candidateEntry)) {
            // The candidate does not supersede the existing entry. Leave the
            // existing entry in place and discard the candidate by not inserting it.
            //
            // We must not mutate the candidate here (e.g. downgrade it to Rejected or
            // null out its `rsc`). The caller does not transfer exclusive ownership
            // of it: it may already have been fulfilled, resolving its promise to a
            // waiter that holds the entry and reads `rsc` off it later. A navigation
            // seed is such a waiter, via `waitForSegmentCacheEntry`. Nulling `rsc`
            // after the fact resolves that read to `null`, so the waiter loses the
            // data it was about to render. Declining to insert it is enough: the
            // existing entry stays canonical, and the candidate keeps its valid (if
            // less complete) data for any waiter that already took it.
            return null;
        }
        // Ping any tasks blocked on the existing entry before replacing it so they
        // re-run and pick up the new entry. Without this, tasks waiting on the
        // existing Empty/Pending entry would be stranded — the new fulfilled
        // candidate has no blockedTasks of its own.
        if (existingEntry.status === _cachemap.EntryStatus.Empty || existingEntry.status === _cachemap.EntryStatus.Pending) {
            pingBlockedTasks(existingEntry);
        }
    // Replace the existing entry by writing the candidate over its keypath
    // below (the same mechanism `overwriteRevalidatingSegmentCacheEntry`
    // uses). We intentionally do NOT call `deleteFromCacheMap` first: deleting
    // vacates the canonical slot, and `deleteMapEntry` promotes a pending
    // Revalidation-slot entry into the vacated slot — which the immediate
    // insert below would then silently overwrite. The in-flight revalidation
    // would vanish from the map, so the next scheduler pass would find an
    // empty revalidation slot and spawn a duplicate request instead of
    // deduping against it. Replacing in place never vacates the slot, so
    // promotion never runs and the pending revalidating entry stays in its
    // Revalidation slot where `readOrCreateRevalidatingSegmentEntry`'s dedupe
    // finds it.
    //
    // The displaced entry's map/LRU accounting is handled by the replacement
    // itself: `setMapEntryValue` drops the displaced value's `ref` and
    // `updateLruSize` swaps its size for the candidate's, which is exactly
    // what delete-then-insert did.
    }
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(map, varyPath, candidateEntry, isRevalidation);
    if (lookupVaryPath !== null) {
        evictShadowingSegmentEntries(now, map, lookupVaryPath, candidateEntry);
    }
    return candidateEntry;
}
/**
 * Evicts stale entries at more specific keypaths that shadow a just-inserted
 * candidate entry.
 *
 * A response can be written to the cache at a MORE GENERIC vary path than the
 * path the request was issued against — for example, the server may report
 * that a segment doesn't vary on a param, so the entry is re-keyed with that
 * param as Fallback. Meanwhile, an older, less useful entry can exist at a
 * more specific path within the same fallback chain — for example, a partial
 * shell entry keyed with root params concrete (see
 * `getShellSegmentVaryPath`). Because segment lookup is
 * most-specific-match-wins, every subsequent read at the concrete request
 * path keeps returning the stale specific entry, and the more complete
 * generic entry is unreachable from that URL. That both wastes the completed
 * request and can loop: a prefetch task that revalidated the segment reads
 * back the same stale entry, decides it needs to revalidate again, and
 * repeats forever.
 *
 * The upsert is the one moment we know the ordering between the two entries:
 * the candidate was produced by a request for this segment position, and
 * `lookupVaryPath` is the fully concrete path a read for that position
 * resolves against, so any entry that a read at that path would return in the
 * candidate's stead is directly comparable to it. If such an entry is settled
 * and the candidate supersedes it — under the same precedence rules the
 * upsert applies at its own keypath — we know we never want to match against
 * it again, so delete it, making the candidate reachable.
 *
 * Pending entries are never evicted here: they're owned by an in-flight
 * request that will settle them. Empty entries ARE evictable — they're
 * unclaimed placeholders with nothing in them, so they must not shadow real
 * data; their blocked tasks are pinged so they re-run against the candidate.
 */ function evictShadowingSegmentEntries(now, map, lookupVaryPath, candidateEntry) {
    // There can in principle be multiple shadowing entries at successively less
    // specific keypaths, so loop until the read returns the candidate (or an
    // entry we don't supersede). Each iteration re-reads and re-checks from
    // scratch (in part because `deleteFromCacheMap` can promote a settled
    // Revalidation-slot value into the just-vacated slot, surfacing a new entry
    // at the same keypath). Each iteration deletes an entry from the map, so
    // the loop terminates naturally; the bound is defensive, and 32 is far
    // beyond any real fallback chain, which is bounded by the vary
    // path's length.
    for(let i = 0; i < 32; i++){
        const shadowEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, lookupVaryPath, false, false);
        if (shadowEntry === null || shadowEntry === candidateEntry) {
            // The candidate is reachable from the lookup path (or the read missed
            // entirely, e.g. because the candidate expired). Done.
            return;
        }
        if (shadowEntry.status === _cachemap.EntryStatus.Pending) {
            // A Pending entry may not be evicted: it's held by an in-flight
            // request and will settle on its own. (An Empty shadow entry, by
            // contrast, is an unclaimed placeholder with nothing in it — never
            // preferred over the candidate, per isExistingSegmentEntryPreferred —
            // so it falls through to the eviction below, waking any tasks blocked
            // on it so they re-run and find the candidate.)
            return;
        }
        if (isExistingSegmentEntryPreferred(shadowEntry, candidateEntry)) {
            // The shadowing entry is preferred over the candidate (e.g. it's a
            // complete entry fetched with a more specific strategy). Leave it —
            // reads at this path should keep matching it.
            return;
        }
        // The candidate supersedes the shadowing entry. Evict it. Settled entries
        // shouldn't have blocked tasks (Fulfilled always has `blockedTasks:
        // null`, and Rejected entries were pinged at rejection), but an Empty
        // entry may have them — ping before deleting, matching the upsert-evict
        // pattern above.
        pingBlockedTasks(shadowEntry);
        (0, _cachemap.deleteFromCacheMap)(shadowEntry);
    }
}
function createDetachedSegmentCacheEntry(now) {
    // Default stale time for pending segment cache entries. The actual stale time
    // is set when the entry is fulfilled with data from the server response.
    const staleAt = now + 30 * 1000;
    const emptyEntry = {
        status: _cachemap.EntryStatus.Empty,
        blockedTasks: null,
        // Default to assuming the fetch strategy will be PPR. This will be updated
        // when a fetch is actually initiated.
        fetchStrategy: _types.FetchStrategy.PPR,
        rsc: null,
        isPartial: true,
        isUpgradeableISRFallback: false,
        promise: null,
        // Map-related fields
        ref: null,
        size: 0,
        staleAt,
        version: 0
    };
    return emptyEntry;
}
function upgradeToPendingSegment(emptyEntry, fetchStrategy) {
    const pendingEntry = emptyEntry;
    pendingEntry.status = _cachemap.EntryStatus.Pending;
    pendingEntry.fetchStrategy = fetchStrategy;
    if (fetchStrategy === _types.FetchStrategy.Full) {
        // The Pending-Full convention: pre-set isPartial to false before any
        // data exists. Normally partiality is absolute — anything unresolved in
        // the entry's output makes it true, and a pending entry has no output at
        // all — but a Full response is a complete navigation payload, so this
        // segment may already be omitted from navigation requests that happen
        // while the data is still in flight. That "may be omitted" signal is
        // exactly what isPartial: false means to a navigation, so this
        // deliberately breaks the absolute definition for the pending window.
        pendingEntry.isPartial = false;
    }
    // Set the version here, since this is right before the request is initiated.
    // The next time the segment cache version is incremented, the entry will
    // effectively be evicted. This happens before initiating the request, rather
    // than when receiving the response, because it's guaranteed to happen
    // before the data is read on the server.
    pendingEntry.version = getCurrentSegmentCacheVersion();
    return pendingEntry;
}
function attemptToFulfillDynamicSegmentFromBFCache(now, segment, tree) {
    // Attempts to fulfill an empty segment cache entry using data from the
    // bfcache. This is only valid during a Full prefetch (i.e. one that includes
    // dynamic data), because the bfcache stores data from navigations which
    // always include dynamic data.
    // We always use the canonical vary path when checking the bfcache. This is
    // the same operation we'd use to access the cache during a
    // regular navigation.
    const varyPath = tree.varyPath;
    // Read from the BFCache without expiring it (pass -1). We check freshness
    // ourselves using navigatedAt, because the BFCache's staleAt may have been
    // overridden by a per-page unstable_dynamicStaleTime and can't be used to
    // derive the original request time.
    const bfcacheEntry = (0, _bfcache.readFromBFCache)(varyPath);
    if (bfcacheEntry !== null) {
        // The stale time for dynamic prefetches (default: 5 mins) is different
        // from the stale time for regular navigations (default: 0 secs). Use
        // navigatedAt to compute the correct expiry for prefetch purposes.
        const dynamicPrefetchStaleAt = bfcacheEntry.navigatedAt + _navigatereducer.STATIC_STALETIME_MS;
        if (now > dynamicPrefetchStaleAt) {
            return null;
        }
        const pendingSegment = upgradeToPendingSegment(segment, _types.FetchStrategy.Full);
        const isPartial = false;
        return fulfillSegmentCacheEntry(pendingSegment, bfcacheEntry.rsc, dynamicPrefetchStaleAt, isPartial, bfcacheEntry.varyParams, // bfcache data is concrete, never an ISR fallback.
        false, _types.FetchStrategy.Full);
    }
    return null;
}
function attemptToUpgradeSegmentFromBFCache(now, // The map the calling task operates in (`PrefetchTask.segmentCacheMap`).
map, tree) {
    const varyPath = tree.varyPath;
    const bfcacheEntry = (0, _bfcache.readFromBFCache)(varyPath);
    if (bfcacheEntry !== null) {
        const dynamicPrefetchStaleAt = bfcacheEntry.navigatedAt + _navigatereducer.STATIC_STALETIME_MS;
        if (now > dynamicPrefetchStaleAt) {
            return null;
        }
        const pendingSegment = upgradeToPendingSegment(createDetachedSegmentCacheEntry(now), _types.FetchStrategy.Full);
        const isPartial = false;
        const newEntry = fulfillSegmentCacheEntry(pendingSegment, bfcacheEntry.rsc, dynamicPrefetchStaleAt, isPartial, bfcacheEntry.varyParams, // bfcache data is concrete, never an ISR fallback.
        false, _types.FetchStrategy.Full);
        const segmentVaryPath = (0, _varypath.getSegmentVaryPathForRequest)(_types.FetchStrategy.Full, tree);
        const upserted = upsertSegmentEntry(now, map, segmentVaryPath, newEntry, // The concrete lookup path this BFCache upgrade applies to. (In
        // practice a Full request path is already fully concrete, so nothing
        // can shadow the new entry and the shadow check is a no-op.)
        tree.varyPath);
        if (upserted !== null && upserted.status === _cachemap.EntryStatus.Fulfilled) {
            return upserted;
        }
    }
    return null;
}
function pingBlockedTasks(entry) {
    const blockedTasks = entry.blockedTasks;
    if (blockedTasks !== null) {
        for (const task of blockedTasks){
            (0, _scheduler.pingPrefetchTask)(task);
        }
        entry.blockedTasks = null;
    }
}
function getHeadRequestKey(pageRequestKey) {
    return pageRequestKey + _segmentvalueencoding.HEAD_REQUEST_KEY;
}
function createMetadataRouteTree(metadataVaryPath, // The route root's prefetch hints. The head has no node of its own on the
// wire, so the route-level hint that applies to it is copied from the root.
rootPrefetchHints, // The head's payload, with the same lifetimes as a segment node's `data`
// (see RouteTree): null in the route cache, the response's decoded
// head on a navigation seed, a CacheNode on the router state.
data) {
    // The head is a one-node tree beside the route tree (see RootRouteTree). It
    // has no position in the route tree, but it's fetched, cached, compared, and
    // rendered like a segment, so it is a RouteTree node like any other.
    const metadata = {
        // The first entry of the head's vary path (see getHeadRequestKey). The
        // server knows nothing of this key; it is always asked for
        // HEAD_REQUEST_KEY, which is why the segment stays the bare marker.
        requestKey: metadataVaryPath.value,
        segment: _segmentvalueencoding.HEAD_REQUEST_KEY,
        shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(metadataVaryPath),
        refreshState: null,
        data,
        varyPath: metadataVaryPath,
        slots: null,
        // Only the static-attempt bits apply to the head: it's a route-level
        // fact ("static per-segment responses may exist for this route"), and
        // it's what lets a shell-tier cached head attempt a static head fetch
        // before deopting to a runtime request (see the shell-tier eligibility
        // check in pingSegmentBundle). The other bits describe tree structure
        // the head doesn't participate in.
        prefetchHints: rootPrefetchHints & _approutertypes.StaticAttemptHints
    };
    return metadata;
}
/**
 * Returns an equivalent tree with `data: null` at every node, cloning only
 * the subtrees that carry data. Called when a tree is stored in the route
 * cache: route cache entries live indefinitely, so retaining render output
 * there would pin RSC payloads in memory outside the segment cache's eviction
 * control. See the lifecycle note on RouteTree.
 */ function stripDataFromRouteTree(tree) {
    let clonedSlots = null;
    const slots = tree.slots;
    if (slots !== null) {
        for (const [parallelRouteKey, childTree] of slots){
            const strippedChild = stripDataFromRouteTree(childTree);
            if (strippedChild !== childTree && clonedSlots === null) {
                // Sound cast: any copied value that isn't overwritten below is one
                // where stripDataFromRouteTree returned the child unchanged, which
                // means that subtree carries no data.
                clonedSlots = new Map(slots);
            }
            if (clonedSlots !== null) {
                clonedSlots.set(parallelRouteKey, strippedChild);
            }
        }
    }
    if (tree.data === null && clonedSlots === null) {
        // Neither this node nor any descendant carries data. Reuse it as-is.
        // This is the common case for trees that never carried render output
        // (e.g. route tree prefetch responses). Sound cast for the same reason.
        return tree;
    }
    // Sound cast: clonedSlots is null here only if every child subtree was
    // verified data-free by the loop above.
    const strippedSlots = clonedSlots ?? slots;
    return {
        requestKey: tree.requestKey,
        segment: tree.segment,
        shellVaryPath: tree.shellVaryPath,
        refreshState: tree.refreshState,
        data: null,
        varyPath: tree.varyPath,
        slots: strippedSlots,
        prefetchHints: tree.prefetchHints
    };
}
function fulfillRouteCacheEntry(now, entry, root, couldBeIntercepted, canonicalUrl, renderedSearch, supportsPerSegmentPrefetching) {
    const tree = root.tree;
    const fulfilledEntry = entry;
    fulfilledEntry.status = _cachemap.EntryStatus.Fulfilled;
    fulfilledEntry.root = createRootRouteTree(stripDataFromRouteTree(tree), stripDataFromRouteTree(root.head));
    // Route structure is essentially static — it only changes on deploy.
    // Always use the static stale time.
    // NOTE: An exception is rewrites/redirects in middleware or proxy, which can
    // change routes dynamically. We have other strategies for handling those.
    //
    // If the route tree has stale inlining hints (e.g. the initial RSC payload
    // for a build-time static page, generated before collectPrefetchHints ran),
    // immediately expire the entry so it gets re-fetched with correct hints.
    // The segment data itself is still valid — only the route tree (which
    // contains the hint bits) needs to be re-fetched.
    if (tree.prefetchHints & _approutertypes.PrefetchHint.InliningHintsStale) {
        fulfilledEntry.staleAt = -1;
    } else {
        fulfilledEntry.staleAt = now + _navigatereducer.STATIC_STALETIME_MS;
    }
    fulfilledEntry.couldBeIntercepted = couldBeIntercepted;
    fulfilledEntry.canonicalUrl = canonicalUrl;
    fulfilledEntry.renderedSearch = renderedSearch;
    fulfilledEntry.supportsPerSegmentPrefetching = supportsPerSegmentPrefetching;
    pingBlockedTasks(entry);
    return fulfilledEntry;
}
function writeRouteIntoCache(now, pathname, search, nextUrl, root, couldBeIntercepted, canonicalUrl, renderedSearch, supportsPerSegmentPrefetching) {
    const pendingEntry = createDetachedRouteCacheEntry();
    const fulfilledEntry = fulfillRouteCacheEntry(now, pendingEntry, root, couldBeIntercepted, canonicalUrl, renderedSearch, supportsPerSegmentPrefetching);
    const varyPath = (0, _varypath.getFulfilledRouteVaryPath)(pathname, search, nextUrl, couldBeIntercepted);
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(routeCacheMap, varyPath, fulfilledEntry, isRevalidation);
    return fulfilledEntry;
}
function fulfillSegmentCacheEntry(segmentCacheEntry, rsc, staleAt, isPartial, varyParams, // Only static (per-segment PPR) responses can be ISR fallbacks; all other
// callers pass false. Always assigned (even when false) so that re-fulfilling
// a previously-fallback entry with a concrete response clears the flag and
// ends the retry loop.
isUpgradeableISRFallback, // The strategy tier describing the CONTENT this entry is fulfilled with —
// which comes from the response, not the tier the entry was requested at.
// Usually the two agree, but when a response's shell payload IS the full
// response (no shell/full split), shell-spawned entries are fulfilled with
// full-tier content and recorded as such (see the promotion in
// writeSegmentDataIntoCache). Always assigned, replacing
// the spawn-time strategy set by upgradeToPendingSegment; the write walks'
// matching and keying decisions all happen against the spawn-time
// strategy, before fulfillment, so they are unaffected. See
// SegmentCacheEntryShared['fetchStrategy'].
fetchStrategy) {
    const fulfilledEntry = segmentCacheEntry;
    fulfilledEntry.status = _cachemap.EntryStatus.Fulfilled;
    fulfilledEntry.rsc = rsc;
    fulfilledEntry.staleAt = staleAt;
    fulfilledEntry.isPartial = isPartial;
    fulfilledEntry.varyParams = varyParams;
    fulfilledEntry.isUpgradeableISRFallback = isUpgradeableISRFallback;
    fulfilledEntry.fetchStrategy = fetchStrategy;
    // Resolve any listeners that were waiting for this data.
    if (segmentCacheEntry.promise !== null) {
        segmentCacheEntry.promise.resolve(fulfilledEntry);
        // Free the promise for garbage collection.
        fulfilledEntry.promise = null;
    }
    pingBlockedTasks(segmentCacheEntry);
    return fulfilledEntry;
}
function rejectRouteCacheEntry(entry, staleAt) {
    const rejectedEntry = entry;
    rejectedEntry.status = _cachemap.EntryStatus.Rejected;
    rejectedEntry.staleAt = staleAt;
    pingBlockedTasks(entry);
}
function rejectSegmentCacheEntry(entry, staleAt) {
    const rejectedEntry = entry;
    rejectedEntry.status = _cachemap.EntryStatus.Rejected;
    rejectedEntry.staleAt = staleAt;
    if (entry.promise !== null) {
        // NOTE: We don't currently propagate the reason the prefetch was canceled
        // but we could by accepting a `reason` argument.
        entry.promise.resolve(null);
        entry.promise = null;
    }
    pingBlockedTasks(entry);
}
function convertRootFlightRouterStateToRouteTree(flightRouterState, renderedSearch, acc) {
    return convertFlightRouterStateToRouteTree(flightRouterState, _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY, null, renderedSearch, acc);
}
function rebaseInactiveRouteTree(treeToRebase) {
    // A parallel route slot that the target route doesn't provide keeps the
    // slot already active on the current route, under the new parent. The slot
    // sits at the same route position, so its request keys and vary paths are
    // unchanged: copy the structure and drop the payloads, which belong to the
    // previous render and are reused separately by render-tree.
    let slots = null;
    if (treeToRebase.slots !== null) {
        slots = new Map();
        for (const [parallelRouteKey, child] of treeToRebase.slots){
            slots.set(parallelRouteKey, rebaseInactiveRouteTree(child));
        }
    }
    return {
        requestKey: treeToRebase.requestKey,
        segment: treeToRebase.segment,
        varyPath: treeToRebase.varyPath,
        shellVaryPath: treeToRebase.shellVaryPath,
        refreshState: treeToRebase.refreshState,
        data: null,
        slots,
        prefetchHints: treeToRebase.prefetchHints
    };
}
function convertFlightRouterStateToRouteTree(flightRouterState, requestKey, parentPartialVaryPath, parentRenderedSearch, acc) {
    const originalSegment = flightRouterState[0];
    // This segment's param (if any) is a root param iff the segment is at or
    // above the root layout, which the server marks directly.
    const isRootParam = ((flightRouterState[4] ?? 0) & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0;
    // If the FlightRouterState has a refresh state, then this segment is part of
    // an inactive parallel route. It has a different rendered search query than
    // the outer parent route. In order to construct the inactive route correctly,
    // we must restore the query that was originally used to render it.
    const compressedRefreshState = flightRouterState[2] ?? null;
    const refreshState = compressedRefreshState !== null ? {
        canonicalUrl: compressedRefreshState[0],
        renderedSearch: compressedRefreshState[1]
    } : null;
    // Use the incoming search params, even if the response has no new data for
    // this segment. The base tree may still have the previous URL's. History
    // restores pass in their saved search params instead.
    const renderedSearch = refreshState !== null ? refreshState.renderedSearch : parentRenderedSearch;
    const tree = (0, _decodeserverresponse.createRouteTreeNode)(originalSegment, isRootParam, requestKey, parentPartialVaryPath, renderedSearch, refreshState, acc);
    const partialVaryPath = (0, _varypath.getPartialVaryPath)(tree.varyPath);
    let slots = null;
    const parallelRoutes = flightRouterState[1];
    for(let parallelRouteKey in parallelRoutes){
        const childRouterState = parallelRoutes[parallelRouteKey];
        const childSegment = childRouterState[0];
        // TODO: Eventually, the param values will not be included in the response
        // from the server. We'll instead fill them in on the client by parsing
        // the URL. This is where we'll do that.
        const childRequestKeyPart = (0, _segmentvalueencoding.createSegmentRequestKeyPart)(childSegment);
        const childRequestKey = (0, _segmentvalueencoding.appendSegmentRequestKeyPart)(requestKey, parallelRouteKey, childRequestKeyPart);
        const childTree = convertFlightRouterStateToRouteTree(childRouterState, childRequestKey, partialVaryPath, renderedSearch, acc);
        if (slots === null) {
            slots = new Map();
        }
        slots.set(parallelRouteKey, childTree);
    }
    tree.slots = slots;
    tree.prefetchHints = flightRouterState[4] ?? 0;
    return tree;
}
function convertRouteTreeToFlightRouterState(routeTree) {
    const parallelRoutes = {};
    const slots = routeTree.slots;
    if (slots !== null) {
        for (const [parallelRouteKey, childTree] of slots){
            parallelRoutes[parallelRouteKey] = convertRouteTreeToFlightRouterState(childTree);
        }
    }
    const flightRouterState = [
        routeTree.segment,
        parallelRoutes,
        null,
        null
    ];
    if (routeTree.prefetchHints !== 0) {
        flightRouterState[4] = routeTree.prefetchHints;
    }
    return flightRouterState;
}
async function fetchRouteOnCacheMiss(entry, key) {
    // This function is allowed to use async/await because it contains the actual
    // fetch that gets issued on a cache miss. Notice it writes the result to the
    // cache entry directly, rather than return data that is then written by
    // the caller.
    const pathname = key.pathname;
    const search = key.search;
    const nextUrl = key.nextUrl;
    const segmentPath = '/_tree';
    const headers = {
        [_approuterheaders.RSC_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER]: segmentPath
    };
    if (nextUrl !== null) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    try {
        const url = new URL(pathname + search, location.origin);
        let response;
        let urlAfterRedirects;
        if (isOutputExportMode) {
            // In output: "export" mode, we can't use headers to request a particular
            // segment. Instead, we encode the extra request information into the URL.
            // This is not part of the "public" interface of the app; it's an internal
            // Next.js implementation detail that the app developer should not need to
            // concern themselves with.
            //
            // For example, to request a segment:
            //
            //   Path passed to <Link>:   /path/to/page
            //   Path passed to fetch:    /path/to/page/__next-segments/_tree
            //
            //   (This is not the exact protocol, just an illustration.)
            //
            // Before we do that, though, we need to account for redirects. Even in
            // output: "export" mode, a proxy might redirect the page to a different
            // location, but we shouldn't assume or expect that they also redirect all
            // the segment files, too.
            //
            // To check whether the page is redirected, previously we perform a range
            // request of 64 bytes of the HTML document to check if the target page
            // is part of this app (by checking if build id matches). Only if the target
            // page is part of this app do we determine the final canonical URL.
            //
            // However, as mentioned in https://github.com/vercel/next.js/pull/85903,
            // some popular static hosting providers (like Cloudflare Pages or Render.com)
            // do not support range requests, in the worst case, the entire HTML instead
            // of 64 bytes could be returned, which is wasteful.
            //
            // So instead, we drops the check for build id here, and simply perform
            // a HEAD request to rejects 1xx/4xx/5xx responses, and then determine the
            // final URL after redirects.
            //
            // NOTE: We could embed the route tree into the HTML document, to avoid
            // a second request. We're not doing that currently because it would make
            // the HTML document larger and affect normal page loads.
            const headResponse = await (0, _fetch.fetch)(url, {
                method: 'HEAD'
            });
            if (headResponse.status < 200 || headResponse.status >= 400) {
                // The target page responded w/o a successful status code
                // Could be a WAF serving a 403, or a 5xx from a backend
                //
                // Note that we can't use headResponse.ok here, because
                // Response#ok returns `false` with 3xx responses.
                rejectRouteCacheEntry(entry, Date.now() + REJECTION_BACKOFF_MS);
                return null;
            }
            urlAfterRedirects = headResponse.redirected ? new URL(headResponse.url) : url;
            response = await fetchPrefetchResponse(addSegmentPathToUrlInOutputExportMode(urlAfterRedirects, segmentPath), headers);
        } else {
            // "Server" mode. We can use request headers instead of the pathname.
            // TODO: The eventual plan is to get rid of our custom request headers and
            // encode everything into the URL, using a similar strategy to the
            // "output: export" block above.
            response = await fetchPrefetchResponse(url, headers);
            urlAfterRedirects = response !== null && response.redirected ? new URL(response.url) : url;
        }
        if (!response || !response.ok || !response.body) {
            // Server responded with an error, or with a miss. We should still cache
            // the response, but we can try again after 10 seconds.
            rejectRouteCacheEntry(entry, Date.now() + REJECTION_BACKOFF_MS);
            return null;
        }
        // TODO: The canonical URL is the href without the origin. I think
        // historically the reason for this is because the initial canonical URL
        // gets passed as a prop to the top-level React component, which means it
        // needs to be computed during SSR. If it were to include the origin, it
        // would need to always be same as location.origin on the client, to prevent
        // a hydration mismatch. To sidestep this complexity, we omit the origin.
        //
        // However, since this is neither a native URL object nor a fully qualified
        // URL string, we need to be careful about how we use it. To prevent subtle
        // mistakes, we should create a special type for it, instead of just string.
        // Or, we should just use a (readonly) URL object instead. The type of the
        // prop that we pass to seed the initial state does not need to be the same
        // type as the state itself.
        const canonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(urlAfterRedirects);
        // Check whether the response varies based on the Next-Url header.
        const varyHeader = response.headers.get('vary');
        const couldBeIntercepted = varyHeader !== null && varyHeader.includes(_approuterheaders.NEXT_URL);
        // TODO: The `closed` promise was originally used to track when a streaming
        // network connection closes, so the scheduler could limit concurrent
        // connections. Now that prefetch responses are buffered, `closed` is
        // resolved immediately after buffering — before the outer function even
        // returns. This mechanism is only still meaningful for dynamic (Full)
        // prefetches, which use incremental streaming. Consider removing the
        // `closed` plumbing for buffered prefetch paths.
        const closed = (0, _promisewithresolvers.createPromiseWithResolvers)();
        // Note this doesn't imply PPR is enabled for the route: fully static
        // routes serve from the per-segment cache too. What it does tell us is
        // that per-segment prefetching is supported, which is what the route
        // entry records below.
        const supportsPerSegmentPrefetching = wasServedFromPerSegmentCache(response);
        // Decode the response. Routes that support per-segment prefetching
        // respond from static storage; other routes respond with a live render
        // (see the isRouteTreePrefetchRequest branch in
        // walk-tree-with-flight-router-state). Both are
        // NavigationFlightResponses carrying a buildId and a structure-only
        // transport tree — which is all this flow reads — so one decode path
        // serves both.
        const buffer = await bufferPrefetchResponseBody(response.body);
        closed.resolve();
        (0, _cachemap.setSizeInCacheMap)(entry, buffer.byteLength);
        const serverData = await (0, _fetchserverresponse.decodeBufferedStage)(buffer, headers);
        if ((response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverData.b) !== (0, _navigationbuildid.getNavigationBuildId)()) {
            // The server build does not match the client. Treat as a 404. During
            // an actual navigation, the router will trigger an MPA navigation.
            // TODO: We should cache the fact that this is an MPA navigation.
            rejectRouteCacheEntry(entry, Date.now() + REJECTION_BACKOFF_MS);
            return null;
        }
        const transportData = serverData.t;
        if (transportData === undefined || serverData.n !== undefined) {
            // The response carries no route tree (e.g. it's an MPA navigation), so
            // there's nothing to cache.
            rejectRouteCacheEntry(entry, Date.now() + REJECTION_BACKOFF_MS);
            return null;
        }
        // Get the params that were used to render the target page. These may
        // be different from the params in the request URL, if the page
        // was rewritten. The rendered pathname is also used to fill in the param
        // values the server omitted from the response (omitting them keeps the
        // response cacheable across param values).
        const renderedPathname = (0, _routeparams.getRenderedPathname)(response);
        const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
        // Decode the server-sent tree into the RouteTree format used by the
        // client cache.
        //
        // During this traversal, we accumulate additional data into this
        // "accumulator" object.
        const acc = {
            metadataVaryPath: null,
            treeDivergedFromBase: false
        };
        const routeTree = (0, _decodeserverresponse.decodeTransportTreeIntoRouteTree)(transportData.t, null, // The tree is structure-only (no data nodes), so there are no vary
        // params to decode...
        null, // ...and no partiality either; the conservative value is never read.
        true, renderedPathname, renderedSearch, acc);
        const metadataVaryPath = acc.metadataVaryPath;
        if (metadataVaryPath === null) {
            rejectRouteCacheEntry(entry, Date.now() + REJECTION_BACKOFF_MS);
            return null;
        }
        (0, _optimisticroutes.discoverKnownRoute)(Date.now(), pathname, search, nextUrl, entry, {
            tree: routeTree,
            head: createMetadataRouteTree(metadataVaryPath, routeTree.prefetchHints, null)
        }, couldBeIntercepted, canonicalUrl, renderedSearch, supportsPerSegmentPrefetching, false // hasDynamicRewrite
        );
        if (!couldBeIntercepted) {
            // This route will never be intercepted. So we can use this entry for all
            // requests to this route, regardless of the Next-Url header. This works
            // because when reading the cache we always check for a valid
            // non-intercepted entry first.
            // Re-key the entry. The `set` implementation handles removing it from
            // its previous position in the cache. We don't need to do anything to
            // update the LRU, because the entry is already in it.
            // TODO: Treat this as an upsert — should check if an entry already
            // exists at the new keypath, and if so, whether we should keep that
            // one instead.
            const fulfilledVaryPath = (0, _varypath.getFulfilledRouteVaryPath)(pathname, search, nextUrl, couldBeIntercepted);
            const isRevalidation = false;
            (0, _cachemap.setInCacheMap)(routeCacheMap, fulfilledVaryPath, entry, isRevalidation);
        }
        // Return a promise that resolves when the network connection closes, so
        // the scheduler can track the number of concurrent network connections.
        return {
            value: null,
            closed: closed.promise
        };
    } catch (error) {
        // Either the connection itself failed, or something bad happened while
        // decoding the response.
        rejectRouteCacheEntry(entry, getPrefetchErrorStaleAt(error));
        return null;
    }
}
// When a static (per-segment PPR) prefetch receives an upgradeable fallback
// shell, the localized retry loop re-issues the same fetch after this delay to
// pick up the concrete version once the server's background regeneration
// finishes.
const FALLBACK_RETRY_DELAY_MS = 2000;
// Maximum number of fallback retries per task, to avoid looping indefinitely
// if the server keeps returning a fallback (e.g. misconfiguration).
const MAX_FALLBACK_RETRIES = 3;
async function fetchSegmentPrefetchesUsingStaticRequest(task, route, routeKey, tree, // The pending cache entries this task spawned for the bundle, keyed by
// segment request key. The response fulfills them when it arrives.
spawnedEntries, // Which walk spawned the bundle's entries. The request on the wire is
// identical either way; this only decides which payload of the response
// fulfills the entries.
fetchStrategy) {
    // This function is allowed to use async/await because it contains the actual
    // fetch that gets issued on a cache miss. Notice it writes the result to the
    // cache entry directly, rather than return data that is then written by
    // the caller.
    //
    // Segment fetches are non-blocking so we don't need to ping the scheduler
    // on completion.
    let isUpgradeableISRFallback;
    try {
        isUpgradeableISRFallback = await fetchAndWritePerSegmentPrefetchResponse(task, route, routeKey, tree, spawnedEntries, fetchStrategy, // Write the response even if it's an upgradeable fallback shell — the
        // fallback content is better than nothing while the retry loop waits
        // for the concrete version.
        false);
    } catch (error) {
        // The connection failed, or the response couldn't be decoded. Reject the
        // pending entries so they don't stay Pending forever, and get retried
        // once the entry expires.
        rejectSegmentEntriesIfStillPending(spawnedEntries, getPrefetchErrorStaleAt(error));
        return null;
    }
    if (isUpgradeableISRFallback === null) {
        // The response was fetched but isn't usable yet (server error/miss, empty
        // data, or a build-id mismatch — the server may be transiently unready).
        // Reject with a short backoff so the entries are retried soon.
        rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + REJECTION_BACKOFF_MS);
        return null;
    }
    return {
        value: null,
        // The response is fully buffered before it's decoded, so the network
        // connection is already closed by the time the fetch returns. See TODO
        // in fetchRouteOnCacheMiss about removing `closed` for buffered
        // prefetch paths.
        closed: Promise.resolve()
    };
}
/**
 * Issues a single segment-bundle prefetch request, validates and decodes the
 * response, and writes every payload of it into the cache — the full
 * payload, and, when the response carries a shell byte boundary, a second
 * decode of the same bytes truncated at that boundary, the segments'
 * shell-stage variant — through the shared payload-write orchestration
 * (writeResponsePayloadsIntoCache), which owns which payload fulfills the
 * spawned entries and the tier each payload is written at.
 *
 * Returns whether the response was an upgradeable ISR fallback shell (the
 * page hadn't been prerendered with concrete params yet), or `null` if the
 * response was fetched but isn't usable yet (server error/miss, empty data,
 * or a build-id mismatch — the server may be transiently unready, so it's
 * worth retrying; nothing is written and no entries are rejected). THROWS if
 * the connection failed or the response couldn't be decoded; re-issuing the
 * identical request won't fix that, so callers should give up rather
 * than retry.
 *
 * When the response is an upgradeable fallback shell, this also starts the
 * task's localized fallback-retry loop (at most one per task, ever), BEFORE
 * writing the fallback content — see the comment on the transition below.
 *
 * Calling this again with the same arguments reproduces the exact same
 * request. The retry loop uses that to re-issue the request until the server
 * has the concrete version, passing `discardFallbackResponse` so a response
 * that is STILL a fallback isn't pointlessly re-written over the identical
 * fallback content the initial fetch already cached. (The retry's entries
 * are already settled, so its writes are all detached upserts.)
 */ async function fetchAndWritePerSegmentPrefetchResponse(task, route, routeKey, tree, spawnedEntries, fetchStrategy, // When true, a response that is still an upgradeable fallback shell is
// discarded instead of written (the fallback-retry loop's re-issued
// requests).
discardFallbackResponse) {
    // Use the canonical URL to request the segment, not the original URL. These
    // are usually the same, but the canonical URL will be different if the route
    // tree response was redirected. To avoid an extra waterfall on every segment
    // request, we pass the redirected URL instead of the original one.
    const url = new URL(route.canonicalUrl, location.origin);
    const nextUrl = routeKey.nextUrl;
    let normalizedRequestKey;
    if (tree.segment === _segmentvalueencoding.HEAD_REQUEST_KEY) {
        // The head's request key is its client cache identity; the server only
        // knows the head by its bare marker, which is also the head node's
        // segment (see createMetadataRouteTree).
        normalizedRequestKey = _segmentvalueencoding.HEAD_REQUEST_KEY;
    } else if (tree.requestKey === _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY) {
        // The root segment is a special case. To simplify the server-side
        // handling of these requests, we encode the root segment path as
        // `_index` instead of as an empty string. This should be treated as
        // an implementation detail and not as a stable part of the protocol.
        // It just needs to match the equivalent logic that happens when
        // prerendering the responses. It should not leak outside of Next.js.
        normalizedRequestKey = '/_index';
    } else {
        normalizedRequestKey = tree.requestKey;
    }
    const headers = {
        [_approuterheaders.RSC_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER]: normalizedRequestKey
    };
    if (nextUrl !== null) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    const requestUrl = isOutputExportMode ? addSegmentPathToUrlInOutputExportMode(url, normalizedRequestKey) : url;
    const response = await fetchPrefetchResponse(requestUrl, headers);
    if (!response || !response.ok || // Theoretically this check should never fail, because we only issue
    // requests for segments once we've verified that the route supports PPR.
    !wasServedFromPerSegmentCache(response) || !response.body) {
        // Server responded with an error or a miss — fetched but not usable.
        return null;
    }
    const buffer = await bufferPrefetchResponseBody(response.body);
    // Parse the response. Always a PrefetchFlightResponse. A connection drop
    // or malformed stream throws here, which propagates to the caller as a
    // non-retryable failure.
    const serverResponse = await (0, _fetchserverresponse.decodeBufferedStage)(buffer, headers);
    if (serverResponse.t === undefined) {
        // The response carries no segment data at all — not usable.
        // writeServerResponseIntoCache checks this again, but this fetch-layer
        // copy is deliberate: it must run before the fallback-retry loop is
        // started and before the payload writes below, neither of which should
        // happen for an empty response.
        return null;
    }
    if ((response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverResponse.b) !== (0, _navigationbuildid.getNavigationBuildId)()) {
        // The server build does not match the client. Treat as a 404. During
        // an actual navigation, the router will trigger an MPA navigation.
        return null;
    }
    // True if the server served an upgradeable fallback shell (the page hadn't
    // been prerendered with concrete params yet, but the route can be
    // upgraded once the server's background regeneration finishes).
    const isUpgradeableISRFallback = serverResponse.f === true;
    if (isUpgradeableISRFallback) {
        if (discardFallbackResponse) {
            // Still a fallback — the server hasn't finished regenerating. Don't
            // write it; the retry loop will re-issue the request.
            return true;
        }
        // Drive a localized retry loop to pick up the concrete version once the
        // server's background regeneration finishes. Only the first fallback
        // response per task starts a loop (`fallbackRetryStatus === Empty`);
        // once it leaves Empty, no second loop is started — sibling bundle
        // responses that also got a fallback don't, and neither does a re-hover.
        //
        // The transition to Pending must happen BEFORE the fallback content is
        // written below: fulfilling an entry pings the tasks blocked on it, and
        // a scheduler pass that ran before the transition would observe a
        // fulfilled fallback entry with the retry gate still Empty and spawn a
        // duplicate revalidation request (see isUpgradeableISRFallbackRetry in
        // pingSegmentBundle in scheduler.ts).
        if (task.fallbackRetryStatus === _cachemap.EntryStatus.Empty && !task.isCanceled) {
            task.fallbackRetryStatus = _cachemap.EntryStatus.Pending;
            // Fire-and-forget: the loop drives itself via timers and pings the
            // task on success.
            void retryUpgradeableFallbackPrefetch(task, route, routeKey, tree, spawnedEntries, fetchStrategy);
        }
    }
    // Extract the shell payload, if the response carries a distinct one
    // (positive shell byte offset): decode the buffered bytes a SECOND time,
    // truncated at the boundary. The truncation is what produces the shell
    // variant: each segment's param-dependent rows land past the boundary and
    // decode as still-pending, which renders as the param fallback. It also
    // rewinds the response's signals — `needsRuntimeRequest` and `isPartial`
    // fulfillments past the boundary read as pending in this decode, so a
    // post-shell runtime-data access doesn't mark the shell variant itself as
    // needing a runtime request.
    // (A 0 offset means the response carries no shell: the server emits a
    // fulfilled 0 when the page wasn't staged at all — see the `a` resolution
    // in collect-segment-data — and 0 is also the default read of an
    // unfulfilled `a`, which would be a Next.js bug since the full buffer is
    // present. Both read the same here: no shell, and the scheduler skips the
    // affected segments rather than falling back to a runtime request — see
    // the no-shell handling in writeResponsePayloadsIntoCache. Failing in that
    // direction costs a shell prefetch but never leaks post-shell content into
    // shell positions. 0 can double as "none" on the wire precisely because
    // it's never a valid offset — see the `a` field doc on
    // NavigationFlightResponse.)
    const shellOffset = serverResponse.a !== undefined ? (0, _rsctransport.readFulfilledValue)(serverResponse.a, 0) : 0;
    let shellResponse;
    if (shellOffset === null) {
        shellResponse = serverResponse;
    } else if (shellOffset === 0) {
        shellResponse = null;
    } else {
        try {
            shellResponse = await (0, _fetchserverresponse.decodeBufferedStage)(buffer.subarray(0, shellOffset), headers);
        } catch  {
            // The truncated prefix couldn't be decoded. Treat it as if no shell
            // exists; the full payload is still usable. (For a StaticShell-spawned
            // bundle this means the spawned entries are rejected — the scheduler
            // then skips them rather than issuing a runtime substitute; see the
            // no-shell handling in writeResponsePayloadsIntoCache.)
            shellResponse = null;
        }
    }
    // The pathname the page was rendered for, derived the same way the route
    // tree fetch derives it (the rewritten-path header when the request was
    // rewritten, the request URL otherwise) so the vary paths computed from
    // this response's decoded tree agree with the ones on the route entry's
    // tree. In output: "export" mode the response URL has the segment filename
    // appended to the pathname, so derive it from the page URL instead
    // (rewrites don't exist on a static host).
    const renderedPathname = isOutputExportMode ? (0, _routeparams.getPathnameFromRequestURL)(url) : (0, _routeparams.getRenderedPathname)(response);
    // Write the payloads into the cache. Each payload is decoded like any
    // other server response — a root-anchored tree plus an optional head, with
    // no base overlay (the response covers its own spine) — and written
    // through the same path as a live-render response. Notes on the
    // arguments:
    // - Dynamic segments the server sent without a param value (`k: null`) are
    //   parsed from the rendered pathname, and the rendered search is the one
    //   the route tree was built with, so the decoded tree's vary paths agree
    //   with the ones on the route entry's tree.
    // - The build id was already verified above, so none is passed.
    // - The response-level staleness is only a fallback, for segments that
    //   don't carry their own staleTime (per-segment responses normally
    //   always do).
    // - Response-level partiality is unused for per-segment writes — each
    //   segment (and the head) carries its own partiality via the staged
    //   promise encoding, which the decode reads in preference to the
    //   response-level value — so the conservative value (true) is passed.
    // - The head is keyed at the route's own metadata vary path: the head has
    //   no tree position, so the decode could only derive a vary path for it
    //   from a page node in the payload's own tree. A per-segment response
    //   carries only the spine from the root to the requested segment, so any
    //   response whose terminal isn't a page has no page node to key the head
    //   from; the standalone head response is one such case.
    const now = Date.now();
    const metadataVaryPath = route.root.head.varyPath;
    writeResponsePayloadsIntoCache(now, fetchStrategy, serverResponse, shellResponse, null, // The payloads are root-anchored (no base tree), so there's no
    // prediction to diverge from.
    null, renderedPathname, route.renderedSearch, undefined, now + _navigatereducer.STATIC_STALETIME_MS, true, metadataVaryPath, spawnedEntries, buffer.byteLength, task.segmentCacheMap);
    return isUpgradeableISRFallback;
}
/**
 * Reads a stale-at time from the staleTime async iterable of a fully-buffered
 * response — stage decodes, which go through
 * `bufferPrefetchResponseBody`. Drains synchronously via
 * `readFulfilledStaleTimeSeconds` (see decode-server-response). A missing
 * iterable, or a truncated shell decode whose value landed past the
 * boundary, reads as absent and falls back to the static stale time.
 *
 * For the one response kind that isn't buffered when read — a dynamic `Full`
 * response (fetchStrategy.Full with Partial Prefetching disabled) — use
 * `resolveStaleAt` instead, since its values aren't materialized synchronously.
 */ function readFulfilledStaleAt(now, staleTime) {
    if (staleTime === undefined) {
        return now + _navigatereducer.STATIC_STALETIME_MS;
    }
    const staleTimeSeconds = (0, _decodeserverresponse.readFulfilledStaleTimeSeconds)(staleTime);
    if (staleTimeSeconds === null) {
        return now + _navigatereducer.STATIC_STALETIME_MS;
    }
    return now + getStaleTimeMs(staleTimeSeconds);
}
/**
 * The localized retry loop for an upgradeable fallback shell. Re-issues the
 * exact same segment-bundle request up to MAX_FALLBACK_RETRIES times,
 * FALLBACK_RETRY_DELAY_MS apart, until the server returns the concrete
 * (upgraded) version. The fetch writes the upgraded response through the
 * same payload writes as the initial fetch, so every slot the initial fetch
 * wrote — including the shell paths, even when the upgraded response is
 * fully static (shell === full) — is upgraded; the spawned entries were
 * already settled by the initial fetch, so every write is a detached upsert
 * that replaces the fallback. On success the loop pings the task, so the
 * task's *other* fallback segments get re-attempted. If every attempt is
 * still a fallback (or fails), it gives up.
 *
 * A loop runs at most once per task, ever (fetchAndWritePerSegmentPrefetchResponse
 * gates on `fallbackRetryStatus === Empty`, set to `Pending` before this runs
 * and never reset to `Empty`). The sleep timer is never `clearTimeout`-ed, so
 * the awaited sleep always settles; the loop simply checks `isCanceled` after
 * waking and bails if the task was canceled in the meantime. On success the
 * status becomes `Fulfilled`; on any non-success exit (exhausted retries,
 * fetch error, or cancel) it becomes `Rejected`.
 */ async function retryUpgradeableFallbackPrefetch(task, route, routeKey, tree, spawnedEntries, // The strategy the initial fetch wrote its payloads with.
fetchStrategy) {
    for(let attempt = 0; attempt < MAX_FALLBACK_RETRIES; attempt++){
        await new Promise((resolve)=>setTimeout(resolve, FALLBACK_RETRY_DELAY_MS));
        if (task.isCanceled) {
            break;
        }
        let isUpgradeableISRFallback;
        try {
            isUpgradeableISRFallback = await fetchAndWritePerSegmentPrefetchResponse(task, route, routeKey, tree, spawnedEntries, fetchStrategy, // A response that is still a fallback shell is discarded rather than
            // pointlessly re-written over the identical fallback content the
            // initial fetch already cached.
            true);
        } catch  {
            break;
        }
        if (task.isCanceled) {
            break;
        }
        if (isUpgradeableISRFallback === null) {
            continue;
        }
        if (isUpgradeableISRFallback) {
            continue;
        }
        // Success: the server returned the concrete (upgraded) version, and the
        // fetch wrote it into the cache. The task's other fallback segments are
        // now allowed to revalidate.
        task.fallbackRetryStatus = _cachemap.EntryStatus.Fulfilled;
        (0, _scheduler.pingPrefetchTask)(task);
        return;
    }
    // The loop finished without success (exhausted its retries, broke out on a
    // fetch error, or the task was canceled). It won't run again for this task.
    task.fallbackRetryStatus = _cachemap.EntryStatus.Rejected;
}
async function fetchSegmentPrefetchesUsingRuntimeRequest(task, route, fetchStrategy, requestTree, spawnedEntries) {
    const key = task.key;
    const url = new URL(route.canonicalUrl, location.origin);
    const nextUrl = key.nextUrl;
    // When the request tree was derived from a predicted route entry, pass the
    // node it was predicted from to the write path so the prediction can be
    // disabled if the server's rendered tree diverges from it. For an entry
    // the server resolved this is null: a divergence from it says nothing
    // about route prediction, and its unfulfilled entries take the usual
    // backoff.
    let dynamicRequestTree;
    let predictedFrom;
    if (spawnedEntries.size === 1 && spawnedEntries.has(route.root.head.requestKey)) {
        // Only the head is pending, so ask the server for metadata only: it skips
        // the segments and renders just the head. The stub is not derived from
        // the route entry, so divergence from it carries no signal.
        dynamicRequestTree = MetadataOnlyRequestTree;
        predictedFrom = null;
    } else {
        dynamicRequestTree = requestTree;
        predictedFrom = route.predictedFrom;
    }
    const headers = {
        [_approuterheaders.RSC_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_STATE_TREE_HEADER]: (0, _flightdatahelpers.prepareFlightRouterStateForRequest)(dynamicRequestTree)
    };
    if (nextUrl !== null) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    switch(fetchStrategy){
        case _types.FetchStrategy.Full:
            {
                break;
            }
        case _types.FetchStrategy.PPRRuntime:
            {
                headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] = '2';
                break;
            }
        case _types.FetchStrategy.RuntimeShell:
            {
                headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] = '3';
                break;
            }
        case _types.FetchStrategy.LoadingBoundary:
            {
                headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] = '1';
                break;
            }
        default:
            {
                fetchStrategy;
            }
    }
    try {
        const response = await fetchPrefetchResponse(url, headers);
        if (!response || !response.ok || !response.body) {
            // Server responded with an error, or with a miss. We should still cache
            // the response, but we can try again after 10 seconds.
            rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + REJECTION_BACKOFF_MS);
            return null;
        }
        const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
        if (renderedSearch !== route.renderedSearch) {
            // The search params that were used to render the target page are
            // different from the search params in the request URL. This only happens
            // when there's a dynamic rewrite in between the tree prefetch and the
            // data prefetch.
            // TODO: For now, since this is an edge case, we reject the prefetch, but
            // the proper way to handle this is to evict the stale route tree entry
            // then fill the cache with the new response.
            rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + REJECTION_BACKOFF_MS);
            return null;
        }
        // Track when the network connection closes. Only meaningful for Full
        // (dynamic) prefetches which use incremental streaming. For buffered
        // paths, this is resolved immediately — see TODO in fetchRouteOnCacheMiss.
        const closed = (0, _promisewithresolvers.createPromiseWithResolvers)();
        let fulfilledEntries = null;
        let bufferedResponseSize = null;
        let serverDataPromise;
        if (fetchStrategy === _types.FetchStrategy.Full) {
            // Full prefetches are dynamic responses stored in the prefetch cache.
            // They don't carry vary params or other cache metadata, so there's no
            // need to buffer them. Use the incremental version to allow data to be
            // processed as it arrives.
            const prefetchStream = createIncrementalPrefetchResponseStream(response.body, closed.resolve, function onResponseSizeUpdate(totalBytesReceivedSoFar) {
                // When processing a dynamic response, we don't know how large each
                // individual segment is, so approximate by assigning each segment
                // the average of the total response size.
                if (fulfilledEntries === null) {
                    // Haven't received enough data yet to know which segments
                    // were included.
                    return;
                }
                const averageSize = totalBytesReceivedSoFar / fulfilledEntries.length;
                for (const entry of fulfilledEntries){
                    (0, _cachemap.setSizeInCacheMap)(entry, averageSize);
                }
            });
            serverDataPromise = (0, _fetchserverresponse.createFromNextReadableStream)(prefetchStream, headers, {
                allowPartialStream: true
            });
        } else {
            const buffer = await bufferPrefetchResponseBody(response.body);
            closed.resolve();
            bufferedResponseSize = buffer.byteLength;
            serverDataPromise = (0, _fetchserverresponse.decodeBufferedStage)(buffer, headers);
        }
        const [serverData, cacheData] = await Promise.all([
            serverDataPromise,
            response.cacheData
        ]);
        const now = Date.now();
        const staleAt = await resolveStaleAt(now, serverData.s, response);
        const buildId = response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverData.b;
        // Extract the response's shell-stage payload, when it carries one. No
        // shell can be extracted without cache metadata (only present when
        // Cached Navigations is enabled); for responses without a distinct
        // shell stage the extraction is a no-op anyway
        // (`resolveShellStageResponse` returns null), so the null check just
        // short-circuits that case.
        const shellResponse = cacheData !== null ? await (0, _fetchserverresponse.resolveShellStageResponse)(cacheData, serverData, headers) : null;
        // Runtime prefetch responses (PPRRuntime and RuntimeShell requests) are
        // partial when the server marks the response as '~' (Partial).
        // Full/LoadingBoundary prefetch responses are always complete.
        const isFullResponsePartial = (fetchStrategy === _types.FetchStrategy.PPRRuntime || fetchStrategy === _types.FetchStrategy.RuntimeShell) && (cacheData?.isResponsePartial ?? false);
        // Aside from writing the data into the cache, this also returns the
        // entries that were fulfilled, so we can streamingly update their sizes
        // in the LRU as more data comes in (Full responses, which stream).
        fulfilledEntries = writeResponsePayloadsIntoCache(now, fetchStrategy, serverData, shellResponse, dynamicRequestTree, predictedFrom, // Navigation responses always include the param values in the tree, so
        // there's no pathname to parse them from (nor a need to).
        null, renderedSearch, buildId, staleAt, isFullResponsePartial, null, spawnedEntries, bufferedResponseSize, task.segmentCacheMap);
        // Return a promise that resolves when the network connection closes, so
        // the scheduler can track the number of concurrent network connections.
        return {
            value: null,
            closed: closed.promise
        };
    } catch (error) {
        rejectSegmentEntriesIfStillPending(spawnedEntries, getPrefetchErrorStaleAt(error));
        return null;
    }
}
function rejectSegmentEntriesIfStillPending(entries, staleAt) {
    for (const entry of entries.values()){
        if (entry.status === _cachemap.EntryStatus.Pending) {
            rejectSegmentCacheEntry(entry, staleAt);
        }
    }
}
/**
 * Writes a prefetch response's payloads into the cache: the full payload,
 * plus its shell payload when the response carries one. This is the write
 * orchestration shared by the prefetch response kinds — per-segment
 * static responses (fetchAndWritePerSegmentPrefetchResponse) and
 * live-render responses (fetchSegmentPrefetchesUsingRuntimeRequest, and the
 * embedded runtime prefetch stream via writeRuntimePrefetchStreamIntoCache)
 * — which differ in how they obtain their payloads but not in what must
 * happen to them.
 *
 * Returns the entries the fulfilling payload's write produced content into
 * (so the streaming caller can keep updating their LRU sizes as bytes
 * arrive), or null if nothing entered the cache.
 */ function writeResponsePayloadsIntoCache(now, // The strategy of the request that produced the response. Decides which
// payload fulfills the spawned entries and their keying, and identifies
// the response family: PPR/StaticShell are per-segment static responses,
// everything else a live-render response.
fetchStrategy, fullPayload, // The response's shell payload: null (the response carries no shell),
// `fullPayload` itself (the shell IS the full response), or a distinct
// stage decode truncated at the shell byte boundary.
shellPayload, // The next five are threaded through to every write; see
// writeServerResponseIntoCache for their meaning.
baseTree, predictedFrom, renderedPathname, renderedSearch, buildId, // Response-level staleness of the full payload. The shell payload's own
// staleness is read off the shell decode below (a shell payload is always
// fully buffered).
staleAt, // Whether anything in the full payload is not fully resolved (dynamic or runtime holes, anything suspended). Shell-tier
// writes don't consume it: a shell payload is partial by construction.
// (Per-segment payloads encode partiality per node and ignore the
// response-level value entirely.)
isFullResponsePartial, metadataVaryPath, // The pending entries this response fulfills. Null when the caller owns
// none (the embedded runtime prefetch stream), in which case every write
// is a detached upsert.
spawnedEntries, // The response's size in bytes, distributed across the entries the
// fulfilling payload's write produced; null when unknown (streamed Full
// responses — the caller sizes those incrementally as bytes
// arrive instead).
responseByteLength, // The map the work that spawned this response's request is bound to. See
// writeServerResponseIntoCache.
map) {
    let fulfilledEntries;
    if (shellPayload === null || // `FetchStrategy.LoadingBoundary` is not used in Cache Components,
    // and we only recover shells in Cache Components.
    fetchStrategy === _types.FetchStrategy.LoadingBoundary) {
        if (fetchStrategy === _types.FetchStrategy.StaticShell) {
            // A static shell was requested but the response carries no shell (its
            // shell byte offset read as 0 — a bug in Next.js itself — or the
            // shell prefix couldn't be decoded). The full payload is still
            // usable, so it's written detached at the concrete tier; the spawned
            // entries are rejected so the task isn't stranded blocking on them.
            // Note the scheduler does NOT fall back to a runtime request for
            // rejected segments — it skips them outright (see the Rejected case
            // in pingSegmentBundle in scheduler.ts), so these segments get no
            // shell prefetch and no runtime substitute until the rejection's
            // backoff expires.
            writeServerResponseIntoCache(now, _types.FetchStrategy.PPR, fullPayload, baseTree, predictedFrom, renderedPathname, renderedSearch, buildId, staleAt, isFullResponsePartial, metadataVaryPath, null, null, map);
            if (spawnedEntries !== null) {
                rejectSegmentEntriesIfStillPending(spawnedEntries, now + REJECTION_BACKOFF_MS);
            }
            return null;
        }
        // This request either:
        // - didn't allow recovering a shell (no staged rendering),
        // - or was a (runtime) shell request (that was NOT served by a fully static prerender)
        //   so we already have a shell without recovering anything.
        // In either case, we don't have anything to consider other than the request itself,
        // so the payload simply fulfills the spawned entries at the request's own keying.
        fulfilledEntries = writeServerResponseIntoCache(now, fetchStrategy, fullPayload, baseTree, predictedFrom, renderedPathname, renderedSearch, buildId, staleAt, isFullResponsePartial, metadataVaryPath, spawnedEntries, null, map);
    } else if (shellPayload === fullPayload) {
        // The shell IS the full response (reference-equal — a page with nothing
        // below its shell). One payload fulfills the spawned entries, recording
        // the strategy that describes the CONTENT — the full payload's tier.
        // The content tier also drives the entries' keying: content that isn't
        // shell-grade is param-independent only on the server's vary-params
        // evidence, so it must not be parked in the shell slot on the strength
        // of the missing split alone (see the keying derivation in
        // writeSegmentDataIntoCache).
        let contentFetchStrategy;
        switch(fetchStrategy){
            case _types.FetchStrategy.StaticShell:
                {
                    // a StaticShell always uses a PPR-tier request, so we need to fulfill
                    // the spawned shell entries at the PPR tier.
                    contentFetchStrategy = _types.FetchStrategy.PPR;
                    break;
                }
            case _types.FetchStrategy.RuntimeShell:
                {
                    // a runtime shell request is not normally rewindable, but fully static pages
                    // the server will return a static prerender result, which *is* rewindable.
                    contentFetchStrategy = _types.FetchStrategy.PPRRuntime;
                    break;
                }
            case _types.FetchStrategy.PPR:
            case _types.FetchStrategy.PPRRuntime:
            case _types.FetchStrategy.Full:
                {
                    // No shell was requested, so we don't need to override the fetch strategy.
                    contentFetchStrategy = null;
                }
        }
        fulfilledEntries = writeServerResponseIntoCache(now, fetchStrategy, fullPayload, baseTree, predictedFrom, renderedPathname, renderedSearch, buildId, staleAt, isFullResponsePartial, metadataVaryPath, spawnedEntries, contentFetchStrategy, map);
    } else {
        // The shell is a strict prefix of the response. Write both payloads.
        // The payload matching the tier the spawned entries were requested at
        // fulfills them; the other is written detached (no owned entries —
        // every write is an upsert). Fulfilling a spawned shell entry with the
        // concrete payload would store content that doesn't match the entry's
        // shell vary path — wrong for every later read at that key, and
        // immediately observable during a navigation, where a pending entry can
        // be rendered as a promise that resolves to its eventual value.
        //
        // The full payload is written first. The order is not observable: the
        // two writes key at different tiers, upsert precedence between a full
        // payload and its own shell payload is order-independent (the full
        // payload always wins the comparison — a shell segment is never
        // complete where its full counterpart is partial, see
        // readFulfilledIsPartial), and fulfillment pings only enqueue scheduler
        // work that runs after this synchronous block. Full-first is preferred
        // so the shell write's precedence checks and shadow eviction compare
        // against the fresh concrete entry rather than whatever stale entry
        // preceded it.
        let responseFetchStrategy;
        let shellFetchStrategy;
        switch(fetchStrategy){
            case _types.FetchStrategy.StaticShell:
            case _types.FetchStrategy.PPR:
                {
                    // Static request.
                    // a StaticShell fetch strategy performs a request that returns
                    // a PPR-tier response that can be rewound to a StaticShell response,
                    // So we upgrade the full response's strategy to `PPR`.
                    // (A static response's tier may be raised if we know that a static request
                    // would satisfy a runtime request -- see `recordedFetchStrategy` in
                    // `writeSegmentDataIntoCache`)
                    responseFetchStrategy = _types.FetchStrategy.PPR;
                    shellFetchStrategy = _types.FetchStrategy.StaticShell;
                    break;
                }
            case _types.FetchStrategy.RuntimeShell:
                {
                    // A runtime shell request is normally not rewindable -- it only produces
                    // the shell itself. However, if a page is fully static, a runtime shell
                    // will return a static prerender, i.e. the static content with an embedded shell.
                    // The page is static, so we can treat the content as runtime-complete.
                    responseFetchStrategy = _types.FetchStrategy.PPRRuntime;
                    shellFetchStrategy = _types.FetchStrategy.RuntimeShell;
                    break;
                }
            case _types.FetchStrategy.PPRRuntime:
                {
                    // A runtime prefetch response can be rewound into a runtime shell.
                    // (This may also be a fully static response, same as RuntimeShell above,
                    // in which case we also know that the shell is equivalent to a runtime shell)
                    responseFetchStrategy = _types.FetchStrategy.PPRRuntime;
                    shellFetchStrategy = _types.FetchStrategy.RuntimeShell;
                    break;
                }
            case _types.FetchStrategy.Full:
                {
                    // Navigation responses can be rewound into a *static* app shell.
                    // On PPF routes they also contain a runtime prefetch stream which will give us
                    // a runtime shell/prefetch, but that's handled separately from the main response.
                    // (see `writeRuntimePrefetchStreamIntoCache`)
                    responseFetchStrategy = _types.FetchStrategy.Full;
                    shellFetchStrategy = _types.FetchStrategy.StaticShell;
                    break;
                }
        }
        // We have to fulfill the correct pending entries depending on what was requested:
        // - If we originally needed a shell but and got more content, the spawned entries
        //   should be fulfilled using the shell.
        // - If we needed a speculative or full request but rewound it into a shell,
        //   the spawned entries should be fulfilled using the full response.
        const wasShellRequested = fetchStrategy === _types.FetchStrategy.StaticShell || fetchStrategy === _types.FetchStrategy.RuntimeShell;
        const fullFulfilledEntries = writeServerResponseIntoCache(now, responseFetchStrategy, fullPayload, baseTree, predictedFrom, renderedPathname, renderedSearch, buildId, staleAt, isFullResponsePartial, metadataVaryPath, wasShellRequested ? null : spawnedEntries, null, map);
        const shellFulfilledEntries = writeServerResponseIntoCache(now, shellFetchStrategy, shellPayload, baseTree, predictedFrom, renderedPathname, renderedSearch, buildId, // The shell payload carries its own staleness, independent of the
        // full payload's. Shell decodes are fully buffered, so it's read
        // synchronously; when absent (per-segment responses carry staleTime
        // per node instead) this falls back to the same static stale time the
        // per-segment writes use as their response-level fallback.
        readFulfilledStaleAt(now, shellPayload.s), // A shell payload is a strict subset of the full response, so it does
        // not represent the entire UI of the target page — it's partial
        // by construction.
        true, metadataVaryPath, wasShellRequested ? spawnedEntries : null, null, map);
        fulfilledEntries = wasShellRequested ? shellFulfilledEntries : fullFulfilledEntries;
    }
    // Entries created by a detached write aren't sized: one wire response is
    // only charged to the LRU once, to the entries it fulfilled.
    if (responseByteLength !== null && fulfilledEntries !== null && fulfilledEntries.length > 0) {
        const averageSize = responseByteLength / fulfilledEntries.length;
        for (const entry of fulfilledEntries){
            (0, _cachemap.setSizeInCacheMap)(entry, averageSize);
        }
    }
    return fulfilledEntries;
}
/**
 * Writes a decoded server response into the segment cache: decodes the
 * response's transport tree into a RouteTree — overlaid on `baseTree` when
 * the response is an overlay over existing client state, root-anchored when
 * it covers its own spine (per-segment prefetch payloads) — then writes
 * every rendered segment, plus the head, into the cache. Fulfills the
 * entries in `spawnedEntries` that the response covers; rejects the rest, so
 * a task blocked on them isn't stranded. Returns the entries the write
 * produced content into — fulfilled spawned entries plus installed detached
 * upserts — for LRU size accounting, or null if nothing entered the cache.
 *
 * Serves every response kind: live-render prefetch responses (runtime
 * prefetches, and Full/LoadingBoundary prefetches in the
 * non-Partial-Prefetching regime), prerender stage decodes (shell-stage
 * extraction, cached navigations, the initial payload), embedded runtime
 * prefetch streams, and the payloads of per-segment prefetch responses.
 */ function writeServerResponseIntoCache(now, fetchStrategy, // The decoded response payload to write. For a per-segment prefetch
// response this is one of its payloads: the full response, or the
// truncated shell decode.
response, // The base router state the response overlays. Null when the response's
// tree is root-anchored (per-segment prefetch payloads).
baseTree, // Non-null when `baseTree` was predicted: the node in the known route tree
// whose pattern it was predicted from (see matchKnownRoute). The
// prediction assumes the URL's rewrite (if any) behaves statically; if the
// server's rendered tree diverges from the base, that prediction failed —
// the rewrite behaves dynamically, so the params baked into the request
// are wrong. The node is marked so the shape is never predicted again, and
// the entries that could not be fulfilled are rejected with immediate
// expiration so the task retries right away — against the server-resolved
// route this time. The response data is still written into the cache: it's
// real data keyed by what the server actually rendered, useful regardless
// of whether the prediction matched.
predictedFrom, // The pathname the response was rendered for, used to resolve dynamic
// segments the server sent without a param value (`k: null`). Null for
// responses that always carry concrete values (navigation responses).
renderedPathname, renderedSearch, buildId, // Response-level staleness; a segment (or the head) with its own
// staleTime overrides it.
staleAt, // Whether anything in the response is not fully resolved: dynamic holes, runtime holes, anything suspended.
// Threaded into the decode, where each segment's (and the head's)
// partiality is resolved from it and the wire form (see
// createNavigationSeed). Per-segment prefetch responses encode
// partiality per node, so their writes pass the conservative value
// (true), which is never read.
isResponsePartial, // Where to key the head; see createNavigationSeed.
metadataVaryPath, spawnedEntries, // The strategy tier describing the CONTENT of the payload being written,
// when it differs from `fetchStrategy` (which drives matching and
// keying); null when they agree. See the param docs on
// writeSegmentDataIntoCache.
contentFetchStrategy, // The map the work that spawned this response's request is bound to: the
// spawning task's `PrefetchTask.segmentCacheMap` for prefetches, the
// navigation's map for navigation-side writes. Binding the write to the
// requesting work means a response that lands after a testing-lock scope
// boundary still writes into the map its entries live in.
map) {
    // Which layer owns the buildId check differs by flow. The route and
    // segment fetch layers check it themselves (see fetchRouteOnCacheMiss and
    // fetchAndWritePerSegmentPrefetchResponse) because they need the early-out
    // before side effects this layer can't undo — starting the fallback-retry
    // loop, writing the second (shell) payload — and then pass no buildId
    // here. This check owns it for the flows that don't: live-render prefetch
    // responses and navigation static-stage writes, which pass their
    // buildId through.
    if (buildId && buildId !== (0, _navigationbuildid.getNavigationBuildId)()) {
        // The server build does not match the client. Treat as a 404. During
        // an actual navigation, the router will trigger an MPA navigation.
        if (spawnedEntries !== null) {
            rejectSegmentEntriesIfStillPending(spawnedEntries, now + REJECTION_BACKOFF_MS);
        }
        return null;
    }
    const transportData = response.t;
    if (transportData === undefined) {
        // The response carries no tree. Settle anything we own so a task blocked
        // on it isn't stranded.
        if (spawnedEntries !== null) {
            rejectSegmentEntriesIfStillPending(spawnedEntries, now + REJECTION_BACKOFF_MS);
        }
        return null;
    }
    const navigationSeed = (0, _decodeserverresponse.createNavigationSeed)(now, baseTree, transportData, // Root params are emitted once at the top level of the response; the
    // decode unions them into the head's and each segment's own set. For
    // per-segment prefetch responses this must be read from the payload
    // being written: a truncated shell decode rewinds the response's
    // late-resolving values to the shell stage.
    response.r ?? null, // The decode resolves each segment's partiality from this and the wire:
    // boolean-form nodes resolve to this response-level value; staged
    // (promise-form) nodes encode partiality per node and ignore it.
    isResponsePartial, renderedPathname, renderedSearch, metadataVaryPath, // Only navigations consume the seed's dynamicStaleAt; cache writes pass
    // unknown to use the default.
    _bfcache.UnknownDynamicStaleTime);
    const requiresRuntimeCompleteness = (navigationSeed.root.tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0;
    const treeDivergedFromPrediction = predictedFrom !== null && navigationSeed.treeDivergedFromBase;
    if (treeDivergedFromPrediction) {
        predictedFrom.hasDynamicRewrite = true;
    }
    // Only static (per-segment) responses can be ISR fallbacks (`f`). A
    // present `u` means the response carries a stage-scoped runtime-data
    // verdict — per-segment prefetch responses always emit one, and so does
    // any prerendered page payload, which embeds the prerender's runtime-data
    // probe; live renders emit none. A response without one decodes to a null
    // verdict, and its entries record their request's own strategy unrefined
    // (see writeSegmentDataIntoCache).
    // `u` is deliberately read here, off THIS decode's thenable status, rather
    // than normalized where the response is fetched: the read scopes it to the
    // payload being written — a truncated shell decode reads a post-shell
    // runtime access as pending, i.e. `false`, because the shell variant
    // itself doesn't need that data. The read is load-bearing in one direction
    // only: a false `true` costs a wasted runtime request; a false `false`
    // would record too high a tier and skip a runtime request that had more
    // content. A rejected row (an aborted prerender errors rows that were
    // still pending at the abort) must therefore read as `true`, matching the
    // server's own read of the page payload's flag (see the `u` read in
    // collect-segment-data.tsx).
    const isUpgradeableISRFallback = response.f === true;
    const responseNeedsRuntimeRequest = response.u !== undefined ? (0, _rsctransport.readFulfilledValue)(response.u, false, /* rejectedValue */ true) : null;
    const routeTree = navigationSeed.root.tree;
    // The route tree carries the render output of every segment the response
    // included, so a single traversal from the root writes all of it into
    // the cache.
    const writtenEntries = [];
    writeTreeDataIntoCache(now, map, fetchStrategy, routeTree, staleAt, spawnedEntries, contentFetchStrategy, isUpgradeableISRFallback, requiresRuntimeCompleteness, responseNeedsRuntimeRequest, writtenEntries);
    const metadataTree = navigationSeed.root.head;
    const headData = metadataTree.data;
    if (headData !== null && headData.rsc !== null) {
        // The head follows the same stale-time rules as a segment.
        const headStaleAt = headData.staleTimeSeconds !== null ? now + getStaleTimeMs(headData.staleTimeSeconds) : staleAt;
        // A head has no loading boundary. Match the scheduler, which spawns
        // LoadingBoundary head entries using the concrete Full strategy (see the
        // head's runtime fetch in pingRootRouteTree).
        const headFetchStrategy = fetchStrategy === _types.FetchStrategy.LoadingBoundary ? _types.FetchStrategy.Full : fetchStrategy;
        const writtenHeadEntry = writeSegmentDataIntoCache(now, map, headFetchStrategy, headData.rsc, // The decode already resolved the head's partiality from the wire
        // form and the response-level value — see the head read in
        // createNavigationSeed.
        headData.isPartial, headStaleAt, headData.varyParams, metadataTree, spawnedEntries, contentFetchStrategy, isUpgradeableISRFallback, requiresRuntimeCompleteness, responseNeedsRuntimeRequest);
        if (writtenHeadEntry !== null) {
            writtenEntries.push(writtenHeadEntry);
        }
    }
    // Any entry that's still pending was intentionally not rendered by the
    // server, because it was inside the loading boundary. Mark them as rejected
    // so we know not to fetch them again.
    // TODO: If PPR is enabled on some routes but not others, then it's possible
    // that a different page is able to do a per-segment prefetch of one of the
    // segments we're marking as rejected here. We should mark on the segment
    // somehow that the reason for the rejection is because of a non-PPR prefetch.
    // That way a per-segment prefetch knows to disregard the rejection.
    if (spawnedEntries !== null) {
        rejectSegmentEntriesIfStillPending(spawnedEntries, // When the response diverged from the prediction, the leftover entries
        // can never be fulfilled — their keys were derived from the wrong
        // tree. Reject with an immediate expiration instead of the usual
        // backoff so the task retries right away. The prediction was disabled
        // above, so the retry resolves the route on the server instead of
        // predicting it again.
        treeDivergedFromPrediction ? -1 : now + REJECTION_BACKOFF_MS);
    }
    return writtenEntries.length > 0 ? writtenEntries : null;
}
function writeTreeDataIntoCache(now, map, fetchStrategy, tree, staleAt, spawnedEntries, contentFetchStrategy, isUpgradeableISRFallback, requiresRuntimeCompleteness, responseNeedsRuntimeRequest, // Accumulates the entries the walk wrote content into (fulfilled spawned
// entries and installed detached upserts), for LRU size accounting.
writtenEntries) {
    // Writes the render output embedded in the route tree into the
    // prefetch cache.
    const data = tree.data;
    if (data !== null && data.rsc !== null) {
        // A segment carries its own staleTime only in per-segment prefetch
        // responses; everywhere else the response-level staleness governs.
        const entryStaleAt = data.staleTimeSeconds !== null ? now + getStaleTimeMs(data.staleTimeSeconds) : staleAt;
        const writtenEntry = writeSegmentDataIntoCache(now, map, fetchStrategy, data.rsc, data.isPartial, entryStaleAt, data.varyParams, tree, spawnedEntries, contentFetchStrategy, isUpgradeableISRFallback, requiresRuntimeCompleteness, responseNeedsRuntimeRequest);
        if (writtenEntry !== null) {
            writtenEntries.push(writtenEntry);
        }
    } else {
    // Either the response carried no information for this segment (no data
    // object — e.g. the identity spine of a per-segment prefetch response,
    // or a slot reused from the base tree), or it acknowledged the position
    // without rendering it (a data object with a null rsc — an intermediate
    // position on the path to a rendered subtree). Nothing to write either
    // way, but the children may have output, so keep descending.
    }
    // Recursively write the child data into the cache.
    const slots = tree.slots;
    if (slots !== null) {
        for (const childTree of slots.values()){
            writeTreeDataIntoCache(now, map, fetchStrategy, childTree, staleAt, spawnedEntries, contentFetchStrategy, isUpgradeableISRFallback, requiresRuntimeCompleteness, responseNeedsRuntimeRequest, writtenEntries);
        }
    }
}
/**
 * Writes one segment's render output into the cache: fulfills the entry at
 * the same tree position if this task owns one, otherwise creates one (or
 * upserts a detached one). Shared by every response kind; responses that
 * carry a runtime-data verdict (per-segment prefetch responses and
 * prerendered page payloads) additionally refine the tier the entry
 * records — see `recordedFetchStrategy` below.
 *
 * Returns the entry this write produced content into — the fulfilled spawned
 * entry, or the detached entry the upsert installed — so the caller can
 * charge the response's size to it. Null when nothing entered the cache (the
 * upsert declined a detached candidate).
 */ function writeSegmentDataIntoCache(now, map, fetchStrategy, rsc, isPartial, staleAt, segmentVaryParams, tree, spawnedEntries, // The strategy tier describing the CONTENT of the payload this write came
// from, when it differs from the write's own `fetchStrategy` (which
// drives matching and keying); null when they agree. It differs only for
// the coincident-shell case: a write that fulfills shell-keyed entries
// with a payload that IS the full response passes the full payload's tier
// — see writeResponsePayloadsIntoCache.
contentFetchStrategy, // Whether the response is an upgradeable fallback shell. Always false for
// live-render responses — they are never ISR fallbacks.
isUpgradeableISRFallback, // The response's runtime-data verdict: whether the render that produced
// this payload accessed runtime data (page-global; combined with the
// segment's own `isPartial` to decide the tier the entry records below).
// Null when the response carries no verdict (`u`) — live renders emit
// none; per-segment prefetch responses and prerendered page payloads
// (including the truncated initial payload) do — in which case the entry
// records the payload's tier unrefined.
requiresRuntimeCompleteness, responseNeedsRuntimeRequest) {
    // The strategy tier recorded on the entry — the tier of the content that
    // actually satisfied it, which spans both axes: shell-vs-concrete AND
    // static-vs-runtime. The payload's content tier (`fetchStrategy`, unless
    // the caller passed a distinct `contentFetchStrategy`), refined by the
    // response's runtime-data verdict when it carries one:
    //
    // A runtime prefetch can only provide more content than this entry if the
    // render accessed runtime data AND this particular segment has holes — a
    // fully static segment gains nothing from a runtime request no matter
    // what the page accessed. When this payload fully satisfied the segment —
    // no runtime request needed — the content is as complete as a RUNTIME
    // response of the same variant would have been, so it records that
    // runtime tier. That's what lets the scheduler decide "would a runtime
    // request return more?" by comparing tiers alone, with no separate signal
    // to consult. Otherwise the content is only as complete as the static
    // tier it was requested at, so a follow-up runtime request can still
    // supersede it.
    let recordedFetchStrategy;
    if (responseNeedsRuntimeRequest === null) {
        // The response carries no verdict — a live render's, or the synthesized
        // initial-payload subset's (see create-initial-router-state): record
        // the payload's tier as-is. A verdict is honored wherever it appears:
        // prerendered page payloads carry one too (the prerender's runtime-data
        // probe), and refining on it is correct — a prerendered response whose
        // verdict is `false` is genuinely runtime-complete content.
        recordedFetchStrategy = contentFetchStrategy ?? fetchStrategy;
    } else if (responseNeedsRuntimeRequest && isPartial) {
        // A runtime request would provide more than this payload, so no runtime
        // tier is recorded — but the entry must still honor the payload's
        // CONTENT grade. In the coincident-shell case the payload that satisfied
        // a shell-keyed entry IS the full response, whose content grades at the
        // concrete static tier (`contentFetchStrategy`, PPR — the verdict only
        // rides static-family responses, so no higher grade can appear here).
        // The verdict is consistent with that grade: it says the runtime tiers
        // would provide more, which they would over PPR just as over the shell
        // tier.
        recordedFetchStrategy = contentFetchStrategy ?? fetchStrategy;
    } else {
        const payloadFetchStrategy = contentFetchStrategy ?? fetchStrategy;
        if (requiresRuntimeCompleteness) {
            // The verdict says this payload does not need a runtime request.
            // If we requested it at a static tier, raise the recorded tier up to the
            // runtime tier of the same variant.
            // This also makes the verdict a noop for Full payloads, which matters because
            // the Full flow decodes incrementally, and synchronously reading `response.u`
            // is only sound for a buffered payload.
            recordedFetchStrategy = payloadFetchStrategy === _types.FetchStrategy.StaticShell ? _types.FetchStrategy.RuntimeShell : payloadFetchStrategy === _types.FetchStrategy.PPR ? _types.FetchStrategy.PPRRuntime : payloadFetchStrategy;
        } else {
            // Only upgrade static segments to their runtime equivalents if the route
            // can use runtime requests. Otherwise, when re-using a shell segment across
            // params, `pingSegmentBundle` for a PPR strategy would see a `ShellRuntime`
            // shell entry and incorrectly decide that a new PPR request would not
            // provide more content.
            recordedFetchStrategy = payloadFetchStrategy;
        }
    }
    // Decide whether to re-key the entry under a more generic vary path based on
    // which params the segment actually depends on.
    //
    // Skip re-keying for Full prefetches: as of today, `varyParams` tracking only
    // works within the static stage portion of a response. A Full prefetch
    // response covers all stages, and we can't track params during the dynamic
    // stage without dead-locking the Flight stream, so the server-reported set is
    // incomplete and can't be trusted for the full response. Re-keying with an
    // untrustworthy set could replace concrete params with Fallback and let
    // unrelated URLs read each other's content from the cache.
    //
    // Key the entry by which params the server said this segment depends on
    // (judged by the payload's CONTENT: contentFetchStrategy differs from
    // fetchStrategy exactly when a shell request's response turned out to
    // carry more — the coincident case). Reusing one copy across param values
    // is the point of the shell, but it requires knowing the content doesn't
    // depend on those params, and the server's report is the direct evidence
    // of that.
    //
    // Without that report, assume every param varies — a response without a
    // shell/full split is also what a page fully prerendered at concrete
    // params looks like, and keying that at the shell path would serve one
    // slug's content to every sibling. The exception is a shell variant,
    // which reduces param-dependent content to param fallbacks, so it really
    // is good for any value of them (its request path below IS the shell
    // vary path).
    const payloadStrategy = contentFetchStrategy ?? fetchStrategy;
    let fulfilledVaryPath = null;
    // The dependency source the entry records, so a navigation that renders
    // its content can tell which params that content read. It is the same
    // evidence the key derivation below trusts, under the same condition, with
    // the same correction; otherwise null, and consumers assume every param.
    let recordedVaryParams = null;
    if (process.env.__NEXT_VARY_PARAMS && payloadStrategy !== _types.FetchStrategy.Full && segmentVaryParams !== null) {
        // Read the reported set now, when the key is chosen. The payload is fully
        // buffered by the time it's written, so the source has settled; a read of
        // null means the report is unavailable and every param varies.
        let varyParams = (0, _varyparamsdecoding.readVaryParams)(segmentVaryParams);
        if (varyParams !== null) {
            if (payloadStrategy === _types.FetchStrategy.RuntimeShell && varyParams.has(_varyparamsdecoding.SEARCH_PARAMS_VARY_ID)) {
                // SPECIAL CASE: for a RuntimeShell payload, the search params entry
                // is dropped from the server's vary evidence before deriving the
                // key, so the search component of the resulting path is marked as
                // the fallback. This exists ONLY because of a known compromise in
                // how the server reports search params: accessing `searchParams`
                // records a dependency on them at access time, even when the render
                // suspends on that access and cuts the content at the param
                // fallback. A shell render's page and head segments therefore report
                // the search params while the emitted bytes contain no
                // search-dependent content.
                // Trusting that report would key shell-grade content at a concrete
                // search value, where shell-restricted reads (which generalize every
                // non-root param — see getShellSegmentVaryPath) can never find it. A
                // RuntimeShell payload's search-dependent content is reduced to
                // fallbacks by construction, so its key must not vary on search
                // regardless of the over-reported evidence. Every other component of
                // the evidence is still honored as-is.
                //
                // Nothing else should rely on this branch; for every other payload
                // grade — and every other param — the server's evidence
                // is authoritative.
                //
                // TODO: Reconsider special-casing this on the server instead: don't
                // report a param access that never resolved past the fallback cut in
                // the emitted stage. A shell payload's evidence would then be
                // accurate, and this branch could be deleted.
                varyParams = new Set(varyParams);
                varyParams.delete(_varyparamsdecoding.SEARCH_PARAMS_VARY_ID);
                recordedVaryParams = (0, _varyparamsdecoding.createVaryParams)(varyParams);
            } else {
                recordedVaryParams = segmentVaryParams;
            }
            fulfilledVaryPath = (0, _varypath.getFulfilledSegmentVaryPath)(tree.varyPath, varyParams);
        }
    }
    // The canonical path to (re-)key the entry at. When the derivation above
    // produced a path, use that; otherwise fall back to the payload's own
    // keying (this is load-bearing for entries spawned as revalidations:
    // without the re-key they'd stay in their Revalidation slot forever,
    // invisible to canonical reads, and the partial entry that prompted the
    // revalidation would keep serving navigations). Full responses are
    // excluded, matching the varyParams re-key: they're spawned as canonical
    // entries at their final path, and their vary tracking can't be trusted
    // for re-keying (see the fulfilledVaryPath derivation above).
    const canonicalVaryPath = fulfilledVaryPath !== null ? fulfilledVaryPath : payloadStrategy !== _types.FetchStrategy.Full ? (0, _varypath.getSegmentVaryPathForRequest)(payloadStrategy, tree) : null;
    // We should only write into cache entries that are owned by us. Or create
    // a new one and write into that. We must never write over an entry that was
    // created by a different task, because that causes data races.
    //
    // The status check matters for the fallback-retry loop, which re-writes a
    // response over entries the initial fetch already settled: those writes
    // must fall through to the detached path below.
    const ownedEntry = spawnedEntries !== null ? spawnedEntries.get(tree.requestKey) : undefined;
    const isOwned = ownedEntry !== undefined && ownedEntry.status === _cachemap.EntryStatus.Pending;
    let fulfilledEntry;
    let insertVaryPath;
    if (isOwned) {
        // We own this entry — fulfill it directly.
        fulfilledEntry = fulfillSegmentCacheEntry(ownedEntry, rsc, staleAt, isPartial, recordedVaryParams, isUpgradeableISRFallback, recordedFetchStrategy);
        // Re-key the fulfilled entry at its canonical path. Owned Full entries
        // are the exception (canonicalVaryPath is null): they were spawned as
        // canonical entries at their final path, so no re-key happens.
        insertVaryPath = canonicalVaryPath;
    } else {
        // We don't own an entry for this segment. Create a detached one and
        // attempt to insert it at the canonical path — or, for a Full response
        // (which has no canonical re-key), at the request's own path.
        fulfilledEntry = fulfillSegmentCacheEntry(upgradeToPendingSegment(createDetachedSegmentCacheEntry(now), fetchStrategy), rsc, staleAt, isPartial, recordedVaryParams, isUpgradeableISRFallback, recordedFetchStrategy);
        insertVaryPath = canonicalVaryPath !== null ? canonicalVaryPath : (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    }
    if (insertVaryPath !== null) {
        // Insert through the upsert so the usual precedence rules apply — an
        // existing entry with more complete content is never downgraded, and a
        // shadowed Empty/Pending entry's blocked tasks are pinged. (In the
        // common case the slot already holds the entry we just fulfilled, which
        // the upsert replaces in place; but the re-key is load-bearing for
        // entries whose spawn path differs from the canonical path — e.g.
        // spawned revalidations, which would otherwise stay in their
        // Revalidation slot forever, invisible to canonical reads, while the
        // partial entry that prompted the revalidation kept serving
        // navigations.)
        //
        // The concrete lookup path (tree.varyPath) is passed so that when the
        // canonical path is more generic, any stale settled entry — or unclaimed
        // Empty placeholder — at a more specific path that would shadow the
        // fulfilled entry is evicted. Without this, a shadowed re-keyed entry is
        // unreachable at the concrete read path: the scheduler would keep
        // re-reading the stale entry and, for a revalidation, respawn it
        // forever. See evictShadowingSegmentEntries.
        const installedEntry = upsertSegmentEntry(now, map, insertVaryPath, fulfilledEntry, tree.varyPath);
        if (installedEntry === null && !isOwned) {
            // The upsert declined the detached candidate (an existing entry took
            // precedence, or the candidate was already expired), so no cache slot
            // holds this write's content — nothing for the caller to charge to
            // the LRU. (An owned entry is returned regardless: it was fulfilled
            // above and stays live for waiters that hold it, whether or not the
            // re-key installed it.)
            return null;
        }
    }
    return fulfilledEntry;
}
async function fetchPrefetchResponse(url, headers) {
    const fetchPriority = 'low';
    // When issuing a prefetch request, don't immediately decode the response; we
    // use the lower level `createFromResponse` API instead because we need to do
    // some extra processing of the response stream. See
    // `bufferPrefetchResponseBody` for more details.
    const shouldImmediatelyDecode = false;
    const response = await (0, _fetchserverresponse.createFetch)(url, headers, fetchPriority, shouldImmediatelyDecode);
    if (!response.ok) {
        return null;
    }
    // Check the content type
    if (isOutputExportMode) {
    // In output: "export" mode, we relaxed about the content type, since it's
    // not Next.js that's serving the response. If the status is OK, assume the
    // response is valid. If it's not a valid response, the Flight client won't
    // be able to decode it, and we'll treat it as a miss.
    } else {
        const contentType = response.headers.get('content-type');
        const isFlightResponse = contentType && contentType.startsWith(_approuterheaders.RSC_CONTENT_TYPE_HEADER);
        if (!isFlightResponse) {
            return null;
        }
    }
    return response;
}
/**
 * Whether the response was served from the per-segment-capable static
 * prerender, rather than the old prefetching flow. If this fails, it implies
 * that PPR is disabled on the route.
 */ function wasServedFromPerSegmentCache(response) {
    return response.headers.get(_approuterheaders.NEXT_DID_POSTPONE_HEADER) === '2' || // In output: "export" mode, we can't rely on response headers. But if we
    // receive a well-formed response, we can assume it's a static response,
    // because all data is static in this mode.
    isOutputExportMode;
}
async function bufferPrefetchResponseBody(body, byteLimit) {
    // Read the response from the network, optionally truncating at byteLimit.
    const reader = body.getReader();
    const chunks = [];
    let size = 0;
    while(true){
        const { done, value } = await reader.read();
        if (done) break;
        if (byteLimit !== undefined && size + value.byteLength >= byteLimit) {
            const remaining = byteLimit - size;
            if (remaining > 0) {
                chunks.push(value.byteLength > remaining ? value.subarray(0, remaining) : value);
                size += remaining;
            }
            reader.cancel();
            break;
        }
        chunks.push(value);
        size += value.byteLength;
    }
    // Concatenate into a single chunk so that Flight's processBinaryChunk
    // processes all rows synchronously in one call. Multiple chunks would not
    // be sufficient: even though reader.read() resolves as a microtask for
    // already-enqueued data, the `await` continuation from
    // createFromReadableStream can interleave between chunks. If the root
    // model row isn't the first row (e.g. outlined values come first), the
    // PromiseResolveThenableJob from `await` can cause the root to initialize
    // eagerly, scheduling the continuation before remaining chunks (including
    // promise value rows) are processed. A single chunk avoids this.
    if (chunks.length === 1) {
        return chunks[0];
    } else if (chunks.length > 1) {
        const buffer = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks){
            buffer.set(chunk, offset);
            offset += chunk.byteLength;
        }
        return buffer;
    } else {
        return new Uint8Array(0);
    }
}
/**
 * Creates a streaming (non-buffered) prefetch response stream for dynamic/Full
 * prefetches. These are essentially dynamic responses that get stored in the
 * prefetch cache — they don't carry vary params or other cache metadata that
 * requires synchronous thenable resolution, so there's no need to buffer them.
 * They should continue to stream so consumers can process data as it arrives.
 */ function createIncrementalPrefetchResponseStream(originalFlightStream, onStreamClose, onResponseSizeUpdate) {
    // While processing the original stream, we incrementally update the size
    // of the cache entry in the LRU.
    let totalByteLength = 0;
    const reader = originalFlightStream.getReader();
    return new ReadableStream({
        async pull (controller) {
            while(true){
                const { done, value } = await reader.read();
                if (!done) {
                    // Pass to the target stream and keep consuming the Flight response
                    // from the server.
                    controller.enqueue(value);
                    // Incrementally update the size of the cache entry in the LRU.
                    totalByteLength += value.byteLength;
                    onResponseSizeUpdate(totalByteLength);
                    continue;
                }
                controller.close();
                onStreamClose();
                return;
            }
        }
    });
}
function addSegmentPathToUrlInOutputExportMode(url, segmentPath) {
    if (isOutputExportMode) {
        // In output: "export" mode, we cannot use a header to encode the segment
        // path. Instead, we append it to the end of the pathname.
        const staticUrl = new URL(url);
        const routeDir = staticUrl.pathname.endsWith('/') ? staticUrl.pathname.slice(0, -1) : staticUrl.pathname;
        const staticExportFilename = (0, _segmentvalueencoding.convertSegmentPathToStaticExportFilename)(segmentPath);
        staticUrl.pathname = `${routeDir}/${staticExportFilename}`;
        return staticUrl;
    }
    return url;
}
function canNewFetchStrategyProvideMoreContent(currentStrategy, newStrategy) {
    return currentStrategy < newStrategy;
}
function getStaleAtFromHeader(now, response) {
    const staleTimeSeconds = parseInt(response.headers.get(_approuterheaders.NEXT_ROUTER_STALE_TIME_HEADER) ?? '', 10);
    const staleTimeMs = !isNaN(staleTimeSeconds) ? getStaleTimeMs(staleTimeSeconds) : _navigatereducer.STATIC_STALETIME_MS;
    return now + staleTimeMs;
}
async function resolveStaleAt(now, staleTimeIterable, response) {
    if (staleTimeIterable !== undefined) {
        // Iterate the async iterable and take the last yielded value. The server
        // yields updated staleTime values during the render; the last one is the
        // final staleTime.
        let staleTimeSeconds;
        for await (const value of staleTimeIterable){
            staleTimeSeconds = value;
        }
        if (staleTimeSeconds !== undefined) {
            const staleTimeMs = isNaN(staleTimeSeconds) ? _navigatereducer.STATIC_STALETIME_MS : getStaleTimeMs(staleTimeSeconds);
            return now + staleTimeMs;
        }
    }
    if (response !== undefined) {
        return getStaleAtFromHeader(now, response);
    }
    return now + _navigatereducer.STATIC_STALETIME_MS;
}
function spawnStaticStageCacheWrite(now, response, isResponsePartial, // The navigation response's headers, used to derive the buildId for the
// write-layer build check (the deployment header, falling back to the
// response's `b` field). Null for the initial payload, which arrived in
// the HTML document and has no build-id check.
responseHeaders, baseTree, renderedSearch, // The map the work that spawned this response's request is bound to. See
// writeServerResponseIntoCache.
map) {
    const buildId = responseHeaders !== null ? responseHeaders.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? response.b : undefined;
    resolveStaleAt(now, response.s).then((staleAt)=>{
        // TODO: This entire write is legacy and will be deleted in a future
        // PR: caching is organized around the conceptual shell vs not-shell
        // distinction, not around the static vs runtime render stages, so a
        // static-stage write has no place in the model. It's kept only until
        // its removal PR lands — do not extend it (e.g. with shell
        // extraction).
        writeServerResponseIntoCache(now, _types.FetchStrategy.PPR, response, baseTree, // The base tree is the navigation's current tree, not a prediction;
        // divergence from it carries no signal.
        null, // Navigation responses always include the param values in the tree,
        // so there's no pathname to parse them from (nor a need to).
        null, renderedSearch, buildId, staleAt, isResponsePartial, null, // No owned entries; every write is a detached upsert.
        null, null, map);
    }).catch(()=>{
    // The static stage processing failed. Not fatal — the render
    // completed normally, we just won't write into the cache.
    });
}
async function writeRuntimePrefetchStreamIntoCache(now, runtimePrefetchStream, baseTree, renderedSearch, // The map the work that spawned this response's request is bound to. See
// writeServerResponseIntoCache.
map) {
    const { stream, isPartial } = await stripIsPartialByte(runtimePrefetchStream);
    const buffer = await bufferPrefetchResponseBody(stream);
    const serverData = await (0, _fetchserverresponse.decodeBufferedStage)(buffer, undefined);
    // Extract the shell payload, when the response carries one. Same wire
    // convention as the other live-render responses (see
    // resolveShellStageResponse): `a` absent means the render wasn't staged —
    // no shell exists; `null` means the shell IS the full response; a number
    // is the byte boundary of a distinct shell prefix, which is re-decoded
    // from a truncated copy of the buffer. An unreadable `a` — pending or
    // rejected, which only an aborted render produces — conservatively reads
    // as no shell: the full payload is still written, there's just no shell
    // stage to extract from it.
    let shellResponse = null;
    if (serverData.a !== undefined) {
        const shellByteLength = (0, _rsctransport.readFulfilledValue)(serverData.a, undefined);
        if (shellByteLength === null) {
            shellResponse = serverData;
        } else if (shellByteLength !== undefined) {
            try {
                shellResponse = await (0, _fetchserverresponse.decodeBufferedStage)(buffer.subarray(0, shellByteLength), undefined);
            } catch  {
                // The truncated prefix couldn't be decoded. Treat it as if no shell
                // exists; the full payload is still usable.
                shellResponse = null;
            }
        }
    }
    writeResponsePayloadsIntoCache(now, // A runtime prefetch stream is by definition a runtime prefetch.
    _types.FetchStrategy.PPRRuntime, serverData, shellResponse, baseTree, // The base tree is the navigation's current tree, not a prediction;
    // divergence from it carries no signal.
    null, // Navigation responses always include the param values in the tree, so
    // there's no pathname to parse them from (nor a need to).
    null, renderedSearch, serverData.b, // The response is fully buffered, so staleTime is read synchronously.
    readFulfilledStaleAt(now, serverData.s), isPartial, null, // This flow owns no pending entries; every write is a detached upsert.
    null, // Detached writes aren't sized; see writeResponsePayloadsIntoCache.
    null, map);
}
async function stripIsPartialByte(stream) {
    // When there is no recognized marker byte, the fallback depends on whether
    // Cached Navigations is enabled. When enabled, dynamic navigation responses
    // don't have a marker but may contain dynamic holes, so they are treated as
    // partial. When disabled, unmarked responses are treated as non-partial.
    const defaultIsPartial = !!process.env.__NEXT_EXPERIMENTAL_CACHED_NAVIGATIONS;
    const reader = stream.getReader();
    const { done, value } = await reader.read();
    if (done || !value || value.byteLength === 0) {
        return {
            stream: new ReadableStream({
                start: (c)=>c.close()
            }),
            isPartial: defaultIsPartial
        };
    }
    const firstByte = value[0];
    const hasMarker = firstByte === 0x23 || firstByte === 0x7e;
    const isPartial = hasMarker ? firstByte === 0x7e : defaultIsPartial;
    const remainder = hasMarker ? value.byteLength > 1 ? value.subarray(1) : null : value;
    return {
        isPartial,
        stream: new ReadableStream({
            start (controller) {
                if (remainder) {
                    controller.enqueue(remainder);
                }
            },
            async pull (controller) {
                const result = await reader.read();
                if (result.done) {
                    controller.close();
                } else {
                    controller.enqueue(result.value);
                }
            }
        })
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=cache.js.map