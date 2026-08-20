import { logger } from '@js/core/utils/console';
import dependencyInjector from '@js/core/utils/dependency_injector';

interface VariableWrapper {
  isWrapped: (value: any) => boolean;
  isWritableWrapped: (value: any) => boolean;
  wrap: (value: any) => any;
  unwrap: (value: any) => any;
  assign: (variable: any, value: any) => void;
}

const variableWrapper = dependencyInjector<VariableWrapper>({
  isWrapped: function () {
    return false;
  },
  isWritableWrapped: function () {
    return false;
  },
  wrap: function (value) {
    return value;
  },
  unwrap: function (value) {
    return value;
  },
  assign: function () {
    logger.error('Method \'assign\' should not be used for not wrapped variables. Use \'isWrapped\' method for ensuring.');
  },
});
export { variableWrapper };
