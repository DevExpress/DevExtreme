import callOnce from '@js/core/utils/call_once';
import { getWindow, hasWindow } from '@js/core/utils/window';

type ExtendedWindow = Window & {
  webkitRequestAnimationFrame?: typeof window.requestAnimationFrame;
  mozRequestAnimationFrame?: typeof window.requestAnimationFrame;
  oRequestAnimationFrame?: typeof window.requestAnimationFrame;
  msRequestAnimationFrame?: typeof window.requestAnimationFrame;

  webkitCancelAnimationFrame?: typeof window.cancelAnimationFrame;
  mozCancelAnimationFrame?: typeof window.cancelAnimationFrame;
  oCancelAnimationFrame?: typeof window.cancelAnimationFrame;
  msCancelAnimationFrame?: typeof window.cancelAnimationFrame;
};

const window: ExtendedWindow = (hasWindow() ? getWindow() : {}) as ExtendedWindow;

const FRAME_ANIMATION_STEP_TIME = 1000 / 60;

// eslint-disable-next-line func-names -- description seam for tests
let request = function (callback: FrameRequestCallback): number {
  /* eslint-disable no-restricted-globals */
  return setTimeout(callback, FRAME_ANIMATION_STEP_TIME);
};

// eslint-disable-next-line func-names -- description seam for tests
let cancel = function (requestID: number): void {
  clearTimeout(requestID);
};

const setAnimationFrameMethods = callOnce(() => {
  const nativeRequest = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame;

  const nativeCancel = window.cancelAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.mozCancelAnimationFrame
            || window.oCancelAnimationFrame
            || window.msCancelAnimationFrame;

  if (nativeRequest && nativeCancel) {
    request = nativeRequest;
    cancel = nativeCancel;
  }
});

/* eslint-disable-next-line
  @typescript-eslint/explicit-module-boundary-types, import/no-mutable-exports
  -- description seam for tests */
export let requestAnimationFrame = function (...args): number {
  setAnimationFrameMethods();

  // @ts-ignore
  return request.apply(window, args);
};

/* eslint-disable-next-line
  import/no-mutable-exports
  -- description seam for tests */
export let cancelAnimationFrame = function (requestID: number): void {
  setAnimationFrameMethods();
  cancel.apply(window, [requestID]);
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_requestAnimationFrame(
  value: typeof requestAnimationFrame,
): void {
  requestAnimationFrame = value;
}
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_cancelAnimationFrame(
  value: typeof cancelAnimationFrame,
): void {
  cancelAnimationFrame = value;
}
/// #ENDDEBUG
