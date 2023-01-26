/* eslint-disable no-undef */

const $ = require('jquery');

exports.mock = (module, value) => {
    const normalizedName = System.normalizeSync(module);
    System.delete(normalizedName);
    value.__esModule = true;
    $.extend({ default: value });
    System.set(normalizedName, System.newModule($.extend({ default: value }, value)));
    return value;
};
