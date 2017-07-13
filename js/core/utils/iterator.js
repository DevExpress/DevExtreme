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

exports.map = map;
