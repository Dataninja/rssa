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
const config_1 = require("./config");
const utils_1 = require("./utils");
/* HISTORY */
const History = {
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield utils_1.default.file.read(config_1.default.history.path);
            if (!content)
                return {};
            const history = _.attempt(JSON.parse, content);
            if (_.isError(history))
                return {};
            return history;
        });
    },
    update(history, tokensAll) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = Date.now();
            _.forOwn(tokensAll, (tokens, url) => {
                if (!history[url])
                    history[url] = [];
                history[url].push({ date, tokens });
            });
            return utils_1.default.file.make(config_1.default.history.path, JSON.stringify(history, undefined, 2));
        });
    },
    getLast(history, url) {
        if (!history[url] || !history[url].length)
            return;
        return _.last(history[url]);
    }
};
/* EXPORT */
exports.default = History;
//# sourceMappingURL=history.js.map