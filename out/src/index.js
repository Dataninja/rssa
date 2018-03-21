#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const Reporters = require("./reporters");
/* RSSA */
const reporter = config_1.default.report.active;
if (!Reporters.hasOwnProperty(reporter))
    throw new Error(`Unsupported reporter: ${reporter}`);
(new Reporters[reporter]).run();
//# sourceMappingURL=index.js.map