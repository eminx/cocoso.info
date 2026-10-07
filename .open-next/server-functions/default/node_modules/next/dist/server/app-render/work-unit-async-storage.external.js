"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getCacheSignal: null,
    getDraftModeProviderForCacheScope: null,
    getHmrRefreshHash: null,
    getResumeDataCache: null,
    getServerComponentsHmrCache: null,
    getStagedRenderingController: null,
    getVaryParamsAccumulator: null,
    isHmrRefresh: null,
    throwForMissingRequestStore: null,
    throwInvariantForMissingStore: null,
    willConsumerServerCache: null,
    workUnitAsyncStorage: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getCacheSignal: function() {
        return getCacheSignal;
    },
    getDraftModeProviderForCacheScope: function() {
        return getDraftModeProviderForCacheScope;
    },
    getHmrRefreshHash: function() {
        return getHmrRefreshHash;
    },
    getResumeDataCache: function() {
        return getResumeDataCache;
    },
    getServerComponentsHmrCache: function() {
        return getServerComponentsHmrCache;
    },
    getStagedRenderingController: function() {
        return getStagedRenderingController;
    },
    getVaryParamsAccumulator: function() {
        return getVaryParamsAccumulator;
    },
    isHmrRefresh: function() {
        return isHmrRefresh;
    },
    throwForMissingRequestStore: function() {
        return throwForMissingRequestStore;
    },
    throwInvariantForMissingStore: function() {
        return throwInvariantForMissingStore;
    },
    willConsumerServerCache: function() {
        return willConsumerServerCache;
    },
    workUnitAsyncStorage: function() {
        return _workunitasyncstorageinstance.workUnitAsyncStorageInstance;
    }
});
const _workunitasyncstorageinstance = require("./work-unit-async-storage-instance");
const _invarianterror = require("../../shared/lib/invariant-error");
function willConsumerServerCache(workUnitStore) {
    if (!workUnitStore) {
        return false;
    }
    switch(workUnitStore.type){
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
            return workUnitStore.consumerWillServerCache;
        case 'prerender':
        case 'prerender-client':
        case 'prerender-legacy':
            return true;
        case 'request':
        case 'prerender-runtime':
        case 'validation-client':
        case 'build-time-generator':
            return false;
        default:
            return workUnitStore;
    }
}
function throwForMissingRequestStore(callingExpression) {
    throw new Error(`\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`);
}
function throwInvariantForMissingStore() {
    throw new _invarianterror.InvariantError('Expected workUnitAsyncStorage to have a store.');
}
function getResumeDataCache(workUnitStore) {
    switch(workUnitStore.type){
        case 'request':
        case 'prerender':
        case 'prerender-runtime':
        case 'prerender-client':
        case 'validation-client':
            return workUnitStore.resumeDataCache;
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'prerender-legacy':
        case 'build-time-generator':
            return null;
        default:
            return workUnitStore;
    }
}
function getHmrRefreshHash(workUnitStore) {
    if (process.env.__NEXT_DEV_SERVER) {
        switch(workUnitStore.type){
            case 'cache':
            case 'private-cache':
            case 'prerender':
            case 'prerender-runtime':
            case 'request':
                return workUnitStore.hmrRefreshHash;
            case 'prerender-client':
            case 'validation-client':
            case 'prerender-legacy':
            case 'unstable-cache':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    return undefined;
}
function isHmrRefresh(workUnitStore) {
    if (process.env.__NEXT_DEV_SERVER) {
        switch(workUnitStore.type){
            case 'cache':
            case 'private-cache':
            case 'request':
                return workUnitStore.isHmrRefresh ?? false;
            case 'prerender':
            case 'prerender-client':
            case 'validation-client':
            case 'prerender-runtime':
            case 'prerender-legacy':
            case 'unstable-cache':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    return false;
}
function getServerComponentsHmrCache(workUnitStore) {
    if (process.env.__NEXT_DEV_SERVER) {
        switch(workUnitStore.type){
            case 'cache':
            case 'private-cache':
            case 'request':
                return workUnitStore.serverComponentsHmrCache;
            case 'prerender':
            case 'prerender-client':
            case 'validation-client':
            case 'prerender-runtime':
            case 'prerender-legacy':
            case 'unstable-cache':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    return undefined;
}
function getDraftModeProviderForCacheScope(workStore, workUnitStore) {
    if (workStore.isDraftMode) {
        switch(workUnitStore.type){
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
            case 'prerender-runtime':
            case 'request':
                return workUnitStore.draftMode;
            case 'prerender':
            case 'prerender-client':
            case 'validation-client':
            case 'prerender-legacy':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    return undefined;
}
function getStagedRenderingController(workUnitStore) {
    switch(workUnitStore.type){
        case 'request':
        case 'prerender-runtime':
        case 'prerender':
            return workUnitStore.stagedRendering ?? null;
        case 'prerender-client':
        case 'validation-client':
        case 'prerender-legacy':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'build-time-generator':
            return null;
        default:
            return workUnitStore;
    }
}
function getCacheSignal(workUnitStore) {
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-client':
        case 'validation-client':
        case 'prerender-runtime':
            return workUnitStore.cacheSignal;
        case 'request':
            {
                // In dev, we might fill caches even during a dynamic request.
                if (workUnitStore.cacheSignal) {
                    return workUnitStore.cacheSignal;
                }
            // fallthrough
            }
        case 'prerender-legacy':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'build-time-generator':
            return null;
        default:
            return workUnitStore;
    }
}
function getVaryParamsAccumulator(workUnitStore) {
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-runtime':
        case 'request':
            {
                return workUnitStore.varyParamsAccumulator ?? null;
            }
        case 'prerender-legacy':
        case 'cache':
        case 'private-cache':
        case 'prerender-client':
        case 'validation-client':
        case 'unstable-cache':
        case 'build-time-generator':
            return null;
        default:
            workUnitStore;
            return null;
    }
}

//# sourceMappingURL=work-unit-async-storage.external.js.map