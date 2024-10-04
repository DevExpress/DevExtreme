import domAdapter from '@js/core/dom_adapter';
import callOnce from '@js/core/utils/call_once';
import Callbacks from '@js/core/utils/callbacks';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { getWindow, hasWindow } from '@js/core/utils/window';

const resizeCallbacks = (function () {
  let prevSize;
  const callbacks = Callbacks();
  const originalCallbacksAdd = callbacks.add;
  const originalCallbacksRemove = callbacks.remove;

  if (!hasWindow()) {
    return callbacks;
  }

  const formatSize = function () {
    const window = getWindow();
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const handleResize = function () {
    const now = formatSize();
    if (now.width === prevSize.width && now.height === prevSize.height) {
      return;
    }

    let changedDimension;
    if (now.width === prevSize.width) {
      changedDimension = 'height';
    }
    if (now.height === prevSize.height) {
      changedDimension = 'width';
    }

    prevSize = now;

    callbacks.fire(changedDimension);
  };

  const setPrevSize = callOnce(() => {
    prevSize = formatSize();
  });

  let removeListener;

  callbacks.add = function (...args) {
    const result = originalCallbacksAdd.apply(callbacks, args);

    setPrevSize();

    readyCallbacks.add(() => {
      // @ts-expect-error no args for has
      if (!removeListener && callbacks.has()) {
        removeListener = domAdapter.listen(getWindow(), 'resize', handleResize);
      }
    });

    return result;
  };

  callbacks.remove = function () {
    // @ts-expect-error args do not match with our d.ts type
    const result = originalCallbacksRemove.apply(callbacks, arguments);
    // @ts-expect-error no args for has
    if (!callbacks.has() && removeListener) {
      removeListener();
      removeListener = undefined;
    }
    return result;
  };

  return callbacks;
}());

export { resizeCallbacks };
