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
const config_1 = require("../config");
const utils_1 = require("../utils");
/* HTML */
class html extends abstract_1.abstract {
    /* HELPERS */
    _getExtension() {
        return '.html';
    }
    /* RENDER */
    renderDates() {
        if (this.lastUpdate) {
            const date = new Date(this.lastUpdate).toString();
            this.renderLine(`Prev update time: ${date}`, 'p');
        }
        const date = new Date().toString();
        this.renderLine(`Curr update time: ${date}`, 'p');
        this.renderLine();
    }
    renderFeed() {
        utils_1.default.feed.walk(this.feeds, _.noop, (group, config, depth) => {
            this.renderLine(group.name, 'h4', depth);
        }, (feed, config, depth) => {
            if (config.filter && !config.filter(this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll))
                return;
            const template = this._getTemplate(config, 'html', 'txt'), lines = this._parseTemplate(template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll);
            this.renderLines(lines, 'p', depth);
        });
    }
    renderLines(lines, tag, depth, spaces) {
        lines.forEach(line => this.renderLine(line, tag, depth, spaces));
    }
    renderLine(line = '', tag = 'span', depth = 0, spaces = 4) {
        const indentation = _.repeat(_.repeat('\u00A0', spaces), depth); // Avoiding space collapse
        this.rendered += `<${tag}>${indentation}${line}</${tag}>`;
    }
    render() {
        this.rendered = '';
        this.renderDates();
        this.renderFeed();
    }
    /* API */
    run(save = config_1.default.report.save, open = config_1.default.report.open) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("run").call(this, save, open);
        });
    }
}
exports.html = html;
//# sourceMappingURL=html.js.map