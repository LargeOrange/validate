/**
 * Created by dachengsun on 2017/11/7.
 */
let moment = require('moment');
let model = require('./schema');
let rule = {};
let typeOf, dot;
try {
    typeOf = require('type');
    dot = require('dot');
} catch (err) {
    typeOf = require('component-type');
    dot = require('eivindfjeldstad-dot');
}
rule = {
    type: function (name) {

        if (name != 'string' && name != 'number' && name != 'object'){
            return {err: 'type should input "number"/"string"/"object"'}
        }
        return function (data) {
            if (name == 'string'){
                // debugger;
                return data == null || typeOf(data) === name;
            } else if(name === 'number'){
                let reg = /^(\-|\+)?\d+(\.\d+)?$/;
                return data == null || reg.test(data) || (typeOf(data) === 'number' && data != NaN && data != Infinity) || data === '0';
            } else if (name == 'object') {
                return  data == null || typeOf(data) === name;
            }
        }
    },

    array : function (data) {

        if ( typeOf(data) == 'array') {
            return {err: JSON.stringify(data)};
        }

        return function (inputObj) {
            debugger
            // debugger;
            if(inputObj == null || inputObj == undefined) {
                return true;
            }

            if (typeOf(inputObj) != 'array') {
                return false;
            }

            let checkPass = true;
            // debugger;
            for (let i = 0; i < inputObj.length; i ++){
                let res = data.validate(inputObj[i]);
                if (typeOf(res) == 'object' || (typeOf(res) == 'array' && res.length > 0)){
                    checkPass = false;
                    break
                }
            }
            return checkPass;
        }
    },

    required: function (bool) {

        if (typeOf(bool) != 'boolean' && bool !== null) {
            return {err: 'required should input a bool value'}
        }

        if(bool == null) {
            bool = true;
        }
        return function (value) {
            return bool === false || !!value || value == 0;
        }
    },

    min: function (limit) {
        let reg = /^\d+(\.\d+)?$/;
        if (!reg.test(limit) && !reg.test(-limit) || typeOf(limit) !== 'number'){
            return {err: 'min should input a number'}
        }
        return function (data) {
            debugger
            if (data == null) {
                return true;
            }
            return data >= parseFloat(limit) && (reg.test(-limit) || reg.test(limit));
        }
    },

    max: function (limit) {
        let reg = /^\d+(\.\d+)?$/;
        if (!reg.test(limit) && !reg.test(-limit) || typeOf(limit) !== 'number'){
            return {err: 'max should input a number'}
        }
        return function (data) {
            debugger
            if (data == null) {
                return true;
            }
            return data <= parseFloat(limit) && (reg.test(-limit) || reg.test(limit));
        }
    },

    allow: function (allowList) {


        if(typeOf(allowList) != 'array' || allowList.length == 0){
            return {err: 'allow should input arry which length >=1'}
        }

        for (let i in allowList){
            if (typeOf(allowList[i]) != 'string' && typeOf(allowList[i]) != 'number' && typeOf(allowList[i]) != 'object'){
                return {err: 'member in allow should be string or number or object'}
            }
        }

        return function (data) {
            let flag = false;
            data = JSON.stringify(data);

            if (data == null) {
                return true;
            }
            for (let i in allowList){
                let allow = JSON.stringify(allowList[i]);
                if(allow === data){
                    return true;
                }
            }

            return flag;
        }
    },

    length: function (len) {

        if(typeOf(len) != 'array' || (len.length == 0 || len.length > 2)){
            return {err: 'length should input arry which length >=1 && <=2'}
        }
        for (let i in len){
            let l = len[i];
            if(typeOf(l) != 'number' || l < 0){
                return {err: 'length must be a num and >= 0'}
            }
            l = parseInt(l);
        }

        return function (data) {
            debugger
            if (data == null) {
                return true;
            }
            if (len.length == 1){
                return data.length == len[0];
            }

            if (typeOf(data) != 'array' && typeOf(data) != 'string'){
                return false;
            }

            let min = len[0] > len[1]? len[1] : len[0];
            let max = len[0] < len[1]? len[1] : len[0];

            return data.length <= max && data.length >= min;
        }
    },

    applyFunction: function (checkFun) {
        if (typeOf(checkFun) !== 'array'){
            return {err: 'applyFunction should input function'}
        }

        return checkFun(data);
    }
};

module.exports = rule;