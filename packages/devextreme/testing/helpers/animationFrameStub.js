/**
 * Stub window.requestAnimationFrame / cancelAnimationFrame for QUnit under native ESM.
 *
 * Sinon cannot stub ESM named exports. Production code imports those named exports from
 * frame.ts, which callOnce-captures window.requestAnimationFrame on first use — so stubs must:
 * 1) target window (not frameModule),
 * 2) be installed before the first requestAnimationFrame call,
 * 3) not be hard-restored while frame.ts still holds the captured reference,
 * 4) not be overwritten by sinon.useFakeTimers() (exclude requestAnimationFrame from toFake).
 *
 * Stubs are kept on window so repeated helper-module evaluations still share one wrap.
 */

const FAKE_TIMERS_WITHOUT_ANIMATION_FRAME = Object.freeze([
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'Date',
]);

const STORE_KEY = '__dxQUnitAnimationFrameStubs';

const syncRequest = (callback) => {
    callback();
    return 0;
};

/** Idle RAF: do not invoke the callback (sync would recurse forever in frame animations). */
const noopRequest = () => 0;

const noopCancel = () => {};

let lastRequestFake = noopRequest;
let lastCancelFake = noopCancel;

function isSinonStub(value) {
    return !!(value && value.restore && value.restore.sinon);
}

function getStore() {
    if(!window[STORE_KEY]) {
        window[STORE_KEY] = { request: null, cancel: null };
    }
    return window[STORE_KEY];
}

function stubOnce(object, methodName, storeKey) {
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
        requestStub: stubOnce(window, 'requestAnimationFrame', 'request'),
        cancelStub: stubOnce(window, 'cancelAnimationFrame', 'cancel'),
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
 * Install (or refresh) window animation-frame stubs. Safe to call repeatedly; restore() is soft.
 * Omitting request/cancel keeps the previous fake (needed when tests stub them separately).
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

/** No-op requestAnimationFrame (suppress requested frames). */
export function stubAnimationFrameNoop() {
    return stubAnimationFrame({
        request: () => 0,
        cancel: noopCancel,
    });
}

/**
 * Early install so frame.ts callOnce captures the sinon window stubs.
 * Default is noop (not sync): sync immediately re-enters ScrollAnimator/frame
 * loops and blows the stack (draggable + dxScrollView, etc.).
 * Suites that need sync must call stubAnimationFrameSync() in beforeEach.
 */
export function installAnimationFrameStub() {
    return stubAnimationFrameNoop();
}

export function useFakeTimersWithoutAnimationFrame(config = {}) {
    return sinon.useFakeTimers({
        toFake: FAKE_TIMERS_WITHOUT_ANIMATION_FRAME,
        ...config,
    });
}

export { FAKE_TIMERS_WITHOUT_ANIMATION_FRAME };
