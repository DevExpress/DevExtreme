import config from '../config';
import Guid from '../guid';
import { when, Deferred } from '../utils/deferred';
import { toComparable } from './data';
import { each } from './iterator';
import { isDefined, isFunction, isString, isObject, type } from './type';

export const ensureDefined = function(value, defaultValue) {
    return isDefined(value) ? value : defaultValue;
};

export const executeAsync = function(action, context/* , internal */) {
    const deferred = new Deferred();
    const normalizedContext = context || this;
    const task = {
        promise: deferred.promise(),
        abort: function() {
            clearTimeout(timerId);
            deferred.rejectWith(normalizedContext);
        }
    };

    const callback = function() {
        const result = action.call(normalizedContext);

        if(result && result.done && isFunction(result.done)) {
            result.done(function() {
                deferred.resolveWith(normalizedContext);
            });
        } else {
            deferred.resolveWith(normalizedContext);
        }
    };

    const timerId = (arguments[2] || setTimeout)(callback, typeof context === 'number' ? context : 0);

    return task;
};

const delayedFuncs = [];
const delayedNames = [];
const delayedDeferreds = [];
let executingName;

const deferExecute = function(name, func, deferred) {
    if(executingName && executingName !== name) {
        delayedFuncs.push(func);
        delayedNames.push(name);
        deferred = deferred || new Deferred();
        delayedDeferreds.push(deferred);
        return deferred;
    } else {
        const oldExecutingName = executingName;
        const currentDelayedCount = delayedDeferreds.length;

        executingName = name;
        let result = func();

        if(!result) {
            if(delayedDeferreds.length > currentDelayedCount) {
                result = when.apply(this, delayedDeferreds.slice(currentDelayedCount));
            } else if(deferred) {
                deferred.resolve();
            }
        }

        executingName = oldExecutingName;

        if(deferred && result && result.done) {
            result.done(deferred.resolve).fail(deferred.reject);
        }

        if(!executingName && delayedFuncs.length) {
            (delayedNames.shift() === 'render' ? deferRender : deferUpdate)(delayedFuncs.shift(), delayedDeferreds.shift());
        }
        return result || when();
    }
};

export const deferRender = function(func, deferred) {
    return deferExecute('render', func, deferred);
};

export const deferUpdate = function(func, deferred) {
    return deferExecute('update', func, deferred);
};

export const deferRenderer = function(func) {
    return function() {
        const that = this;
        return deferExecute('render', function() {
            return func.call(that);
        });
    };
};

export const deferUpdater = function(func) {
    return function() {
        const that = this;
        return deferExecute('update', function() {
            return func.call(that);
        });
    };
};

export const findBestMatches = function(targetFilter, items, mapFn) {
    const bestMatches = [];
    let maxMatchCount = 0;

    each(items, (index, itemSrc) => {
        let matchCount = 0;
        const item = mapFn ? mapFn(itemSrc) : itemSrc;

        each(targetFilter, (paramName, targetValue) => {
            const value = item[paramName];

            if(value === undefined) {
                return;
            }

            if(match(value, targetValue)) {
                matchCount++;
                return;
            }
            matchCount = -1;
            return false;
        });

        if(matchCount < maxMatchCount) {
            return;
        }
        if(matchCount > maxMatchCount) {
            bestMatches.length = 0;
            maxMatchCount = matchCount;
        }
        bestMatches.push(itemSrc);
    });

    return bestMatches;
};

const match = function(value, targetValue) {
    if(Array.isArray(value) && Array.isArray(targetValue)) {
        let mismatch = false;

        each(value, (index, valueItem) => {
            if(valueItem !== targetValue[index]) {
                mismatch = true;
                return false;
            }
        });

        if(mismatch) {
            return false;
        }

        return true;
    }

    if(value === targetValue) {
        return true;
    }

    return false;
};

export const splitPair = function(raw) {
    switch(type(raw)) {
        case 'string':
            return raw.split(/\s+/, 2);
        case 'object':
            return [raw.x ?? raw.h, raw.y ?? raw.v];
        case 'number':
            return [raw];
        case 'array':
            return raw;
        default:
            return null;
    }
};

export const normalizeKey = function(id) {
    let key = isString(id) ? id : id.toString();
    const arr = key.match(/[^a-zA-Z0-9_]/g);

    arr && each(arr, (_, sign) => {
        key = key.replace(sign, '__' + sign.charCodeAt() + '__');
    });
    return key;
};

export const denormalizeKey = function(key) {
    const arr = key.match(/__\d+__/g);

    arr && arr.forEach((char) => {
        const charCode = parseInt(char.replace('__', ''));

        key = key.replace(char, String.fromCharCode(charCode));
    });

    return key;
};

export const pairToObject = function(raw, preventRound) {
    const pair = splitPair(raw);
    let h = preventRound ? parseFloat(pair && pair[0]) : parseInt(pair && pair[0], 10);
    let v = preventRound ? parseFloat(pair && pair[1]) : parseInt(pair && pair[1], 10);

    if(!isFinite(h)) {
        h = 0;
    }
    if(!isFinite(v)) {
        v = h;
    }

    return { h, v };
};

export const getKeyHash = function(key) {
    if(key instanceof Guid) {
        return key.toString();
    } else if(isObject(key) || Array.isArray(key)) {
        try {
            const keyHash = JSON.stringify(key);
            return keyHash === '{}' ? key : keyHash;
        } catch(e) {
            return key;
        }
    }

    return key;
};

export const escapeRegExp = function(string) {
    return string.replace(/[[\]{}\-()*+?.\\^$|\s]/g, '\\$&');
};

export const applyServerDecimalSeparator = function(value) {
    const separator = config().serverDecimalSeparator;
    if(isDefined(value)) {
        value = value.toString().replace('.', separator);
    }
    return value;
};

export const noop = function() {};
export const asyncNoop = function() { return new Deferred().resolve().promise(); };

export const grep = function(elements, checkFunction, invert) {
    const result = [];
    let check;
    const expectedCheck = !invert;

    for(let i = 0; i < elements.length; i++) {
        check = !!checkFunction(elements[i], i);

        if(check === expectedCheck) {
            result.push(elements[i]);
        }
    }

    return result;
};

const arraysEqualByValue = function(array1, array2, depth) {
    if(array1.length !== array2.length) {
        return false;
    }

    for(let i = 0; i < array1.length; i++) {
        if(!equalByValue(array1[i], array2[i], depth + 1)) {
            return false;
        }
    }

    return true;
};

const objectsEqualByValue = function(object1, object2, depth, strict) {
    if(object1 === null || object2 === null) {
        return false;
    }

    for(const propertyName in object1) {
        if(
            Object.prototype.hasOwnProperty.call(object1, propertyName) &&
            !equalByValue(object1[propertyName], object2[propertyName], depth + 1, strict)
        ) {
            return false;
        }
    }

    for(const propertyName in object2) {
        if(!(propertyName in object1)) {
            return false;
        }
    }

    return true;
};

const maxEqualityDepth = 3;

export const equalByValue = function(object1, object2, depth = 0, strict = true) {

    object1 = toComparable(object1, true);
    object2 = toComparable(object2, true);

    // eslint-disable-next-line eqeqeq
    const comparisonResult = strict ? object1 === object2 : object1 == object2;

    if(comparisonResult || depth >= maxEqualityDepth) {
        return true;
    }

    if(isObject(object1) && isObject(object2)) {
        return objectsEqualByValue(object1, object2, depth, strict);
    } else if(Array.isArray(object1) && Array.isArray(object2)) {
        return arraysEqualByValue(object1, object2, depth);
    }

    return false;
};
