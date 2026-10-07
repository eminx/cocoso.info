"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPreviouslyCachedImageOrNull", {
    enumerable: true,
    get: function() {
        return getPreviouslyCachedImageOrNull;
    }
});
function getPreviouslyCachedImageOrNull(upstreamImage, previousCacheEntry) {
    var _previousCacheEntry_value;
    if ((previousCacheEntry == null ? void 0 : (_previousCacheEntry_value = previousCacheEntry.value) == null ? void 0 : _previousCacheEntry_value.kind) === 'IMAGE' && // Images that are SVGs, animated or failed the optimization previously end up using upstreamEtag as their etag as well,
    // in these cases we want to trigger a new "optimization" attempt.
    previousCacheEntry.value.upstreamEtag !== previousCacheEntry.value.etag && // and the upstream etag is the same as the previous cache entry's
    upstreamImage.etag === previousCacheEntry.value.upstreamEtag) {
        return previousCacheEntry.value;
    }
    return null;
}

//# sourceMappingURL=get-previously-cached-image-or-null.js.map