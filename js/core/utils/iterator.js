"use strict";

var applyCallback = function(index, values, callback, result) {
    var value = callback(values[index], index);

    if(value != null) {
        result.push(value);
    }
};

var map = function(values, callback) {
    var result = [];

    if("length" in values) {
        for(var index = 0; index < values.length; index++) {
            applyCallback(index, values, callback, result);
        }
    } else {
        for(var key in values) {
            applyCallback(key, values, callback, result);
        }
    }

    return [].concat.apply([], result);
};

var each = function(values, callback) {
    if(!values) return;

    if("length" in values) {
        for(var i = 0; i < values.length; i++) {
            if(callback.call(values[i], i, values[i]) === false) {
                break;
            }
     	}
    } else {
        for(var key in values) {
            if(callback.call(values[key], key, values[key]) === false) {
                break;
            }
     	}
 	}

    return values;
};

exports.map = map;
exports.each = each;
