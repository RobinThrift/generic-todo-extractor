///<reference path='../node_modules/immutable/dist/Immutable.d.ts'/>

import {Map} from 'immutable';

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
    body: string
}

const PATTERN = /\/\/\s*@([\S]+?)(?:\(([\s\S]+?)\))?:\s*([\S\s]*?)$/i;
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

export function parse(line: string): Tag {
    let {tagName, scope, paramString, body} = findTag(line);
    return {
        tagName,
        scope,
        body,
        params: paramsFromString(paramString)
    };
}
