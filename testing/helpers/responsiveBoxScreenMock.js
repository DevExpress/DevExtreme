import ResponsiveBox from 'ui/responsive_box';
import resizeCallbacks from 'core/utils/resize_callbacks';

export default {
    setup: function(screenSize) {
        screenSize = screenSize || 1000;

        this.setScreenSize = function(size) {
            screenSize = size;
        };

        this.updateScreenSize = function(size) {
            this.setScreenSize(size);
            resizeCallbacks.fire();
        };

        this.originalScreenWidth = ResponsiveBox.prototype._screenWidth;
        ResponsiveBox.prototype._screenWidth = function() {
            return screenSize;
        };
    },
    teardown: function() {
        ResponsiveBox.prototype._screenWidth = this.originalScreenWidth;
    }
};
