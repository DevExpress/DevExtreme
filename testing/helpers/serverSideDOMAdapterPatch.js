"use strict";

var domAdapter = require("core/dom_adapter");
var readyCallbacks = require("core/utils/ready_callbacks");

var documentMock = {
    isDocumentMock: true
};

var errorFunc = function() {
    throw new Error("Document fields using is prevented");
};

var originalContains = Element.prototype.contains;
Element.prototype.contains = function(element) {
    if(!element) {
        throw new Error("element should be defined");
    }

    return originalContains.apply(this, arguments);
};

for(var field in document) {
    Object.defineProperty(documentMock, field, {
        get: errorFunc,
        set: errorFunc
    });
}

exports.set = function() {
    // Emulate Angular DOM Adapter considering it's restricitons
    domAdapter.inject({
        // `document` should be used only as is
        getDocument: function() {
            return documentMock;
        },

        hasDocumentProperty: function() {
            return false;
        },

        querySelectorAll: function(element) {
            var args = Array.prototype.slice.call(arguments, 0);

            if(element.isDocumentMock) {
                args[0] = document;
            }
            return this.callBase.apply(this, args);
        },

        listen: function(element, event, callback, useCapture) {
            var args = Array.prototype.slice.call(arguments, 0);
            // Note: in Angular domAdapter it wiil be "window"
            if(element.isWindowMock) {
                args[0] = window;
            }
            if(element.isDocumentMock) {
                args[0] = document;
            }
            return this.callBase.apply(this, args);
        },

        getSelection: function() {
            return {};
        },

        createElement: function(tagName, context) {
            var args = Array.prototype.slice.call(arguments, 0);
            if(context && context.isDocumentMock) {
                args[1] = document;
            }
            return this.callBase.apply(this, args);
        }
    });

    // Ready callbacks should be fired by the integrqtion
    readyCallbacks.fire();
};
