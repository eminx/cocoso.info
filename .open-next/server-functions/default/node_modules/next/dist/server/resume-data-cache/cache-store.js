"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FALLBACK_PARAMS: null,
    RUNTIME_DATA: null,
    SESSION_DATA: null,
    parseUseCacheCacheStore: null,
    serializeUseCacheCacheStore: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FALLBACK_PARAMS: function() {
        return FALLBACK_PARAMS;
    },
    RUNTIME_DATA: function() {
        return RUNTIME_DATA;
    },
    SESSION_DATA: function() {
        return SESSION_DATA;
    },
    parseUseCacheCacheStore: function() {
        return parseUseCacheCacheStore;
    },
    serializeUseCacheCacheStore: function() {
        return serializeUseCacheCacheStore;
    }
});
const _encryptionutils = require("../app-render/encryption-utils");
const _constants = require("../use-cache/constants");
const FALLBACK_PARAMS = Symbol.for('next.resume-data-cache.fallback-params');
const RUNTIME_DATA = Symbol.for('next.resume-data-cache.runtime-data');
const SESSION_DATA = Symbol.for('next.resume-data-cache.session-data');
function parseUseCacheCacheStore(entries) {
    const store = new Map();
    for (const [key, { entry, hasExplicitRevalidate, hasExplicitExpire, readRootParamNames }] of entries){
        store.set(key, Promise.resolve({
            entry: {
                // Create a ReadableStream from the Uint8Array
                value: new ReadableStream({
                    start (controller) {
                        // Enqueue the Uint8Array to the stream
                        controller.enqueue((0, _encryptionutils.stringToUint8Array)(atob(entry.value)));
                        // Close the stream
                        controller.close();
                    }
                }),
                tags: entry.tags,
                stale: entry.stale,
                timestamp: entry.timestamp,
                expire: entry.expire,
                revalidate: entry.revalidate
            },
            hasExplicitRevalidate,
            hasExplicitExpire,
            readRootParamNames: readRootParamNames ? new Set(readRootParamNames) : undefined,
            // Serialized RDC entries are non-dynamic by construction (the
            // serializer drops dynamic entries), so this is never produced from the
            // wire — the throw path that consumes it is only reachable for dynamic
            // entries, which only exist in the in-memory RDC.
            dynamicNestedCacheError: undefined
        }));
    }
    return store;
}
async function serializeUseCacheCacheStore(entries, isCacheComponentsEnabled) {
    return Promise.all(Array.from(entries).map(([key, value])=>{
        if (value === FALLBACK_PARAMS || value === RUNTIME_DATA || value === SESSION_DATA) {
            return null;
        }
        return value.then(async ({ entry, hasExplicitRevalidate, hasExplicitExpire, readRootParamNames })=>{
            if (isCacheComponentsEnabled && (entry.revalidate === 0 || entry.expire < _constants.MIN_PRERENDERABLE_EXPIRE)) {
                // The entry was omitted from the prerender result, and subsequently
                // does not need to be included in the serialized RDC.
                return null;
            }
            const [left, right] = entry.value.tee();
            entry.value = right;
            let binaryString = '';
            // We want to encode the value as a string, but we aren't sure if the
            // value is a a stream of UTF-8 bytes or not, so let's just encode it
            // as a string using base64.
            for await (const chunk of left){
                binaryString += (0, _encryptionutils.arrayBufferToString)(chunk);
            }
            return [
                key,
                {
                    entry: {
                        // Encode the value as a base64 string.
                        value: btoa(binaryString),
                        tags: entry.tags,
                        stale: entry.stale,
                        timestamp: entry.timestamp,
                        expire: entry.expire,
                        revalidate: entry.revalidate
                    },
                    hasExplicitRevalidate,
                    hasExplicitExpire,
                    readRootParamNames: readRootParamNames ? [
                        ...readRootParamNames
                    ] : undefined
                }
            ];
        }).catch(()=>{
            // Any failed cache writes should be ignored as to not discard the
            // entire cache.
            return null;
        });
    }));
}

//# sourceMappingURL=cache-store.js.map