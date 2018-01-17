"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideWindowMock = require("./serverSideWindowMock.js");

exports.set = function() {
    for(var field in serverSideWindowMock) {
        Object.defineProperty(domAdapter._window, field, {
            enumerable: true,
            configurable: true,
            value: serverSideWindowMock[field]
        });
    }
    domAdapter._readyCallbacks.fire();
};
