"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getParamMatchingFallbackMode: null,
    resolveParamMatching: null,
    validateParamMatchingCoherence: null,
    validateParamMatchingParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getParamMatchingFallbackMode: function() {
        return getParamMatchingFallbackMode;
    },
    resolveParamMatching: function() {
        return resolveParamMatching;
    },
    validateParamMatchingCoherence: function() {
        return validateParamMatchingCoherence;
    },
    validateParamMatchingParams: function() {
        return validateParamMatchingParams;
    }
});
const _appsegments = require("../segment-config/app/app-segments");
const _fallback = require("../../lib/fallback");
const _apppaths = require("../../shared/lib/router/utils/app-paths");
const _getsegmentparam = require("../../shared/lib/router/utils/get-segment-param");
async function resolveParamMatching(page, segmentTree, pathnameSegments) {
    const configuredSegments = [];
    const nodes = [
        ...segmentTree
    ];
    for(let index = 0; index < nodes.length; index++){
        const [segment, children] = nodes[index];
        if (segment.paramMatching !== undefined) configuredSegments.push(segment);
        nodes.push(...children);
    }
    if (configuredSegments.length === 0) return undefined;
    const routeParamNames = new Set(pathnameSegments.map(({ paramName })=>paramName));
    const candidates = new Map();
    const paramsMissingPolicy = new Set();
    // Start independent generators together, before merging their results down
    // each branch.
    const fragments = new Map();
    await Promise.all(configuredSegments.map(async (segment)=>{
        const paramMatchingExport = segment.paramMatching;
        const value = typeof paramMatchingExport === 'function' ? await paramMatchingExport() : paramMatchingExport;
        for (const paramName of Object.keys(value)){
            if (!routeParamNames.has(paramName)) {
                const exportName = typeof paramMatchingExport === 'function' ? 'unstable_generateParamMatching' : 'unstable_paramMatching';
                throw new Error(`Invalid parameter "${paramName}" in \`${exportName}\` for "${page}". Parameter matching may only configure dynamic parameters in this route.`);
            }
        }
        fragments.set(segment, value);
    }));
    function visit([segment, children], inherited, paramNames) {
        const branchCandidates = new Map(inherited);
        const fragment = fragments.get(segment);
        if (fragment) {
            for (const [paramName, mode] of Object.entries(fragment)){
                branchCandidates.set(paramName, {
                    mode,
                    filePath: segment.filePath
                });
            }
        }
        if (segment.paramName) paramNames = [
            ...paramNames,
            segment.paramName
        ];
        if (children.length > 0) {
            for (const child of children)visit(child, branchCandidates, paramNames);
            return;
        }
        // Compare the effective policies at every leaf, including leaves without
        // exports. A sibling's override must not erase this branch's inheritance.
        for (const paramName of paramNames){
            if (!branchCandidates.has(paramName)) {
                paramsMissingPolicy.add(paramName);
            }
        }
        for (const [paramName, candidate] of branchCandidates){
            const parallelCandidates = candidates.get(paramName);
            if (!parallelCandidates) {
                candidates.set(paramName, [
                    candidate
                ]);
            } else if (!parallelCandidates.some(({ mode })=>mode === candidate.mode)) {
                parallelCandidates.push(candidate);
            }
        }
    }
    for (const root of segmentTree)visit(root, new Map(), []);
    const policy = {};
    for (const { paramName } of pathnameSegments){
        const paramCandidates = candidates.get(paramName);
        if (!paramCandidates) continue;
        const mode = paramCandidates[0].mode;
        if (paramCandidates.some((candidate)=>candidate.mode !== mode)) {
            const definitions = paramCandidates.map((candidate)=>`${candidate.filePath ?? '<unknown module>'} (${candidate.mode})`).join(', ');
            throw new Error(`Route "${page}" has conflicting parallel parameter matching modes for parameter "${paramName}": ${definitions}.`);
        }
        if (mode === 'not-found' && paramsMissingPolicy.has(paramName)) {
            throw new Error(`Parameter "${paramName}" in route "${page}" uses "not-found" in one parallel branch, but another branch has no explicit policy. Every parallel branch sharing this parameter must explicitly configure "not-found", either directly or through an inherited layout.`);
        }
        policy[paramName] = mode;
    }
    let previousPhase = -1;
    let previousParamName;
    let unconfiguredPrefixParamName;
    for (const { paramName } of pathnameSegments){
        const mode = policy[paramName];
        if (!mode) {
            unconfiguredPrefixParamName ??= paramName;
            continue;
        }
        if (mode === 'not-found' && unconfiguredPrefixParamName !== undefined) {
            throw new Error(`Invalid parameter matching for "${page}": Parameter "${unconfiguredPrefixParamName}" must explicitly configure "not-found" before parameter "${paramName}" uses "not-found". Configure the preceding parameter directly or in an inherited layout; it cannot be closed by inference.`);
        }
        const currentPhase = _appsegments.PARAM_MATCHING_MODES.indexOf(mode);
        if (currentPhase < previousPhase) {
            throw new Error(`Invalid parameter matching for "${page}": parameter "${paramName}" uses "${mode}" after parameter "${previousParamName}" uses a later matching phase. Expected parameters in this order: "not-found", "blocking", "fallback", then "dynamic".`);
        }
        previousPhase = currentPhase;
        previousParamName = paramName;
    }
    return policy;
}
function validateParamMatchingCoherence(paramMatchingByRoute) {
    const parameters = new Map();
    for (const [appPath, paramMatching] of [
        ...paramMatchingByRoute
    ].sort(([a], [b])=>a.localeCompare(b))){
        const route = (0, _apppaths.normalizeAppPath)(appPath);
        let prefix = '';
        for (const segment of route.split('/')){
            if (!segment) continue;
            prefix += `/${segment}`;
            const param = (0, _getsegmentparam.getSegmentParam)(segment);
            if (!param) continue;
            const notFound = (paramMatching == null ? void 0 : paramMatching[param.paramName]) === 'not-found';
            const previous = parameters.get(prefix);
            if (previous === undefined) {
                parameters.set(prefix, [
                    route,
                    notFound
                ]);
            } else if (previous[1] !== notFound) {
                const closedRoute = notFound ? route : previous[0];
                const openRoute = notFound ? previous[0] : route;
                throw new Error(`Parameter "${param.paramName}" at "${prefix}" uses "not-found" in route "${closedRoute}". Route "${openRoute}" must explicitly configure "not-found" for this parameter, either directly or through an inherited layout.`);
            }
        }
    }
}
function getParamMatchingFallbackMode(paramMatching, fallbackRouteParams, inferredFallbackMode, rootParamKeys) {
    let hasInferredBlockingRoot = false;
    for (const { paramName } of fallbackRouteParams){
        switch(paramMatching[paramName]){
            case undefined:
                if (rootParamKeys.has(paramName)) hasInferredBlockingRoot = true;
                break;
            case 'not-found':
                return _fallback.FallbackMode.NOT_FOUND;
            case 'blocking':
                return _fallback.FallbackMode.BLOCKING_STATIC_RENDER;
            case 'fallback':
            case 'dynamic':
                return hasInferredBlockingRoot ? _fallback.FallbackMode.BLOCKING_STATIC_RENDER : _fallback.FallbackMode.PRERENDER;
        }
    }
    // Root parameters retain their existing blocking inference. Keep walking
    // above so a later explicit not-found can still reject the whole match.
    return hasInferredBlockingRoot ? _fallback.FallbackMode.BLOCKING_STATIC_RENDER : inferredFallbackMode;
}
function validateParamMatchingParams(page, paramMatching, generatedParamNames, missingParamNames, pathnameSegments, output) {
    let dynamicParamName;
    for (const { paramName } of pathnameSegments){
        const mode = paramMatching[paramName];
        if (mode === 'dynamic') dynamicParamName = paramName;
        if (dynamicParamName && generatedParamNames.has(paramName)) {
            throw new Error(`Route "${page}" cannot prerender parameter "${paramName}" because parameter "${dynamicParamName}" is configured as "dynamic".`);
        }
        if (mode === 'not-found' && missingParamNames.has(paramName)) {
            throw new Error(`Route "${page}" configures parameter "${paramName}" as "not-found", but generateStaticParams returned a result without that parameter.`);
        }
        if (output === 'export' && mode !== 'not-found') {
            throw new Error(`Route "${page}" must configure parameter "${paramName}" as "not-found" when using parameter matching with "output: export".`);
        }
    }
}

//# sourceMappingURL=param-matching.js.map