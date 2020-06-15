import { logger } from './console';
import dependencyInjector from './dependency_injector';

export default dependencyInjector({
    isWrapped: function() {
        return false;
    },
    isWritableWrapped: function() {
        return false;
    },
    wrap: function(value) {
        return value;
    },
    unwrap: function(value) {
        return value;
    },
    assign: function() {
        logger.error('Method \'assign\' should not be used for not wrapped variables. Use \'isWrapped\' method for ensuring.');
    }
});
