/* global window */

var domAdapter = require('../dom_adapter');

var hasWindow = typeof window !== 'undefined';
var windowObject = hasWindow && window;

if(!windowObject) {
    windowObject = {};
    windowObject.window = windowObject;
}

module.exports = {
    hasWindow: function() {
        return hasWindow;
    },

    getWindow: function() {
        return windowObject;
    },

    hasProperty: function(prop) {
        return this.hasWindow() && prop in windowObject;
    },

    defaultScreenFactorFunc: function(width) {
        if(width < 768) {
            return 'xs';
        } else if(width < 992) {
            return 'sm';
        } else if(width < 1200) {
            return 'md';
        } else {
            return 'lg';
        }
    },

    getCurrentScreenFactor: function(screenFactorCallback) {
        var screenFactorFunc = screenFactorCallback || this.defaultScreenFactorFunc;
        var windowWidth = domAdapter.getDocumentElement()['clientWidth'];

        return screenFactorFunc(windowWidth);
    },

    getNavigator: function() {
        return this.hasWindow() ? windowObject.navigator : {
            userAgent: ''
        };
    }
};
