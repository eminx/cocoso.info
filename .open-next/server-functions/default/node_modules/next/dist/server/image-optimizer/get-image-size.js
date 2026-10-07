"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImageSize", {
    enumerable: true,
    get: function() {
        return getImageSize;
    }
});
const _imagesize = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/image-size"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function getImageSize(buffer) {
    const { width, height } = (0, _imagesize.default)(buffer);
    return {
        width,
        height
    };
}

//# sourceMappingURL=get-image-size.js.map