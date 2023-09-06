"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptionInfo = exports.getOptionValue = exports.allKeysAreEqual = exports.forEachChildNode = exports.isEqual = exports.toComparable = exports.camelize = exports.lowercaseFirst = exports.uppercaseFirst = exports.getTemplatePropName = void 0;
function getTemplatePropName(props, templateName) {
    for (var propName in props) {
        if (props[propName] === templateName) {
            return propName;
        }
    }
    return templateName;
}
exports.getTemplatePropName = getTemplatePropName;
function uppercaseFirst(value) {
    return value[0].toUpperCase() + value.substr(1);
}
exports.uppercaseFirst = uppercaseFirst;
function lowercaseFirst(value) {
    return value[0].toLowerCase() + value.substr(1);
}
exports.lowercaseFirst = lowercaseFirst;
function camelize(value) {
    return lowercaseFirst(value.split('-').map(function (v) { return uppercaseFirst(v); }).join(''));
}
exports.camelize = camelize;
function toComparable(value) {
    return value instanceof Date ? value.getTime() : value;
}
exports.toComparable = toComparable;
function isEqual(value1, value2) {
    if (toComparable(value1) === toComparable(value2)) {
        return true;
    }
    if (Array.isArray(value1) && Array.isArray(value2)) {
        return value1.length === 0 && value2.length === 0;
    }
    return false;
}
exports.isEqual = isEqual;
function forEachChildNode(el, callback) {
    Array.prototype.slice.call(el.childNodes).forEach(callback);
}
exports.forEachChildNode = forEachChildNode;
function allKeysAreEqual(obj1, obj2) {
    var obj1Keys = Object.keys(obj1);
    if (obj1Keys.length !== Object.keys(obj2).length) {
        return false;
    }
    for (var _i = 0, obj1Keys_1 = obj1Keys; _i < obj1Keys_1.length; _i++) {
        var key = obj1Keys_1[_i];
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
exports.allKeysAreEqual = allKeysAreEqual;
function getOptionValue(options, optionPath) {
    var value = options;
    optionPath.split('.').forEach(function (p) {
        var optionInfo = getOptionInfo(p);
        if (value) {
            value = optionInfo.isCollection
                ? value[optionInfo.name] && value[optionInfo.name][optionInfo.index]
                : value[optionInfo.name];
        }
    });
    return value;
}
exports.getOptionValue = getOptionValue;
function getOptionInfo(name) {
    var parts = name.split('[');
    if (parts.length === 1) {
        return {
            isCollection: false,
            name: name,
            fullName: name,
        };
    }
    return {
        isCollection: true,
        name: parts[0],
        fullName: name,
        index: Number(parts[1].slice(0, -1)),
    };
}
exports.getOptionInfo = getOptionInfo;
