"use strict";

var domAdapter = require("core/dom_adapter");
var domAdapterBackup = {};

for(var method in domAdapter) {
    domAdapterBackup[method] = domAdapter[method];
    delete domAdapter[method];
}

domAdapter.getWindow = function() {
    return null;
};

domAdapter.__restoreOriginal = function() {
    for(var method in domAdapterBackup) {
        domAdapter[method] = domAdapterBackup[method];
    }
};
