import { logger } from '@js/core/utils/console';
import dependencyInjector from '@js/core/utils/dependency_injector';

const variableWrapper = dependencyInjector({
  isWrapped() {
    return false;
  },
  isWritableWrapped() {
    return false;
  },
  wrap(value) {
    return value;
  },
  unwrap(value) {
    return value;
  },
  assign() {
    logger.error('Method \'assign\' should not be used for not wrapped variables. Use \'isWrapped\' method for ensuring.');
  },
});
export { variableWrapper };
