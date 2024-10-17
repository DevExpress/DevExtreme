import { noop } from '@js/core/utils/common';

import windowUtils from './utils/m_window';

const window = windowUtils.getWindow();

const ResizeObserverMock = {
  observe: noop,
  unobserve: noop,
  disconnect: noop,
};

class ResizeObserverSingleton {
  _callbacksMap?: any;

  _observer?: any;

  constructor() {
    // we need to make our own for extensions like this
    if (!windowUtils.hasWindow() || !window.ResizeObserver) {
      // eslint-disable-next-line no-constructor-return
      return ResizeObserverMock;
    }

    this._callbacksMap = new Map();
    this._observer = new window.ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this._callbacksMap.get(entry.target)?.(entry);
      });
    });
  }

  observe(element, callback) {
    this._callbacksMap.set(element, callback);
    this._observer.observe(element);
  }

  unobserve(element) {
    this._callbacksMap.delete(element);
    this._observer.unobserve(element);
  }

  disconnect() {
    this._callbacksMap.clear();
    this._observer.disconnect();
  }
}

const resizeObserverSingleton = new ResizeObserverSingleton();

/// #DEBUG
// @ts-expect-error singleton typing issue
resizeObserverSingleton.ResizeObserverSingleton = ResizeObserverSingleton;
/// #ENDDEBUG

export { resizeObserverSingleton };
