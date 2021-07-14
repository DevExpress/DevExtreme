import { getWindow, hasWindow } from '../../core/utils/window';
const window = getWindow();

class ResizeObserver {
    constructor(callback) {
        if(!hasWindow()) {
            return;
        }

        this._observer = new window.ResizeObserver((...args) => {
            if(!this._shouldSkipNextResize) {
                callback(...args);
            }
            this._shouldSkipNextResize = false;
        });
    }

    skipNextResize() {
        this._shouldSkipNextResize = true;
    }

    observe(element) {
        this.skipNextResize();
        this._observer?.observe(element);
    }

    unobserve(element) {
        this._observer?.unobserve(element);
    }

    disconnect() {
        this._observer?.disconnect();
    }
}

export default ResizeObserver;
