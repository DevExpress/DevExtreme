"use strict";

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

exports.isEmptyObject = isEmptyObject;
exports.isPlainObject = isPlainObject;
