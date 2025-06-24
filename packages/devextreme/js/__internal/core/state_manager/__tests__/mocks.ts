/* eslint-disable max-classes-per-file */
import type {
  IController,
  IControllerRegistry,
  IDevToolsActions,
  IDevToolsConnector,
  IDevToolsExternalActionCallback,
  ILogger,
  IState,
  IStateChange,
  IStateContainer,
  IStateContainerManager,
  IStateHistory,
  IStateTracker,
} from '../interfaces';
import { splitStatePath } from '../utils';

export class MockControllerRegistry implements IControllerRegistry {
  private controllers: Record<string, IController> = {};

  private callback: ((controller: IController, id: string) => void) | null = null;

  registerController(controller: IController, id: string): string {
    const controllerId = id;
    this.controllers[controllerId] = controller;
    if (this.callback) {
      this.callback(controller, controllerId);
    }
    return controllerId;
  }

  getController(id: string): IController | null {
    return this.controllers[id] || null;
  }

  getAllControllers(): Record<string, IController> {
    return { ...this.controllers };
  }

  onControllerRegistered(callback: (controller: IController, id: string) => void): void {
    this.callback = callback;
  }
}

export class MockStateTracker implements IStateTracker {
  private stateChangeCallback: ((change: IStateChange) => void) | null = null;

  private readonly stateContainerManagers: IStateContainerManager[] = [];

  private state: IState = {};

  constructor(stateContainerManagers: IStateContainerManager[]) {
    this.stateContainerManagers = stateContainerManagers;
  }

  trackState(controllerId: string, stateContainer: IStateContainer, stateName: string): void {
    if (!this.state[controllerId]) {
      this.state[controllerId] = {};
    }
    this.state[controllerId][stateName] = stateContainer;

    const currentStateContainerManager = this.findStateContainerManagerFor(stateContainer);
    if (currentStateContainerManager) {
      currentStateContainerManager.trackChanges(stateContainer, stateName, (change) => {
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
      });
    }
  }

  getState(): IState {
    return { ...this.state };
  }

  onStateChanged(callback: (change: IStateChange) => void): void {
    this.stateChangeCallback = callback;
  }

  findStateContainerManagerFor(stateContainer: unknown): IStateContainerManager | null {
    return this.stateContainerManagers
      .find((currentStateContainerManager) => currentStateContainerManager
        .canHandle(stateContainer)) ?? null;
  }

  triggerStateChange(change: IStateChange): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback(change);
    }
  }
}

export class MockStateHistory implements IStateHistory {
  private history: IStateChange[] = [];

  recordChange(change: IStateChange): void {
    this.history.push(change);
  }

  getHistory(): IStateChange[] {
    return [...this.history];
  }

  getStateAt(index: number): IState {
    const state: IState = {};

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

export class MockDevToolsConnector implements IDevToolsConnector {
  private callback: IDevToolsExternalActionCallback | null = null;

  private isConnected = false;

  connect(): void {
    this.isConnected = true;
  }

  disconnect(): void {
    this.isConnected = false;
  }

  sendAction(): void {

  }

  onExternalAction(callback: IDevToolsExternalActionCallback): void {
    this.callback = callback;
  }

  triggerExternalAction(action: IDevToolsActions, payload: IState | null): void {
    if (this.callback) {
      this.callback(action, payload);
    }
  }

  isDevToolsConnected(): boolean {
    return this.isConnected;
  }
}

export class MockLogger implements ILogger {
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

export class MockObjectStatePlugin implements IStateContainerManager {
  private readonly changeHandlers: Map<IStateContainer, (change: IStateChange) => void> = new Map();

  canHandle(stateContainer: unknown): stateContainer is IStateContainer {
    return typeof stateContainer === 'object' && stateContainer !== null && !Array.isArray(stateContainer);
  }

  trackChanges(
    stateContainer: IStateContainer,
    stateName: string,
    onChange: (change: IStateChange) => void,
  ): void {
    this.changeHandlers.set(stateContainer, onChange);
  }

  applyState(stateContainer: IStateContainer, stateName: string, newState: unknown): void {
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

  getState(stateContainer: IStateContainer): unknown {
    return { ...stateContainer };
  }

  simulatePropertyChange(
    stateContainer: IStateContainer,
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

export class MockArrayStatePlugin implements IStateContainerManager {
  // eslint-disable-next-line no-spaced-func
  private readonly changeHandlers = new WeakMap<object, (change: IStateChange) => void>();

  canHandle(stateContainer: unknown): stateContainer is IStateContainer {
    return Array.isArray(stateContainer);
  }

  trackChanges(
    stateContainer: IStateContainer,
    stateName: string,
    onChange: (change: IStateChange) => void,
  ): void {
    if (!this.changeHandlers.has(stateContainer)) {
      this.changeHandlers.set(stateContainer, onChange);

      if (Array.isArray(stateContainer)) {
        this.overrideArrayMethods(stateContainer, stateName);
      }
    }
  }

  applyState(stateContainer: IStateContainer, stateName: string, newState: unknown): void {
    if (Array.isArray(stateContainer)) {
      stateContainer.length = 0;

      if (Array.isArray(newState)) {
        Array.prototype.push.apply(stateContainer, newState);
      }
    }
  }

  getState(stateContainer: IStateContainer): unknown {
    return Array.isArray(stateContainer) ? [...stateContainer] : stateContainer;
  }

  private overrideArrayMethods(
    stateContainer: IStateContainer & unknown[],
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
