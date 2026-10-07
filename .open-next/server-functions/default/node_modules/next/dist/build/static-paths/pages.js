"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildPagesStaticPaths", {
    enumerable: true,
    get: function() {
        return buildPagesStaticPaths;
    }
});
const _normalizelocalepath = require("../../shared/lib/i18n/normalize-locale-path");
const _fallback = require("../../lib/fallback");
const _escapepathdelimiters = /*#__PURE__*/ _interop_require_default(require("../../shared/lib/router/utils/escape-path-delimiters"));
const _removetrailingslash = require("../../shared/lib/router/utils/remove-trailing-slash");
const _routematcher = require("../../shared/lib/router/utils/route-matcher");
const _routeregex = require("../../shared/lib/router/utils/route-regex");
const _utils = require("./utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function buildPagesStaticPaths({ page, getStaticPaths, configFileName, locales, defaultLocale }) {
    const prerenderedRoutesByPathname = new Map();
    const _routeRegex = (0, _routeregex.getRouteRegex)(page);
    const _routeMatcher = (0, _routematcher.getRouteMatcher)(_routeRegex);
    // Get the default list of allowed params.
    const routeParameterKeys = Object.keys(_routeMatcher(page));
    const staticPathsResult = await getStaticPaths({
        // We create a copy here to avoid having the types of `getStaticPaths`
        // change. This ensures that users can't mutate this array and have it
        // poison the reference.
        locales: [
            ...locales ?? []
        ],
        defaultLocale
    });
    const expectedReturnVal = `Expected: { paths: [], fallback: boolean }\n` + `See here for more info: https://nextjs.org/docs/messages/invalid-getstaticpaths-value`;
    if (!staticPathsResult || typeof staticPathsResult !== 'object' || Array.isArray(staticPathsResult)) {
        throw new Error(`Invalid value returned from getStaticPaths in ${page}. Received ${typeof staticPathsResult} ${expectedReturnVal}`);
    }
    const invalidStaticPathKeys = Object.keys(staticPathsResult).filter((key)=>!(key === 'paths' || key === 'fallback'));
    if (invalidStaticPathKeys.length > 0) {
        throw new Error(`Extra keys returned from getStaticPaths in ${page} (${invalidStaticPathKeys.join(', ')}) ${expectedReturnVal}`);
    }
    if (!(typeof staticPathsResult.fallback === 'boolean' || staticPathsResult.fallback === 'blocking')) {
        throw new Error(`The \`fallback\` key must be returned from getStaticPaths in ${page}.\n` + expectedReturnVal);
    }
    const toPrerender = staticPathsResult.paths;
    if (!Array.isArray(toPrerender)) {
        throw new Error(`Invalid \`paths\` value returned from getStaticPaths in ${page}.\n` + `\`paths\` must be an array of strings or objects of shape { params: [key: string]: string }`);
    }
    toPrerender.forEach((entry)=>{
        // For a string-provided path, we must make sure it matches the dynamic
        // route.
        if (typeof entry === 'string') {
            entry = (0, _removetrailingslash.removeTrailingSlash)(entry);
            const localePathResult = (0, _normalizelocalepath.normalizeLocalePath)(entry, locales);
            let cleanedEntry = entry;
            if (localePathResult.detectedLocale) {
                cleanedEntry = entry.slice(localePathResult.detectedLocale.length + 1);
            } else if (defaultLocale) {
                entry = `/${defaultLocale}${entry}`;
            }
            const params = _routeMatcher(cleanedEntry);
            if (!params) {
                throw new Error(`The provided path \`${cleanedEntry}\` does not match the page: \`${page}\`.`);
            }
            // If leveraging the string paths variant the entry should already be
            // encoded so we decode the segments ensuring we only escape path
            // delimiters
            const pathname = entry.split('/').map((segment)=>(0, _escapepathdelimiters.default)(decodeURIComponent(segment), true)).join('/');
            if (!prerenderedRoutesByPathname.has(pathname)) {
                prerenderedRoutesByPathname.set(pathname, {
                    params,
                    pathname,
                    encodedPathname: entry,
                    fallbackRouteParams: undefined,
                    fallbackMode: (0, _fallback.parseStaticPathsResult)(staticPathsResult.fallback),
                    fallbackRootParams: undefined,
                    throwOnEmptyStaticShell: undefined
                });
            }
        } else {
            const invalidKeys = Object.keys(entry).filter((key)=>key !== 'params' && key !== 'locale');
            if (invalidKeys.length) {
                throw new Error(`Additional keys were returned from \`getStaticPaths\` in page "${page}". ` + `URL Parameters intended for this dynamic route must be nested under the \`params\` key, i.e.:` + `\n\n\treturn { params: { ${routeParameterKeys.map((k)=>`${k}: ...`).join(', ')} } }` + `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.\n`);
            }
            const { params = {} } = entry;
            let builtPage = page;
            let encodedBuiltPage = page;
            routeParameterKeys.forEach((validParamKey)=>{
                const { repeat, optional } = _routeRegex.groups[validParamKey];
                let paramValue = params[validParamKey];
                if (optional && params.hasOwnProperty(validParamKey) && (paramValue === null || paramValue === undefined || paramValue === false)) {
                    paramValue = [];
                }
                if (repeat && !Array.isArray(paramValue) || !repeat && typeof paramValue !== 'string' || typeof paramValue === 'undefined') {
                    throw new Error(`A required parameter (${validParamKey}) was not provided as ${repeat ? 'an array' : 'a string'} received ${typeof paramValue} in getStaticPaths for ${page}`);
                }
                let replaced = `[${repeat ? '...' : ''}${validParamKey}]`;
                if (optional) {
                    replaced = `[${replaced}]`;
                }
                builtPage = builtPage.replace(replaced, (0, _utils.encodeParam)(paramValue, (value)=>(0, _escapepathdelimiters.default)(value, true)));
                encodedBuiltPage = encodedBuiltPage.replace(replaced, (0, _utils.encodeParam)(paramValue, encodeURIComponent));
            });
            if (!builtPage && !encodedBuiltPage) {
                return;
            }
            if (entry.locale && !(locales == null ? void 0 : locales.includes(entry.locale))) {
                throw new Error(`Invalid locale returned from getStaticPaths for ${page}, the locale ${entry.locale} is not specified in ${configFileName}`);
            }
            const curLocale = entry.locale || defaultLocale || '';
            const pathname = (0, _utils.normalizePathname)(`${curLocale ? `/${curLocale}` : ''}${curLocale && builtPage === '/' ? '' : builtPage}`);
            if (!prerenderedRoutesByPathname.has(pathname)) {
                prerenderedRoutesByPathname.set(pathname, {
                    params,
                    pathname,
                    encodedPathname: (0, _utils.normalizePathname)(`${curLocale ? `/${curLocale}` : ''}${curLocale && encodedBuiltPage === '/' ? '' : encodedBuiltPage}`),
                    fallbackRouteParams: undefined,
                    fallbackMode: (0, _fallback.parseStaticPathsResult)(staticPathsResult.fallback),
                    fallbackRootParams: undefined,
                    throwOnEmptyStaticShell: undefined
                });
            }
        }
    });
    return {
        fallbackMode: (0, _fallback.parseStaticPathsResult)(staticPathsResult.fallback),
        prerenderedRoutes: [
            ...prerenderedRoutesByPathname.values()
        ]
    };
}

//# sourceMappingURL=pages.js.map