import domAdapter from '@js/core/dom_adapter';
import { hasWindow } from '@js/core/utils/window';
import { callOnce } from '@ts/core/utils/call_once';
import { injector } from '@ts/core/utils/dependency_injector';

type ReadyCallback = () => void;

let callbacks: ReadyCallback[] = [];

const subscribeReady = callOnce(() => {
  const removeListener = domAdapter.listen(domAdapter.getDocument(), 'DOMContentLoaded', () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- used after the definition
    readyCallbacks.fire();
    removeListener();
  });
});

const readyCallbacks = {
  add: (callback: ReadyCallback): void => {
    const windowExists = hasWindow();
    if (windowExists && domAdapter.getReadyState() !== 'loading') {
      callback();
    } else {
      callbacks.push(callback);
      if (windowExists) {
        subscribeReady();
      }
    }
  },
  fire: (): void => {
    callbacks.forEach((callback) => callback());
    callbacks = [];
  },
};

const readyCallbacksModule = injector(readyCallbacks);

export { readyCallbacksModule };
export default readyCallbacksModule;
