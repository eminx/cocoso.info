"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createDynamicBodyError: null,
    createDynamicBodyErrorInNavigation: null,
    createDynamicBodyErrorInStaticRoute: null,
    createDynamicMetadataError: null,
    createDynamicMetadataErrorInStaticRoute: null,
    createDynamicOrRuntimeBodyError: null,
    createDynamicOrRuntimeMetadataError: null,
    createDynamicOrRuntimeViewportError: null,
    createDynamicViewportError: null,
    createDynamicViewportErrorInStaticRoute: null,
    createLinkBodyErrorInNavigation: null,
    createLinkMetadataError: null,
    createLinkViewportError: null,
    createNavigationBodyErrorInNavigation: null,
    createNavigationMetadataError: null,
    createNavigationViewportError: null,
    createNonPrerenderableBodyErrorInStaticRoute: null,
    createNonPrerenderableMetadataErrorInStaticRoute: null,
    createNonPrerenderableViewportErrorInStaticRoute: null,
    createPrefetchBodyErrorInNavigation: null,
    createPrefetchMetadataError: null,
    createPrefetchViewportError: null,
    createRuntimeBodyError: null,
    createRuntimeBodyErrorInNavigation: null,
    createRuntimeBodyErrorInStaticRoute: null,
    createRuntimeMetadataError: null,
    createRuntimeMetadataErrorInStaticRoute: null,
    createRuntimeViewportError: null,
    createRuntimeViewportErrorInStaticRoute: null,
    logBuildDebugHint: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createDynamicBodyError: function() {
        return createDynamicBodyError;
    },
    createDynamicBodyErrorInNavigation: function() {
        return createDynamicBodyErrorInNavigation;
    },
    createDynamicBodyErrorInStaticRoute: function() {
        return createDynamicBodyErrorInStaticRoute;
    },
    createDynamicMetadataError: function() {
        return createDynamicMetadataError;
    },
    createDynamicMetadataErrorInStaticRoute: function() {
        return createDynamicMetadataErrorInStaticRoute;
    },
    createDynamicOrRuntimeBodyError: function() {
        return createDynamicOrRuntimeBodyError;
    },
    createDynamicOrRuntimeMetadataError: function() {
        return createDynamicOrRuntimeMetadataError;
    },
    createDynamicOrRuntimeViewportError: function() {
        return createDynamicOrRuntimeViewportError;
    },
    createDynamicViewportError: function() {
        return createDynamicViewportError;
    },
    createDynamicViewportErrorInStaticRoute: function() {
        return createDynamicViewportErrorInStaticRoute;
    },
    createLinkBodyErrorInNavigation: function() {
        return createLinkBodyErrorInNavigation;
    },
    createLinkMetadataError: function() {
        return createLinkMetadataError;
    },
    createLinkViewportError: function() {
        return createLinkViewportError;
    },
    createNavigationBodyErrorInNavigation: function() {
        return createNavigationBodyErrorInNavigation;
    },
    createNavigationMetadataError: function() {
        return createNavigationMetadataError;
    },
    createNavigationViewportError: function() {
        return createNavigationViewportError;
    },
    createNonPrerenderableBodyErrorInStaticRoute: function() {
        return createNonPrerenderableBodyErrorInStaticRoute;
    },
    createNonPrerenderableMetadataErrorInStaticRoute: function() {
        return createNonPrerenderableMetadataErrorInStaticRoute;
    },
    createNonPrerenderableViewportErrorInStaticRoute: function() {
        return createNonPrerenderableViewportErrorInStaticRoute;
    },
    createPrefetchBodyErrorInNavigation: function() {
        return createPrefetchBodyErrorInNavigation;
    },
    createPrefetchMetadataError: function() {
        return createPrefetchMetadataError;
    },
    createPrefetchViewportError: function() {
        return createPrefetchViewportError;
    },
    createRuntimeBodyError: function() {
        return createRuntimeBodyError;
    },
    createRuntimeBodyErrorInNavigation: function() {
        return createRuntimeBodyErrorInNavigation;
    },
    createRuntimeBodyErrorInStaticRoute: function() {
        return createRuntimeBodyErrorInStaticRoute;
    },
    createRuntimeMetadataError: function() {
        return createRuntimeMetadataError;
    },
    createRuntimeMetadataErrorInStaticRoute: function() {
        return createRuntimeMetadataErrorInStaticRoute;
    },
    createRuntimeViewportError: function() {
        return createRuntimeViewportError;
    },
    createRuntimeViewportErrorInStaticRoute: function() {
        return createRuntimeViewportErrorInStaticRoute;
    },
    logBuildDebugHint: function() {
        return logBuildDebugHint;
    }
});
function createRuntimeBodyError(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data during prerendering.\n\n` + `\`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` accessed outside of \`<Suspense>\` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-runtime`);
}
function createDynamicBodyError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data during prerendering.\n\n` + `\`fetch(...)\` or \`connection()\` accessed outside of \`<Suspense>\` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [cache] Cache the data access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic`);
}
function createRuntimeBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data during prerendering or a navigation.\n\n` + `\`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` accessed outside of \`<Suspense>\` prevents the route from being prerendered or the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-runtime`);
}
function createLinkBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered URL data during prerendering or a navigation.\n\n` + `\`params\` or \`searchParams\` accessed outside of \`<Suspense>\` may prevent the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-shell-url-data`);
}
function createNavigationBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered \`navigation()\` during prerendering or a navigation.\n\n` + `\`navigation()\` called outside of \`<Suspense>\` may prevent the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the component that calls \`navigation()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage`);
}
function createPrefetchBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered \`prefetch()\` during prerendering or a navigation.\n\n` + `\`prefetch()\` called outside of \`<Suspense>\` may prevent the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the component that calls \`prefetch()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage`);
}
function createDynamicBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data during prerendering or a navigation.\n\n` + `\`fetch(...)\` or \`connection()\` accessed outside of \`<Suspense>\` prevents the route from being prerendered or the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [cache] Cache the data access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic`);
}
function createDynamicOrRuntimeBodyError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data during prerendering.\n\n` + `\`fetch(...)\`, \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or \`connection()\` accessed outside of \`<Suspense>\` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [cache] For uncached data (\`fetch\`, database calls): cache the access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic`);
}
function createLinkMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered URL data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prefetched. \`params\` or \`searchParams\` accessed in \`generateMetadata()\` prevent it from being prefetched.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static metadata export instead of \`generateMetadata()\`\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime`);
}
function createRuntimeMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prerendered. \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` accessed in \`generateMetadata()\` cause it to run dynamically.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static metadata export instead of \`generateMetadata()\`\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime`);
}
function createNavigationMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered \`navigation()\` in \`generateMetadata()\`.\n\n` + `Metadata can already stream without blocking the route's UI, so delaying it until navigation may be unintentional.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`navigation()\` from \`generateMetadata()\`\n` + `  - [mark] Render a marker component that calls \`await navigation()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-metadata`);
}
function createPrefetchMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered \`prefetch()\` in \`generateMetadata()\`.\n\n` + `Metadata can already stream without blocking the route's UI, so delaying it until a per-link prefetch or navigation may be unintentional.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`prefetch()\` from \`generateMetadata()\`\n` + `  - [mark] Render a marker component that calls \`await prefetch()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-metadata`);
}
function createDynamicMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prerendered. \`fetch(...)\` or \`connection()\` accessed in \`generateMetadata()\` cause it to run dynamically.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the metadata with \`"use cache"\` in \`generateMetadata()\` (does not apply to \`connection()\`)\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-dynamic`);
}
function createLinkViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered URL data in \`generateViewport()\`.\n\n` + `\`params\` or \`searchParams\` in \`generateViewport()\` prevents the page from being prerendered, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static viewport export instead of \`generateViewport()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime`);
}
function createRuntimeViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateViewport()\`.\n\n` + `\`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` in \`generateViewport()\` prevents the page from being prerendered, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static viewport export instead of \`generateViewport()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime`);
}
function createNavigationViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered \`navigation()\` in \`generateViewport()\`.\n\n` + `This prevents Next.js from creating the App Shell, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`navigation()\` from \`generateViewport()\`\n` + `  - [ignore] Set \`export const instant = false\` to disable validation for this segment\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-viewport`);
}
function createPrefetchViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered \`prefetch()\` in \`generateViewport()\`.\n\n` + `This prevents Next.js from creating the App Shell, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`prefetch()\` from \`generateViewport()\`\n` + `  - [ignore] Set \`export const instant = false\` to disable validation for this segment\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-viewport`);
}
function createDynamicViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateViewport()\`.\n\n` + `\`fetch(...)\` or \`connection()\` in \`generateViewport()\` prevents the page from being prerendered, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the viewport data with \`"use cache"\` in \`generateViewport()\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-dynamic`);
}
function createDynamicOrRuntimeViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateViewport()\`.\n\n` + `This prevents the page from being prerendered, leading to a slower user experience. Unlike metadata, viewport cannot be streamed behind \`<Suspense>\` because it affects the initial page load.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static viewport export instead of \`generateViewport()\`\n` + `  - [cache] For uncached data (\`fetch\`, database calls): cache the viewport with \`"use cache"\` in \`generateViewport()\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime`);
}
function createDynamicOrRuntimeMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prerendered.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static metadata export instead of \`generateMetadata()\`\n` + `  - [cache] Cache the metadata with \`"use cache"\` in \`generateMetadata()\` (does not apply to \`connection()\`)\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime`);
}
function createRuntimeBodyErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data on a route that must be fully static.\n\n` + `This route is configured to be fully static, but runtime data from \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or a short-lived cache requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove the data access\n` + `  - [client] Read the data on the client\n\n` + `Learn more: https://nextjs.org/docs/messages/static-route-runtime`);
}
function createDynamicBodyErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data on a route that must be fully static.\n\n` + `This route is configured to be fully static, but an uncached \`fetch(...)\`, database call, or \`connection()\` requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the data access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [remove] Remove the data access\n` + `  - [client] Read the data on the client\n\n` + `Learn more: https://nextjs.org/docs/messages/static-route-dynamic`);
}
function createNonPrerenderableBodyErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data on a route that must be fully static.\n\n` + `This route is configured to be fully static, but some data requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] For uncached data (\`fetch\`, database calls): cache the access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [remove] Remove the data access\n` + `  - [client] Read the data on the client\n\n` + `Learn more: https://nextjs.org/docs/messages/static-route-dynamic`);
}
function createRuntimeMetadataErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateMetadata()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but runtime data from \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or a short-lived cache requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [static] Replace the dynamic data used by \`generateMetadata()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-metadata-runtime`);
}
function createDynamicMetadataErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateMetadata()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but an uncached \`fetch(...)\`, database call, or \`connection()\` requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the data used by \`generateMetadata()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateMetadata()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-metadata-dynamic`);
}
function createNonPrerenderableMetadataErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateMetadata()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but some data requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] For uncached data: cache the data used by \`generateMetadata()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateMetadata()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-metadata-dynamic`);
}
function createRuntimeViewportErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateViewport()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but runtime data from \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or a short-lived cache requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [static] Replace the dynamic data used by \`generateViewport()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-viewport-runtime`);
}
function createDynamicViewportErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateViewport()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but an uncached \`fetch(...)\`, database call, or \`connection()\` requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the data used by \`generateViewport()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateViewport()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-viewport-dynamic`);
}
function createNonPrerenderableViewportErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateViewport()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but some data requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] For uncached data: cache the data used by \`generateViewport()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateViewport()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-viewport-dynamic`);
}
function logBuildDebugHint(route) {
    if (process.env.NODE_ENV !== 'development') {
        console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:\n` + `  - Start the app in development mode by running \`next dev\`, then open "${route}" in your browser to investigate the error.\n` + `  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`);
    } else if (!process.env.__NEXT_DEV_SERVER) {
        console.error(`To debug the issue, start the app in development mode by running \`next dev\`, then open "${route}" in your browser to investigate the error.`);
    }
}

//# sourceMappingURL=blocking-route-messages.js.map