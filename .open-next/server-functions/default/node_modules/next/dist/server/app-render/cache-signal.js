/**
 * This class is used to detect when all cache reads for a given render are settled.
 * We do this to allow for cache warming the prerender without having to continue rendering
 * the remainder of the page. This feature is really only useful when the cacheComponents flag is on
 * and should only be used in codepaths gated with this feature.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CacheSignal", {
    enumerable: true,
    get: function() {
        return CacheSignal;
    }
});
const _invarianterror = require("../../shared/lib/invariant-error");
class CacheSignal {
    constructor(immediateTracker){
        this.immediateTracker = immediateTracker;
        this.count = 0;
        this.earlyListeners = [];
        this.listeners = [];
        this.tickPending = false;
        this.pendingTimeoutCleanup = null;
        this.subscribedSignals = null;
        this.invokeListenersIfNoPendingReads = ()=>{
            this.pendingTimeoutCleanup = null;
            if (this.count === 0) {
                for(let i = 0; i < this.listeners.length; i++){
                    this.listeners[i]();
                }
                this.listeners.length = 0;
            }
        };
        if (process.env.NEXT_RUNTIME === 'edge') {
            // we rely on `process.nextTick`, which is not supported in edge
            throw new _invarianterror.InvariantError('CacheSignal cannot be used in the edge runtime, because `cacheComponents` does not support it.');
        }
    }
    noMorePendingCaches() {
        if (!this.tickPending) {
            this.tickPending = true;
            queueMicrotask(()=>process.nextTick(()=>{
                    this.tickPending = false;
                    if (this.count === 0) {
                        for(let i = 0; i < this.earlyListeners.length; i++){
                            this.earlyListeners[i]();
                        }
                        this.earlyListeners.length = 0;
                    }
                }));
        }
        // Wait for rendering work that can start more cache reads. After a cache
        // read finishes, React can schedule more Flight rendering:
        // - The prerender API uses microtasks.
        // - Streaming render APIs can use setImmediate callbacks.
        //
        // React can render outlined elements across multiple immediates. Those
        // elements can start further cache reads.
        //
        // We give that work time to run before checking the count:
        // - With a tracker, we wait for the render's pending native immediates.
        // - Without one, an immediate gives native callbacks a chance to run.
        //
        // The timer checks the count after microtasks, nextTicks, and fast
        // immediates finish. If the tracker sees new native immediates before the
        // timer runs, we wait for those too and check again.
        if (this.pendingTimeoutCleanup) {
            // Multiple cacheReady() calls can get here without an intervening
            // beginRead(). We cancel the earlier check before scheduling another one.
            this.pendingTimeoutCleanup();
        }
        this.pendingTimeoutCleanup = scheduleImmediateAndTimeoutWithCleanup(this.invokeListenersIfNoPendingReads, this.immediateTracker);
    }
    /**
   * This promise waits until there are no more in progress cache reads but no later.
   * This allows for adding more cache reads after to delay cacheReady.
   */ inputReady() {
        return new Promise((resolve)=>{
            this.earlyListeners.push(resolve);
            if (this.count === 0) {
                this.noMorePendingCaches();
            }
        });
    }
    /**
   * If there are inflight cache reads this Promise can resolve in a microtask however
   * if there are no inflight cache reads then we wait at least one task to allow initial
   * cache reads to be initiated.
   */ cacheReady() {
        return new Promise((resolve)=>{
            this.listeners.push(resolve);
            if (this.count === 0) {
                this.noMorePendingCaches();
            }
        });
    }
    beginRead() {
        this.count++;
        // There's a new pending cache, so if there's a `noMorePendingCaches` timeout running,
        // we should cancel it.
        if (this.pendingTimeoutCleanup) {
            this.pendingTimeoutCleanup();
            this.pendingTimeoutCleanup = null;
        }
        if (this.subscribedSignals !== null) {
            for (const subscriber of this.subscribedSignals){
                subscriber.beginRead();
            }
        }
    }
    endRead() {
        if (this.count === 0) {
            throw new _invarianterror.InvariantError('CacheSignal got more endRead() calls than beginRead() calls');
        }
        // If this is the last read we need to wait a task before we can claim the cache is settled.
        // The cache read will likely ping a Server Component which can read from the cache again and this
        // will play out in a microtask so we need to only resolve pending listeners if we're still at 0
        // after at least one task.
        // We only want one task scheduled at a time so when we hit count 1 we don't decrement the counter immediately.
        // If intervening reads happen before the scheduled task runs they will never observe count 1 preventing reentrency
        this.count--;
        if (this.count === 0) {
            this.noMorePendingCaches();
        }
        if (this.subscribedSignals !== null) {
            for (const subscriber of this.subscribedSignals){
                subscriber.endRead();
            }
        }
    }
    hasPendingReads() {
        return this.count > 0;
    }
    trackRead(promise) {
        this.beginRead();
        // `promise.finally()` still rejects, so don't use it here to avoid unhandled rejections
        const onFinally = this.endRead.bind(this);
        promise.then(onFinally, onFinally);
        return promise;
    }
    subscribeToReads(subscriber) {
        if (subscriber === this) {
            throw new _invarianterror.InvariantError('A CacheSignal cannot subscribe to itself');
        }
        if (this.subscribedSignals === null) {
            this.subscribedSignals = new Set();
        }
        this.subscribedSignals.add(subscriber);
        // we'll notify the subscriber of each endRead() on this signal,
        // so we need to give it a corresponding beginRead() for each read we have in flight now.
        for(let i = 0; i < this.count; i++){
            subscriber.beginRead();
        }
        return this.unsubscribeFromReads.bind(this, subscriber);
    }
    unsubscribeFromReads(subscriber) {
        if (!this.subscribedSignals) {
            return;
        }
        this.subscribedSignals.delete(subscriber);
    // we don't need to set the set back to `null` if it's empty --
    // if other signals are subscribing to this one, it'll likely get more subscriptions later,
    // so we'd have to allocate a fresh set again when that happens.
    }
}
function scheduleImmediateAndTimeoutWithCleanup(callback, immediateTracker) {
    let cancelled = false;
    let unsubscribe = null;
    let immediate = null;
    let timeout = null;
    function scheduleTimeout() {
        unsubscribe = null;
        if (!cancelled) {
            timeout = setTimeout(()=>{
                timeout = null;
                // Repeat the wait only if the tracker reports pending native
                // immediates. The initial immediate wait has already completed.
                if (immediateTracker == null ? void 0 : immediateTracker.hasPendingImmediates()) {
                    unsubscribe = immediateTracker.onIdle(scheduleTimeout);
                } else {
                    callback();
                }
            }, 0);
        }
    }
    // Always wait for an immediate before the first readiness timer, even if no
    // native work is tracked yet. The render can start in a timer scheduled after
    // this call.
    if (immediateTracker === null) {
        immediate = setImmediate(scheduleTimeout);
    } else {
        unsubscribe = immediateTracker.onIdle(scheduleTimeout);
    }
    return ()=>{
        cancelled = true;
        unsubscribe == null ? void 0 : unsubscribe();
        if (immediate !== null) {
            clearImmediate(immediate);
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
    };
}

//# sourceMappingURL=cache-signal.js.map