import * as commonUtils from 'core/utils/common';

const originalExecuteAsync = commonUtils.executeAsync;

export default {
    setup: function() {
        commonUtils.executeAsync = function(action, context) {
            return originalExecuteAsync.apply(this, [action, context, function(callback) { return callback.apply(this, arguments); }]);
        };
    },
    teardown: function() {
        commonUtils.executeAsync = originalExecuteAsync;
    }
};
