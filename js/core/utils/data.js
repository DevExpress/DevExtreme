var errors = require("../errors"),
    Class = require("../class"),
    objectUtils = require("./object"),
    typeUtils = require("./type"),
    each = require("./iterator").each,
    variableWrapper = require("./variable_wrapper"),
    domAdapter = require("../dom_adapter"),
    unwrapVariable = variableWrapper.unwrap,
    isWrapped = variableWrapper.isWrapped,
    assign = variableWrapper.assign;

var bracketsToDots = function(expr) {
    return expr
        .replace(/\[/g, ".")
        .replace(/\]/g, "");
};

var readPropValue = function(obj, propName, options) {
    options = options || { };
    if(propName === "this") {
        return unwrap(obj, options);
    }
    return unwrap(obj[propName], options);
};

var assignPropValue = function(obj, propName, value, options) {
    if(propName === "this") {
        throw new errors.Error("E4016");
    }

    var propValue = obj[propName];
    if(options.unwrapObservables && isWrapped(propValue)) {
        assign(propValue, value);
    } else {
        obj[propName] = value;
    }
};

var prepareOptions = function(options) {
    options = options || {};
    options.unwrapObservables = options.unwrapObservables !== undefined ? options.unwrapObservables : true;
    return options;
};

var unwrap = function(value, options) {
    return options.unwrapObservables ? unwrapVariable(value) : value;
};

var compileGetter = function(expr) {
    if(arguments.length > 1) {
        expr = [].slice.call(arguments);
    }

    if(!expr || expr === "this") {
        return function(obj) { return obj; };
    }

    if(typeof expr === "string") {
        expr = bracketsToDots(expr);

        var path = expr.split(".");

        return function(obj, options) {
            options = prepareOptions(options);
            var functionAsIs = options.functionsAsIs,
                hasDefaultValue = "defaultValue" in options,
                current = unwrap(obj, options);

            for(var i = 0; i < path.length; i++) {
                if(!current) {
                    if(current == null && hasDefaultValue) {
                        return options.defaultValue;
                    }
                    break;
                }

                var pathPart = path[i];

                if(hasDefaultValue && typeUtils.isObject(current) && !(pathPart in current)) {
                    return options.defaultValue;
                }

                var next = unwrap(current[pathPart], options);

                if(!functionAsIs && typeUtils.isFunction(next)) {
                    next = next.call(current);
                }

                current = next;
            }

            return current;
        };
    }

    if(Array.isArray(expr)) {
        return combineGetters(expr);
    }

    if(typeUtils.isFunction(expr)) {
        return expr;
    }
};

var combineGetters = function(getters) {
    var compiledGetters = {};
    for(var i = 0, l = getters.length; i < l; i++) {
        var getter = getters[i];
        compiledGetters[getter] = compileGetter(getter);
    }

    return function(obj, options) {
        var result;

        each(compiledGetters, function(name) {
            var value = this(obj, options),
                current,
                path,
                pathItem,
                last,
                i;

            if(value === undefined) {
                return;
            }

            current = (result || (result = {}));
            path = name.split(".");
            last = path.length - 1;

            for(i = 0; i < last; i++) {
                pathItem = path[i];
                if(!(pathItem in current)) {
                    current[pathItem] = { };
                }
                current = current[pathItem];
            }

            current[path[last]] = value;
        });
        return result;
    };
};

var ensurePropValueDefined = function(obj, propName, value, options) {
    if(typeUtils.isDefined(value)) {
        return value;
    }

    var newValue = {};
    assignPropValue(obj, propName, newValue, options);

    return newValue;
};

var compileSetter = function(expr) {
    expr = bracketsToDots(expr || "this").split(".");
    var lastLevelIndex = expr.length - 1;

    return function(obj, value, options) {
        options = prepareOptions(options);
        var currentValue = unwrap(obj, options);

        expr.forEach(function(propertyName, levelIndex) {
            var propertyValue = readPropValue(currentValue, propertyName, options),
                isPropertyFunc = !options.functionsAsIs && typeUtils.isFunction(propertyValue) && !isWrapped(propertyValue);

            if(levelIndex === lastLevelIndex) {
                if(options.merge && typeUtils.isPlainObject(value) && (!typeUtils.isDefined(propertyValue) || typeUtils.isPlainObject(propertyValue))) {
                    propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
                    objectUtils.deepExtendArraySafe(propertyValue, value, false, true);
                } else if(isPropertyFunc) {
                    currentValue[propertyName](value);
                } else {
                    assignPropValue(currentValue, propertyName, value, options);
                }
            } else {
                propertyValue = ensurePropValueDefined(currentValue, propertyName, propertyValue, options);
                if(isPropertyFunc) {
                    propertyValue = propertyValue.call(currentValue);
                }
                currentValue = propertyValue;
            }
        });
    };
};

var toComparable = function(value, caseSensitive) {
    if(value instanceof Date) {
        return value.getTime();
    }

    if(value && value instanceof Class && value.valueOf) {
        return value.valueOf();
    }

    if(!caseSensitive && typeof value === "string") {
        return value.toLowerCase();
    }

    return value;
};

const arraysEqualByValue = function(array1, array2, depth) {
    if(array1.length !== array2.length) {
        return false;
    }

    for(let i = 0; i < array1.length; i++) {
        if(!equalByComplexValue(array1[i], array2[i], depth + 1)) {
            return false;
        }
    }

    return true;
};

const objectsEqualByValue = function(object1, object2, depth) {
    for(const propertyName in object1) {
        if(
            Object.prototype.hasOwnProperty.call(object1, propertyName) &&
            !equalByComplexValue(object1[propertyName], object2[propertyName], depth + 1)
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

const equalByComplexValue = function(object1, object2, deep) {
    deep = deep || 0;

    object1 = toComparable(object1, true);
    object2 = toComparable(object2, true);

    if(object1 === object2 || deep >= maxEqualityDepth) {
        return true;
    }

    if(typeUtils.isObject(object1) && typeUtils.isObject(object2)) {
        return objectsEqualByValue(object1, object2, deep);
    } else if(Array.isArray(object1) && Array.isArray(object2)) {
        return arraysEqualByValue(object1, object2, deep);
    }

    return false;
};

const hasNegation = function(oldValue, newValue) {
    return (1 / oldValue) === (1 / newValue);
};

const equals = function(oldValue, newValue) {
    oldValue = toComparable(oldValue, true);
    newValue = toComparable(newValue, true);

    if(oldValue && newValue && typeUtils.isRenderer(oldValue) && typeUtils.isRenderer(newValue)) {
        return newValue.is(oldValue);
    }

    const oldValueIsNaN = oldValue !== oldValue;
    const newValueIsNaN = newValue !== newValue;
    if(oldValueIsNaN && newValueIsNaN) {
        return true;
    }

    if(oldValue === 0 && newValue === 0) {
        return hasNegation(oldValue, newValue);
    }

    if(oldValue === null || typeof oldValue !== "object" || domAdapter.isElementNode(oldValue)) {
        return oldValue === newValue;
    }

    return false;
};


exports.compileGetter = compileGetter;
exports.compileSetter = compileSetter;
exports.toComparable = toComparable;
exports.equalByComplexValue = equalByComplexValue;
exports.equals = equals;
