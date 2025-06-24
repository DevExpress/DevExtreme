export type IStateManagerActionType = 'UPDATE' | 'INITIALIZE' | 'CLEAR_HISTORY';

export interface IStateChangePayload {
  path: string;
  previousValue: unknown;
  newValue: unknown;
  timestamp: number;
  source: string;
}

export interface IStateChange {
  actionType: IStateManagerActionType;
  payload: IStateChangePayload;
}

export type IState = Record<string, Record<string, unknown>>;

export interface IEventEmitter<T extends (...args: unknown[]) => void> {
  addListener: (callback: T) => void;
  emit: (...args: Parameters<T>) => void;
}

export type IController = Record<string, unknown>;

export interface IControllerRegistry {
  registerController: (controller: IController, id: string) => string;
  getController: (id: string) => IController | null;
  getAllControllers: () => Record<string, IController>;
  onControllerRegistered: (
    callback: (controller: IController, id: string) => void) => void;
}

export interface IStateContainer { [key: string]: unknown }
export type IMaybeStateContainer<T = unknown> = IStateContainer | T;

export interface IObservableStateContainer extends IStateContainer {
  // eslint-disable-next-line spellcheck/spell-checker
  unreactive_get: () => unknown;
  subscribe: (callback: (newValue: unknown) => void) => void;
  update: (newValue: unknown) => void;
  stack?: string;
}

export type IMaybeObservableStateContainer<T = unknown> = IObservableStateContainer | T;

export type IStateChangeCallback = (change: IStateChange) => void;

export interface IStateTracker {
  trackState: (controllerId: string, stateContainer: IStateContainer, stateName: string) => void;
  getState: () => IState;
  onStateChanged: (callback: IStateChangeCallback) => void;
  findStateContainerManagerFor:
  (stateContainer: IMaybeStateContainer) => IStateContainerManager | null;
}

export interface IStateHistory {
  recordChange: (change: IStateChange) => void;
  getHistory: () => IStateChange[];
  getStateAt: (index: number) => IState;
  clear: () => void;
}

export interface IStateContainerManager {
  canHandle: (stateContainer: IMaybeStateContainer) => stateContainer is IStateContainer;
  trackChanges: (
    stateContainer: IStateContainer,
    stateName: string,
    onChange: IStateChangeCallback
  ) => void;
  applyState: (
    stateContainer: IStateContainer,
    stateName: string,
    newState: unknown
  ) => void;
  getState: (stateContainer: IStateContainer) => unknown;
}

export type ILogLevel = 'debug' | 'info' | 'warn' | 'error';
export type ILogMethod = (message: string, ...args: unknown[]) => void;

export interface ILogger {
  debug: ILogMethod;
  info: ILogMethod;
  warn: ILogMethod;
  error: ILogMethod;
}

export interface IStateCommands {
  restoreState: (state: IState) => void;
  resetState: () => void;
  updateState: (path: string, value: unknown) => void;
}

export interface IStateQueries {
  getState: () => IState;
  getStateAt: (historyIndex: number) => IState;
  getHistory: () => IStateChange[];
}

export interface IStateManager extends IStateCommands, IStateQueries { }

export interface IStateChangeListener {
  onStateChanged: IStateChangeCallback;
}

export interface IStateManagerConfig {
  controllerRegistry: IControllerRegistry;
  stateTracker: IStateTracker;
  stateHistory: IStateHistory;
  devToolsConnector: IDevToolsConnector;
  logger: ILogger;
}

export interface IStateManagerFactoryOptions extends Partial<IStateManagerConfig> {
  componentName: string;
  maxHistorySize?: number;
  stateContainerManagers?: IStateContainerManager[];
  stateTracker?: IStateTracker;
  stateHistory?: IStateHistory;
  logLevel?: ILogLevel;
  controllerSign: string;
}

export type IDevToolsActions = 'DISPATCH' | 'JUMP_TO_STATE' | 'JUMP_TO_ACTION' | 'COMMIT' | 'RESET';

export type IDevToolsExternalActionCallback =
(action: IDevToolsActions, payload: IState | null) => void;

export interface IDevToolsConnector {
  connect: (options?: Record<string, unknown>) => void;
  disconnect: () => void;
  sendAction: (action: string, payload: IStateChangePayload, state?: IState) => void;
  onExternalAction: (callback: IDevToolsExternalActionCallback) => void;
}

// eslint-disable-next-line spellcheck/spell-checker
type IReduxDevToolsActions = IDevToolsActions;

// eslint-disable-next-line spellcheck/spell-checker
export interface IReduxDevToolsInstance {
  subscribe:
  (callback: (
    // eslint-disable-next-line spellcheck/spell-checker
    message: { type: IReduxDevToolsActions; payload: { type: string }; state?: string }
  ) => void) => void;
  send: (action: { type: string; payload: unknown }, state: unknown) => void;
  unsubscribe: () => void;
}

// eslint-disable-next-line spellcheck/spell-checker
export interface IReduxDevToolsExtension {
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
  }) => IReduxDevToolsInstance;
}
