/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '../../di';
import { Logger } from './logger';
import { StateManagerFactory } from './state_manager';
import type * as StateManagementTypes from './types';
import { isObject } from './utils';

export type DecoratorFunction<T = unknown> = (instance: T) => T;

export interface StateManagerInitializerOptions {
  logLevel?: StateManagementTypes.LogLevel;
  componentName: string;
  diContext: DIContext;
  stateSourceSign?: RegExp;
}

const DEFAULT_STATE_SOURCE_SIGN = /Controller/;

function isStateSource(
  instance: unknown,
  stateSourceSign: RegExp,
): instance is StateManagementTypes.StateSource {
  return isObject(instance)
        && 'constructor' in instance
        && 'name' in instance.constructor
        && stateSourceSign.test(instance.constructor.name);
}

export const setupStateManager = (
  options: StateManagerInitializerOptions,
): StateManagementTypes.StateManager | undefined => {
  const {
    diContext,
    componentName,
    logLevel = 'warn',
    stateSourceSign = DEFAULT_STATE_SOURCE_SIGN,
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
    stateSourceSign,
    logger,
  });

  const trackStateSource: DecoratorFunction = (instance) => {
    if (isStateSource(instance, stateSourceSign)) {
      stateManager.trackStateOf(instance);
    } else {
      logger.debug(`The '${instance?.constructor?.name}' state source isn't tracked by the state manager because it doesn't match the "${stateSourceSign}" sign pattern.`);
    }

    return instance;
  };

  diContext.registerDecorator(trackStateSource);

  return stateManager;
};
