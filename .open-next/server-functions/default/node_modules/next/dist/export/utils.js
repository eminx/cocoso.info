"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getBuildDistDir: null,
    hasCustomExportOutput: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getBuildDistDir: function() {
        return getBuildDistDir;
    },
    hasCustomExportOutput: function() {
        return hasCustomExportOutput;
    }
});
function hasCustomExportOutput(config) {
    // In the past, a user had to run "next build" to generate
    // ".next" (or whatever the distDir) followed by "next export"
    // to generate "out" (or whatever the outDir). However, when
    // "output: export" is configured, "next build" does both steps.
    // In this mode, a custom distDir names the export destination.
    return config.output === 'export' && config.distDir !== '.next';
}
function getBuildDistDir(config) {
    // A custom distDir is the export destination in this mode. Build artifacts
    // and manifests still live in .next until they are exported.
    return hasCustomExportOutput(config) ? '.next' : config.distDir;
}

//# sourceMappingURL=utils.js.map