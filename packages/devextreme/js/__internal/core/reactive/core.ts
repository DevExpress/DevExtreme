/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { isFunction } from '@js/core/utils/type';

import { type Subscription, SubscriptionBag } from './subscription';
import type {
  Callback, Gettable, Subscribable, Updatable,
} from './types';

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

  dispose(): void {
    this.callbacks.clear();
  }
}

export class InterruptableComputed<
  TArgs extends readonly any[], TValue,
> extends Observable<TValue> {
  private readonly depValues: [...TArgs];

  private readonly depInitialized: boolean[];

  private isInitialized = false;

  private readonly subscriptions = new SubscriptionBag();

  constructor(
    compute: (...args: TArgs) => TValue,
    deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
  ) {
    super(undefined as any);

    this.depValues = deps.map(() => undefined) as any;
    this.depInitialized = deps.map(() => false);

    deps.forEach((dep, i) => {
      this.subscriptions.add(dep.subscribe((v) => {
        this.depValues[i] = v;

        if (!this.isInitialized) {
          this.depInitialized[i] = true;
          this.isInitialized = this.depInitialized.every((e) => e);
        }

        if (this.isInitialized) {
          this.update(compute(...this.depValues));
        }
      }));
    });
  }

  dispose(): void {
    super.dispose();
    this.subscriptions.unsubscribe();
  }
}
