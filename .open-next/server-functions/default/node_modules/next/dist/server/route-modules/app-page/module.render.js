"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    lazyPrerenderAppPage: null,
    lazyRenderAppPage: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    lazyPrerenderAppPage: function() {
        return lazyPrerenderAppPage;
    },
    lazyRenderAppPage: function() {
        return lazyRenderAppPage;
    }
});
function getAppPageModule() {
    if (process.env.NEXT_MINIMAL) {
        throw new Error("Can't use lazyRenderAppPage in minimal mode");
    } else {
        return require('./module.compiled');
    }
}
const lazyRenderAppPage = (...args)=>{
    const render = getAppPageModule().renderToHTMLOrFlight;
    return render(...args);
};
const lazyPrerenderAppPage = (...args)=>{
    const prerender = getAppPageModule().prerenderToHTMLOrFlight;
    return prerender(...args);
};

//# sourceMappingURL=module.render.js.map