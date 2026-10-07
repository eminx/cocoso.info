"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    completeHardNavigation: null,
    completeSoftNavigation: null,
    completeTraverseNavigation: null,
    navigate: null,
    navigateToKnownRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    completeHardNavigation: function() {
        return completeHardNavigation;
    },
    completeSoftNavigation: function() {
        return completeSoftNavigation;
    },
    completeTraverseNavigation: function() {
        return completeTraverseNavigation;
    },
    navigate: function() {
        return navigate;
    },
    navigateToKnownRoute: function() {
        return navigateToKnownRoute;
    }
});
const _approutertypes = require("../../shared/lib/app-router-types");
const _fetchserverresponse = require("./router-reducer/fetch-server-response");
const _rendertree = require("./render-tree");
const _createhreffromurl = require("./router-reducer/create-href-from-url");
const _cache = require("./segment-cache/cache");
const _optimisticroutes = require("./segment-cache/optimistic-routes");
const _cachekey = require("./segment-cache/cache-key");
const _scheduler = require("./segment-cache/scheduler");
const _types = require("./segment-cache/types");
const _links = require("./links");
const _routerreducertypes = require("./router-reducer/router-reducer-types");
const _computechangedpath = require("./router-reducer/compute-changed-path");
const _javascripturl = require("../lib/javascript-url");
const _bfcache = require("./segment-cache/bfcache");
const _instantmessages = require("../../shared/lib/instant-messages");
const _decodeserverresponse = require("./segment-cache/decode-server-response");
function navigate(state, url, currentUrl, currentRenderedSearch, currentRoot, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType) {
    let navigationLock = null;
    // Instant Navigation Testing API: when the lock is active, ensure a
    // prefetch task has been initiated before proceeding with the navigation.
    // This guarantees that segment data requests are at least pending, even
    // for routes that already have a cached route tree. Without this, the
    // shell might be incomplete because some segments were never
    // requested.
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        const { isNavigationLocked } = require('./segment-cache/navigation-testing-lock');
        if (isNavigationLocked()) {
            // Signal that a new locked navigation is starting. This force-resolves the
            // previous locked navigation's withheld data (so a reused shared segment
            // no longer carries a pending deferred rsc) and returns this navigation's
            // own withheld-data gate.
            navigationLock = (0, _rendertree.beginLockedNavigation)();
            return ensurePrefetchThenNavigate(state, url, currentUrl, currentRenderedSearch, currentRoot, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock);
        }
    }
    return navigateImpl(state, url, currentUrl, currentRenderedSearch, currentRoot, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock, // An unlocked navigation is bound to the shared map.
    _cache.segmentCacheMap);
}
function navigateImpl(state, url, currentUrl, currentRenderedSearch, currentRoot, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock, // The segment cache map this navigation is bound to: a locked navigation's
// driving-task map, or the shared map. See `segmentCacheMap` in cache.ts.
map) {
    const now = Date.now();
    const href = url.href;
    const cacheKey = (0, _cachekey.createCacheKey)(href, nextUrl);
    const route = (0, _cache.readRouteCacheEntry)(now, cacheKey);
    if (route !== null && route.status === _cache.EntryStatus.Fulfilled) {
        // We have a matching prefetch.
        return navigateUsingPrefetchedRouteTree(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentRoot, freshnessPolicy, scrollBehavior, navigateType, route, navigationLock, map);
    }
    // There was no matching route tree in the cache. Let's see if we can
    // construct an "optimistic" route tree using the deprecated search-params
    // based matching. This is only used when the new optimisticRouting flag is
    // disabled.
    //
    // Do not construct an optimistic route tree if there was a cache hit, but
    // the entry has a rejected status, since it may have been rejected due to a
    // rewrite or redirect based on the search params.
    //
    // TODO: There are multiple reasons a prefetch might be rejected; we should
    // track them explicitly and choose what to do here based on that.
    if (!process.env.__NEXT_OPTIMISTIC_ROUTING) {
        if (route === null || route.status !== _cache.EntryStatus.Rejected) {
            const optimisticRoute = (0, _cache.deprecated_requestOptimisticRouteCacheEntry)(now, url, nextUrl);
            if (optimisticRoute !== null) {
                // We have an optimistic route tree. Proceed with the normal flow.
                return navigateUsingPrefetchedRouteTree(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentRoot, freshnessPolicy, scrollBehavior, navigateType, optimisticRoute, navigationLock, map);
            }
        }
    }
    // There's no matching prefetch for this route in the cache. We must lazily
    // fetch it from the server before we can perform the navigation.
    //
    // TODO: If this is a gesture navigation, instead of performing a
    // dynamic request, we should do a runtime prefetch.
    return navigateToUnknownRoute(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentRoot, currentFlightRouterState, freshnessPolicy, scrollBehavior, navigateType, navigationLock, map).catch(()=>{
        // If the navigation fails, return the current state
        return state;
    });
}
function navigateToKnownRoute(now, state, url, canonicalUrl, navigationSeed, currentUrl, currentRenderedSearch, currentRoot, freshnessPolicy, nextUrl, scrollBehavior, navigateType, navigationLock, // The segment cache map this navigation is bound to: a locked navigation's
// driving-task map, or the shared map. See `segmentCacheMap` in cache.ts.
map, debugInfo, // The route cache entry used for this navigation, if it came from route
// prediction. Passed through so it can be marked as having a dynamic rewrite
// if the server returns a different pathname (indicating dynamic rewrite
// behavior).
//
// When null, the navigation did not use route prediction - either because
// the route was already fully cached, or it's a navigation that doesn't
// involve prediction (refresh, history traversal, server action, etc.).
// In these cases, if a mismatch occurs, we still mark the route as having a
// dynamic rewrite by traversing the known route tree (see
// dispatchRetryDueToTreeMismatch).
routeCacheEntry, signal) {
    // A version of navigate() that accepts the target route tree as an argument
    // rather than reading it from the prefetch cache.
    if (process.env.NODE_ENV !== 'production' && process.env.__NEXT_CACHE_COMPONENTS) {
        // Warn when navigating via a `<Link prefetch={true}>` to a route that has
        // not opted into Partial Prefetching. Such a link does a legacy "full"
        // prefetch that includes the route's dynamic data, defeating the
        // static/dynamic split that Cache Components provides.
        //
        // This runs at navigation time (rather than prefetch time) so that, in dev
        // where we don't prefetch, the warning only appears when you actually
        // navigate to the route — existing apps with many `prefetch={true}` links
        // aren't flooded with warnings the moment they enable Cache Components.
        //
        // The warning is suppressed if any segment on the target route exports
        // `instant = false`, which is the explicit API for opting a route out of
        // this validation.
        const link = (0, _links.getLinkForCurrentNavigation)();
        if (link !== null && link.fetchStrategy === _types.FetchStrategy.Full && (navigationSeed.root.tree.prefetchHints & (_approutertypes.PrefetchHint.SubtreeHasPartialPrefetching | _approutertypes.PrefetchHint.SubtreeHasInstantFalse)) === 0) {
            const error = (0, _instantmessages.createLinkPrefetchPartialError)(url.pathname);
            const ownerStack = 'ownerStack' in link ? link.ownerStack : undefined;
            if (ownerStack === undefined) {
                console.error('' + 'Cannot associate the "prefetch={true}" warning with a specific <Link> making it harder to find the cause of the following warning. ' + 'This is a bug in Next.js.');
            } else if (ownerStack !== null) {
                // Replace the (useless) stack captured at the throw site — which
                // points into router internals — with the Owner Stack captured when
                // the <Link> rendered. That way the dev overlay associates this
                // warning with the JSX that created the link, not with
                // navigation.ts.
                error.stack = `${error.name}: ${error.message}${ownerStack}`;
            }
            console.error(error);
        }
    }
    // Instant Navigation Testing API: when the lock is held, restrict segment
    // reads to shell entries if the target route would only have prefetched
    // its shell.
    let restrictToShell = false;
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        const { shouldRestrictNavigationToShell } = require('./segment-cache/navigation-testing-lock');
        const link = (0, _links.getLinkForCurrentNavigation)();
        restrictToShell = shouldRestrictNavigationToShell(navigationSeed.root.tree.prefetchHints, link !== null ? link.fetchStrategy : _types.FetchStrategy.PPR);
    }
    const accumulation = {
        separateRefreshUrls: null,
        scrollRef: null
    };
    // We special case navigations to the exact same URL as the current location.
    // It's a common UI pattern for apps to refresh when you click a link to the
    // current page. So when this happens, we refresh the dynamic data in the page
    // segments.
    //
    // Note that this does not apply if the any part of the hash or search query
    // has changed. This might feel a bit weird but it makes more sense when you
    // consider that the way to trigger this behavior is to click the same link
    // multiple times.
    //
    // TODO: We should probably refresh the *entire* route when this case occurs,
    // not just the page segments. Essentially treating it the same as a refresh()
    // triggered by an action, which is the more explicit way of modeling the UI
    // pattern described above.
    //
    // Also note that this only refreshes the dynamic data, not static/ cached
    // data. If the page segment is fully static and prefetched, the request is
    // skipped. (This is also how refresh() works.)
    const isSamePageNavigation = url.href === currentUrl.href;
    const navigation = (0, _rendertree.startPPRNavigation)(now, currentUrl, currentRenderedSearch, currentRoot, navigationSeed.root, freshnessPolicy, navigationSeed.dynamicStaleAt, isSamePageNavigation, accumulation, map, restrictToShell);
    if (navigation !== null) {
        if (freshnessPolicy !== _rendertree.FreshnessPolicy.Gesture) {
            (0, _rendertree.spawnDynamicRequests)(navigation, url, nextUrl, freshnessPolicy, accumulation, routeCacheEntry, navigateType, navigationLock, map, signal);
        }
        return completeSoftNavigation(state, url, nextUrl, navigation, navigationSeed.renderedSearch, canonicalUrl, navigateType, scrollBehavior, accumulation.scrollRef, debugInfo);
    }
    // Could not perform a SPA navigation. Revert to a full-page (MPA) navigation.
    return completeHardNavigation(state, url, navigateType);
}
function navigateUsingPrefetchedRouteTree(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentRoot, freshnessPolicy, scrollBehavior, navigateType, route, navigationLock, map) {
    const canonicalUrl = route.canonicalUrl + url.hash;
    const renderedSearch = route.renderedSearch;
    const prefetchSeed = {
        renderedSearch,
        root: route.root,
        dynamicStaleAt: (0, _bfcache.computeDynamicStaleAt)(now, _bfcache.UnknownDynamicStaleTime),
        // Not derived from a server response; no base to diverge from.
        treeDivergedFromBase: false
    };
    return navigateToKnownRoute(now, state, url, canonicalUrl, prefetchSeed, currentUrl, currentRenderedSearch, currentRoot, freshnessPolicy, nextUrl, scrollBehavior, navigateType, navigationLock, map, null, route, // Not an HMR refresh, so there's no request generation to cancel.
    undefined);
}
// Used to request all the dynamic data for a route, rather than just a subset,
// e.g. during a refresh or a revalidation. Typically this gets constructed
// during the normal flow when diffing the route tree, but for an unprefetched
// navigation, where we don't know the structure of the target route, we use
// this instead.
const DynamicRequestTreeForEntireRoute = [
    '',
    {},
    null,
    'refetch'
];
async function navigateToUnknownRoute(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentRoot, currentFlightRouterState, freshnessPolicy, scrollBehavior, navigateType, navigationLock, map) {
    // Runs when a navigation happens but there's no cached prefetch we can use.
    // Don't bother to wait for a prefetch response; go straight to a full
    // navigation that contains both static and dynamic data in a single stream.
    // (This is unlike the old navigation implementation, which instead blocks
    // the dynamic request until a prefetch request is received.)
    //
    // To avoid duplication of logic, we're going to pretend that the tree
    // returned by the dynamic request is, in fact, a prefetch tree. Then we can
    // use the same server response to write the actual data into the render
    // tree. So it's the same flow as the "happy path" (prefetch, then
    // navigation), except we use a single server response for both stages.
    let dynamicRequestTree;
    switch(freshnessPolicy){
        case _rendertree.FreshnessPolicy.Default:
        case _rendertree.FreshnessPolicy.HistoryTraversal:
        case _rendertree.FreshnessPolicy.Gesture:
            dynamicRequestTree = currentFlightRouterState;
            break;
        case _rendertree.FreshnessPolicy.Hydration:
        case _rendertree.FreshnessPolicy.RefreshAll:
        case _rendertree.FreshnessPolicy.HMRRefresh:
            dynamicRequestTree = DynamicRequestTreeForEntireRoute;
            break;
        default:
            freshnessPolicy;
            dynamicRequestTree = currentFlightRouterState;
            break;
    }
    const promiseForDynamicServerResponse = (0, _fetchserverresponse.fetchServerResponse)(url, {
        flightRouterState: dynamicRequestTree,
        nextUrl
    });
    const result = await promiseForDynamicServerResponse;
    if (typeof result === 'string') {
        // This is an MPA navigation.
        const redirectUrl = new URL(result, location.origin);
        return completeHardNavigation(state, redirectUrl, navigateType);
    }
    const { transportData, canonicalUrl, renderedSearch, couldBeIntercepted, supportsPerSegmentPrefetching, dynamicStaleTime, isResponsePartial, staticStageResponse, runtimePrefetchStream, responseHeaders, debugInfo } = result;
    // Since the response format of dynamic requests and prefetches is slightly
    // different, we'll need to massage the data a bit. Create FlightRouterState
    // tree that simulates what we'd receive as the result of a prefetch.
    const navigationSeed = (0, _decodeserverresponse.createNavigationSeed)(now, currentFlightRouterState, transportData, // Navigation responses stream in incrementally, so their vary params
    // can't be drained here — and nothing consumes them from a navigation
    // seed (only segment-cache writes read vary params, and those decode
    // their own, buffered, payloads).
    null, isResponsePartial, // Navigation responses always include the param values in the tree, so
    // there's no pathname to parse them from (nor a need to).
    null, renderedSearch, null, dynamicStaleTime);
    // Learn the route pattern so we can predict it for future navigations.
    // hasDynamicRewrite is false because this is a fresh navigation to an
    // unknown route - any rewrite detection happens during the traversal inside
    // discoverKnownRoute. The hasDynamicRewrite param is only set to true when
    // retrying after a tree mismatch (see dispatchRetryDueToTreeMismatch).
    (0, _optimisticroutes.discoverKnownRoute)(now, url.pathname, url.search, nextUrl, null, navigationSeed.root, couldBeIntercepted, // Store a hashless canonical URL: the entry is shared across hashes, and
    // a later same-route hash nav appends `url.hash` to it.
    (0, _createhreffromurl.createHrefFromUrl)(canonicalUrl, false), navigationSeed.renderedSearch, supportsPerSegmentPrefetching, false // hasDynamicRewrite - not a retry, rewrite detection happens during traversal
    );
    if (staticStageResponse !== null) {
        (0, _cache.spawnStaticStageCacheWrite)(now, staticStageResponse, isResponsePartial, responseHeaders, currentFlightRouterState, renderedSearch, map);
    }
    if (runtimePrefetchStream !== null) {
        (0, _cache.writeRuntimePrefetchStreamIntoCache)(now, runtimePrefetchStream, currentFlightRouterState, renderedSearch, map).catch(()=>{
        // The runtime prefetch cache write failed. Not fatal — the
        // navigation completed normally, we just won't cache runtime data.
        });
    }
    // In the streaming dev render, this single response's seed content may still
    // be streaming when we build the tree below. An unknown-route navigation
    // places that content inline (it has no prior cache entry, so the server
    // sends a full seed rather than the dynamic-only delta a known route gets),
    // and that inline content is not gated like a known route's deferred RSCs. So
    // React could read a still-pending chunk and flash a Suspense fallback
    // (wanted on a cold cache, but not on a warm one). Wait for the shell to
    // flush (`revealAfter`) first, so the inline seed content is decoded by the
    // time React reads it, the same way the known-route path gates its deferred
    // RSCs. `revealAfter` is null outside the streaming dev render. On a cache
    // miss it resolves early, so the cold-cache fallback is still shown.
    if (result.revealAfter !== null) {
        await result.revealAfter;
    }
    return navigateToKnownRoute(now, state, url, (0, _createhreffromurl.createHrefFromUrl)(canonicalUrl), navigationSeed, currentUrl, currentRenderedSearch, currentRoot, freshnessPolicy, nextUrl, scrollBehavior, navigateType, navigationLock, map, debugInfo, // Unknown route navigations don't use route prediction - the route tree
    // came directly from the server. If a mismatch occurs during dynamic data
    // fetch, the retry handler will traverse the known route tree to mark the
    // entry as having a dynamic rewrite.
    null, // Not an HMR refresh, so there's no request generation to cancel.
    undefined);
}
function completeHardNavigation(state, url, navigateType) {
    if ((0, _javascripturl.isJavaScriptURLString)(url.href)) {
        console.error('Next.js has blocked a javascript: URL as a security precaution.');
        return state;
    }
    const newState = {
        canonicalUrl: url.origin === location.origin ? (0, _createhreffromurl.createHrefFromUrl)(url) : url.href,
        pushRef: {
            pendingPush: navigateType === 'push',
            mpaNavigation: true,
            preserveCustomHistoryState: false
        },
        // TODO: None of the rest of these values are consistent with the incoming
        // navigation. We rely on the fact that AppRouter will suspend and trigger
        // a hard navigation before it accesses any of these values. But instead
        // we should trigger the hard navigation and blocking any subsequent
        // router updates without updating React.
        renderedSearch: state.renderedSearch,
        scrollRef: state.scrollRef,
        root: state.root,
        tree: state.tree,
        nextUrl: state.nextUrl,
        previousNextUrl: state.previousNextUrl,
        debugInfo: null
    };
    return newState;
}
function completeSoftNavigation(oldState, url, referringNextUrl, navigation, renderedSearch, canonicalUrl, navigateType, scrollBehavior, scrollRef, collectedDebugInfo) {
    // The "Next-Url" is a special representation of the URL that Next.js
    // uses to implement interception routes.
    // TODO: Get rid of this extra traversal by computing this during the
    // same traversal that computes the tree itself. We should also figure out
    // what is the minimum information needed for the server to correctly
    // intercept the route.
    const tree = navigation.tree.route;
    const changedPath = (0, _computechangedpath.computeChangedPath)(oldState.tree, tree);
    const nextUrlForNewRoute = changedPath ? changedPath : oldState.nextUrl;
    // This value is stored on the state as `previousNextUrl`; the naming is
    // confusing. What it represents is the "Next-Url" header that was used to
    // fetch the incoming route. It's essentially the refererer URL, but in a
    // Next.js specific format. During refreshes, this is sent back to the server
    // instead of the current route's "Next-Url" so that the same interception
    // logic is applied as during the original navigation.
    const previousNextUrl = referringNextUrl;
    // Check if the only thing that changed was the hash fragment.
    const oldUrl = new URL(oldState.canonicalUrl, url);
    const onlyHashChange = // We don't need to compare the origins, because client-driven
    // navigations are always same-origin.
    url.pathname === oldUrl.pathname && url.search === oldUrl.search && url.hash !== oldUrl.hash;
    // Determine whether and how the page should scroll after this
    // navigation.
    //
    // By default, we scroll to the segments that were navigated to — i.e.
    // segments in the new part of the route, as opposed to shared segments
    // that were already part of the previous route. All newly navigated
    // segments share a single ScrollRef. When they mount, the first one
    // to mount initiates the scroll. They share a ref so that only one
    // scroll happens per navigation.
    //
    // If a subsequent navigation produces new segments, those supersede
    // any pending scroll from the previous navigation by invalidating its
    // ScrollRef. If a navigation doesn't produce any new segments (e.g.
    // a refresh where the route structure didn't change), any pending
    // scrolls from previous navigations are unaffected.
    //
    // The branches below handle special cases layered on top of this
    // default model.
    let activeScrollRef;
    let forceScroll;
    if (scrollBehavior === _routerreducertypes.ScrollBehavior.NoScroll) {
        // The user explicitly opted out of scrolling (e.g. scroll={false}
        // on a Link or router.push).
        //
        // If this navigation created new scroll targets (scrollRef !== null),
        // neutralize them. If it didn't, any prior scroll targets carried
        // forward on reused cache nodes remain active.
        if (scrollRef !== null) {
            scrollRef.current = false;
        }
        activeScrollRef = oldState.scrollRef.scrollRef;
        forceScroll = false;
    } else if (onlyHashChange) {
        // Hash-only navigations should scroll regardless of per-node state.
        // Create a fresh ref so the first segment to scroll consumes it.
        //
        // Invalidate any scroll ref from a prior navigation that hasn't
        // been consumed yet.
        const oldScrollRef = oldState.scrollRef.scrollRef;
        if (oldScrollRef !== null) {
            oldScrollRef.current = false;
        }
        // Also invalidate any per-node refs that were accumulated during
        // this navigation's tree construction — the hash-only ref
        // supersedes them.
        if (scrollRef !== null) {
            scrollRef.current = false;
        }
        activeScrollRef = {
            current: true
        };
        forceScroll = true;
    } else {
        // Default case. Use the accumulated scrollRef (may be null if no
        // new segments were created). The handler checks per-node refs, so
        // unchanged parallel route slots won't scroll.
        activeScrollRef = scrollRef;
        // If this navigation created new scroll targets, invalidate any
        // pending scroll from a previous navigation.
        if (scrollRef !== null) {
            const oldScrollRef = oldState.scrollRef.scrollRef;
            if (oldScrollRef !== null) {
                oldScrollRef.current = false;
            }
        }
        forceScroll = false;
    }
    const newState = {
        canonicalUrl,
        renderedSearch,
        pushRef: {
            pendingPush: navigateType === 'push',
            mpaNavigation: false,
            preserveCustomHistoryState: false
        },
        scrollRef: {
            scrollRef: activeScrollRef,
            forceScroll,
            onlyHashChange,
            hashFragment: // Remove leading # and decode hash to make non-latin hashes work.
            //
            // Empty hash should trigger default behavior of scrolling layout into
            // view. #top is handled in layout-router.
            //
            // Refer to `ScrollHandler` for details on how this is used.
            scrollBehavior !== _routerreducertypes.ScrollBehavior.NoScroll && url.hash !== '' ? decodeURIComponent(url.hash.slice(1)) : oldState.scrollRef.hashFragment
        },
        root: (0, _cache.createRootRouteTree)(navigation.tree.node, navigation.head.node),
        tree,
        nextUrl: nextUrlForNewRoute,
        previousNextUrl,
        debugInfo: collectedDebugInfo
    };
    return newState;
}
function completeTraverseNavigation(state, url, renderedSearch, navigation, nextUrl) {
    return {
        // Set canonical url
        canonicalUrl: (0, _createhreffromurl.createHrefFromUrl)(url),
        renderedSearch,
        pushRef: {
            pendingPush: false,
            mpaNavigation: false,
            // Ensures that the custom history state that was set is preserved when applying this update.
            preserveCustomHistoryState: true
        },
        scrollRef: state.scrollRef,
        root: (0, _cache.createRootRouteTree)(navigation.tree.node, navigation.head.node),
        // Restore provided tree
        tree: navigation.tree.route,
        nextUrl,
        // TODO: We need to restore previousNextUrl, too, which represents the
        // Next-Url that was used to fetch the data. Anywhere we fetch using the
        // canonical URL, there should be a corresponding Next-Url.
        previousNextUrl: null,
        debugInfo: null
    };
}
/**
 * Instant Navigation Testing API: ensures a prefetch task has been initiated
 * and completed before proceeding with the navigation. This guarantees that
 * segment data requests are at least pending, even for routes whose route
 * tree is already cached.
 *
 * After the prefetch completes, delegates to the normal navigation flow.
 */ async function ensurePrefetchThenNavigate(state, url, currentUrl, currentRenderedSearch, currentRoot, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock) {
    const link = (0, _links.getLinkForCurrentNavigation)();
    const fetchStrategy = link !== null ? link.fetchStrategy : _types.FetchStrategy.PPR;
    const cacheKey = (0, _cachekey.createCacheKey)(url.href, nextUrl);
    // Create this navigation's "wait for prefetch to fulfill" state and schedule
    // the prefetch as a locked-navigation prefetch. The prefetch's promise
    // resolves when the task completes — after every segment response the task
    // cares about has settled — so the navigation below reads present data
    // rather than a still-in-flight entry.
    const { beginNavigationLockPrefetch } = require('./segment-cache/navigation-testing-lock');
    const navigationLockPrefetch = beginNavigationLockPrefetch();
    const prefetchTask = (0, _scheduler.schedulePrefetchTask)(cacheKey, currentRoot, fetchStrategy, _types.PrefetchPriority.Default, null, navigationLockPrefetch);
    if (navigationLockPrefetch !== null) {
        await navigationLockPrefetch.promise;
    }
    // Prefetch is complete. Proceed with the normal navigation flow, which
    // will now find the route in the cache. The navigation inherits the map of
    // the prefetch task that drives it: the task was scheduled inside the lock
    // scope, so this is the scope's private map, and the navigation reads only
    // data fetched under the lock.
    const result = await navigateImpl(state, url, currentUrl, currentRenderedSearch, currentRoot, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock, prefetchTask.segmentCacheMap);
    // Only transition to captured-SPA once the navigation is known to be an SPA.
    // If the result is an MPA navigation, leave the cookie pending and let the new
    // document load transition it to captured-MPA.
    if (!result.pushRef.mpaNavigation) {
        const { updateCapturedSPAToTree } = require('./segment-cache/navigation-testing-lock');
        updateCapturedSPAToTree(currentFlightRouterState, result.tree);
    }
    return result;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-router-state.js.map