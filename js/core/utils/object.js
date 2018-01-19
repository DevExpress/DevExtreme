"use strict";

var typeUtils = require("./type"),
    variableWrapper = require("./variable_wrapper");

var clone = (function() {
    function Clone() { }

    return function(obj) {
        Clone.prototype = obj;
        return new Clone();
    };
})();

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
        var isNumberX = typeUtils.isNumeric(x),
            isNumberY = typeUtils.isNumeric(y);

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

var deepExtendArraySafeCore = function(target, changes, getPropertyNamesFunc, extendComplexObject, assignByReference) {
    if(!changes) return target;

    var prevValue, newValue;
    var changeablePropertyNames = getPropertyNamesFunc ? getPropertyNamesFunc(changes) : Object.getOwnPropertyNames(changes);

    for(var key in changeablePropertyNames) {
        var name = changeablePropertyNames[key];
        prevValue = target[name];
        newValue = changes[name];

        if(target === newValue) {
            continue;
        }

        if(typeUtils.isPlainObject(newValue)) {
            var goDeeper = extendComplexObject ? typeUtils.isObject(prevValue) : typeUtils.isPlainObject(prevValue);
            newValue = deepExtendArraySafeCore(goDeeper ? prevValue : {}, newValue, getPropertyNamesFunc, extendComplexObject, assignByReference);
        }

        if(newValue !== undefined) {
            assignValueToProperty(target, name, newValue, assignByReference);
        }
    }
    return target;
};

// B239679, http://bugs.jquery.com/ticket/9477
var deepExtendArraySafe = function(target, changes, extendComplexObject, assignByReference) {
    return changes ? deepExtendArraySafeCore(target, changes, null, extendComplexObject, assignByReference) : target;
};

exports.clone = clone;
exports.orderEach = orderEach;
exports.deepExtendArraySafe = deepExtendArraySafe;
exports.deepExtendArraySafeCore = deepExtendArraySafeCore;
