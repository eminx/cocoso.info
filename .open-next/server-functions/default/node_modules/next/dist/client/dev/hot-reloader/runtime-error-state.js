"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createRuntimeErrorStateReporter: null,
    reportCurrentRuntimeErrorState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createRuntimeErrorStateReporter: function() {
        return createRuntimeErrorStateReporter;
    },
    reportCurrentRuntimeErrorState: function() {
        return reportCurrentRuntimeErrorState;
    }
});
const _nextdevtools = require("next/dist/compiled/next-devtools");
const _hotreloadertypes = require("../../../server/dev/hot-reloader-types");
let reportCurrentState = null;
function reportCurrentRuntimeErrorState() {
    reportCurrentState?.();
}
function createRuntimeErrorStateReporter(sendMessage) {
    let lastSerializedState = null;
    const report = (errorState, force = false)=>{
        const pathname = window.location.pathname;
        const serializedState = JSON.stringify({
            pathname,
            errorState
        });
        if (!force && serializedState === lastSerializedState) {
            return;
        }
        lastSerializedState = serializedState;
        const update = {
            event: _hotreloadertypes.HMR_MESSAGE_SENT_TO_SERVER.RUNTIME_ERRORS,
            pathname,
            errorState
        };
        sendMessage(JSON.stringify(update));
    };
    (0, _nextdevtools.subscribeToRuntimeErrorState)((state)=>report(state));
    const reportCurrent = (force)=>{
        const state = (0, _nextdevtools.getSerializedRuntimeErrorState)();
        if (state) {
            report({
                errors: state.errors,
                routerType: state.routerType
            }, force);
        }
    };
    reportCurrentState = ()=>reportCurrent(false);
    return {
        reportCurrent () {
            reportCurrent(true);
        }
    };
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=runtime-error-state.js.map