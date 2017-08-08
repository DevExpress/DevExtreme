"use strict";

var $ = require("../../core/renderer"),
    config = require("../config"),
    deferredUtils = require("../../integration/jquery/deferred");

var type = function(object) {
    var types = {
            "[object Array]": "array",
            "[object Date]": "date",
            "[object Object]": "object",
            "[object Null]": "null" },
        typeOfObject = Object.prototype.toString.call(object);

    return typeof object === "object" ?
            types[typeOfObject] || "object" : typeof object;
};

var isDefined = function(object) {
    return (object !== null) && (object !== undefined);
};

var isString = function(object) {
    return typeof object === 'string';
};

var isNumeric = function(object) {
    return ((typeof object === "number") && isFinite(object) || !isNaN(object - parseFloat(object)));
};

var isObject = function(object) {
    return type(object) === 'object';
};

var isDate = function(object) {
    return type(object) === 'date';
};

var isBoolean = function(object) {
    return typeof object === "boolean";
};

var isFunction = function(object) {
    return typeof object === 'function';
};

var isPrimitive = function(value) {
    return ["object", "array", "function"].indexOf(type(value)) === -1;
};

var isExponential = function(value) {
    return isNumeric(value) && value.toString().indexOf('e') !== -1;
};

var isWindow = function(object) {
    return object != null && object === object.window;
};

var isDomNode = function(node) {
    return node instanceof Element;
};

var ensureDefined = function(value, defaultValue) {
    return isDefined(value) ? value : defaultValue;
};

var executeAsync = function(action, context/*, internal */) {
    var deferred = $.Deferred(),
        normalizedContext = context || this,
        timerId,

        task = {
            promise: deferred.promise(),
            abort: function() {
                clearTimeout(timerId);
                deferred.rejectWith(normalizedContext);
            }
        },

        callback = function() {
            var result = action.call(normalizedContext);

            if(result && result.done && isFunction(result.done)) {
                result.done(function() {
                    deferred.resolveWith(normalizedContext);
                });
            } else {
                deferred.resolveWith(normalizedContext);
            }
        };

    timerId = (arguments[2] || setTimeout)(callback, typeof context === "number" ? context : 0);

    return task;
};

var delayedFuncs = [];
var delayedNames = [];
var delayedDeferreds = [];
var executingName;

var deferExecute = function(name, func, deferred) {
    if(executingName && executingName !== name) {
        delayedFuncs.push(func);
        delayedNames.push(name);
        deferred = deferred || $.Deferred();
        delayedDeferreds.push(deferred);
        return deferred;
    } else {
        var oldExecutingName = executingName,
            currentDelayedCount = delayedDeferreds.length;

        executingName = name;
        var result = func();

        if(!result) {
            if(delayedDeferreds.length > currentDelayedCount) {
                result = deferredUtils.when.apply($, delayedDeferreds.slice(currentDelayedCount));
            } else if(deferred) {
                deferred.resolve();
            }
        }

        executingName = oldExecutingName;

        if(deferred && result && result.done) {
            result.done(deferred.resolve).fail(deferred.reject);
        }

        if(!executingName && delayedFuncs.length) {
            (delayedNames.shift() === "render" ? deferRender : deferUpdate)(delayedFuncs.shift(), delayedDeferreds.shift());
        }
        return result;
    }
};

var deferRender = function(func, deferred) {
    return deferExecute("render", func, deferred);
};

var deferUpdate = function(func, deferred) {
    return deferExecute("update", func, deferred);
};

var deferRenderer = function(func) {
    return function() {
        var that = this;
        return deferExecute("render", function() {
            return func.call(that);
        });
    };
};

var deferUpdater = function(func) {
    return function() {
        var that = this;
        return deferExecute("update", function() {
            return func.call(that);
        });
    };
};

