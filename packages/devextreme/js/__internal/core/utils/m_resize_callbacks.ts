import domAdapter from '../dom_adapter';
import callOnce from './call_once';
import Callbacks from './callbacks';
import readyCallbacks from './ready_callbacks';
import { getWindow, hasWindow } from './window';

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

  callbacks.add = function () {
    const result = originalCallbacksAdd.apply(callbacks, arguments);

    setPrevSize();

    readyCallbacks.add(() => {
      if (!removeListener && callbacks.has()) {
        removeListener = domAdapter.listen(getWindow(), 'resize', handleResize);
      }
    });

    return result;
  };

  callbacks.remove = function () {
    const result = originalCallbacksRemove.apply(callbacks, arguments);

    if (!callbacks.has() && removeListener) {
      removeListener();
      removeListener = undefined;
    }
    return result;
  };

  return callbacks;
}());

export { resizeCallbacks };
