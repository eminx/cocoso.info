"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    handleClientError: null,
    handleConsoleError: null,
    handleGlobalErrors: null,
    useErrorHandler: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    handleClientError: function() {
        return handleClientError;
    },
    handleConsoleError: function() {
        return handleConsoleError;
    },
    handleGlobalErrors: function() {
        return handleGlobalErrors;
    },
    useErrorHandler: function() {
        return useErrorHandler;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _react = require("react");
const _isnextroutererror = require("../../../../client/components/is-next-router-error");
const _console = require("../../../../client/lib/console");
const _iserror = /*#__PURE__*/ _interop_require_default._(require("../../../../lib/is-error"));
const _consoleerror = require("../../../shared/console-error");
const _stitchederror = require("./stitched-error");
const _forwardlogs = require("../forward-logs");
const queueMicroTask = globalThis.queueMicrotask || ((cb)=>Promise.resolve().then(cb));
const errorQueue = [];
const errorHandlers = [];
const rejectionQueue = [];
const rejectionHandlers = [];
function handleConsoleError(originError, consoleErrorArgs) {
    let error;
    const { environmentName } = (0, _console.parseConsoleArgs)(consoleErrorArgs);
    if ((0, _iserror.default)(originError)) {
        error = (0, _consoleerror.createConsoleError)(originError, environmentName);
    } else {
        error = (0, _consoleerror.createConsoleError)((0, _console.formatConsoleArgs)(consoleErrorArgs), environmentName);
    }
    (0, _stitchederror.setOwnerStackIfAvailable)(error);
    if (process.env.__NEXT_EXPOSE_RUNTIME_ERRORS_TO_HMR) {
        const { dispatcher } = require('next/dist/compiled/next-devtools');
        queueMicroTask(()=>dispatcher.onUnhandledError(error));
    } else {
        errorQueue.push(error);
        for (const handler of errorHandlers){
            // Delayed the error being passed to React Dev Overlay,
            // avoid the state being synchronously updated in the component.
            queueMicroTask(()=>{
                handler(error);
            });
        }
    }
}
function handleClientError(error, metadata = undefined) {
    if (process.env.__NEXT_EXPOSE_RUNTIME_ERRORS_TO_HMR) {
        const { dispatcher } = require('next/dist/compiled/next-devtools');
        const { takeRuntimeErrorMetadata } = require('./runtime-error-metadata');
        const occurrence = metadata ?? takeRuntimeErrorMetadata(error);
        // The overlay queues events until its own root mounts. Do not depend on
        // HotReload committing: an initial application failure can prevent that.
        queueMicroTask(()=>dispatcher.onUnhandledError(error, occurrence));
    } else {
        errorQueue.push(error);
        for (const handler of errorHandlers){
            // Delayed the error being passed to React Dev Overlay,
            // avoid the state being synchronously updated in the component.
            queueMicroTask(()=>{
                handler(error);
            });
        }
    }
}
function useErrorHandler(handleOnUnhandledError, handleOnUnhandledRejection) {
    (0, _react.useEffect)(()=>{
        // Handle queued errors.
        errorQueue.forEach(handleOnUnhandledError);
        rejectionQueue.forEach(handleOnUnhandledRejection);
        // Listen to new errors.
        errorHandlers.push(handleOnUnhandledError);
        rejectionHandlers.push(handleOnUnhandledRejection);
        return ()=>{
            // Remove listeners.
            errorHandlers.splice(errorHandlers.indexOf(handleOnUnhandledError), 1);
            rejectionHandlers.splice(rejectionHandlers.indexOf(handleOnUnhandledRejection), 1);
            // Reset error queues.
            errorQueue.splice(0, errorQueue.length);
            rejectionQueue.splice(0, rejectionQueue.length);
        };
    }, [
        handleOnUnhandledError,
        handleOnUnhandledRejection
    ]);
}
function onUnhandledError(event) {
    const thrownValue = event.error;
    if ((0, _isnextroutererror.isNextRouterError)(thrownValue)) {
        event.preventDefault();
        return false;
    }
    // When there's an error property present, we log the error to error overlay.
    // Otherwise we don't do anything as it's not logging in the console either.
    if (thrownValue) {
        const error = (0, _stitchederror.coerceError)(thrownValue);
        (0, _stitchederror.setOwnerStackIfAvailable)(error);
        if (process.env.__NEXT_EXPOSE_RUNTIME_ERRORS_TO_HMR) {
            const { takeRuntimeErrorMetadata } = require('./runtime-error-metadata');
            const { isRecoverableError } = require('../../../../client/react-client-callbacks/on-recoverable-error');
            handleClientError(error, takeRuntimeErrorMetadata(error) ?? (isRecoverableError(error) ? undefined : {
                fatal: false
            }));
        } else {
            handleClientError(error);
        }
        (0, _forwardlogs.forwardUnhandledError)(error);
    }
}
function onUnhandledRejection(ev) {
    const reason = ev?.reason;
    if ((0, _isnextroutererror.isNextRouterError)(reason)) {
        ev.preventDefault();
        return;
    }
    const error = (0, _stitchederror.coerceError)(reason);
    (0, _stitchederror.setOwnerStackIfAvailable)(error);
    if (process.env.__NEXT_EXPOSE_RUNTIME_ERRORS_TO_HMR) {
        const { dispatcher } = require('next/dist/compiled/next-devtools');
        dispatcher.onUnhandledRejection(error, {
            fatal: false
        });
    } else {
        rejectionQueue.push(error);
        for (const handler of rejectionHandlers){
            handler(error);
        }
    }
    (0, _forwardlogs.logUnhandledRejection)(reason);
}
function handleGlobalErrors() {
    if (typeof window !== 'undefined') {
        try {
            // Increase the number of stack frames on the client
            Error.stackTraceLimit = 50;
        } catch  {}
        window.addEventListener('error', onUnhandledError);
        window.addEventListener('unhandledrejection', onUnhandledRejection);
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=use-error-handler.js.map