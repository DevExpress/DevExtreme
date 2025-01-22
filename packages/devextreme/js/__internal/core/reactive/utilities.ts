/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spellcheck/spell-checker */
import { InterruptableComputed, Observable } from './core';
import { type Subscription, SubscriptionBag } from './subscription';
import type {
  Gettable, MapMaybeSubscribable, MaybeSubscribable, Subscribable, SubsGets, SubsGetsUpd, Updatable,
} from './types';
import { isSubscribable } from './types';

/**
 * Creates new reactive state atom.
 * @example
 * ```
 * const myState = state(0);
 * myState.update(1);
 * ```
 * @param value initial value of state
 */
export function state<T>(value: T): Subscribable<T> & Updatable<T> & Gettable<T> {
  return new Observable<T>(value);
}

/**
 * Creates computed atom based on other atoms.
 * @example
 * ```
 * const myState = state(0);
 * const myComputed = computed(
 *  (value) => value + 1,
 *  [myState]
 * );
 * ```
 * @param compute computation func
 * @param deps dependency atoms
 */
export function computed<T1, TValue>(
  compute: (t1: T1) => TValue,
  deps: [Subscribable<T1>]
): SubsGets<TValue>;
export function computed<T1, T2, TValue>(
  compute: (t1: T1, t2: T2) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>]
): SubsGets<TValue>;
export function computed<T1, T2, T3, TValue>(
  compute: (t1: T1, t2: T2, t3: T3,) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>]
): SubsGets<TValue>;
export function computed<T1, T2, T3, T4, TValue>(
  compute: (t1: T1, t2: T2, t3: T3, t4: T4) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>]
): SubsGets<TValue>;
export function computed<T1, T2, T3, T4, T5, TValue>(
  compute: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>, Subscribable<T5>]
): SubsGets<TValue>;
export function computed<T1, T2, T3, T4, T5, T6, TValue>(
  compute: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => TValue,
  // eslint-disable-next-line max-len
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>, Subscribable<T5>, Subscribable<T6>]
): SubsGets<TValue>;
export function computed<TArgs extends readonly any[], TValue>(
  compute: (...args: TArgs) => TValue,
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): SubsGets<TValue>;
export function computed<TArgs extends readonly any[], TValue>(
  compute: (...args: TArgs) => TValue,
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): SubsGets<TValue> {
  return new InterruptableComputed(compute, deps);
}

/**
 * Computed, with ability to override value using `.update(...)` method.
 * @see {@link computed}
 */
export function interruptableComputed<T1, TValue>(
  compute: (t1: T1) => TValue,
  deps: [Subscribable<T1>]
): SubsGetsUpd<TValue>;
export function interruptableComputed<T1, T2, TValue>(
  compute: (t1: T1, t2: T2) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>]
): SubsGetsUpd<TValue>;
export function interruptableComputed<T1, T2, T3, TValue>(
  compute: (t1: T1, t2: T2, t3: T3,) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>]
): SubsGetsUpd<TValue>;
export function interruptableComputed<T1, T2, T3, T4, TValue>(
  compute: (t1: T1, t2: T2, t3: T3, t4: T4) => TValue,
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>]
): SubsGetsUpd<TValue>;
export function interruptableComputed<TArgs extends readonly any[], TValue>(
  compute: (...args: TArgs) => TValue,
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): SubsGetsUpd<TValue> {
  return new InterruptableComputed(compute, deps);
}

/**
 * Allows to subscribe function with some side effects to changes of dependency atoms.
 * @param callback function which is executed each time any dependency is updated
 * @param deps dependencies
 */
export function effect<T1>(
  callback: (t1: T1) => ((() => void) | void),
  deps: [Subscribable<T1>]
): Subscription;
export function effect<T1, T2>(
  callback: (t1: T1, t2: T2) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>]
): Subscription;
export function effect<T1, T2, T3>(
  callback: (t1: T1, t2: T2, t3: T3,) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>]
): Subscription;
export function effect<T1, T2, T3, T4>(
  callback: (t1: T1, t2: T2, t3: T3, t4: T4) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>]
): Subscription;
export function effect<T1, T2, T3, T4, T5>(
  callback: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>, Subscribable<T5>]
): Subscription;
export function effect<T1, T2, T3, T4, T5, T6>(
  callback: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => ((() => void) | void),
  deps: [
    Subscribable<T1>,
    Subscribable<T2>,
    Subscribable<T3>,
    Subscribable<T4>,
    Subscribable<T5>,
    Subscribable<T6>,
  ]
): Subscription;
export function effect<TArgs extends readonly any[]>(
  callback: (...args: TArgs) => ((() => void) | void),
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
        callback(...depValues);
      }
    }));
  });

  return subscription;
}

export function toSubscribable<T>(v: MaybeSubscribable<T>): Subscribable<T> {
  if (isSubscribable(v)) {
    return v;
  }

  return new Observable(v);
}

/**
 * Condition atom, basing whether `cond` is true or false,
 * returns value of `ifTrue` or `ifFalse` param.
 * @param cond
 * @param ifTrue
 * @param ifFalse
 */
export function iif<T>(
  cond: MaybeSubscribable<boolean>,
  ifTrue: MaybeSubscribable<T>,
  ifFalse: MaybeSubscribable<T>,
): Subscribable<T> {
  const obs = state<T>(undefined as any);
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let subscription: Subscription | undefined;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  toSubscribable(cond).subscribe((cond) => {
    subscription?.unsubscribe();
    const newSource = cond ? ifTrue : ifFalse;
    subscription = toSubscribable(newSource).subscribe(obs.update.bind(obs));
  });

  return obs;
}

/**
 * Combines object of Subscribables to Subscribable of object.
 * @example
 * ```
 * const myValueA = state(0);
 * const myValueB = state(1);
 * const obj = combine({
 *  myValueA, myValueB
 * });
 *
 * obj.unreactive_get(); // {myValueA: 0, myValueB: 1}
 * @returns
 */
export function combined<T>(
  obj: MapMaybeSubscribable<T>,
): SubsGets<T> {
  const entries = Object.entries(obj) as any as [string, Subscribable<unknown>][];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return computed(
    (...args) => Object.fromEntries(
      args.map((v, i) => [entries[i][0], v]),
    ),
    entries.map(([, v]) => toSubscribable(v)),
  ) as any;
}
