
import {expect} from 'chai';
import {fixtureFiles} from './helpers';
import {parse, findTag, paramsFromString} from '../dist/parser';
import {Map} from 'immutable';

suite('GTE - Parser', () => {
    test('findTag', () => {
        let tagA = findTag('@GET("/users") // @fix(getAll): fix the url'),
            tagB = findTag('//@feat(getById|lines:+10): Add a method that gets a user by id'),
            tagC = findTag('//@fix: this is a bit hacky'),
            tagD = findTag('class UserService extends HTTPService {');

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
    });

    test('paramsFromString', () => {
        let p = paramsFromString('lines:+10,flag:false,ln:10');

        expect(p.equals(new Map({
            lines: '+10',
            flag: 'false',
            ln: '10'
        }))).to.be.true;
    });

    test('parse', () => {
        let tagA = parse('@GET("/users") // @fix(getAll): fix the url'),
            tagB = parse('//@FEAT(getById|lines:+10): Add a method that gets a user by id'),
            tagC = parse('//@FiX(getById|lines:+10,ln:30): this is all a big boo boo');

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
});
