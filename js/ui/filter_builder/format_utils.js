"use strict";

var formatHelper = require("../../format_helper");


var DEFAULT_FORMAT = {
    "date": "shortDate",
    "datetime": "shortDateShortTime"
};

exports.getFormattedValueText = function(field, value) {
    var fieldFormat = field.format || DEFAULT_FORMAT[field.dataType];
    return formatHelper.format(value, fieldFormat);
};
