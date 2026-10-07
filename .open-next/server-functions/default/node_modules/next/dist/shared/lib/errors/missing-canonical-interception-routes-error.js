"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MissingCanonicalInterceptionRoutesError", {
    enumerable: true,
    get: function() {
        return MissingCanonicalInterceptionRoutesError;
    }
});
class MissingCanonicalInterceptionRoutesError extends Error {
    constructor(routes){
        const formattedRoutes = routes.map(({ interceptionRoute, canonicalRoute })=>`- ${interceptionRoute} (expected ${canonicalRoute})`).join('\n');
        super(`The following interception routes do not have a canonical route:\n${formattedRoutes}\n\nEvery interception route must have a matching non-interception route so the URL can be loaded directly or refreshed.`);
        this.name = 'MissingCanonicalInterceptionRoutesError';
        this.stack = undefined;
    }
}

//# sourceMappingURL=missing-canonical-interception-routes-error.js.map