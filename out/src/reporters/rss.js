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
        if (!_.includes(config_1.default.report.fullPath, 'group') && !_.includes(config_1.default.report.fullPath, 'feed')) {
            this.rendered += `
  <title>Feed</title>
  <link rel="self" href="${this._getPublicPath()}"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>${this._getPublicPath()}</id>
`;
        }
        utils_1.default.feed.walk(this.feeds, _.noop, [
            (group, cnf) => {
                if (_.includes(config_1.default.report.fullPath, 'group') && !_.includes(config_1.default.report.fullPath, 'feed')) {
                    this.rendered = '';
                    this.renderPrefix();
                    this.rendered += `
  <title>Feed of ${group.name}</title>
  <link rel="self" href="${this._getPublicPath({ group: group.name })}"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>${this._getPublicPath({ group: group.name })}</id>
`;
                }
            },
            (group, cnf) => {
                if (_.includes(config_1.default.report.fullPath, 'group') && !_.includes(config_1.default.report.fullPath, 'feed')) {
                    this.renderSuffix();
                    this.save(this._getSavePath({ group: group.name }));
                    this.rendered = '';
                }
            }
        ], (feed, cnf, depth, group) => {
            if (cnf.filter && !cnf.filter(this.tokensAll[cnf.url], this.tokensAllOld[cnf.url], this.tokensAll))
                return;
            const template = this._getTemplate(cnf, 'rss', 'txt'), lines = this._parseTemplate(template, this.tokensAll[cnf.url], this.tokensAllOld[cnf.url], this.tokensAll);
            if (_.includes(config_1.default.report.fullPath, 'feed')) {
                this.rendered = '';
                this.renderPrefix();
                this.rendered += `
  <title>Feed of ${feed.name} (${group.name})</title>
  <link rel="self" href="${this._getPublicPath({ group: group.name, feed: feed.name })}"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>${this._getPublicPath({ group: group.name, feed: feed.name })}</id>
`;
                this.renderLines(lines);
                this.renderSuffix();
                this.save(this._getSavePath({ group: group.name, feed: feed.name }));
                this.rendered = '';
            }
            else {
                this.renderLines(lines);
            }
        });
    }
    renderLines(lines) {
        lines.forEach(line => this.renderLine(line));
    }
    renderLine(line = '') {
        this.rendered += `${line}`;
    }
    render() {
        this.rendered = '';
        if (!_.includes(config_1.default.report.fullPath, 'group') && !_.includes(config_1.default.report.fullPath, 'feed')) {
            this.renderPrefix();
        }
        this.renderFeed();
        if (!_.includes(config_1.default.report.fullPath, 'group') && !_.includes(config_1.default.report.fullPath, 'feed')) {
            this.renderSuffix();
        }
    }
    /* API */
    run(save = config_1.default.report.save, open = config_1.default.report.open) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("run").call(this, save, open);
        });
    }
}
exports.rss = rss;
//# sourceMappingURL=rss.js.map