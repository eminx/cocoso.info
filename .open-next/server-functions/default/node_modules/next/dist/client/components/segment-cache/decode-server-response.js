/**
 * Decoding of RSC server responses (the transport format defined in
 * shared/lib/rsc-transport) into the client's own representations. This is
 * the only place on the client that consumes transport types; everything
 * downstream operates on RouteTree / NavigationSeed / CacheNode.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createNavigationSeed: null,
    createRouteTreeNode: null,
    decodeTransportTreeIntoRouteTree: null,
    readFulfilledIsPartial: null,
    readFulfilledStaleTimeSeconds: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createNavigationSeed: function() {
        return createNavigationSeed;
    },
    createRouteTreeNode: function() {
        return createRouteTreeNode;
    },
    decodeTransportTreeIntoRouteTree: function() {
        return decodeTransportTreeIntoRouteTree;
    },
    readFulfilledIsPartial: function() {
        return readFulfilledIsPartial;
    },
    readFulfilledStaleTimeSeconds: function() {
        return readFulfilledStaleTimeSeconds;
    }
});
const _approutertypes = require("../../../shared/lib/app-router-types");
const _rsctransport = require("../../../shared/lib/rsc-transport");
const _varyparamsdecoding = require("../../../shared/lib/segment-cache/vary-params-decoding");
const _segmentvalueencoding = require("../../../shared/lib/segment-cache/segment-value-encoding");
const _segment = require("../../../shared/lib/segment");
const _invarianterror = require("../../../shared/lib/invariant-error");
const _routeparams = require("../../route-params");
const _cachekey = require("./cache-key");
const _varypath = require("./vary-path");
const _cache = require("./cache");
const _bfcache = require("./bfcache");
function createNavigationSeed(now, // Null when the response is not an overlay over existing client state —
// per-segment prefetch responses, whose root-anchored tree covers its own
// spine. Must be non-null when transportData is null (there'd be nothing
// to convert otherwise).
currentTree, transportData, // The response's root vary params (its `r` field): the root params
// accessed anywhere in the response, emitted once at the response level
// and unioned into the head's and every segment's own drained set here at
// the decode boundary. Pass null when the response streams in
// incrementally (navigation and reducer flows): the wire iterables can
// only be drained completely from a fully-buffered response, so their sets
// decode as null ("unknown; key on all params") without touching the wire
// iterables.
rootVaryParams, // Whether anything in the response is not fully resolved: dynamic holes, runtime holes, anything suspended.
// Boolean-form nodes resolve their partiality to this value (their wire
// boolean is a render-wide constant that carries no per-node information —
// see decodeTransportNode), and under Cache Components so does a
// boolean-form head (see the head read below); staged (promise-form)
// nodes encode it per-node and ignore it. Only segment-cache writes
// consume the decoded partiality, so callers whose seeds are never
// written to the cache may pass the conservative value (true).
isResponsePartial, // The pathname the response was rendered for. Required to resolve dynamic
// segments the server sent without a param value (`k: null`); see
// decodeTransportTreeIntoRouteTree. Callers whose responses always carry
// concrete values (navigation responses) may pass null.
renderedPathname, // Already normalized by the response reader (see getRenderedSearch); the
// router state stores it as a plain string, so it is re-branded here.
renderedSearch, // Where to key the head. Null derives it from the route's own first page
// node (see createRouteTreeNode). Per-segment prefetch payloads pass the
// route's own metadata vary path instead: a standalone head response's tree
// is a bare root identity with no page node.
metadataVaryPath, dynamicStaleTimeSeconds) {
    const normalizedRenderedSearch = renderedSearch;
    const acc = {
        metadataVaryPath: null,
        treeDivergedFromBase: false
    };
    let routeTree;
    let headData = null;
    if (transportData !== null) {
        routeTree = decodeTransportTreeIntoRouteTree(transportData.t, currentTree, rootVaryParams, isResponsePartial, renderedPathname, normalizedRenderedSearch, acc);
        const transportHead = transportData.h;
        if (transportHead !== undefined) {
            // The wire form of `p` determines which signal is authoritative for
            // the head's partiality, mirroring the per-node rule in
            // decodeTransportNode:
            //
            // - Promise form (per-segment prefetch responses, fully buffered
            //   before they're decoded): partiality is encoded exactly, per node,
            //   via the staged encoding, so the thenable-status read is
            //   authoritative.
            // - Boolean form (navigation and live-render responses): when Cache
            //   Components is enabled, the server's flag (isPossiblyPartialHead in
            //   app-render.tsx) is unreliable: it's computed before the head is
            //   serialized, so it's conservatively `true` for every
            //   statically-generated PPR page — even pages whose head is actually
            //   complete — and it's `false` for live-render responses whose head
            //   is actually partial (e.g. a route with an async
            //   `generateMetadata`). So we ignore it and derive the head's
            //   partiality from whether the response itself was partial, exactly
            //   as the per-node rule does for segments. A non-partial response
            //   carries a complete head; a partial (postponed) one does not.
            //   Without Cache Components, the server sends the correct
            //   isHeadPartial, so the wire boolean is used as-is.
            headData = {
                rsc: transportHead.r,
                isPartial: typeof transportHead.p === 'boolean' ? process.env.__NEXT_CACHE_COMPONENTS ? isResponsePartial : transportHead.p : readFulfilledIsPartial(transportHead.p),
                varyParams: (0, _varyparamsdecoding.decodeVaryParams)(transportHead.v, rootVaryParams),
                staleTimeSeconds: transportHead.s !== undefined ? readFulfilledStaleTimeSeconds(transportHead.s) : null
            };
        }
    } else {
        if (currentTree === null) {
            throw new _invarianterror.InvariantError('Cannot convert a server response with no transport data and no ' + 'base tree.');
        }
        routeTree = (0, _cache.convertRootFlightRouterStateToRouteTree)(currentTree, normalizedRenderedSearch, acc);
    }
    if (metadataVaryPath === null) {
        metadataVaryPath = acc.metadataVaryPath;
        if (metadataVaryPath === null) {
            // Every route renders a page, so a rendered tree always has a node to
            // key the head under.
            throw new _invarianterror.InvariantError('Cannot key the head of a server response: its tree has no page ' + 'segment.');
        }
    }
    return {
        root: (0, _cache.createRootRouteTree)(routeTree, (0, _cache.createMetadataRouteTree)(metadataVaryPath, routeTree.prefetchHints, headData)),
        renderedSearch: normalizedRenderedSearch,
        dynamicStaleAt: (0, _bfcache.computeDynamicStaleAt)(now, dynamicStaleTimeSeconds),
        treeDivergedFromBase: acc.treeDivergedFromBase
    };
}
function createRouteTreeNode(originalSegment, isRootParam, requestKey, parentPartialVaryPath, renderedSearch, refreshState, acc) {
    let segment;
    let partialVaryPath;
    let varyPath;
    if (Array.isArray(originalSegment)) {
        const paramCacheKey = originalSegment[1];
        const paramName = originalSegment[0];
        partialVaryPath = (0, _varypath.appendLayoutVaryPath)(parentPartialVaryPath, paramCacheKey, paramName, isRootParam);
        varyPath = (0, _varypath.finalizeVaryPath)(requestKey, null, partialVaryPath);
        segment = originalSegment;
    } else {
        // This segment does not have a param. Inherit the partial vary path of
        // the parent.
        partialVaryPath = parentPartialVaryPath;
        if (requestKey.endsWith(_segment.PAGE_SEGMENT_KEY)) {
            // This is a page segment.
            segment = _segment.PAGE_SEGMENT_KEY;
            varyPath = (0, _varypath.finalizeVaryPath)(requestKey, renderedSearch, partialVaryPath);
            // The head is keyed under the route's own first page and varies on the
            // same params as that page (see getHeadRequestKey). A page reused from
            // another URL carries a refresh state and never keys it.
            if (refreshState === null && acc.metadataVaryPath === null) {
                acc.metadataVaryPath = (0, _varypath.finalizeVaryPath)((0, _cache.getHeadRequestKey)(requestKey), renderedSearch, partialVaryPath);
            }
        } else {
            // This is a layout segment.
            segment = originalSegment;
            varyPath = (0, _varypath.finalizeVaryPath)(requestKey, null, partialVaryPath);
        }
    }
    return {
        requestKey,
        segment,
        shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(varyPath),
        refreshState,
        data: null,
        varyPath,
        slots: null,
        prefetchHints: 0
    };
}
function decodeTransportTreeIntoRouteTree(transportNode, baseRouterState, // The response's root vary params, unioned into every segment's drained
// set. Pass null when vary params are unavailable or unwanted; see
// createNavigationSeed.
rootVaryParams, // The response-level partiality, which boolean-form nodes resolve their
// own partiality to; see createNavigationSeed.
isResponsePartial, // The pathname the response was rendered for (from the response headers).
// Required to resolve dynamic segments the server sent without a param
// value (`k: null` — per-segment prefetch responses omit the value to stay
// cacheable across param values); the client parses the value from the
// pathname instead. Callers whose responses always carry concrete values
// (navigation responses) may pass null.
renderedPathname, renderedSearch, acc) {
    const pathnameParts = renderedPathname !== null ? (0, _cachekey.splitPathnameIntoParts)(renderedPathname) : null;
    return decodeTransportNode(transportNode, resolveTransportSegment(transportNode.s, pathnameParts, 0), baseRouterState ?? undefined, baseRouterState ?? undefined, rootVaryParams, isResponsePartial, _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY, null, renderedSearch, pathnameParts, 0, acc);
}
/**
 * Converts a segment's wire identity to the client `Segment` type, resolving
 * dynamic segments whose param value the server omitted (`k: null`) by
 * parsing the value from the rendered pathname. `pathnamePartsIndex` is the
 * URL position this segment occupies (tracked by the tree walk: incremented
 * only for segments that appear in the URL, so route groups and other
 * virtual segments don't consume a part).
 */ function resolveTransportSegment(transportSegment, pathnameParts, pathnamePartsIndex) {
    if (typeof transportSegment === 'string') {
        return transportSegment;
    }
    const paramKey = transportSegment.k;
    if (paramKey !== null) {
        return [
            transportSegment.n,
            paramKey,
            transportSegment.t,
            transportSegment.s
        ];
    }
    if (pathnameParts === null) {
        throw new _invarianterror.InvariantError('Cannot resolve a dynamic segment that has no param value: the ' + 'response provides no rendered pathname to parse it from.');
    }
    const paramValue = (0, _routeparams.parseDynamicParamFromURLPart)(transportSegment.t, pathnameParts, pathnamePartsIndex);
    return [
        transportSegment.n,
        (0, _routeparams.getCacheKeyForDynamicParam)(paramValue),
        transportSegment.t,
        transportSegment.s
    ];
}
function doSegmentsMatch(baseSegment, segment) {
    if (typeof baseSegment === 'string' || typeof segment === 'string') {
        // Static segments have to match exactly.
        return baseSegment === segment;
    }
    // Both segments are dynamic. The static sibling hints aren't part of the
    // segment's identity, so only compare the param name, type, and value.
    const [baseParamName, baseParamValue, baseParamType] = baseSegment;
    const [paramName, paramValue, paramType] = segment;
    return baseParamName === paramName && baseParamType === paramType && baseParamValue === paramValue;
}
function decodeTransportNode(node, // The node's identity, already resolved by the caller (the parent's child
// loop, which has the URL position needed to parse omitted param values).
originalSegment, base, // The base node to compare segment identities against (see
// NavigationSeed.treeDivergedFromBase). Tracked separately from `base`:
// inheritance drops the base inside authoritative subtrees, where the
// comparison must continue, and keeps it through inactive parallel routes,
// where the comparison must stop.
compareBase, rootVaryParams, isResponsePartial, requestKey, parentPartialVaryPath, parentRenderedSearch, pathnameParts, // The URL position this node's children read from.
pathnamePartsIndex, acc) {
    const nodeData = node.d;
    const inheritsFromBase = nodeData !== undefined && nodeData.r === null;
    // The base node this position inherits from, when it does.
    const inheritedBase = inheritsFromBase ? base : undefined;
    if (compareBase !== undefined && !acc.treeDivergedFromBase) {
        // Every transport node echoes the segment's identity, even "skipped"
        // ones, so each position can be compared against the base.
        const transportSegment = node.s;
        if (typeof transportSegment !== 'string' && transportSegment.k == null) {
        // The server omitted the param value for the client to parse from the
        // URL (see resolveTransportSegment). Nothing to compare; the children
        // are still checked.
        } else {
            const baseSegment = compareBase[0];
            if (originalSegment === _segment.DEFAULT_SEGMENT_KEY) {
            // A default filled in by the server is not a claim about the
            // position's identity.
            } else if (!doSegmentsMatch(baseSegment, originalSegment)) {
                acc.treeDivergedFromBase = true;
            }
        }
    }
    const baseHints = inheritedBase !== undefined ? inheritedBase[4] ?? 0 : 0;
    let prefetchHints = node.h ?? baseHints;
    // This segment's param (if any) is a root param iff the segment is at or
    // above the root layout, which the server marks directly.
    const isRootParam = (prefetchHints & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0;
    // Inherited positions keep the base tree's refresh state. Its rendered
    // search is updated to this response's, since all pages within the same
    // response share the same search value. (The refresh state acts like a
    // "context provider" for inactive parallel routes.)
    const baseCompressedRefreshState = inheritedBase !== undefined ? inheritedBase[2] ?? null : null;
    const refreshState = baseCompressedRefreshState !== null ? {
        canonicalUrl: baseCompressedRefreshState[0],
        renderedSearch: parentRenderedSearch
    } : null;
    const renderedSearch = refreshState !== null ? refreshState.renderedSearch : parentRenderedSearch;
    const tree = createRouteTreeNode(originalSegment, isRootParam, requestKey, parentPartialVaryPath, renderedSearch, refreshState, acc);
    const partialVaryPath = (0, _varypath.getPartialVaryPath)(tree.varyPath);
    let slots = null;
    const transportChildren = node.c;
    const baseChildren = inheritedBase !== undefined ? inheritedBase[1] : undefined;
    if (transportChildren !== undefined) {
        for (const [parallelRouteKey, childNode] of transportChildren){
            const childBase = baseChildren !== undefined ? baseChildren[parallelRouteKey] : undefined;
            const childSegment = resolveTransportSegment(childNode.s, pathnameParts, pathnamePartsIndex);
            let childCompareBase;
            if (compareBase !== undefined && !acc.treeDivergedFromBase) {
                const childCompareCandidate = compareBase[1][parallelRouteKey];
                if (childCompareCandidate === undefined) {
                    // A slot the base tree doesn't have. Unless the server merely
                    // filled it with a default, the trees have different structures.
                    if (childSegment !== _segment.DEFAULT_SEGMENT_KEY) {
                        acc.treeDivergedFromBase = true;
                    }
                } else if ((childCompareCandidate[2] ?? null) !== null) {
                // The base branch carries a refresh state: an inactive parallel
                // route reused from a different route (e.g. a "default" slot). The
                // server's answer is expected to differ, so skip the branch.
                } else {
                    childCompareBase = childCompareCandidate;
                }
            }
            // Only advance the URL position for segments that appear in the URL.
            // Virtual segments, like route groups, don't consume a part.
            const childDoesAppearInURL = typeof childSegment === 'string' ? (0, _routeparams.doesStaticSegmentAppearInURL)(childSegment) : true;
            const childPathnamePartsIndex = childDoesAppearInURL ? pathnamePartsIndex + 1 : pathnamePartsIndex;
            const childRequestKey = (0, _segmentvalueencoding.appendSegmentRequestKeyPart)(requestKey, parallelRouteKey, (0, _segmentvalueencoding.createSegmentRequestKeyPart)(childSegment));
            const childTree = decodeTransportNode(childNode, childSegment, childBase, childCompareBase, rootVaryParams, isResponsePartial, childRequestKey, partialVaryPath, renderedSearch, pathnameParts, childPathnamePartsIndex, acc);
            if (slots === null) {
                slots = new Map();
            }
            slots.set(parallelRouteKey, childTree);
        }
    }
    if (baseChildren !== undefined) {
        // Slots the response carries no information about are reused from the
        // base tree, structure-only.
        for(const parallelRouteKey in baseChildren){
            if (transportChildren !== undefined && transportChildren.has(parallelRouteKey)) {
                continue;
            }
            const childBase = baseChildren[parallelRouteKey];
            const childRequestKey = (0, _segmentvalueencoding.appendSegmentRequestKeyPart)(requestKey, parallelRouteKey, (0, _segmentvalueencoding.createSegmentRequestKeyPart)(childBase[0]));
            const childTree = (0, _cache.convertFlightRouterStateToRouteTree)(childBase, childRequestKey, partialVaryPath, renderedSearch, acc);
            if (slots === null) {
                slots = new Map();
            }
            slots.set(parallelRouteKey, childTree);
        }
    }
    if (inheritsFromBase) {
        // Recompute the propagated "subtree" prefetch hints for this segment,
        // since its children may combine response and base subtrees. Mirrors the
        // propagation done on the server in createTransportTreeFromLoaderTree.
        let propagated = prefetchHints & ~_approutertypes.SubtreePrefetchHints;
        if (slots !== null) {
            for (const childTree of slots.values()){
                propagated = (0, _approutertypes.propagateSubtreeBits)(propagated, childTree.prefetchHints);
            }
        }
        prefetchHints = propagated;
    }
    if (nodeData !== undefined) {
        tree.data = {
            rsc: nodeData.r,
            // The wire form of `p` determines which signal is authoritative for
            // this segment's partiality:
            //
            // - Boolean form (navigation and live-render responses): the wire
            //   value is a render-wide constant (`isPossiblyPartialResponse` in
            //   create-component-tree.tsx), identical on every node, so it carries
            //   no per-node information — and it's inaccurate in both directions:
            //   `true` for every node of a statically-generated PPR page even when
            //   the page is actually complete, and `false` for every node of a
            //   dynamic render even when this decode is a truncated stage prefix
            //   whose dynamic rows landed past the boundary. The caller's
            //   response-level value captures both (the `~`/`#` marker for whole
            //   responses; truncation-implied partiality for stage decodes), so it
            //   replaces the wire boolean here.
            // - Promise form (per-segment prefetch responses, fully buffered
            //   before they're decoded): partiality is encoded per node, exactly,
            //   and survives the truncated shell double-decode — a fulfillment row
            //   past the boundary reads as partial. The fulfillment (or its
            //   absence) is already visible on the thenable's status, so it's
            //   authoritative and the response-level value is ignored.
            isPartial: typeof nodeData.p === 'boolean' ? isResponsePartial : readFulfilledIsPartial(nodeData.p),
            // The source of the params this segment's output depends on: the
            // segment's wire iterable, drained here, unioning in the response-level
            // root params (same buffered-read reasoning as `p` above), or decoded
            // as null ("unknown") when the caller passed no root params — see
            // createNavigationSeed.
            varyParams: (0, _varyparamsdecoding.decodeVaryParams)(nodeData.v, rootVaryParams),
            // Per-node staleTime, only present in per-segment prefetch responses
            // (same buffered-read reasoning as `p` above).
            staleTimeSeconds: nodeData.s !== undefined ? readFulfilledStaleTimeSeconds(nodeData.s) : null
        };
    }
    tree.slots = slots;
    tree.prefetchHints = prefetchHints;
    return tree;
}
// A sentinel `readFulfilledValue` fallback that no fulfillment can produce,
// for reads that only care whether the row settled at all.
const notFulfilled = Symbol();
function readFulfilledIsPartial(isPartial) {
    return (0, _rsctransport.readFulfilledValue)(isPartial, notFulfilled) === notFulfilled;
}
function readFulfilledStaleTimeSeconds(staleTime) {
    const iterator = staleTime[Symbol.asyncIterator]();
    let staleTimeSeconds;
    while(true){
        const chunk = (0, _rsctransport.readFulfilledValue)(iterator.next(), undefined);
        if (chunk === undefined || chunk.done) {
            break;
        }
        staleTimeSeconds = chunk.value;
    }
    if (staleTimeSeconds === undefined || isNaN(staleTimeSeconds)) {
        return null;
    }
    return staleTimeSeconds;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=decode-server-response.js.map