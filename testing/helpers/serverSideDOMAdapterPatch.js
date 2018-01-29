"use strict";

var domAdapter = require("core/dom_adapter");
var windowUtils = require("core/utils/window");
var readyCallbacks = require("core/utils/ready_callbacks");

exports.set = function() {
    // Emulate Angular DOM Adapter considering it's restricitons
    domAdapter.inject({
        listen: function(element, event, callback, useCapture) {
            var args = Array.prototype.slice.call(arguments, 0);
            // Note: in Angular domAdapter it wiil be "window"
            if(element === windowUtils.getWindow()) {
                args[0] === window;
            }
            return this.callBase.apply(this, args);
        },

        getSelection: function() {
            return {};
        }
    });

    // Ready callbacks should be fired by the integrqtion
    readyCallbacks.fire();
};
