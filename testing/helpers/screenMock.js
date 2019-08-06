import resizeCallbacks from "core/utils/resize_callbacks";
import WindowUtils from "core/utils/window";

class screenMock {
    constructor(screenWidth) {
        this._screenSize = screenWidth || 1000;
        this._originalScreenWidth = WindowUtils.getWindowWidth();
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
