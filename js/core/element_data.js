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

exports.cleanDataRecursive = function(element, cleanSelf) {
    if(!(element instanceof Element)) {
        return;
    }

    var childElements = element.getElementsByTagName("*");

    dataUtils.cleanData(childElements);

    if(cleanSelf) {
        dataUtils.cleanData([element]);
    }
};

exports.setDataStrategy = function(value) {
    dataUtils = value;
};

exports.getDataStrategy = function() {
    return dataUtils;
};

