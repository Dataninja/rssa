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
const _ = require("lodash");
const cheerio = require("cheerio");
const fetch_1 = require("./fetch");
const history_1 = require("./history");
/* EXTRACT */
const Extract = {
    page(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, tokens, headless } = options, page = yield fetch_1.default.do(url, headless), history = yield history_1.default.read(), last = history_1.default.getLast(history, url), $ = cheerio['load'](page);
            return Extract.tokens(page, $, tokens, last && last['tokens']);
        });
    },
    tokens(page, $, tokens, oldTokens) {
        return _.transform(tokens, (acc, value, key) => {
            acc[key] = Extract.token(page, $, value, oldTokens && oldTokens[key]);
        }, {});
    },
    token(page, $, options, oldToken) {
        const extractor = _.isArray(options) ? options[0] : options, callback = _.isArray(options) ? options[1] : _.identity;
        let value;
        if (_.isRegExp(extractor)) {
            const parts = page.match(extractor);
            value = parts ? parts[1] : null;
        }
        else if (_.isString(extractor)) {
            value = $(extractor).text();
        }
        else if (_.isFunction(extractor)) {
            value = extractor(page, $, oldToken);
        }
        else {
            throw new Error('Unsupported extractor');
        }
        return callback(value);
    }
};
/* EXPORT */
exports.default = Extract;
//# sourceMappingURL=extract.js.map