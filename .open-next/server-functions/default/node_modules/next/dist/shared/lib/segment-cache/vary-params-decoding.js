/**
 * Vary Params Decoding
 *
 * This module is shared between server and client.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    SEARCH_PARAMS_VARY_ID: null,
    createVaryParams: null,
    decodeVaryParams: null,
    readVaryParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    SEARCH_PARAMS_VARY_ID: function() {
        return SEARCH_PARAMS_VARY_ID;
    },
    createVaryParams: function() {
        return createVaryParams;
    },
    decodeVaryParams: function() {
        return decodeVaryParams;
    },
    readVaryParams: function() {
        return readVaryParams;
    }
});
const _rsctransport = require("../rsc-transport");
const SEARCH_PARAMS_VARY_ID = 0;
/**
 * Synchronously drains a vary params `AsyncIterable`, adding each yielded name
 * to `target`.
 *
 * By the time this runs (on the client, or in collectSegmentData), the Flight
 * stream has been fully buffered, so every yielded value is already
 * materialized and can be read without awaiting: each iterator result is a
 * Flight chunk whose settled state `readFulfilledValue` reads off the
 * thenable's status.
 *
 * We add "every param yielded up to the point the stream suspends": a
 * normally-closed iterable drains fully, while one left hanging (a sync-I/O
 * abort, or a `close()` whose row hasn't flushed yet) drains to the prefix
 * already in the stream. Both are correct — a segment's param accesses are all
 * flushed as they happen during its render, so the prefix is exactly the set
 * the response depends on. We therefore never need the terminating `done` row
 * to be present; it's only stream hygiene.
 */ function drainVaryParams(iterable, target) {
    const iterator = iterable[Symbol.asyncIterator]();
    while(true){
        const step = (0, _rsctransport.readFulfilledValue)(iterator.next(), undefined);
        if (step === undefined || step.done) {
            // Either the stream suspended here — everything yielded before this
            // point has already been added — or the iterable finished cleanly.
            return;
        }
        target.add(step.value);
    }
}
function decodeVaryParams(iterable, rootIterable) {
    if (iterable === null || iterable === undefined || rootIterable === null || rootIterable === undefined) {
        return null;
    }
    const total = new Set();
    drainVaryParams(iterable, total);
    drainVaryParams(rootIterable, total);
    return createVaryParams(total);
}
function createVaryParams(total) {
    // TODO: Don't need to use a native promise. Just inline a thenable that
    // immediately calls its listener.
    const settled = Promise.resolve(total);
    settled.status = 'fulfilled';
    settled.value = total;
    return settled;
}
function readVaryParams(varyParams) {
    return (0, _rsctransport.readFulfilledValue)(varyParams, null);
}

//# sourceMappingURL=vary-params-decoding.js.map