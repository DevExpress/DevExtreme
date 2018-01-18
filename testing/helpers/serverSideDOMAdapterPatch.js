"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideWindowMock = require("./serverSideWindowMock.js");

exports.set = function() {
    domAdapter.listen = function(element, event, callback, useCapture) {
        // Note: in Angular domAdapter it wiil be "window"
        if(element === domAdapter.getWindow()) {
            window.addEventListener(event, callback, useCapture);
        } else {
            element.addEventListener(event, callback, useCapture);
        }
    };

    for(var field in serverSideWindowMock) {
        Object.defineProperty(domAdapter._window, field, {
            enumerable: true,
            configurable: true,
            value: serverSideWindowMock[field]
        });
    }
    domAdapter._readyCallbacks.fire();
};
