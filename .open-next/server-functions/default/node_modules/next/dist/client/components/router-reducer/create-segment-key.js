"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createHeadKey: null,
    createSegmentKey: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createHeadKey: function() {
        return createHeadKey;
    },
    createSegmentKey: function() {
        return createSegmentKey;
    }
});
const _createroutercachekey = require("./create-router-cache-key");
function createSegmentKey(segment) {
    if (Array.isArray(segment)) {
        return `${segment[0]}|${segment[2]}`;
    }
    return (0, _createroutercachekey.createRouterCacheKey)(segment);
}
function createHeadKey(varyPath) {
    // The head's vary path starts with its request key: the route structure,
    // with param names but no values.
    return varyPath.value;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=create-segment-key.js.map