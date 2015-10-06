
import Q from 'q';
import {readFile} from 'fs';
import {join} from 'path';

var rf = Q.nfbind(readFile);

export function fixtureFiles(base, ...files) {
    var proms = [];
    files.forEach((file) => {
        proms.push(rf(join(__dirname, 'fixtures', base, file), 'utf8'));
    });

    return Q.all(proms);
}

export function fixtureFilePath(base, file) {
    return join(__dirname, 'fixtures', base, file);
}
