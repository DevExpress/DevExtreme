import type * as StateManagementTypes from './types';
import { isValidStatePath, splitStatePath } from './utils';

export class StateManager implements StateManagementTypes.StateManager {
  private readonly controllerRegistry: StateManagementTypes.ControllerRegistry;

  private readonly stateTracker: StateManagementTypes.StateTracker;

  private readonly stateHistory: StateManagementTypes.StateHistory;

  private readonly devToolsConnector: StateManagementTypes.DevToolsConnector;

  private readonly logger: StateManagementTypes.Logger;

  private isRestoring = false;

  private isWarnedAboutUnstableJumpToStateFunctionality = false;

  constructor(
    config: StateManagementTypes.StateManagerConfig,
  ) {
    const {
      controllerRegistry, stateTracker, stateHistory, devToolsConnector, logger,
    } = config;

    this.controllerRegistry = controllerRegistry;
    this.stateTracker = stateTracker;
    this.stateHistory = stateHistory;
    this.devToolsConnector = devToolsConnector;
    this.logger = logger;

    this.setupEventHandlers();
    this.devToolsConnector.connect();

    this.logger.info('StateManager initialized');
  }

  registerController(...args: Parameters<StateManagementTypes.ControllerRegistry['registerController']>): ReturnType<StateManagementTypes.ControllerRegistry['registerController']> {
    const [controller, id] = args;
    return this.controllerRegistry.registerController(controller, id);
  }

  restoreState(state: StateManagementTypes.State): void {
    try {
      this.isRestoring = true;
      const controllers = this.controllerRegistry.getAllControllers();

      Object.keys(state).forEach((controllerId) => {
        const controller = controllers[controllerId];

        if (!controller) {
          this.logger.warn(`Cannot restore state: Controller not found: ${controllerId}`);
          return;
        }

        const controllerState = state[controllerId];

        Object.keys(controllerState).forEach((propertyName) => {
          const value = controller[propertyName];

          if (!value) {
            this.logger.warn(`Cannot restore state: Property not found: ${controllerId}.${propertyName}`);
            return;
          }

          const currentStateContainerManager = this.stateTracker
            .findStateContainerManagerFor(value);

          if (!currentStateContainerManager) {
            this.logger.error(`Cannot restore state: No state container manager found for state container: ${controllerId}.${propertyName}`);
            return;
          }

          if (this.isStateContainer(value) && currentStateContainerManager.canHandle(value)) {
            currentStateContainerManager
              .applyState(value, propertyName, controllerState[propertyName]);
          } else {
            this.logger.warn(`Cannot restore state: the state container manager cannot handle state container type for ${controllerId}.${propertyName}`);
          }
        });
      });

      this.logger.info('State restored');
    } catch (error) {
      this.logger.error('Failed to restore state', error);
    } finally {
      this.isRestoring = false;
    }
  }

  resetState(): void {
    try {
      const initialStates = new Map<string, unknown>();
      const history = this.stateHistory.getHistory();

      history.forEach((change) => {
        if (change.actionType === 'INITIALIZE') {
          initialStates.set(change.payload.path, change.payload.newValue);
        }
      });

      const state: StateManagementTypes.State = {};

      Array.from(initialStates.entries()).forEach(([path, value]) => {
        const parts = splitStatePath(path);

        if (!isValidStatePath(path)) {
          this.logger.error(`Invalid state path: ${path}. Expected format: controllerId.propertyName`);
          return;
        }

        const [controllerId, propertyName] = parts;

        if (!state[controllerId]) {
          state[controllerId] = {};
        }

        state[controllerId][propertyName] = value;
      });

      this.restoreState(state);

      this.logger.info('State reset to initial values');
    } catch (error) {
      this.logger.error('Failed to reset state', error);
    }
  }

  updateState(path: string, value: unknown): void {
    try {
      if (!isValidStatePath(path)) {
        this.logger.error(`Invalid state path: ${path}. Expected format: controllerId.propertyName`);
        return;
      }

      const parts = splitStatePath(path);
      const controllerId = parts[0];
      const propertyName = parts[1];

      const controller = this.controllerRegistry.getController(controllerId);
      if (!controller) {
        this.logger.error(`Controller not found: ${controllerId}`);
        return;
      }

      const stateContainer = controller[propertyName];
      if (!stateContainer) {
        this.logger.error(`Property not found: ${propertyName} in controller ${controllerId}`);
        return;
      }

      const currentStateContainerManager = this.stateTracker
        .findStateContainerManagerFor(stateContainer);

      if (!currentStateContainerManager) {
        this.logger.error(`No state container manager found for state container type: ${stateContainer.constructor?.name}`);
        return;
      }

      if (this.isStateContainer(stateContainer)
        && currentStateContainerManager.canHandle(stateContainer)) {
        currentStateContainerManager.applyState(stateContainer, propertyName, value);
      } else {
        this.logger.error('State container manager cannot handle state container type');
      }

      this.logger.debug(`Updated state: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to update state: ${path}`, error);
      throw error;
    }
  }

  getState(): StateManagementTypes.State {
    return this.stateTracker.getState();
  }

  getHistory(): StateManagementTypes.StateChange[] {
    return this.stateHistory.getHistory();
  }

  getStateAt(historyIndex: number): StateManagementTypes.State {
    return this.stateHistory.getStateAt(historyIndex);
  }

  clearHistory(): void {
    this.stateHistory.clear();

    if (this.devToolsConnector) {
      const currentState = this.getState();
      const actionType: StateManagementTypes.StateManagerActionType = 'CLEAR_HISTORY';
      this.devToolsConnector.sendAction(actionType, {
        path: '', newValue: 'History cleared', timestamp: Date.now(), source: '', previousValue: '',
      }, currentState);
    }
  }

  private setupEventHandlers(): void {
    this.controllerRegistry.onControllerRegistered((controller, id) => {
      this.discoverState(controller, id);
    });

    this.stateTracker.onStateChanged((change) => {
      if (!this.isRestoring) {
        this.stateHistory.recordChange(change);

        const currentState = this.getState();
        this.devToolsConnector.sendAction(change.actionType, change.payload, currentState);
      }
    });
    this.devToolsConnector.onExternalAction((action, payload) => {
      if (action === 'JUMP_TO_STATE') {
        if (!this.isWarnedAboutUnstableJumpToStateFunctionality) {
          this.logger.warn('The state travel feature is unstable and may cause unexpected behavior');

          this.isWarnedAboutUnstableJumpToStateFunctionality = true;
        }

        if (payload) {
          this.restoreState(payload);
        } else {
          this.logger.error('Invalid action payload');
        }
      } else if (action === 'COMMIT') {
        this.clearHistory();
      } else if (action === 'RESET') {
        this.resetState();
      }
    });
  }

  private discoverState(controller: StateManagementTypes.Controller, controllerId: string): void {
    if (!controller) {
      return;
    }

    this.logger.debug(`Discovering state in controller: ${controllerId}`);

    const properties = Object.keys(controller);

    properties.forEach((propertyName) => {
      const value = controller[propertyName];

      if (!value) {
        return;
      }

      if (this.isStateContainer(value)) {
        this.stateTracker.trackState(controllerId, value, propertyName);
      }
    });
  }

  private isStateContainer(value: unknown): value is StateManagementTypes.StateContainer {
    return typeof value === 'object';
  }
}
