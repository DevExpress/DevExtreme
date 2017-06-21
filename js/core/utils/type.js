"use strict";

var types = {
    "[object Array]": "array",
    "[object Date]": "date",
    "[object Object]": "object",
    "[object Null]": "null" };

var type = function(object) {
    var typeOfObject = Object.prototype.toString.call(object);

    return typeof object === "object" ?
        types[typeOfObject] || "object" : typeof object;
};

var isObject = function(object) {
    return type(object) === 'object';
};

var isEmptyObject = function(object) {
    var property;

    for(property in object) {
        return false;
    }

    return true;
};

var isPlainObject = function(object) {
    if(!object || Object.prototype.toString.call(object) !== "[object Object]") {
        return false;
    }
    var proto = Object.getPrototypeOf(object),
        ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;

    return typeof ctor === "function"
        && Object.toString.call(ctor) === Object.toString.call(Object);
};

exports.isObject = isObject;
exports.isEmptyObject = isEmptyObject;
exports.isPlainObject = isPlainObject;
exports.type = type;
