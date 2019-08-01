(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.responsiveBoxScreenMock = module.exports = factory(require("jquery"), require("core/utils/window"), require("core/utils/resize_callbacks"));
        });
    } else {
        root.responsiveBoxScreenMock = factory(root.jQuery, DevExpress.require("core/utils/window"), DevExpress.require("core/utils/resize_callbacks"));
    }
}(window, function($, WindowUtils, resizeCallbacks) {
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

            this.originalScreenWidth = WindowUtils.getWindowWidth;
            WindowUtils.getWindowWidth = function() {
                return screenSize;
            };
        },
        teardown: function() {
            WindowUtils.getWindowWidth = this.originalScreenWidth;
        }
    };
}));
