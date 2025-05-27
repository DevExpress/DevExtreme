/* eslint-disable @typescript-eslint/consistent-type-definitions */

export type StateCommands = {
  restoreState: (state: State) => void;
  resetState: () => void;
  updateState: (path: string, value: unknown) => void;
};

export type StateQueries = {
  getState: () => State;
  getStateAt: (historyIndex: number) => State;
  getHistory: () => StateChange[];
};

export interface StateManager extends StateCommands, StateQueries { }

export type StateChangeListener = {
  onStateChanged: StateChangeCallback;
};

export interface StateTracker {
  trackState: (controllerId: string, stateContainer: StateContainer, stateName: string) => void;
  getState: () => State;
  onStateChanged: (callback: StateChangeCallback) => void;
  findStateContainerManagerFor:
  (stateContainer: MaybeStateContainer) => StateContainerManager | undefined;
}

export interface StateHistory {
  recordChange: (change: StateChange) => void;
  getHistory: () => StateChange[];
  getStateAt: (index: number) => State;
  clear: () => void;
}

export type Controller = Record<string, unknown>;

export interface ControllerRegistry {
  registerController: (controller: Controller, id: string) => string;
  getController: (id: string) => Controller | undefined;
  getAllControllers: () => Record<string, Controller>;
  onControllerRegistered: (
    callback: (controller: Controller, id: string) => void) => void;
}

export interface StateManagerConfig {
  controllerRegistry: ControllerRegistry;
  stateTracker: StateTracker;
  stateHistory: StateHistory;
  devToolsConnector: DevToolsConnector;
  logger: Logger;
}

export interface ObservableStateContainer extends StateContainer {
  // eslint-disable-next-line spellcheck/spell-checker
  unreactive_get: () => unknown;
  subscribe: (callback: (newValue: unknown) => void) => void;
  update: (newValue: unknown) => void;
  stack?: string;
}

export type MaybeObservableStateContainer<T = unknown> = ObservableStateContainer | T;

export type StateChangeCallback = (change: StateChange) => void;

export interface StateContainerManager {
  canHandle: (stateContainer: MaybeStateContainer) => stateContainer is StateContainer;
  trackChanges: (
    stateContainer: StateContainer,
    stateName: string,
    onChange: StateChangeCallback
  ) => void;
  applyState: (
    stateContainer: StateContainer,
    stateName: string,
    newState: unknown
  ) => void;
  getState: (stateContainer: StateContainer) => unknown;
}

export interface StateManagerFactoryOptions extends Partial<StateManagerConfig> {
  componentName: string;
  maxHistorySize?: number;
  stateContainerManagers?: StateContainerManager[];
  logLevel?: LogLevel;
  controllerSign: string;
}

export type StateManagerActionType = 'UPDATE' | 'INITIALIZE' | 'CLEAR_HISTORY';

export type StateChangePayload = {
  path: string;
  previousValue: unknown;
  newValue: unknown;
  timestamp: number;
  source: string;
};

export type StateChange = {
  actionType: StateManagerActionType;
  payload: StateChangePayload;
};

export type State = Record<string, Record<string, unknown>>;

export interface EventEmitter<T extends (...args: unknown[]) => void> {
  addListener: (callback: T) => void;
  emit: (...args: Parameters<T>) => void;
}

export type StateContainer = { [key: string]: unknown };
export type MaybeStateContainer<T = unknown> = StateContainer | T;

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogMethod = (message: string, ...args: unknown[]) => void;

export interface Logger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

export type DevToolsActions = 'DISPATCH' | 'JUMP_TO_STATE' | 'JUMP_TO_ACTION' | 'COMMIT' | 'RESET';

export type DevToolsExternalActionCallback =
(action: DevToolsActions, payload: State | null) => void;

export interface DevToolsConnector {
  connect: (options?: Record<string, unknown>) => void;
  disconnect: () => void;
  sendAction: (action: string, payload: StateChangePayload, state?: State) => void;
  onExternalAction: (callback: DevToolsExternalActionCallback) => void;
}

// eslint-disable-next-line spellcheck/spell-checker
type ReduxDevToolsActions = DevToolsActions;

// eslint-disable-next-line spellcheck/spell-checker
export type ReduxDevToolsInstance = {
  subscribe:
  (callback: (
    // eslint-disable-next-line spellcheck/spell-checker
    message: { type: ReduxDevToolsActions; payload: { type: string }; state?: string }
  ) => void) => void;
  send: (action: { type: string; payload: unknown }, state: unknown) => void;
  unsubscribe: () => void;
};

// eslint-disable-next-line spellcheck/spell-checker
export type ReduxDevToolsExtension = {
  connect: (options?: {
    name?: string;
    trace?: boolean;
    traceLimit?: number;
    features?: {
      jump?: boolean;
      skip?: boolean;
      dispatch?: boolean;
    };
  // eslint-disable-next-line spellcheck/spell-checker
  }) => ReduxDevToolsInstance;
};
