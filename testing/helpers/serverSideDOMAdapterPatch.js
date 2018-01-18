"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideWindowMock = require("./serverSideWindowMock.js");

exports.set = function() {
    for(var field in serverSideWindowMock) {
        domAdapter._window[field] = serverSideWindowMock[field];
    }
    domAdapter._readyCallbacks.fire();
};
