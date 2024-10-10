import domAdapter from '@js/core/dom_adapter';
import callOnce from '@js/core/utils/call_once';
import Callbacks from '@js/core/utils/callbacks';
import readyCallbacks from '@js/core/utils/ready_callbacks';
import { getWindow, hasWindow } from '@js/core/utils/window';

const resizeCallbacks = (function() {
  let prevSize;
  const callbacks = Callbacks();
  const originalCallbacksAdd = callbacks.add;
  const originalCallbacksRemove = callbacks.remove;

  if(!hasWindow()) {
      return callbacks;
  }

  const formatSize = function() {
      const window = getWindow();
      return {
          width: window.innerWidth,
          height: window.innerHeight,
      };
  };

  const handleResize = function() {
      const now = formatSize();
      if(now.width === prevSize.width && now.height === prevSize.height) {
          return;
      }

      let changedDimension;
      if(now.width === prevSize.width) {
          changedDimension = 'height';
      }
      if(now.height === prevSize.height) {
          changedDimension = 'width';
      }

      prevSize = now;

      callbacks.fire(changedDimension);
  };

  const setPrevSize = callOnce(function() {
      prevSize = formatSize();
  });

  let removeListener;

  callbacks.add = function() {
      //@ts-expect-error
      const result = originalCallbacksAdd.apply(callbacks, arguments);

      setPrevSize();

      readyCallbacks.add(function() {
      //@ts-expect-error
          if(!removeListener && callbacks.has()) {
              removeListener = domAdapter.listen(getWindow(), 'resize', handleResize);
          }
      });

      return result;
  };

  callbacks.remove = function() {
      //@ts-expect-error
      const result = originalCallbacksRemove.apply(callbacks, arguments);
      //@ts-expect-error
      if(!callbacks.has() && removeListener) {
          removeListener();
          removeListener = undefined;
      }
      return result;
  };

  return callbacks;
})();

export { resizeCallbacks };
