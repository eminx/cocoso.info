"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _shared = require("../shared");
const _constants = require("../../shared/lib/constants");
const _tojson = require("./to-json");
const allowlistedEvents = new Set([
    'next-build',
    'run-turbopack',
    'run-webpack',
    'run-typescript',
    'run-eslint',
    'static-check',
    'collect-build-traces',
    'static-generation',
    'output-export-full-static-export',
    'adapter-handle-build-complete',
    'output-standalone',
    'telemetry-flush',
    'turbopack-persistence',
    'turbopack-compaction',
    'turbopack-module-graph',
    'turbopack-write-entrypoints',
    'turbopack-emit'
]);
const _default = (0, _tojson.createJsonReporter)({
    filename: 'trace-build',
    sizeLimit: Infinity,
    filter: (event)=>{
        const phase = _shared.traceGlobals.get('phase');
        return phase === _constants.PHASE_PRODUCTION_BUILD && allowlistedEvents.has(event.name);
    }
});

//# sourceMappingURL=to-json-build.js.map