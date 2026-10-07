/**
 * Extract the convention base name (e.g. `"proxy"`, `"middleware"`,
 * `"instrumentation"`) from a filename.
 *
 * Returns the segment before the first dot — NOT what `path.parse().name`
 * returns. The stdlib only strips the last extension, which is wrong here:
 * with a compound `pageExtensions` entry like `"page.ts"` the file
 * `proxy.page.ts` has `path.parse().name === "proxy.page"`, but its
 * convention base name is `"proxy"`.
 *
 * This must stay in lockstep with the Rust `convention_file_base_name`
 * helper used by the Turbopack build path (see
 * `crates/next-api/src/path_utils.rs`). Any change here needs the same
 * change there.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getConventionFileBaseName", {
    enumerable: true,
    get: function() {
        return getConventionFileBaseName;
    }
});
function getConventionFileBaseName(fileBase) {
    return fileBase.split('.', 1)[0];
}

//# sourceMappingURL=get-convention-file-base-name.js.map