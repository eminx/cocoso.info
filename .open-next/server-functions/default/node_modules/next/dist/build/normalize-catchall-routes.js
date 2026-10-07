"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findIncompatibleParallelRouteSlots: null,
    normalizeCatchAllRoutes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    findIncompatibleParallelRouteSlots: function() {
        return _normalizecatchallroutes.findIncompatibleParallelRouteSlots;
    },
    normalizeCatchAllRoutes: function() {
        return normalizeCatchAllRoutes;
    }
});
const _normalizecatchallroutes = require("../server/lib/router-utils/normalize-catchall-routes");
function normalizeCatchAllRoutes(appPaths, options = {}) {
    return (0, _normalizecatchallroutes.normalizeCatchAllRoutes)(appPaths, undefined, options);
}

//# sourceMappingURL=normalize-catchall-routes.js.map