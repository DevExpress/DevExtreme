import { getWindow, hasWindow } from '@js/core/utils/window';
import { callOnce } from '@ts/core/utils/call_once';

type AnimationFrameWindow = Partial<Pick<Window, 'requestAnimationFrame' | 'cancelAnimationFrame'>>;

const window: AnimationFrameWindow = hasWindow() ? getWindow() : {};

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
  const nativeRequest = window.requestAnimationFrame;
  const nativeCancel = window.cancelAnimationFrame;

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
