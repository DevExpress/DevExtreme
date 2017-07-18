"use strict";

var map = function(values, callback, arg) {
    var result = [];

    if("length" in values) {
        for(var i = 0; i < values.length; i++) {
            result.push(callback(values[i], i));
        }
    } else {
        for(var key in values) {
            result.push(callback(values[key], key));
        }
    }

    return result;
};

exports.map = map;
