"use strict";

var _format = require("../../format_helper").format;

module.exports = function(value, options) {
    return _format(value, options.format, options.precision /* DEPRECATED_16_1 */);
};
