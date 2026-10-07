// This module is the router's operation interface: one function per
// user-facing operation, called directly by the corresponding entry points
// (Link, the public router methods, the history event handlers).
//
// The navigator owns the startTransition for its operations, along with the
// centralized safety checks; callers must invoke these functions
// synchronously within the originating event.
//
// Server Actions are not a navigator operation: the action queue is
// semantically separate from the router state queue. Its entry point is
// callServer (app-call-server.ts), which forks the same way.
//
// This is the seam where the experimental rewrite of the router state
// machine forks from the existing implementation, so nothing above this
// interface may depend on how the operations are processed. The fork happens
// at the bundler level: by default this module re-exports the sequential
// router queue, but when `experimental.concurrentRouterQueue` is enabled,
// imports of this module resolve to './concurrent-router-queue' instead —
// neither this module nor the sequential implementation is bundled at all.
// The aliases live in create-compiler-aliases.ts (webpack/rspack) and
// next_import_map.rs (Turbopack). The export list below is the interface;
// both implementations expose exactly this surface.
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
        return _sequentialrouterqueue.hmrRefresh;
    },
    navigate: function() {
        return _sequentialrouterqueue.navigate;
    },
    push: function() {
        return _sequentialrouterqueue.push;
    },
    refresh: function() {
        return _sequentialrouterqueue.refresh;
    },
    replace: function() {
        return _sequentialrouterqueue.replace;
    },
    restore: function() {
        return _sequentialrouterqueue.restore;
    },
    traverse: function() {
        return _sequentialrouterqueue.traverse;
    }
});
const _sequentialrouterqueue = require("./sequential-router-queue");

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=navigator.js.map