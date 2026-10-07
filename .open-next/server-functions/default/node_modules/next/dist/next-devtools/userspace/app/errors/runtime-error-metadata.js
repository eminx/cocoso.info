"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    setRuntimeErrorMetadata: null,
    takeRuntimeErrorMetadata: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    setRuntimeErrorMetadata: function() {
        return setRuntimeErrorMetadata;
    },
    takeRuntimeErrorMetadata: function() {
        return takeRuntimeErrorMetadata;
    }
});
const pendingMetadata = new WeakMap();
function setRuntimeErrorMetadata(error, metadata) {
    pendingMetadata.set(error, metadata);
}
function takeRuntimeErrorMetadata(error) {
    const metadata = pendingMetadata.get(error);
    pendingMetadata.delete(error);
    return metadata;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=runtime-error-metadata.js.map