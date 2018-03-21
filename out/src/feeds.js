"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
const config_1 = require("./config");
const utils_1 = require("./utils");
/* FEEDS */
const filepath = yargs_1.argv.feeds || config_1.default.feeds.path, { feeds } = utils_1.default.require.js(filepath);
/* EXPORT */
exports.default = feeds;
//# sourceMappingURL=feeds.js.map