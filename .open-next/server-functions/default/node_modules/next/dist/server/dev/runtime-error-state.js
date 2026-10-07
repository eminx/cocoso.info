"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createRuntimeErrorStateHandler: null,
    formatRuntimeErrors: null,
    isRuntimeErrorStateUpdate: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createRuntimeErrorStateHandler: function() {
        return createRuntimeErrorStateHandler;
    },
    formatRuntimeErrors: function() {
        return formatRuntimeErrors;
    },
    isRuntimeErrorStateUpdate: function() {
        return isRuntimeErrorStateUpdate;
    }
});
const _crypto = require("crypto");
const _hotreloadertypes = require("./hot-reloader-types");
const _formaterrors = require("../mcp/tools/utils/format-errors");
const formatStackFrameToObject = (frame)=>{
    return {
        file: frame.file || '<unknown>',
        methodName: frame.methodName || '<anonymous>',
        line: frame.line1,
        column: frame.column1
    };
};
const resolveErrorFrames = async (frames, context)=>{
    try {
        const resolvedFrames = await (0, _formaterrors.resolveStackFrames)({
            frames: frames.map((frame)=>({
                    file: frame.file || null,
                    methodName: frame.methodName || '<anonymous>',
                    arguments: [],
                    line1: frame.line1 || null,
                    column1: frame.column1 || null
                })),
            isServer: context.isServer,
            isEdgeServer: context.isEdgeServer,
            isAppDirectory: context.isAppDirectory
        });
        return resolvedFrames.flatMap((resolvedFrame, index)=>{
            var _resolvedFrame_value_originalStackFrame;
            if (resolvedFrame.status === 'fulfilled' && ((_resolvedFrame_value_originalStackFrame = resolvedFrame.value.originalStackFrame) == null ? void 0 : _resolvedFrame_value_originalStackFrame.ignored)) {
                return [];
            }
            return [
                resolvedFrame.status === 'fulfilled' && resolvedFrame.value.originalStackFrame ? formatStackFrameToObject(resolvedFrame.value.originalStackFrame) : formatStackFrameToObject(frames[index])
            ];
        });
    } catch  {
        return frames.map(formatStackFrameToObject);
    }
};
async function formatRuntimeErrors(errors, isAppDirectory) {
    const formattedErrors = [];
    for (const error of errors){
        var _error_error, _error_error1, _error_frames;
        const errorName = ((_error_error = error.error) == null ? void 0 : _error_error.name) || 'Error';
        const message = ((_error_error1 = error.error) == null ? void 0 : _error_error1.message) || 'Unknown error';
        let stack = [];
        if ((_error_frames = error.frames) == null ? void 0 : _error_frames.length) {
            var _error_error2;
            const errorSource = (_error_error2 = error.error) == null ? void 0 : _error_error2.source;
            stack = await resolveErrorFrames(error.frames, {
                isServer: errorSource === 'server',
                isEdgeServer: errorSource === 'edge-server',
                isAppDirectory
            });
        }
        formattedErrors.push({
            type: error.type,
            errorName,
            message,
            fatal: error.fatal,
            ...error.boundary ? {
                boundary: error.boundary
            } : {},
            stack
        });
    }
    return formattedErrors;
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
function isNullableString(value) {
    return value === null || typeof value === 'string';
}
function isNullableNumber(value) {
    return value === null || typeof value === 'number' && Number.isFinite(value);
}
function isRuntimeErrorStateError(value) {
    if (!isRecord(value) || typeof value.id !== 'number' || !Number.isFinite(value.id) || value.type !== 'runtime' && value.type !== 'recoverable' && value.type !== 'console' || typeof value.fatal !== 'boolean' || value.boundary !== undefined && (!isRecord(value.boundary) || ![
        'default-global',
        'custom-global',
        'custom'
    ].includes(value.boundary.kind) || value.boundary.name !== undefined && typeof value.boundary.name !== 'string') || !Array.isArray(value.frames)) {
        return false;
    }
    if (value.error !== null) {
        if (!isRecord(value.error)) {
            return false;
        }
        if (value.error.name !== undefined && typeof value.error.name !== 'string' || value.error.message !== undefined && typeof value.error.message !== 'string' || value.error.stack !== undefined && typeof value.error.stack !== 'string' || value.error.source !== null && value.error.source !== 'server' && value.error.source !== 'edge-server') {
            return false;
        }
    }
    return value.frames.every((frame)=>isRecord(frame) && isNullableString(frame.file) && typeof frame.methodName === 'string' && isNullableNumber(frame.line1) && isNullableNumber(frame.column1));
}
function isRuntimeErrorStateUpdate(value) {
    if (!isRecord(value) || value.event !== _hotreloadertypes.HMR_MESSAGE_SENT_TO_SERVER.RUNTIME_ERRORS || typeof value.pathname !== 'string' || !value.pathname.startsWith('/') || value.pathname.includes('?') || value.pathname.includes('#') || !isRecord(value.errorState) || !Array.isArray(value.errorState.errors) || value.errorState.routerType !== 'app') {
        return false;
    }
    return value.errorState.errors.every(isRuntimeErrorStateError);
}
function createRuntimeErrorStateHandler(sendHmrMessage, format = formatRuntimeErrors, clientId = (0, _crypto.randomUUID)()) {
    let generation = 0;
    let disposed = false;
    let lastPublishedMessage = null;
    const formattedErrorCache = new Map();
    async function formatWithCache(errors, isAppDirectory) {
        const keys = errors.map((error)=>`${isAppDirectory ? 'app' : 'pages'}:${JSON.stringify(error)}`);
        const activeKeys = new Set(keys);
        const pending = [];
        const missing = [];
        for(let index = 0; index < errors.length; index++){
            const key = keys[index];
            const cached = formattedErrorCache.get(key);
            if (cached) {
                pending[index] = cached;
            } else {
                missing.push({
                    error: errors[index],
                    key,
                    outputIndex: index
                });
            }
        }
        if (missing.length > 0) {
            const batch = format(missing.map(({ error })=>error), isAppDirectory);
            for(let index = 0; index < missing.length; index++){
                const { key, outputIndex } = missing[index];
                const formatted = batch.then((result)=>{
                    const error = result[index];
                    if (!error) {
                        throw new Error('Runtime error formatter returned no result');
                    }
                    return error;
                }).catch((error)=>{
                    if (formattedErrorCache.get(key) === formatted) {
                        formattedErrorCache.delete(key);
                    }
                    throw error;
                });
                formattedErrorCache.set(key, formatted);
                pending[outputIndex] = formatted;
            }
        }
        for (const key of formattedErrorCache.keys()){
            if (!activeKeys.has(key)) {
                formattedErrorCache.delete(key);
            }
        }
        return Promise.all(pending.map((formatted)=>{
            if (!formatted) {
                throw new Error('Runtime error formatter cache is incomplete');
            }
            return formatted;
        }));
    }
    return {
        async handle (update) {
            if (disposed || !isRuntimeErrorStateUpdate(update)) {
                return;
            }
            const currentGeneration = ++generation;
            const errors = await formatWithCache(update.errorState.errors, update.errorState.routerType === 'app');
            if (disposed || currentGeneration !== generation) {
                return;
            }
            const message = {
                type: _hotreloadertypes.HMR_MESSAGE_SENT_TO_BROWSER.RUNTIME_ERRORS,
                clientId,
                pathname: update.pathname,
                errors
            };
            sendHmrMessage(message);
            lastPublishedMessage = message;
        },
        dispose () {
            if (disposed) {
                return;
            }
            const clearMessage = lastPublishedMessage && lastPublishedMessage.errors.length > 0 ? {
                ...lastPublishedMessage,
                errors: []
            } : null;
            disposed = true;
            generation++;
            formattedErrorCache.clear();
            lastPublishedMessage = null;
            if (clearMessage) {
                sendHmrMessage(clearMessage);
            }
        }
    };
}

//# sourceMappingURL=runtime-error-state.js.map