(function(root, factory) {
    root.DevExpress = root.DevExpress || {};
    root.DevExpress.testing = root.DevExpress.testing || {};

    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.DevExpress.testing.executeAsyncMock = module.exports = factory(require('core/utils/common'));
        });
    } else {
        root.DevExpress.testing.executeAsyncMock = factory(DevExpress.utils.common);
    }
}(window, function(commonUtils) {
    var originalExecuteAsync = commonUtils.executeAsync;

    return {
        setup: function() {
            commonUtils.executeAsync = function(action, context) {
                return originalExecuteAsync.apply(this, [action, context, function(callback) { return callback.apply(this, arguments); }]);
            };
        },
        teardown: function() {
            commonUtils.executeAsync = originalExecuteAsync;
        }
    };

}));


