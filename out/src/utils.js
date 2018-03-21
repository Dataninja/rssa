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
const absolute = require("absolute");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const pify = require("pify");
const requireAbsolute = require("require-absolute");
/* UTILS */
const Utils = {
    require: {
        json(filepath) {
            return JSON.parse(fs.readFileSync(filepath, { encoding: 'utf8' }));
        },
        js(filepath) {
            return absolute(filepath) ? requireAbsolute(filepath) : require(filepath);
        }
    },
    file: {
        make(filepath, content) {
            return __awaiter(this, void 0, void 0, function* () {
                yield pify(mkdirp)(path.dirname(filepath));
                return Utils.file.write(filepath, content);
            });
        },
        read(filepath) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return (yield pify(fs.readFile)(filepath, { encoding: 'utf8' })).toString();
                }
                catch (e) {
                    return;
                }
            });
        },
        write(filepath, content) {
            return __awaiter(this, void 0, void 0, function* () {
                return pify(fs.writeFile)(filepath, content, {});
            });
        }
    },
    feed: {
        /* WALK */
        walk(obj, objCallback, groupCallback, feedCallback, sortGroups = false, sortFeeds = false, config = Utils.feed.getConfig(obj), depth = 0) {
            if (obj.groups) {
                const groups = sortGroups ? _.sortBy(obj.groups, 'name') : obj.groups;
                groups.forEach(group => {
                    const newConfig = _.merge({}, config, Utils.feed.getConfig(group));
                    objCallback(group, newConfig, depth);
                    groupCallback(group, newConfig, depth);
                    Utils.feed.walk(group, objCallback, groupCallback, feedCallback, sortGroups, sortFeeds, newConfig, depth + 1);
                });
            }
            if (obj.feeds) {
                const feeds = sortFeeds ? _.sortBy(obj.feeds, 'url') : obj.feeds;
                feeds.forEach(feed => {
                    const newConfig = _.merge({}, config, Utils.feed.getConfig(feed));
                    objCallback(feed, newConfig, depth);
                    feedCallback(feed, newConfig, depth);
                });
            }
            if (obj.feed) {
                const newConfig = _.merge({}, config, Utils.feed.getConfig(obj.feed));
                objCallback(obj.feed, newConfig, depth);
                feedCallback(obj.feed, newConfig, depth);
            }
        },
        walkGroups(obj, callback, sortGroups) {
            Utils.feed.walk(obj, _.noop, callback, _.noop, sortGroups);
        },
        walkFeeds(obj, callback, sortFeeds) {
            Utils.feed.walk(obj, _.noop, _.noop, callback, undefined, sortFeeds);
        },
        /* CONFIG */
        getConfig(obj) {
            if (_.isString(obj))
                return Utils.feed.getConfig({ url: obj }); //FIXME: This probably shouldn't be here
            if (!_.isPlainObject(obj))
                return {};
            return _.omit(obj, ['groups', 'feeds']);
        }
    }
};
/* EXPORT */
exports.default = Utils;
//# sourceMappingURL=utils.js.map