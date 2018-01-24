"use strict";

var domAdapter = require("../dom_adapter"),
    callOnce = require("./call_once"),
    readyCallbacks = require("./ready_callbacks"),
    Callbacks = require("./callbacks");

var hasWindow = function() {
    return typeof window !== "undefined";
};

var getWindow = function() {
    /* global window */
    return hasWindow() && window;
};

var resizeCallbacks = (function() {
    var prevSize,
        callbacks = Callbacks(),
        originalCallbacksAdd = callbacks.add,
        originalCallbacksRemove = callbacks.remove;

    if(!hasWindow()) {
        return callbacks;
    }

    var formatSize = function() {
        var documentElement = domAdapter.getDocumentElement();
        return {
            width: documentElement.clientWidth,
            height: documentElement.clientHeight
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

    var removeListener;

    callbacks.add = function() {
        var result = originalCallbacksAdd.apply(callbacks, arguments);

        setPrevSize();

        readyCallbacks.add(function() {
            if(!removeListener && callbacks.has()) {
                removeListener = domAdapter.listen(getWindow(), "resize", handleResize);
            }
        });

        return result;
    };

    callbacks.remove = function() {
        var result = originalCallbacksRemove.apply(callbacks, arguments);

        if(!callbacks.has() && removeListener) {
            removeListener();
            removeListener = undefined;
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
    var windowWidth = domAdapter.getDocumentElement()["clientWidth"];

    return screenFactorFunc(windowWidth);
};

var beforeActivateExists = callOnce(function() {
    return getWindow().document["onbeforeactivate"] !== undefined;
});

var getNavigator = function() {
    return hasWindow() ? getWindow().navigator : {
        userAgent: ""
    };
};

exports.resizeCallbacks = resizeCallbacks;
exports.defaultScreenFactorFunc = defaultScreenFactorFunc;
exports.getCurrentScreenFactor = getCurrentScreenFactor;
exports.beforeActivateExists = beforeActivateExists;
exports.hasWindow = hasWindow;
exports.getNavigator = getNavigator;

// TODO: get rid of method
exports.getWindow = getWindow;
