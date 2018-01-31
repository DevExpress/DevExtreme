"use strict";

/* global window */

var domAdapter = require("../dom_adapter");

module.exports = {
    hasWindow: function() {
        return typeof window !== "undefined";
    },

    getWindow: function() {
        return this.hasWindow() && window;
    },

    hasProperty: function(prop) {
        return this.hasWindow() && prop in this.getWindow();
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
        var screenFactorFunc = screenFactorCallback || this.defaultScreenFactorFunc;
        var windowWidth = domAdapter.getDocumentElement()["clientWidth"];

        return screenFactorFunc(windowWidth);
    },

    openWindow: function() {
        if(this.hasProperty("open")) {
            return this.getWindow().open();
        }

        return null;
    },

    getNavigator: function() {
        return this.hasWindow() ? this.getWindow().navigator : {
            userAgent: ""
        };
    }
};
