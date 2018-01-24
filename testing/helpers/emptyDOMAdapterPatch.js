"use strict";

var domAdapter = require("core/dom_adapter");
var windowUtils = require("core/utils/window");
var serverSideDOMAdapter = require("./serverSideDOMAdapterPatch.js");
var domAdapterBackup = {};
var temporaryAllowedWindowFields = [
    "document",
    "Event",
];
var windowMock = {};

temporaryAllowedWindowFields.forEach(function(field) {
    Object.defineProperty(windowMock, field, {
        enumerable: true,
        configurable: true,
        get: function() {
            return window[field];
        },

        set: function(value) {
            window[field] = value;
        }
    });
});
windowMock.window = windowMock;

for(var field in domAdapter) {
    domAdapterBackup[field] = domAdapter[field];
    if(field !== "ready" && field !== "_readyCallbacks") {
        delete domAdapter[field];
    }
}

var originalWindowGetter = windowUtils.getWindow;
windowUtils.getWindow = function() {
    return windowMock;
};
windowUtils.hasWindow = function() {
    return false;
};

var restoreOriginal = function() {
    windowUtils.getWindow = originalWindowGetter;

    for(var field in domAdapterBackup) {
        domAdapter[field] = domAdapterBackup[field];
    }
};

QUnit.begin(function() {
    restoreOriginal();
    serverSideDOMAdapter.set();
});
