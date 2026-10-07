"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createDebugChannel: null,
    getOrCreateDebugChannelReadableWriterPair: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createDebugChannel: function() {
        return createDebugChannel;
    },
    getOrCreateDebugChannelReadableWriterPair: function() {
        return getOrCreateDebugChannelReadableWriterPair;
    }
});
const _approuterheaders = require("../components/app-router-headers");
const _invarianterror = require("../../shared/lib/invariant-error");
const pairs = new Map();
/**
 * Upper bound on the number of in-memory debug-channel pairs we retain, evicted
 * least-recently-used, bounding the live per-request map.
 *
 * A pair must outlive its stream's close so a late decode of the same response
 * (the primary decode plus stage extractions via `decodeStageUntilBoundary`,
 * which can run after the channel closed over the WebSocket) still finds the
 * buffered data. The cap only needs to exceed the pairs live or recently closed
 * at once (bounded by how many prefetch/navigation requests are in flight
 * together), so a few dozen leaves ample headroom even for the segment-heavy
 * bursts the Instant Navs DevTools capture can produce.
 */ const MAX_DEBUG_CHANNEL_PAIRS = 64;
/**
 * Reclaim the least-recently-used debug-channel pairs once the map exceeds
 * `MAX_DEBUG_CHANNEL_PAIRS`. The map is iterated in insertion order and we
 * re-insert entries on access (see
 * `getOrCreateDebugChannelReadableWriterPair`), so the least-recently-used
 * pairs sit at the front. Evicting only ever affects future lookups for that
 * request id; consumers that already hold a tee branch keep reading
 * independently of the map.
 */ function evictExcessDebugChannelPairs() {
    while(pairs.size > MAX_DEBUG_CHANNEL_PAIRS){
        const oldestRequestId = pairs.keys().next().value;
        if (oldestRequestId === undefined) {
            break;
        }
        pairs.delete(oldestRequestId);
    }
}
function getOrCreateDebugChannelReadableWriterPair(requestId) {
    const existingPair = pairs.get(requestId);
    if (existingPair) {
        // Refresh the LRU recency of an already-known channel by re-inserting it at
        // the most-recent position, so a channel that's still being written to or
        // read from isn't evicted while a late consumer (e.g. a stage re-decode of
        // the same response) still needs it.
        pairs.delete(requestId);
        pairs.set(requestId, existingPair);
        return existingPair;
    }
    const { readable, writable } = new TransformStream();
    const pair = {
        readable,
        writer: writable.getWriter()
    };
    pairs.set(requestId, pair);
    // Retain the pair past its stream's close (see MAX_DEBUG_CHANNEL_PAIRS) and
    // bound the map by reclaiming the least-recently-used.
    evictExcessDebugChannelPairs();
    // An errored stream rejects `writer.closed`. Observe the rejection so that it
    // does not surface as an unhandled rejection.
    pair.writer.closed.catch((error)=>{
        console.debug('Debug channel writer closed with error', error);
    });
    return pair;
}
function createDebugChannel(requestHeaders) {
    let requestId;
    if (requestHeaders) {
        requestId = requestHeaders[_approuterheaders.NEXT_REQUEST_ID_HEADER] ?? undefined;
        if (!requestId) {
            throw new _invarianterror.InvariantError(`Expected a ${JSON.stringify(_approuterheaders.NEXT_REQUEST_ID_HEADER)} request header.`);
        }
    } else {
        requestId = self.__next_r;
        if (!requestId) {
            throw new _invarianterror.InvariantError(`Expected a request ID to be defined for the document via self.__next_r.`);
        }
    }
    const pair = getOrCreateDebugChannelReadableWriterPair(requestId);
    // Hand out a fresh tee branch per consumer and keep the remainder for the
    // next one (see the `readable` field doc above).
    const [branch, rest] = pair.readable.tee();
    pair.readable = rest;
    return {
        readable: branch
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=debug-channel.js.map