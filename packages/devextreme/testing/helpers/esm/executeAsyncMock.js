import commonUtils from '__internal/core/utils/m_common';

const originalExecuteAsync = commonUtils.executeAsync;

export const setup = () => {
    commonUtils.executeAsync = function(action, context) {
        return originalExecuteAsync.apply(this, [action, context, function(callback) {
            return callback.apply(this, arguments);
        }]);
    };
};

export const teardown = () => {
    commonUtils.executeAsync = originalExecuteAsync;
};

setup();

export default { setup, teardown };
