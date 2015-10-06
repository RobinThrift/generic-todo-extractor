import {expect} from 'chai';
import {fixtureFilePath} from './helpers';
import {loadConfig} from '../dist/configLoader';

suite('GTE - Config Loader', () => {
    var jsonPath, tomlPath, yamlPath, expected;

    suiteSetup(() => {
        expected = {
            enabled: true,
            files: ["src/**.ts"],
            plugins: {
                lines: true,
                "fancy-plugin": {
                    config: "value",
                    other: 10
                }
            }
        };
        jsonPath = fixtureFilePath('config', 'sample.json');
        tomlPath = fixtureFilePath('config', 'sample.toml');
        yamlPath = fixtureFilePath('config', 'sample.yml');
    });

    test('json', (done) => {
        loadConfig(jsonPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });
    test('toml', (done) => {
        loadConfig(tomlPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });
    test('yaml', (done) => {
        loadConfig(yamlPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });
});
