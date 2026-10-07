"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    throwIncompleteStaticParamsErrorInStaticRoute: null,
    throwMissingGspErrorInStaticRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    throwIncompleteStaticParamsErrorInStaticRoute: function() {
        return throwIncompleteStaticParamsErrorInStaticRoute;
    },
    throwMissingGspErrorInStaticRoute: function() {
        return throwMissingGspErrorInStaticRoute;
    }
});
function throwMissingGspErrorInStaticRoute(page) {
    throw new Error(`Page "${page}": \`ensureStatic = "navigation"\` requires an exported \`generateStaticParams()\` function.\nLearn more: https://nextjs.org/docs/messages/generate-static-params#with-ensurestatic`);
}
function throwIncompleteStaticParamsErrorInStaticRoute(page, missingParamNames) {
    throw new Error(`Page "${page}": \`generateStaticParams()\` returned incomplete params. Routes using \`ensureStatic = "navigation"\` must return every dynamic route parameter. Missing: ${missingParamNames.map((name)=>`"${name}"`).join(', ')}.\nLearn more: https://nextjs.org/docs/messages/generate-static-params#with-ensurestatic`);
}

//# sourceMappingURL=ensure-static-gsp-errors.js.map