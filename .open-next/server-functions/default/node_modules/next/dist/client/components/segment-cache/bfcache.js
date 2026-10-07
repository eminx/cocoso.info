"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    UnknownDynamicStaleTime: null,
    computeDynamicStaleAt: null,
    invalidateBfCache: null,
    readFromBFCache: null,
    readFromBFCacheDuringRegularNavigation: null,
    updateBFCacheEntryFromDynamicResponse: null,
    writeToBFCache: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    UnknownDynamicStaleTime: function() {
        return UnknownDynamicStaleTime;
    },
    computeDynamicStaleAt: function() {
        return computeDynamicStaleAt;
    },
    invalidateBfCache: function() {
        return invalidateBfCache;
    },
    readFromBFCache: function() {
        return readFromBFCache;
    },
    readFromBFCacheDuringRegularNavigation: function() {
        return readFromBFCacheDuringRegularNavigation;
    },
    updateBFCacheEntryFromDynamicResponse: function() {
        return updateBFCacheEntryFromDynamicResponse;
    },
    writeToBFCache: function() {
        return writeToBFCache;
    }
});
const _navigatereducer = require("../router-reducer/reducers/navigate-reducer");
const _cachemap = require("./cache-map");
const UnknownDynamicStaleTime = -1;
function computeDynamicStaleAt(now, dynamicStaleTimeSeconds) {
    return dynamicStaleTimeSeconds !== UnknownDynamicStaleTime ? now + dynamicStaleTimeSeconds * 1000 : now + _navigatereducer.DYNAMIC_STALETIME_MS;
}
const bfcacheMap = (0, _cachemap.createCacheMap)();
let currentBfCacheVersion = 0;
function invalidateBfCache() {
    if (typeof window === 'undefined') {
        return;
    }
    currentBfCacheVersion++;
}
function writeToBFCache(now, varyPath, cacheNode, dynamicStaleAt) {
    if (typeof window === 'undefined') {
        return;
    }
    const entry = {
        rsc: cacheNode.rsc,
        prefetchRsc: cacheNode.prefetchRsc,
        varyParams: cacheNode.varyParams,
        bfcacheId: cacheNode.bfcacheId,
        ref: null,
        // TODO: This is just a heuristic. Getting the actual size of the segment
        // isn't feasible because it's part of a larger streaming response. The
        // LRU will still evict it, we just won't have a fully accurate total
        // LRU size. However, we'll probably remove the size tracking from the LRU
        // entirely and use memory pressure events instead.
        size: 100,
        navigatedAt: now,
        // A back/forward navigation will disregard the stale time. This field is
        // only relevant when staleTimes.dynamic is enabled or unstable_dynamicStaleTime
        // is exported by a page.
        staleAt: dynamicStaleAt,
        version: currentBfCacheVersion,
        status: _cachemap.EntryStatus.Fulfilled
    };
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(bfcacheMap, varyPath, entry, isRevalidation);
}
function updateBFCacheEntryFromDynamicResponse(varyPath, cacheNode, newStaleAt) {
    if (typeof window === 'undefined') {
        return;
    }
    const isRevalidation = false;
    // Read with staleness bypass (-1) so we can update even stale entries
    const entry = (0, _cachemap.getFromCacheMap)(-1, currentBfCacheVersion, bfcacheMap, varyPath, isRevalidation, false);
    if (entry !== null && entry.rsc === cacheNode.rsc) {
        entry.staleAt = newStaleAt;
        entry.varyParams = cacheNode.varyParams;
    }
}
function readFromBFCache(varyPath) {
    if (typeof window === 'undefined') {
        return null;
    }
    const isRevalidation = false;
    return (0, _cachemap.getFromCacheMap)(// During a back/forward navigation, it doesn't matter how stale the data
    // might be. Pass -1 instead of the actual current time to bypass
    // staleness checks.
    -1, currentBfCacheVersion, bfcacheMap, varyPath, isRevalidation, false);
}
function readFromBFCacheDuringRegularNavigation(now, varyPath) {
    if (typeof window === 'undefined') {
        return null;
    }
    const isRevalidation = false;
    return (0, _cachemap.getFromCacheMap)(now, currentBfCacheVersion, bfcacheMap, varyPath, isRevalidation, false);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=bfcache.js.map