/* eslint-disable spellcheck/spell-checker */
import { Logger } from './logger';
import { ReactiveValueContainerManagerFactory } from './reactive_value_container_manager';
import { ReduxDevToolsConnector } from './redux_dev_tools_connector';
import { StateManager } from './state_manager';
import type * as StateManagementTypes from './types';

export const makeStateManager = (
  options: StateManagementTypes.StateManagerFactoryOptions,
): StateManager => {
  const logger = options.logger ?? new Logger({ logLevel: options.logLevel, prefix: '[StateManager]' });

  const stateContainerManagers: StateManagementTypes.StateManagerConfig['valueContainerManagers'] = options.valueContainerManagers ?? [ReactiveValueContainerManagerFactory];

  const preparedConfig: StateManagementTypes.StateManagerConfig = {
    valueContainerManagers: stateContainerManagers,
    devToolsConnector: options.devToolsConnector
          ?? new ReduxDevToolsConnector(options.componentName, logger),
    logger,
    stateSourceSign: options.stateSourceSign,
  };

  return new StateManager(preparedConfig);
};
