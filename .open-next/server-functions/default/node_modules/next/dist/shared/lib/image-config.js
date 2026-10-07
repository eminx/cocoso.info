"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    VALID_LOADERS: null,
    imageConfigDefault: null,
    prepareImageConfig: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    VALID_LOADERS: function() {
        return VALID_LOADERS;
    },
    imageConfigDefault: function() {
        return imageConfigDefault;
    },
    prepareImageConfig: function() {
        return prepareImageConfig;
    }
});
const VALID_LOADERS = [
    'default',
    'imgix',
    'cloudinary',
    'akamai',
    'custom'
];
const missingImageConfig = {};
const preparedImageConfigs = new WeakMap();
function prepareImageConfig(envConfig, contextConfig) {
    const envKey = envConfig ?? missingImageConfig;
    const contextKey = contextConfig ?? missingImageConfig;
    let preparedByContext = preparedImageConfigs.get(envKey);
    if (preparedByContext) {
        const cached = preparedByContext.get(contextKey);
        if (cached) {
            return cached;
        }
    }
    const source = envConfig || contextConfig || imageConfigDefault;
    const deviceSizes = [
        ...source.deviceSizes
    ].sort((a, b)=>a - b);
    const imageSizes = [
        ...source.imageSizes
    ];
    const prepared = {
        deviceSizes,
        imageSizes,
        allSizes: [
            ...deviceSizes,
            ...imageSizes
        ].sort((a, b)=>a - b),
        qualities: source.qualities === undefined ? undefined : [
            ...source.qualities
        ].sort((a, b)=>a - b),
        path: source.path,
        loader: source.loader,
        dangerouslyAllowSVG: source.dangerouslyAllowSVG,
        unoptimized: source.unoptimized,
        domains: source.domains,
        remotePatterns: source.remotePatterns,
        // The inlined browser options supply their own patterns. During SSR the
        // context supplies security-sensitive patterns omitted from the inline data.
        localPatterns: typeof window === 'undefined' && contextConfig !== undefined ? contextConfig.localPatterns : source.localPatterns,
        output: source.output
    };
    if (!preparedByContext) {
        preparedByContext = new WeakMap();
        preparedImageConfigs.set(envKey, preparedByContext);
    }
    preparedByContext.set(contextKey, prepared);
    return prepared;
}
const imageConfigDefault = {
    deviceSizes: [
        640,
        750,
        828,
        1080,
        1200,
        1920,
        2048,
        3840
    ],
    imageSizes: [
        32,
        48,
        64,
        96,
        128,
        256,
        384
    ],
    path: '/_next/image',
    loader: 'default',
    loaderFile: '',
    /**
   * @deprecated Use `remotePatterns` instead to protect your application from malicious users.
   */ domains: [],
    disableStaticImages: false,
    minimumCacheTTL: 14400,
    formats: [
        'image/webp'
    ],
    maximumDiskCacheSize: undefined,
    maximumRedirects: 3,
    maximumResponseBody: 50000000,
    dangerouslyAllowLocalIP: false,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: `script-src 'none'; frame-src 'none'; sandbox;`,
    contentDispositionType: 'attachment',
    localPatterns: undefined,
    remotePatterns: [],
    qualities: [
        75
    ],
    unoptimized: false,
    customCacheHandler: false
};

//# sourceMappingURL=image-config.js.map