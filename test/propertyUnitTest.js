/**
 * Created by dachengsun on 2017/11/8.
 */
let Property = require('../lib/property');
let Schema = require('../lib/schema');
let should = require('should')

describe('Property', function () {
    it('1 should have a name', function () {
        let prop = new Property('test', Schema());
        prop.name.should.eql('test');
    });

    describe('2 .use()', function () {
        it('2.1 should work', function () {
            let prop = new Property('test', Schema());
            prop.use(function () { return false; });
            let res = prop.validate(1);
            res.message.should.eql('validation failed for path test');
            res.path.should.eql('test');
        })

        it('2.2 should support chaining', function () {
            let prop = new Property('test', Schema());
            prop.use(function () {}).should.eql(prop);
        });
    })

    describe('3 .type()', function () {
        it('3.1 should work', function () {
            let prop = new Property('test', Schema());
            prop.type('type', 'string');
            prop.validate(1).message.should.eql('validation failed for path test');
            prop.validate(1).path.should.eql('test');
            // console.log(prop.validate(null));
            prop.validate('test').should.eql(true);
            prop.validate(null).should.eql(true);
        })

        it('3.2 should have a `_type` property', function () {
            let prop = new Property('test', Schema());
            prop.type('type');
            prop._type.should.eql('type');
        })

        it('3.3 should add an err not in rules', function () {
            let prop = new Property('test', Schema());
            prop.type('string');
            // console.log(prop);
            prop.err.should.eql('string not in rules')
        })
    })

    describe('4 .validate()', function () {
        it('4.1 should work', function () {
            let prop = new Property();
            prop.type('type', 'string');
            prop.type('required', true);
            let res = prop.validate(null);
            res.message.should.eql('validation failed for path undefined');
        });

        it('4.2 errors should have a .path', function () {
            let prop = new Property('some.path');
            prop.type('type', 'string');
            prop.type('required', true);
            // prop.required();
            prop.validate(null).path.should.equal('some.path');
        })
    });
})
