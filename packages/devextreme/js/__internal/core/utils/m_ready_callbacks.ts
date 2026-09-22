import domAdapter from '@js/core/dom_adapter';
import callOnce from '@js/core/utils/call_once';
import { hasWindow } from '@js/core/utils/window';
import { injector } from '@ts/core/utils/dependency_injector';

let callbacks: any[] = [];

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
export default readyCallbacksModule;
