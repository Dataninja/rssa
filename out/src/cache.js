"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
const sha1 = require("sha1");
const config_1 = require("./config");
const utils_1 = require("./utils");
/* CACHE */
const Cache = {
    read(url) {
        if (!config_1.default.cache.enabled)
            return;
        const hash = sha1(url);
        return utils_1.default.file.read(`${config_1.default.cache.path}/${hash}`);
    },
    write(url, content) {
        if (!config_1.default.cache.enabled)
            return;
        const hash = sha1(url);
        utils_1.default.file.make(`${config_1.default.cache.path}/${hash}`, content);
    }
};
/* EXPORT */
exports.default = Cache;
//# sourceMappingURL=cache.js.map