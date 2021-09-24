import domAdapter from '../dom_adapter';
import injector from './dependency_injector';
import { hasWindow } from './window';
import callOnce from './call_once';

let callbacks = [];

const fire = () => {
    callbacks.forEach(callback => callback());
    callbacks = [];
};

const subscribeReady = callOnce(() => {
    const removeListener = domAdapter.listen(domAdapter.getDocument(), 'DOMContentLoaded', () => {
        fire();
        removeListener();
    });
});

const add = callback => {
    const windowExists = hasWindow();
    if(windowExists && domAdapter.getReadyState() !== 'loading') {
        callback();
    } else {
        callbacks.push(callback);
        windowExists && subscribeReady();
    }
};

const readyCallbacks = {
    add,
    fire
};

export default injector(readyCallbacks);
