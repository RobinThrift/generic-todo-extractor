import {expect} from 'chai';
import {Map} from 'immutable';
import {fixtureFilePath} from './helpers';

import {loadPlugins} from '../dist/plugins';

suite('Grumpf - Plugins', () => {
    let idPath = fixtureFilePath('plugins', 'id'),
        transformPath = fixtureFilePath('plugins', 'transform');

    let pluginMap = new Map({
        [idPath]: {},
        [transformPath]: {
            transform: 'uppercase'
        }
    });

    test('loadPlugins', () => {
        loadPlugins(pluginMap).map((pluginFn, name) => {
            if (name === idPath) {
                expect(pluginFn('blub')).to.equal('blub');
            } else {
                expect(pluginFn({tagName: 'fix'}).tagName).to.equal('FIX');
            }
        });
    });
});
