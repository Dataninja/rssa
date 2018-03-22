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
const openFile = require("open");
const config_1 = require("../config");
const feeds_1 = require("../feeds");
const history_1 = require("../history");
const extract_1 = require("../extract");
const utils_1 = require("../utils");
/* ABSTRACT */
class abstract {
    /* HELPERS */
    _getExtension() {
        return '';
    }
    _getTemplate(config, type, fallback = false) {
        if (config.templates && config.templates[type])
            return config.templates[type];
        if (fallback)
            return this._getTemplate(config, fallback);
        return config.template;
    }
    _getSavePath(tokens = {}) {
        const extension = this._getExtension(), name = this._replaceTokens(this._replaceDateTokens(config_1.default.report.fullPath), tokens);
        return `${name}${extension}`;
    }
    _getPublicPath(tokens = {}) {
        const extension = this._getExtension(), name = this._replaceTokens(this._replaceDateTokens(config_1.default.report.url), tokens);
        return `${name}${extension}`;
    }
    _replaceWith(str, search, replacement) {
        const regex = new RegExp(_.escapeRegExp(search), 'g');
        return str.replace(regex, replacement);
    }
    _replaceTokens(str, tokens) {
        _.forOwn(tokens, (value, key) => {
            str = this._replaceWith(str, `[${key}]`, value);
        });
        return str;
    }
    _replaceDateTokens(str) {
        const date = new Date();
        return this._replaceTokens(str, {
            year: date.getFullYear(),
            month: _.padStart(`${date.getMonth()}`, 2, '0'),
            day: _.padStart(`${date.getDate()}`, 2, '0'),
            hour: _.padStart(`${date.getHours()}`, 2, '0'),
            minute: _.padStart(`${date.getMinutes()}`, 2, '0'),
            second: _.padStart(`${date.getSeconds()}`, 2, '0'),
            timestamp: Math.floor(date.getTime() / 1000)
        });
    }
    _parseTemplate(template, tokens, tokensOld, tokensAll) {
        let lines = _.isFunction(template) ? template(tokens, tokensOld, tokensAll) : template;
        lines = _.castArray(lines);
        lines = lines.filter(_.identity);
        _.forOwn(tokens, (value, key) => {
            lines = lines.map(line => this._replaceTokens(line, {
                [`${key}`]: value,
                [`old:${key}`]: tokensOld && tokensOld.hasOwnProperty(key) ? tokensOld[key] : '-'
            }));
        });
        return lines;
    }
    /* INIT */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.feeds = feeds_1.default;
            yield this.initHistory();
            this.initLastUpdate();
            yield this.initTokensAll();
            yield this.initTokensAllOld();
        });
    }
    initHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            this.history = yield history_1.default.read();
        });
    }
    initLastUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastUpdate = Math.max(..._.compact(_.flatMap(this.history, value => _.get(_.last(value), 'date'))));
        });
    }
    initTokensAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tokensAll = {};
            utils_1.default.feed.walkFeeds(this.feeds, (feed, config) => {
                this.tokensAll[config.url] = extract_1.default.page(config);
            });
            for (let url in this.tokensAll) {
                if (!this.tokensAll.hasOwnProperty(url))
                    continue;
                this.tokensAll[url] = yield this.tokensAll[url];
            }
        });
    }
    initTokensAllOld() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tokensAllOld = {};
            for (let url in this.tokensAll) {
                if (!this.tokensAll.hasOwnProperty(url))
                    continue;
                this.tokensAllOld[url] = _.get(history_1.default.getLast(this.history, url), 'tokens', {});
            }
        });
    }
    /* RENDER */
    render() { }
    /* API */
    save(filename) {
        if (this.rendered) {
            utils_1.default.file.make(filename || this.savePath, this.rendered);
        }
    }
    open() {
        openFile(this.savePath);
    }
    run(save = config_1.default.report.save, open = config_1.default.report.open) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            yield this.render();
            this.savePath = this._getSavePath();
            if (save || open)
                yield this.save();
            if (open)
                yield this.open();
            history_1.default.update(this.history, this.tokensAll);
        });
    }
}
exports.abstract = abstract;
//# sourceMappingURL=abstract.js.map