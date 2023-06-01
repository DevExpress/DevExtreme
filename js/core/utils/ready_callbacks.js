import domAdapter from '../dom_adapter';
import injector from './dependency_injector';
import { hasWindow } from './window';
import callOnce from './call_once';
let callbacks = [];

const subscribeReady = callOnce(() => {
    const removeListener = domAdapter.listen(domAdapter.getDocument(), 'DOMContentLoaded', () => {
        readyCallbacks.fire();
        removeListener();
    });
});

const readyCallbacks = {
    add: callback => {
        const windowExists = hasWindow();
        if(windowExists && domAdapter.getReadyState() !== 'loading') {
            callback();
        } else {
            callbacks.push(callback);
            windowExists && subscribeReady();
        }
    },
    fire: () => {
        callbacks.forEach(callback => callback());
        callbacks = [];
    }
};

export default injector(readyCallbacks);
