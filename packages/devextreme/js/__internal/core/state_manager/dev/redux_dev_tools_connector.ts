/* eslint-disable spellcheck/spell-checker */
import { EventEmitter } from './event_emitter';
import type * as StateManagementTypes from './types';

export class ReduxDevToolsConnector implements StateManagementTypes.DevToolsConnector {
  private devTools: StateManagementTypes.ReduxDevToolsInstance | null = null;

  private isConnected = false;

  private readonly logger: StateManagementTypes.Logger;

  private readonly componentName: string;

  private readonly externalActionEmitter:
  EventEmitter<StateManagementTypes.DevToolsExternalActionCallback>;

  constructor(componentName: string, logger: StateManagementTypes.Logger) {
    this.componentName = componentName;
    this.logger = logger;
    this.externalActionEmitter = new EventEmitter(
      'externalAction',
      logger,
    );
  }

  connect(): void {
    try {
      if (this.hasReduxDevTools(window)) {
        this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
          name: `${this.componentName} ${new Date().valueOf()}`,
          trace: true,
          traceLimit: 25,
          features: {
            jump: true,
            skip: false,
            dispatch: true,
          },
          shouldCatchErrors: true,
          serialize: {
            options: {
              circular: '[CIRCULAR]',
              date: true,
            },
            replacer: (key, value) => {
              // replaced because this property contains a reference to the component instance
              // which causes "heap out of memory"
              if (key === 'changes' && (value !== undefined && value !== null) && typeof value === 'object' && 'component' in value && 'element' in value) {
                return '[REPLACED]';
              }

              return value;
            },
          },
        });

        this.devTools.subscribe(
          (message) => {
            if (message.type === 'DISPATCH') {
              if (message.payload.type === 'JUMP_TO_STATE' || message.payload.type === 'JUMP_TO_ACTION') {
                if (message.state) {
                  this.handleJumpToAction(message.state);
                }
              } else if (message.payload.type === 'COMMIT') {
                this.externalActionEmitter.emit('COMMIT', null);
              } else if (message.payload.type === 'RESET') {
                this.externalActionEmitter.emit('RESET', null);
              }
            }
          },
        );

        this.isConnected = true;
        this.logger.info('Connected to Redux DevTools');
      } else {
        this.logger.warn('Redux DevTools extension not found');
      }
    } catch (error) {
      this.logger.error('Failed to connect to Redux DevTools', error);
    }
  }

  disconnect(): void {
    if (this.isConnected && this.devTools !== null) {
      try {
        this.devTools.unsubscribe();
        this.isConnected = false;
        this.logger.info('Disconnected from Redux DevTools');
      } catch (error) {
        this.logger.error('Failed to disconnect from Redux DevTools', error);
      }
    }
  }

  sendAction(...args: Parameters<StateManagementTypes.DevToolsConnector['sendAction']>): ReturnType<StateManagementTypes.DevToolsConnector['sendAction']> {
    const [action, payload, state] = args;

    if (!action) {
      this.logger.error('Action name is required');
      return;
    }

    if (!this.isConnected || this.devTools === null) {
      this.logger.warn('Cannot send action: Not connected to Redux DevTools');
      return;
    }

    try {
      const preparedAction = `${action}: ${payload.path}`;

      const currentState = state ?? {};

      const actionObject = {
        type: preparedAction,
        payload: payload || {},
      };

      this.devTools.send(actionObject, currentState);
    } catch (error) {
      this.logger.error(`Failed to send action to DevTools: ${action}`, error);
      this.logger.debug(`Action details - Type: ${action}, Payload:`, payload);
    }
  }

  onExternalAction(callback: StateManagementTypes.DevToolsExternalActionCallback): void {
    this.externalActionEmitter.addListener(callback);
  }

  private handleJumpToAction(state: string): void {
    try {
      const parsedState = JSON.parse(state);
      this.externalActionEmitter.emit('JUMP_TO_STATE', parsedState);
    } catch (error) {
      this.logger.error('Failed to handle jump to action', error);
    }
  }

  private hasReduxDevTools(globalEnv: Window): globalEnv is
  Window & { __REDUX_DEVTOOLS_EXTENSION__: StateManagementTypes.ReduxDevToolsExtension } {
    return typeof globalEnv !== 'undefined'
         && '__REDUX_DEVTOOLS_EXTENSION__' in globalEnv
         && globalEnv.__REDUX_DEVTOOLS_EXTENSION__ !== undefined;
  }
}
