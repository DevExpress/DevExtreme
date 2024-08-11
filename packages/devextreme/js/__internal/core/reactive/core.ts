/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { isFunction } from '@js/core/utils/type';

import type { Subscription } from './subscription';
import type {
  Callback, Gettable,
  MaybeSubscribable,
  Subscribable, Updatable,
} from './types';
import { isSubscribable } from './types';

export class Observable<T> implements Subscribable<T>, Updatable<T>, Gettable<T> {
  private readonly callbacks: Set<Callback<T>> = new Set();

  constructor(private value: T) {}

  update(value: T | ((oldValue: T) => T)): void {
    const newValue = isFunction(value) ? value(this.value) : value;
    if (this.value === newValue) {
      return;
    }
    this.value = newValue;

    this.callbacks.forEach((c) => {
      c(newValue);
    });
  }

  subscribe(callback: Callback<T>): Subscription {
    this.callbacks.add(callback);
    callback(this.value);

    return {
      unsubscribe: () => this.callbacks.delete(callback),
    };
  }

  unreactive_get(): T {
    return this.value;
  }
}

export function toSubscribable<T>(v: MaybeSubscribable<T>): Subscribable<T> {
  if (isSubscribable(v)) {
    return v;
  }

  return new Observable(v);
}

export function interruptableComputed<TArgs extends readonly any[], TValue>(
  compute: (...args: TArgs) => TValue,
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): Observable<TValue> {
  const depValues: [...TArgs] = deps.map(() => undefined) as any;
  const depInitialized = deps.map(() => false);
  let isInitialized = false;

  const value = new Observable<TValue>(undefined as any);

  deps.forEach((dep, i) => {
    dep.subscribe((v) => {
      depValues[i] = v;

      if (!isInitialized) {
        depInitialized[i] = true;
        isInitialized = depInitialized.every((e) => e);
      }

      if (isInitialized) {
        value.update(compute(...depValues));
      }
    });
  });

  return value;
}
