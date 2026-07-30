/**
 * Live window.RAF/CAF delegation for QUnit ESM.
 *
 * Production frame.ts callOnce-captures window.requestAnimationFrame on first
 * use. That freezes a pre-stub native (or a dead fake-timers RAF) and breaks
 * suites that install window stubs later (sortable/draggable autoscroll).
 *
 * Always reading from window keeps animationFrameStub.js effective.
 */

export function requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
}

export function cancelAnimationFrame(requestID) {
    return window.cancelAnimationFrame(requestID);
}

// CJS interop / mutable facade: `export { default } from shim` + `ns.default ?? ns`
export default {
    requestAnimationFrame,
    cancelAnimationFrame,
};
