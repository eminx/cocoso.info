"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "codeFrameColumns", {
    enumerable: true,
    get: function() {
        return codeFrameColumns;
    }
});
const _swc = require("../../../build/swc");
function codeFrameColumns(file, location, options = {}) {
    // Default to the terminal width. The CLI passes it on when it pipes this
    // process's output for the upgrade menu.
    if (options.maxWidth === undefined) {
        options.maxWidth = process.stdout.columns ?? (Number(process.env.NEXT_PRIVATE_TERMINAL_COLUMNS) || undefined);
    }
    return (0, _swc.getBindingsSync)().codeFrameColumns(file, location, options);
}

//# sourceMappingURL=code-frame.js.map