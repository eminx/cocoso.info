"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FreshnessPolicy: null,
    beginLockedNavigation: null,
    createInitialRenderTreeForHydration: null,
    createRootNavigationTask: null,
    getCurrentNavigationLock: null,
    isDeferredRsc: null,
    resetNavigationLockToPending: null,
    spawnDynamicRequests: null,
    startPPRNavigation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FreshnessPolicy: function() {
        return FreshnessPolicy;
    },
    beginLockedNavigation: function() {
        return beginLockedNavigation;
    },
    createInitialRenderTreeForHydration: function() {
        return createInitialRenderTreeForHydration;
    },
    createRootNavigationTask: function() {
        return createRootNavigationTask;
    },
    getCurrentNavigationLock: function() {
        return getCurrentNavigationLock;
    },
    isDeferredRsc: function() {
        return isDeferredRsc;
    },
    resetNavigationLockToPending: function() {
        return resetNavigationLockToPending;
    },
    spawnDynamicRequests: function() {
        return spawnDynamicRequests;
    },
    startPPRNavigation: function() {
        return startPPRNavigation;
    }
});
const _approutertypes = require("../../shared/lib/app-router-types");
const _segment = require("../../shared/lib/segment");
const _segmentvalueencoding = require("../../shared/lib/segment-cache/segment-value-encoding");
const _createhreffromurl = require("./router-reducer/create-href-from-url");
const _fetchserverresponse = require("./router-reducer/fetch-server-response");
const _useactionqueue = require("./use-action-queue");
const _routerreducertypes = require("./router-reducer/router-reducer-types");
const _isnavigatingtonewrootlayout = require("./router-reducer/is-navigating-to-new-root-layout");
const _committedstate = require("./router-reducer/reducers/committed-state");
const _decodeserverresponse = require("./segment-cache/decode-server-response");
const _cache = require("./segment-cache/cache");
const _optimisticroutes = require("./segment-cache/optimistic-routes");
const _varypath = require("./segment-cache/vary-path");
const _bfcache = require("./segment-cache/bfcache");
function createRootNavigationTask(tree, head) {
    return {
        tree,
        head
    };
}
var FreshnessPolicy = /*#__PURE__*/ function(FreshnessPolicy) {
    FreshnessPolicy[FreshnessPolicy["Default"] = 0] = "Default";
    FreshnessPolicy[FreshnessPolicy["Hydration"] = 1] = "Hydration";
    FreshnessPolicy[FreshnessPolicy["HistoryTraversal"] = 2] = "HistoryTraversal";
    FreshnessPolicy[FreshnessPolicy["RefreshAll"] = 3] = "RefreshAll";
    FreshnessPolicy[FreshnessPolicy["HMRRefresh"] = 4] = "HMRRefresh";
    FreshnessPolicy[FreshnessPolicy["Gesture"] = 5] = "Gesture";
    return FreshnessPolicy;
}({});
const noop = ()=>{};
function createInitialRenderTreeForHydration(navigatedAt, initialRoot, seedDynamicStaleAt) {
    // Create the initial cache node tree, using the data embedded into the
    // HTML document.
    const accumulation = {
        separateRefreshUrls: null,
        scrollRef: null
    };
    const parentNeedsDynamicRequest = false;
    const restrictToShell = false;
    // Hydration is bound to the shared map.
    const map = _cache.segmentCacheMap;
    const tree = createRenderTreeOnNavigation(navigatedAt, initialRoot.tree, 1, seedDynamicStaleAt, parentNeedsDynamicRequest, accumulation, map, restrictToShell);
    const head = createRenderTreeOnNavigation(navigatedAt, initialRoot.head, 1, seedDynamicStaleAt, parentNeedsDynamicRequest, accumulation, map, restrictToShell);
    return createRootNavigationTask(tree, head);
}
function startPPRNavigation(navigatedAt, oldUrl, oldRenderedSearch, oldRoot, newRoot, freshness, seedDynamicStaleAt, isSamePageNavigation, accumulation, // The segment cache map this navigation is bound to: a locked navigation's
// driving-task map, or the shared map. See `segmentCacheMap` in cache.ts.
map, // Instant Navigation Testing API only — restricts segment reads to shell
// entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    const parentNeedsDynamicRequest = false;
    const parentRefreshState = null;
    const oldRootRefreshState = {
        canonicalUrl: (0, _createhreffromurl.createHrefFromUrl)(oldUrl),
        renderedSearch: oldRenderedSearch
    };
    const tree = updateRenderTreeOnNavigation(navigatedAt, oldRoot.tree, newRoot.tree, freshness, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest, oldRootRefreshState, parentRefreshState, accumulation, map, restrictToShell);
    if (tree === null) {
        // The route tree changed at or above the root layout. Perform a full-page
        // navigation.
        return null;
    }
    const head = updateRenderTreeOnNavigation(navigatedAt, oldRoot.head, newRoot.head, freshness, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest, oldRootRefreshState, parentRefreshState, accumulation, map, restrictToShell);
    if (head === null) {
        // Unreachable: a one-node tree has no root layout to change and no slots.
        return null;
    }
    return createRootNavigationTask(tree, head);
}
// TODO: Unify NavigationTask with CacheNode.
function createNavigationTask(status, route, node, dynamicRequestTree, children) {
    return {
        status,
        route,
        node,
        dynamicRequestTree,
        children
    };
}
function updateRenderTreeOnNavigation(navigatedAt, oldRenderTree, newRouteTree, freshness, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest, oldRootRefreshState, parentRefreshState, accumulation, map, // Instant Navigation Testing API only — restricts segment reads to shell
// entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    // Check if the route structure changed. If only the params changed, that's
    // handled further down.
    const newSegment = newRouteTree.segment;
    if (!(0, _cache.doesRouteStructureMatch)(oldRenderTree, newRouteTree)) {
        // This segment does not match the previous route. We're now entering the
        // new part of the target route. Switch to the "create" path.
        if ((newRouteTree.prefetchHints & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0 && (0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(oldRenderTree, newRouteTree) || // The global Not Found route (app/global-not-found.tsx) is a special
        // case, because it acts like a root layout, but in the router tree, it
        // is rendered in the same position as app/layout.tsx.
        //
        // Any navigation to the global Not Found route should trigger a
        // full-page navigation.
        //
        // TODO: We should probably model this by changing the key of the root
        // segment when this happens. Then the root layout check would work
        // as expected, without a special case.
        newSegment === _segment.NOT_FOUND_SEGMENT_KEY) {
            return null;
        }
        return createRenderTreeOnNavigation(navigatedAt, newRouteTree, freshness, seedDynamicStaleAt, parentNeedsDynamicRequest, accumulation, map, restrictToShell);
    }
    const newSlots = newRouteTree.slots;
    let shouldRefreshDynamicData = false;
    switch(freshness){
        case 0:
        case 2:
        case 1:
        case 5:
            shouldRefreshDynamicData = false;
            break;
        case 3:
        case 4:
            shouldRefreshDynamicData = true;
            break;
        default:
            freshness;
            break;
    }
    const isLeafSegment = newSlots === null;
    // Get the data for this segment. Since it was part of the previous route,
    // usually we just reuse the data from the old render tree. If the params
    // changed, or during a refresh or revalidation, consult the prefetch cache
    // or response seed instead.
    let newRenderTree;
    let needsDynamicRequest;
    const paramsChange = (0, _varypath.compareParams)(oldRenderTree.varyPath, newRouteTree.varyPath);
    if (paramsChange !== _varypath.ParamsChange.None) {
        // Path params are part of LayoutRouter's React key, so changing one
        // remounts this segment and everything below it. Generate a new bfcacheId
        // to match. Search params aren't part of the key, so a page whose search
        // params changed keeps its existing id.
        let bfcacheId;
        if (paramsChange === _varypath.ParamsChange.PathParam) {
            bfcacheId = generateBFCacheId(freshness);
        } else {
            bfcacheId = oldRenderTree.data.bfcacheId;
        }
        switch(freshness){
            case 0:
            case 5:
                {
                    // If the existing data didn't read any of the params that changed, we
                    // can keep using it. Refreshes always fetch new data, and back/forward
                    // navigations restore the entry from the BFCache instead.
                    const oldCacheNode = oldRenderTree.data;
                    if (!(0, _varypath.didReadChangedParam)(oldRenderTree.varyPath, newRouteTree.varyPath, oldCacheNode.varyParams)) {
                        const cacheNode = createCacheNode(oldCacheNode.rsc, oldCacheNode.prefetchRsc, oldCacheNode.varyParams, bfcacheId);
                        if (freshness !== 5) {
                            (0, _bfcache.writeToBFCache)(navigatedAt, newRouteTree.varyPath, cacheNode, seedDynamicStaleAt);
                        }
                        newRenderTree = createRenderTree(newRouteTree, cacheNode);
                        needsDynamicRequest = false;
                        break;
                    }
                // Intentional fallthrough
                }
            case 1:
            case 2:
            case 3:
            case 4:
                {
                    const result = createRenderTreeForSegment(navigatedAt, newRouteTree, freshness, seedDynamicStaleAt, bfcacheId, map, restrictToShell);
                    newRenderTree = result.node;
                    needsDynamicRequest = result.needsDynamicRequest;
                    break;
                }
        }
        // A param change mostly acts the same as a refresh, except it does
        // trigger a scroll.
        if (isLeafSegment) {
            accumulateScrollRef(freshness, newRenderTree.data, accumulation);
        }
    } else if (shouldRefreshDynamicData || // During a same-page navigation, we always refetch the page segments
    isLeafSegment && isSamePageNavigation) {
        // This is a refresh of an existing segment. Ignore the existing render
        // tree and create a new one.
        const result = createRenderTreeForSegment(navigatedAt, newRouteTree, freshness, seedDynamicStaleAt, // Refreshing data preserves the identity of the active segment.
        oldRenderTree.data.bfcacheId, map, restrictToShell);
        newRenderTree = result.node;
        needsDynamicRequest = result.needsDynamicRequest;
        // Carry forward the old node's scrollRef. This preserves scroll intent
        // when a prior navigation's render tree is replaced by a refresh before
        // the scroll handler has had a chance to fire — e.g. when router.push()
        // and router.refresh() are called in the same startTransition batch.
        newRenderTree.data.scrollRef = oldRenderTree.data.scrollRef;
    } else {
        // This segment appears in both the old and new routes. Reuse the existing
        // data without triggering a request.
        // TODO: Consider adding a fast path where if this segment is unchanged and
        // all of its children are unchanged, we return the exact same RenderTree
        // object. Reusing the exact previous object gives React more of a chance to
        // bail out of rendering.
        newRenderTree = createRenderTree(newRouteTree, oldRenderTree.data);
        needsDynamicRequest = false;
    }
    // During a refresh navigation, there's a special case that happens when
    // entering a "default" slot. The default slot may not be part of the
    // current route; it may have been reused from an older route. If so,
    // we need to fetch its data from the old route's URL rather than current
    // route's URL. Keep track of this as we traverse the tree.
    const maybeRefreshState = newRouteTree.refreshState;
    const refreshState = maybeRefreshState !== undefined && maybeRefreshState !== null ? // refresh URL as we continue traversing the tree.
    maybeRefreshState : parentRefreshState;
    newRenderTree.refreshState = refreshState;
    // If this segment itself needs to fetch new data from the server, then by
    // definition it is being refreshed. Track its refresh URL so we know which
    // URL to request the data from.
    if (needsDynamicRequest && refreshState !== null) {
        accumulateRefreshUrl(accumulation, refreshState);
    }
    // As we diff the trees, we may sometimes modify (copy-on-write, not mutate)
    // the Route Tree that was returned by the server — for example, in the case
    // of default parallel routes, we preserve the currently active segment. To
    // avoid mutating the original tree, we clone the router state children along
    // the return path.
    let patchedRouterStateChildren = {};
    let taskChildren = null;
    // Most navigations require a request to fetch additional data from the
    // server, either because the data was not already prefetched, or because the
    // target route contains dynamic data that cannot be prefetched.
    //
    // However, if the target route is fully static, and it's already completely
    // loaded into the segment cache, then we can skip the server request.
    //
    // This starts off as `false`, and is set to `true` if any of the child
    // routes requires a dynamic request.
    let childNeedsDynamicRequest = false;
    // As we traverse the children, we'll construct a FlightRouterState that can
    // be sent to the server to request the dynamic data. If it turns out that
    // nothing in the subtree is dynamic (i.e. childNeedsDynamicRequest is false
    // at the end), then this will be discarded.
    // TODO: We can probably optimize the format of this data structure to only
    // include paths that are dynamic. Instead of reusing the
    // FlightRouterState type.
    let dynamicRequestTreeChildren = {};
    if (newSlots !== null) {
        const oldRenderTreeSlots = oldRenderTree.slots;
        const newRenderTreeSlots = new Map();
        newRenderTree.slots = newRenderTreeSlots;
        taskChildren = new Map();
        for (let [parallelRouteKey, newRouteTreeChild] of newSlots){
            const oldRenderTreeChild = oldRenderTreeSlots?.get(parallelRouteKey);
            if (oldRenderTreeChild === undefined) {
                // This should never happen, but if it does, it suggests a malformed
                // server response. Trigger a full-page navigation.
                return null;
            }
            const oldSegmentChild = oldRenderTreeChild.segment;
            const newSegmentChild = newRouteTreeChild.segment;
            if (// Skip this branch during a history traversal. We restore the tree that
            // was stashed in the history entry as-is.
            freshness !== 2 && newSegmentChild === _segment.DEFAULT_SEGMENT_KEY && oldSegmentChild !== _segment.DEFAULT_SEGMENT_KEY && // The active segment was rendered with this layout's params. If a
            // path param changed, we can't keep it. Use the default segment from
            // the server instead.
            paramsChange !== _varypath.ParamsChange.PathParam) {
                // This is a "default" segment. These are never sent by the server during
                // a soft navigation; instead, the client reuses whatever segment was
                // already active in that slot on the previous route.
                newRouteTreeChild = reuseActiveSegmentInDefaultSlot(oldRootRefreshState, oldRenderTreeChild);
            }
            const taskChild = updateRenderTreeOnNavigation(navigatedAt, oldRenderTreeChild, newRouteTreeChild, freshness, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest || needsDynamicRequest, oldRootRefreshState, refreshState, accumulation, map, restrictToShell);
            if (taskChild === null) {
                // One of the child tasks discovered a change to the root layout.
                // Immediately unwind from this recursive traversal. This will trigger a
                // full-page navigation.
                return null;
            }
            // Recursively propagate up the child tasks.
            taskChildren.set(parallelRouteKey, taskChild);
            newRenderTreeSlots.set(parallelRouteKey, taskChild.node);
            // The child tree's route state may be different from the prefetched
            // route sent by the server. We need to clone it as we traverse back up
            // the tree.
            const taskChildRoute = taskChild.route;
            patchedRouterStateChildren[parallelRouteKey] = taskChildRoute;
            const dynamicRequestTreeChild = taskChild.dynamicRequestTree;
            if (dynamicRequestTreeChild !== null) {
                // Something in the child tree is dynamic.
                childNeedsDynamicRequest = true;
                dynamicRequestTreeChildren[parallelRouteKey] = dynamicRequestTreeChild;
            } else {
                dynamicRequestTreeChildren[parallelRouteKey] = taskChildRoute;
            }
        }
    }
    const newFlightRouterState = createRouterStateForSegment(newRouteTree, patchedRouterStateChildren, refreshState);
    return createNavigationTask(needsDynamicRequest ? 0 : 1, newFlightRouterState, newRenderTree, createDynamicRequestTree(newFlightRouterState, dynamicRequestTreeChildren, needsDynamicRequest, childNeedsDynamicRequest, parentNeedsDynamicRequest), taskChildren);
}
/**
 * Assigns a ScrollRef to a new leaf CacheNode so the scroll handler
 * knows to scroll to it after navigation. All leaves in the same
 * navigation share the same ScrollRef — the first segment to scroll
 * consumes it, preventing others from also scrolling.
 *
 * Called for newly entered segments, and for segments whose params changed
 * (even if their data was reused). Refreshes keep the existing scroll ref.
 *
 * Skipped during hydration (initial render should not scroll) and
 * history traversal (scroll restoration is handled separately).
 *
 * The head passes through here as a leaf too; its `scrollRef` is never read
 * (only LayoutRouter reads one), and the page leaf sets the same shared ref.
 */ function accumulateScrollRef(freshness, cacheNode, accumulation) {
    switch(freshness){
        case 0:
        case 5:
        case 3:
        case 4:
            if (accumulation.scrollRef === null) {
                accumulation.scrollRef = {
                    current: true
                };
            }
            cacheNode.scrollRef = accumulation.scrollRef;
            break;
        case 1:
            break;
        case 2:
            break;
        default:
            freshness;
            break;
    }
}
function createRenderTreeOnNavigation(navigatedAt, newRouteTree, freshness, seedDynamicStaleAt, parentNeedsDynamicRequest, accumulation, map, // Instant Navigation Testing API only — restricts segment reads to shell
// entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    // Same traversal as updateRenderTreeOnNavigation, but simpler. We switch to this
    // path once we reach the part of the tree that was not in the previous route.
    // We don't need to diff against the old tree, we just need to create a new
    // one. We also don't need to worry about any refresh-related logic.
    //
    // For the most part, this is a subset of updateRenderTreeOnNavigation, so any
    // change that happens in this function likely needs to be applied to that
    // one, too. However there are some places where the behavior intentionally
    // diverges, which is why we keep them separate.
    const newSlots = newRouteTree.slots;
    const result = createRenderTreeForSegment(navigatedAt, newRouteTree, freshness, seedDynamicStaleAt, // This segment was not part of the previous route, so mint a fresh
    // bfcacheId.
    generateBFCacheId(freshness), map, restrictToShell);
    const newRenderTree = result.node;
    const needsDynamicRequest = result.needsDynamicRequest;
    const isLeafSegment = newSlots === null;
    if (isLeafSegment) {
        accumulateScrollRef(freshness, newRenderTree.data, accumulation);
    }
    let patchedRouterStateChildren = {};
    let taskChildren = null;
    let childNeedsDynamicRequest = false;
    let dynamicRequestTreeChildren = {};
    if (newSlots !== null) {
        const newRenderTreeSlots = new Map();
        newRenderTree.slots = newRenderTreeSlots;
        taskChildren = new Map();
        for (const [parallelRouteKey, newRouteTreeChild] of newSlots){
            const taskChild = createRenderTreeOnNavigation(navigatedAt, newRouteTreeChild, freshness, seedDynamicStaleAt, parentNeedsDynamicRequest || needsDynamicRequest, accumulation, map, restrictToShell);
            taskChildren.set(parallelRouteKey, taskChild);
            newRenderTreeSlots.set(parallelRouteKey, taskChild.node);
            const taskChildRoute = taskChild.route;
            patchedRouterStateChildren[parallelRouteKey] = taskChildRoute;
            const dynamicRequestTreeChild = taskChild.dynamicRequestTree;
            if (dynamicRequestTreeChild !== null) {
                childNeedsDynamicRequest = true;
                dynamicRequestTreeChildren[parallelRouteKey] = dynamicRequestTreeChild;
            } else {
                dynamicRequestTreeChildren[parallelRouteKey] = taskChildRoute;
            }
        }
    }
    // This route is not part of the current tree, so there's no reason to
    // track the refresh URL.
    const refreshState = null;
    const newFlightRouterState = createRouterStateForSegment(newRouteTree, patchedRouterStateChildren, refreshState);
    return createNavigationTask(needsDynamicRequest ? 0 : 1, newFlightRouterState, newRenderTree, createDynamicRequestTree(newFlightRouterState, dynamicRequestTreeChildren, needsDynamicRequest, childNeedsDynamicRequest, parentNeedsDynamicRequest), taskChildren);
}
// Converts a route tree node into the router state the client sends back to
// the server. Page nodes carry their rendered search in its own slot.
function createRouterStateForSegment(routeTree, children, refreshState) {
    const routerState = [
        routeTree.segment,
        children,
        refreshState !== null ? [
            refreshState.canonicalUrl,
            refreshState.renderedSearch
        ] : null,
        null,
        routeTree.prefetchHints
    ];
    if (routeTree.segment === _segment.PAGE_SEGMENT_KEY) {
        const renderedSearch = (0, _varypath.getRenderedSearchFromVaryPath)(routeTree.varyPath);
        if (renderedSearch !== null) {
            routerState[5] = renderedSearch;
        }
    }
    return routerState;
}
function patchRouterStateWithNewChildren(baseRouterState, newChildren) {
    const clone = [
        baseRouterState[0],
        newChildren
    ];
    // Based on equivalent logic in apply-router-state-patch-to-tree, but should
    // confirm whether we need to copy all of these fields. Not sure the server
    // ever sends, e.g. the refetch marker.
    if (2 in baseRouterState) {
        clone[2] = baseRouterState[2];
    }
    if (3 in baseRouterState) {
        clone[3] = baseRouterState[3];
    }
    if (4 in baseRouterState) {
        clone[4] = baseRouterState[4];
    }
    if (5 in baseRouterState) {
        clone[5] = baseRouterState[5];
    }
    return clone;
}
function createDynamicRequestTree(newRouterState, dynamicRequestTreeChildren, needsDynamicRequest, childNeedsDynamicRequest, parentNeedsDynamicRequest) {
    // Create a FlightRouterState that instructs the server how to render the
    // requested segment.
    //
    // Or, if neither this segment nor any of the children require a new data,
    // then we return `null` to skip the request.
    let dynamicRequestTree = null;
    if (needsDynamicRequest) {
        dynamicRequestTree = patchRouterStateWithNewChildren(newRouterState, dynamicRequestTreeChildren);
        // The "refetch" marker is set on the top-most segment that requires new
        // data. We can omit it if a parent was already marked.
        if (!parentNeedsDynamicRequest) {
            dynamicRequestTree[3] = 'refetch';
        }
    } else if (childNeedsDynamicRequest) {
        // This segment does not request new data, but at least one of its
        // children does.
        dynamicRequestTree = patchRouterStateWithNewChildren(newRouterState, dynamicRequestTreeChildren);
    } else {
        dynamicRequestTree = null;
    }
    return dynamicRequestTree;
}
function accumulateRefreshUrl(accumulation, refreshState) {
    // This is a refresh navigation, and we're inside a "default" slot that's
    // not part of the current route; it was reused from an older route. In
    // order to get fresh data for this reused route, we need to issue a
    // separate request using the old route's URL.
    //
    // Track these extra URLs in the accumulated result. Later, we'll construct
    // an appropriate request for each unique URL in the final set. The reason
    // we don't do it immediately here is so we can deduplicate multiple
    // instances of the same URL into a single request. See
    // listenForDynamicRequest for more details.
    const refreshUrl = refreshState.canonicalUrl;
    const separateRefreshUrls = accumulation.separateRefreshUrls;
    if (separateRefreshUrls === null) {
        accumulation.separateRefreshUrls = new Set([
            refreshUrl
        ]);
    } else {
        separateRefreshUrls.add(refreshUrl);
    }
}
function reuseActiveSegmentInDefaultSlot(oldRootRefreshState, oldRenderTree) {
    // This is a "default" segment. These are never sent by the server during a
    // soft navigation; instead, the client reuses whatever segment was already
    // active in that slot on the previous route. This means if we later need to
    // refresh the segment, it will have to be refetched from the previous route's
    // URL. We store the refresh context on the active render tree.
    let reusedUrl;
    let reusedRenderedSearch;
    const oldRefreshState = oldRenderTree.refreshState;
    if (oldRefreshState !== null) {
        // This segment was already reused from an even older route. Keep its
        // existing URL and refresh state.
        reusedUrl = oldRefreshState.canonicalUrl;
        reusedRenderedSearch = oldRefreshState.renderedSearch;
    } else {
        // Since this route didn't already have a refresh state, it must have been
        // reachable from the root of the old route. So we use the refresh state
        // that represents the old route.
        reusedUrl = oldRootRefreshState.canonicalUrl;
        reusedRenderedSearch = oldRootRefreshState.renderedSearch;
    }
    const reusedRouteTree = (0, _cache.rebaseInactiveRouteTree)(oldRenderTree);
    reusedRouteTree.refreshState = {
        canonicalUrl: reusedUrl,
        renderedSearch: reusedRenderedSearch
    };
    return reusedRouteTree;
}
function createRenderTree(routeTree, cacheNode) {
    return {
        requestKey: routeTree.requestKey,
        segment: routeTree.segment,
        shellVaryPath: routeTree.shellVaryPath,
        refreshState: null,
        data: cacheNode,
        varyPath: routeTree.varyPath,
        slots: null,
        prefetchHints: routeTree.prefetchHints
    };
}
function createRenderTreeForSegment(now, // A route tree node, or the one-node metadata tree that stands in for the
// head (see createMetadataRouteTree).
tree, freshness, dynamicStaleAt, bfcacheId, map, // Instant Navigation Testing API only — restricts segment reads to shell
// entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    // Construct an owned render tree using data from the BFCache, the client's
    // Segment Cache, or seeded from a server response.
    //
    // If there's a cache miss, or if we only have a partial hit, we'll render
    // the partial state immediately, and spawn a request to the server to fill
    // in the missing data.
    //
    // If the segment is fully cached on the client already, we can omit this
    // segment from the server request.
    //
    // If we already have a dynamic data response associated with this navigation,
    // as in the case of a Server Action-initiated redirect or refresh, we may
    // also be able to use that data without spawning a new request. (This is
    // referred to as the "seed" data.)
    const seedData = tree.data;
    const seedRsc = seedData !== null ? seedData.rsc : null;
    const seedVaryParams = seedData !== null ? seedData.varyParams : null;
    // During certain kinds of navigations, we may be able to render from
    // the BFCache.
    switch(freshness){
        case 0:
            {
                // Check BFCache during regular navigations. The entry's staleAt
                // determines whether it's still fresh. This is used when
                // staleTimes.dynamic is configured globally or when a page exports
                // unstable_dynamicStaleTime for per-page control.
                const bfcacheEntry = (0, _bfcache.readFromBFCacheDuringRegularNavigation)(now, tree.varyPath);
                if (bfcacheEntry !== null) {
                    // A regular navigation that happens to read cached data is still a
                    // fresh navigation, so we use the caller-supplied bfcacheId — the
                    // BFCacheEntry's id is only restored on history-traversal
                    // navigations.
                    return {
                        node: createRenderTree(tree, createCacheNode(bfcacheEntry.rsc, bfcacheEntry.prefetchRsc, bfcacheEntry.varyParams, bfcacheId)),
                        needsDynamicRequest: false
                    };
                }
                break;
            }
        case 1:
            {
                // This is not related to the BFCache but it is a special case.
                //
                // We should never spawn network requests during hydration. We must treat
                // the initial payload as authoritative, because the initial page load is
                // used as a last-ditch mechanism for recovering the app.
                //
                // This is also an important safety check because if this leaks into the
                // server rendering path (which theoretically it never should because the
                // server payload should be consistent), the server would hang because these
                // promises would never resolve.
                //
                // TODO: There is an existing case where the global "not found" boundary
                // triggers this path. But it does render correctly despite that. That's an
                // unusual render path so it's not surprising, but we should look into
                // modeling it in a more consistent way. See also the /_notFound special
                // case in updateRenderTreeOnNavigation.
                const cacheNode = createCacheNode(seedRsc, null, seedVaryParams, bfcacheId);
                (0, _bfcache.writeToBFCache)(now, tree.varyPath, cacheNode, dynamicStaleAt);
                return {
                    node: createRenderTree(tree, cacheNode),
                    needsDynamicRequest: false
                };
            }
        case 2:
            const bfcacheEntry = (0, _bfcache.readFromBFCache)(tree.varyPath);
            if (bfcacheEntry !== null) {
                // Only show prefetched data if the dynamic data is still pending. This
                // avoids a flash back to the prefetch state in a case where it's highly
                // likely to have already streamed in.
                //
                // Tehnically, what we're actually checking is whether the dynamic
                // network response was received. But since it's a streaming response,
                // this does not mean that all the dynamic data has fully streamed in.
                // It just means that _some_ of the dynamic data was received. But as a
                // heuristic, we assume that the rest dynamic data will stream in
                // quickly, so it's still better to skip the prefetch state.
                const oldRsc = bfcacheEntry.rsc;
                const oldRscDidResolve = !isDeferredRsc(oldRsc) || oldRsc.status !== 'pending';
                const dropPrefetchRsc = oldRscDidResolve;
                // Restore the bfcacheId from the cached entry so that back/forward
                // navigations preserve the original id, regardless of whether
                // `cacheComponents` Activity preservation is enabled.
                return {
                    node: createRenderTree(tree, createCacheNode(bfcacheEntry.rsc, dropPrefetchRsc ? null : bfcacheEntry.prefetchRsc, bfcacheEntry.varyParams, bfcacheEntry.bfcacheId)),
                    needsDynamicRequest: false
                };
            }
            break;
        case 3:
        case 4:
        case 5:
            break;
        default:
            freshness;
            break;
    }
    let cachedRsc = null;
    let isCachedRscPartial = true;
    let cachedVaryParams = null;
    const segmentEntry = (0, _cache.readSegmentCacheEntryForNavigation)(now, map, tree.varyPath, restrictToShell);
    if (segmentEntry !== null) {
        switch(segmentEntry.status){
            case _cache.EntryStatus.Fulfilled:
                {
                    // Happy path: a cache hit
                    cachedRsc = segmentEntry.rsc;
                    isCachedRscPartial = segmentEntry.isPartial;
                    cachedVaryParams = segmentEntry.varyParams;
                    break;
                }
            case _cache.EntryStatus.Pending:
                {
                    // We haven't received data for this segment yet, but there's already
                    // an in-progress request. Since it's extremely likely to arrive
                    // before the dynamic data response, we might as well use it.
                    const promiseForFulfilledEntry = (0, _cache.waitForSegmentCacheEntry)(segmentEntry);
                    cachedRsc = promiseForFulfilledEntry.then((entry)=>entry !== null ? entry.rsc : null);
                    // The entry's data hasn't arrived, and neither has the source of the
                    // params it depends on; `cachedVaryParams` stays null.
                    // Because the request is still pending, we typically don't know yet
                    // whether the response will be partial. We shouldn't skip this segment
                    // during the dynamic navigation request. Otherwise, we might need to
                    // do yet another request to fill in the remaining data, creating
                    // a waterfall.
                    //
                    // The one exception is if this segment is being fetched with via
                    // prefetch={true} (i.e. the "force stale" or "full" strategy). If so,
                    // we can assume the response will be full. This field is set to `false`
                    // for such segments.
                    isCachedRscPartial = segmentEntry.isPartial;
                    break;
                }
            case _cache.EntryStatus.Empty:
            case _cache.EntryStatus.Rejected:
                {
                    break;
                }
            default:
                {
                    segmentEntry;
                    break;
                }
        }
    }
    if (process.env.__NEXT_OPTIMISTIC_ROUTING && tree.segment === _segmentvalueencoding.HEAD_REQUEST_KEY && isCachedRscPartial) {
        // TODO: When optimistic routing is enabled, don't block on waiting for
        // the viewport to resolve. This is a temporary workaround until Vary
        // Params are tracked when rendering the metadata. We'll fix it before
        // this feature is stable. However, it's not a critical issue because 1)
        // it will stream in eventually anyway 2) metadata is wrapped in an
        // internal Suspense boundary, so is always non-blocking; this only
        // affects the viewport node, which is meant to blocking, however... 3)
        // before Segment Cache landed this wasn't always the case, anyway, so
        // it's unlikely that many people are relying on this behavior. Still,
        // will be fixed before stable. It's the very next step in the sequence of
        // work on this project.
        //
        // This line of code works because the App Router treats `null` as
        // "no renderable head available", rather than an empty head. React treats
        // an empty string as empty.
        cachedRsc = '';
    }
    // Now combine the cached data with the seed data to determine what we can
    // render immediately, versus what needs to stream in later.
    // A partial state to show immediately while we wait for the final data to
    // arrive. If `rsc` is already a complete value (not partial), or if we
    // don't have any useful partial state, this will be `null`.
    let prefetchRsc;
    // The final, resolved segment data. If the data is missing, this will be a
    // promise that resolves to the eventual data. A resolved value of `null`
    // means the data failed to load; the LayoutRouter will suspend indefinitely
    // until the router updates again (refer to finishNavigationTask).
    let rsc;
    // The source of the params `rsc` depends on. A server response or a
    // fulfilled segment cache entry carries one; a deferred `rsc` gets its
    // source when the response arrives (finishPendingCacheNode).
    let varyParams;
    let doesSegmentNeedDynamicRequest;
    if (seedRsc !== null) {
        // We already have a dynamic server response for this segment.
        if (isCachedRscPartial) {
            // The seed data may still be streaming in, so it's worth showing the
            // partial cached state in the meantime.
            prefetchRsc = cachedRsc;
            rsc = seedRsc;
            varyParams = seedVaryParams;
        } else {
            // We already have a completely cached segment. Ignore the seed data,
            // which may still be streaming in. This shouldn't happen in the normal
            // case because the client will inform the server which segments are
            // already fully cached, and the server will skip rendering them.
            prefetchRsc = null;
            rsc = cachedRsc;
            varyParams = cachedVaryParams;
        }
        doesSegmentNeedDynamicRequest = false;
    } else {
        if (isCachedRscPartial) {
            // The cached data contains dynamic holes, or it's missing entirely. We'll
            // show the partial state immediately (if available), and stream in the
            // final data.
            //
            // Create a pending promise that we can later write to when the
            // data arrives from the server.
            prefetchRsc = cachedRsc;
            rsc = createDeferredRsc();
            varyParams = null;
        } else {
            // The data is fully cached.
            prefetchRsc = null;
            rsc = cachedRsc;
            varyParams = cachedVaryParams;
        }
        doesSegmentNeedDynamicRequest = isCachedRscPartial;
    }
    // Now that we're creating a new segment, write its data to the BFCache. A
    // subsequent back/forward navigation will reuse this same data, until or
    // unless it's cleared by a refresh/revalidation.
    //
    // Skip BFCache writes for optimistic navigations since they are transient
    // and will be replaced by the canonical navigation.
    const cacheNode = createCacheNode(rsc, prefetchRsc, varyParams, bfcacheId);
    if (freshness !== 5) {
        (0, _bfcache.writeToBFCache)(now, tree.varyPath, cacheNode, dynamicStaleAt);
    }
    return {
        node: createRenderTree(tree, cacheNode),
        // TODO: We should store this field on the CacheNode itself. I think we can
        // probably unify NavigationTask, CacheNode, and DeferredRsc into a
        // single type. Or at least CacheNode and DeferredRsc.
        needsDynamicRequest: doesSegmentNeedDynamicRequest
    };
}
function createCacheNode(rsc, prefetchRsc, varyParams, bfcacheId, scrollRef = null) {
    return {
        rsc,
        prefetchRsc,
        varyParams,
        scrollRef,
        bfcacheId
    };
}
// Globally-unique counter for fresh bfcacheIds. Incremented every time a new
// CacheNode is created on the client. The id surfaces to user code as a
// string via `useRouter().bfcacheId`.
let nextBFCacheId = 0;
function generateBFCacheId(freshness) {
    // Server-side rendering and the initial client-side hydration tree both
    // use a fixed sentinel so they reconcile cleanly across hydration. The
    // counter only advances on real client-side navigations after hydration.
    if (typeof window === 'undefined') return 0;
    if (freshness === 1) return 0;
    return ++nextBFCacheId;
}
// Represents whether the previuos navigation resulted in a route tree mismatch.
// A mismatch results in a refresh of the page. If there are two successive
// mismatches, we will fall back to an MPA navigation, to prevent a retry loop.
let previousNavigationDidMismatch = false;
function spawnDynamicRequests(navigation, primaryUrl, nextUrl, freshnessPolicy, accumulation, // The route cache entry used for this navigation, if it came from route
// prediction. Passed through so it can be marked as having a dynamic rewrite
// if the server returns a different pathname than expected (indicating
// dynamic rewrite behavior that varies by param value).
routeCacheEntry, // The original navigation's push/replace intent. Threaded through to the
// server-patch retry logic so it can inherit the intent if the original
// transition hasn't committed yet.
navigateType, navigationLock, // The segment cache map this navigation is bound to. See `segmentCacheMap`
// in cache.ts.
map, signal) {
    let dynamicRequestTree = navigation.tree.dynamicRequestTree;
    if (dynamicRequestTree === null) {
        if (navigation.head.status === 0) {
            // Every segment is cached, but the head is not. Ask the server for the
            // head alone.
            dynamicRequestTree = _cache.MetadataOnlyRequestTree;
        } else {
            // This navigation was fully cached. There are no dynamic requests to spawn.
            previousNavigationDidMismatch = false;
            return;
        }
    }
    // This is intentionally not an async function to discourage the caller from
    // awaiting the result. Any subsequent async operations spawned by this
    // function should result in a separate navigation task, rather than
    // block the original one.
    //
    // In this function we spawn (but do not await) all the network requests that
    // block the navigation, and collect the promises. The next function,
    // `finishNavigationTask`, can await the promises in any order without
    // accidentally introducing a network waterfall.
    const primaryRequestPromise = fetchMissingDynamicData(navigation.tree, navigation.head, dynamicRequestTree, primaryUrl, nextUrl, freshnessPolicy, routeCacheEntry, navigationLock, map, signal);
    const separateRefreshUrls = accumulation.separateRefreshUrls;
    let refreshRequestPromises = null;
    if (separateRefreshUrls !== null) {
        // There are multiple URLs that we need to request the data from. This
        // happens when a "default" parallel route slot is present in the tree, and
        // its data cannot be fetched from the current route. We need to split the
        // combined dynamic request tree into separate requests per URL.
        // TODO: Create a scoped dynamic request tree that omits anything that
        // is not relevant to the given URL. Without doing this, the server may
        // sometimes render more data than necessary; this is not a regression
        // compared to the pre-Segment Cache implementation, though, just an
        // optimization we can make in the future.
        // Construct a request tree for each additional refresh URL. This will
        // prune away everything except the parts of the tree that match the
        // given refresh URL.
        refreshRequestPromises = [];
        const canonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(primaryUrl);
        for (const refreshUrl of separateRefreshUrls){
            if (refreshUrl === canonicalUrl) {
                continue;
            }
            // TODO: Create a scoped dynamic request tree that omits anything that
            // is not relevant to the given URL. Without doing this, the server may
            // sometimes render more data than necessary; this is not a regression
            // compared to the pre-Segment Cache implementation, though, just an
            // optimization we can make in the future.
            // const scopedDynamicRequestTree = splitTaskByURL(task, refreshUrl)
            const scopedDynamicRequestTree = dynamicRequestTree;
            if (scopedDynamicRequestTree !== null) {
                refreshRequestPromises.push(fetchMissingDynamicData(navigation.tree, // The head belongs to the primary URL.
                null, scopedDynamicRequestTree, new URL(refreshUrl, location.origin), // TODO: Just noticed that this should actually the Next-Url at the
                // time the refresh URL was set, not the current Next-Url. Need to
                // start tracking this alongside the refresh URL. In the meantime,
                // if a refresh fails due to a mismatch, it will trigger a
                // hard refresh.
                nextUrl, freshnessPolicy, routeCacheEntry, navigationLock, map, signal));
            }
        }
    }
    // Further async operations are moved into this separate function to
    // discourage sequential network requests.
    const voidPromise = finishNavigationTask(navigation, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType);
    // `finishNavigationTask` is responsible for error handling, so we can attach
    // noop callbacks to this promise.
    voidPromise.then(noop, noop);
}
async function finishNavigationTask(navigation, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType) {
    // Wait for all the requests to finish, or for the first one to fail.
    let exitStatus = await waitForRequestsToFinish(primaryRequestPromise, refreshRequestPromises);
    // Once the all the requests have finished, check the tree for any remaining
    // pending tasks. If anything is still pending, it means the server response
    // does not match the client, and we must refresh to get back to a consistent
    // state. We can skip this step if we already detected a mismatch during the
    // first phase; it doesn't matter in that case because we're going to refresh
    // the whole tree regardless.
    if (exitStatus === 0) {
        exitStatus = abortRemainingPendingTasks(navigation.tree, null, null);
        // A response without a head is a mismatch, like any missing segment. The
        // head's deferred rsc must be resolved to `null` here, never rejected: it
        // renders at the app root, so a rejection would hit the root error
        // boundary while the retry is in flight.
        const headExitStatus = abortRemainingPendingTasks(navigation.head, null, null);
        if (headExitStatus > exitStatus) {
            exitStatus = headExitStatus;
        }
    }
    switch(exitStatus){
        case -1:
            {
                // This navigation was superseded and its request aborted. Its cache nodes
                // may already be reused by the newer navigation, so leave them untouched
                // for the newer request to fulfill. If the tree was abandoned entirely,
                // it can be garbage collected along with its unresolved promises. We do
                // not retry or hard-navigate.
                return;
            }
        case 0:
            {
                // The task has completely finished. There's no missing data. Exit.
                previousNavigationDidMismatch = false;
                return;
            }
        case 1:
            {
                // Some data failed to finish loading. Trigger a soft retry that re-fetches
                // the tree's dynamic data.
                // TODO: As an extra precaution against soft retry loops, consider
                // tracking whether a navigation was itself triggered by a retry. If two
                // happen in a row, fall back to a hard retry.
                const isHardRetry = false;
                const primaryRequestResult = await primaryRequestPromise;
                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, navigation, routeCacheEntry, navigateType, 3);
                return;
            }
        case 3:
            {
                // The route matched, but the request was redirected, so we committed the
                // wrong canonical URL. Re-resolve the route to invalidate the now-stale
                // route cache and correct the URL — but reuse the data we already received
                // (HistoryTraversal) instead of re-fetching it. See issue #95195.
                const isHardRetry = false;
                const primaryRequestResult = await primaryRequestPromise;
                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, navigation, routeCacheEntry, navigateType, 2);
                return;
            }
        case 2:
            {
                // Some data failed to finish loading in a non-recoverable way, such as a
                // network error. Trigger an MPA navigation.
                //
                // Hard navigating/refreshing is how we prevent an infinite retry loop
                // caused by a network error — when the network fails, we fall back to the
                // browser behavior for offline navigations. In the future, Next.js may
                // introduce its own custom handling of offline navigations, but that
                // doesn't exist yet.
                const isHardRetry = true;
                const primaryRequestResult = await primaryRequestPromise;
                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, navigation, routeCacheEntry, navigateType, 3);
                return;
            }
        default:
            {
                return exitStatus;
            }
    }
}
function waitForRequestsToFinish(primaryRequestPromise, refreshRequestPromises) {
    // Custom async combinator logic. This could be replaced by Promise.any but
    // we don't assume that's available.
    //
    // Each promise resolves once the server responsds and the data is written
    // into the render tree. Resolve the combined promise once all the
    // requests finish.
    //
    // Or, resolve as soon as one of the requests fails, without waiting for the
    // others to finish.
    return new Promise((resolve)=>{
        const onFulfill = (result)=>{
            if (result.exitStatus === 0) {
                remainingCount--;
                if (remainingCount === 0) {
                    // All the requests finished successfully.
                    resolve(0);
                }
            } else {
                // One of the requests failed. Exit with a failing status.
                // NOTE: It's possible for one of the requests to fail with SoftRetry
                // and a later one to fail with HardRetry. In this case, we choose to
                // retry immediately, rather than delay the retry until all the requests
                // finish. If it fails again, we will hard retry on the next
                // attempt, anyway.
                resolve(result.exitStatus);
            }
        };
        // onReject shouldn't ever be called because fetchMissingDynamicData's
        // entire body is wrapped in a try/catch. This is just defensive.
        const onReject = ()=>resolve(2);
        // Attach the listeners to the promises.
        let remainingCount = 1;
        primaryRequestPromise.then(onFulfill, onReject);
        if (refreshRequestPromises !== null) {
            remainingCount += refreshRequestPromises.length;
            refreshRequestPromises.forEach((refreshRequestPromise)=>refreshRequestPromise.then(onFulfill, onReject));
        }
    });
}
function dispatchRetryDueToTreeMismatch(isHardRetry, retryUrl, retryNextUrl, seed, navigation, // The route cache entry used for this navigation, if it came from route
// prediction. If the navigation results in a mismatch, we mark it as having
// a dynamic rewrite so future predictions bail out.
routeCacheEntry, // The original navigation's push/replace intent.
originalNavigateType, // Freshness policy for the retry navigation. `RefreshAll` re-fetches the
// tree's dynamic data (used for genuine tree mismatches). `HistoryTraversal`
// reuses the data already in the tree (used when only the URL needs
// correcting after a redirect).
retryFreshnessPolicy) {
    // If the navigation used a route prediction, mark the node it was predicted
    // from as having a dynamic rewrite since it resulted in a mismatch. A route
    // entry the server resolved has nothing to mark: nothing was predicted
    // from it.
    if (routeCacheEntry !== null) {
        const predictedFrom = routeCacheEntry.predictedFrom;
        if (predictedFrom !== null) {
            predictedFrom.hasDynamicRewrite = true;
        }
    } else if (seed !== null) {
        // Even without a direct reference to the route cache entry, we can still
        // mark the route as having a dynamic rewrite by traversing the known route
        // tree. This handles cases where the navigation didn't originate from a
        // route prediction, but still needs to mark the pattern.
        const now = Date.now();
        (0, _optimisticroutes.discoverKnownRoute)(now, retryUrl.pathname, retryUrl.search, retryNextUrl, null, seed.root, false, (0, _createhreffromurl.createHrefFromUrl)(retryUrl), seed.renderedSearch, false, true // hasDynamicRewrite
        );
    }
    // Invalidate all route cache entries. If the navigation used a route entry
    // the server resolved, its tree is what the server just contradicted, so
    // the retry must re-fetch it rather than navigate with it again. This also
    // triggers re-prefetching of visible links.
    (0, _cache.invalidateRouteCacheEntries)(retryNextUrl, {
        tree: navigation.tree.node,
        head: navigation.head.node
    });
    // If this is the second time in a row that a navigation resulted in a
    // mismatch, fall back to a hard (MPA) refresh.
    isHardRetry = isHardRetry || previousNavigationDidMismatch;
    previousNavigationDidMismatch = true;
    // If the original navigation hasn't committed to the browser history yet
    // (the transition suspended before React committed), inherit its push/replace
    // intent. Otherwise, the pushState already ran, so use 'replace' to avoid
    // creating a duplicate history entry.
    //
    // This works because React entangles the retry's state update with the
    // original pending transition — they commit together as a single batch,
    // so the navigate type from the retry is what HistoryUpdater ultimately sees.
    //
    // TODO: Ideally this check would happen right before we schedule the React
    // update (i.e., closer to where the action is dispatched into the queue),
    // not here where the action is constructed. But the current action queue
    // doesn't provide a natural place for that. Revisit when we refactor the
    // action queue into a more reactive navigation model.
    const baseTree = navigation.tree.route;
    const lastCommitted = (0, _committedstate.getLastCommittedTree)();
    const retryNavigateType = lastCommitted !== null && baseTree !== lastCommitted ? originalNavigateType : 'replace';
    const retryAction = {
        type: _routerreducertypes.ACTION_SERVER_PATCH,
        previousTree: baseTree,
        url: retryUrl,
        nextUrl: retryNextUrl,
        seed,
        mpa: isHardRetry,
        navigateType: retryNavigateType,
        freshnessPolicy: retryFreshnessPolicy
    };
    (0, _useactionqueue.dispatchAppRouterAction)(retryAction);
}
async function fetchMissingDynamicData(tree, head, dynamicRequestTree, url, nextUrl, freshnessPolicy, routeCacheEntry, navigationLock, map, signal) {
    try {
        const result = await (0, _fetchserverresponse.fetchServerResponse)(url, {
            flightRouterState: dynamicRequestTree,
            nextUrl,
            isHmrRefresh: freshnessPolicy === 4,
            signal
        });
        if (typeof result === 'string') {
            // fetchServerResponse will return an href to indicate that the SPA
            // navigation failed. For example, if the server triggered a hard
            // redirect, or the fetch request errored. Initiate an MPA navigation
            // to the given href.
            return {
                exitStatus: 2,
                url: new URL(result, location.origin),
                seed: null
            };
        }
        const now = Date.now();
        const seed = (0, _decodeserverresponse.createNavigationSeed)(now, tree.route, result.transportData, // Navigation responses stream in incrementally, so their vary params
        // can't be drained here; they decode as null.
        null, result.isResponsePartial, // Navigation responses always include the param values in the tree, so
        // there's no pathname to parse them from (nor a need to).
        null, result.renderedSearch, null, result.dynamicStaleTime);
        // If the navigation lock is active, wait for it to be released before
        // writing the dynamic data. This allows tests to assert on the prefetched
        // UI state.
        if (process.env.__NEXT_EXPOSE_TESTING_API && navigationLock !== null) {
            await navigationLock;
        }
        if (routeCacheEntry !== null && result.staticStageResponse !== null) {
            (0, _cache.spawnStaticStageCacheWrite)(now, result.staticStageResponse, result.isResponsePartial, result.responseHeaders, dynamicRequestTree, result.renderedSearch, map);
        }
        if (routeCacheEntry !== null && result.runtimePrefetchStream !== null) {
            (0, _cache.writeRuntimePrefetchStreamIntoCache)(now, result.runtimePrefetchStream, dynamicRequestTree, result.renderedSearch, map).catch(()=>{
            // The runtime prefetch cache write failed. Not fatal — the
            // navigation completed normally, we just won't cache runtime data.
            });
        }
        // result.dynamicStaleTime is in seconds (from the server's `d` field).
        // Convert to an absolute timestamp using the centralized helper.
        const dynamicStaleAt = (0, _bfcache.computeDynamicStaleAt)(now, result.dynamicStaleTime);
        const didReceiveUnknownParallelRoute = writeDynamicDataIntoNavigationTask(tree, seed.root.tree, dynamicStaleAt, result.debugInfo, result.revealAfter);
        if (head !== null) {
            writeDynamicDataIntoNavigationTask(head, seed.root.head, dynamicStaleAt, result.debugInfo, result.revealAfter);
        }
        const resolvedUrl = new URL(result.canonicalUrl, location.origin);
        // Decide whether the navigation needs to be retried.
        //
        // - A tree mismatch (unknown parallel route) means the data is incomplete,
        //   so we soft-retry and re-fetch the whole tree.
        // - Otherwise, the navigation committed the canonical URL from the route
        //   cache entry it used (a prediction or prefetch). If the request resolved
        //   to a *different* canonical URL — e.g. a middleware/proxy redirect the
        //   prediction didn't account for — then the committed URL is wrong and the
        //   route cache it came from is no longer reliable (the redirect implies a
        //   server change the prediction couldn't know about, like logging in or
        //   out). We re-resolve the route to invalidate the stale cache and correct
        //   the browser URL, reusing the data we just received rather than
        //   re-fetching it. When the entry already reflects the redirect (e.g. a
        //   prefetch that followed it), the committed URL matches and no retry is
        //   needed. See issue #95195.
        let didCommitWrongUrl = false;
        if (routeCacheEntry !== null) {
            const committedUrl = new URL(routeCacheEntry.canonicalUrl, location.origin);
            didCommitWrongUrl = committedUrl.pathname !== resolvedUrl.pathname || committedUrl.search !== resolvedUrl.search;
        }
        const exitStatus = didReceiveUnknownParallelRoute ? 1 : didCommitWrongUrl ? 3 : 0;
        return {
            exitStatus,
            url: resolvedUrl,
            seed
        };
    } catch  {
        if (signal?.aborted) {
            // A newer HMR refresh superseded this one and aborted its request. Treat
            // it as canceled rather than a failure, so we don't retry or
            // hard-navigate.
            return {
                exitStatus: -1,
                url,
                seed: null
            };
        }
        // This shouldn't happen because fetchServerResponse's entire body is
        // wrapped in a try/catch. If it does, though, it implies the server failed
        // to respond with any tree at all. So we must fall back to a hard retry.
        return {
            exitStatus: 2,
            url: url,
            seed: null
        };
    }
}
function writeDynamicDataIntoNavigationTask(task, serverRouteTree, dynamicStaleAt, debugInfo, revealAfter) {
    // A non-null data object means the response accounted for this segment,
    // even if it didn't render it (data.rsc may still be null, e.g. for the
    // intermediate segments on the path to a rendered subtree).
    const dynamicData = serverRouteTree.data;
    if (task.status === 0 && dynamicData !== null) {
        task.status = 1;
        const cacheNode = task.node.data;
        finishPendingCacheNode(cacheNode, dynamicData, debugInfo, revealAfter);
        // The BFCache entry for this segment was written before the response
        // arrived. Bring it up to date with what the response filled in: its
        // staleAt (the per-page unstable_dynamicStaleTime if set, or the default
        // DYNAMIC_STALETIME_MS) and the source of the params its data depends
        // on. We only update segments that received dynamic data — static
        // segments are unaffected.
        (0, _bfcache.updateBFCacheEntryFromDynamicResponse)(serverRouteTree.varyPath, cacheNode, dynamicStaleAt);
    }
    const taskChildren = task.children;
    const serverChildren = serverRouteTree.slots;
    // Detect whether the server sends a parallel route slot that the client
    // doesn't know about.
    let didReceiveUnknownParallelRoute = false;
    if (taskChildren !== null) {
        if (serverChildren !== null) {
            for (const [parallelRouteKey, serverRouteTreeChild] of serverChildren){
                const taskChild = taskChildren.get(parallelRouteKey);
                if (taskChild === undefined) {
                    // The server sent a child segment that the client doesn't know about.
                    //
                    // When we receive an unknown parallel route, we must consider it a
                    // mismatch. This is unlike the case where the segment itself
                    // mismatches, because multiple routes can be active simultaneously.
                    // But a given layout should never have a mismatching set of
                    // child slots.
                    //
                    // Theoretically, this should only happen in development during an HMR
                    // refresh, because the set of parallel routes for a layout does not
                    // change over the lifetime of a build/deployment. In production, we
                    // should have already mismatched on either the build id or the segment
                    // path. But as an extra precaution, we validate in prod, too.
                    didReceiveUnknownParallelRoute = true;
                } else {
                    // Check that the response is for the route we expected: same route
                    // structure and same params, including the page's search params.
                    if ((0, _cache.doesRouteStructureMatch)(taskChild.node, serverRouteTreeChild) && serverRouteTreeChild.data !== null && (0, _varypath.compareParams)(taskChild.node.varyPath, serverRouteTreeChild.varyPath) === _varypath.ParamsChange.None) {
                        // Found a match for this task. Keep traversing down the task tree.
                        const childDidReceiveUnknownParallelRoute = writeDynamicDataIntoNavigationTask(taskChild, serverRouteTreeChild, dynamicStaleAt, debugInfo, revealAfter);
                        if (childDidReceiveUnknownParallelRoute) {
                            didReceiveUnknownParallelRoute = true;
                        }
                    }
                }
            }
        } else {
            if (serverChildren !== null) {
                // The server sent a child segment that the client doesn't know about.
                didReceiveUnknownParallelRoute = true;
            }
        }
    }
    return didReceiveUnknownParallelRoute;
}
function finishPendingCacheNode(cacheNode, dynamicData, debugInfo, revealAfter) {
    // Writes a dynamic response into an existing render tree. This does _not_
    // create a new tree, it updates the existing tree in-place. So it must follow
    // the Suspense rules of cache safety — it can resolve pending promises, but
    // it cannot overwrite existing data. It can add segments to the tree (because
    // a missing segment will cause the layout router to suspend) but it cannot
    // delete them.
    //
    // We must resolve every promise in the tree, or else it will suspend
    // indefinitely. If we did not receive data for a segment, we will resolve its
    // data promise to `null` to trigger a lazy fetch during render.
    // Use the dynamic data from the server to fulfill the deferred RSC promise.
    const rsc = cacheNode.rsc;
    const dynamicSegmentData = dynamicData.rsc;
    if (dynamicSegmentData === null) {
        // This particular server request did not
        // render this segment. There may be a separate pending request that will,
        // though, so we won't abort the task until all pending requests finish.
        return;
    }
    // TODO: `varyParams` must always describe the render that produced `rsc`,
    // but nothing in the CacheNode type ties the two fields together; this
    // function keeps them in lockstep by writing both at once. Eventually the
    // whole CacheNode should be a thenable whose fields are populated through
    // dedicated helpers that own the state transition.
    if (rsc === null) {
        // This is a lazy cache node. We can overwrite it. This is only safe
        // because we know that the LayoutRouter suspends if `rsc` is `null`.
        cacheNode.rsc = dynamicSegmentData;
        cacheNode.varyParams = dynamicData.varyParams;
    } else if (isDeferredRsc(rsc) && rsc.status === 'pending') {
        // This is a deferred RSC promise. We can fulfill it with the data we just
        // received from the server. The source of the params that data depends
        // on travels with it.
        //
        // In the streaming dev render, defer the fill until `revealAfter` settles,
        // so React doesn't render the boundary's children before their row has been
        // decoded (otherwise it suspends on the still-pending children and commits
        // a premature fallback). Outside that render `revealAfter` is null and we
        // resolve immediately.
        cacheNode.varyParams = dynamicData.varyParams;
        if (revealAfter !== null) {
            const resolveRsc = ()=>rsc.resolve(dynamicSegmentData, debugInfo);
            // Use the same callback for both outcomes: we don't expect `revealAfter`
            // to reject, but if it ever did (e.g. a connection drop mid-stream) we'd
            // still want to resolve the RSC.
            revealAfter.then(resolveRsc, resolveRsc);
        } else {
            rsc.resolve(dynamicSegmentData, debugInfo);
        }
    } else {
    // This is not a deferred RSC promise that's still pending, nor is it
    // empty, so it must have been populated by a different navigation. We
    // must not overwrite it (nor its dependency source).
    }
}
function abortRemainingPendingTasks(task, error, debugInfo) {
    let exitStatus;
    if (task.status === 0) {
        // The data for this segment is still missing.
        task.status = 2;
        abortPendingCacheNode(task.node.data, error, debugInfo);
        // If the server failed to fulfill the data for this segment, it implies
        // that the route tree received from the server mismatched the tree that
        // was previously prefetched.
        //
        // In an app with fully static routes and no proxy-driven redirects or
        // rewrites, this should never happen, because the route for a URL would
        // always be the same across multiple requests. So, this implies that some
        // runtime routing condition changed, likely in a proxy, without being
        // pushed to the client.
        //
        // When this happens, we treat this the same as a refresh(). The entire
        // tree will be re-rendered from the root.
        if (task.node.refreshState === null) {
            // Trigger a "soft" refresh. Essentially the same as calling `refresh()`
            // in a Server Action.
            exitStatus = 1;
        } else {
            // The mismatch was discovered inside an inactive parallel route. This
            // implies the inactive parallel route is no longer reachable at the URL
            // that originally rendered it. Fall back to an MPA refresh.
            // TODO: An alternative could be to trigger a soft refresh but to _not_
            // re-use the inactive parallel routes this time. Similar to what would
            // happen if were to do a hard refrehs, but without the HTML page.
            exitStatus = 2;
        }
    } else {
        // This segment finished. (An error here is treated as Done because they are
        // surfaced to the application during render.)
        exitStatus = 0;
    }
    const taskChildren = task.children;
    if (taskChildren !== null) {
        for (const [, taskChild] of taskChildren){
            const childExitStatus = abortRemainingPendingTasks(taskChild, error, debugInfo);
            // Propagate the exit status up the tree. The statuses are ordered by
            // their precedence.
            if (childExitStatus > exitStatus) {
                exitStatus = childExitStatus;
            }
        }
    }
    return exitStatus;
}
function abortPendingCacheNode(cacheNode, error, debugInfo) {
    const rsc = cacheNode.rsc;
    if (isDeferredRsc(rsc)) {
        if (error === null) {
            // This will trigger a lazy fetch during render.
            rsc.resolve(null, debugInfo);
        } else {
            // This will trigger an error during rendering.
            rsc.reject(error, debugInfo);
        }
    }
}
const DEFERRED = Symbol();
function isDeferredRsc(value) {
    return value && typeof value === 'object' && value.tag === DEFERRED;
}
function createDeferredRsc() {
    // Create an unresolved promise that represents data derived from a Flight
    // response. The promise will be resolved later as soon as we start receiving
    // data from the server, i.e. as soon as the Flight client decodes and returns
    // the top-level response object.
    // The `_debugInfo` field contains profiling information. Promises that are
    // created by Flight already have this info added by React; for any derived
    // promise created by the router, we need to transfer the Flight debug info
    // onto the derived promise.
    //
    // The debug info represents the latency between the start of the navigation
    // and the start of rendering. (It does not represent the time it takes for
    // whole stream to finish.)
    const debugInfo = [];
    let resolve;
    let reject;
    const pendingRsc = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    pendingRsc.status = 'pending';
    pendingRsc.resolve = (value, responseDebugInfo)=>{
        if (pendingRsc.status === 'pending') {
            const fulfilledRsc = pendingRsc;
            fulfilledRsc.status = 'fulfilled';
            fulfilledRsc.value = value;
            if (responseDebugInfo !== null) {
                // Transfer the debug info to the derived promise.
                debugInfo.push.apply(debugInfo, responseDebugInfo);
            }
            resolve(value);
        }
    };
    pendingRsc.reject = (error, responseDebugInfo)=>{
        if (pendingRsc.status === 'pending') {
            const rejectedRsc = pendingRsc;
            rejectedRsc.status = 'rejected';
            rejectedRsc.reason = error;
            if (responseDebugInfo !== null) {
                // Transfer the debug info to the derived promise.
                debugInfo.push.apply(debugInfo, responseDebugInfo);
            }
            reject(error);
        }
    };
    pendingRsc.tag = DEFERRED;
    pendingRsc._debugInfo = debugInfo;
    return pendingRsc;
}
function getCurrentNavigationLock() {
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        const { getCurrentNavigationGate } = require('./segment-cache/navigation-testing-lock');
        return getCurrentNavigationGate();
    }
    return null;
}
function beginLockedNavigation() {
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        const { beginLockedNavigation: begin } = require('./segment-cache/navigation-testing-lock');
        return begin();
    }
    return null;
}
function resetNavigationLockToPending() {
    if (process.env.__NEXT_EXPOSE_TESTING_API) {
        const { resetNavigationLockToPending: reset } = require('./segment-cache/navigation-testing-lock');
        reset();
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=render-tree.js.map