/* eslint-disable spellcheck/spell-checker */
import { EventEmitter } from './event_emitter';
import type {
  IDevToolsConnector,
  IDevToolsExternalActionCallback,
  ILogger,
  IReduxDevToolsExtension,
  IReduxDevToolsInstance,
} from './interfaces';

export class ReduxDevToolsConnector implements IDevToolsConnector {
  private devTools: IReduxDevToolsInstance | null = null;

  private isConnected = false;

  private readonly logger: ILogger;

  private readonly componentName: string;

  private readonly externalActionEmitter: EventEmitter<Parameters<IDevToolsConnector['onExternalAction']>[0]>;

  constructor(componentName: string, logger: ILogger) {
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

  sendAction(...args: Parameters<IDevToolsConnector['sendAction']>): ReturnType<IDevToolsConnector['sendAction']> {
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
      let actionType: string = action;

      if (action === 'UPDATE' && payload?.path) {
        actionType = `${action}: ${payload.path}`;
      } else if (action === 'INITIALIZE' && payload?.path) {
        actionType = `${action}: ${payload.path}`;
        this.logger.debug(`Processing initialization event for: ${payload.path}`);
      }

      const currentState = state ?? {};

      const actionObject = {
        type: actionType,
        payload: payload || {},
      };

      this.devTools.send(actionObject, currentState);
      this.logger.debug(`Sent action to DevTools: ${actionType}`);
    } catch (error) {
      this.logger.error(`Failed to send action to DevTools: ${action}`, error);
      this.logger.debug(`Action details - Type: ${action}, Payload:`, payload);
    }
  }

  onExternalAction(callback: IDevToolsExternalActionCallback): void {
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
  Window & { __REDUX_DEVTOOLS_EXTENSION__: IReduxDevToolsExtension } {
    return typeof globalEnv !== 'undefined'
         && '__REDUX_DEVTOOLS_EXTENSION__' in globalEnv
         && globalEnv.__REDUX_DEVTOOLS_EXTENSION__ !== undefined;
  }
}
