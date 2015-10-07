///<reference path='../node_modules/immutable/dist/Immutable.d.ts'/>
///<reference path='../typings/tsd.d.ts'/>
import * as debug from 'debug';
var d = debug('gte:conigLoader');

import {Promise, nfbind} from 'q';
import {readFile} from 'fs';
var rf = nfbind(readFile);

import {Map} from 'immutable';
export type Config = {
    enabled: boolean,
    files: string[],
    plugins: Map<string, Object>
}

//@feat(config): add support for file type header
const ENDING = /[\w\-]+\.(.+)$/;
function fileExtension(path: string): string {
    let match = ENDING.exec(path);
    if (match) {
        return match[1].toLowerCase();
    } else {
        return '';
    }
}

const FILE_TYPE_HEADER = /^#\s*([a-z]+)\n/i;
function fileHeader(contents: string): string {
    let match = FILE_TYPE_HEADER.exec(contents);
    if (match) {
        return match[1].toLowerCase();
    } else {
        return '';
    }
}

function fileType(path: string, contents: string): string {
    let ftype = fileExtension(path);
    if (!ftype) {
        ftype = fileHeader(contents);
    }
    return ftype;
}

function loadFile(path: string) {
    return rf(path, 'utf8');
}

type ParseResult = {
    value?: string,
    error?: Error
}

function loadJSON(contents: string): ParseResult {
    var res = {value: null, error: null};
    try {
        res.value = JSON.parse(contents);
    } catch (e) {
        res.error = e;
    }
    return res;
}

///<reference path='./toml.d.ts'/>
import toml = require('toml');
function loadToml(contents: string): ParseResult {
    var res = {value: undefined, error: null};
    try {
        res.value = toml.parse(contents);
    } catch (e) {
        res.error = e;
    }
    return res;
}

import {safeLoad} from 'js-yaml';
function loadYaml(contents: string): ParseResult {
    var res = {value: undefined, error: null};
    try {
       res.value = safeLoad(contents);
    } catch (e) {
        res.error = e;
    }
    return res;
}

function parseFile(ending: string, contents: string): ParseResult {
    contents = contents.replace(FILE_TYPE_HEADER, '');
    switch (ending) {
        case 'json':
            return loadJSON(contents as string);
            break;
        case 'toml':
            return loadToml(contents as string);
            break;
        case 'yaml':
        case 'yml':
            return loadYaml(contents as string);
            break;
        default:
            return new Error('Config Format not supported');
    }
}


const DEFAULTS: Config = {
    enabled: true,
    files: [],
    plugins: Map<string, Object>()
};

import {forEach, reduce, clone} from 'lodash';
function sanitizeConfig(dirty): Config {
    let clean: Config = clone(DEFAULTS);
    forEach(dirty, (value, key) => {
        if (key === 'plugins') {
            clean.plugins = reduce(dirty.plugins, (plugins, config, name) => {
                if (typeof config === 'boolean') {
                    config = {};
                }
                return plugins.set(name, config);
            }, clean.plugins);
        } else {
            clean[key] = value;
        }
    });
    return clean;
}

export function loadConfig(path) {
    return Promise((resolve, reject) => {
        loadFile(path)
            .then((contents) => {
                let ftype = fileType(path, contents as string);
                if (!ftype) {
                    return reject(new Error('Can\'t determine file type'));
                } else {
                    let {value, error} = parseFile(ftype, contents as string);
                    if (error) {
                        reject(error);
                    } else {
                        resolve(sanitizeConfig(value));
                    }
                }
            }, reject);
    });
}

