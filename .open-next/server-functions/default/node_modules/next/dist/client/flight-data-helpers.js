"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createInitialRSCPayloadFromFallbackPrerender: null,
    getNextFlightSegmentPath: null,
    prepareFlightRouterStateForRequest: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createInitialRSCPayloadFromFallbackPrerender: function() {
        return createInitialRSCPayloadFromFallbackPrerender;
    },
    getNextFlightSegmentPath: function() {
        return getNextFlightSegmentPath;
    },
    prepareFlightRouterStateForRequest: function() {
        return prepareFlightRouterStateForRequest;
    }
});
const _routeparams = require("./route-params");
const _createhreffromurl = require("./components/router-reducer/create-href-from-url");
function createInitialRSCPayloadFromFallbackPrerender(response, fallbackInitialRSCPayload) {
    // This is a static fallback page. In order to hydrate the page, we need to
    // parse the client params from the URL, but to account for the possibility
    // that the page was rewritten, we need to check the response headers
    // for x-nextjs-rewritten-path or x-nextjs-rewritten-query headers. Since
    // we can't access the headers of the initial document response, the client
    // performs a fetch request to the current location. Since it's possible that
    // the fetch request will be dynamically rewritten to a different path than
    // the initial document, this fetch request delivers _all_ the hydration data
    // for the page; it was not inlined into the document, like it normally
    // would be.
    //
    // TODO: Consider treating the case where fetch is rewritten to a different
    // path from the document as a special deopt case. We should optimistically
    // assume this won't happen, inline the data into the document, and perform
    // a minimal request (like a HEAD or range request) to verify that the
    // response matches. Tricky to get right because we need to account for
    // all the different deployment environments we support, like output:
    // "export" mode, where we currently don't assume that custom response
    // headers are present.
    // Patch the transport tree sent by the server with the correct params
    // parsed from the URL + response object.
    const renderedPathname = (0, _routeparams.getRenderedPathname)(response);
    const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
    const canonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(new URL(location.href));
    const fallbackTransportData = fallbackInitialRSCPayload.t;
    const payload = {
        c: canonicalUrl.split('/'),
        q: renderedSearch,
        i: fallbackInitialRSCPayload.i,
        t: {
            t: fillInFallbackTransportTree(fallbackTransportData.t, renderedPathname.split('/').filter((part)=>part !== ''), 0),
            h: fallbackTransportData.h
        },
        m: fallbackInitialRSCPayload.m,
        G: fallbackInitialRSCPayload.G,
        S: fallbackInitialRSCPayload.S
    };
    if (fallbackInitialRSCPayload.b) {
        payload.b = fallbackInitialRSCPayload.b;
    }
    return payload;
}
/**
 * A fallback prerender is rendered without concrete param values. Fill them
 * in by parsing the rendered pathname, so the hydrated tree has the same
 * identity a direct render of this URL would have.
 */ function fillInFallbackTransportTree(node, pathnameParts, pathnamePartsIndex) {
    const originalSegment = node.s;
    let newSegment;
    let doesAppearInURL;
    if (typeof originalSegment === 'string') {
        newSegment = originalSegment;
        doesAppearInURL = (0, _routeparams.doesStaticSegmentAppearInURL)(originalSegment);
    } else {
        const paramValue = (0, _routeparams.parseDynamicParamFromURLPart)(originalSegment.t, pathnameParts, pathnamePartsIndex);
        newSegment = {
            n: originalSegment.n,
            t: originalSegment.t,
            k: (0, _routeparams.getCacheKeyForDynamicParam)(paramValue),
            s: originalSegment.s
        };
        doesAppearInURL = true;
    }
    // Only increment the index if the segment appears in the URL. If it's a
    // "virtual" segment, like a route group, it remains the same.
    const childPathnamePartsIndex = doesAppearInURL ? pathnamePartsIndex + 1 : pathnamePartsIndex;
    const children = node.c;
    let newChildren;
    if (children !== undefined) {
        newChildren = new Map();
        for (const [parallelRouteKey, childNode] of children){
            newChildren.set(parallelRouteKey, fillInFallbackTransportTree(childNode, pathnameParts, childPathnamePartsIndex));
        }
    }
    const newNode = {
        s: newSegment,
        d: node.d
    };
    if (node.h !== undefined) {
        newNode.h = node.h;
    }
    if (newChildren !== undefined) {
        newNode.c = newChildren;
    }
    return newNode;
}
function getNextFlightSegmentPath(flightSegmentPath) {
    // Since `FlightSegmentPath` is a repeated tuple of `Segment` and `ParallelRouteKey`, we slice off two items
    // to get the next segment path.
    return flightSegmentPath.slice(2);
}
function prepareFlightRouterStateForRequest(flightRouterState, isHmrRefresh) {
    // HMR requests need the complete, unmodified state for proper functionality
    if (isHmrRefresh) {
        return encodeURIComponent(JSON.stringify(flightRouterState));
    }
    return encodeURIComponent(JSON.stringify(stripClientOnlyDataFromFlightRouterState(flightRouterState)));
}
/**
 * Recursively strips client-only data from FlightRouterState while preserving
 * server-needed information for proper rendering decisions.
 */ function stripClientOnlyDataFromFlightRouterState(flightRouterState) {
    const [segment, parallelRoutes, _refreshState, refreshMarker, prefetchHints] = flightRouterState;
    // Strip client-only data from the segment
    const cleanedSegment = stripClientOnlyDataFromSegment(segment);
    // Recursively process parallel routes
    const cleanedParallelRoutes = {};
    for (const [key, childState] of Object.entries(parallelRoutes)){
        cleanedParallelRoutes[key] = stripClientOnlyDataFromFlightRouterState(childState);
    }
    const result = [
        cleanedSegment,
        cleanedParallelRoutes
    ];
    if (refreshMarker) {
        result[2] = null // null slightly more compact than undefined
        ;
        result[3] = refreshMarker;
    }
    // Append optional fields if present
    if (prefetchHints !== undefined) {
        result[4] = prefetchHints;
    }
    // Leave out the page's search params. They're only used by the client, and
    // request headers may be forwarded through redirects.
    return result;
}
/**
 * Strips client-only data from segments:
 * - staticSiblings from dynamic segment tuples (only needed for client-side
 *   prefetch reuse decisions)
 */ function stripClientOnlyDataFromSegment(segment) {
    if (typeof segment === 'string') {
        return segment;
    }
    // Dynamic segment tuple: [paramName, paramCacheKey, paramType, staticSiblings]
    // Strip staticSiblings (4th element) since server doesn't need it
    const [paramName, paramCacheKey, paramType] = segment;
    return [
        paramName,
        paramCacheKey,
        paramType,
        null
    ];
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=flight-data-helpers.js.map