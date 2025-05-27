/* eslint-disable max-classes-per-file */
import type * as StateManagementTypes from '../types';
import { splitStatePath } from '../utils';

export class MockControllerRegistry implements StateManagementTypes.ControllerRegistry {
  private controllers: Record<string, StateManagementTypes.Controller> = {};

  private callback: ((
    controller: StateManagementTypes.Controller,
    id: string
  ) => void) | null = null;

  registerController(controller: StateManagementTypes.Controller, id: string): string {
    const controllerId = id;
    this.controllers[controllerId] = controller;
    if (this.callback) {
      this.callback(controller, controllerId);
    }
    return controllerId;
  }

  getController(id: string): StateManagementTypes.Controller | undefined {
    return this.controllers[id];
  }

  getAllControllers(): Record<string, StateManagementTypes.Controller> {
    return { ...this.controllers };
  }

  onControllerRegistered(
    callback: (controller: StateManagementTypes.Controller, id: string) => void,
  ): void {
    this.callback = callback;
  }
}

export class MockStateTracker implements StateManagementTypes.StateTracker {
  private stateChangeCallback: ((
    change: StateManagementTypes.StateChange
  ) => void) | undefined;

  private readonly stateContainerManagers:
  StateManagementTypes.StateContainerManager[] = [];

  private state: StateManagementTypes.State = {};

  constructor(
    stateContainerManagers: StateManagementTypes.StateContainerManager[],
  ) {
    this.stateContainerManagers = stateContainerManagers;
  }

  trackState(
    controllerId: string,
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
  ): void {
    if (!this.state[controllerId]) {
      this.state[controllerId] = {};
    }
    this.state[controllerId][stateName] = stateContainer;

    const currentStateContainerManager = this.findStateContainerManagerFor(stateContainer);
    if (currentStateContainerManager) {
      currentStateContainerManager.trackChanges(
        stateContainer,
        stateName,
        (change) => {
          if (this.stateChangeCallback) {
            const updatedChange = {
              ...change,
              payload: {
                ...change.payload,
                path: `${controllerId}.${change.payload.path}`,
              },
            };
            this.stateChangeCallback(updatedChange);
          }
        },
      );
    }
  }

  getState(): StateManagementTypes.State {
    return { ...this.state };
  }

  onStateChanged(
    callback: (change: StateManagementTypes.StateChange) => void,
  ): void {
    this.stateChangeCallback = callback;
  }

  findStateContainerManagerFor(
    stateContainer: unknown,
  ): StateManagementTypes.StateContainerManager | undefined {
    const result = this.stateContainerManagers
      .find(
        (currentStateContainerManager) => currentStateContainerManager.canHandle(stateContainer),
      );

    return result;
  }

  triggerStateChange(change: StateManagementTypes.StateChange): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback(change);
    }
  }
}

export class MockStateHistory implements StateManagementTypes.StateHistory {
  private history: StateManagementTypes.StateChange[] = [];

  recordChange(change: StateManagementTypes.StateChange): void {
    this.history.push(change);
  }

  getHistory(): StateManagementTypes.StateChange[] {
    return [...this.history];
  }

  getStateAt(index: number): StateManagementTypes.State {
    const state: StateManagementTypes.State = {};

    for (let i = 0; i <= index && i < this.history.length; i += 1) {
      const change = this.history[i];
      const parts = splitStatePath(change.payload.path);

      if (parts.length >= 2) {
        const controllerId = parts[0];
        const stateName = parts[1];

        if (!state[controllerId]) {
          state[controllerId] = {};
        }

        state[controllerId][stateName] = change.payload.newValue;
      }
    }

    return state;
  }

  clear(): void {
    this.history = [];
  }
}

export class MockDevToolsConnector implements StateManagementTypes.DevToolsConnector {
  private callback:
    StateManagementTypes.DevToolsExternalActionCallback | null = null;

  private isConnected = false;

  connect(): void {
    this.isConnected = true;
  }

  disconnect(): void {
    this.isConnected = false;
  }

  sendAction(): void {

  }

  onExternalAction(
    callback: StateManagementTypes.DevToolsExternalActionCallback,
  ): void {
    this.callback = callback;
  }

  triggerExternalAction(
    action: StateManagementTypes.DevToolsActions,
    payload: StateManagementTypes.State | null,
  ): void {
    if (this.callback) {
      this.callback(action, payload);
    }
  }

  isDevToolsConnected(): boolean {
    return this.isConnected;
  }
}

