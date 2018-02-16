"use strict";

var domAdapter = require("core/dom_adapter");
var readyCallbacks = require("core/utils/ready_callbacks");

var documentMock = (function() {
    var documentMock = {
        isDocumentMock: true
    };

    var errorFunc = function() {
        throw new Error("Document fields using is prevented");
    };

    for(var field in document) {
        Object.defineProperty(documentMock, field, {
            get: errorFunc,
            set: errorFunc
        });
    }

    return documentMock;
})();

(function emulateNoContains() {
    var originalContains = Element.prototype.contains;
    Element.prototype.contains = function(element) {
        if(!element) {
            throw new Error("element should be defined");
        }

        return originalContains.apply(this, arguments);
    };
})();

(function emulateNoXMLNSAttr() {
    // NOTE: Will be allowed soon https://github.com/fgnass/domino/commit/b16cb1923f83db096b7cd0638734474e54b3308d#diff-52cea43ae897a1705ec51162aed25f63
    var originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if(name.toLowerCase().substring(0, 5) === 'xmlns') {
            throw new Error("the operation is not allowed by Namespaces in XML");
        }

        return originalSetAttribute.apply(this, arguments);
    };
})();

(function emulateNoElementSizes() {
    var originalCreateElement = document.createElement;

    document.createElement = function() {
        var result = originalCreateElement.apply(this, arguments);

        ["offsetWidth", "offsetHeight"].forEach(function(field) {
            Object.defineProperty(result, field, {
                get: function() {
                    return undefined;
                },
                set: function() {}
            });
        });

        return result;
    };

    Element.prototype.getClientRects = undefined;
})();

exports.set = function() {
    // Emulate Angular DOM Adapter considering it's restricitons
    domAdapter.inject({
        // `document` should be used only as is
        getDocument: function() {
            return documentMock;
        },

        getDocumentElement: function() {
            return undefined;
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
