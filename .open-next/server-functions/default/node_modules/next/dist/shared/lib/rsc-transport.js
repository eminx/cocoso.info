"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createSkippedSegmentData: null,
    readFulfilledValue: null,
    segmentToTransportSegment: null,
    transportNodeToFlightRouterState: null,
    transportSegmentToSegment: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createSkippedSegmentData: function() {
        return createSkippedSegmentData;
    },
    readFulfilledValue: function() {
        return readFulfilledValue;
    },
    segmentToTransportSegment: function() {
        return segmentToTransportSegment;
    },
    transportNodeToFlightRouterState: function() {
        return transportNodeToFlightRouterState;
    },
    transportSegmentToSegment: function() {
        return transportSegmentToSegment;
    }
});
const _segment = require("./segment");
function createSkippedSegmentData() {
    return {
        r: null,
        p: true,
        v: null
    };
}
function readFulfilledValue(valueFromServer, unresolvedValue, rejectedValue = unresolvedValue) {
    const thenable = valueFromServer;
    // Force Flight to unwrap a received-but-not-yet-settled row.
    thenable.then(noop, noop);
    switch(thenable.status){
        case 'fulfilled':
            return thenable.value;
        case 'rejected':
            return rejectedValue;
        // No status yet: the row is still pending, or absent from this decode.
        case undefined:
        default:
            return unresolvedValue;
    }
}
const noop = ()=>{};
function segmentToTransportSegment(segment) {
    if (typeof segment === 'string') {
        return segment;
    }
    return {
        n: segment[0],
        t: segment[2],
        k: segment[1],
        s: segment[3]
    };
}
function transportSegmentToSegment(transportSegment) {
    if (typeof transportSegment === 'string') {
        return transportSegment;
    }
    return [
        transportSegment.n,
        // `k` may be null when the client is expected to parse the param value
        // from the URL (per-segment prefetch responses). Callers that need the
        // real value resolve it from the rendered pathname instead of using this
        // function (see resolveTransportSegment in decode-server-response); the
        // remaining callers are value-insensitive (segment request keys, which
        // never include param values) or only see concrete keys.
        transportSegment.k ?? '',
        transportSegment.t,
        transportSegment.s
    ];
}
function transportNodeToFlightRouterState(node, renderedSearch) {
    const parallelRoutes = {};
    const children = node.c;
    if (children !== undefined) {
        for (const [parallelRouteKey, childNode] of children){
            parallelRoutes[parallelRouteKey] = transportNodeToFlightRouterState(childNode, renderedSearch);
        }
    }
    const flightRouterState = [
        transportSegmentToSegment(node.s),
        parallelRoutes
    ];
    if (node.h !== undefined) {
        flightRouterState[4] = node.h;
    }
    if (flightRouterState[0] === _segment.PAGE_SEGMENT_KEY) {
        flightRouterState[5] = renderedSearch;
    }
    return flightRouterState;
}

//# sourceMappingURL=rsc-transport.js.map