"use strict";

var domAdapter = require("core/dom_adapter");
var windowUtils = require("core/utils/window");
var serverSideDOMAdapter = require("./serverSideDOMAdapterPatch.js");

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

var domAdapterBackup = {};
var makeDOMAdapterEmpty = function() {
    for(var field in domAdapter) {
        domAdapterBackup[field] = domAdapter[field];
        delete domAdapter[field];
    }
};
var restoreOriginalDomAdapter = function() {
    for(var field in domAdapterBackup) {
        domAdapter[field] = domAdapterBackup[field];
    }
};

var windowMock = {
    isWindowMock: true
};

var errorFunc = function() {
    throw new Error("Window fields using is prevented");
};

var windowGetter = function() {
    return windowMock;
};

for(var field in window) {
    Object.defineProperty(windowMock, field, {
        get: field === "window" ? windowGetter : errorFunc,
        set: errorFunc
    });
}

var makeWindowEmpty = function() {
    windowUtils.hasWindow = function() {
        return false;
    };
    windowUtils.getWindow = function() {
        return windowMock;
    };
};

// Ensure domAdapter is not used on scripts loading stage (until the integration is not injected)
makeDOMAdapterEmpty();
// Emulate SSR where window is not exists
makeWindowEmpty();

QUnit.begin(function() {
    // Now domAdapter is allowed to use
    restoreOriginalDomAdapter();
    // Emulate DOMAdapter integration
    serverSideDOMAdapter.set();
});
