"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderInBrowserAbortSignal", {
    enumerable: true,
    get: function() {
        return createRenderInBrowserAbortSignal;
    }
});
const _reactdom = require("react-dom");
const _bailouttocsr = require("../../shared/lib/lazy-dynamic/bailout-to-csr");
const _reactbrowserbailout = require("../../shared/lib/lazy-dynamic/react-browser-bailout");
const RENDER_IN_BROWSER_BAILOUT_REASON = 'Render in Browser';
const getRenderInBrowserBailoutReason = _reactbrowserbailout.createReactBrowserBailoutReason.bind(null, RENDER_IN_BROWSER_BAILOUT_REASON);
function createRenderInBrowserAbortSignal(reactBrowserBailout) {
    const controller = new AbortController();
    if (reactBrowserBailout) {
        // @ts-expect-error TODO: Update @types/react-dom to include the reason argument.
        controller.abort((0, _reactdom.browser)(getRenderInBrowserBailoutReason));
    } else {
        controller.abort(new _bailouttocsr.BailoutToCSRError(RENDER_IN_BROWSER_BAILOUT_REASON));
    }
    return controller.signal;
}

//# sourceMappingURL=render-in-browser.js.map