"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handleISRError", {
    enumerable: true,
    get: function() {
        return handleISRError;
    }
});
const _serverasyncstorage = require("./server-async-storage");
function handleISRError({ error }) {
    if (!_serverasyncstorage.workUnitAsyncStorage) {
        return;
    }
    const store = _serverasyncstorage.workUnitAsyncStorage.getStore();
    switch(store?.type){
        case 'prerender':
        case 'prerender-client':
        case 'prerender-legacy':
            if (error) {
                console.error(error);
            }
            throw error;
        case 'request':
        case 'prerender-runtime':
        case 'validation-client':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'build-time-generator':
        case undefined:
            return;
        default:
            store;
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=handle-isr-error.js.map