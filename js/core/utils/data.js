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
                current = unwrap(obj, options);

            for(var i = 0; i < path.length; i++) {
                if(!current) break;

                var next = unwrap(current[path[i]], options);

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
    var lastLevelIndex = expr.length - 1;

    return function(obj, value, options) {
        options = prepareOptions(options);
        var currentValue = unwrap(obj, options);

        expr.forEach(function(propertyName, levelIndex) {
            var propertyValue = readPropValue(currentValue, propertyName, options),
                isPropertyFunc = !options.functionsAsIs && typeUtils.isFunction(propertyValue) && !isWrapped(propertyValue);

            if(levelIndex !== lastLevelIndex && !typeUtils.isDefined(propertyValue)) {
                propertyValue = { };
                assignPropValue(currentValue, propertyName, propertyValue, options);
            }

            if(levelIndex === lastLevelIndex) {
                if(options.merge && typeUtils.isPlainObject(value) && typeUtils.isPlainObject(propertyValue)) {
                    objectUtils.deepExtendArraySafe(propertyValue, value, false, true);
                } else if(isPropertyFunc) {
                    currentValue[propertyName](value);
                } else {
                    assignPropValue(currentValue, propertyName, value, options);
                }
            } else {
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

exports.compileGetter = compileGetter;
exports.compileSetter = compileSetter;
exports.toComparable = toComparable;
