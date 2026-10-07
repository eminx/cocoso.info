"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addLocalePrefixToDataRouteRegex: null,
    buildDataRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    addLocalePrefixToDataRouteRegex: function() {
        return addLocalePrefixToDataRouteRegex;
    },
    buildDataRoute: function() {
        return buildDataRoute;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("../../../shared/lib/isomorphic/path"));
const _normalizepagepath = require("../../../shared/lib/page-path/normalize-page-path");
const _isdynamic = require("../../../shared/lib/router/utils/is-dynamic");
const _routeregex = require("../../../shared/lib/router/utils/route-regex");
const _loadcustomroutes = require("../../../lib/load-custom-routes");
const _escaperegexp = require("../../../shared/lib/escape-regexp");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function buildDataRoute(page, buildId) {
    const pagePath = (0, _normalizepagepath.normalizePagePath)(page);
    const dataRoute = _path.default.posix.join('/_next/data', buildId, `${pagePath}.json`);
    let dataRouteRegex;
    let namedDataRouteRegex;
    let routeKeys;
    if ((0, _isdynamic.isDynamicRoute)(page)) {
        const routeRegex = (0, _routeregex.getNamedRouteRegex)(dataRoute, {
            prefixRouteKeys: true,
            includeSuffix: true,
            excludeOptionalTrailingSlash: true
        });
        dataRouteRegex = (0, _loadcustomroutes.normalizeRouteRegex)(routeRegex.re.source);
        namedDataRouteRegex = routeRegex.namedRegex;
        routeKeys = routeRegex.routeKeys;
    } else {
        dataRouteRegex = (0, _loadcustomroutes.normalizeRouteRegex)(new RegExp(`^${_path.default.posix.join('/_next/data', (0, _escaperegexp.escapeStringRegexp)(buildId), `${pagePath}\\.json`)}$`).source);
    }
    return {
        page,
        routeKeys,
        dataRouteRegex,
        namedDataRouteRegex
    };
}
function addLocalePrefixToDataRouteRegex(dataRouteRegex, buildId) {
    // dataRouteRegex escapes static segments, including custom build IDs. Locate
    // the escaped build ID so locale insertion also works for IDs such as "a.b".
    const buildIdSegment = `/${(0, _escaperegexp.escapeStringRegexp)(buildId)}`;
    const buildIdIndex = dataRouteRegex.indexOf(buildIdSegment);
    if (buildIdIndex === -1) {
        return dataRouteRegex;
    }
    const insertIndex = buildIdIndex + buildIdSegment.length;
    return `${dataRouteRegex.slice(0, insertIndex)}/(?:[^/]+?)${dataRouteRegex.slice(insertIndex)}`;
}

//# sourceMappingURL=build-data-route.js.map