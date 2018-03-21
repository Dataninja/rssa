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
/* RSS */
class rss extends abstract_1.abstract {
    /* HELPERS */
    _getExtension() {
        return '.rss';
    }
    /* RENDER */
    renderPrefix() {
        this.rendered += `\
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
`;
    }
    renderSuffix() {
        this.rendered += `
</feed>
`;
    }
    renderFeed() {
        this.rendered += `
  <title>Example feed</title>
  <link rel="self" href="http://fakedomain.com/rss"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>http://fakedomain.com/rss</id>
`;
        utils_1.default.feed.walk(this.feeds, _.noop, (group, config) => {
            //this.renderLine ( group.name, 'h4' );
        }, (feed, config) => {
            if (config.filter && !config.filter(this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll))
                return;
            const template = this._getTemplate(config, 'rss', 'txt'), lines = this._parseTemplate(template, this.tokensAll[config.url], this.tokensAllOld[config.url], this.tokensAll);
            this.renderLines(lines);
        });
    }
    renderLines(lines) {
        lines.forEach(line => this.renderLine(line));
    }
    renderLine(line = '') {
        this.rendered += `${line}`.replace(/ \& /g, " &amp; ");
    }
    render() {
        this.rendered = '';
        this.renderPrefix();
        this.renderFeed();
        this.renderSuffix();
    }
    /* API */
    run(save = config_1.default.report.save, open = true) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("run").call(this, save, open);
        });
    }
}
exports.rss = rss;
//# sourceMappingURL=rss.js.map