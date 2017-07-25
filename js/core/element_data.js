"use strict";
var dataUtils = require("jquery");

exports.data = function() {
    return dataUtils.data.apply(this, arguments);
};

exports.removeData = function(elements) {
    return dataUtils.removeData.apply(this, arguments);
};

exports.cleanData = function(elements) {
    return dataUtils.cleanData.apply(this, arguments);
};

exports.setDataStrategy = function(value) {
    dataUtils = value;
};

exports.getDataStrategy = function() {
    return dataUtils;
};

