"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createFullTreeForNavigation: null,
    walkTreeWithFlightRouterState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createFullTreeForNavigation: function() {
        return createFullTreeForNavigation;
    },
    walkTreeWithFlightRouterState: function() {
        return walkTreeWithFlightRouterState;
    }
});
const _segment = require("../../shared/lib/segment");
const _querystring = require("../../shared/lib/router/utils/querystring");
const _rsctransport = require("../../shared/lib/rsc-transport");
const _getcssinlinedlinktags = require("./get-css-inlined-link-tags");
const _getpreloadablefonts = require("./get-preloadable-fonts");
const _createtransporttreefromloadertree = require("./create-transport-tree-from-loader-tree");
const _hasloadingcomponentintree = require("./has-loading-component-in-tree");
const _createcomponenttree = require("./create-component-tree");
function didRouteOrPathParamChange(actualSegment, requestedSegment) {
    // The caller handles the page's search params separately.
    if (typeof actualSegment === 'string' || typeof requestedSegment === 'string') {
        // Static segments have to match exactly.
        return actualSegment !== requestedSegment;
    }
    // Both segments are dynamic. Compare the param name, type, and value. The
    // static sibling hints (index 3) aren't part of the segment's identity.
    return actualSegment[0] !== requestedSegment[0] || actualSegment[2] !== requestedSegment[2] || actualSegment[1] !== requestedSegment[1];
}
async function walkTreeWithFlightRouterState({ loaderTreeToFilter, parentParams, flightRouterState, parentIsInsideSharedLayout, rscHead, injectedCSS, injectedJS, injectedFontPreloadTags, rootLayoutIncluded, ctx, preloadCallbacks, MetadataOutlet, hintTree }) {
    const { renderOpts: { nextFontManifest, experimental }, query, isPrefetch, getDynamicParamFromSegment, parsedRequestHeaders } = ctx;
    const prefetchInliningEnabled = Boolean(experimental.prefetchInlining);
    const partialPrefetching = Boolean(ctx.renderOpts.partialPrefetching);
    const [segment, parallelRoutes, modules] = loaderTreeToFilter;
    const parallelRoutesKeys = Object.keys(parallelRoutes);
    const { layout } = modules;
    const isLayout = typeof layout !== 'undefined';
    /**
   * Checks if the current segment is a root layout.
   */ const rootLayoutAtThisLevel = isLayout && !rootLayoutIncluded;
    /**
   * Checks if the current segment or any level above it has a root layout.
   */ const rootLayoutIncludedAtThisLevelOrAbove = rootLayoutIncluded || rootLayoutAtThisLevel;
    // Because this function walks to a deeper point in the tree to start rendering we have to track the dynamic parameters up to the point where rendering starts
    const segmentParam = getDynamicParamFromSegment(loaderTreeToFilter);
    const currentParams = // Handle null case where dynamic param is optional
    segmentParam && segmentParam.value !== null ? {
        ...parentParams,
        [segmentParam.param]: segmentParam.value
    } : parentParams;
    const actualSegment = segmentParam ? segmentParam.treeSegment : segment;
    /**
   * Decide if the current segment is where rendering has to start.
   */ const renderComponentsOnThisLevel = // No further router state available
    !flightRouterState || // Route structure or path param changed
    didRouteOrPathParamChange(actualSegment, flightRouterState[0]) || // Normal requests leave out the page's search params, so treat a missing
    // value as empty. HMR requests include them.
    actualSegment === _segment.PAGE_SEGMENT_KEY && (0, _querystring.getRenderedSearch)(query) !== (flightRouterState[5] === undefined ? '' : flightRouterState[5]) || // Explicit refresh
    flightRouterState[3] === 'refetch';
    // Pre-PPR, the `loading` component signals to the router how deep to render the component tree
    // to ensure prefetches are quick and inexpensive. If there's no `loading` component anywhere in the tree being rendered,
    // the prefetch will be short-circuited to avoid requesting a potentially very expensive subtree. If there's a `loading`
    // somewhere in the tree, we'll recursively render the component tree up until we encounter that loading component, and then stop.
    // Check if we're inside the "new" part of the navigation — inside the
    // shared layout. In the case of a prefetch, this can be true even if the
    // segment matches, because the client might send a matching segment to
    // indicate that it already has the data in its cache. But in order to find
    // the correct loading boundary, we still need to track where the shared
    // layout begins.
    //
    // TODO: We should rethink the protocol for dynamic requests. It might not
    // make sense for the client to send a FlightRouterState, since that type is
    // overloaded with other concerns.
    const isInsideSharedLayout = renderComponentsOnThisLevel || parentIsInsideSharedLayout || flightRouterState[3] === 'inside-shared-layout';
    if (isInsideSharedLayout && !experimental.isRoutePPREnabled && // If PPR is disabled, and this is a request for the route tree, then we
    // never render any components. Only send the router state.
    (parsedRequestHeaders.isRouteTreePrefetchRequest || // Otherwise, check for the presence of a `loading` component.
    isPrefetch && !Boolean(modules.loading) && !(0, _hasloadingcomponentintree.hasLoadingComponentInTree)(loaderTreeToFilter))) {
        // Send only the router state.
        // TODO: Even for a dynamic route, we should cache these responses,
        // because they do not contain any render data (neither segment data nor
        // the head). They can be made even more cacheable once we move the route
        // params into a separate data structure.
        const tree = parsedRequestHeaders.isRouteTreePrefetchRequest ? await (0, _createtransporttreefromloadertree.createRouteTreePrefetch)(loaderTreeToFilter, hintTree, prefetchInliningEnabled, ctx.missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, ctx.renderOpts.notFoundParams, rootLayoutIncluded) : await (0, _createtransporttreefromloadertree.createTransportTreeFromLoaderTree)(loaderTreeToFilter, hintTree, prefetchInliningEnabled, ctx.missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, ctx.renderOpts.notFoundParams, rootLayoutIncluded);
        return {
            tree,
            head: [
                null,
                null
            ],
            isHeadPartial: true
        };
    }
    // Similar to the previous branch. This flag is sent by the client to request
    // only the metadata for a page. No segment data.
    if (flightRouterState && flightRouterState[3] === 'metadata-only') {
        const tree = parsedRequestHeaders.isRouteTreePrefetchRequest ? await (0, _createtransporttreefromloadertree.createRouteTreePrefetch)(loaderTreeToFilter, hintTree, prefetchInliningEnabled, ctx.missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, ctx.renderOpts.notFoundParams) : await (0, _createtransporttreefromloadertree.createTransportTreeFromLoaderTree)(loaderTreeToFilter, hintTree, prefetchInliningEnabled, ctx.missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, ctx.renderOpts.notFoundParams, rootLayoutIncluded);
        return {
            tree,
            head: rscHead,
            isHeadPartial: false
        };
    }
    if (renderComponentsOnThisLevel) {
        // Render the component tree for this slice of the loaderTree, returned
        // as the response's transport tree.
        const tree = await (0, _createcomponenttree.createComponentTree)(// This ensures flightRouterPath is valid and filters down the tree
        {
            ctx,
            loaderTree: loaderTreeToFilter,
            parentParams: currentParams,
            parentOptionalCatchAllParamName: null,
            parentRuntimePrefetchable: false,
            injectedCSS,
            injectedJS,
            injectedFontPreloadTags,
            // This is intentionally not "rootLayoutIncludedAtThisLevelOrAbove" as createComponentTree starts at the current level and does a check for "rootLayoutAtThisLevel" too.
            rootLayoutIncluded,
            preloadCallbacks,
            authInterrupts: experimental.authInterrupts,
            MetadataOutlet,
            isPrerendering: false,
            hintTree
        });
        return {
            tree,
            head: rscHead,
            isHeadPartial: false
        };
    }
    // If we are not rendering on this level we need to check if the current
    // segment has a layout. If so, we need to track all the used CSS to make
    // the result consistent.
    const layoutPath = layout == null ? void 0 : layout[1];
    const injectedCSSWithCurrentLayout = new Set(injectedCSS);
    const injectedJSWithCurrentLayout = new Set(injectedJS);
    const injectedFontPreloadTagsWithCurrentLayout = new Set(injectedFontPreloadTags);
    if (layoutPath) {
        (0, _getcssinlinedlinktags.getLinkAndScriptTags)(layoutPath, injectedCSSWithCurrentLayout, injectedJSWithCurrentLayout, true);
        (0, _getpreloadablefonts.getPreloadableFonts)(nextFontManifest, layoutPath, injectedFontPreloadTagsWithCurrentLayout);
    }
    // Walk through all parallel routes, collecting the subtrees of the slots
    // that produced output. A slot that produced nothing is omitted from the
    // children map: the response carries no information about it.
    let children;
    let firstSubtree = null;
    for (const parallelRouteKey of parallelRoutesKeys){
        var _hintTree_slots;
        const parallelRoute = parallelRoutes[parallelRouteKey];
        const subtreeResult = await walkTreeWithFlightRouterState({
            ctx,
            loaderTreeToFilter: parallelRoute,
            parentParams: currentParams,
            flightRouterState: flightRouterState && flightRouterState[1][parallelRouteKey],
            parentIsInsideSharedLayout: isInsideSharedLayout,
            rscHead,
            injectedCSS: injectedCSSWithCurrentLayout,
            injectedJS: injectedJSWithCurrentLayout,
            injectedFontPreloadTags: injectedFontPreloadTagsWithCurrentLayout,
            rootLayoutIncluded: rootLayoutIncludedAtThisLevelOrAbove,
            preloadCallbacks,
            MetadataOutlet,
            hintTree: (hintTree == null ? void 0 : (_hintTree_slots = hintTree.slots) == null ? void 0 : _hintTree_slots[parallelRouteKey]) ?? null
        });
        if (subtreeResult === null) {
            continue;
        }
        if (children === undefined) {
            children = new Map();
        }
        children.set(parallelRouteKey, subtreeResult.tree);
        if (firstSubtree === null) {
            firstSubtree = subtreeResult;
        }
    }
    if (children === undefined || firstSubtree === null) {
        // Nothing below this segment produced output.
        return null;
    }
    return {
        // This segment is skipped: it's on the path from the root down to the
        // rendered subtrees, so the client is expected to already have it.
        tree: {
            s: (0, _rsctransport.segmentToTransportSegment)(actualSegment),
            // The UI is shared, but route-specific restrictions may have changed
            // (e.g. an open sibling navigating to a dynamicParams=false page).
            h: await (0, _createtransporttreefromloadertree.computeSegmentPrefetchHints)(loaderTreeToFilter, hintTree, prefetchInliningEnabled, ctx.missingPrefetchHintPolicy, partialPrefetching, !rootLayoutIncluded, ctx.renderOpts.notFoundParams),
            d: (0, _rsctransport.createSkippedSegmentData)(),
            c: children
        },
        // The head is identical across all the subtrees of a response; take the
        // first one.
        head: firstSubtree.head,
        isHeadPartial: firstSubtree.isHeadPartial
    };
}
async function createFullTreeForNavigation({ loaderTree, rscHead, injectedCSS, injectedJS, injectedFontPreloadTags, ctx, preloadCallbacks, MetadataOutlet }) {
    var _ctx_renderOpts_prefetchHints;
    const { renderOpts: { experimental }, pagePath } = ctx;
    const hintTreeForInitialRender = ((_ctx_renderOpts_prefetchHints = ctx.renderOpts.prefetchHints) == null ? void 0 : _ctx_renderOpts_prefetchHints[pagePath]) ?? null;
    const tree = await (0, _createcomponenttree.createComponentTree)({
        ctx,
        loaderTree,
        parentParams: {},
        parentOptionalCatchAllParamName: null,
        parentRuntimePrefetchable: false,
        injectedCSS,
        injectedJS,
        injectedFontPreloadTags,
        rootLayoutIncluded: false,
        preloadCallbacks,
        authInterrupts: experimental.authInterrupts,
        MetadataOutlet,
        isPrerendering: false,
        hintTree: hintTreeForInitialRender
    });
    return {
        tree,
        head: rscHead,
        isHeadPartial: false
    };
}

//# sourceMappingURL=walk-tree-with-flight-router-state.js.map