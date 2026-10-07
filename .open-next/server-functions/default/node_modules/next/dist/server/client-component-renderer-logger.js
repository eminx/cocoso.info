"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ClientComponentLoadTracker: null,
    getClientComponentLoaderMetrics: null,
    wrapClientComponentLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ClientComponentLoadTracker: function() {
        return ClientComponentLoadTracker;
    },
    getClientComponentLoaderMetrics: function() {
        return getClientComponentLoaderMetrics;
    },
    wrapClientComponentLoader: function() {
        return wrapClientComponentLoader;
    }
});
const _workasyncstorageexternal = require("./app-render/work-async-storage.external");
class ClientComponentLoadTracker {
    constructor(report = ()=>{}){
        this.report = report;
        this.clientComponentLoadStart = 0;
        this.clientComponentLoadEnd = 0;
        this.clientComponentLoadTimes = 0;
        this.clientComponentLoadCount = 0;
        this.hasLoads = false;
        this.pending = 0;
        this.sealed = false;
        this.resolveCompletion = undefined;
    }
    isSealed() {
        return this.sealed;
    }
    beginRequire(startTime) {
        this.recordStart(startTime);
        this.clientComponentLoadCount++;
        this.pending++;
    }
    finishRequire(startTime, endTime) {
        this.recordSettlement(startTime, endTime);
    }
    beginChunk(startTime) {
        this.recordStart(startTime);
        this.pending++;
    }
    finishChunk(startTime, endTime) {
        this.recordSettlement(startTime, endTime);
    }
    snapshot() {
        if (!this.hasLoads) {
            return undefined;
        }
        return {
            clientComponentLoadStart: this.clientComponentLoadStart,
            clientComponentLoadEnd: this.clientComponentLoadEnd,
            clientComponentLoadTimes: this.clientComponentLoadTimes,
            clientComponentLoadCount: this.clientComponentLoadCount
        };
    }
    /** Stop accepting new loads and report after any in-flight loads settle. */ finish() {
        if (this.sealed) return;
        this.sealed = true;
        let completion;
        if (this.pending === 0) {
            completion = Promise.resolve(this.snapshot());
        } else {
            completion = new Promise((resolve)=>{
                this.resolveCompletion = resolve;
            });
        }
        // Telemetry is best-effort and must not keep the response open or mask a
        // render error, including when reporting fails.
        void completion.then(this.report).catch((error)=>{
            console.error('Failed to report client component loading metrics:', error);
        });
    }
    recordStart(startTime) {
        if (!this.hasLoads) {
            this.hasLoads = true;
            this.clientComponentLoadStart = startTime;
        }
    }
    recordSettlement(startTime, endTime) {
        this.clientComponentLoadEnd = endTime;
        this.clientComponentLoadTimes += endTime - startTime;
        this.pending--;
        if (this.sealed && this.pending === 0 && this.resolveCompletion) {
            const resolve = this.resolveCompletion;
            this.resolveCompletion = undefined;
            resolve(this.snapshot());
        }
    }
}
function wrapClientComponentLoader(ComponentMod) {
    if (!('performance' in globalThis)) {
        return ComponentMod.__next_app__;
    }
    return {
        require: (...args)=>{
            var _workAsyncStorage_getStore;
            const tracker = (_workAsyncStorage_getStore = _workasyncstorageexternal.workAsyncStorage.getStore()) == null ? void 0 : _workAsyncStorage_getStore.clientComponentLoadTracker;
            if (tracker === undefined || tracker.isSealed()) {
                return ComponentMod.__next_app__.require(...args);
            }
            const startTime = performance.now();
            tracker.beginRequire(startTime);
            let result;
            try {
                result = ComponentMod.__next_app__.require(...args);
            } catch (error) {
                tracker.finishRequire(startTime, performance.now());
                throw error;
            }
            // Webpack and Turbopack return native Promises for async modules. A
            // synchronous module may export `then`, so do not probe arbitrary exports.
            if (result instanceof Promise) {
                const onSettled = ()=>{
                    tracker.finishRequire(startTime, performance.now());
                };
                result.then(onSettled, onSettled);
            } else {
                tracker.finishRequire(startTime, performance.now());
            }
            return result;
        },
        loadChunk: (...args)=>{
            var _workAsyncStorage_getStore;
            const tracker = (_workAsyncStorage_getStore = _workasyncstorageexternal.workAsyncStorage.getStore()) == null ? void 0 : _workAsyncStorage_getStore.clientComponentLoadTracker;
            if (tracker === undefined || tracker.isSealed()) {
                return ComponentMod.__next_app__.loadChunk(...args);
            }
            const startTime = performance.now();
            tracker.beginChunk(startTime);
            let result;
            try {
                result = ComponentMod.__next_app__.loadChunk(...args);
            } catch (error) {
                tracker.finishChunk(startTime, performance.now());
                throw error;
            }
            // React can depend on the original promise identity.
            const onSettled = ()=>{
                tracker.finishChunk(startTime, performance.now());
            };
            result.then(onSettled, onSettled);
            return result;
        }
    };
}
function getClientComponentLoaderMetrics(options = {}) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const tracker = workStore == null ? void 0 : workStore.clientComponentLoadTracker;
    const metrics = tracker == null ? void 0 : tracker.snapshot();
    if (options.reset && workStore) {
        // Pending settlements still hold their original tracker. Detaching it only
        // affects subsequent reads and loads in this render.
        workStore.clientComponentLoadTracker = undefined;
    }
    return metrics;
}

//# sourceMappingURL=client-component-renderer-logger.js.map