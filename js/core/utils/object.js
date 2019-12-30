const typeUtils = require('./type');
const variableWrapper = require('./variable_wrapper');

const clone = (function() {
    function Clone() { }

    return function(obj) {
        Clone.prototype = obj;
        return new Clone();
    };
})();

const orderEach = function(map, func) {
    const keys = [];
    let key;
    let i;

    for(key in map) {
        if(Object.prototype.hasOwnProperty.call(map, key)) {
            keys.push(key);
        }
    }

    keys.sort(function(x, y) {
        const isNumberX = typeUtils.isNumeric(x);
        const isNumberY = typeUtils.isNumeric(y);

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

const assignValueToProperty = function(target, property, value, assignByReference) {
    if(!assignByReference && variableWrapper.isWrapped(target[property])) {
        variableWrapper.assign(target[property], value);
    } else {
        target[property] = value;
    }
};

// B239679, http://bugs.jquery.com/ticket/9477
const deepExtendArraySafe = function(target, changes, extendComplexObject, assignByReference) {
    let prevValue;
    let newValue;

    for(const name in changes) {
        prevValue = target[name];
        newValue = changes[name];

        if(name === '__proto__' || target === newValue) {
            continue;
        }

        if(typeUtils.isPlainObject(newValue)) {
            const goDeeper = extendComplexObject ? typeUtils.isObject(prevValue) : typeUtils.isPlainObject(prevValue);
            newValue = deepExtendArraySafe(goDeeper ? prevValue : {}, newValue, extendComplexObject, assignByReference);
        }

        if(newValue !== undefined && prevValue !== newValue) {
            assignValueToProperty(target, name, newValue, assignByReference);
        }
    }

    return target;
};

exports.clone = clone;
exports.orderEach = orderEach;
exports.deepExtendArraySafe = deepExtendArraySafe;
