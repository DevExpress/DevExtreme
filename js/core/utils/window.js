"use strict";

/* global window */
var $ = require("../../core/renderer"),
    _window = require("../../core/dom_adapter").getWindow(),
    commonUtils = require("../../core/utils/common"),
    callOnce = commonUtils.callOnce,
    eventsEngine = require("../../events/core/events_engine"),
    Callbacks = require("../../core/utils/callbacks");

var resizeCallbacks = (function() {
    var prevSize,
        callbacks = Callbacks(),
        resizeEventHandlerAttached = false,
        originalCallbacksAdd = callbacks.add,
        originalCallbacksRemove = callbacks.remove;

    var formatSize = function() {
        var jqWindow = $(_window);

        return {
            width: jqWindow.width(),
            height: jqWindow.height()
        };
    };

    var handleResize = function() {
        var now = formatSize();
        if(now.width === prevSize.width && now.height === prevSize.height) {
            return;
        }

        var changedDimension;
        if(now.width === prevSize.width) {
            changedDimension = 'height';
        }
        if(now.height === prevSize.height) {
            changedDimension = 'width';
        }

        prevSize = now;

        callbacks.fire(changedDimension);
    };

    var setPrevSize = callOnce(function() {
        prevSize = formatSize();
    });

    callbacks.add = function() {
        var result = originalCallbacksAdd.apply(callbacks, arguments);
        var jqWindow = $(_window);

        setPrevSize();

        if(!resizeEventHandlerAttached && callbacks.has()) {
            eventsEngine.subscribeGlobal(jqWindow, "resize", handleResize);
            resizeEventHandlerAttached = true;
        }
        return result;
    };

    callbacks.remove = function() {
        var result = originalCallbacksRemove.apply(callbacks, arguments);
        var jqWindow = $(_window);

        if(!callbacks.has() && resizeEventHandlerAttached) {
            eventsEngine.off(jqWindow, "resize", handleResize);
            resizeEventHandlerAttached = false;
        }
        return result;
    };

    return callbacks;
})();

var defaultScreenFactorFunc = function(width) {
    if(width < 768) {
        return "xs";
    } else if(width < 992) {
        return "sm";
    } else if(width < 1200) {
        return "md";
    } else {
        return "lg";
    }
};

var getCurrentScreenFactor = function(screenFactorCallback) {
    var screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;

    return screenFactorFunc($(_window).width());
};

var beforeActivateExists = callOnce(function() {
    return _window.document["onbeforeactivate"] !== undefined;
});


var getComputedStyle = function(element) {
    if(typeof window !== "undefined") {
        return window.getComputedStyle(element);
    }
    return {
        "font-family": "dx.generic.light"
    };
};

exports.resizeCallbacks = resizeCallbacks;
exports.defaultScreenFactorFunc = defaultScreenFactorFunc;
exports.getCurrentScreenFactor = getCurrentScreenFactor;
exports.beforeActivateExists = beforeActivateExists;
exports.getComputedStyle = getComputedStyle;
