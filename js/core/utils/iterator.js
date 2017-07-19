"use strict";

var map = function(values, callback) {
    var result = [];

    var applyCallback = function(index) {
        var value = callback(values[index], index);

        if(value != null) {
            result.push(value);
        }
    };

    if("length" in values) {
        for(var i = 0; i < values.length; i++) {
            applyCallback(i);
        }
    } else {
        for(var key in values) {
            applyCallback(key);
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
