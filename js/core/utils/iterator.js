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

exports.map = map;
