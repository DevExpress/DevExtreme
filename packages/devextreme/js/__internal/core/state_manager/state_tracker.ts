import { EventEmitter } from './event_emitter';
import type {
  ILogger,
  IMaybeStateContainer,
  IState,
  IStateChange,
  IStateChangeCallback,
  IStateContainer,
  IStateContainerManager,
  IStateTracker,
} from './interfaces';
import { deepCopy } from './utils';

export class StateTracker implements IStateTracker {
  private controllersToStates: IState = {};

  private readonly stateContainerManagers: IStateContainerManager[] = [];

  private readonly logger: ILogger;

  private readonly stateChangedEmitter: EventEmitter<IStateChangeCallback>;

  constructor(stateContainerManagers: IStateContainerManager[], logger: ILogger) {
    this.stateContainerManagers = stateContainerManagers;
    this.logger = logger;
    this.stateChangedEmitter = new EventEmitter<IStateChangeCallback>(
      'stateChanged',
      logger,
    );
  }

  trackState(controllerId: string, stateContainer: IStateContainer, stateName: string): void {
    if (!controllerId) {
      this.logger.error('IController ID is required');
      return;
    }

    if (!stateContainer) {
      this.logger.error('IState container is required');
      return;
    }

    if (!stateName) {
      this.logger.error('IState name is required');
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
      stateContainerManager.trackChanges(stateContainer, stateName, (change: IStateChange) => {
        this.controllersToStates[controllerId][stateName] = change.payload.newValue;

        const fullPath = `${controllerId}.${stateName}`;

        const fullChange = { ...change, payload: { ...change.payload, path: fullPath } };

        this.stateChangedEmitter.emit(fullChange);
      });

      this.logger.debug(`Tracking state for ${controllerId}.${stateName}`);
    } catch (error) {
      this.logger.error(`Failed to track state for ${controllerId}.${stateName}`, error);
    }
  }

  getState(): IState {
    return deepCopy(this.controllersToStates);
  }

  onStateChanged(callback: IStateChangeCallback): void {
    this.stateChangedEmitter.addListener(callback);
  }

  findStateContainerManagerFor(
    stateContainer: IMaybeStateContainer,
  ): IStateContainerManager | null {
    return this.stateContainerManagers
      // eslint-disable-next-line @stylistic/max-len
      .find((currentStateContainerManager) => currentStateContainerManager.canHandle(stateContainer)) ?? null;
  }
}
