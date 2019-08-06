import resizeCallbacks from "core/utils/resize_callbacks";
import WindowUtils from "core/utils/window";

class screenMock {
    constructor(screenWidth) {
        this.screenSize = screenWidth || 1000;
        this.originalScreenWidth = WindowUtils.getWindowWidth();
    }

    setWindowWidth(width) {
        Object.defineProperty(document.documentElement, "clientWidth", {
            get: () => width || this.screenSize,
            configurable: true
        });
    }

    updateWindowWidth(width) {
        this.setWindowWidth(width);
        resizeCallbacks.fire();
    }

    restore() {
        Object.defineProperty(document.documentElement, "clientWidth", {
            get: () => this.originalScreenWidth,
            configurable: true
        });
    }
}

export default screenMock;
