"use strict";

/* global window */

var domAdapter = require("../dom_adapter"),
    callOnce = require("./call_once");

var hasWindow = function() {
    return typeof window !== "undefined";
};

var getWindow = function() {
    return hasWindow() && window;
};

var hasProperty = function(prop) {
    return hasWindow() && prop in window;
};

var defaultScreenFactorFunc = function(width) {
    if(width < 768) {
        return "xs";
    } else if(width < 992) {
        return "sm";
    } else if(width < 1200) {
        return "md";
    } else {
        return "lg";
    }
};

var getCurrentScreenFactor = function(screenFactorCallback) {
    var screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
    var windowWidth = domAdapter.getDocumentElement()["clientWidth"];

    return screenFactorFunc(windowWidth);
};

var openWindow = function() {
    if("open" in window) {
        return window.open();
    }

    return null;
};

var beforeActivateExists = callOnce(function() {
    return domAdapter.getProperty(domAdapter.getDocument(), "onbeforeactivate") !== undefined;
});

var getNavigator = function() {
    return hasWindow() ? getWindow().navigator : {
        userAgent: ""
    };
};

exports.defaultScreenFactorFunc = defaultScreenFactorFunc;
exports.getCurrentScreenFactor = getCurrentScreenFactor;
exports.beforeActivateExists = beforeActivateExists;
exports.openWindow = openWindow;
exports.hasWindow = hasWindow;
exports.hasProperty = hasProperty;
exports.getNavigator = getNavigator;

// TODO: get rid of method
exports.getWindow = getWindow;
