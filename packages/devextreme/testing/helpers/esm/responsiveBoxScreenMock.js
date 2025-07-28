// ESM version of responsiveBoxScreenMock.js
// Auto-generated from UMD module

import $ from 'jquery';


// Execute factory function and create module
(function() {


    // Create module object
    const moduleObject = {
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

    // Backward compatibility - add to global namespace
    if(typeof window !== 'undefined') {
        window.DevExpress = window.DevExpress || {};
        window.DevExpress.testing = window.DevExpress.testing || {};
        window.DevExpress.testing.responsiveBoxScreenMock = moduleObject;
    }

    // Export module
    window.__responsiveBoxScreenMock__ = moduleObject;
})();

// ES6 exports
const responsiveBoxScreenMock = window.__responsiveBoxScreenMock__;
export default responsiveBoxScreenMock;
export { responsiveBoxScreenMock };
