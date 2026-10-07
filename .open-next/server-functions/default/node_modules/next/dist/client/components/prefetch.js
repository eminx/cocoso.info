"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    prefetch: null,
    prefetchRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    prefetch: function() {
        return prefetch;
    },
    prefetchRoute: function() {
        return prefetchRoute;
    }
});
const _routerreducertypes = require("./router-reducer/router-reducer-types");
const _approuterutils = require("./app-router-utils");
const _approuterinstance = require("./app-router-instance");
const _javascripturl = require("../lib/javascript-url");
const _cachekey = require("./segment-cache/cache-key");
const _scheduler = require("./segment-cache/scheduler");
const _types = require("./segment-cache/types");
function prefetchRoute(href, options) {
    if ((0, _javascripturl.isJavaScriptURLString)(href)) {
        throw new Error('Next.js has blocked a javascript: URL as a security precaution.');
    }
    const state = (0, _approuterinstance.getCurrentAppRouterState)();
    if (state === null) {
        throw new Error('Internal Next.js error: Router action dispatched before initialization.');
    }
    const prefetchKind = options?.kind ?? _routerreducertypes.PrefetchKind.AUTO;
    // We don't currently offer a way to issue a runtime prefetch via `router.prefetch()`.
    // This will be possible when we update its API to not take a PrefetchKind.
    let fetchStrategy;
    switch(prefetchKind){
        case _routerreducertypes.PrefetchKind.AUTO:
            {
                // We default to PPR. We'll discover whether or not the route supports it with the initial prefetch.
                fetchStrategy = _types.FetchStrategy.PPR;
                break;
            }
        case _routerreducertypes.PrefetchKind.FULL:
            {
                fetchStrategy = _types.FetchStrategy.Full;
                break;
            }
        default:
            {
                prefetchKind;
                // Despite typescript thinking that this can't happen,
                // we might get an unexpected value from user code.
                // We don't know what they want, but we know they want a prefetch,
                // so use the default.
                fetchStrategy = _types.FetchStrategy.PPR;
            }
    }
    prefetch(href, state.nextUrl, state.root, fetchStrategy, options?.onInvalidate ?? null);
}
function prefetch(href, nextUrl, renderTreeAtTimeOfPrefetch, fetchStrategy, onInvalidate) {
    const url = (0, _approuterutils.createPrefetchURL)(href);
    if (url === null) {
        // This href should not be prefetched.
        return;
    }
    const cacheKey = (0, _cachekey.createCacheKey)(url.href, nextUrl);
    (0, _scheduler.schedulePrefetchTask)(cacheKey, renderTreeAtTimeOfPrefetch, fetchStrategy, _types.PrefetchPriority.Default, onInvalidate, null // navigationLockPrefetch
    );
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=prefetch.js.map