/**
 * Created by dachengsun on 2017/11/8.
 */
let AJKModel = require('../index');
let Model = AJKModel.AJKModel;
let should = require('should');

describe('model', function () {
    describe('1 array test', function () {
        it('1.1 when schema have array and have not arrayRules', function () {
            let schema = {
                data: { type: 'array'}
            }
            let inputObj = {
                data:[]
            }
            let res = Model.validate(schema, inputObj)
            res.code.should.eql('100')
        })
        it('1.2 when schema have array and arrayRules is required but input array is empty', function () {
            let schema = {
                data: { type: 'array',arrayRules: {type: 'string', required: true}}
            }
            let inputObj = {
                data:[]
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('100')
        })
        it('1.3 when schema have array and arrayRules is number', function () {
            let schema = {
                data: { type: 'array',arrayRules: {type: 'number', required: true}}
            }
            let inputObj = {
                data:[]
            }
            let res = Model.validate(schema, inputObj);
            console.log(res)
            res.code.should.eql('100')
        })
        it('1.4 when schema have array and arrayRules is array', function () {
            let schema = {
                data: { type: 'array',arrayRules:{ name:{type: 'array', arrayRules :{type:'number',required: true}}}}
            }
            let inputObj = {
                data: [{name:[]}]
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('100')
        })
        it('1.5 when schema have array and arrayRules is array', function () {
            let schema = {
                data: { type: 'array',arrayRules:{
                    name:{
                        type: 'array',
                        arrayRules :{
                            type:'number',required: true
                        }
                    }
                }}
            }
            let inputObj = {
                data: [{}]
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('4000')
        })
        it('1.6 when schema have array and have length', function () {
            let schema = {
                data: { type: 'array',arrayRules:{},length:[0]}
            }
            let inputObj = {
                data: []
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('100')
        })
        it('1.8 when schema have array and have min', function () {
            let schema = {
                data: { type: 'array',arrayRules:{},min:0}
            }
            let inputObj = {
                data: []
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('100')
        })
        it('1.9 when schema have array and have allow', function () {
            let schema = {
                data: { type: 'array',arrayRules:{},allow:[0]}
            }
            let inputObj = {
                data: []
            }
            let res = Model.validate(schema, inputObj);
            console.log(res)
            res.code.should.eql('4000')
        })
        it('1.10 when schema have array and have allow', function () {
            let schema = {
                data: { type: 'number'}
            }
            let inputObj = {
                data: []
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('4000')
        })
        it('1.11 when schema have number and required is wrong', function () {
            let schema = {
                data: { type: 'number', required: 123}
            }
            let inputObj = {
                data: 123
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('4000')
        })
        it('1.12 when schema have number and required is wrong', function () {
            let schema = {
                data: { type: 'number', required: undefined}
            }
            let inputObj = {
                data: 123
            }
            let res = Model.validate(schema, inputObj)
            console.log(res)
            res.code.should.eql('4000')
        })
    })
});