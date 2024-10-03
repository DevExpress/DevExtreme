import { logger } from './console';
import dependencyInjector from './dependency_injector';

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