var findBestMatches = function(targetFilter, items, mapFn) {
    var bestMatches = [],
        maxMatchCount = 0;

    $.each(items, function(index, itemSrc) {
        var matchCount = 0,
            item = mapFn ? mapFn(itemSrc) : itemSrc;

        $.each(targetFilter, function(paramName, targetValue) {
            var value = item[paramName];

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

var match = function(value, targetValue) {
    if(Array.isArray(value) && Array.isArray(targetValue)) {
        var mismatch = false;

        $.each(value, function(index, valueItem) {
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

var splitPair = function(raw) {
    switch(typeof raw) {
        case "string":
            return raw.split(/\s+/, 2);
        case "object":
            return [raw.x || raw.h, raw.y || raw.v];
        case "number":
            return [raw];
        default:
            return raw;
    }
};

var splitQuad = function(raw) {
    switch(typeof raw) {
        case "string":
            return raw.split(/\s+/, 4);
        case "object":
            return [
                raw.x || raw.h || raw.left,
                raw.y || raw.v || raw.top,
                raw.x || raw.h || raw.right,
                raw.y || raw.v || raw.bottom];
        case "number":
            return [raw];
        default:
            return raw;
    }
};

var normalizeKey = function(id) {
    var key = isString(id) ? id : id.toString(),
        arr = key.match(/[^a-zA-Z0-9_]/g);

    arr && $.each(arr, function(_, sign) {
        key = key.replace(sign, "__" + sign.charCodeAt() + "__");
    });
    return key;
};

var denormalizeKey = function(key) {
    var arr = key.match(/__\d+__/g);

    arr && arr.forEach(function(char) {
        var charCode = parseInt(char.replace("__", ""));

        key = key.replace(char, String.fromCharCode(charCode));
    });

    return key;
};

var isArraysEqualByValue = function(array1, array2, deep) {
    if(array1.length !== array2.length) {
        return false;
    }

    for(var i = 0; i < array1.length; i++) {
        if(!equalByValue(array1[i], array2[i], deep + 1)) {
            return false;
        }
    }

    return true;
};

var isObjectsEqualByValue = function(object1, object2, deep) {
    for(var propertyName in object1) {
        if(object1.hasOwnProperty(propertyName) && !equalByValue(object1[propertyName], object2[propertyName], deep + 1)) {
            return false;
        }
    }

    for(propertyName in object2) {
        if(!(propertyName in object1)) {
            return false;
        }
    }

    return true;
};

var equalByValue = function(object1, object2, deep) {
    if(object1 === object2) return true;

    var maxDeep = 3;

    deep = deep || 0;

    if(deep >= maxDeep) {
        return true;
    }

    if(isObject(object1) && isObject(object2)) {
        return isObjectsEqualByValue(object1, object2, deep);
    } else if(Array.isArray(object1) && Array.isArray(object2)) {
        return isArraysEqualByValue(object1, object2, deep);
    } else if(isDate(object1) && isDate(object2)) {
        return object1.getTime() === object2.getTime();
    }

    return false;
};

var getKeyHash = function(key) {
    if(isObject(key) || Array.isArray(key)) {
        try {
            var keyHash = JSON.stringify(key);
            return keyHash === "{}" ? key : keyHash;
        } catch(e) {
            return key;
        }
    }

    return key;
};

var escapeRegExp = function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

var applyServerDecimalSeparator = function(value) {
    var separator = config().serverDecimalSeparator;
    if(isDefined(value)) {
        value = value.toString().replace(".", separator);
    }
    return value;
};

var noop = function() {};

var grep = function(elements, checkFunction, invert) {
    var result = [],
        check,
        expectedCheck = !invert;

    for(var i = 0; i < elements.length; i++) {
        check = !!checkFunction(elements[i], i);

        if(check === expectedCheck) {
            result.push(elements[i]);
        }
    }

    return result;
};

exports.type = type;
exports.isDefined = isDefined;
exports.isString = isString;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isDate = isDate;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isPrimitive = isPrimitive;
exports.isExponential = isExponential;
exports.isWindow = isWindow;
exports.isDomNode = isDomNode;

exports.ensureDefined = ensureDefined;

exports.executeAsync = executeAsync;

exports.deferRender = deferRender;
exports.deferRenderer = deferRenderer;
exports.deferUpdate = deferUpdate;
exports.deferUpdater = deferUpdater;


exports.splitPair = splitPair;
exports.splitQuad = splitQuad;

exports.findBestMatches = findBestMatches;

exports.normalizeKey = normalizeKey;
exports.denormalizeKey = denormalizeKey;
exports.equalByValue = equalByValue;
exports.getKeyHash = getKeyHash;

exports.escapeRegExp = escapeRegExp;

exports.applyServerDecimalSeparator = applyServerDecimalSeparator;

exports.noop = noop;
exports.grep = grep;
