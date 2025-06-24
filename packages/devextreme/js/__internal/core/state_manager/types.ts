/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { Signal } from '@preact/signals-core';

export type StateManagerCommands = {
  trackStateOf: (sourceData: StateSource, id?: string) => void;
};

export type StateManagerQueries = {
  getComponentState: () => ComponentState;
};

export interface StateManager extends StateManagerCommands, StateManagerQueries { }

export type StateSource = Record<string, unknown>;

export interface StateManagerConfig {
  devToolsConnector: DevToolsConnector;
  logger: Logger;
  valueContainerManagers: ValueContainerManagerConstructor[];
  stateSourceSign: string;
}

export interface ObservableValueContainer extends ValueContainer, Signal<unknown> {
  stack?: string;
}

export type MaybeObservableValueContainer<T = unknown> = ObservableValueContainer | T;

export interface ValueContainerManagerConstructor {
  canHandle: (valueContainer: MaybeValueContainer) => valueContainer is ValueContainer;
  create: (
    logger: Logger,
    stateSourceSign: string,
    valueContainer: MaybeValueContainer
  ) => ValueContainerManager;
}

export type ValueContainerChangeCallback = (change: ValueContainerChange) => void;

export interface ValueContainerManager {
  trackChanges: (
    onChange: ValueContainerChangeCallback
  ) => void;
  getValue: () => unknown;
}

export interface StateManagerFactoryOptions extends Partial<StateManagerConfig> {
  componentName: string;
  valueContainerManagers?: ValueContainerManagerConstructor[];
  logLevel?: LogLevel;
  stateSourceSign: string;
}

export type ValueContainerPayload = {
  previousValue: unknown;
  newValue: unknown;
  timestamp: number;
  source: string;
};

export type ValueContainerChange = {
  payload: ValueContainerPayload;
};

export type StateChangeActionType = 'UPDATE';

export type StateChangePayload = {
  path: string;
  previousValue: unknown;
  newValue: unknown;
  timestamp: number;
  source: string;
};

export type ComponentState = Record<string, Record<string, unknown>>;

export interface EventEmitter<T extends (...args: unknown[]) => void> {
  addListener: (callback: T) => void;
  emit: (...args: Parameters<T>) => void;
}

export type ValueContainer = { [key: string]: unknown };
export type MaybeValueContainer<T = unknown> = ValueContainer | T;

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
(action: DevToolsActions, payload: ComponentState | null) => void;

export interface DevToolsConnector {
  connect: (options?: Record<string, unknown>) => void;
  disconnect: () => void;
  sendAction: (
    action: StateChangeActionType, payload: StateChangePayload, state?: ComponentState
  ) => void;
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
    shouldCatchErrors?: boolean;
    serialize?: boolean | {
      options?: boolean | {
        undefined?: boolean;
        date?: boolean;
        circular?: string;
      };
      // eslint-disable-next-line spellcheck/spell-checker
      replacer?: (key: string, value: unknown) => unknown;
    };
  // eslint-disable-next-line spellcheck/spell-checker
  }) => ReduxDevToolsInstance;
};
