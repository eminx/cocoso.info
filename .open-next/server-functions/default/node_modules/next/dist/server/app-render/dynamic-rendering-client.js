"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useDynamicRouteParams: null,
    useDynamicSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    useDynamicRouteParams: function() {
        return useDynamicRouteParams;
    },
    useDynamicSearchParams: function() {
        return useDynamicSearchParams;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _reactdom = require("react-dom");
const _workunitasyncstorageexternal = require("./work-unit-async-storage.external");
const _workasyncstorageexternal = require("../app-render/work-async-storage.external");
const _dynamicrenderingutils = require("../dynamic-rendering-utils");
const _invarianterror = require("../../shared/lib/invariant-error");
const _bailouttocsr = require("../../shared/lib/lazy-dynamic/bailout-to-csr");
const _reactbrowserbailout = require("../../shared/lib/lazy-dynamic/react-browser-bailout");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getUseSearchParamsBailoutReason = _reactbrowserbailout.createReactBrowserBailoutReason.bind(null, 'useSearchParams()');
function useDynamicRouteParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-client':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        // We are in a prerender with cacheComponents semantics. We are going to
                        // hang here and never resolve. This will cause the currently
                        // rendering component to effectively be a dynamic hole.
                        _react.default.use((0, _dynamicrenderingutils.makeClientHookHangingPromise)(workUnitStore.renderSignal, new _dynamicrenderingutils.ClientHookDynamicError(workStore.route, expression)));
                    }
                    break;
                }
            case 'prerender':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
            case 'validation-client':
                {
                    break;
                }
            case 'prerender-runtime':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called during a runtime prerender. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
            case 'cache':
            case 'private-cache':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
            case 'build-time-generator':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called in \`${workUnitStore.functionName}\`. Next.js should be preventing ${expression} from being included in server component files statically, but did not in this case.`);
            case 'prerender-legacy':
            case 'request':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
}
function useDynamicSearchParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (!workStore) {
        // We assume pages router context and just return
        return;
    }
    if (!workUnitStore) {
        (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(expression);
    }
    switch(workUnitStore.type){
        case 'validation-client':
            // During instant validation we try to behave as close to client as possible,
            // so this shouldn't hang during SSR.
            return;
        case 'prerender-client':
            {
                _react.default.use((0, _dynamicrenderingutils.makeClientHookHangingPromise)(workUnitStore.renderSignal, new _dynamicrenderingutils.ClientHookDynamicError(workStore.route, expression)));
                break;
            }
        case 'prerender-legacy':
            {
                if (workStore.forceStatic) {
                    return;
                }
                if (process.env.__NEXT_EXPERIMENTAL_REACT_BROWSER_BAILOUT) {
                    // @ts-expect-error TODO: Update @types/react-dom to include the reason argument.
                    _react.default.use((0, _reactdom.browser)(getUseSearchParamsBailoutReason));
                    return;
                } else {
                    throw new _bailouttocsr.BailoutToCSRError(expression);
                }
            }
        case 'prerender':
        case 'prerender-runtime':
            throw new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
        case 'cache':
        case 'unstable-cache':
        case 'private-cache':
            throw new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
        case 'build-time-generator':
            throw new _invarianterror.InvariantError(`\`${expression}\` was called in \`${workUnitStore.functionName}\`. Next.js should be preventing ${expression} from being included in server component files statically, but did not in this case.`);
        case 'request':
            return;
        default:
            workUnitStore;
    }
}

//# sourceMappingURL=dynamic-rendering-client.js.map