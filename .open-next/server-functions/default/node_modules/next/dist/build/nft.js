"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    mapNftFileEntries: null,
    resolveNftOutputPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    mapNftFileEntries: function() {
        return mapNftFileEntries;
    },
    resolveNftOutputPath: function() {
        return resolveNftOutputPath;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function invalid(message) {
    throw new Error(`Invalid NFT metadata: ${message}`);
}
function isRelativePathInside(relative) {
    return relative === '' || !_path.default.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${_path.default.sep}`);
}
function relativePathIfInside(root, candidate) {
    const relative = _path.default.relative(root, candidate);
    return isRelativePathInside(relative) ? relative : undefined;
}
function mapBasePath(traceFileDirectory, baseRoot, relativePath) {
    const source = _path.default.resolve(traceFileDirectory, relativePath);
    return {
        source,
        destination: _path.default.relative(baseRoot, source)
    };
}
function mapBasePathInsideRoot(traceFileDirectory, baseRoot, relativePath) {
    const mapped = mapBasePath(traceFileDirectory, baseRoot, relativePath);
    if (!isRelativePathInside(mapped.destination)) {
        invalid(`path ${JSON.stringify(relativePath)} escapes the base root`);
    }
    return mapped;
}
function mapAdditionalRootPath(traceFileDirectory, root, relativePath) {
    const rootPath = _path.default.resolve(traceFileDirectory, root.path);
    const source = _path.default.resolve(rootPath, relativePath);
    if (relativePathIfInside(rootPath, source) === undefined) {
        invalid(`path ${JSON.stringify(relativePath)} escapes additional root ${root.name}`);
    }
    return {
        source,
        destination: _path.default.join('next_additional_roots', root.name, relativePath)
    };
}
function mapNftFileEntries(nft, traceFilePath, baseRoot, options) {
    const traceFileDirectory = _path.default.dirname(traceFilePath);
    const roots = nft.additionalRoots ?? [];
    const result = [];
    const mapList = (list, currentRootIndex)=>{
        // The list of symlinks is always in sorted order (by file index)
        const { files, fileHashes } = list;
        const symlinks = list.symlinks ?? [];
        let symlinkCursor = 0;
        let nextSymlink = symlinks[symlinkCursor];
        for(let fileIndex = 0; fileIndex < files.length; fileIndex++){
            const file = files[fileIndex];
            let symlink;
            if ((nextSymlink == null ? void 0 : nextSymlink[0]) === fileIndex) {
                symlink = nextSymlink;
                nextSymlink = symlinks[++symlinkCursor];
            }
            // a currentRootIndex of -1 denotes a path relative to the *.nft.json file
            // (i.e. not an additional root)
            const mapped = currentRootIndex === -1 ? mapBasePath(traceFileDirectory, baseRoot, file) : mapAdditionalRootPath(traceFileDirectory, roots[currentRootIndex], file);
            if (currentRootIndex === -1 && (options == null ? void 0 : options.skipBaseRootEscapes) && !isRelativePathInside(mapped.destination)) {
                options.onBaseRootEscape == null ? void 0 : options.onBaseRootEscape.call(options, mapped.source);
                continue;
            }
            let symlinkTarget;
            let symlinkCrossesRoot = false;
            if (symlink !== undefined) {
                const [, target, rootIndex] = symlink;
                symlinkCrossesRoot = rootIndex !== undefined;
                const targetRootIndex = rootIndex ?? currentRootIndex;
                symlinkTarget = targetRootIndex === -1 ? ((options == null ? void 0 : options.skipBaseRootEscapes) ? mapBasePathInsideRoot(traceFileDirectory, baseRoot, target) : mapBasePath(traceFileDirectory, baseRoot, target)).destination : mapAdditionalRootPath(traceFileDirectory, roots[targetRootIndex], target).destination;
            }
            result.push({
                source: mapped.source,
                destination: mapped.destination,
                hash: fileHashes == null ? void 0 : fileHashes[fileIndex],
                symlinkTarget,
                symlinkCrossesRoot
            });
        }
    };
    mapList(nft, -1);
    for(let rootIndex = 0; rootIndex < roots.length; rootIndex++){
        mapList(roots[rootIndex], rootIndex);
    }
    return result;
}
function resolveNftOutputPath(outputRoot, destination) {
    const outputPath = _path.default.resolve(outputRoot, destination);
    if (relativePathIfInside(outputRoot, outputPath) === undefined) {
        invalid(`output path ${JSON.stringify(destination)} escapes the deployment root`);
    }
    return outputPath;
}

//# sourceMappingURL=nft.js.map