
import {expect} from 'chai';
import {fixtureFiles} from './helpers';
import {parse, parseLine, findTag, paramsFromString} from '../dist/parser';
import {Map} from 'immutable';

suite('Grumpf - Parser', () => {
    test('findTag', () => {
        let tagA = findTag('@GET("/users") // @fix(getAll): fix the url'),
            tagB = findTag('//@feat(getById|lines:+10): Add a method that gets a user by id'),
            tagC = findTag('//@fix: this is a bit hacky'),
            tagD = findTag('class UserService extends HTTPService {'),
            tagE = findTag('//@fix this is a bit hacky'),
            tagF = findTag('//@fix(scope) this is a bit hacky'),
            tagG = findTag('* @refactor(everything|lines:+30): because mark wrote it'),
            tagH = findTag(' * @fix: mark breaks everything');


        expect(tagA).to.deep.equal({
            tagName: 'fix',
            scope: 'getAll',
            body: 'fix the url',
            paramString: ''
        });
        expect(tagB).to.deep.equal({
            tagName: 'feat',
            scope: 'getById',
            body: 'Add a method that gets a user by id',
            paramString: 'lines:+10'
        });
        expect(tagC).to.deep.equal({
            tagName: 'fix',
            scope: '',
            body: 'this is a bit hacky',
            paramString: ''
        });
        expect(tagD).to.be.undefined;
        expect(tagE).to.deep.equal({
            tagName: 'fix',
            scope: '',
            body: 'this is a bit hacky',
            paramString: ''
        });
        expect(tagF).to.deep.equal({
            tagName: 'fix',
            scope: 'scope',
            body: 'this is a bit hacky',
            paramString: ''
        });
        expect(tagG).to.deep.equal({
            tagName: 'refactor',
            scope: 'everything',
            body: 'because mark wrote it',
            paramString: 'lines:+30'
        });
        expect(tagH).to.deep.equal({
            tagName: 'fix',
            scope: '',
            body: 'mark breaks everything',
            paramString: ''
        });
    });

    test('paramsFromString', () => {
        let p = paramsFromString('lines:+10,flag:false,ln:10');

        expect(p.equals(new Map({
            lines: '+10',
            flag: 'false',
            ln: '10'
        }))).to.be.true;
    });

    test('parseLine', () => {
        let tagA = parseLine('@GET("/users") // @fix(getAll): fix the url'),
            tagB = parseLine('//@FEAT(getById|lines:+10): Add a method that gets a user by id'),
            tagC = parseLine('//@FiX(getById|lines:+10,ln:30): this is all a big boo boo');

        expect(tagA).to.deep.contain({
            tagName: 'fix',
            scope: 'getAll',
            body: 'fix the url'
        });
        expect(tagA.params.size).to.equal(0);
        expect(tagB).to.deep.contain({
            tagName: 'feat',
            scope: 'getById',
            body: 'Add a method that gets a user by id'
        });
        expect(tagB.params.get('lines')).to.equal('+10');
        expect(tagC).to.deep.contain({
            tagName: 'fix',
            scope: 'getById',
            body: 'this is all a big boo boo'
        });
        expect(tagC.params.get('ln')).to.equal('30');
    });

    test('parse', () => {
        let tags = parse([
                    '//@feat(getById|lines:+10): Add a method that gets a user by id',
                    '@GET("/users") // @fix(getAll): fix the url',
                    '//@fix: this is a bit hacky',
                    '* @refactor(everything|lines:+30): because mark wrote it',
                    'class Something extends SomethingElse {'
                    ].join('\n'));

        expect(tags.length).to.equal(4);
    });

    test('parse with plugins', () => {
        let plugins = new Map({
            transform: (tag, params, lines) => {
                tag.tagName = tag.tagName.toUpperCase();
                return tag;
            },
            meta: (tag, params, lines) => {
                tag.meta.bar = lines[0].indexOf('/');
                return tag;
            }
        });
        let tags = parse(
                        '//@feat(getById|lines:+10): Add a method that gets a user by id',
                        plugins
                    );

        expect(tags[0].tagName).to.equal('FEAT');
        expect(tags[0].meta.bar).to.equal(0);
    });
});
