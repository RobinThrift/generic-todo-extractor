///<reference path='../node_modules/immutable/dist/Immutable.d.ts'/>
///<reference path='../typings/tsd.d.ts'/>
import * as debug from 'debug';
var d = debug('gte:conigLoader');

import {Promise, nfbind} from 'q';
import {readFile} from 'fs';
var rf = nfbind(readFile);


//@feat(config): add support for file type header
const ENDING = /\.(.*)$/
function getFileEnding(path): string {
    let match = ENDING.exec(path);
    if (match) {
        return match[1].toLowerCase();
    } else {
        return '';
    }
}

function loadFile(path: string) {
    return rf(path, 'utf8');
}

function loadJSON(contents: string, resolve: Function, reject: Function) {
    try {
        resolve(JSON.parse(contents));
    } catch (e) {
        reject(e);
    }
}

///<reference path='./toml.ts'/>
import toml = require('toml');
function loadToml(contents: string, resolve: Function, reject: Function) {
    try {
        resolve(toml.parse(contents));
    } catch (e) {
        reject(e);
    }
}

import {safeLoad} from 'js-yaml';
function loadYaml(contents: string, resolve: Function, reject: Function) {
    try {
        resolve(safeLoad(contents));
    } catch (e) {
        reject(e);
    }
}


export function loadConfig(path) {
    return Promise((resolve, reject) => {
        loadFile(path)
            .then((contents) => {
                switch (getFileEnding(path)) {
                    case 'json':
                        loadJSON(contents as string, resolve, reject);
                        break;
                    case 'toml':
                        loadToml(contents as string, resolve, reject);
                        break;
                    case 'yaml':
                    case 'yml':
                        loadYaml(contents as string, resolve, reject);
                        break;
                    default:
                        reject(new Error('Config Format not supported'));
                }
            }, reject);
    });
}

