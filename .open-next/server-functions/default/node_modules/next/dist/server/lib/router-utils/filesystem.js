"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    buildCustomRoute: null,
    setupFsCheck: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    buildCustomRoute: function() {
        return buildCustomRoute;
    },
    setupFsCheck: function() {
        return setupFsCheck;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _promises = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../../../build/output/log"));
const _debug = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/debug"));
const _lrucache = require("../lru-cache");
const _loadcustomroutes = /*#__PURE__*/ _interop_require_default(require("../../../lib/load-custom-routes"));
const _redirectstatus = require("../../../lib/redirect-status");
const _isapiroute = require("../../../lib/is-api-route");
const _isapppageroute = require("../../../lib/is-app-page-route");
const _isapprouteroute = require("../../../lib/is-app-route-route");
const _fileexists = require("../../../lib/file-exists");
const _recursivereaddir = require("../../../lib/recursive-readdir");
const _builddataroute = require("./build-data-route");
const _utils = require("../../../shared/lib/router/utils");
const _pathmatch = require("../../../shared/lib/router/utils/path-match");
const _routeregex = require("../../../shared/lib/router/utils/route-regex");
const _routematcher = require("../../../shared/lib/router/utils/route-matcher");
const _pathhasprefix = require("../../../shared/lib/router/utils/path-has-prefix");
const _normalizelocalepath = require("../../../shared/lib/i18n/normalize-locale-path");
const _removepathprefix = require("../../../shared/lib/router/utils/remove-path-prefix");
const _middlewareroutematcher = require("../../../shared/lib/router/utils/middleware-route-matcher");
const _utils1 = require("../../../shared/lib/utils");
const _constants = require("../../../shared/lib/constants");
const _normalizepathsep = require("../../../shared/lib/page-path/normalize-path-sep");
const _getmetadataroute = require("../../../lib/metadata/get-metadata-route");
const _rsc = require("../../normalizers/request/rsc");
const _encodeuripath = require("../../../shared/lib/encode-uri-path");
const _ismetadataroute = require("../../../lib/metadata/is-metadata-route");
const _pages = require("../../normalizers/built/pages");
const _app = require("../../normalizers/built/app");
const _routekind = require("../../route-kind");
const _apppageroutedefinition = require("../../route-definitions/app-page-route-definition");
const _apppaths = require("../../../shared/lib/router/utils/app-paths");
const _normalizecatchallroutes = require("./normalize-catchall-routes");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const debug = (0, _debug.default)('next:router-server:filesystem');
const buildFilesystemDynamicRoute = (page)=>{
    const routeRegex = (0, _routeregex.getNamedRouteRegex)(page, {
        prefixRouteKeys: true,
        includePrefix: true,
        includeSuffix: true
    });
    return {
        regex: routeRegex.re.toString(),
        namedRegex: routeRegex.namedRegex,
        routeKeys: routeRegex.routeKeys,
        match: (0, _routematcher.getRouteMatcher)(routeRegex),
        page
    };
};
const sortDynamicRoutes = (routes)=>{
    const references = new Map();
    const pages = [];
    for (const route of routes){
        const existing = references.get(route.page);
        if (existing) {
            existing.push(route);
        } else {
            references.set(route.page, [
                route
            ]);
            pages.push(route.page);
        }
    }
    return (0, _utils.getSortedRoutes)(pages).flatMap((page)=>references.get(page));
};
const buildCustomRoute = (type, item, basePath, caseSensitive)=>{
    const restrictedRedirectPaths = [
        '/_next'
    ].map((p)=>basePath ? `${basePath}${p}` : p);
    let builtRegex = '';
    const match = (0, _pathmatch.getPathMatch)(item.source, {
        strict: true,
        removeUnnamedParams: true,
        regexModifier: (regex)=>{
            if (!item.internal) {
                regex = (0, _redirectstatus.modifyRouteRegex)(regex, type === 'redirect' ? restrictedRedirectPaths : undefined);
            }
            builtRegex = regex;
            return builtRegex;
        },
        sensitive: caseSensitive
    });
    return {
        ...item,
        regex: builtRegex,
        ...type === 'rewrite' ? {
            check: true
        } : {},
        match
    };
};
// Measured retained cost of a cache entry beyond its strings (LRUNode,
// Map slot, string header): ~120 bytes. Counting it keeps the entry count
// bounded even when keys are short, so the budget approximates retained
// bytes.
const FS_LRU_ENTRY_OVERHEAD = 128;
const FS_LRU_MAX_SIZE = 8 * 1024 * 1024;
// The pathname passed to getItem is usually a V8 slice of the full request
// URL, and a sliced string retains its parent — including the query string —
// for as long as the cache holds the key. Store a flat copy instead.
// The JSON round-trip returns an equal string for every input (unlike a
// Buffer round-trip, which replaces lone surrogates), so distinct keys can
// never collide on the stored copy.
function flatKeyCopy(key) {
    return JSON.parse(JSON.stringify(key));
}
// Cached result for paths that resolve to nothing. Not null, so that a
// cached miss can't be conflated with an uncached key (undefined).
const notFound = Symbol('not-found');
async function setupFsCheck(opts) {
    const getItemsLru = !opts.dev ? new _lrucache.LRUCache(FS_LRU_MAX_SIZE, function length(value, key) {
        const size = FS_LRU_ENTRY_OVERHEAD + key.length;
        if (value === notFound) {
            // Negative cache entries only retain their key.
            return size;
        }
        return size + (value.fsPath || '').length + value.itemPath.length + value.type.length;
    }) : undefined;
    // routes that have _next/data endpoints (SSG/SSP)
    const nextDataRoutes = new Set();
    const publicFolderItems = new Set();
    const nextStaticFolderItems = new Set();
    const legacyStaticFolderItems = new Set();
    const appFiles = new Set();
    const pageFiles = new Set();
    // Map normalized path to the file path. This is essential
    // for parallel and group routes as their original path
    // cannot be restored from the request path.
    // Example:
    // [normalized-path] -> [file-path]
    // /icon-<hash>.png -> .../app/@parallel/icon.png
    // /icon-<hash>.png -> .../app/(group)/icon.png
    // /icon.png -> .../app/icon.png
    const staticMetadataFiles = new Map();
    let dynamicRoutes = [];
    // Page and app outputs need route metadata for compilation and rendering.
    // Static assets remain plain filesystem matches.
    const routeDefinitions = {
        appFile: new Map(),
        pageFile: new Map()
    };
    let middlewareMatcher = ()=>false;
    const distDir = _path.default.join(opts.dir, opts.config.distDir);
    const publicFolderPath = _path.default.join(opts.dir, 'public');
    const nextStaticFolderPath = _path.default.join(distDir, 'static');
    const legacyStaticFolderPath = _path.default.join(opts.dir, 'static');
    let customRoutes = {
        redirects: [],
        rewrites: {
            beforeFiles: [],
            afterFiles: [],
            fallback: []
        },
        onMatchHeaders: [],
        headers: []
    };
    let buildId = 'development';
    let previewProps;
    const setRouteDefinition = (type, pathname, definition)=>{
        const definitions = routeDefinitions[type].get(pathname);
        if (definitions) {
            definitions.push(definition);
        } else {
            routeDefinitions[type].set(pathname, [
                definition
            ]);
        }
    };
    const getRouteDefinition = (type, itemPath, locale)=>{
        const definitions = routeDefinitions[type].get(itemPath);
        if (!(definitions == null ? void 0 : definitions.length)) return undefined;
        if (type === 'pageFile') {
            return definitions.find((definition)=>{
                var _definition_i18n;
                return ((_definition_i18n = definition.i18n) == null ? void 0 : _definition_i18n.locale) === locale;
            }) ?? definitions.find((definition)=>{
                var _definition_i18n;
                return !((_definition_i18n = definition.i18n) == null ? void 0 : _definition_i18n.locale);
            }) ?? definitions[0];
        }
        return definitions[0];
    };
    const pagesNormalizers = new _pages.PagesNormalizers(distDir);
    const appNormalizers = new _app.AppNormalizers(distDir);
    if (!opts.dev) {
        var _middlewareManifest_middleware_, _middlewareManifest_middleware;
        const buildIdPath = _path.default.join(opts.dir, opts.config.distDir, _constants.BUILD_ID_FILE);
        try {
            buildId = await _promises.default.readFile(buildIdPath, 'utf8');
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
            throw new Error(`Could not find a production build in the '${opts.config.distDir}' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id`);
        }
        try {
            for (const file of (await (0, _recursivereaddir.recursiveReadDir)(publicFolderPath))){
                // Ensure filename is encoded and normalized.
                publicFolderItems.add((0, _encodeuripath.encodeURIPath)((0, _normalizepathsep.normalizePathSep)(file)));
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        try {
            for (const file of (await (0, _recursivereaddir.recursiveReadDir)(legacyStaticFolderPath))){
                // Ensure filename is encoded and normalized.
                legacyStaticFolderItems.add((0, _encodeuripath.encodeURIPath)((0, _normalizepathsep.normalizePathSep)(file)));
            }
            _log.warn(`The static directory has been deprecated in favor of the public directory. https://nextjs.org/docs/messages/static-dir-deprecated`);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        try {
            for (const file of (await (0, _recursivereaddir.recursiveReadDir)(nextStaticFolderPath))){
                // Ensure filename is encoded and normalized.
                nextStaticFolderItems.add(_path.default.posix.join('/_next/static', (0, _encodeuripath.encodeURIPath)((0, _normalizepathsep.normalizePathSep)(file))));
            }
        } catch (err) {
            if (opts.config.output !== 'standalone') throw err;
        }
        const routesManifestPath = _path.default.join(distDir, _constants.ROUTES_MANIFEST);
        const previewPropsManifestPath = _path.default.join(distDir, 'server', _constants.PREVIEW_PROPS_MANIFEST);
        const middlewareManifestPath = _path.default.join(distDir, 'server', _constants.MIDDLEWARE_MANIFEST);
        const functionsConfigManifestPath = _path.default.join(distDir, 'server', _constants.FUNCTIONS_CONFIG_MANIFEST);
        const pagesManifestPath = _path.default.join(distDir, 'server', _constants.PAGES_MANIFEST);
        const appPathsManifestPath = _path.default.join(distDir, 'server', _constants.APP_PATHS_MANIFEST);
        const appRoutesManifestPath = _path.default.join(distDir, _constants.APP_PATH_ROUTES_MANIFEST);
        const routesManifest = JSON.parse(await _promises.default.readFile(routesManifestPath, 'utf8'));
        previewProps = JSON.parse(await _promises.default.readFile(previewPropsManifestPath, 'utf8'));
        const middlewareManifest = JSON.parse(await _promises.default.readFile(middlewareManifestPath, 'utf8').catch(()=>'{}'));
        const functionsConfigManifest = JSON.parse(await _promises.default.readFile(functionsConfigManifestPath, 'utf8').catch(()=>'{}'));
        const pagesManifest = JSON.parse(await _promises.default.readFile(pagesManifestPath, 'utf8'));
        const appPathsManifest = JSON.parse(await _promises.default.readFile(appPathsManifestPath, 'utf8').catch(()=>'{}'));
        const appRoutesManifest = JSON.parse(await _promises.default.readFile(appRoutesManifestPath, 'utf8').catch(()=>'{}'));
        const appDynamicRoutes = [];
        const appDynamicRoutePathnames = new Set();
        const addAppDynamicRoute = (pathname)=>{
            if (!(0, _utils.isDynamicRoute)(pathname) || appDynamicRoutePathnames.has(pathname)) {
                return;
            }
            appDynamicRoutePathnames.add(pathname);
            appDynamicRoutes.push(buildFilesystemDynamicRoute(pathname));
        };
        for (const key of Object.keys(pagesManifest)){
            const localeResult = opts.config.i18n ? (0, _normalizelocalepath.normalizeLocalePath)(key, opts.config.i18n.locales) : {
                pathname: key,
                detectedLocale: undefined
            };
            // ensure the non-locale version is in the set
            if (opts.config.i18n) {
                pageFiles.add(localeResult.pathname);
            } else {
                pageFiles.add(key);
            }
            if (!(0, _isapiroute.isAPIRoute)(key) && _constants.BLOCKED_PAGES.includes(localeResult.pathname)) {
                continue;
            }
            setRouteDefinition('pageFile', localeResult.pathname, {
                kind: (0, _isapiroute.isAPIRoute)(key) ? _routekind.RouteKind.PAGES_API : _routekind.RouteKind.PAGES,
                pathname: localeResult.pathname,
                page: key,
                bundlePath: pagesNormalizers.bundlePath.normalize(key),
                filename: pagesNormalizers.filename.normalize(pagesManifest[key]),
                ...opts.config.i18n ? {
                    i18n: {
                        locale: localeResult.detectedLocale
                    }
                } : undefined
            });
        }
        for (const key of Object.keys(appRoutesManifest)){
            appFiles.add(appRoutesManifest[key]);
        }
        const appPages = Object.keys(appPathsManifest).filter((page)=>(0, _isapppageroute.isAppPageRoute)(page));
        const allAppPaths = {};
        for (const page of appPages){
            const pathname = appNormalizers.pathname.normalize(page);
            if (pathname in allAppPaths) allAppPaths[pathname].push(page);
            else allAppPaths[pathname] = [
                page
            ];
        }
        (0, _normalizecatchallroutes.normalizeCatchAllRoutes)(allAppPaths, appNormalizers.pathname);
        for (const [pathname, appPaths] of Object.entries(allAppPaths)){
            // Keep manifest order aligned with the module packaged for this route.
            const page = (0, _apppaths.selectAppPageEntry)(pathname, appPaths, (appPath)=>appNormalizers.pathname.normalize(appPath));
            setRouteDefinition('appFile', pathname, {
                kind: _routekind.RouteKind.APP_PAGE,
                pathname,
                page,
                bundlePath: appNormalizers.bundlePath.normalize(page),
                filename: appNormalizers.filename.normalize(appPathsManifest[page]),
                appPaths
            });
            addAppDynamicRoute(pathname);
        }
        const appRouteHandlers = Object.keys(appPathsManifest).filter((page)=>(0, _isapprouteroute.isAppRouteRoute)(page));
        for (const page of appRouteHandlers){
            const pathname = appNormalizers.pathname.normalize(page);
            setRouteDefinition('appFile', pathname, {
                kind: _routekind.RouteKind.APP_ROUTE,
                pathname,
                page,
                bundlePath: appNormalizers.bundlePath.normalize(page),
                filename: appNormalizers.filename.normalize(appPathsManifest[page])
            });
            addAppDynamicRoute(pathname);
        }
        for (const route of routesManifest.dataRoutes){
            if ((0, _utils.isDynamicRoute)(route.page)) {
                const routeRegex = (0, _routeregex.getNamedRouteRegex)(route.page, {
                    prefixRouteKeys: true
                });
                dynamicRoutes.push({
                    ...route,
                    regex: routeRegex.re.toString(),
                    namedRegex: routeRegex.namedRegex,
                    routeKeys: routeRegex.routeKeys,
                    match: (0, _routematcher.getRouteMatcher)({
                        // TODO: fix this in the manifest itself, must also be fixed in
                        // upstream builder that relies on this
                        re: opts.config.i18n ? new RegExp((0, _builddataroute.addLocalePrefixToDataRouteRegex)(route.dataRouteRegex, buildId)) : new RegExp(route.dataRouteRegex),
                        groups: routeRegex.groups
                    })
                });
            }
            nextDataRoutes.add(route.page);
        }
        const filesystemDynamicRoutes = [
            ...appDynamicRoutes
        ];
        for (const route of routesManifest.dynamicRoutes){
            // If a route is marked as skipInternalRouting, it's not for the internal
            // router, and instead has been added to support external routers.
            if (route.skipInternalRouting) {
                continue;
            }
            filesystemDynamicRoutes.push({
                ...route,
                ...buildFilesystemDynamicRoute(route.page)
            });
        }
        dynamicRoutes.push(...sortDynamicRoutes(filesystemDynamicRoutes));
        if ((_middlewareManifest_middleware = middlewareManifest.middleware) == null ? void 0 : (_middlewareManifest_middleware_ = _middlewareManifest_middleware['/']) == null ? void 0 : _middlewareManifest_middleware_.matchers) {
            var _middlewareManifest_middleware_1, _middlewareManifest_middleware1;
            middlewareMatcher = (0, _middlewareroutematcher.getMiddlewareRouteMatcher)((_middlewareManifest_middleware1 = middlewareManifest.middleware) == null ? void 0 : (_middlewareManifest_middleware_1 = _middlewareManifest_middleware1['/']) == null ? void 0 : _middlewareManifest_middleware_1.matchers);
        } else if (functionsConfigManifest == null ? void 0 : functionsConfigManifest.functions['/_middleware']) {
            middlewareMatcher = (0, _middlewareroutematcher.getMiddlewareRouteMatcher)(functionsConfigManifest.functions['/_middleware'].matchers ?? [
                {
                    regexp: '.*',
                    originalSource: '/:path*'
                }
            ]);
        }
        customRoutes = {
            redirects: routesManifest.redirects,
            rewrites: routesManifest.rewrites ? Array.isArray(routesManifest.rewrites) ? {
                beforeFiles: [],
                afterFiles: routesManifest.rewrites,
                fallback: []
            } : routesManifest.rewrites : {
                beforeFiles: [],
                afterFiles: [],
                fallback: []
            },
            headers: routesManifest.headers,
            onMatchHeaders: routesManifest.onMatchHeaders
        };
    } else {
        // dev handling
        customRoutes = await (0, _loadcustomroutes.default)(opts.config);
        previewProps = {
            previewModeId: require('crypto').randomBytes(16).toString('hex'),
            previewModeSigningKey: require('crypto').randomBytes(32).toString('hex'),
            previewModeEncryptionKey: require('crypto').randomBytes(32).toString('hex')
        };
    }
    const headers = customRoutes.headers.map((item)=>buildCustomRoute('header', item, opts.config.basePath, opts.config.experimental.caseSensitiveRoutes));
    const onMatchHeaders = customRoutes.onMatchHeaders.map((item)=>buildCustomRoute('header', item, opts.config.basePath, opts.config.experimental.caseSensitiveRoutes));
    const redirects = customRoutes.redirects.map((item)=>buildCustomRoute('redirect', item, opts.config.basePath, opts.config.experimental.caseSensitiveRoutes));
    const rewrites = {
        beforeFiles: customRoutes.rewrites.beforeFiles.map((item)=>buildCustomRoute('before_files_rewrite', item)),
        afterFiles: customRoutes.rewrites.afterFiles.map((item)=>buildCustomRoute('rewrite', item, opts.config.basePath, opts.config.experimental.caseSensitiveRoutes)),
        fallback: customRoutes.rewrites.fallback.map((item)=>buildCustomRoute('rewrite', item, opts.config.basePath, opts.config.experimental.caseSensitiveRoutes))
    };
    const { i18n } = opts.config;
    const handleLocale = (pathname, locales)=>{
        let locale;
        if (i18n) {
            const i18nResult = (0, _normalizelocalepath.normalizeLocalePath)(pathname, locales || i18n.locales);
            pathname = i18nResult.pathname;
            locale = i18nResult.detectedLocale;
        }
        return {
            locale,
            pathname
        };
    };
    debug('nextDataRoutes', nextDataRoutes);
    debug('dynamicRoutes', dynamicRoutes);
    debug('customRoutes', customRoutes);
    debug('publicFolderItems', publicFolderItems);
    debug('nextStaticFolderItems', nextStaticFolderItems);
    debug('pageFiles', pageFiles);
    debug('appFiles', appFiles);
    let ensureFn;
    const normalizers = {
        // Because we can't know if the app directory is enabled or not at this
        // stage, we assume that it is.
        rsc: new _rsc.RSCPathnameNormalizer()
    };
    return {
        headers,
        onMatchHeaders,
        rewrites,
        redirects,
        buildId,
        handleLocale,
        appFiles,
        pageFiles,
        staticMetadataFiles,
        dynamicRoutes,
        nextDataRoutes,
        setRouteDefinitions (type, definitions) {
            routeDefinitions[type].clear();
            for (const definition of definitions){
                setRouteDefinition(type, definition.pathname, definition);
            }
        },
        getRouteDefinition,
        exportPathMapRoutes: undefined,
        devVirtualFsItems: new Set(),
        previewProps,
        middlewareMatcher: middlewareMatcher,
        ensureCallback (fn) {
            ensureFn = fn;
        },
        async getItem (itemPath, requestPath) {
            const originalItemPath = itemPath;
            const itemKey = originalItemPath;
            const lruResult = getItemsLru == null ? void 0 : getItemsLru.get(itemKey);
            if (lruResult !== undefined) {
                return lruResult === notFound ? null : lruResult;
            }
            const { basePath } = opts.config;
            const hasBasePath = (0, _pathhasprefix.pathHasPrefix)(itemPath, basePath);
            // Return null if path doesn't start with basePath
            if (basePath && !hasBasePath) {
                return null;
            }
            // Remove basePath if it exists.
            if (basePath && hasBasePath) {
                itemPath = (0, _removepathprefix.removePathPrefix)(itemPath, basePath) || '/';
            }
            // Simulate minimal mode requests by normalizing RSC and postponed
            // requests.
            if (opts.minimalMode) {
                if (normalizers.rsc.match(itemPath)) {
                    itemPath = normalizers.rsc.normalize(itemPath, true);
                }
            }
            if (itemPath !== '/' && itemPath.endsWith('/')) {
                itemPath = itemPath.substring(0, itemPath.length - 1);
            }
            let decodedItemPath = itemPath;
            try {
                decodedItemPath = decodeURIComponent(itemPath);
            } catch  {}
            if (itemPath === '/_next/image') {
                return {
                    itemPath,
                    type: 'nextImage'
                };
            }
            if (opts.dev && (0, _ismetadataroute.isMetadataRouteFile)(itemPath, [], false)) {
                const fsPath = staticMetadataFiles.get(itemPath);
                if (fsPath) {
                    return {
                        // "nextStaticFolder" sets Cache-Control
                        // "no-cache, must-revalidate" on dev.
                        type: 'nextStaticFolder',
                        fsPath,
                        itemPath: fsPath
                    };
                }
            }
            const itemsToCheck = [
                [
                    this.devVirtualFsItems,
                    'devVirtualFsItem'
                ],
                [
                    nextStaticFolderItems,
                    'nextStaticFolder'
                ],
                [
                    legacyStaticFolderItems,
                    'legacyStaticFolder'
                ],
                [
                    publicFolderItems,
                    'publicFolder'
                ],
                [
                    appFiles,
                    'appFile'
                ],
                [
                    pageFiles,
                    'pageFile'
                ]
            ];
            for (let [items, type] of itemsToCheck){
                let locale;
                let curItemPath = itemPath;
                let curDecodedItemPath = decodedItemPath;
                const isPageOrAppFile = type === 'pageFile' || type === 'appFile';
                if (i18n) {
                    var _i18n_domains;
                    const localeResult = handleLocale(itemPath, // legacy behavior allows visiting static assets under
                    // default locale but no other locale
                    isPageOrAppFile ? undefined : [
                        i18n == null ? void 0 : i18n.defaultLocale,
                        // default locales from domains need to be matched too
                        ...((_i18n_domains = i18n.domains) == null ? void 0 : _i18n_domains.map((item)=>item.defaultLocale)) || []
                    ]);
                    if (localeResult.pathname !== curItemPath) {
                        curItemPath = localeResult.pathname;
                        locale = localeResult.locale;
                        try {
                            curDecodedItemPath = decodeURIComponent(curItemPath);
                        } catch  {}
                    }
                }
                if (type === 'legacyStaticFolder') {
                    if (!(0, _pathhasprefix.pathHasPrefix)(curItemPath, '/static')) {
                        continue;
                    }
                    curItemPath = curItemPath.substring('/static'.length);
                    try {
                        curDecodedItemPath = decodeURIComponent(curItemPath);
                    } catch  {}
                }
                if (type === 'nextStaticFolder' && !(0, _pathhasprefix.pathHasPrefix)(curItemPath, '/_next/static')) {
                    continue;
                }
                const nextDataPrefix = `/_next/data/${buildId}/`;
                if (type === 'pageFile' && curItemPath.startsWith(nextDataPrefix) && curItemPath.endsWith('.json')) {
                    items = nextDataRoutes;
                    // remove _next/data/<build-id> prefix
                    curItemPath = curItemPath.substring(nextDataPrefix.length - 1);
                    // remove .json postfix
                    curItemPath = curItemPath.substring(0, curItemPath.length - '.json'.length);
                    const curLocaleResult = handleLocale(curItemPath);
                    curItemPath = curLocaleResult.pathname === '/index' ? '/' : curLocaleResult.pathname;
                    locale = curLocaleResult.locale;
                    try {
                        curDecodedItemPath = decodeURIComponent(curItemPath);
                    } catch  {}
                }
                // Only page and app outputs participate in route rendering. Public,
                // static, image, and virtual outputs are served as filesystem assets.
                const route = isPageOrAppFile ? getRouteDefinition(type, curItemPath, locale) : undefined;
                let matchedItem = items.has(curItemPath);
                // check decoded variant as well
                if (!matchedItem && !opts.dev) {
                    matchedItem = items.has(curDecodedItemPath);
                    if (matchedItem) curItemPath = curDecodedItemPath;
                    else {
                        // x-ref: https://github.com/vercel/next.js/issues/54008
                        // There're cases that urls get decoded before requests, we should support both encoded and decoded ones.
                        // e.g. nginx could decode the proxy urls, the below ones should be treated as the same:
                        // decoded version: `/_next/static/chunks/pages/blog/[slug]-d4858831b91b69f6.js`
                        // encoded version: `/_next/static/chunks/pages/blog/%5Bslug%5D-d4858831b91b69f6.js`
                        try {
                            // encode the special characters in the path and retrieve again to determine if path exists.
                            const encodedCurItemPath = (0, _encodeuripath.encodeURIPath)(curItemPath);
                            matchedItem = items.has(encodedCurItemPath);
                        } catch  {}
                    }
                }
                if (matchedItem || opts.dev) {
                    let fsPath;
                    let itemsRoot;
                    switch(type){
                        case 'nextStaticFolder':
                            {
                                itemsRoot = nextStaticFolderPath;
                                curItemPath = curItemPath.substring('/_next/static'.length);
                                break;
                            }
                        case 'legacyStaticFolder':
                            {
                                itemsRoot = legacyStaticFolderPath;
                                break;
                            }
                        case 'publicFolder':
                            {
                                itemsRoot = publicFolderPath;
                                break;
                            }
                        case 'appFile':
                        case 'pageFile':
                        case 'nextImage':
                        case 'devVirtualFsItem':
                            {
                                break;
                            }
                        default:
                            {
                                ;
                                type;
                            }
                    }
                    if (itemsRoot && curItemPath) {
                        fsPath = _path.default.posix.join(itemsRoot, curItemPath);
                    }
                    // dynamically check fs in development so we don't
                    // have to wait on the watcher
                    if (!matchedItem && opts.dev) {
                        const isStaticAsset = [
                            'nextStaticFolder',
                            'publicFolder',
                            'legacyStaticFolder'
                        ].includes(type);
                        if (isStaticAsset && itemsRoot) {
                            let found = fsPath && await (0, _fileexists.fileExists)(fsPath, _fileexists.FileType.File);
                            if (!found) {
                                try {
                                    // In dev, we ensure encoded paths match
                                    // decoded paths on the filesystem so check
                                    // that variation as well
                                    const tempItemPath = decodeURIComponent(curItemPath);
                                    fsPath = _path.default.posix.join(itemsRoot, tempItemPath);
                                    found = await (0, _fileexists.fileExists)(fsPath, _fileexists.FileType.File);
                                } catch  {}
                                if (!found) {
                                    continue;
                                }
                            }
                        } else if (!isPageOrAppFile) {
                            continue;
                        }
                    }
                    let error;
                    if (opts.dev && isPageOrAppFile) {
                        if (!route) {
                            continue;
                        }
                        const isAppFile = type === 'appFile';
                        // Attempt to ensure the page/app file is compiled and ready.
                        if (ensureFn) {
                            const ensureItemPath = isAppFile ? (0, _getmetadataroute.normalizeMetadataRoute)(curItemPath) : curItemPath;
                            try {
                                await ensureFn({
                                    type,
                                    itemPath: ensureItemPath,
                                    route,
                                    requestPath
                                });
                            } catch (err) {
                                // A disappeared route is not a match. Compilation errors still
                                // belong to this route and must render as a 500 downstream.
                                if (err instanceof _utils1.PageNotFoundError) {
                                    continue;
                                }
                                error = err instanceof Error ? err : new Error(String(err));
                            }
                        }
                    }
                    // i18n locales aren't matched for app dir
                    if (type === 'appFile' && locale && locale !== (i18n == null ? void 0 : i18n.defaultLocale)) {
                        continue;
                    }
                    if (isPageOrAppFile && !route && !matchedItem) {
                        continue;
                    }
                    let params;
                    if (route && (0, _apppageroutedefinition.isAppPageRouteDefinition)(route)) {
                        // Parallel app routes can contribute multiple dynamic app paths
                        // to one pathname. Preserve the params from the matching path.
                        for (const appPath of route.appPaths){
                            const routePathname = appNormalizers.pathname.normalize(appPath);
                            if (!(0, _utils.isDynamicRoute)(routePathname)) {
                                continue;
                            }
                            const routeParams = (0, _routematcher.getRouteMatcher)((0, _routeregex.getRouteRegex)(routePathname))(curItemPath);
                            if (routeParams) {
                                params = routeParams;
                                break;
                            }
                        }
                    }
                    const itemResult = {
                        type,
                        fsPath,
                        locale,
                        itemsRoot,
                        // itemPath is usually a slice of the request URL too; keep a
                        // flat copy so the cached value doesn't retain the full URL.
                        itemPath: flatKeyCopy(curItemPath),
                        route,
                        params,
                        error
                    };
                    getItemsLru == null ? void 0 : getItemsLru.set(flatKeyCopy(itemKey), itemResult);
                    return itemResult;
                }
            }
            getItemsLru == null ? void 0 : getItemsLru.set(flatKeyCopy(itemKey), notFound);
            return null;
        },
        getDynamicRoutes () {
            // this should include data routes
            return this.dynamicRoutes;
        },
        getMiddlewareMatchers () {
            return this.middlewareMatcher;
        }
    };
}

//# sourceMappingURL=filesystem.js.map