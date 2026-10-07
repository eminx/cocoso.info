"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _storage = require("./storage");
const _config = /*#__PURE__*/ _interop_require_default(require("../server/config"));
const _getprojectdir = require("../lib/get-project-dir");
const _constants = require("../shared/lib/constants");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(async ()=>{
    const [mode, inputDir, eventsFile, suppliedDistDir] = process.argv.slice(2);
    let dir = inputDir;
    if (!dir || mode !== 'dev') {
        throw new Error(`Invalid flags should be run as node detached-flush dev ./path-to/project [eventsFile] [distDir]`);
    }
    dir = (0, _getprojectdir.getProjectDir)(dir);
    // Build nudges pass their resolved output directory to avoid loading dev config again.
    const distDir = suppliedDistDir ? _path.default.resolve(suppliedDistDir) : _path.default.join(dir, (await (0, _config.default)(_constants.PHASE_DEVELOPMENT_SERVER, dir)).distDir || '.next');
    // Named batches live in cache so build cleanup cannot remove them before submission.
    // Retain the legacy root path for callers without an events filename.
    const eventsPath = eventsFile && !eventsFile.includes('/') ? _path.default.join(distDir, 'cache', eventsFile) : _path.default.join(distDir, '_events.json');
    let events;
    try {
        events = JSON.parse(_fs.default.readFileSync(eventsPath, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            // no events to process we can exit now
            process.exit(0);
        }
        throw err;
    }
    const telemetry = new _storage.Telemetry({
        distDir
    });
    await telemetry.record(events);
    await telemetry.flush();
    // finished flushing events clean-up
    _fs.default.unlinkSync(eventsPath);
// Don't call process.exit() here - let Node.js exit naturally after
// all pending work completes (e.g., setTimeout in debug telemetry)
})();

//# sourceMappingURL=detached-flush.js.map