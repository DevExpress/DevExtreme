import type * as StateManagementTypes from './types';
import { deepCopy, joinStatePath } from './utils';

export class StateManager implements StateManagementTypes.StateManager {
  private readonly devToolsConnector: StateManagementTypes.DevToolsConnector;

  private readonly logger: StateManagementTypes.Logger;

  private componentState: StateManagementTypes.ComponentState;

  private readonly stateSourceSign: string;

  private readonly valueContainerManagers: StateManagementTypes.ValueContainerManagerConstructor[];

  constructor(
    config: StateManagementTypes.StateManagerConfig,
  ) {
    this.componentState = {};

    this.valueContainerManagers = config.valueContainerManagers;
    this.devToolsConnector = config.devToolsConnector;
    this.logger = config.logger;
    this.stateSourceSign = config.stateSourceSign;

    this.init();
  }

  private init(): void {
    this.devToolsConnector.onExternalAction((action) => {
      this.logger.warn(`Handler for the '${action}' action is not implemented`);
    });

    this.devToolsConnector.connect();

    this.logger.info('StateManager initialized');
  }

  trackStateOf(sourceData: StateManagementTypes.StateSource, sourceDataId?: string): void {
    const preparedSourceDataId = sourceDataId ?? sourceData?.constructor?.name;

    if (!sourceData) {
      this.logger.error('State source cannot be null or undefined');
      return;
    }

    if (this.componentState[preparedSourceDataId]) {
      this.logger.debug(`State source with ID '${preparedSourceDataId}' is already tracked. Overwriting.`);
    }

    Object.entries(sourceData).forEach(([propertyName, propertyValue]) => {
      if (this.hasValueContainerManagerFor(propertyValue)) {
        if (!this.componentState[preparedSourceDataId]) {
          this.componentState[preparedSourceDataId] = {};
        }

        const isObject = propertyValue !== undefined && propertyValue !== null
          && typeof propertyValue === 'object';
        this.componentState[preparedSourceDataId][propertyName] = isObject
          ? new WeakRef(propertyValue) : propertyValue;

        this.trackStateSourceChanges(
          preparedSourceDataId,
          propertyName,
          propertyValue,
        );
      } else {
        this.logger.debug(`No value container manager found for the '${propertyName}' property of the '${preparedSourceDataId}' state source`);
      }
    });
  }

  private trackStateSourceChanges(
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
          const valueContainerChangeCopy = {
            ...valueContainerChange,
            payload: { ...valueContainerChange.payload, path: fullPathToProperty },
          };

          const { previousValue, newValue } = valueContainerChange.payload;

          if (typeof previousValue === 'object' && previousValue !== null) {
            valueContainerChangeCopy.payload.previousValue = deepCopy(previousValue);
          }

          if (typeof newValue === 'object' && newValue !== null) {
            valueContainerChangeCopy.payload.newValue = deepCopy(newValue);
          }

          const updatedComponentState = this.getComponentState();

          this.devToolsConnector
            .sendAction(
              'UPDATE',
              valueContainerChangeCopy.payload,
              updatedComponentState,
            );
        },
      );
    } catch (error) {
      this.logger.error(`Failed to track state for ${fullPathToProperty}`, error);
    }
  }

  private hasValueContainerManagerFor(
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): boolean {
    return this.valueContainerManagers
      // eslint-disable-next-line @stylistic/max-len
      .some((currentStateContainerManager) => currentStateContainerManager.canHandle(valueContainer));
  }

  private findValueContainerManagerFor(
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): StateManagementTypes.ValueContainerManager | undefined {
    const valueContainerManagerFactory = this.valueContainerManagers
      // eslint-disable-next-line @stylistic/max-len
      .find((currentStateContainerManager) => currentStateContainerManager.canHandle(valueContainer));

    if (!valueContainerManagerFactory) {
      return undefined;
    }

    return valueContainerManagerFactory.create(this.logger, this.stateSourceSign, valueContainer);
  }

  getComponentState(): StateManagementTypes.ComponentState {
    const result = Object.entries(this.componentState)
      .reduce((acc, [stateId, stateValue]) => {
        Object.entries(stateValue).forEach(([propertyName, propertyValue]) => {
          const preparedPropertyValue = propertyValue instanceof WeakRef
            // eslint-disable-next-line spellcheck/spell-checker
            ? propertyValue.deref() : propertyValue;

          if (!preparedPropertyValue) {
            return acc;
          }

          const valueContainerManager = this.findValueContainerManagerFor(preparedPropertyValue);

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
