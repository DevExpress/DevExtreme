"use strict";

var domAdapter = require("core/dom_adapter");
var windowUtils = require("core/utils/window");
var serverSideDOMAdapter = require("./serverSideDOMAdapterPatch.js");

var domAdapterBackup = {};
var makeDOMAdapterEmpty = function() {
    for(var field in domAdapter) {
        domAdapterBackup[field] = domAdapter[field];
        delete domAdapter[field];
    }
};
var restoreOriginalDomAdapter = function() {
    for(var field in domAdapterBackup) {
        domAdapter[field] = domAdapterBackup[field];
    }
};

var windowMock = {
    isWindowMock: true
};

var errorFunc = function() {
    throw new Error("Window fields using is prevented");
};

for(var field in window) {
    Object.defineProperty(windowMock, field, {
        get: errorFunc,
        set: errorFunc
    });
}

var makeWindowEmpty = function() {
    windowUtils.hasWindow = function() {
        return false;
    };
    windowUtils.getWindow = function() {
        return windowMock;
    };
};

// Ensure domAdapter is not used on scripts loading stage (until the integration is not injected)
makeDOMAdapterEmpty();
// Emulate SSR where window is not exists
makeWindowEmpty();

QUnit.begin(function() {
    // Now domAdapter is allowed to use
    restoreOriginalDomAdapter();
    // Emulate DOMAdapter integration
    serverSideDOMAdapter.set();
});
