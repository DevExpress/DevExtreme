"use strict";

var $ = require("jquery"),
    commonUtils = require("./common"),
    variableWrapper = require("./variable_wrapper");

var clone = (function() {
    function Clone() { }

    return function(obj) {
        Clone.prototype = obj;
        return new Clone();
    };
})();

var extendFromObject = function(target, source, overrideExistingValues) {
    target = target || {};
    for(var prop in source) {
        if(source.hasOwnProperty(prop)) {
            var value = source[prop];
            if(!(prop in target) || overrideExistingValues) {
                target[prop] = value;
            }
        }
    }
    return target;
};

var orderEach = function(map, func) {
    var keys = [],
        key,
        i;

    for(key in map) {
        if(map.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    keys.sort(function(x, y) {
        var isNumberX = commonUtils.isNumber(x),
            isNumberY = commonUtils.isNumber(y);

        if(isNumberX && isNumberY) return x - y;
        if(isNumberX && !isNumberY) return -1;
        if(!isNumberX && isNumberY) return 1;
        if(x < y) return -1;
        if(x > y) return 1;
        return 0;
    });

    for(i = 0; i < keys.length; i++) {
        key = keys[i];
        func(key, map[key]);
    }
};

var assignValueToProperty = function(target, property, value, assignByReference) {
    if(!assignByReference && variableWrapper.isWrapped(target[property])) {
        variableWrapper.assign(target[property], value);
    } else {
        target[property] = value;
    }
};

// B239679, http://bugs.jquery.com/ticket/9477
var deepExtendArraySafe = function(target, changes, extendComplexObject, assignByReference) {
    var prevValue, newValue;

    for(var name in changes) {
        prevValue = target[name];
        newValue = changes[name];

        if(name === "__proto__" || target === newValue) {
            continue;
        }

        if($.isPlainObject(newValue) && !(newValue instanceof $.Event)) { // NOTE: http://bugs.jquery.com/ticket/15090
            var goDeeper = extendComplexObject ? commonUtils.isObject(prevValue) : $.isPlainObject(prevValue);
            newValue = deepExtendArraySafe(goDeeper ? prevValue : {}, newValue, extendComplexObject, assignByReference);
        }

        if(newValue !== undefined) {
            assignValueToProperty(target, name, newValue, assignByReference);
        }
    }

    return target;
};

exports.clone = clone;
exports.extendFromObject = extendFromObject;
exports.orderEach = orderEach;
exports.deepExtendArraySafe = deepExtendArraySafe;
