import ResponsiveBox from 'ui/responsive_box';
import resizeCallbacks from 'core/utils/resize_callbacks';

const responsiveBoxScreenMock = {
    setup(screenSize) {
        let currentSize = screenSize || 1000;

        this.setScreenSize = function(size) {
            currentSize = size;
        };

        this.updateScreenSize = function(size) {
            this.setScreenSize(size);
            resizeCallbacks.fire();
        };

        this.originalScreenWidth = ResponsiveBox.prototype._screenWidth;
        ResponsiveBox.prototype._screenWidth = function() {
            return currentSize;
        };
    },
    teardown() {
        ResponsiveBox.prototype._screenWidth = this.originalScreenWidth;
    }
};

export default responsiveBoxScreenMock;
