(function(root, factory) {
    root.DevExpress = root.DevExpress || {};
    root.DevExpress.testing = root.DevExpress.testing || {};

    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.DevExpress.testing.executeAsyncMock = module.exports = factory(require('__internal/core/utils/m_common').default);
        });
    } else {
        root.DevExpress.testing.executeAsyncMock = factory(DevExpress.require('__internal/core/utils/m_common'));
    }
}(window, function(commonUtils) {
    const originalExecuteAsync = commonUtils.executeAsync;

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


