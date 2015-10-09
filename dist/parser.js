(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", 'immutable', 'debug', 'lodash'], function (require, exports) {
    ///<reference path='../node_modules/immutable/dist/immutable.d.ts'/>
    var immutable_1 = require('immutable');
    var debug = require('debug');
    var d = debug('grumpf:parser');
    var PATTERN = /(?:\/\/|\s*\*)\s*@([\S]+?)(?:\(([\s\S]+?)\))?(?::|\s)\s*([\S\s]*?)$/i;
    function findTag(line) {
        var matches = PATTERN.exec(line);
        if (!matches) {
            return;
        }
        var tagName = matches[1], scope = matches[2] || '', paramString = '';
        if (scope && scope.indexOf('|') !== -1) {
            var p = scope.split('|');
            scope = p[0];
            paramString = p[1];
        }
        return {
            tagName: tagName.toLowerCase(),
            scope: scope,
            paramString: paramString,
            body: matches[3]
        };
    }
    exports.findTag = findTag;
    function paramsFromString(paramString) {
        if (paramString) {
            return paramString.split(',').reduce(function (reducer, param) {
                var _a = param.split(':'), name = _a[0], value = _a[1];
                return reducer.set(name, value);
            }, immutable_1.Map());
        }
        else {
            return immutable_1.Map();
        }
    }
    exports.paramsFromString = paramsFromString;
    function parseLine(line, plugins, lines) {
        if (plugins === void 0) { plugins = immutable_1.Map(); }
        var analysis = findTag(line);
        if (analysis) {
            var tagName = analysis.tagName, scope = analysis.scope, paramString = analysis.paramString, body = analysis.body;
            var tag = {
                tagName: tagName,
                scope: scope,
                body: body,
                params: paramsFromString(paramString),
                meta: {}
            };
            return plugins.reduce(function (tag, plugin, name) {
                d("applying plugin " + name + " to " + tag);
                return plugin(tag, tag.params, lines);
            }, tag);
        }
        else {
            return null;
        }
    }
    exports.parseLine = parseLine;
    var lodash_1 = require('lodash');
    function parse(code, plugins) {
        if (plugins === void 0) { plugins = immutable_1.Map(); }
        return lodash_1.compact(code.split('\n').map(function (line, i, lines) {
            return parseLine(line, plugins, lines);
        }));
    }
    exports.parse = parse;
});
