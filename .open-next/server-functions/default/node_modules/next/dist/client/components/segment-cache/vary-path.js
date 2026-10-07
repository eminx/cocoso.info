"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ParamsChange: null,
    appendLayoutVaryPath: null,
    cloneVaryPathWithNewSearchParams: null,
    compareParams: null,
    didReadChangedParam: null,
    finalizeVaryPath: null,
    getFulfilledRouteVaryPath: null,
    getFulfilledSegmentVaryPath: null,
    getPartialVaryPath: null,
    getRenderedSearchFromVaryPath: null,
    getRouteVaryPath: null,
    getSegmentVaryPathForRequest: null,
    getShellSegmentVaryPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ParamsChange: function() {
        return ParamsChange;
    },
    appendLayoutVaryPath: function() {
        return appendLayoutVaryPath;
    },
    cloneVaryPathWithNewSearchParams: function() {
        return cloneVaryPathWithNewSearchParams;
    },
    compareParams: function() {
        return compareParams;
    },
    didReadChangedParam: function() {
        return didReadChangedParam;
    },
    finalizeVaryPath: function() {
        return finalizeVaryPath;
    },
    getFulfilledRouteVaryPath: function() {
        return getFulfilledRouteVaryPath;
    },
    getFulfilledSegmentVaryPath: function() {
        return getFulfilledSegmentVaryPath;
    },
    getPartialVaryPath: function() {
        return getPartialVaryPath;
    },
    getRenderedSearchFromVaryPath: function() {
        return getRenderedSearchFromVaryPath;
    },
    getRouteVaryPath: function() {
        return getRouteVaryPath;
    },
    getSegmentVaryPathForRequest: function() {
        return getSegmentVaryPathForRequest;
    },
    getShellSegmentVaryPath: function() {
        return getShellSegmentVaryPath;
    }
});
const _types = require("./types");
const _cachemap = require("./cache-map");
const _varyparamsdecoding = require("../../../shared/lib/segment-cache/vary-params-decoding");
function getRouteVaryPath(pathname, search, nextUrl) {
    // requestKey -> searchParams -> nextUrl
    const varyPath = {
        id: null,
        value: pathname,
        isRootParam: false,
        parent: {
            id: _varyparamsdecoding.SEARCH_PARAMS_VARY_ID,
            value: search,
            isRootParam: false,
            parent: {
                id: null,
                value: nextUrl,
                isRootParam: false,
                parent: null
            }
        }
    };
    return varyPath;
}
function getFulfilledRouteVaryPath(pathname, search, nextUrl, couldBeIntercepted) {
    // This is called when a route's data is fulfilled. The cache entry will be
    // re-keyed based on which inputs the response varies by.
    // requestKey -> searchParams -> nextUrl
    const varyPath = {
        id: null,
        value: pathname,
        isRootParam: false,
        parent: {
            id: _varyparamsdecoding.SEARCH_PARAMS_VARY_ID,
            value: search,
            isRootParam: false,
            parent: {
                id: null,
                value: couldBeIntercepted ? nextUrl : _cachemap.Fallback,
                isRootParam: false,
                parent: null
            }
        }
    };
    return varyPath;
}
function appendLayoutVaryPath(parentPath, cacheKey, paramName, isRootParam) {
    const varyPathPart = {
        id: paramName,
        value: cacheKey,
        isRootParam,
        parent: parentPath
    };
    return varyPathPart;
}
function finalizeVaryPath(requestKey, // Non-null when the segment varies on search params: the search entry is
// spliced in between the request key and the path params. Fallback keys an
// entry that is reusable across all search strings.
searchParams, partialVaryPath) {
    // requestKey -> [searchParams] -> pathParams
    let parent = partialVaryPath;
    if (searchParams !== null) {
        parent = {
            id: _varyparamsdecoding.SEARCH_PARAMS_VARY_ID,
            value: searchParams,
            isRootParam: false,
            parent: partialVaryPath
        };
    }
    const varyPath = {
        id: null,
        value: requestKey,
        isRootParam: false,
        parent
    };
    return varyPath;
}
function getPartialVaryPath(finalizedVaryPath) {
    // This is the inverse of finalizeVaryPath: strip the request key, and the
    // search params entry if there is one.
    const parent = finalizedVaryPath.parent;
    if (parent !== null && parent.id === _varyparamsdecoding.SEARCH_PARAMS_VARY_ID) {
        return parent.parent;
    }
    return parent;
}
function getSegmentVaryPathForRequest(fetchStrategy, tree) {
    // This is used for storing pending requests in the cache. We want to choose
    // the most generic vary path based on the strategy used to fetch it, i.e.
    // static/PPR versus runtime prefetching, so that it can be reused as much
    // as possible.
    //
    // We may be able to re-key the response to something even more generic once
    // we receive it — for example, if the server tells us that the response
    // doesn't vary on a particular param — but even before we send the request,
    // we know some params are reusable based on the fetch strategy alone. For
    // example, a static prefetch will never vary on search params.
    //
    // The original vary path with all the params filled in is stored on the
    // route tree object. We will clone this one to create a new vary path
    // where certain params are replaced with Fallback.
    //
    // This result of this function is not stored anywhere. It's only used to
    // access the cache a single time.
    //
    // TODO: Rather than create a new list object just to access the cache, the
    // plan is to add the concept of a "vary mask". This will represent all the
    // params that can be treated as Fallback. (Or perhaps the inverse.)
    const originalVaryPath = tree.varyPath;
    if (fetchStrategy === _types.FetchStrategy.RuntimeShell || fetchStrategy === _types.FetchStrategy.StaticShell) {
        // Both shell strategies produce the App Shell variant of a segment —
        // RuntimeShell via a runtime render with non-root params omitted,
        // StaticShell by truncating a static per-segment response at the shell
        // byte boundary. Either way, the resulting entry is reusable across all
        // concrete values of the non-root params, so we key it at the precomputed
        // shell vary path (every non-root param substituted with Fallback; root
        // params keep their concrete value).
        return tree.shellVaryPath;
    }
    // The vary path includes a search params entry only when the segment varies
    // on search params.
    const searchParamsVaryPath = originalVaryPath.parent;
    if (searchParamsVaryPath !== null && searchParamsVaryPath.id === _varyparamsdecoding.SEARCH_PARAMS_VARY_ID) {
        // Only a runtime prefetch will include search params in the vary path.
        // Static prefetches never include search params, so they can be reused
        // across all possible search param values.
        const doesVaryOnSearchParams = fetchStrategy === _types.FetchStrategy.Full || fetchStrategy === _types.FetchStrategy.PPRRuntime;
        if (!doesVaryOnSearchParams) {
            // The response from the the server will not vary on search params.
            // Rebuild the vary path with the search params replaced by Fallback.
            //
            // requestKey -> searchParams -> pathParams
            //               ^ This part gets replaced with Fallback
            return finalizeVaryPath(originalVaryPath.value, _cachemap.Fallback, getPartialVaryPath(originalVaryPath));
        }
    }
    // The request does vary on search params. We don't need to modify anything.
    return originalVaryPath;
}
function cloneVaryPathWithNewSearchParams(originalVaryPath, newSearch) {
    // requestKey -> searchParams -> pathParams
    //               ^ This part gets replaced with newSearch
    const searchParamsVaryPath = originalVaryPath.parent;
    if (searchParamsVaryPath === null || searchParamsVaryPath.id !== _varyparamsdecoding.SEARCH_PARAMS_VARY_ID) {
        // No search params entry; nothing to replace.
        return originalVaryPath;
    }
    return finalizeVaryPath(originalVaryPath.value, newSearch, getPartialVaryPath(originalVaryPath));
}
function getRenderedSearchFromVaryPath(varyPath) {
    let node = varyPath;
    while(node !== null){
        if (node.id === _varyparamsdecoding.SEARCH_PARAMS_VARY_ID) {
            const search = node.value;
            if (typeof search === 'string') {
                return search;
            }
            return null;
        }
        node = node.parent;
    }
    return null;
}
var ParamsChange = /*#__PURE__*/ function(ParamsChange) {
    ParamsChange[ParamsChange["None"] = 0] = "None";
    ParamsChange[ParamsChange["SearchParams"] = 1] = "SearchParams";
    ParamsChange[ParamsChange["PathParam"] = 2] = "PathParam";
    return ParamsChange;
}({});
function compareParams(currentVaryPath, nextVaryPath) {
    // Both vary paths are for the same segment, so they list the same params in
    // the same order. Walk them together. This includes params inherited from
    // parent layouts, since those may have changed, too.
    let current = currentVaryPath;
    let next = nextVaryPath;
    let change = 0;
    while(current !== null && next !== null){
        if (current.value !== next.value) {
            const id = current.id;
            if (id === null) {
            // The request key. Callers check that the route structure matches
            // first, so it's always the same.
            } else if (id === _varyparamsdecoding.SEARCH_PARAMS_VARY_ID) {
                change = 1;
            } else {
                return 2;
            }
        }
        current = current.parent;
        next = next.parent;
    }
    return change;
}
function didReadChangedParam(currentVaryPath, nextVaryPath, varyParams) {
    // Returns true if the output rendered with `currentVaryPath` read a param
    // whose value is different in `nextVaryPath`. `varyParams` is the set of
    // params the output read, or null if we don't know.
    //
    // Same traversal as compareParams. Only read the set if a param changed.
    let current = currentVaryPath;
    let next = nextVaryPath;
    let total = null;
    while(current !== null && next !== null){
        if (current.value !== next.value) {
            const id = current.id;
            if (id === null) {
            // The request key. Callers check that the route structure matches
            // first, so it's always the same.
            } else {
                if (total === null) {
                    if (varyParams === null) {
                        // We don't know. Assume it read the param.
                        return true;
                    }
                    total = (0, _varyparamsdecoding.readVaryParams)(varyParams);
                    if (total === null) {
                        // The render hasn't finished, or it aborted. Assume it read the
                        // param.
                        return true;
                    }
                }
                if (total.has(id)) {
                    return true;
                }
            }
        }
        current = current.parent;
        next = next.parent;
    }
    return false;
}
function getFulfilledSegmentVaryPath(original, varyParams) {
    // Re-keys a segment's vary path based on which params the segment actually
    // depends on. Params that are NOT in the varyParams set are replaced with
    // Fallback, allowing the cache entry to be reused across different values of
    // those params.
    // This is called when a segment is fulfilled with data from the server. The
    // varyParams set comes from the server and indicates which params were
    // accessed during rendering.
    const clone = {
        id: original.id,
        // If the id is null, this node is not a param (e.g., it's a request key).
        // If the id is in the varyParams set, keep the original value.
        // Otherwise, replace with Fallback to make it reusable.
        value: original.id === null || varyParams.has(original.id) ? original.value : _cachemap.Fallback,
        isRootParam: original.isRootParam,
        parent: original.parent === null ? null : getFulfilledSegmentVaryPath(original.parent, varyParams)
    };
    return clone;
}
function getShellSegmentVaryPath(original) {
    // Re-keys a segment's vary path to identify the "App Shell" entry for this
    // segment position — a reusable loading state that can be served for any
    // concrete navigation to this segment. The shell is rendered with params
    // omitted, with one exception: root params (path params at or above the root
    // layout) may be accessed during the shell render, so the shell varies on
    // them. Accordingly, we keep the concrete value of structural nodes (request
    // keys, etc.) and root param nodes, and replace every other param node (non-
    // root path params and search params) with Fallback.
    const clone = {
        id: original.id,
        value: original.id === null || original.isRootParam === true ? original.value : _cachemap.Fallback,
        isRootParam: original.isRootParam,
        parent: original.parent === null ? null : getShellSegmentVaryPath(original.parent)
    };
    return clone;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=vary-path.js.map