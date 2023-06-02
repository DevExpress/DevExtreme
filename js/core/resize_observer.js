import { noop } from './utils/common';
import { getWindow, hasWindow } from './utils/window';
const window = getWindow();

const ResizeObserverMock = {
    observe: noop,
    unobserve: noop,
    disconnect: noop
};

class ResizeObserverSingleton {
    constructor() {
        if(!hasWindow() || !window.ResizeObserver) {
            return ResizeObserverMock;
        }

        this._callbacksMap = new Map();
        this._observer = new window.ResizeObserver((entries) => {
            entries.forEach(entry => {
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

///#DEBUG
resizeObserverSingleton.ResizeObserverSingleton = ResizeObserverSingleton;
///#ENDDEBUG

export default resizeObserverSingleton;
