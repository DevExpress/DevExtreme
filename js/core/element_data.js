"use strict";
var dataUtils = require("jquery");

var cleanData = dataUtils.cleanData;

exports.data = function() {
    return dataUtils.data.apply(this, arguments);
};

exports.removeData = function(elements) {
    return dataUtils.removeData.apply(this, arguments);
};

exports.cleanData = function(elements) {
    return cleanData.apply(this, arguments);
};

exports.cleanDataRecursive = function(element, cleanSelf) {
    if(!(element instanceof Element)) {
        return;
    }

    var childElements = element.getElementsByTagName("*");

    cleanData(childElements);

    if(cleanSelf) {
        cleanData([element]);
    }
};

exports.setDataStrategy = function(value) {
    dataUtils = value;
};

exports.getDataStrategy = function() {
    return dataUtils;
};

