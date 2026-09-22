import commonUtils from '__internal/core/utils/m_common';

const originalExecuteAsync = commonUtils.executeAsync;

const executeAsyncMock = {
    setup: function() {
        commonUtils.executeAsync = function(action, context) {
            return originalExecuteAsync.apply(this, [action, context, function(callback) { return callback.apply(this, arguments); }]);
        };
    },
    teardown: function() {
        commonUtils.executeAsync = originalExecuteAsync;
    }
};

window.DevExpress = window.DevExpress || {};
window.DevExpress.testing = window.DevExpress.testing || {};
window.DevExpress.testing.executeAsyncMock = executeAsyncMock;

export default executeAsyncMock;
