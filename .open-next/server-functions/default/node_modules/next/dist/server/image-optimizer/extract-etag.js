"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    extractEtag: null,
    getHash: null,
    getImageEtag: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    extractEtag: function() {
        return extractEtag;
    },
    getHash: function() {
        return getHash;
    },
    getImageEtag: function() {
        return getImageEtag;
    }
});
const _crypto = require("crypto");
function getHash(items) {
    const hash = (0, _crypto.createHash)('sha256');
    for (let item of items){
        if (typeof item === 'number') hash.update(String(item));
        else {
            hash.update(item);
        }
    }
    // See https://en.wikipedia.org/wiki/Base64#URL_applications
    return hash.digest('base64url');
}
function extractEtag(etag, imageBuffer) {
    if (etag) {
        // upstream etag needs to be base64url encoded due to weak etag signature
        // as we store this in the cache-entry file name.
        return Buffer.from(etag).toString('base64url');
    }
    return getImageEtag(imageBuffer);
}
function getImageEtag(image) {
    return getHash([
        image
    ]);
}

//# sourceMappingURL=extract-etag.js.map