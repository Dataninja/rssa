"use strict";
/* IMPORT */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmd = require("node-cmd");
const pify = require("pify");
const request = require("request");
const cache_1 = require("./cache");
const config_1 = require("./config");
/* FETCH */
const Fetch = {
    headless(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return pify(cmd.get)(`${config_1.default.fetch.chrome_path} --headless --disable-gpu --dump-dom ${url}`);
        });
    },
    basic(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'User-Agent': 'rssa' // Required by some APIs (ie. GitHub)
            };
            const response = yield pify(request)({ url, headers });
            return response.toJSON().body;
        });
    },
    do(url, headless = config_1.default.fetch.headless) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = yield cache_1.default.read(url);
            if (cached)
                return cached;
            const fetcher = headless ? Fetch.headless : Fetch.basic, page = yield fetcher(url);
            cache_1.default.write(url, page);
            return page;
        });
    }
};
/* EXPORT */
exports.default = Fetch;
//# sourceMappingURL=fetch.js.map