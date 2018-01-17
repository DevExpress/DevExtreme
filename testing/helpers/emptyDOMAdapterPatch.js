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

domAdapter._window = domAdapterBackup._window = {};

var restoreOriginal = function() {
    for(var field in domAdapterBackup) {
        domAdapter[field] = domAdapterBackup[field];
    }
};

QUnit.begin(function() {
    restoreOriginal();
    serverSideDOMAdapter.set();
});

