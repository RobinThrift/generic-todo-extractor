/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
import { Map } from 'immutable';
import { Plugin } from './plugins';
export declare type InterimTag = {
    tagName: string;
    scope: string;
    paramString: string;
    body: string;
};
export declare type Tag = {
    tagName: string;
    scope: string;
    params: Map<string, string>;
    body: string;
    meta: Object;
};
export declare function findTag(line: string): InterimTag;
export declare function paramsFromString(paramString: string): Map<string, string>;
export declare function parseLine(line: string, plugins: Map<string, Plugin>, lines: string[]): Tag;
export declare function parse(code: string, plugins?: Map<string, Plugin>): Tag[];
