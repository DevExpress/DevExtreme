"use strict";

var map = function(elems, callback, arg) {
    var result = [];

    var applyCallback = function(index, arg) {
        var value = callback(elems[index], index, arg);

        if(value != null) {
            result.push(value);
        }
    };

    if(Array.isArray(elems) || "length" in elems) {
        for(var i = 0; i < elems.length; i++) {
            applyCallback(i, arg);
        }
    } else {
        for(var key in elems) {
            applyCallback(key, arg);
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
