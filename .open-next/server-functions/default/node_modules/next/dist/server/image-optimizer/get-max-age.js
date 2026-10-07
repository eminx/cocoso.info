"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getMaxAge", {
    enumerable: true,
    get: function() {
        return getMaxAge;
    }
});
function parseCacheControl(str) {
    const map = new Map();
    if (!str) {
        return map;
    }
    for (let directive of str.split(',')){
        let [key, value] = directive.trim().split('=', 2);
        key = key.toLowerCase();
        if (value) {
            value = value.toLowerCase();
        }
        map.set(key, value);
    }
    return map;
}
function getMaxAge(str) {
    const map = parseCacheControl(str);
    if (map) {
        let age = map.get('s-maxage') || map.get('max-age') || '';
        if (age.startsWith('"') && age.endsWith('"')) {
            age = age.slice(1, -1);
        }
        const n = parseInt(age, 10);
        if (!isNaN(n)) {
            return n;
        }
    }
    return 0;
}

//# sourceMappingURL=get-max-age.js.map