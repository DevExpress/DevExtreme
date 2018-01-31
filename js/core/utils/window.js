"use strict";

/* global window */

var domAdapter = require("../dom_adapter"),
    callOnce = require("./call_once");

var windowUtils = {
    hasWindow: function() {
        return typeof window !== "undefined";
    },

    hasProperty: function(prop) {
        return windowUtils.hasWindow() && prop in window;
    },

    defaultScreenFactorFunc: function(width) {
        if(width < 768) {
            return "xs";
        } else if(width < 992) {
            return "sm";
        } else if(width < 1200) {
            return "md";
        } else {
            return "lg";
        }
    },

    getCurrentScreenFactor: function(screenFactorCallback) {
        var screenFactorFunc = screenFactorCallback || windowUtils.defaultScreenFactorFunc;
        var windowWidth = domAdapter.getDocumentElement()["clientWidth"];

        return screenFactorFunc(windowWidth);
    },

    openWindow: function() {
        if("open" in window) {
            return window.open();
        }

        return null;
    },

    beforeActivateExists: callOnce(function() {
        return domAdapter.getProperty(domAdapter.getDocument(), "onbeforeactivate") !== undefined;
    }),

    getNavigator: function() {
        return windowUtils.hasWindow() ? windowUtils.getWindow().navigator : {
            userAgent: ""
        };
    },

    listen: function(event, callback) {
        if(windowUtils.hasWindow()) {
            domAdapter.listen(windowUtils.getWindow(), event, callback);
        }
    },

    // TODO: get rid of method
    getWindow: function() {
        return windowUtils.hasWindow() && window;
    }
};

module.exports = windowUtils;
