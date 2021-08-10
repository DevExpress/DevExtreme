import { noop } from './utils/common';
import { getWindow, hasWindow } from './utils/window';
const window = getWindow();

const ResizeObserverNoWindowMock = {
    observe: noop,
    unobserve: noop,
    disconnect: noop
};

const ResizeObserverSingletonFactory = (function() {
    let instance;

    function ResizeObserverSingleton() {
        if(!hasWindow()) {
            return ResizeObserverNoWindowMock;
        }

        this._callbacksMap = new Map();
        this._observer = new window.ResizeObserver((entries) => {
            entries.forEach(entry => {
                this._callbacksMap.get(entry.target)?.(entry);
            });
        });
    }

    ResizeObserverSingleton.getInstance = function() {
        return instance ?? (instance = new ResizeObserverSingleton());
    };

    ResizeObserverSingleton.prototype.observe = function(element, callback) {
        this._callbacksMap.set(element, callback);
        this._observer.observe(element);
    };

    ResizeObserverSingleton.prototype.unobserve = function(element) {
        this._callbacksMap.delete(element);
        this._observer.unobserve(element);
    };

    ResizeObserverSingleton.prototype.disconnect = function() {
        this._callbacksMap.clear();
        this._observer.disconnect();
    };

    return ResizeObserverSingleton;
})();

export default ResizeObserverSingletonFactory;
