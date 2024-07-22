import { isNumeric, isPlainObject, isObject } from './type';
import variableWrapper from './variable_wrapper';

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
        const isNumberX = isNumeric(x);
        const isNumberY = isNumeric(y);

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

const assignValueToProperty = function(target, property, value, extendComplexObject, assignByReference, shouldCopyUndefined) {
    if(!assignByReference && variableWrapper.isWrapped(target[property])) {
        variableWrapper.assign(target[property], value);
    } else if(!assignByReference && Array.isArray(value)) {
        target[property] = value.map(item => {
            let itemTarget = item;

            if(Array.isArray(item)) {
                itemTarget = [];
            }
            if(isObject(item)) {
                itemTarget = {};
            }

            return deepExtendArraySafe(itemTarget, item, extendComplexObject, assignByReference, shouldCopyUndefined);
        });
    } else {
        target[property] = value;
    }
};

// B239679, http://bugs.jquery.com/ticket/9477
const deepExtendArraySafe = function(target, changes, extendComplexObject, assignByReference, shouldCopyUndefined) {
    let prevValue;
    let newValue;

    for(const name in changes) {
        prevValue = target[name];
        newValue = changes[name];

        if(name === '__proto__' || name === 'constructor' || target === newValue) {
            continue;
        }

        if(isPlainObject(newValue)) {
            const goDeeper = extendComplexObject ? isObject(prevValue) : isPlainObject(prevValue);
            newValue = deepExtendArraySafe(goDeeper ? prevValue : {}, newValue, extendComplexObject, assignByReference, shouldCopyUndefined);
        }

        if(
            Array.isArray(newValue) && !assignByReference ||
            shouldCopyUndefined && (prevValue !== newValue || prevValue === undefined) ||
            newValue !== undefined && prevValue !== newValue
        ) {
            assignValueToProperty(target, name, newValue, extendComplexObject, assignByReference, shouldCopyUndefined);
        }
    }

    return target;
};

export {
    clone,
    orderEach,
    deepExtendArraySafe
};
