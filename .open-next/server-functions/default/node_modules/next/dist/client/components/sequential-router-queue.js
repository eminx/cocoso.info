// The sequential-router-queue implementation of the navigator interface
// (navigator.ts). Callers must never import this module directly; they import
// './navigator', which resolves here unless `experimental.
// concurrentRouterQueue` swaps in `./concurrent-router-queue` at the bundler
// level (see create-compiler-aliases.ts and next_import_map.rs).
//
// The legacy reducer action objects are an implementation detail of the
// sequential action queue; they are constructed here and never by callers.
//
// This module must remain free of side effects at module scope: in addition
// to the browser bundle, a statically-resolved copy is compiled into the
// pre-compiled app-page runtime bundles (via app-render.tsx), where the
// bundler alias cannot reach. Only the browser copy's operations ever run.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    hmrRefresh: null,
    navigate: null,
    push: null,
    refresh: null,
    replace: null,
    restore: null,
    traverse: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    hmrRefresh: function() {
        return hmrRefresh;
    },
    navigate: function() {
        return navigate;
    },
    push: function() {
        return push;
    },
    refresh: function() {
        return refresh;
    },
    replace: function() {
        return replace;
    },
    restore: function() {
        return restore;
    },
    traverse: function() {
        return traverse;
    }
});
const _react = require("react");
const _routerreducertypes = require("./router-reducer/router-reducer-types");
const _useactionqueue = require("./use-action-queue");
const _approuterinstance = require("./app-router-instance");
const _links = require("./links");
const _routertransition = require("./router-transition");
const _addbasepath = require("../add-base-path");
const _approuterutils = require("./app-router-utils");
const _javascripturl = require("../lib/javascript-url");
const _optimisticroutes = require("./segment-cache/optimistic-routes");
function getRequiredAppRouterState() {
    const state = (0, _approuterinstance.getCurrentAppRouterState)();
    if (state === null) {
        throw new Error('Internal Next.js error: Router action dispatched before initialization.');
    }
    return state;
}
function navigate(href, navigateType, scrollBehavior, linkInstanceRef, transitionTypes, prefetchIntent) {
    if ((0, _javascripturl.isJavaScriptURLString)(href)) {
        throw new Error('Next.js has blocked a javascript: URL as a security precaution.');
    }
    (0, _react.startTransition)(()=>{
        // TODO: This stuff could just go into the reducer. Leaving as-is for now
        // since we're about to rewrite all the router reducer stuff anyway.
        if (transitionTypes) {
            for (const type of transitionTypes){
                (0, _react.addTransitionType)(type);
            }
        }
        const url = new URL((0, _addbasepath.addBasePath)(href), location.href);
        if (process.env.__NEXT_APP_NAV_FAIL_HANDLING) {
            window.next.__pendingUrl = url;
        }
        (0, _links.setLinkForCurrentNavigation)(linkInstanceRef);
        (0, _routertransition.startRouterTransition)(href, navigateType, getRequiredAppRouterState().tree, prefetchIntent);
        (0, _useactionqueue.dispatchAppRouterAction)({
            type: _routerreducertypes.ACTION_NAVIGATE,
            url,
            isExternalUrl: (0, _approuterutils.isExternalURL)(url),
            locationSearch: location.search,
            scrollBehavior,
            navigateType
        });
    });
}
function push(href, options) {
    navigate(href, 'push', options?.scroll === false ? _routerreducertypes.ScrollBehavior.NoScroll : _routerreducertypes.ScrollBehavior.Default, null, options?.transitionTypes, null);
}
function replace(href, options) {
    navigate(href, 'replace', options?.scroll === false ? _routerreducertypes.ScrollBehavior.NoScroll : _routerreducertypes.ScrollBehavior.Default, null, options?.transitionTypes, null);
}
function traverse(href, historyState) {
    (0, _react.startTransition)(()=>{
        (0, _routertransition.startRouterTransition)(href, 'traverse', getRequiredAppRouterState().tree, null);
        restore(new URL(href), historyState);
    });
}
function restore(url, historyState) {
    (0, _react.startTransition)(()=>{
        (0, _useactionqueue.dispatchAppRouterAction)({
            type: _routerreducertypes.ACTION_RESTORE,
            url,
            historyState
        });
    });
}
function refresh() {
    (0, _react.startTransition)(()=>{
        (0, _useactionqueue.dispatchAppRouterAction)({
            type: _routerreducertypes.ACTION_REFRESH
        });
    });
}
// Tracks the newest HMR refresh generation so that a newer refresh can abort
// the request of the one it supersedes. Development only.
let activeHmrRefreshController = null;
function hmrRefresh() {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error('hmrRefresh can only be used in development mode. Please use refresh instead.');
    } else {
        // Reset the known routes table so that route predictions are cleared
        // when routes change during development.
        (0, _optimisticroutes.resetKnownRoutes)();
        let signal;
        if (process.env.__NEXT_SERVER_COMPONENTS_HMR_CANCELLATION) {
            // Abort the superseded generation before scheduling the new one, so its
            // request is torn down as early as possible. Halting (not rejecting)
            // makes the abort safe regardless of order.
            activeHmrRefreshController?.abort();
            activeHmrRefreshController = new AbortController();
            signal = activeHmrRefreshController.signal;
        }
        (0, _react.startTransition)(()=>{
            (0, _useactionqueue.dispatchAppRouterAction)({
                type: _routerreducertypes.ACTION_HMR_REFRESH,
                signal
            });
        });
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=sequential-router-queue.js.map