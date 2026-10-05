import domAdapter from '@js/core/dom_adapter';
import { callOnce } from '@ts/core/utils/call_once';

import type { CallbackInterface } from './m_callbacks';
// eslint-disable-next-line import/no-named-as-default
import Callbacks from './m_callbacks';
import readyCallbacks from './m_ready_callbacks';
import windowModule from './m_window';

interface Size {
  width: number;
  height: number;
}

type ResizeCallbacks = Omit<CallbackInterface, 'has'> & { has: () => boolean };

const resizeCallbacks = (function (): ResizeCallbacks {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- set by setPrevSize
  let prevSize: Size;
  const callbacks: ResizeCallbacks = Callbacks();
  const originalCallbacksAdd = callbacks.add;
  const originalCallbacksRemove = callbacks.remove;

  if (!windowModule.hasWindow()) {
    return callbacks;
  }

  const formatSize = function (): Size {
    const window = windowModule.getWindow();
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const handleResize = function (): void {
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

  callbacks.add = function (
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

  callbacks.remove = function (
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
