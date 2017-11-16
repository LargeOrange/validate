/**
 * Created by dachengsun on 2017/11/8.
 */

let Schema = require('../lib/schema');
let Property = require('../lib/property');
let should = require('should');
describe('Schema', function () {
    describe('1 when given an object', function () {
        it('1.1should create properties', function () {
            let schema = new Schema({ name: { type: 'string' }});
            schema.props.should.have.property('name');
        })

        it('1.2 should create nested properties', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string' }
                }
            });
            schema.props.should.have.property('name');
            schema.props.should.have.property('name.first');
            schema.props.should.have.property('name.last');
        });

        it('1.3 should pass full path to properties', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string' }
                }
            });
            schema.props['name'].name.should.equal('name');
            schema.props['name.first'].name.should.equal('name.first');
            schema.props['name.last'].name.should.equal('name.last');
        })

        it('1.4 should return error when rule length.length == 0', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string', length:[]}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('length should input arry which length >=1 && <=2');
            schema[0].path.should.eql('name.last');
        })

        it('1.5 should return error when rule length.length > 2', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string', length:[]}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('length should input arry which length >=1 && <=2');
            schema[0].path.should.eql('name.last');
        });

        it('1.6 should return error when rule allow not an array', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string', allow: '2331'}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('allow should input arry which length >=1');
            schema[0].path.should.eql('name.last');
        })

        it('1.7 should return error when rule allow is empty array', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string', allow: []}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('allow should input arry which length >=1');
            schema[0].path.should.eql('name.last');
        })

        it('1.8 should return error when type allow not string/number', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'adsd' },
                    last: { type: 'string'}
                }
            });

            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('type should input "number"/"string"/"object"');
            schema[0].path.should.eql('name.first');
        })

        it('1.9 should return error when min allow not number', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string', min: 'aa'},
                    last: { type: 'string'}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('min should input a number');
            schema[0].path.should.eql('name.first');
        })

        it('1.10 should return error when max allow not number', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string', max: 'aa'},
                    last: { type: 'string'}
                }
            });

            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('max should input a number');
            schema[0].path.should.eql('name.first');
        })

        it('1.11 should return error when rule not in rules', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string', ma: 'aa'},
                    last: { type: 'string'}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('name.first规则定义有错误');
            schema[0].path.should.eql('name.first');
        })

        it('1.12 when init input not a object', function () {
            let schema = new Schema('123');
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('init schema should input object');
            schema[0].path.should.eql('ALL');
        })

        it('1.13 should return error when rule length member not num', function () {
            let schema = new Schema({
                name: {
                    first: { type: 'string' },
                    last: { type: 'string', length:['2', '5']}
                }
            });
            schema.should.be.an.Array;
            schema.length.should.eql(1);
            schema[0].message.should.eql('length must be a num and >= 0');
            schema[0].path.should.eql('name.last');
        })
    })

    describe('2 .path()', function () {
        describe('2.1 when given a path and an object', function () {
            it('should create properties', function () {
                let schema = new Schema({});
                schema.path('name', { type: 'string' });
                schema.props.should.have.property('name');
            })

            it('2.2 should support nested properties', function () {
                let schema = new Schema({});
                schema.path('name', { first: { type: 'string' }});
                schema.props.should.have.property('name.first');
            })

            it('2.3 should register validators', function () {
                let schema = new Schema({});
                schema.path('name', { first: { required: true }});
                console.log(schema.validate({}));
                schema.validate({}).should.have.length(1);
            })

            it('2.4 should return a Property', function () {
                let schema = new Schema({});
                schema.path('name', { type: 'string' })
                    .should.be.instanceOf(Property)
                    .and.have.property('name', 'name');
            })
        })
    })

    describe('3 .validate()', function () {
        it('3.1 should return an array of errors', function () {
            let schema = new Schema({ name: { type: 'string' }});
            let res = schema.validate({ name: 123 });
            // console.log(res);
            res.should.be.an.Array;
            res.length.should.eql(1);
            res[0].message.should.eql('validation failed for path name');
            res[0].path.should.eql('name');
        })

        it('3.2 should return error when has key not in schema', function () {
            let obj = { name: 'name', age: 23 };
            let schema = new Schema({ name: { type: 'string' }});
            let res = schema.validate(obj);
            // // console.log('81', res);
            res.should.be.an.Array;
            res.length.should.eql(1);
            res[0].message.should.eql('age not in schema');
            res[0].path.should.eql('age');
        });

        it('3.3 should return error when key which required not in obj', function () {
            let obj = { name: 'name'};
            let schema = new Schema(
                {
                    name: { type: 'string', required: true},
                    age: {type: 'number', required: true}
                });
            let res = schema.validate(obj);
            res.should.be.an.Array;
            res.length.should.eql(1);
            res[0].message.should.eql('validation failed for path age');
            res[0].path.should.eql('age');
        });

        describe('3.4 should return right value when key match with rule in obj', function () {

            it('3.4.1 type match', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

            it('3.4.2 type not match (string)', function () {
                let obj = { name: 123, age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path name');
                res[0].path.should.eql('name');
            })

            it('3.4.3 type not match (number)', function () {
                let obj = { name: '123', age: '12a'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path age');
                res[0].path.should.eql('age');
            })

            it('3.4.4 required not match', function () {
                let obj = { name: '123'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path age');
                res[0].path.should.eql('age');
            })

            it('3.4.5 required match', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

            it('3.4.6 length match when length.length == 1', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [3]},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

            it('3.4.6.1 length not match when key type not string or array', function () {
                let obj = { name: {}, age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [3]},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path name');
                res[0].path.should.eql('name');
            })

            it('3.4.7 length not match when length.length == 1', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [4]},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path name');
                res[0].path.should.eql('name');
            })

            it('3.4.8 length match when length.length == 2', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [2,6]},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

            it('3.4.9 length not match when length.length == 2(less)', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [4, 6]},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path name');
                res[0].path.should.eql('name');
            })

            it('3.4.10 length not match when length.length == 2(more than)', function () {
                let obj = { name: '12312345', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [4, 6]},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path name');
                res[0].path.should.eql('name');
            })

            it('3.4.10.1 length not match when length.length == 2(more than)', function () {
                let obj = { name: '12312345', age: 12};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, length: [4, 'aa']},
                        age: {type: 'number', required: true}
                    });
                schema.should.be.an.Array;
                schema.length.should.eql(1);
                schema[0].message.should.eql('length must be a num and >= 0');
                schema[0].path.should.eql('name');
            })

            it('3.4.11 min not match', function () {
                let obj = { name: '12312345', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true, min: 14}
                    });
                let res = schema.validate(obj);
                // console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path age');
                res[0].path.should.eql('age');
            })

            it('3.4.12 min  match', function () {
                let obj = { name: '12312345', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true, min: 10}
                    });
                let res = schema.validate(obj);
                // console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })
            it('3.4.13 max match', function () {
                let obj = { name: '12312345', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true, max: 14}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);

            })

            it('3.4.14 max not match', function () {
                let obj = { name: '12312345', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true, max: 10}
                    });
                let res = schema.validate(obj);
                // console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path age');
                res[0].path.should.eql('age');
            })

            it('3.4.15 input not match allow', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, allow: ['12', '13']},
                        age: {type: 'number', required: true,}
                    });
                let res = schema.validate(obj);
                // console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path name');
                res[0].path.should.eql('name');
            })

            it('3.4.16 input match allow', function () {
                let obj = { name: '123', age: '12'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, allow: ['123', '321']},
                        age: {type: 'number', required: true}
                    });
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);

            })

            it('3.4.16.1 when allowlist have member not string or number or object', function () {
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true, allow: [true, '321']},
                        age: {type: 'number', required: true}
                    });
                console.log(schema);
                schema.should.be.an.Array;
                schema.length.should.eql(1);
                schema[0].message.should.eql('member in allow should be string or number or object');
                schema[0].path.should.eql('name');
            })

            it('3.4.20 input is not objetc (not null) when schema nested', function () {
                let obj = { name: '123', age: '12', address:'123'};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true},
                        address: {
                            age:{type: 'number', required: false, min: 11},
                            street: {type: 'string', required: false,},
                            city: {type: 'string', required: false},
                            other: {
                                other1: {type: 'string', required: false},
                                other2: {type: 'string', required: false},
                            }
                        },
                    });
                let res = schema.validate(obj);
                console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path address');
                res[0].path.should.eql('address');
            })

            it('3.4.21 input is null when schema nested and key in nested required is false', function () {
                let obj = { name: '123', age: '12', address:null};
                let schema = new Schema(
                    {
                        name: { type: 'string', required: true},
                        age: {type: 'number', required: true},
                        address: {
                            age:{type: 'number', required: false, min: 11},
                            street: {type: 'string', required: false,},
                            city: {type: 'string', required: false},
                            other: {
                                other1: {type: 'string', required: false},
                                other2: {type: 'string', required: false},
                            }
                        },
                    });
                // console.log(schema)
                let res = schema.validate(obj);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

        })

        describe('3.10 some rule about array', function () {
            it ('3.10.1 can created a schema', function () {
                let schema = new Schema({
                    sidList : {
                        type: 'array',
                        arrayRules: {
                            sid: {type: 'number', required: true},
                            sid2: {type: 'number', required: true}
                        }
                    }
                })
                schema.props.should.have.property('sidList');

                let schema1 = new Schema({
                    sidList : [{type: 'number', required: true,}]
                })
                schema1.props.should.have.property('sidList');
            })

            it ('3.10.2 when inputObj can match schema（array里面是json）', function () {
                let schema = new Schema({
                    sidList : {
                        type: 'array',
                        arrayRules: {
                            sid: {type: 'number', required: true},
                            sid2: {type: 'number', required: true}
                        },
                        // required: true,
                    }
                })

                let inputObj = {
                    sidList: [{sid: '12345678901', sid2: '12345678901'}]
                };
                schema.props.should.have.property('sidList');
                // console.log(schema);
                let res = schema.validate(inputObj);
                // console.log(res);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

            it ('3.10.3 when inputObj can not match schema(缺少字段)', function () {
                let schema = new Schema({
                    sidList : {
                        type: 'array',
                        arrayRules: {
                            sid: {type: 'number', required: true},
                            sid2: {type: 'number', required: true}
                        }
                    }
                })

                let inputObj = {
                    sidList: [{sid: '12345678901'}]
                };
                schema.props.should.have.property('sidList');
                let res = schema.validate(inputObj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path sidList');
                res[0].path.should.eql('sidList');
            })

            it ('3.10.4 when inputObj can not match schema(多了字段)', function () {
                let schema = new Schema({
                    sidList : {
                        type: 'array',
                        arrayRules: {
                            sid: {type: 'number', required: true},
                            sid2: {type: 'number', required: true}
                        }
                    }
                })

                let inputObj = {
                    sidList: [{sid: '12345678901', sid2: '12345678901', sid3: '1234321212122'}]
                };
                schema.props.should.have.property('sidList');
                console.log(schema);
                let res = schema.validate(inputObj);
                res.should.be.an.Array;
                res.length.should.eql(1);
                res[0].message.should.eql('validation failed for path sidList');
                res[0].path.should.eql('sidList');
            })

            it ('3.10.5 when inputObj can match schema(array 里面是字符串或者数字)', function () {
                let schema = new Schema({
                    sidList : {
                        type: 'array',
                        arrayRules: {
                            type: 'number', required: true
                        }
                    }
                })

                let inputObj = {
                    sidList: ['12345678901', '12345678901']
                };
                // console.log(schema);
                schema.props.should.have.property('sidList');
                let res = schema.validate(inputObj);
                res.should.be.an.Array;
                res.length.should.eql(0);
            })

            it ('3.10.6 when inputObj can not match schema(array 里面是字符串或者数字)', function () {
                let schema = new Schema({
                    sidList : {
                        type: 'array',
                        arrayRules: {
                            type: 'number', required: true
                        }
                    }
                })

                let inputObj = {
                    sidList: ['12345678901', '12345678901', '12345678900987']
                };
                schema.props.should.have.property('sidList');
                let res = schema.validate(inputObj);
                res.should.be.an.Array;
                res.length.should.eql(0);

            })

        })
    });

});


