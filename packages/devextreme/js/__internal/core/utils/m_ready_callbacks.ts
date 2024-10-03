import domAdapter from '../dom_adapter';
import callOnce from './call_once';
import injector from './dependency_injector';
import { hasWindow } from './window';

let callbacks = [];

const subscribeReady = callOnce(() => {
  const removeListener = domAdapter.listen(domAdapter.getDocument(), 'DOMContentLoaded', () => {
    readyCallbacks.fire();
    removeListener();
  });
});

const readyCallbacks = {
  add: (callback) => {
    const windowExists = hasWindow();
    if (windowExists && domAdapter.getReadyState() !== 'loading') {
      callback();
    } else {
      callbacks.push(callback);
      windowExists && subscribeReady();
    }
  },
  fire: () => {
    callbacks.forEach((callback) => callback());
    callbacks = [];
  },
};

const readyCallbacksModule = injector(readyCallbacks);

export { readyCallbacksModule };
