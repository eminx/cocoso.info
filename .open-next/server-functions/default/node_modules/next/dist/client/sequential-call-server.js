// The sequential implementation of callServer (app-call-server.ts): Server
// Actions are dispatched into the sequential router action queue. Callers
// must never import this module directly; they import './app-call-server',
// which resolves here unless `experimental.concurrentRouterQueue` swaps in
// './concurrent-call-server' at the bundler level (see
// create-compiler-aliases.ts and next_import_map.rs).
//
// This module must remain free of side effects at module scope: in addition
// to the browser bundle, a statically-resolved copy may be compiled into the
// pre-compiled app-page runtime bundles, where the bundler alias cannot
// reach. Only the browser copy ever runs.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "callServer", {
    enumerable: true,
    get: function() {
        return callServer;
    }
});
const _react = require("react");
const _routerreducertypes = require("./components/router-reducer/router-reducer-types");
const _useactionqueue = require("./components/use-action-queue");
async function callServer(actionId, actionArgs) {
    return new Promise((resolve, reject)=>{
        (0, _react.startTransition)(()=>{
            (0, _useactionqueue.dispatchAppRouterAction)({
                type: _routerreducertypes.ACTION_SERVER_ACTION,
                actionId,
                actionArgs,
                resolve,
                reject
            });
        });
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=sequential-call-server.js.map