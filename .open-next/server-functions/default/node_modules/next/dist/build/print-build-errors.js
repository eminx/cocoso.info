"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatWarningsHeader: null,
    printBuildErrors: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatWarningsHeader: function() {
        return formatWarningsHeader;
    },
    printBuildErrors: function() {
        return printBuildErrors;
    }
});
const _utils = require("../shared/lib/turbopack/utils");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("./output/log"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const STRICT_ROUTE_MATCHING_ISSUE_TITLES = new Set([
    'Interception routes must have a canonical route',
    'Parallel route slots cannot render the same URLs',
    'Unmatched app pages'
]);
function formatWarningsHeader(count) {
    return `Turbopack build encountered ${count} ${count === 1 ? 'warning' : 'warnings'}:`;
}
function printBuildErrors(result, isDev, opts) {
    // Issues that we want to stop the server from executing
    const topLevelFatalIssues = [];
    // Issues that are true errors, but we believe we can keep running and allow the user to address the issue
    const topLevelErrors = [];
    // Issues that are warnings but should not affect the running of the build
    const topLevelWarnings = [];
    // Track seen formatted error messages to avoid duplicates
    const seenFatalIssues = new Set();
    const seenErrors = new Set();
    const seenWarnings = new Set();
    let hasStrictRouteMatchingIssue = false;
    for (const issue of result.issues){
        if (issue.severity === 'error' && STRICT_ROUTE_MATCHING_ISSUE_TITLES.has((0, _utils.renderStyledStringToErrorAnsi)(issue.title))) {
            hasStrictRouteMatchingIssue = true;
        }
        // We only want to completely shut down the server
        if (issue.severity === 'fatal' || issue.severity === 'bug') {
            const formatted = (0, _utils.formatIssue)(issue);
            if (!seenFatalIssues.has(formatted)) {
                seenFatalIssues.add(formatted);
                topLevelFatalIssues.push(formatted);
            }
        } else if ((0, _utils.isRelevantWarning)(issue)) {
            const formatted = (0, _utils.formatIssue)(issue);
            if (!seenWarnings.has(formatted)) {
                seenWarnings.add(formatted);
                topLevelWarnings.push(formatted);
            }
        } else if (issue.severity === 'error') {
            const formatted = (0, _utils.formatIssue)(issue);
            if (isDev) {
                // We want to treat errors as recoverable in development
                // so that we can show the errors in the site and allow users
                // to respond to the errors when necessary. In production builds
                // though we want to error out and stop the build process.
                if (!seenErrors.has(formatted)) {
                    seenErrors.add(formatted);
                    topLevelErrors.push(formatted);
                }
            } else {
                if (!seenFatalIssues.has(formatted)) {
                    seenFatalIssues.add(formatted);
                    topLevelFatalIssues.push(formatted);
                }
            }
        }
    }
    // TODO: print in order by source location so issues from the same file are displayed together and then add a summary at the end about the number of warnings/errors
    const deferWarnings = ((opts == null ? void 0 : opts.deferWarnings) ?? false) && topLevelFatalIssues.length === 0;
    if (topLevelWarnings.length > 0 && !deferWarnings) {
        console.warn(`${formatWarningsHeader(topLevelWarnings.length)}\n${topLevelWarnings.join('\n')}`);
    }
    if (topLevelErrors.length > 0) {
        console.error(`Turbopack build encountered ${topLevelErrors.length} ${topLevelErrors.length === 1 ? 'error' : 'errors'}:\n${topLevelErrors.join('\n')}`);
    }
    if (hasStrictRouteMatchingIssue && (opts == null ? void 0 : opts.strictRouteMatchingDefaultWarning)) {
        _log.warnOnce(opts.strictRouteMatchingDefaultWarning);
    }
    if (topLevelFatalIssues.length > 0) {
        throw new Error(`Turbopack build failed with ${topLevelFatalIssues.length} ${topLevelFatalIssues.length === 1 ? 'error' : 'errors'}:\n${topLevelFatalIssues.join('\n')}`);
    }
    return {
        warnings: deferWarnings ? topLevelWarnings : []
    };
}

//# sourceMappingURL=print-build-errors.js.map