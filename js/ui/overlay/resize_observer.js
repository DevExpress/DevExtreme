import { getWindow, hasWindow } from '../../core/utils/window';
const window = getWindow();

class ResizeObserver {
    constructor(options) {
        if(!hasWindow()) {
            return;
        }

        this._observer = new window.ResizeObserver((...args) => {
            const shouldSkip = options.shouldSkipCallback?.(...args);
            if(!shouldSkip) {
                options.callback(...args);
            }
        });
    }

    observe(element) {
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
