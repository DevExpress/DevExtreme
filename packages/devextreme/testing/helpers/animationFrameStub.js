/**
 * QUnit helpers around the animation-frame ESM facade
 * (`testing/helpers/esm-shims/animation_frame.js`).
 *
 * Prefer the pre-migration style in tests:
 *   import animationFrame from '__internal/common/core/animation/frameModule';
 *   sinon.stub(animationFrame, 'requestAnimationFrame').callsFake(...)
 *
 * This module re-exports that stubbable object and provides:
 * - useFakeTimersWithoutAnimationFrame — keep window.RAF out of sinon fake timers
 * - stubAnimationFrameNative — real RAF + pending cancel for assert.async / notimers
 */

import animationFrame from '__internal/common/core/animation/frameModule';

const FAKE_TIMERS_WITHOUT_ANIMATION_FRAME = Object.freeze([
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'Date',
]);

const NATIVE_KEY = '__dxQUnitAnimationFrameNatives';

function getNatives() {
    if(!window[NATIVE_KEY]) {
        window[NATIVE_KEY] = {
            request: window.requestAnimationFrame.bind(window),
            cancel: window.cancelAnimationFrame.bind(window),
        };
    }
    return window[NATIVE_KEY];
}

/**
 * Real browser RAF. Use when the test waits on assert.async() for ScrollAnimator
 * frames and does not drive them with clock.tick.
 * restore() cancels pending ids so qunit notimers stays clean.
 */
export function stubAnimationFrameNative() {
    const natives = getNatives();
    const pending = new Set();
    const requestStub = sinon.stub(animationFrame, 'requestAnimationFrame').callsFake((callback) => {
        const id = natives.request((...args) => {
            pending.delete(id);
            callback(...args);
        });
        pending.add(id);
        return id;
    });
    const cancelStub = sinon.stub(animationFrame, 'cancelAnimationFrame').callsFake((requestID) => {
        pending.delete(requestID);
        natives.cancel(requestID);
    });

    return {
        restore() {
            pending.forEach((id) => natives.cancel(id));
            pending.clear();
            requestStub.restore();
            cancelStub.restore();
        },
        get callCount() {
            return requestStub.callCount;
        },
    };
}

export function useFakeTimersWithoutAnimationFrame(config = {}) {
    return sinon.useFakeTimers({
        toFake: FAKE_TIMERS_WITHOUT_ANIMATION_FRAME,
        ...config,
    });
}

export {
    animationFrame,
    FAKE_TIMERS_WITHOUT_ANIMATION_FRAME,
};
