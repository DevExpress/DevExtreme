const _normalizeEnum = require('../core/utils').normalizeEnum;
const _noop = require('../../core/utils/common').noop;

const colorizers = {};
let defaultColorizerName;

function wrapLeafColorGetter(getter) {
    return function(node) {
        return !node.isNode() ? getter(node) : undefined;
    };
}

function wrapGroupColorGetter(getter) {
    return function(node) {
        const parent = !node.isNode() && node.parent;

        return parent ? (parent._groupColor = parent._groupColor || getter(parent)) : undefined;
    };
}

exports.getColorizer = function(options, themeManager, root) {
    const type = _normalizeEnum(options.type || defaultColorizerName);
    const colorizer = colorizers[type] && colorizers[type](options, themeManager, root);

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
