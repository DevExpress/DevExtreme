/* eslint-disable no-console */
import type * as StateManagementTypes from './types';

const LOG_TYPE_TO_LEVEL: Record<StateManagementTypes.LogLevel, number> = {
  debug: 0, info: 1, warn: 2, error: 3,
};

export interface ConsoleLoggerOptions {
  logLevel?: StateManagementTypes.LogLevel;
  prefix: string;
}

export class Logger implements StateManagementTypes.Logger {
  private logLevel: StateManagementTypes.LogLevel;

  private prefix: string;

  constructor(options?: ConsoleLoggerOptions) {
    this.logLevel = options?.logLevel ?? 'info';
    this.prefix = options?.prefix ?? '';
  }

  setLevel(level: StateManagementTypes.LogLevel): void {
    this.logLevel = level;
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), ...args);
    }
  }

  private formatMessage(message: string): string {
    return this.prefix ? `${this.prefix} ${message}` : message;
  }

  private shouldLog(level: StateManagementTypes.LogLevel): boolean {
    return LOG_TYPE_TO_LEVEL[level] >= LOG_TYPE_TO_LEVEL[this.logLevel];
  }
}
