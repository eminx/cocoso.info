"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    computeSegmentPrefetchHints: null,
    createFullTransportTreeFromLoaderTree: null,
    createRouteTreePrefetch: null,
    createTransportTreeFromLoaderTree: null,
    getMissingPrefetchHintPolicy: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    computeSegmentPrefetchHints: function() {
        return computeSegmentPrefetchHints;
    },
    createFullTransportTreeFromLoaderTree: function() {
        return createFullTransportTreeFromLoaderTree;
    },
    createRouteTreePrefetch: function() {
        return createRouteTreePrefetch;
    },
    createTransportTreeFromLoaderTree: function() {
        return createTransportTreeFromLoaderTree;
    },
    getMissingPrefetchHintPolicy: function() {
        return getMissingPrefetchHintPolicy;
    }
});
const _approutertypes = require("../../shared/lib/app-router-types");
const _rsctransport = require("../../shared/lib/rsc-transport");
const _getsegmentparam = require("../../shared/lib/router/utils/get-segment-param");
function getMissingPrefetchHintPolicy(isBuildTimePrerendering, isPrerendering, cacheComponents) {
    if (isBuildTimePrerendering) {
        return 'mark-stale';
    }
    if (isPrerendering || cacheComponents) {
        // TODO(#91407): Runtime prerenders should always have hints from the
        // manifest. Until that is guaranteed, disable prefetching when they are
        // missing. Fully dynamic Cache Components routes have no manifest entry,
        // so disabling prefetching is their permanent fallback.
        return 'disable-prefetching';
    }
    return 'none';
}
async function computeSegmentPrefetchHints(loaderTree, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, // Whether this segment is at or above the root layout (no layout was found
// above it).
isRootLayoutOrAbove, notFoundParams) {
    const { layout, loading, page } = loaderTree[2];
    // Load the layout or page module to check its instant and prefetch
    // configs. When a segment doesn't export prefetch, it defaults to
    // 'partial' if the app has opted into partial prefetching globally via the
    // `partialPrefetching` config in next.config.js.
    const mod = layout ? await layout[0]() : page ? await page[0]() : undefined;
    const instantConfig = mod ? mod.instant : undefined;
    const prefetchConfig = (mod ? mod.prefetch : undefined) ?? (partialPrefetching ? 'partial' : undefined);
    let prefetchHints = 0;
    // Union in the precomputed build-time hints (e.g. segment inlining
    // decisions) if available. When hints are not available (e.g. dev mode or
    // if prefetch-hints.json was not generated), we fall through and still
    // compute the other hints below. In the future this should be a build
    // error, but for now we gracefully degrade.
    //
    // TODO: Move more of the hints computation (IsRootLayoutOrAbove, instant config,
    // loading boundary detection) into the build-time measurement step in
    // collectPrefetchHints, so this function only needs to union the
    // precomputed bitmask rather than re-derive hints on every render.
    if (hintTree !== null) {
        prefetchHints |= hintTree.hints;
    } else if (prefetchInliningEnabled) {
        if (missingPrefetchHintPolicy === 'mark-stale') {
            // Prefetch inlining is enabled but no hint tree was provided during a
            // build-time prerender. This happens for the initial RSC payload
            // generated before collectPrefetchHints has run. Mark so the client
            // can expire the route cache entry and re-fetch the tree with correct
            // hints.
            prefetchHints |= _approutertypes.PrefetchHint.InliningHintsStale;
        } else if (missingPrefetchHintPolicy === 'disable-prefetching') {
            // At runtime with no hint tree, treat every segment as unprefetchable.
            // This covers both runtime static generation, where a manifest entry
            // should exist but may be missing, and fully dynamic Cache Components
            // routes, which never have a manifest entry. Do NOT set
            // InliningHintsStale because the latter would enter an infinite
            // re-fetch loop trying to get hints that will never exist.
            prefetchHints |= _approutertypes.PrefetchHint.PrefetchDisabled;
        } else {
        // Dynamic pages without Cache Components have no static shell, so hints
        // are never computed. Don't disable prefetching — just skip the inlining
        // hint system and let prefetching proceed normally.
        }
    }
    // Mark every segment at or above the root layout.
    if (isRootLayoutOrAbove) {
        prefetchHints |= _approutertypes.PrefetchHint.IsRootLayoutOrAbove;
    }
    if (notFoundParams == null ? void 0 : notFoundParams.length) {
        const param = (0, _getsegmentparam.getSegmentParam)(loaderTree[0]);
        if (param !== null && notFoundParams.includes(param.paramName)) {
            prefetchHints |= _approutertypes.PrefetchHint.IsClosedParam;
        }
    }
    if (instantConfig === false) {
        // The segment explicitly opts out of Partial Prefetching. We don't change
        // the prefetch behavior, but we record it so the dev-time
        // `<Link prefetch={true}>` warning can be suppressed for this route.
        prefetchHints |= _approutertypes.PrefetchHint.SubtreeHasInstantFalse;
    }
    if (prefetchConfig === 'partial') {
        prefetchHints |= _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching;
    } else if (prefetchConfig === 'force-disabled') {
        prefetchHints |= _approutertypes.PrefetchHint.PrefetchDisabled;
    }
    // Check if this segment has a loading boundary
    if (loading) {
        prefetchHints |= _approutertypes.PrefetchHint.SegmentHasLoadingBoundary;
    }
    return prefetchHints;
}
/**
 * Builds a transport tree with no render output directly from the loader
 * tree: each node carries its segment identity and prefetch hints. Rendered
 * trees are produced by createComponentTree instead; this module covers the
 * responses (and subtrees) where nothing is rendered — router-state-only
 * responses, route tree prefetches, the structure beneath a loading-boundary
 * cut in a non-PPR prefetch, and error payloads.
 */ async function createTransportTreeFromLoaderTreeImpl(loaderTree, // What to emit for each position: nothing (the client fetches it lazily;
// false) or skipped data (true). Full trees require the latter — see
// createFullTransportTreeFromLoaderTree.
emitSkippedData, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, didFindRootLayout, notFoundParams) {
    const [segment, parallelRoutes, { layout }] = loaderTree;
    const dynamicParam = getDynamicParamFromSegment(loaderTree);
    const treeSegment = dynamicParam ? dynamicParam.treeSegment : segment;
    let prefetchHints = await computeSegmentPrefetchHints(loaderTree, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, !didFindRootLayout, notFoundParams);
    if (!didFindRootLayout && typeof layout !== 'undefined') {
        // This segment is the root layout; its descendants are below it.
        didFindRootLayout = true;
    }
    let children;
    for(const parallelRouteKey in parallelRoutes){
        var _hintTree_slots;
        // Look up the child hint node by parallel route key, traversing the
        // hint tree in parallel with the loader tree.
        const childHintNode = (hintTree == null ? void 0 : (_hintTree_slots = hintTree.slots) == null ? void 0 : _hintTree_slots[parallelRouteKey]) ?? null;
        const child = await createTransportTreeFromLoaderTreeImpl(parallelRoutes[parallelRouteKey], emitSkippedData, childHintNode, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, didFindRootLayout, notFoundParams);
        // Propagate subtree flags from children
        if (child.h !== undefined) {
            prefetchHints = (0, _approutertypes.propagateSubtreeBits)(prefetchHints, child.h);
        }
        if (children === undefined) {
            children = new Map();
        }
        children.set(parallelRouteKey, child);
    }
    const node = {
        s: (0, _rsctransport.segmentToTransportSegment)(treeSegment)
    };
    if (prefetchHints !== 0) {
        node.h = prefetchHints;
    }
    if (emitSkippedData) {
        node.d = (0, _rsctransport.createSkippedSegmentData)();
    }
    if (children !== undefined) {
        node.c = children;
    }
    return node;
}
async function createTransportTreeFromLoaderTree(loaderTree, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, notFoundParams, // Whether a root layout was already found above this loader tree slice, so a
// slice that starts below the root layout doesn't mark a sub-layout as the
// root layout.
didFindRootLayout = false) {
    return createTransportTreeFromLoaderTreeImpl(loaderTree, false, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, didFindRootLayout, notFoundParams);
}
async function createFullTransportTreeFromLoaderTree(loaderTree, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, notFoundParams) {
    // With emitSkippedData, every node carries data, which is what
    // FullTransportNode requires. TypeScript can't see through the flag,
    // hence the cast.
    return createTransportTreeFromLoaderTreeImpl(loaderTree, true, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, false, notFoundParams);
}
async function createRouteTreePrefetch(loaderTree, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, notFoundParams, // See note on createTransportTreeFromLoaderTree's didFindRootLayout.
didFindRootLayout = false) {
    return createTransportTreeFromLoaderTreeImpl(loaderTree, false, hintTree, prefetchInliningEnabled, missingPrefetchHintPolicy, partialPrefetching, getDynamicParamFromSegment, didFindRootLayout, notFoundParams);
}

//# sourceMappingURL=create-transport-tree-from-loader-tree.js.map