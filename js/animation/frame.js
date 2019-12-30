const windowUtils = require('../core/utils/window');
const window = windowUtils.hasWindow() ? windowUtils.getWindow() : {};
const callOnce = require('../core/utils/call_once');

const FRAME_ANIMATION_STEP_TIME = 1000 / 60;

let request = function(callback) {
    return setTimeout(callback, FRAME_ANIMATION_STEP_TIME);
};

let cancel = function(requestID) {
    clearTimeout(requestID);
};

const setAnimationFrameMethods = callOnce(function() {
    const nativeRequest = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame;

    const nativeCancel = window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame;

    if(nativeRequest && nativeCancel) {
        request = nativeRequest;
        cancel = nativeCancel;
    }

    if(nativeRequest && !nativeCancel) {
        // NOTE: https://code.google.com/p/android/issues/detail?id=66243

        const canceledRequests = {};

        request = function(callback) {
            var requestId = nativeRequest.call(window, function() {
                try {
                    if(requestId in canceledRequests) {
                        return;
                    }
                    callback.apply(this, arguments);
                } finally {
                    delete canceledRequests[requestId];
                }
            });
            return requestId;
        };

        cancel = function(requestId) {
            canceledRequests[requestId] = true;
        };
    }
});

exports.requestAnimationFrame = function() {
    setAnimationFrameMethods();
    return request.apply(window, arguments);
};

exports.cancelAnimationFrame = function() {
    setAnimationFrameMethods();
    cancel.apply(window, arguments);
};
