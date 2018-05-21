"use strict";

var domAdapter = require("../dom_adapter");
var injector = require("./dependency_injector");
var windowUtils = require("./window");
var callOnce = require("./call_once");
var callbacks = [];

var isReady = function() {
    // NOTE: we can't use document.readyState === "interactive" because of ie9/ie10 support
    return domAdapter.getReadyState() === "complete" || (domAdapter.getReadyState() !== "loading" && !domAdapter.getDocumentElement().doScroll);
};

var subscribeReady = callOnce(function() {
    var removeListener = domAdapter.listen(domAdapter.getDocument(), "DOMContentLoaded", function() {
        readyCallbacks.fire();
        removeListener();
    });
});

var readyCallbacks = {
    add: function(callback) {
        var hasWindow = windowUtils.hasWindow();

        if(hasWindow && isReady()) {
            callback();
        } else {
            callbacks.push(callback);
            hasWindow && subscribeReady();
        }
    },
    fire: function() {
        callbacks.forEach(function(callback) {
            callback();
        });
    }
};

module.exports = injector(readyCallbacks);
