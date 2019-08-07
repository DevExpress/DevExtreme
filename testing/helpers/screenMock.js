import resizeCallbacks from "core/utils/resize_callbacks";
import windowUtils from "core/utils/window";

const DEFAULT_SCREEN_WIDTH = 1000;

class screenMock {
    constructor(screenWidth) {
        this._screenSize = screenWidth || DEFAULT_SCREEN_WIDTH;
        this._originalScreenWidth = windowUtils.getWindowWidth();
        this.setWindowWidth(this._screenSize);
    }

    setWindowWidth(width) {
        Object.defineProperty(document.documentElement, "clientWidth", {
            get: () => width || this._screenSize,
            configurable: true
        });
    }

    updateWindowWidth(width) {
        this.setWindowWidth(width);
        resizeCallbacks.fire();
    }

    restore() {
        Object.defineProperty(document.documentElement, "clientWidth", {
            get: () => this._originalScreenWidth,
            configurable: true
        });
    }
}

export default screenMock;
