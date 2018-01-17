"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideDOMAdapter = require("./serverSideDOMAdapterPatch.js");
var domAdapterBackup = {};

for(var field in domAdapter) {
    domAdapterBackup[field] = domAdapter[field];
    if(field !== "getWindow" && field !== "ready" && field !== "_readyCallbacks") {
        delete domAdapter[field];
    }
}

domAdapter._window = null;

QUnit.testStart(function() {
    serverSideDOMAdapter.set();
    domAdapter._readyCallbacks.fire();
});

domAdapter.__restoreOriginal = function() {
    for(var method in domAdapterBackup) {
        domAdapter[method] = domAdapterBackup[method];
    }
};
