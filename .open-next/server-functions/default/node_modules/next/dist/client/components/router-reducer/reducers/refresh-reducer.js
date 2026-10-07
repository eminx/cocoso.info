"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    refreshDynamicData: null,
    refreshReducer: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    refreshDynamicData: function() {
        return refreshDynamicData;
    },
    refreshReducer: function() {
        return refreshReducer;
    }
});
const _routerreducertypes = require("../router-reducer-types");
const _approuterstate = require("../../app-router-state");
const _decodeserverresponse = require("../../segment-cache/decode-server-response");
const _cache = require("../../segment-cache/cache");
const _hasinterceptionrouteincurrenttree = require("./has-interception-route-in-current-tree");
const _rendertree = require("../../render-tree");
const _bfcache = require("../../segment-cache/bfcache");
function refreshReducer(state, action) {
    // During a refresh, we invalidate the segment cache but not the route cache.
    // The route cache contains the tree structure (which segments exist at a
    // given URL) which doesn't change during a refresh. The segment cache
    // contains the actual RSC data which needs to be re-fetched.
    //
    // The Instant Navigation Testing API can bypass cache invalidation to
    // preserve prefetched data when refreshing after an MPA navigation. This is
    // only used for testing and is not exposed in production builds by default.
    const bypassCacheInvalidation = process.env.__NEXT_EXPOSE_TESTING_API && action.bypassCacheInvalidation;
    if (!bypassCacheInvalidation) {
        const currentNextUrl = state.nextUrl;
        const currentRoot = state.root;
        (0, _cache.invalidateSegmentCacheEntries)(currentNextUrl, currentRoot);
    }
    // A full refresh has no HMR generation to cancel.
    return refreshDynamicData(state, _rendertree.FreshnessPolicy.RefreshAll, undefined);
}
function refreshDynamicData(state, freshnessPolicy, signal) {
    // During a refresh, invalidate the BFCache, which may contain dynamic data.
    (0, _bfcache.invalidateBfCache)();
    const currentNextUrl = state.nextUrl;
    // We always send the last next-url, not the current when performing a dynamic
    // request. This is because we update the next-url after a navigation, but we
    // want the same interception route to be matched that used the last next-url.
    const nextUrlForRefresh = (0, _hasinterceptionrouteincurrenttree.hasInterceptionRouteInCurrentTree)(state.tree) ? state.previousNextUrl || currentNextUrl : null;
    // A refresh is modeled as a navigation to the current URL, but where any
    // existing dynamic data (including in shared layouts) is re-fetched.
    const currentCanonicalUrl = state.canonicalUrl;
    const currentUrl = new URL(currentCanonicalUrl, location.origin);
    const currentRenderedSearch = state.renderedSearch;
    const currentFlightRouterState = state.tree;
    const scrollBehavior = _routerreducertypes.ScrollBehavior.NoScroll;
    const navigationLock = (0, _rendertree.getCurrentNavigationLock)();
    // Create a NavigationSeed from the current FlightRouterState.
    // TODO: Eventually we will store this type directly on the state object
    // instead of reconstructing it on demand. Part of a larger series of
    // refactors to unify the various tree types that the client deals with.
    const now = Date.now();
    // TODO: Store the dynamic stale time on the top-level state so it's known
    // during restores and refreshes.
    const refreshSeed = (0, _decodeserverresponse.createNavigationSeed)(now, currentFlightRouterState, // No transport data (and so no vary params, no partiality, and no
    // pathname to parse params from) — this converts the base tree alone.
    null, null, true, null, currentRenderedSearch, null, _bfcache.UnknownDynamicStaleTime);
    // If the previous navigation hasn't pushed its history entry yet (React
    // hasn't committed its state), this refresh may commit in its place, so it
    // takes over the push. If the navigation does commit first, HistoryUpdater
    // sees that the URL already matches and replaces instead.
    const navigateType = state.pushRef.pendingPush ? 'push' : 'replace';
    return (0, _approuterstate.navigateToKnownRoute)(now, state, currentUrl, currentCanonicalUrl, refreshSeed, currentUrl, currentRenderedSearch, state.root, freshnessPolicy, nextUrlForRefresh, scrollBehavior, navigateType, navigationLock, // A refresh is bound to the shared map.
    _cache.segmentCacheMap, null, // Refresh navigations don't use route prediction, so there's no route
    // cache entry to mark as having a dynamic rewrite on mismatch. If a
    // mismatch occurs, the retry handler will traverse the known route tree
    // to find and mark the entry.
    null, signal);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=refresh-reducer.js.map