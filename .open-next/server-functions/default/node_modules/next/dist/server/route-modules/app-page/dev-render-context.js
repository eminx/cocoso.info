"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDevRenderContext", {
    enumerable: true,
    get: function() {
        return createDevRenderContext;
    }
});
const _requestmeta = require("../../request-meta");
function createDevRenderContext(req, hmrCacheFallback) {
    if (!process.env.__NEXT_DEV_SERVER) {
        return undefined;
    }
    const { serverComponentsHmrCache, hmrRefreshHash } = (0, _requestmeta.getRequestMeta)(req);
    return {
        serverComponentsHmrCache: serverComponentsHmrCache ?? hmrCacheFallback,
        hmrRefreshHash
    };
}

//# sourceMappingURL=dev-render-context.js.map