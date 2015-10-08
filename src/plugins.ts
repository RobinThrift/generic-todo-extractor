///<reference path='../node_modules/immutable/dist/Immutable.d.ts'/>
///<reference path='../typings/tsd.d.ts'/>
import {Map} from 'immutable';
import {Tag} from './parser';
import * as debug from 'debug';
let d = debug('grumpf:plugins');

export interface Plugin {
    (tag: Tag, params: Map<string, string>, lines: string[]): Tag
}

interface PluginContainer {
    (config: Object): Plugin
}

const SUFFIXES = ['', '-grumpf-plugin', '-grumpf'];
export function loadPlugins(plugins: Map<string, Object>) {
    return plugins.map((config, name) => {
        let plugin: Plugin = null,
            found = false,
            errored = false;
        SUFFIXES.forEach((suffix) => {
            if (!found) {
                try {
                    d(`trying to require file: ${name}${suffix}`);
                    plugin = require(`${name}${suffix}`)(config);
                    found = true;
                } catch (e) {
                }
            }
        });
        if (!found) {
            throw Error(`Can\'t find plugin with name "${name}"`)
        } else {
            return plugin;
        }
    });
}
