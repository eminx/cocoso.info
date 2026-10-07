"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "reporter", {
    enumerable: true,
    get: function() {
        return reporter;
    }
});
const _totelemetry = /*#__PURE__*/ _interop_require_default(require("./to-telemetry"));
const _tojson = /*#__PURE__*/ _interop_require_default(require("./to-json"));
const _tojsonbuild = /*#__PURE__*/ _interop_require_default(require("./to-json-build"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class MultiReporter {
    constructor(reporters){
        this.reporters = [];
        this.reporters = reporters;
    }
    flushAll() {
        this.reporters.forEach((reporter)=>reporter.flushAll());
    }
    close() {
        this.reporters.forEach((reporter)=>reporter.close == null ? void 0 : reporter.close.call(reporter));
    }
    report(event) {
        this.reporters.forEach((reporter)=>reporter.report(event));
    }
}
const reporter = new MultiReporter([
    _tojson.default,
    _tojsonbuild.default,
    _totelemetry.default
]);

//# sourceMappingURL=index.js.map