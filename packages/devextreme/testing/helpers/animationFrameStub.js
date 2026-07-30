/**
 * Stub animation frame via the QUnit mutable facade (animation_frame.js),
 * which re-exports a stubbable default object as frameModule / frame.
 *
 * Library packages/devextreme/js is unchanged. Under native ESM, Sinon cannot
 * patch named-export bindings; the facade named exports forward to api.*.
 *
 * Soft restore keeps sinon stubs installed (reassigns callsFake) so repeated
 * beforeEach/afterEach across suites that share the module stay stable.
 */

import animationFrame from '__internal/common/core/animation/frameModule';

const FAKE_TIMERS_WITHOUT_ANIMATION_FRAME = Object.freeze([
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'Date',
]);

const STORE_KEY = '__dxQUnitAnimationFrameStubs';
const NATIVE_KEY = '__dxQUnitAnimationFrameNatives';

function getNatives() {
    if(!window[NATIVE_KEY]) {
        // Capture real browser RAF (after qunitExtensions may have wrapped it).
        window[NATIVE_KEY] = {
            request: window.requestAnimationFrame.bind(window),
            cancel: window.cancelAnimationFrame.bind(window),
        };
    }
    return window[NATIVE_KEY];
}

getNatives();

function isSinonStub(value) {
    return !!(value && value.restore && value.restore.sinon);
}

function getDefaultImplementations() {
    // After sinon.stub, original methods live on stub.wrappedMethod.
    // Before first stub, methods on animationFrame are the facade defaults.
    const requestImpl = isSinonStub(animationFrame.requestAnimationFrame)
        ? animationFrame.requestAnimationFrame.wrappedMethod.bind(animationFrame)
        : animationFrame.requestAnimationFrame.bind(animationFrame);
    const cancelImpl = isSinonStub(animationFrame.cancelAnimationFrame)
        ? animationFrame.cancelAnimationFrame.wrappedMethod.bind(animationFrame)
        : animationFrame.cancelAnimationFrame.bind(animationFrame);
    return { requestImpl, cancelImpl };
}

let defaults = null;

function ensureDefaults() {
    if(!defaults) {
        defaults = getDefaultImplementations();
    }
    return defaults;
}

const syncRequest = (callback) => {
    callback();
    return 0;
};

/** Idle RAF: do not invoke the callback (sync would recurse forever in frame animations). */
const noopRequest = () => 0;

const noopCancel = () => {};

let lastRequestFake = noopRequest;
let lastCancelFake = noopCancel;

function getStore() {
    if(!window[STORE_KEY]) {
        window[STORE_KEY] = { request: null, cancel: null };
    }
    return window[STORE_KEY];
}

function stubOnce(object, methodName, storeKey) {
    ensureDefaults();
    const store = getStore();
    const current = object[methodName];

    if(isSinonStub(current)) {
        store[storeKey] = current;
        return current;
    }

    if(isSinonStub(store[storeKey]) && current === store[storeKey]) {
        return store[storeKey];
    }

    try {
        store[storeKey] = sinon.stub(object, methodName);
    } catch(e) {
        if(isSinonStub(object[methodName])) {
            store[storeKey] = object[methodName];
        } else {
            throw e;
        }
    }

    return store[storeKey];
}

function ensureStubbed() {
    return {
        requestStub: stubOnce(animationFrame, 'requestAnimationFrame', 'request'),
        cancelStub: stubOnce(animationFrame, 'cancelAnimationFrame', 'cancel'),
    };
}

function applyFakes(requestStub, cancelStub, requestFake, cancelFake) {
    lastRequestFake = requestFake;
    lastCancelFake = cancelFake;
    requestStub.callsFake(requestFake);
    cancelStub.callsFake(cancelFake);
}

function softRestore() {
    const { requestStub, cancelStub } = ensureStubbed();
    // Must not use syncRequest here: frame animations re-schedule RAF from the
    // callback → immediate re-entry → Maximum call stack size exceeded.
    applyFakes(requestStub, cancelStub, noopRequest, noopCancel);
    requestStub.resetHistory();
    cancelStub.resetHistory();
}

function createHandle(requestStub) {
    return {
        restore: softRestore,
        get callCount() {
            return requestStub.callCount;
        },
    };
}

/**
 * Install (or refresh) frameModule animation-frame stubs.
 * Omitting request/cancel keeps the previous fake.
 * @param {object} [options]
 * @param {Function} [options.request]
 * @param {Function} [options.cancel]
 */
export function stubAnimationFrame(options = {}) {
    const { requestStub, cancelStub } = ensureStubbed();

    const requestFake = options.request !== undefined ? options.request : lastRequestFake;
    const cancelFake = options.cancel !== undefined ? options.cancel : lastCancelFake;
    applyFakes(requestStub, cancelStub, requestFake, cancelFake);
    return createHandle(requestStub);
}

/** Immediate callback (scrollable / scrollView default). */
export function stubAnimationFrameSync() {
    return stubAnimationFrame({ request: syncRequest, cancel: noopCancel });
}

/** Schedule via setTimeout (works with fake timers). */
export function stubAnimationFrameDelayed(delayMs = 10) {
    return stubAnimationFrame({
        request: (callback) => window.setTimeout(callback, delayMs),
        cancel: (requestID) => window.clearTimeout(requestID),
    });
}

/**
 * Real browser RAF. Use when the test waits on assert.async() for ScrollAnimator
 * frames and does not drive them with clock.tick.
 * restore() cancels pending ids so qunit notimers stays clean.
 */
export function stubAnimationFrameNative() {
    const natives = getNatives();
    const pending = new Set();
    const handle = stubAnimationFrame({
        request: (callback) => {
            const id = natives.request((...args) => {
                pending.delete(id);
                callback(...args);
            });
            pending.add(id);
            return id;
        },
        cancel: (requestID) => {
            pending.delete(requestID);
            natives.cancel(requestID);
        },
    });
    const softRestoreHandle = handle.restore;
    handle.restore = function() {
        pending.forEach((id) => natives.cancel(id));
        pending.clear();
        softRestoreHandle();
    };
    return handle;
}

/** No-op requestAnimationFrame (suppress requested frames). */
export function stubAnimationFrameNoop() {
    return stubAnimationFrame({
        request: () => 0,
        cancel: noopCancel,
    });
}

/**
 * Early install so the first library RAF goes through sinon stubs on the facade.
 * Default is noop (not sync): sync immediately re-enters ScrollAnimator/frame
 * loops and blows the stack (draggable + dxScrollView, etc.).
 * Suites that need sync must call stubAnimationFrameSync() in beforeEach.
 */
export function installAnimationFrameStub() {
    return stubAnimationFrameNoop();
}

/**
 * Restore facade defaults on the mutable api (still via stubs / callsFake).
 */
export function restoreAnimationFrameDefaults() {
    const { requestImpl, cancelImpl } = ensureDefaults();
    const { requestStub, cancelStub } = ensureStubbed();
    applyFakes(requestStub, cancelStub, requestImpl, cancelImpl);
    requestStub.resetHistory();
    cancelStub.resetHistory();
    return createHandle(requestStub);
}

export function useFakeTimersWithoutAnimationFrame(config = {}) {
    return sinon.useFakeTimers({
        toFake: FAKE_TIMERS_WITHOUT_ANIMATION_FRAME,
        ...config,
    });
}

export { FAKE_TIMERS_WITHOUT_ANIMATION_FRAME, animationFrame };
