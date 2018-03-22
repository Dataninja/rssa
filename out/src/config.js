"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const yargs_1 = require("yargs");
const path = require("path");
const utils_1 = require("./utils");
/* CONFIG */
let config = utils_1.default.require.json(path.join(__dirname, '../../config.json'));
if (yargs_1.argv.config) {
    config = _.merge(config, utils_1.default.require.json(yargs_1.argv.config));
    config.report.fullPath = path.join(config.report.path, config.report.name);
}
/* EXPORT */
exports.default = config;
//# sourceMappingURL=config.js.map