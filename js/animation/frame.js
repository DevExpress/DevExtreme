"use strict";

var FRAME_ANIMATION_STEP_TIME = 1000 / 60,

    request = function(callback) {
        return this.setTimeout(callback, FRAME_ANIMATION_STEP_TIME);
    },

    cancel = function(requestID) {
        this.clearTimeout(requestID);
    },

    nativeRequest = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame,

    nativeCancel = window.cancelAnimationFrame ||
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

    var canceledRequests = {};

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

/**
 * @name utils_requestAnimationFrame
 * @publicName requestAnimationFrame(callback)
 * @type method
 * @param1 callback:function
 * @return number
 * @namespace DevExpress.utils
 * @module animation/frame
 * @export request
 */
exports.requestAnimationFrame = request.bind(window);

/**
 * @name utils_cancelAnimationFrame
 * @publicName cancelAnimationFrame(requestID)
 * @type method
 * @param1 requestID:number
 * @namespace DevExpress.utils
 * @module animation/frame
 * @export cancel
 */
exports.cancelAnimationFrame = cancel.bind(window);
