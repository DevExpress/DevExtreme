/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { isFunction } from '@js/core/utils/type';

/* eslint-disable spellcheck/spell-checker */
export interface Subscription {
  unsubscribe: () => void;
}

export class SubscriptionBag implements Subscription {
  private readonly subscriptions: Subscription[] = [];

  add(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  unsubscribe(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}

export interface Subscribable<T> {
  subscribe: (callback: Callback<T>) => Subscription;
}

export function isSubscribable<T>(value: unknown): value is Subscribable<T> {
  return typeof value === 'object' && !!value && 'subscribe' in value;
}

export type Callback<T> = (value: T) => void;

export interface Updatable<T> {
  update: (value: T) => void;
}

export class Observable<T> implements Subscribable<T>, Updatable<T> {
  private readonly callbacks: Set<Callback<T>> = new Set();

  constructor(private value: T) {}

  update(value: T): void;
  update(callback: (oldValue: T) => T): void;
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
}
export type MaybeSubscribable<T> = T | Subscribable<T>;

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

export function computed<TArgs extends readonly any[], TValue>(
  compute: (...args: TArgs) => TValue,
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): Subscribable<TValue> {
  return interruptableComputed(compute, deps);
}

export function state<TValue>(value: TValue) {
  return new Observable<TValue>(value);
}

export function effect<TArgs extends readonly any[]>(
  compute: (...args: TArgs) => ((() => void) | void),
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): Subscription {
  const depValues: [...TArgs] = deps.map(() => undefined) as any;
  const depInitialized = deps.map(() => false);
  let isInitialized = false;

  const subscription = new SubscriptionBag();

  deps.forEach((dep, i) => {
    subscription.add(dep.subscribe((v) => {
      depValues[i] = v;

      if (!isInitialized) {
        depInitialized[i] = true;
        isInitialized = depInitialized.every((e) => e);
      }

      if (isInitialized) {
        compute(...depValues);
      }
    }));
  });

  return subscription;
}

export function iif<T>(
  cond: MaybeSubscribable<boolean>,
  ifTrue: MaybeSubscribable<T>,
  ifFalse: MaybeSubscribable<T>,
): Subscribable<T> {
  const obs = state<T>(undefined as any);
  let subscription: Subscription | undefined;

  toSubscribable(cond).subscribe((cond) => {
    subscription?.unsubscribe();
    const newSource = cond ? ifTrue : ifFalse;
    subscription = toSubscribable(newSource).subscribe(obs.update.bind(obs));
  });

  return obs;
}
