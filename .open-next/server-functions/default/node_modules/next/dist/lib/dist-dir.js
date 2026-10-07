"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InvalidDistDirError: null,
    verifyDistDir: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    InvalidDistDirError: function() {
        return InvalidDistDirError;
    },
    verifyDistDir: function() {
        return verifyDistDir;
    }
});
const _nodepath = /*#__PURE__*/ _interop_require_wildcard(require("node:path"));
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
class InvalidDistDirError extends Error {
    constructor(distDir, appDir, workspaceRoot){
        super(`The configured distDir should be inside of the application directory ` + `or the workspace containing it, and must not contain the application ` + `directory itself:\n\n` + `  distDir:        ${distDir}\n` + `  application:    ${appDir}\n` + `  workspace root: ${workspaceRoot}\n\n` + `Read more: https://nextjs.org/docs/messages/invalid-dist-dir`);
        this.name = 'InvalidDistDirError';
    }
}
/** Whether `descendant` is strictly inside `ancestor`. */ // TODO: Account for symlinks when validating containment.
function isStrictlyInside(ancestor, descendant) {
    const relative = _nodepath.relative(_nodepath.resolve(ancestor), descendant);
    return relative !== '' && relative !== '..' && !relative.startsWith('..' + _nodepath.sep) && !_nodepath.isAbsolute(relative);
}
function verifyDistDir(distDir, appDir, workspaceRoot) {
    const resolvedDistDir = _nodepath.resolve(distDir);
    const resolvedAppDir = _nodepath.resolve(appDir);
    const resolvedWorkspaceRoot = _nodepath.resolve(workspaceRoot);
    const isInsideBoundary = isStrictlyInside(resolvedAppDir, resolvedDistDir) || isStrictlyInside(resolvedWorkspaceRoot, resolvedDistDir);
    const containsApp = resolvedDistDir === resolvedAppDir || isStrictlyInside(resolvedDistDir, resolvedAppDir);
    if (isInsideBoundary && !containsApp) {
        return;
    }
    throw new InvalidDistDirError(resolvedDistDir, resolvedAppDir, resolvedWorkspaceRoot);
}

//# sourceMappingURL=dist-dir.js.map