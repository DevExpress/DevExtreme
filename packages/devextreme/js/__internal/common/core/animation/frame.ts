import { hasWindow, getWindow } from '../../../core/utils/window';
const window = hasWindow() ? getWindow() : {};
import callOnce from '../../../core/utils/call_once';

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
});

export function requestAnimationFrame() {
    setAnimationFrameMethods();
    return request.apply(window, arguments);
}

export function cancelAnimationFrame() {
    setAnimationFrameMethods();
    cancel.apply(window, arguments);
}
