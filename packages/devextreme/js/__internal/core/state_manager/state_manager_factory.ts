/* eslint-disable spellcheck/spell-checker */
import { ControllerRegistry } from './controller_registry';
import { ReduxDevToolsConnector } from './dev_tools_connector';
import type {
  IStateManagerConfig,
  IStateManagerFactoryOptions,
} from './interfaces';
import { ConsoleLogger } from './logger';
import { ObservableStateContainerManager } from './observable_state_container_manager';
import { StateHistory } from './state_history';
import { StateManager } from './state_manager';
import { StateTracker } from './state_tracker';

export const makeStateManager = (options: IStateManagerFactoryOptions): StateManager => {
  const logger = new ConsoleLogger({ logLevel: options.logLevel, prefix: '[StateManager]' });

  const stateContainerManagers = options.stateContainerManagers
    ?? [new ObservableStateContainerManager(logger, options.controllerSign)];
  const stateTracker = options.stateTracker ?? new StateTracker(stateContainerManagers, logger);

  const preparedConfig: IStateManagerConfig = {
    controllerRegistry: options.controllerRegistry ?? new ControllerRegistry(logger),
    stateTracker,
    stateHistory: options.stateHistory
          ?? new StateHistory(logger, options.maxHistorySize),
    devToolsConnector: options.devToolsConnector
          ?? new ReduxDevToolsConnector(options.componentName, logger),
    logger,
  };

  return new StateManager(preparedConfig);
};
