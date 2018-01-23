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

    domAdapter.getBody = function() {
        return document.body;
    };

    domAdapter.createDocumentFragment = function() {
        return document.createDocumentFragment();
    };

    domAdapter.getDocumentElement = function() {
        return document.documentElement;
    };

    domAdapter.getReadyState = function() {
        return document.readyState;
    };

    domAdapter.getHead = function() {
        return document.head;
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
