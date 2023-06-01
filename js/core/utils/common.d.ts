import { DeferredObj } from './deferred';

export interface EqualByValueOptions {
  strict?: boolean;
  maxDepth?: number;
}

export function noop(): void;

export function deferRender<T>(func: () => T, deferred?: DeferredObj<T>): T | Promise<T> | DeferredObj<T>;

export function ensureDefined<T>(value: T, defaultValue: T): NonNullable<T>;

export function equalByValue(value1: unknown, value2: unknown, options?: EqualByValueOptions): boolean;

export function deferUpdate<T>(func: () => T, deferred?: DeferredObj<T>): T | Promise<T> | DeferredObj<T>;

export function escapeRegExp(string: string): string;
