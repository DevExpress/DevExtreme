"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideWindowMock = require("./serverSideWindowMock.js");

exports.set = function() {
    domAdapter.__restoreOriginal();

    domAdapter.getWindow = function() {
        return serverSideWindowMock;
    };
};
