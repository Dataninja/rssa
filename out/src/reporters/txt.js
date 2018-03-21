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
const abstract_1 = require("./abstract");
const utils_1 = require("../utils");
/* TXT */
class txt extends abstract_1.abstract {
    /* HELPERS */
    _getExtension() {
        return '.txt';
    }
    _removeASCIIcodes(str) {
        return str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
    }
    /* RENDER */
    renderDates() {
        if (this.lastUpdate) {
            const date = new Date(this.lastUpdate).toString();
            this.renderLine(`Prev update time: ${date}`);
        }
        const date = new Date().toString();
        this.renderLine(`Curr update time: ${date}`);
        this.renderLine();
    }
    renderFeed() {
        utils_1.default.feed.walk(this.feeds, _.noop, (group, config, depth) => {
            this.renderLine(group.name, depth);
        }, (feed, config, depth) => {
            if (config.filter && !config.filter(this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll))
                return;
            const template = this._getTemplate(config, 'txt'), lines = this._parseTemplate(template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll);
            this.renderLines(lines, depth);
        });
    }
    renderLines(lines, depth, spaces) {
        lines.forEach(line => this.renderLine(line, depth, spaces));
    }
    renderLine(str = '', depth = 0, spaces = 4) {
        const indentation = _.repeat(_.repeat('\u00A0', spaces), depth);
        this.renderedWithColors += `${indentation}${str}\n`;
    }
    render() {
        this.renderedWithColors = '';
        this.renderDates();
        this.renderFeed();
        this.rendered = this._removeASCIIcodes(this.renderedWithColors);
    }
    /* API */
    log() {
        console.log(this.renderedWithColors);
    }
    run(save, open, log = true) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("run").call(this, save, open);
            if (log)
                this.log();
        });
    }
}
exports.txt = txt;
//# sourceMappingURL=txt.js.map