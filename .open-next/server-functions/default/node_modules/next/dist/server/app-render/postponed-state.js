"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DynamicHTMLPreludeState: null,
    DynamicState: null,
    getDynamicDataPostponedState: null,
    getDynamicHTMLPostponedState: null,
    getPostponedFromState: null,
    isEmptyHTMLPrelude: null,
    parsePostponedState: null,
    parseResumeDataCacheFromPostponedState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DynamicHTMLPreludeState: function() {
        return DynamicHTMLPreludeState;
    },
    DynamicState: function() {
        return DynamicState;
    },
    getDynamicDataPostponedState: function() {
        return getDynamicDataPostponedState;
    },
    getDynamicHTMLPostponedState: function() {
        return getDynamicHTMLPostponedState;
    },
    getPostponedFromState: function() {
        return getPostponedFromState;
    },
    isEmptyHTMLPrelude: function() {
        return isEmptyHTMLPrelude;
    },
    parsePostponedState: function() {
        return parsePostponedState;
    },
    parseResumeDataCacheFromPostponedState: function() {
        return parseResumeDataCacheFromPostponedState;
    }
});
const _resumedatacache = require("../resume-data-cache/resume-data-cache");
var DynamicState = /*#__PURE__*/ function(DynamicState) {
    /**
   * The dynamic access occurred during the RSC render phase.
   */ DynamicState[DynamicState["DATA"] = 1] = "DATA";
    /**
   * The dynamic access occurred during the HTML shell render phase.
   */ DynamicState[DynamicState["HTML"] = 2] = "HTML";
    return DynamicState;
}({});
var DynamicHTMLPreludeState = /*#__PURE__*/ function(DynamicHTMLPreludeState) {
    DynamicHTMLPreludeState[DynamicHTMLPreludeState["Empty"] = 0] = "Empty";
    DynamicHTMLPreludeState[DynamicHTMLPreludeState["Full"] = 1] = "Full";
    return DynamicHTMLPreludeState;
}({});
async function serializePostponedState(postponedString, resumeDataCache, isCacheComponentsEnabled, maxPostponedStateSizeBytes, disableResumeDataCacheCompression) {
    const prefix = `${postponedString.length}:${postponedString}`;
    let serializedResumeDataCache = await (0, _resumedatacache.stringifyResumeDataCache)(resumeDataCache, isCacheComponentsEnabled);
    if (!disableResumeDataCacheCompression) {
        if (maxPostponedStateSizeBytes !== undefined) {
            const uncompressedPostponedStateByteLength = Buffer.byteLength(prefix) + Buffer.byteLength(serializedResumeDataCache);
            if (uncompressedPostponedStateByteLength > maxPostponedStateSizeBytes) {
                console.warn(`The uncompressed postponed state is ${uncompressedPostponedStateByteLength} bytes, which exceeds the configured experimental.maxPostponedStateSize limit of ${maxPostponedStateSizeBytes} bytes. Next.js currently compresses the Resume Data Cache before persisting the postponed state, but this compression will be removed in a future release. Increase experimental.maxPostponedStateSize to ensure this route can still be resumed after that change.`);
            }
        }
        serializedResumeDataCache = (0, _resumedatacache.deflateResumeDataCache)(serializedResumeDataCache);
    }
    return prefix + serializedResumeDataCache;
}
async function getDynamicHTMLPostponedState(postponed, preludeState, fallbackRouteParams, resumeDataCache, isCacheComponentsEnabled, maxPostponedStateSizeBytes, disableResumeDataCacheCompression = false) {
    const data = [
        preludeState,
        postponed
    ];
    const dataString = JSON.stringify(data);
    // If there are no fallback route params, we can just serialize the postponed
    // state as is.
    if (!fallbackRouteParams || fallbackRouteParams.size === 0) {
        // Serialized as `<postponedString.length>:<postponedString><renderResumeDataCache>`
        return serializePostponedState(dataString, resumeDataCache, isCacheComponentsEnabled, maxPostponedStateSizeBytes, disableResumeDataCacheCompression);
    }
    const fallbackParamsString = JSON.stringify(Array.from(fallbackRouteParams.keys()));
    // Render staging only needs to know which params were unknown. Their opaque
    // placeholders and types aren't needed to resume, since React's server keys
    // don't depend on param values.
    // Serialized as `<fallbackParams.length><fallbackParams><data>`
    const postponedString = `${fallbackParamsString.length}${fallbackParamsString}${dataString}`;
    // Serialized as `<postponedString.length>:<postponedString><renderResumeDataCache>`
    return serializePostponedState(postponedString, resumeDataCache, isCacheComponentsEnabled, maxPostponedStateSizeBytes, disableResumeDataCacheCompression);
}
async function getDynamicDataPostponedState(resumeDataCache, isCacheComponentsEnabled, maxPostponedStateSizeBytes, disableResumeDataCacheCompression = false, fallbackRouteParams) {
    let postponedString = 'null';
    if (fallbackRouteParams !== undefined) {
        const fallbackParamsString = JSON.stringify(fallbackRouteParams ? Array.from(fallbackRouteParams.keys()) : []);
        // Record the unknown param names even when React has no HTML to resume.
        // An empty array explicitly records that this shell has no fallback params.
        postponedString = `${fallbackParamsString.length}${fallbackParamsString}null`;
    }
    return serializePostponedState(postponedString, resumeDataCache, isCacheComponentsEnabled, maxPostponedStateSizeBytes, disableResumeDataCacheCompression);
}
function parsePostponedStateParts(state, maxPostponedStateSizeBytes, disableResumeDataCacheCompression) {
    var _state_match;
    const postponedStringLengthMatch = (_state_match = state.match(/^([0-9]*):/)) == null ? void 0 : _state_match[1];
    if (!postponedStringLengthMatch) {
        // Do not include the raw state in the message: it can be large and may
        // contain sensitive serialized data.
        throw new Error('Invariant: invalid postponed state: missing length prefix');
    }
    const postponedStringLength = parseInt(postponedStringLengthMatch);
    const tailStart = postponedStringLengthMatch.length + postponedStringLength + 1;
    return {
        postponedString: state.slice(postponedStringLengthMatch.length + 1, tailStart),
        renderResumeDataCache: (0, _resumedatacache.createRenderResumeDataCache)(state.slice(tailStart), maxPostponedStateSizeBytes, disableResumeDataCacheCompression)
    };
}
function parseResumeDataCacheFromPostponedState(state, maxPostponedStateSizeBytes, disableResumeDataCacheCompression = false) {
    try {
        return parsePostponedStateParts(state, maxPostponedStateSizeBytes, disableResumeDataCacheCompression).renderResumeDataCache;
    } catch (err) {
        console.error('Failed to parse postponed state', describePostponedStateParseFailure(state, err));
        return (0, _resumedatacache.createRenderResumeDataCache)((0, _resumedatacache.createPrerenderResumeDataCache)());
    }
}
function parsePostponedState(state, maxPostponedStateSizeBytes, disableResumeDataCacheCompression = false) {
    try {
        const { postponedString, renderResumeDataCache } = parsePostponedStateParts(state, maxPostponedStateSizeBytes, disableResumeDataCacheCompression);
        try {
            if (postponedString === 'null') {
                // Leave `stagedFallbackParams` unset for the `4:null<cache>` form. It
                // contains no fallback-parameter information. A platform can send
                // `4:nullnull` when it invokes the renderer without a cached shell.
                return {
                    type: 1,
                    renderResumeDataCache
                };
            }
            if (/^[0-9]/.test(postponedString)) {
                var _postponedString_match;
                const match = (_postponedString_match = postponedString.match(/^([0-9]*)/)) == null ? void 0 : _postponedString_match[1];
                if (!match) {
                    throw new Error(`Invariant: invalid postponed state ${JSON.stringify(postponedString)}`);
                }
                // This is the length of the serialized fallback params.
                const length = parseInt(match);
                const fallbackParamNames = JSON.parse(postponedString.slice(match.length, // We then go to the end of the string.
                match.length + length));
                const stagedFallbackParams = fallbackParamNames.length > 0 ? new Set(fallbackParamNames) : null;
                const postponed = postponedString.slice(match.length + length);
                if (postponed === 'null') {
                    return {
                        type: 1,
                        stagedFallbackParams,
                        renderResumeDataCache
                    };
                }
                return {
                    type: 2,
                    stagedFallbackParams,
                    data: JSON.parse(postponed),
                    renderResumeDataCache
                };
            }
            return {
                type: 2,
                stagedFallbackParams: null,
                data: JSON.parse(postponedString),
                renderResumeDataCache
            };
        } catch (err) {
            console.error('Failed to parse postponed state', describePostponedStateParseFailure(state, err));
            return {
                type: 1,
                renderResumeDataCache
            };
        }
    } catch (err) {
        console.error('Failed to parse postponed state', describePostponedStateParseFailure(state, err));
        return {
            type: 1,
            renderResumeDataCache: (0, _resumedatacache.createRenderResumeDataCache)((0, _resumedatacache.createPrerenderResumeDataCache)())
        };
    }
}
/**
 * Derives content-free diagnostics about a postponed state that failed to
 * parse, so the error log is actionable without exposing the (potentially
 * sensitive) serialized contents. Every field is a size, a structural flag, or
 * an error code, never the state bytes themselves.
 *
 * The serialized layout is `<N>:<postponedString><cache>`. The cache is a
 * base64-deflate string by default and raw JSON when RDC compression is
 * disabled, so these fields distinguish the failure shapes:
 * - `postponedStringComplete: false`: the declared length `N` exceeds what
 * actually arrived, i.e. the postponed string itself was truncated.
 * - `errorCode: 'Z_BUF_ERROR'` with an empty or short tail: the
 * resume-data-cache tail was truncated (ran out of input while inflating).
 * - `errorCode: 'Z_DATA_ERROR'`: the tail bytes are corrupt, not merely short.
 * - `hasLengthPrefix: false`: the body had no `<N>:` prefix at all (e.g. empty
 * or otherwise malformed input).
 */ function describePostponedStateParseFailure(state, error) {
    const errnoError = error;
    const diagnostics = {
        stateLength: state.length,
        errorName: error instanceof Error ? error.name : typeof error,
        errorCode: errnoError == null ? void 0 : errnoError.code
    };
    const prefixMatch = state.match(/^([0-9]+):/);
    if (!prefixMatch) {
        diagnostics.hasLengthPrefix = false;
        return diagnostics;
    }
    const declaredPostponedLength = parseInt(prefixMatch[1], 10);
    const tailStart = prefixMatch[0].length + declaredPostponedLength;
    const tail = state.slice(tailStart);
    diagnostics.hasLengthPrefix = true;
    diagnostics.declaredPostponedLength = declaredPostponedLength;
    diagnostics.postponedStringComplete = state.length >= tailStart;
    diagnostics.resumeDataCacheTailLength = tail.length;
    diagnostics.resumeDataCacheTailIsNull = tail === 'null';
    return diagnostics;
}
function getPostponedFromState(state) {
    const [preludeState, postponed] = state.data;
    return {
        preludeState,
        postponed
    };
}
function isEmptyHTMLPrelude(state) {
    try {
        var _state_match;
        const lengthMatch = (_state_match = state.match(/^([0-9]*):/)) == null ? void 0 : _state_match[1];
        if (!lengthMatch) {
            return false;
        }
        const length = parseInt(lengthMatch);
        let postponedString = state.slice(lengthMatch.length + 1, lengthMatch.length + 1 + length);
        // `null` is the dynamic-data case (a full shell was produced).
        if (postponedString === 'null') {
            return false;
        }
        // An optional `<n><fallbackParams>` prefix records the unknown params;
        // skip it to reach the `[preludeState, postponed]` data.
        if (/^[0-9]/.test(postponedString)) {
            var _postponedString_match;
            const fallbackParamsLengthMatch = (_postponedString_match = postponedString.match(/^([0-9]*)/)) == null ? void 0 : _postponedString_match[1];
            if (!fallbackParamsLengthMatch) {
                return false;
            }
            const fallbackParamsLength = parseInt(fallbackParamsLengthMatch);
            postponedString = postponedString.slice(fallbackParamsLengthMatch.length + fallbackParamsLength);
        }
        const data = JSON.parse(postponedString);
        return Array.isArray(data) && data[0] === 0;
    } catch  {
        return false;
    }
}

//# sourceMappingURL=postponed-state.js.map