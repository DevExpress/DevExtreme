"use strict";

var errors = require("../errors"),
    Class = require("../class"),
    objectUtils = require("./object"),
    typeUtils = require("./type"),
    each = require("./iterator").each,
    variableWrapper = require("./variable_wrapper"),
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

var walk = function(object, path, accessor) {
    var result;
    for(var level = 0, depth = path.length; level < depth; level++) {
        var key = path[level];
        object = accessor(object, key, level);
        if(object === undefined) {
            break;
        }
        result = object;
    }

    return result;
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
            var functionAsIs = options.functionsAsIs;

            return walk(unwrap(obj, options), path, function(currentObject, currentPropertyName) {
                var value;

                if(!currentObject) {
                    value = currentObject;
                } else {
                    value = readPropValue(currentObject, currentPropertyName, options);

                    if(!functionAsIs && typeUtils.isFunction(value)) {
                        value = value.call(currentObject);
                    }
                }

                return value;
            });
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
                last,
                i;

            if(value === undefined) {
                return;
            }

            current = (result || (result = {}));
            path = name.split(".");
            last = path.length - 1;

            for(i = 0; i < last; i++) {
                current = current[path[i]] = {};
            }

            current[path[i]] = value;
        });
        return result;
    };
};

var compileSetter = function(expr) {
    expr = bracketsToDots(expr || "this").split(".");
    var exprDepth = expr.length;

    return function(obj, value, options) {
        options = prepareOptions(options);

        walk(unwrap(obj, options), expr, function(currentObject, currentPropertyName, currentLevel) {
            var result = readPropValue(currentObject, currentPropertyName, options),
                isFunc = !options.functionsAsIs && typeUtils.isFunction(result) && !isWrapped(result);

            if(!typeUtils.isDefined(result)) {
                result = { };
                assignPropValue(currentObject, currentPropertyName, result, options);
            }

            if(currentLevel === exprDepth - 1) {
                if(isFunc) {
                    currentObject[currentPropertyName](value);
                } else {
                    if(options.merge && typeUtils.isPlainObject(value) && typeUtils.isPlainObject(result)) {
                        objectUtils.deepExtendArraySafe(result, value, false, true);
                    } else {
                        assignPropValue(currentObject, currentPropertyName, value, options);
                    }
                }
            } else if(isFunc) {
                result = result.call(currentObject);
            }

            return result;
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

exports.compileGetter = compileGetter;
exports.compileSetter = compileSetter;
exports.toComparable = toComparable;
