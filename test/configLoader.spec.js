import {expect} from 'chai';
import {fixtureFilePath} from './helpers';
import {loadConfig} from '../dist/configLoader';

suite('GTE - Config Loader', () => {
    var jsonPath, tomlPath, yamlPath, 
        dotJSONPath, dotTomlPath, dotYamlPath,
        expected;

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
        jsonPath    = fixtureFilePath('config', 'sample.json');
        dotJSONPath = fixtureFilePath('config', '.sampleJSON');
        tomlPath    = fixtureFilePath('config', 'sample.toml');
        dotTomlPath = fixtureFilePath('config', '.sampleTOML');
        yamlPath    = fixtureFilePath('config', 'sample.yml');
        dotYamlPath = fixtureFilePath('config', '.sampleYAML');
    });

    test('json extension', (done) => {
        loadConfig(jsonPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });
    test('json file header', (done) => {
        loadConfig(dotJSONPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });

    test('toml extension', (done) => {
        loadConfig(tomlPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });
    test('toml file header', (done) => {
        loadConfig(dotTomlPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });

    test('yaml extension', (done) => {
        loadConfig(yamlPath)
            .done((config) => {
                expect(config).to.deep.equal(expected);
                done();
            }, done);
    });
});
