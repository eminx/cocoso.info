"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INTERCEPTION_ROUTE_MARKERS: null,
    extractInterceptionRouteInformation: null,
    findMissingCanonicalInterceptionRoutes: null,
    isInterceptionRouteAppPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERCEPTION_ROUTE_MARKERS: function() {
        return INTERCEPTION_ROUTE_MARKERS;
    },
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    },
    findMissingCanonicalInterceptionRoutes: function() {
        return findMissingCanonicalInterceptionRoutes;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    }
});
const _apppaths = require("./app-paths");
const INTERCEPTION_ROUTE_MARKERS = [
    '(..)(..)',
    '(.)',
    '(..)',
    '(...)'
];
function parseRoutePattern(route) {
    const segments = route.split('/').filter(Boolean);
    const tail = segments.at(-1);
    const isOptionalCatchAll = tail !== undefined && tail.startsWith('[[...') && tail.endsWith(']]');
    const isCatchAll = tail !== undefined && tail.startsWith('[...') && tail.endsWith(']');
    const unbounded = isOptionalCatchAll || isCatchAll;
    const prefixSegments = unbounded ? segments.slice(0, -1) : segments;
    return {
        prefix: prefixSegments.map((segment)=>segment.startsWith('[') && segment.endsWith(']') ? null : segment),
        minLength: prefixSegments.length + (isCatchAll && !isOptionalCatchAll ? 1 : 0),
        unbounded
    };
}
function acceptsLength(pattern, length) {
    return pattern.unbounded ? length >= pattern.minLength : length === pattern.minLength;
}
function prefixCovers(canonical, intercepted) {
    return canonical.prefix.every((canonicalSegment, index)=>{
        if (canonicalSegment === null) return true;
        const interceptedSegment = intercepted.prefix[index];
        return interceptedSegment !== undefined && interceptedSegment !== null && canonicalSegment === interceptedSegment;
    });
}
function patternCoversAtLength(canonical, intercepted, length) {
    return acceptsLength(canonical, length) && acceptsLength(intercepted, length) && prefixCovers(canonical, intercepted);
}
/** Returns whether ordinary route patterns cover every URL in `route`. */ function isRoutePatternCovered(route, ordinaryRoutes) {
    const intercepted = parseRoutePattern(route);
    if (!intercepted.unbounded) {
        return ordinaryRoutes.some((pattern)=>patternCoversAtLength(pattern, intercepted, intercepted.minLength));
    }
    let unboundedCoverageStart = Infinity;
    for (const pattern of ordinaryRoutes){
        if (pattern.unbounded && prefixCovers(pattern, intercepted)) {
            unboundedCoverageStart = Math.min(unboundedCoverageStart, Math.max(intercepted.minLength, pattern.minLength));
        }
    }
    if (unboundedCoverageStart === Infinity) return false;
    // An optional or required catchall can have its shorter paths covered by
    // fixed routes before another catchall takes over the remaining suffix.
    for(let length = intercepted.minLength; length < unboundedCoverageStart; length++){
        if (!ordinaryRoutes.some((pattern)=>patternCoversAtLength(pattern, intercepted, length))) {
            return false;
        }
    }
    return true;
}
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split('/').find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute;
    let marker;
    let interceptedRoute;
    for (const segment of path.split('/')){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            ;
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`);
    }
    interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case '(.)':
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === '/') {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + '/' + interceptedRoute;
            }
            break;
        case '(..)':
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === '/') {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`);
            }
            interceptedRoute = interceptingRoute.split('/').slice(0, -1).concat(interceptedRoute).join('/');
            break;
        case '(...)':
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = '/' + interceptedRoute;
            break;
        case '(..)(..)':
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split('/');
            if (splitInterceptingRoute.length <= 2) {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`);
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join('/');
            break;
        default:
            throw new Error('Invariant: unexpected marker');
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
}
function findMissingCanonicalInterceptionRoutes(appPaths) {
    const canonicalRoutes = Object.keys(appPaths).filter((route)=>!isInterceptionRouteAppPath(route));
    const canonicalRoutePatterns = canonicalRoutes.map(parseRoutePattern);
    return Object.keys(appPaths).filter(isInterceptionRouteAppPath).map((interceptionRoute)=>({
            interceptionRoute,
            canonicalRoute: extractInterceptionRouteInformation(interceptionRoute).interceptedRoute
        })).filter(({ canonicalRoute })=>!isRoutePatternCovered(canonicalRoute, canonicalRoutePatterns)).sort((a, b)=>a.interceptionRoute.localeCompare(b.interceptionRoute));
}

//# sourceMappingURL=interception-routes.js.map