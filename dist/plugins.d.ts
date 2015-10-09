/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
import { Map } from 'immutable';
import { Tag } from './parser';
export interface Plugin {
    (tag: Tag, params: Map<string, string>, lines: string[]): Tag;
}
