import { DeferredObj } from './deferred';

export function noop(): void;

export function deferRender<T>(func: () => T, deferred?: DeferredObj<T>): T | Promise<T> | DeferredObj<T>;

export function ensureDefined<T>(value: T, defaultValue: T): NonNullable<T>;

export function equalByValue(object1: unknown, object2: unknown, depth?: number, strict?: boolean): boolean;

export function deferUpdate<T>(func: () => T, deferred?: DeferredObj<T>): T | Promise<T> | DeferredObj<T>;

export function escapeRegExp(string: string): string;
