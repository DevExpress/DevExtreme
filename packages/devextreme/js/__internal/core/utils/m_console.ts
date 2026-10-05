/* global console */
/* eslint no-console: off */

import { isFunction } from '@js/core/utils/type';

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error';

interface Debug {
  assert: (condition: unknown, message?: string) => void;
  assertParam: (parameter: unknown, message?: string) => void;
}

const noop = function noop(): void {};
const getConsoleMethod = function getConsoleMethod(
  method: ConsoleMethod,
): (...args: unknown[]) => void {
  if (typeof console === 'undefined' || !isFunction(console[method])) {
    return noop;
  }
  return console[method].bind(console);
};

export const logger = {
  log: getConsoleMethod('log'),
  info: getConsoleMethod('info'),
  warn: getConsoleMethod('warn'),
  error: getConsoleMethod('error'),
};

export const debug = (function createDebug(): Debug {
  function assert(condition: unknown, message?: string): void {
    if (!condition) {
      throw new Error(message);
    }
  }
  function assertParam(parameter: unknown, message?: string): void {
    assert(parameter !== null && parameter !== undefined, message);
  }
  return {
    assert,
    assertParam,
  };
}());

export default { logger, debug };
