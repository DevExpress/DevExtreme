import { EventEmitter } from './event_emitter';
import type * as StateManagementTypes from './types';
import { deepCopy } from './utils';

export class StateTracker implements StateManagementTypes.StateTracker {
  private controllersToStates: StateManagementTypes.State = {};

  private readonly stateContainerManagers: StateManagementTypes.StateContainerManager[] = [];

  private readonly logger: StateManagementTypes.Logger;

  private readonly stateChangedEmitter: EventEmitter<
    StateManagementTypes.StateChangeCallback
  >;

  constructor(
    stateContainerManagers: StateManagementTypes.StateContainerManager[],
    logger: StateManagementTypes.Logger,
  ) {
    this.stateContainerManagers = stateContainerManagers;
    this.logger = logger;
    this.stateChangedEmitter = new EventEmitter<StateManagementTypes.StateChangeCallback>(
      'stateChanged',
      logger,
    );
  }

  trackState(
    controllerId: string,
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
  ): void {
    if (!controllerId) {
      this.logger.error('Controller ID is required');
      return;
    }

    if (!stateContainer) {
      this.logger.error('State container is required');
      return;
    }

    if (!stateName) {
      this.logger.error('State name is required');
      return;
    }

    const stateContainerManager = this.findStateContainerManagerFor(stateContainer);

    if (!stateContainerManager) {
      this.logger.debug(`No state container manager found for state container type: ${stateContainer.constructor?.name}`);
      return;
    }

    if (!this.controllersToStates[controllerId]) {
      this.controllersToStates[controllerId] = {};
    }

    this.controllersToStates[controllerId][stateName] = stateContainerManager
      .getState(stateContainer);

    try {
      stateContainerManager.trackChanges(
        stateContainer,
        stateName,
        (change: StateManagementTypes.StateChange) => {
          this.controllersToStates[controllerId][stateName] = change.payload.newValue;

          const fullPath = `${controllerId}.${stateName}`;

          const fullChange = { ...change, payload: { ...change.payload, path: fullPath } };

          this.stateChangedEmitter.emit(fullChange);
        },
      );

      this.logger.debug(`Tracking state for ${controllerId}.${stateName}`);
    } catch (error) {
      this.logger.error(`Failed to track state for ${controllerId}.${stateName}`, error);
    }
  }

  getState(): StateManagementTypes.State {
    return deepCopy(this.controllersToStates);
  }

  onStateChanged(callback: StateManagementTypes.StateChangeCallback): void {
    this.stateChangedEmitter.addListener(callback);
  }

  findStateContainerManagerFor(
    stateContainer: StateManagementTypes.MaybeStateContainer,
  ): StateManagementTypes.StateContainerManager | undefined {
    return this.stateContainerManagers
      // eslint-disable-next-line @stylistic/max-len
      .find((currentStateContainerManager) => currentStateContainerManager.canHandle(stateContainer));
  }
}
