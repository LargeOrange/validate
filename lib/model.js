/**
 * Created by dachengsun on 2017/11/6.
 */

let model = {};
let Schema = require('./schema');
let typeOf,dot;

try {
    typeOf = require('type');
    dot = require('dot');
} catch (err) {
    typeOf = require('component-type');
    dot = require('eivindfjeldstad-dot');
}

model.validate = function (schema, checkData) {

    let dataSchema = new Schema(schema);
    // console.log(dataSchema);
    if (typeOf(dataSchema) == 'array'){
        return {
            code: '4000',
            message: JSON.stringify(dataSchema)
        }
    }
    let res = dataSchema.validate(checkData);
    if(res.length == 0){
        return {
            code: '100',
        }
    } else {
        return {
            code: '4000',
            message: JSON.stringify(res)
        }
    }
};

module.exports = model;


