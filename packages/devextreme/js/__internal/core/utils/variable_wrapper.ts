import { logger } from '@js/core/utils/console';
import { injector as dependencyInjector } from '@ts/core/utils/dependency_injector';

interface VariableWrapper {
  isWrapped: (value: unknown) => boolean;
  isWritableWrapped: (value: unknown) => boolean;
  wrap: (value: unknown) => unknown;
  unwrap: (value: unknown) => unknown;
  assign: (variable: unknown, value: unknown) => void;
}

const variableWrapper = dependencyInjector<VariableWrapper>({
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
