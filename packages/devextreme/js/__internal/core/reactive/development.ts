/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spellcheck/spell-checker */
import { InterruptableComputed, Observable } from './core';
import * as baseImplementation from './utilities';

type WithStack<T> = T & { stack?: string };

export type TrackedState<T> = WithStack<ReturnType<typeof baseImplementation.state<T>>>;
export type TrackedComputed<T> = WithStack<ReturnType<typeof baseImplementation.computed<any, T>>>;
export type TrackedInterruptableComputed<T> =
  WithStack<ReturnType<typeof baseImplementation.interruptableComputed<any, T>>>;
export type TrackedToSubscribable<T> =
  WithStack<ReturnType<typeof baseImplementation.toSubscribable<T>>>;
export type TrackedIif<T> = WithStack<ReturnType<typeof baseImplementation.iif<T>>>;
export type TrackedCombined<T> = WithStack<ReturnType<typeof baseImplementation.combined<T>>>;

export function state<T>(value: T): TrackedState<T> {
  const observable = baseImplementation.state(value) as TrackedState<T>;
  observable.stack = new Error().stack;
  return observable;
}

export const computed: typeof baseImplementation.computed = function computed<T>(...args: any[]): TrackedComputed<T> {
  // @ts-ignore
  const result = baseImplementation.computed(...args) as TrackedComputed<T>;
  result.stack = new Error().stack;
  return result;
} as any;

export const interruptableComputed: typeof baseImplementation.interruptableComputed = function interruptableComputed<T>(...args: any[]): TrackedInterruptableComputed<T> {
  // @ts-ignore
  const result = baseImplementation.interruptableComputed(...args) as TrackedInterruptableComputed<T>;
  result.stack = new Error().stack;
  return result;
} as any;

export function toSubscribable<T>(v: Parameters<typeof baseImplementation.toSubscribable<T>>[0]): TrackedToSubscribable<T> {
  const result = baseImplementation.toSubscribable(v) as TrackedToSubscribable<T>;
  if (result instanceof Observable) {
    (result as TrackedToSubscribable<T>).stack = (result as TrackedToSubscribable<T>).stack ?? new Error().stack;
  }
  return result;
}

export function iif<T>(
  ...args: Parameters<typeof baseImplementation.iif<T>>
): TrackedIif<T> {
  const result = baseImplementation.iif(...args) as TrackedIif<T>;
  if (result instanceof Observable) {
    (result as TrackedIif<T>).stack = (result as TrackedIif<T>).stack ?? new Error().stack;
  }
  return result;
}

export function combined<T>(
  obj: Parameters<typeof baseImplementation.combined<T>>[0],
): TrackedCombined<T> {
  const result = baseImplementation.combined(obj) as TrackedCombined<T>;
  if (result instanceof InterruptableComputed) {
    (result as TrackedCombined<T>).stack = (result as TrackedCombined<T>).stack ?? new Error().stack;
  }
  return result;
}

export const { effect } = baseImplementation;