export class MockLogger implements StateManagementTypes.Logger {
  logs: { level: string; message: string; args: unknown[] }[] = [];

  debug(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'debug', message, args });
  }

  info(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'info', message, args });
  }

  warn(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'warn', message, args });
  }

  error(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'error', message, args });
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export class MockObjectStatePlugin implements StateManagementTypes.StateContainerManager {
  private readonly changeHandlers: Map<
    StateManagementTypes.StateContainer,
    (change: StateManagementTypes.StateChange) => void
  > = new Map();

  canHandle(
    stateContainer: unknown,
  ): stateContainer is StateManagementTypes.StateContainer {
    return typeof stateContainer === 'object'
      && stateContainer !== null
      && !Array.isArray(stateContainer);
  }

  trackChanges(
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
    onChange: (change: StateManagementTypes.StateChange) => void,
  ): void {
    this.changeHandlers.set(stateContainer, onChange);
  }

  applyState(
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
    newState: unknown,
  ): void {
    const previousValue = { ...stateContainer };
    Object.assign(stateContainer, newState);

    const onChange = this.changeHandlers.get(stateContainer);
    if (onChange) {
      onChange({
        actionType: 'UPDATE',
        payload: {
          path: stateName,
          previousValue,
          newValue: { ...stateContainer },
          timestamp: Date.now(),
          source: 'MockObjectStatePlugin',
        },
      });
    }
  }

  getState(
    stateContainer: StateManagementTypes.StateContainer,
  ): unknown {
    return { ...stateContainer };
  }

  simulatePropertyChange(
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
    key: string,
    newValue: unknown,
  ): void {
    const previousValue = { ...stateContainer };

    stateContainer[key] = newValue;

    const onChange = this.changeHandlers.get(stateContainer);
    if (onChange) {
      onChange({
        actionType: 'UPDATE',
        payload: {
          path: stateName,
          previousValue,
          newValue: { ...stateContainer },
          timestamp: Date.now(),
          source: 'MockObjectStatePlugin',
        },
      });
    }
  }
}

export class MockArrayStatePlugin implements StateManagementTypes.StateContainerManager {
  // eslint-disable-next-line no-spaced-func
  private readonly changeHandlers = new WeakMap<
    object,
    (change: StateManagementTypes.StateChange) => void
  >();

  canHandle(
    stateContainer: unknown,
  ): stateContainer is StateManagementTypes.StateContainer {
    return Array.isArray(stateContainer);
  }

  trackChanges(
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
    onChange: (change: StateManagementTypes.StateChange) => void,
  ): void {
    if (!this.changeHandlers.has(stateContainer)) {
      this.changeHandlers.set(stateContainer, onChange);

      if (Array.isArray(stateContainer)) {
        this.overrideArrayMethods(stateContainer, stateName);
      }
    }
  }

  applyState(
    stateContainer: StateManagementTypes.StateContainer,
    stateName: string,
    newState: unknown,
  ): void {
    if (Array.isArray(stateContainer)) {
      stateContainer.length = 0;

      if (Array.isArray(newState)) {
        Array.prototype.push.apply(stateContainer, newState);
      }
    }
  }

  getState(stateContainer: StateManagementTypes.StateContainer): unknown {
    return Array.isArray(stateContainer) ? [...stateContainer] : stateContainer;
  }

  private overrideArrayMethods(
    stateContainer: StateManagementTypes.StateContainer & unknown[],
    stateName: string,
  ): void {
    const methods = {
      push: stateContainer.push,
      pop: stateContainer.pop,
    };

    const onChange = this.changeHandlers.get(stateContainer);

    stateContainer.push = (...items: unknown[]): number => {
      const previousValue = [...stateContainer];
      const result = methods.push.apply(stateContainer, items);

      if (onChange) {
        onChange({
          actionType: 'UPDATE',
          payload: {
            path: stateName,
            previousValue,
            newValue: [...stateContainer],
            timestamp: Date.now(),
            source: 'MockArrayStatePlugin',
          },
        });
      }

      return result;
    };

    stateContainer.pop = (): unknown => {
      const previousValue = [...stateContainer];
      const result = methods.pop.call(stateContainer);

      if (onChange) {
        onChange({
          actionType: 'UPDATE',
          payload: {
            path: stateName,
            previousValue,
            newValue: [...stateContainer],
            timestamp: Date.now(),
            source: 'MockArrayStatePlugin',
          },
        });
      }

      return result;
    };
  }
}
