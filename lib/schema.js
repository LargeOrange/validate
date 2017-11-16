/**
 * Created by dachengsun on 2017/11/7.
 */
let Property = require('./property');
let modelRules = require('./rules');
let typeOf, dot;
try {
    typeOf = require('type');
    dot = require('dot');
} catch (err) {
    typeOf = require('component-type');
    dot = require('eivindfjeldstad-dot');
}

module.exports = schema;

function schema(obj) {

    this.props = {};
    if(typeOf(obj) != 'object'){
        return [error({msg: 'init schema should input object', name: 'ALL'})]
    }
    for (let key in obj){

        if (!obj.hasOwnProperty(key)) continue;
        let res = this.path(key, obj[key]);

        if (res.err) {

            delete this.props;
            return [error({msg: res.err, name: res.name})]
        }
    }
}

schema.prototype.path = function(path, rules) {
    let nested = false;
    let prop = this.props[path] ||new Property(path, this);

    this.props[path] = prop;

    if (!rules) return prop;
    nested = isNested(rules, prop)


    for (let key in rules) {

        if (rules.type == 'array') {
            break;
        }
        if (!rules.hasOwnProperty(key)) continue;

        if (nested) {

            if (typeof(rules[key]) != 'object'){

                let err = path + '规则定义有错误';
                prop.err = err
                return prop;
            }
            let res = this.path(join(key, path), rules[key]);
            if (res.err) {
                return res;
            }
            continue;
        }

        let rule = rules[key];

        if(prop.err){
            return prop;
        }

        prop['type'].apply(prop, [key, rule]);
    }

    if(nested && !'array' == rules.type) {
        prop['type'].apply(prop, ['type', 'object']);
    }
    // if (isArray) {
    //     debugger;
    //     let arrRule = {};
    //     if (!rules.arrayRules || JSON.stringify(rules.arrayRules) == '{}'){
    //         rules.arrayRules = {required: false};
    //     }
    //     if (isNested(rules.arrayRules, prop)) {
    //         arrRule = new schema(rules.arrayRules);
    //     } else {
    //         let arrPro = new Property(path, this);
    //         for (let key in rules.arrayRules){
    //             let rule = rules.arrayRules[key];
    //             arrPro['type'].apply(arrPro, [key, rule]);
    //         }
    //
    //         arrRule = arrPro;
    //     }
    //
    //     if(isNested(rules.arrayRules, prop)) {
    //         for (let key in rules.arrayRules) {
    //             let rule = rules.arrayRules[key];
    //             if (rule.required !== false ) {
    //                 prop['type'].apply(prop, ['required', true]);
    //                 break;
    //             }
    //         }
    //     } else {
    //         // console.log(115, rules.arrayRules.required);
    //         if(rules.arrayRules.required !== false) {
    //             prop['type'].apply(prop, ['required', true]);
    //         }
    //     }
    //     prop['type'].apply(prop, ['array', arrRule])
    //
    //     delete rules.type;
    //     delete rules.arrayRules;
    //     // 绑定其他rule
    //     for (let key in rules) {
    //         let rule = rules[key];
    //
    //         prop['type'].apply(prop, [key, rule]);
    //
    //         if(prop.err){
    //             return prop;
    //         }
    //     }
    // }

    if ('array' == rules.type) {
        prop = addRuleAboutArrary(rules, prop, path);
        if (prop.err){
            return prop;
        }
    }
    if(rules.required == undefined && !nested && !'array' == rules.type){
        prop['type'].apply(prop, ['required', true]);
    }

    return prop;
};

function isNested(rules, prop) {

    for (let key in rules) {
        if ('array' == rules.type) break;
        if (!rules.hasOwnProperty(key)) continue;
        if ('function' == typeof prop[key]) continue;
        if ('function' == typeOf(modelRules[key])) continue;
        return true;
        break;
    }
    return false
}

function addRuleAboutArrary(rules, prop, path) {
    let arrRule = {};

    if (!rules.arrayRules || JSON.stringify(rules.arrayRules) == '{}'){
        rules.arrayRules = {required: false};
    }

    if (isNested(rules.arrayRules, prop)) {
        arrRule = new schema(rules.arrayRules);
    } else {
        let arrPro = new Property(path, this);
        for (let key in rules.arrayRules){
            let rule = rules.arrayRules[key];
            arrPro['type'].apply(arrPro, [key, rule]);
        }

        arrRule = arrPro;
    }

    if(isNested(rules.arrayRules, prop)) {
        for (let key in rules.arrayRules) {
            let rule = rules.arrayRules[key];
            if (rule.required !== false ) {
                prop['type'].apply(prop, ['required', true]);
                break;
            }
        }
    } else {
        // console.log(115, rules.arrayRules.required);
        if(rules.arrayRules.required !== false) {
            prop['type'].apply(prop, ['required', true]);
        }
    }
    prop['type'].apply(prop, ['array', arrRule])

    delete rules.type;
    delete rules.arrayRules;
    // 绑定其他rule
    for (let key in rules) {
        let rule = rules[key];

        prop['type'].apply(prop, [key, rule]);

        if(prop.err){
            return prop;
        }
    }

    return prop;
}

schema.prototype.validate = function (obj) {
    debugger
    var errors = [];

    let stripRes = this.strip(obj);

    if(stripRes.length > 0){
        return stripRes;
    }
    for (var key in this.props) {
        var prop = this.props[key];
        var value = dot.get(obj, key);
        var err = prop.validate(value, obj);
        if (typeOf(err) == 'object') {
            errors.push(err)
        };
    }

    return errors;
};

schema.prototype.strip = function (obj, prefix) {

    let errors = [];
    for (let key in obj) {
        let path = join(key, prefix);

        if (!obj.hasOwnProperty(key)) continue;

        if (!this.props[path]) {

            errors.push(error({
                msg : path + ' not in schema',
                name: path
            }))
        }

        if (typeOf(obj[key]) == 'object') {
            let res = this.strip(obj[key], path);
            if (typeOf(res) == 'array' && res.length > 0){
                for (let i in res){
                    errors.push(res[i]);
                }
            }
        }
    }
    return errors;
};

function join (path, prefix) {
    return prefix
        ? prefix + '.' + path
        : path;
}

function error (prop) {
    var err = {
        message: prop.msg,
        path: prop.name
    }
    return err;
}