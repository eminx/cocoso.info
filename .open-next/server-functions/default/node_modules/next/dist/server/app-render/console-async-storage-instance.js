"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "consoleAsyncStorageInstance", {
    enumerable: true,
    get: function() {
        return consoleAsyncStorageInstance;
    }
});
const _asynclocalstorage = require("./async-local-storage");
const consoleAsyncStorageInstance = (0, _asynclocalstorage.getOrCreateGlobalAsyncLocalStorage)('console-async-storage');

//# sourceMappingURL=console-async-storage-instance.js.map