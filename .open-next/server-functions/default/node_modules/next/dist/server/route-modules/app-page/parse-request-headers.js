"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseRequestHeaders", {
    enumerable: true,
    get: function() {
        return parseRequestHeaders;
    }
});
const _approuterheaders = require("../../../client/components/app-router-headers");
const _isrscrequest = require("../../lib/is-rsc-request");
const _getscriptnoncefromheader = require("../../app-render/get-script-nonce-from-header");
const _parseandvalidateflightrouterstate = require("../../app-render/parse-and-validate-flight-router-state");
const _serverutils = require("../../server-utils");
function parseRequestHeaders(headers, options) {
    const isRSCRequest = (0, _isrscrequest.isRSCRequestHeader)(headers[_approuterheaders.RSC_HEADER]);
    // runtime prefetch requests are *not* treated as prefetch requests
    // (TODO: this is confusing, we should refactor this to express this better)
    const isPrefetchRequest = isRSCRequest && headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] === '1';
    const isAppShellPrefetchRequest = isRSCRequest && headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] === '3';
    // App Shell prefetches are a subtype of runtime prefetch — same code path,
    // but with less resolved content (omitting link data)
    const isRuntimePrefetchRequest = isRSCRequest && (headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] === '2' || isAppShellPrefetchRequest);
    const isHmrRefresh = headers[_approuterheaders.NEXT_HMR_REFRESH_HEADER] !== undefined;
    const shouldProvideFlightRouterState = isRSCRequest && (!isPrefetchRequest || !options.isRoutePPREnabled);
    const flightRouterState = shouldProvideFlightRouterState ? (0, _parseandvalidateflightrouterstate.parseAndValidateFlightRouterState)(headers[_approuterheaders.NEXT_ROUTER_STATE_TREE_HEADER]) : undefined;
    // Checks if this is a prefetch of the Route Tree by the Segment Cache
    const isRouteTreePrefetchRequest = isRSCRequest && headers[_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER] === '/_tree';
    const csp = headers['content-security-policy'] || headers['content-security-policy-report-only'];
    const nonce = typeof csp === 'string' ? (0, _getscriptnoncefromheader.getScriptNonceFromHeader)(csp) : undefined;
    const previouslyRevalidatedTags = (0, _serverutils.getPreviouslyRevalidatedTags)(headers, options.previewModeId);
    let requestId;
    let htmlRequestId;
    if (process.env.__NEXT_DEV_SERVER) {
        // The request IDs are only used for the dev server to send debug
        // information to the matching client (identified by the HTML request ID
        // that was sent to the client with the HTML document) for the current
        // request (identified by the request ID, as defined by the client).
        requestId = typeof headers[_approuterheaders.NEXT_REQUEST_ID_HEADER] === 'string' ? headers[_approuterheaders.NEXT_REQUEST_ID_HEADER] : undefined;
        htmlRequestId = typeof headers[_approuterheaders.NEXT_HTML_REQUEST_ID_HEADER] === 'string' ? headers[_approuterheaders.NEXT_HTML_REQUEST_ID_HEADER] : undefined;
    }
    return {
        flightRouterState,
        isPrefetchRequest,
        isRuntimePrefetchRequest,
        isAppShellPrefetchRequest,
        isRouteTreePrefetchRequest,
        isHmrRefresh,
        isRSCRequest,
        nonce,
        previouslyRevalidatedTags,
        requestId,
        htmlRequestId
    };
}

//# sourceMappingURL=parse-request-headers.js.map