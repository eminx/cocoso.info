"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PARAM_MATCHING_MODES: null,
    collectSegments: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PARAM_MATCHING_MODES: function() {
        return PARAM_MATCHING_MODES;
    },
    collectSegments: function() {
        return collectSegments;
    }
});
const _appsegmentconfig = require("./app-segment-config");
const _invarianterror = require("../../../shared/lib/invariant-error");
const _checks = require("../../../server/route-modules/checks");
const _clientandserverreferences = require("../../../lib/client-and-server-references");
const _getsegmentparam = require("../../../shared/lib/router/utils/get-segment-param");
const _appdirmodule = require("../../../server/lib/app-dir-module");
const _ensurestatic = require("../../../server/app-render/segment-config/ensure-static");
const _instantconfig = require("../../../server/app-render/instant-validation/instant-config");
const _isplainobject = require("../../../shared/lib/is-plain-object");
const PARAM_MATCHING_MODES = [
    'not-found',
    'blocking',
    'fallback',
    'dynamic'
];
function validateParamMatchingExport(route, filePath, exportName, value, visibleParamNames) {
    if (!(0, _isplainobject.isPlainObject)(value)) {
        const valueType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
        throw new Error(`Invalid value from \`${exportName}\` for "${route}". Expected an object, but received ${valueType}.`);
    }
    const paramMatching = {};
    for (const [paramName, mode] of Object.entries(value)){
        if (!visibleParamNames.includes(paramName)) {
            throw new Error(`Invalid parameter "${paramName}" in \`${exportName}\` for "${route}". The export in "${filePath}" may only configure parameters defined at or above its segment.`);
        }
        if (!PARAM_MATCHING_MODES.includes(mode)) {
            throw new Error(`Invalid mode for parameter "${paramName}" in \`${exportName}\` for "${route}". Expected "not-found", "blocking", "fallback", or "dynamic", but received ${JSON.stringify(mode)}.`);
        }
        paramMatching[paramName] = mode;
    }
    return paramMatching;
}
/**
 * Parses the app config and attaches it to the segment.
 */ function attach(segment, userland, route, visibleParamNames) {
    // If the userland is not an object, then we can't do anything with it.
    if (typeof userland !== 'object' || userland === null) {
        return;
    }
    // Try to parse the application configuration.
    const config = (0, _appsegmentconfig.parseAppSegmentConfig)(userland, route);
    // If there was any keys on the config, then attach it to the segment.
    if (Object.keys(config).length > 0) {
        segment.config = config;
    }
    if ('generateStaticParams' in userland && typeof userland.generateStaticParams === 'function') {
        var _segment_config;
        segment.generateStaticParams = userland.generateStaticParams;
        // Compiler-injected factory whose error stack is anchored at the user's
        // `generateStaticParams` declaration. Used to throw a meaningful error when
        // an empty result is detected under Cache Components.
        const createEmptyParamsError = userland.__next_create_empty_gsp_error;
        if (typeof createEmptyParamsError === 'function') {
            segment.createEmptyParamsError = createEmptyParamsError;
        }
        // Validate that `generateStaticParams` makes sense in this context.
        if (((_segment_config = segment.config) == null ? void 0 : _segment_config.runtime) === 'edge') {
            throw new Error('Edge runtime is not supported with `generateStaticParams`.');
        }
    }
    const hasStaticParamMatching = 'unstable_paramMatching' in userland;
    const hasGeneratedParamMatching = 'unstable_generateParamMatching' in userland;
    if (hasStaticParamMatching || hasGeneratedParamMatching) {
        if (hasStaticParamMatching && hasGeneratedParamMatching) {
            throw new Error(`Route "${route}" cannot export both \`unstable_paramMatching\` and \`unstable_generateParamMatching\`.`);
        }
        if (hasStaticParamMatching) {
            segment.paramMatching = validateParamMatchingExport(route, segment.filePath, 'unstable_paramMatching', userland.unstable_paramMatching, visibleParamNames);
        } else {
            const generate = userland.unstable_generateParamMatching;
            if (typeof generate !== 'function') {
                throw new Error(`Route "${route}" must export \`unstable_generateParamMatching\` as a function.`);
            }
            const { filePath } = segment;
            // Retain the module's scope without evaluating user code until static
            // path generation has established its work store and cache context.
            segment.paramMatching = async ()=>validateParamMatchingExport(route, filePath, 'unstable_generateParamMatching', await generate(), visibleParamNames);
        }
    }
}
/**
 * Walks the loader tree and collects the generate parameters for each segment.
 *
 * @param routeModule the app page route module
 * @returns the segments for the app page route module
 */ async function collectAppPageSegments(routeModule, config) {
    // We keep track of unique segments, since with parallel routes, it's possible
    // to see the same segment multiple times.
    const segments = [];
    const segmentTree = [];
    const rootLoaderTree = routeModule.userland.loaderTree;
    // `ensureStatic` needs to be validated against the tree structure,
    // so we cannot compute it easily in `reduceAppConfig` after the tree
    // is turned into an array of segments
    const routeHasPartialPrefetching = ((config == null ? void 0 : config.partialPrefetching) ?? false) || await (0, _instantconfig.anySegmentHasPartialPrefetchingEnabled)(rootLoaderTree);
    const prefetchConfig = routeHasPartialPrefetching ? 'partial' : 'auto';
    const ensureStatic = await (0, _ensurestatic.resolveEnsureStaticConfig)(rootLoaderTree, routeHasPartialPrefetching);
    // Queue will store loader trees.
    const queue = [
        {
            loaderTree: rootLoaderTree,
            visibleParamNames: [],
            parentChildren: segmentTree
        }
    ];
    while(queue.length > 0){
        const { loaderTree, visibleParamNames, parentChildren } = queue.shift();
        const [name, parallelRoutes] = loaderTree;
        // Process current node
        const { mod: userland, filePath } = await (0, _appdirmodule.getLayoutOrPageModule)(loaderTree);
        const isClientComponent = userland && (0, _clientandserverreferences.isClientReference)(userland);
        const param = (0, _getsegmentparam.getSegmentParam)(name);
        const currentVisibleParamNames = param ? [
            ...visibleParamNames,
            param.paramName
        ] : visibleParamNames;
        const segment = {
            name,
            paramName: param == null ? void 0 : param.paramName,
            paramType: param == null ? void 0 : param.paramType,
            filePath,
            config: undefined,
            paramMatching: undefined,
            generateStaticParams: undefined
        };
        // Only server components can have app segment configurations
        if (!isClientComponent) {
            attach(segment, userland, routeModule.definition.pathname, currentVisibleParamNames);
            if (segment.config) {
                segment.config.prefetch = prefetchConfig;
                segment.config.ensureStatic = ensureStatic;
            }
        }
        // If this segment doesn't already exist, then add it to the segments array.
        // The list of segments is short so we just use a list traversal to check
        // for duplicates and spare us needing to maintain the string key.
        if (segments.every((s)=>s.name !== segment.name || s.paramName !== segment.paramName || s.paramType !== segment.paramType || s.filePath !== segment.filePath)) {
            segments.push(segment);
        }
        const children = [];
        parentChildren.push([
            segment,
            children
        ]);
        // Add all parallel routes to the queue
        for (const parallelRoute of Object.values(parallelRoutes)){
            queue.push({
                loaderTree: parallelRoute,
                visibleParamNames: currentVisibleParamNames,
                parentChildren: children
            });
        }
    }
    return {
        segments,
        segmentTree
    };
}
/**
 * Collects the segments for a given app route module.
 *
 * @param routeModule the app route module
 * @returns the segments for the app route module
 */ async function collectAppRouteSegments(routeModule) {
    // The route file may be an async module (top-level await), so the userland
    // module must be resolved before its exports can be inspected.
    await routeModule.ensureUserland();
    // Get the pathname parts, slice off the first element (which is empty).
    const parts = routeModule.definition.pathname.split('/').slice(1);
    if (parts.length === 0) {
        throw new _invarianterror.InvariantError('Expected at least one segment');
    }
    // Generate all the segments.
    const segments = parts.map((name)=>{
        const param = (0, _getsegmentparam.getSegmentParam)(name);
        return {
            name,
            paramName: param == null ? void 0 : param.paramName,
            paramType: param == null ? void 0 : param.paramType,
            filePath: undefined,
            config: undefined,
            paramMatching: undefined,
            generateStaticParams: undefined
        };
    });
    // We know we have at least one, we verified this above. We should get the
    // last segment which represents the root route module.
    const segment = segments[segments.length - 1];
    segment.filePath = routeModule.definition.filename;
    // Extract the segment config from the userland module.
    attach(segment, routeModule.userland, routeModule.definition.pathname, []);
    let segmentTree = [];
    for(let index = segments.length - 1; index >= 0; index--){
        segmentTree = [
            [
                segments[index],
                segmentTree
            ]
        ];
    }
    return {
        segments,
        segmentTree
    };
}
function collectSegments(routeModule, config) {
    if ((0, _checks.isAppRouteRouteModule)(routeModule)) {
        return collectAppRouteSegments(routeModule);
    }
    if ((0, _checks.isAppPageRouteModule)(routeModule)) {
        return collectAppPageSegments(routeModule, config);
    }
    throw new _invarianterror.InvariantError('Expected a route module to be one of app route or page');
}

//# sourceMappingURL=app-segments.js.map