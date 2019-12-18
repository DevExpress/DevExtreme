var _normalizeEnum = require('../core/utils').normalizeEnum,
    _noop = require('../../core/utils/common').noop,

    colorizers = {},
    defaultColorizerName;

function wrapLeafColorGetter(getter) {
    return function(node) {
        return !node.isNode() ? getter(node) : undefined;
    };
}

function wrapGroupColorGetter(getter) {
    return function(node) {
        var parent = !node.isNode() && node.parent;

        return parent ? (parent._groupColor = parent._groupColor || getter(parent)) : undefined;
    };
}

exports.getColorizer = function(options, themeManager, root) {
    var type = _normalizeEnum(options.type || defaultColorizerName),
        colorizer = colorizers[type] && colorizers[type](options, themeManager, root);

    return colorizer ? (options.colorizeGroups ? wrapGroupColorGetter : wrapLeafColorGetter)(colorizer) : _noop;
};

exports.addColorizer = function(name, colorizer) {
    colorizers[name] = colorizer;
};

exports.setDefaultColorizer = function(name) {
    defaultColorizerName = name;
};

function getValueAsColorCode(node) {
    return node.value;
}

function createColorCodeGetter(colorCodeField) {
    return function(node) {
        return Number(node.data[colorCodeField]);
    };
}

exports.createColorCodeGetter = function(options) {
    return options.colorCodeField ? createColorCodeGetter(options.colorCodeField) : getValueAsColorCode;
};
