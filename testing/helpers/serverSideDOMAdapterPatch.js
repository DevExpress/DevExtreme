const domAdapter = require('core/dom_adapter');
const readyCallbacks = require('core/utils/ready_callbacks');

const documentMock = (function() {
    const documentMock = {
        isDocumentMock: true
    };

    const errorFunc = function() {
        throw new Error('Document fields using is prevented');
    };

    for(const field in document) {
        Object.defineProperty(documentMock, field, {
            get: errorFunc,
            set: errorFunc
        });
    }

    return documentMock;
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
            const args = Array.prototype.slice.call(arguments, 0);

            if(element.isDocumentMock) {
                args[0] = document;
            }
            return this.callBase.apply(this, args);
        },

        listen: function(element, event, callback, useCapture) {
            const args = Array.prototype.slice.call(arguments, 0);

            if(element.isWindowMock) {
                args[0] = {};
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
            const args = Array.prototype.slice.call(arguments, 0);
            if(context && context.isDocumentMock) {
                args[1] = document;
            }
            return this.callBase.apply(this, args);
        }
    });

    // Ready callbacks should be fired by the integration
    readyCallbacks.fire();
};
