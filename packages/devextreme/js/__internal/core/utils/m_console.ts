/* global console */
/* eslint no-console: off */

import { isFunction } from '@js/core/utils/type';

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error';

interface Debug {
  assert: (condition: unknown, message?: string) => void;
  assertParam: (parameter: unknown, message?: string) => void;
}

const noop = function (): void {};
const getConsoleMethod = function (method: ConsoleMethod): (...args: unknown[]) => void {
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

export const debug = (function (): Debug {
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
