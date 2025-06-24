/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '../di';
import type { IController, ILogLevel } from './interfaces';
import { StateManager } from './state_manager';
import { makeStateManager } from './state_manager_factory';

export type DecoratorFunction<T = unknown> = (instance: T) => T;

export interface IStateManagerInitializerOptions {
  logLevel?: ILogLevel;
  componentName?: string;
  diContext?: DIContext;
  controllerSign?: string;
}

const CONTROLLER_SIGN = 'Controller';

function isController(instance: unknown, controllerSign: string): instance is IController {
  if (instance) {
    return typeof instance === 'object'
         && 'constructor' in instance
         && 'name' in instance.constructor
         && instance.constructor.name.includes(controllerSign);
  }

  return false;
}

export const setupStateManager = (options: IStateManagerInitializerOptions): void => {
  const {
    diContext,
    componentName,
    logLevel = 'warn',
    controllerSign = CONTROLLER_SIGN,
  } = options;

  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  if (isDevelopmentMode) {
    try {
      if (!diContext) {
        throw new Error('DI context not provided');
      }

      if (!componentName) {
        throw new Error('Component name not provided');
      }
      const stateManager = makeStateManager({
        componentName,
        logLevel,
        controllerSign,
      });

      diContext.registerInstance(
        StateManager,
        stateManager,
      );

      let areAnyControllerInitialized = false;

      const registerControllerInStateManager: DecoratorFunction = (instance) => {
        if (isController(instance, controllerSign)) {
          const injectedStateManager = diContext.get(StateManager);

          injectedStateManager.registerController(instance, instance.constructor.name);

          if (!areAnyControllerInitialized && logLevel === 'debug') {
            areAnyControllerInitialized = true;
          }
        }

        return instance;
      };

      if (!areAnyControllerInitialized && logLevel === 'debug') {
        console.warn(`No controllers have been registered in the state manager. Do controllers have the "${controllerSign}" in their names?`);
      }

      diContext.decorator(registerControllerInStateManager);
    } catch (error) {
      console.error('Unexpected error while setting up state manager:', error);
    }
  }
};
