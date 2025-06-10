import type * as StateManagementTypes from './types';
import { deepCopy, joinStatePath } from './utils';

export class StateManager implements StateManagementTypes.StateManager {
  private readonly devToolsConnector: StateManagementTypes.DevToolsConnector;

  private readonly logger: StateManagementTypes.Logger;

  private componentState: StateManagementTypes.ComponentState;

  private readonly controllerSign: string;

  private readonly valueContainerManagers: StateManagementTypes.ValueContainerManagerConstructor[];

  constructor(
    config: StateManagementTypes.StateManagerConfig,
  ) {
    const {
      devToolsConnector, logger, valueContainerManagers, controllerSign,
    } = config;
    this.componentState = {};

    this.valueContainerManagers = valueContainerManagers;
    this.devToolsConnector = devToolsConnector;
    this.logger = logger;
    this.controllerSign = controllerSign;

    this.init();
  }

  private init(): void {
    this.devToolsConnector.onExternalAction((action) => {
      this.logger.warn(`Handler for the '${action}' action is not implemented`);
    });

    this.devToolsConnector.connect();

    this.logger.info('StateManager initialized');
  }

  trackControllerState(controlledId: string, controller: StateManagementTypes.Controller): void {
    if (!controller) {
      this.logger.error('Controller cannot be null or undefined');
      return;
    }

    if (this.componentState[controlledId]) {
      this.logger.debug(`Controller with ID '${controlledId}' is already tracked. Overwriting.`);
    }

    Object.entries(controller).forEach(([controllerPropertyName, controllerPropertyValue]) => {
      if (this.findValueContainerManagerFor(controllerPropertyValue)) {
        if (!this.componentState[controlledId]) {
          this.componentState[controlledId] = {};
        }

        this.componentState[controlledId][controllerPropertyName] = controllerPropertyValue;

        this.trackControllerStateChanges(
          controlledId,
          controllerPropertyName,
          controllerPropertyValue,
        );
      } else {
        this.logger.debug(`No value container manager found for the '${controllerPropertyName}' property of the '${controlledId}' controller`);
      }
    });
  }

  private trackControllerStateChanges(
    stateId: string,
    propertyName: string,
    propertyValue: StateManagementTypes.MaybeValueContainer,
  ): void {
    const valueContainerManager = this.findValueContainerManagerFor(propertyValue);

    if (!valueContainerManager) {
      this.logger.debug(`No value container manager found for the '${propertyName}' property of the '${stateId}' state`);
      return;
    }

    const fullPathToProperty = joinStatePath(stateId, propertyName);

    try {
      valueContainerManager.trackChanges(
        (valueContainerChange: StateManagementTypes.ValueContainerChange) => {
          const componentStateChange = {
            ...valueContainerChange,
            payload: { ...valueContainerChange.payload, path: fullPathToProperty },
          };

          const currentComponentState = this.getComponentState();

          this.devToolsConnector
            .sendAction(
              valueContainerChange.actionType,
              componentStateChange.payload,
              currentComponentState,
            );
        },
      );
    } catch (error) {
      this.logger.error(`Failed to track state for ${fullPathToProperty}`, error);
    }
  }

  private findValueContainerManagerFor(
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): StateManagementTypes.ValueContainerManager | undefined {
    const ValueContainerManager = this.valueContainerManagers
      // eslint-disable-next-line @stylistic/max-len
      .find((currentStateContainerManager) => currentStateContainerManager.canHandle(valueContainer));

    if (!ValueContainerManager) {
      return undefined;
    }

    return new ValueContainerManager(this.logger, this.controllerSign, valueContainer);
  }

  getComponentState(): StateManagementTypes.ComponentState {
    const result = Object.entries(this.componentState)
      .reduce((acc, [stateId, stateValue]) => {
        Object.entries(stateValue).forEach(([propertyName, propertyValue]) => {
          const valueContainerManager = this.findValueContainerManagerFor(propertyValue);

          if (!valueContainerManager) {
            return acc;
          }

          const value = valueContainerManager.getValue();

          if (!acc[stateId]) {
            acc[stateId] = {};
          }

          acc[stateId][propertyName] = value !== undefined && value !== null && typeof value === 'object' ? deepCopy(value) : value;

          return acc;
        });

        return acc;
      }, {});

    return result;
  }
}
