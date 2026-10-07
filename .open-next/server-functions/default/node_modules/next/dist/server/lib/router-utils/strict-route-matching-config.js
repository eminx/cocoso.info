"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    STRICT_ROUTE_MATCHING_DEFAULT_WARNING: null,
    getStrictRouteMatchingDefaultWarning: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    STRICT_ROUTE_MATCHING_DEFAULT_WARNING: function() {
        return STRICT_ROUTE_MATCHING_DEFAULT_WARNING;
    },
    getStrictRouteMatchingDefaultWarning: function() {
        return getStrictRouteMatchingDefaultWarning;
    }
});
const STRICT_ROUTE_MATCHING_DEFAULT_WARNING = "Strict route matching is enabled by default. This validation indicates a bug in your app's route structure, but you can temporarily restore loose route matching by setting `deprecated.looseRouteMatching` to `true` in your Next.js config.";
function getStrictRouteMatchingDefaultWarning(config) {
    return config.experimental.strictRouteMatching ? STRICT_ROUTE_MATCHING_DEFAULT_WARNING : undefined;
}

//# sourceMappingURL=strict-route-matching-config.js.map