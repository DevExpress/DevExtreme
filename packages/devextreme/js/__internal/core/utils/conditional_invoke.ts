import { isPromise } from '@js/core/utils/type';

function invokeConditionally(
  cancelResult: boolean | PromiseLike<boolean>,
  callback: () => void,
  cancelCallback?: () => void,
): void {
  const invokeCallback = (cancel: boolean): void => {
    const callbackToInvoke = cancel ? cancelCallback : callback;

    callbackToInvoke?.();
  };

  if (isPromise(cancelResult)) {
    cancelResult
      .then(invokeCallback)
      .catch(callback);
  } else {
    invokeCallback(Boolean(cancelResult));
  }
}

export { invokeConditionally };
