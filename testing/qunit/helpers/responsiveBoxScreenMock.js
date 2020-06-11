(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.responsiveBoxScreenMock = module.exports = factory(require('jquery'), require('ui/responsive_box'), require('core/utils/resize_callbacks'));
        });
    } else {
        root.responsiveBoxScreenMock = factory(root.jQuery, DevExpress.require('ui/responsive_box'), DevExpress.require('core/utils/resize_callbacks'));
    }
}(window, function($, ResponsiveBox, resizeCallbacks) {
    return {
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
}));
