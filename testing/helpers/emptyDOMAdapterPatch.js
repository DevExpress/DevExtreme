"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideDOMAdapter = require("./serverSideDOMAdapterPatch.js");
var serverSideWindowMock = require("./serverSideWindowMock.js");
var windowFields = Object.keys(serverSideWindowMock);
var domAdapterBackup = {};

for(var field in domAdapter) {
    domAdapterBackup[field] = domAdapter[field];
    if(field !== "getWindow" && field !== "ready" && field !== "_readyCallbacks") {
        delete domAdapter[field];
    }
}

domAdapter._window = domAdapterBackup._window = {};

domAdapter._window.window = domAdapter._window;
domAdapter.hasDocument = function() {
    return false;
};

windowFields.forEach(function(field) {
    if(field === "window") {
        return;
    }

    Object.defineProperty(domAdapter._window, field, {
        enumerable: true,
        configurable: true,
        get: function() {
            throw new Error("Access for window['" + field + "'] is denied for testing");
        },

        set: function(value) {
            throw new Error("Access for window['" + field + "'] is denied for testing");
        }
    });
});

var restoreOriginal = function() {
    for(var field in domAdapterBackup) {
        domAdapter[field] = domAdapterBackup[field];
    }
};

QUnit.begin(function() {
    restoreOriginal();
    serverSideDOMAdapter.set();
});
