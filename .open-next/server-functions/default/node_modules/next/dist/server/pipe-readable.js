"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isAbortError: null,
    pipeNodeReadableToNodeResponse: null,
    pipeToNodeResponse: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isAbortError: function() {
        return isAbortError;
    },
    pipeNodeReadableToNodeResponse: function() {
        return pipeNodeReadableToNodeResponse;
    },
    pipeToNodeResponse: function() {
        return pipeToNodeResponse;
    }
});
const _nextrequest = require("./web/spec-extension/adapters/next-request");
const _promisewithresolvers = require("../shared/lib/promise-with-resolvers");
const _tracer = require("./lib/trace/tracer");
const _constants = require("./lib/trace/constants");
function isAbortError(e) {
    return (e == null ? void 0 : e.name) === 'AbortError' || (e == null ? void 0 : e.name) === _nextrequest.ResponseAbortedName;
}
const HAS_CLIENT_COMPONENT_METRICS_ENABLED = 'performance' in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
function createWriterFromResponse(res, waitUntilForEnd, clientComponentLoadTracker) {
    let started = false;
    // Create a promise that will resolve once the response has drained. See
    // https://nodejs.org/api/stream.html#stream_event_drain
    let drained = (0, _promisewithresolvers.createPromiseWithResolvers)();
    function onDrain() {
        drained.resolve();
    }
    res.on('drain', onDrain);
    // If the finish event fires, it means we shouldn't block and wait for the
    // drain event.
    res.once('close', ()=>{
        res.off('drain', onDrain);
        drained.resolve();
    });
    // Create a promise that will resolve once the response has finished. See
    // https://nodejs.org/api/http.html#event-finish_1
    const finished = (0, _promisewithresolvers.createPromiseWithResolvers)();
    res.once('finish', ()=>{
        finished.resolve();
    });
    // Create a writable stream that will write to the response.
    return new WritableStream({
        write: async (chunk)=>{
            // You'd think we'd want to use `start` instead of placing this in `write`
            // but this ensures that we don't actually flush the headers until we've
            // started writing chunks.
            if (!started) {
                started = true;
                if (HAS_CLIENT_COMPONENT_METRICS_ENABLED) {
                    const metrics = clientComponentLoadTracker == null ? void 0 : clientComponentLoadTracker.snapshot();
                    if (metrics) {
                        performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, {
                            start: metrics.clientComponentLoadStart,
                            end: metrics.clientComponentLoadStart + metrics.clientComponentLoadTimes
                        });
                    }
                }
                res.flushHeaders();
                (0, _tracer.getTracer)().trace(_constants.NextNodeServerSpan.startResponse, {
                    spanName: 'start response'
                }, ()=>undefined);
            }
            try {
                const ok = res.write(chunk);
                // Added by the `compression` middleware, this is a function that will
                // flush the partially-compressed response to the client.
                if ('flush' in res && typeof res.flush === 'function') {
                    res.flush();
                }
                // If the write returns false, it means there's some backpressure, so
                // wait until it's streamed before continuing.
                if (!ok) {
                    await drained.promise;
                    // Reset the drained promise so that we can wait for the next drain event.
                    drained = (0, _promisewithresolvers.createPromiseWithResolvers)();
                }
            } catch (err) {
                res.end();
                throw new Error('failed to write chunk to response', {
                    cause: err
                });
            }
        },
        abort: (err)=>{
            if (res.writableFinished) return;
            res.destroy(err);
        },
        close: async ()=>{
            // if a waitUntil promise was passed, wait for it to resolve before
            // ending the response.
            if (waitUntilForEnd) {
                await waitUntilForEnd;
            }
            if (res.writableFinished) return;
            res.end();
            return finished.promise;
        }
    });
}
async function pipeToNodeResponse(readable, res, waitUntilForEnd, clientComponentLoadTracker) {
    try {
        // If the response has already errored, then just return now.
        const { errored, destroyed } = res;
        if (errored || destroyed) return;
        // Create a new AbortController so that we can abort the readable if the
        // client disconnects.
        const controller = (0, _nextrequest.createAbortController)(res);
        const writer = createWriterFromResponse(res, waitUntilForEnd, clientComponentLoadTracker);
        await readable.pipeTo(writer, {
            signal: controller.signal
        });
    } catch (err) {
        // If this isn't related to an abort error, re-throw it.
        if (isAbortError(err)) return;
        throw new Error('failed to pipe response', {
            cause: err
        });
    }
}
async function pipeNodeReadableToNodeResponse(readable, res, waitUntilForEnd, clientComponentLoadTracker) {
    try {
        const { errored, destroyed } = res;
        if (errored || destroyed) return;
        let started = false;
        const finished = (0, _promisewithresolvers.createPromiseWithResolvers)();
        // One `drain` listener for the whole response, as in
        // `createWriterFromResponse` above. It must not be `res.once('drain')` per
        // backpressured write: the `compression` middleware forwards `res.on` to
        // its zlib stream but leaves `removeListener` pointing at the response, so
        // a `once` listener is never removed from the stream it was added to. Each
        // backpressured write would leak one, and past ten Node reports the stream
        // as a probable leak via `MaxListenersExceededWarning`.
        //
        // TODO: the upstream fix for that asymmetry is
        // https://github.com/expressjs/compression/pull/153, which intercepts
        // `removeListener` so it reaches the zlib stream. It has been open since
        // 2019 and is not in upstream 1.8.1; we vendor 1.7.4. If it ever lands and
        // we upgrade, `res.off('drain', onDrain)` below would start working with
        // compression active and the caveat on the `close` handler could go away.
        let paused = false;
        const onDrain = ()=>{
            // The listener outlives the readable: `off` below cannot reach the zlib
            // stream either, so a late drain can arrive after teardown.
            if (!paused || readable.destroyed) return;
            paused = false;
            readable.resume();
        };
        res.on('drain', onDrain);
        res.once('close', ()=>{
            // Only removes the listener when compression is inactive, which is the
            // case where it was added to the response itself. Otherwise it lives on
            // the zlib stream, which is released with the response.
            res.off('drain', onDrain);
            readable.destroy();
            finished.resolve();
        });
        readable.on('data', (chunk)=>{
            if (!started) {
                started = true;
                if ('performance' in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                    const metrics = clientComponentLoadTracker == null ? void 0 : clientComponentLoadTracker.snapshot();
                    if (metrics) {
                        performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, {
                            start: metrics.clientComponentLoadStart,
                            end: metrics.clientComponentLoadStart + metrics.clientComponentLoadTimes
                        });
                    }
                }
                res.flushHeaders();
                (0, _tracer.getTracer)().trace(_constants.NextNodeServerSpan.startResponse, {
                    spanName: 'start response'
                }, ()=>undefined);
            }
            const ok = res.write(chunk);
            if ('flush' in res && typeof res.flush === 'function') {
                res.flush();
            }
            if (!ok) {
                paused = true;
                readable.pause();
            }
        });
        readable.on('end', async ()=>{
            if (waitUntilForEnd) {
                await waitUntilForEnd;
            }
            if (!res.writableFinished) {
                res.end();
            }
            finished.resolve();
        });
        readable.on('error', (err)=>{
            if (isAbortError(err)) {
                finished.resolve();
                return;
            }
            res.destroy(err);
            finished.resolve();
        });
        await finished.promise;
    } catch (err) {
        if (isAbortError(err)) return;
        throw new Error('failed to pipe response', {
            cause: err
        });
    }
}

//# sourceMappingURL=pipe-readable.js.map