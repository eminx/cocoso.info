"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "warnMissingReactDependencies", {
    enumerable: true,
    get: function() {
        return warnMissingReactDependencies;
    }
});
function warnMissingReactDependencies(projectDir) {
    // Resolve from the app so downloaded or linked CLI installations do not
    // warn about dependencies that are already installed in the target project.
    for (const dependency of [
        'react',
        'react-dom'
    ]){
        try {
            require.resolve(dependency, {
                paths: [
                    projectDir
                ]
            });
        } catch (err) {
            if (err.code !== 'MODULE_NOT_FOUND') {
                throw err;
            }
            console.warn(`The module '${dependency}' was not found. Next.js requires that you include it in 'dependencies' of your 'package.json'. To add it, run 'npm install ${dependency}'`);
        }
    }
}

//# sourceMappingURL=warn-missing-react-dependencies.js.map