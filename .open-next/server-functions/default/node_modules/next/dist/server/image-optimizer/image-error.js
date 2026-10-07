"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageError", {
    enumerable: true,
    get: function() {
        return ImageError;
    }
});
class ImageError extends Error {
    constructor(statusCode, message){
        super(message);
        // ensure an error status is used > 400
        if (statusCode >= 400) {
            this.statusCode = statusCode;
        } else {
            this.statusCode = 500;
        }
    }
}

//# sourceMappingURL=image-error.js.map