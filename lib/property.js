/**
 * Created by dachengsun on 2017/11/7.
 */
let typecast = require('typecast');
let rules = require('./rules');
let typeOf;

try {
    typeOf = require('type');
} catch (err) {
    typeOf = require('component-type');
}

/**
 * Expose Property
 */

module.exports = Property;

function Property (name, schema) {
    this.fns = [];
    this.name = name;
    // this.schema = schema;
    this._type = undefined;
    this.msg = 'validation failed for path ' + name;
}

Property.prototype = {

    use: function (fn) {
        this.fns.push([fn]);
        return this;
    },

    type: function (name, rule) {
        if(this._type){
            this._type += ',' + name;
        } else {
            this._type = name;
        }

        let checkFun = rules[name];

        if(typeOf(checkFun) != 'function'){
            return this.err = name + ' not in rules'
        }

        if(typeOf(checkFun(rule)) != 'function'){
            return this.err = checkFun(rule).err;
        }
        return this.use(checkFun(rule));
    },

    validate: function (value, ctx) {
        let fns = this.fns;
        debugger
        for (let i = 0; i < fns.length; i++) {
            let fn = fns[i];
            debugger;
            let valid = fn[0].call(ctx, value);
            if (!valid) {
                debugger;
                return error(this)
            };
        }

        return true;
    }

};

function error (prop) {
    let err = {
        message: prop.msg,
        path: prop.name
    }
    return err;
}
