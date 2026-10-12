import domAdapter from '@js/core/dom_adapter';
import { callOnce } from '@ts/core/utils/call_once';

import type { CallbackInterface } from './callbacks';
// eslint-disable-next-line import/no-named-as-default
import Callbacks from './callbacks';
import windowModule from './m_window';
import readyCallbacks from './ready_callbacks';

interface Size {
  width: number;
  height: number;
}

type ResizeCallbacks = Omit<CallbackInterface, 'has' | 'fire' | 'fireWith'> & {
  has: (fn?: Parameters<CallbackInterface['has']>[0]) => boolean;
  fire: (...args: Parameters<CallbackInterface['fire']>) => void;
  fireWith: (...args: Parameters<CallbackInterface['fireWith']>) => ResizeCallbacks | undefined;
};

const resizeCallbacks = (function createResizeCallbacks(): ResizeCallbacks {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- set by setPrevSize
  let prevSize: Size;
  const callbacks: ResizeCallbacks = Callbacks();
  const originalCallbacksAdd = callbacks.add;
  const originalCallbacksRemove = callbacks.remove;

  if (!windowModule.hasWindow()) {
    return callbacks;
  }

  const formatSize = function formatSize(): Size {
    const window = windowModule.getWindow();
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const handleResize = function handleResize(): void {
    const now = formatSize();
    if (now.width === prevSize.width && now.height === prevSize.height) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/init-declarations -- set by the checks below
    let changedDimension: 'width' | 'height' | undefined;
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

  // eslint-disable-next-line @typescript-eslint/init-declarations -- set when the listener is added
  let removeListener: (() => void) | undefined;

  callbacks.add = function add(
    ...args: Parameters<typeof originalCallbacksAdd>
  ): ReturnType<typeof originalCallbacksAdd> {
    const result = originalCallbacksAdd.apply(callbacks, args);

    setPrevSize();

    readyCallbacks.add(() => {
      if (!removeListener && callbacks.has()) {
        removeListener = domAdapter.listen(windowModule.getWindow(), 'resize', handleResize);
      }
    });

    return result;
  };

  callbacks.remove = function remove(
    ...args: Parameters<typeof originalCallbacksRemove>
  ): ReturnType<typeof originalCallbacksRemove> {
    const result = originalCallbacksRemove.apply(callbacks, args);
    if (!callbacks.has() && removeListener) {
      removeListener();
      removeListener = undefined;
    }
    return result;
  };

  return callbacks;
}());

export { resizeCallbacks };
export default resizeCallbacks;
