///<reference path='../node_modules/immutable/dist/Immutable.d.ts'/>
import {Map} from 'immutable';
import * as debug from 'debug';
import {Plugin} from './plugins';
let d = debug('grumpf:parser');

export type InterimTag = {
    tagName: string,
    scope: string,
    paramString: string,
    body: string
}

export type Tag = {
    tagName: string,
    scope: string,
    params: Map<string, string>,
    body: string,
    meta: Object
}

const PATTERN = /(?:\/\/|\s*\*)\s*@([\S]+?)(?:\(([\s\S]+?)\))?(?::|\s)\s*([\S\s]*?)$/i;
export function findTag(line: string): InterimTag {
    let matches = PATTERN.exec(line);
    if (!matches) {
        return;
    }
    let tagName = matches[1],
        scope = matches[2] || '',
        paramString = '';

    if (scope && scope.indexOf('|') !== -1) {
        let p = scope.split('|');
        scope = p[0];
        paramString = p[1];
    }

    return {
        tagName: tagName.toLowerCase(),
        scope,
        paramString,
        body: matches[3]
    };
}


export function paramsFromString(paramString: string): Map<string, string> {
    if (paramString) {
        return paramString.split(',').reduce((reducer, param) => {
            let [name, value] = param.split(':');
            return reducer.set(name, value);
        }, Map<string, string>());
    } else {
        return Map<string, string>();
    }
}

export function parseLine(line: string, plugins = Map<string, Plugin>(), lines: string[]): Tag {
    let analysis = findTag(line);
    if (analysis) {
        let {tagName, scope, paramString, body} = analysis;
        let tag: Tag = {
            tagName,
            scope,
            body,
            params: paramsFromString(paramString),
            meta: {}
        };
        return plugins.reduce((tag, plugin, name) => {
            d(`applying plugin ${name} to ${tag}`);
            return plugin(tag, tag.params, lines);
        }, tag);
    } else {
        return null;
    }
}

import {compact} from 'lodash';
export function parse(code: string, plugins = Map<string, Plugin>()): Tag[] {
    return compact(code.split('\n').map((line, i, lines) => {
        return parseLine(line, plugins, lines);
    }));
}
