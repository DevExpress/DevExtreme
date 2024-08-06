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

const getDeepCopyTarget = (item) => {
    if(isObject(item)) {
        return Array.isArray(item) ? [] : {};
    }
    return item;
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

        const isDeepCopyArray = Array.isArray(newValue) && !assignByReference;
        const hasDifferentNewValue = (shouldCopyUndefined || newValue !== undefined) && prevValue !== newValue ||
            shouldCopyUndefined && prevValue === undefined;

        if(isDeepCopyArray || hasDifferentNewValue) {
            if(!assignByReference && variableWrapper.isWrapped(target[name])) {
                variableWrapper.assign(target[name], newValue);
            } else if(!assignByReference && Array.isArray(newValue)) {
                target[name] = newValue.map(item => deepExtendArraySafe(
                    getDeepCopyTarget(item),
                    item,
                    extendComplexObject,
                    assignByReference,
                    shouldCopyUndefined
                ));
            } else {
                target[name] = newValue;
            }
        }
    }

    return target;
};

export {
    clone,
    orderEach,
    deepExtendArraySafe
};
