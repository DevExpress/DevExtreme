"use strict";

var domAdapter = require("core/dom_adapter");
var serverSideWindowMock = require("./serverSideWindowMock.js");

exports.set = function() {
    domAdapter.getWindow = function() {
        return serverSideWindowMock;
    };
};
