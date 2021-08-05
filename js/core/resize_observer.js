import { getWindow, hasWindow } from './utils/window';
const window = getWindow();

const ResizeObserver = (function() {
    let instance;

    function ResizeObserver(options) {
        if(!hasWindow()) {
            return;
        }

        if(instance) {
            return instance;
        }

        this._observer = new window.ResizeObserver((...args) => {
            const shouldSkip = options.shouldSkipCallback?.(...args);
            if(!shouldSkip) {
                options.callback(...args);
            }
        });
        return instance = this;
    }

    ResizeObserver.prototype.observe = function(element) {
        this._observer?.observe(element);
    };

    ResizeObserver.prototype.unobserve = function(element) {
        this._observer?.unobserve(element);
    };

    ResizeObserver.prototype.disconnect = function() {
        this._observer?.disconnect();
    };

    return ResizeObserver;
})();

export default ResizeObserver;
