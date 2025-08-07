/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '../../di';
import { Logger } from './logger';
import { StateManagerFactory } from './state_manager';
import type * as StateManagementTypes from './types';

export type DecoratorFunction<T = unknown> = (instance: T) => T;

export interface StateManagerInitializerOptions {
  logLevel?: StateManagementTypes.LogLevel;
  componentName: string;
  diContext: DIContext;
  controllerSign?: string;
}

const CONTROLLER_SIGN = 'Controller';

function isController(
  instance: unknown,
  controllerSign: string,
): instance is StateManagementTypes.StateSource {
  return instance !== null
        && typeof instance === 'object'
        && 'constructor' in instance
        && 'name' in instance.constructor
        && instance.constructor.name.includes(controllerSign);
}

export const setupStateManager = (
  options: StateManagerInitializerOptions,
): StateManagementTypes.StateManager | undefined => {
  const {
    diContext,
    componentName,
    logLevel = 'warn',
    controllerSign = CONTROLLER_SIGN,
  } = options;
  if (!diContext) {
    throw new Error('DI context is not provided');
  }

  if (!componentName) {
    throw new Error('Component name is not provided');
  }

  const logger = new Logger({ logLevel, prefix: '[StateManager]' });

  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  if (!isDevelopmentMode) {
    return undefined;
  }

  const stateManager = StateManagerFactory.create({
    componentName,
    stateSourceSign: controllerSign,
    logger,
  });

  const trackControllerByStateManager: DecoratorFunction = (instance) => {
    if (isController(instance, controllerSign)) {
      stateManager.trackStateOf(instance);
    } else {
      logger.debug(`The '${instance?.constructor?.name}' controller isn't tracked by the state manager because it doesn't match the pattern of a controller with the "${CONTROLLER_SIGN}" sign in its name.`);
    }

    return instance;
  };

  diContext.registerDecorator(trackControllerByStateManager);

  return stateManager;
};
