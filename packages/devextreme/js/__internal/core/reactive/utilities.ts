/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spellcheck/spell-checker */
import { InterruptableComputed, Observable } from './core';
import { type Subscription, SubscriptionBag } from './subscription';
import type {
  Gettable, MaybeSubscribable, Subscribable, SubsGets, SubsGetsUpd, Updatable,
} from './types';
import { isSubscribable } from './types';

export function state<T>(value: T): Subscribable<T> & Updatable<T> & Gettable<T> {
  return new Observable<T>(value);
}

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
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>, Subscribable<T5>, Subscribable<T6>]
): SubsGets<TValue>;
export function computed<TArgs extends readonly any[], TValue>(
  compute: (...args: TArgs) => TValue,
  deps: { [I in keyof TArgs]: Subscribable<TArgs[I]> },
): SubsGets<TValue> {
  return new InterruptableComputed(compute, deps);
}

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

export function effect<T1>(
  compute: (t1: T1) => ((() => void) | void),
  deps: [Subscribable<T1>]
): Subscription;
export function effect<T1, T2>(
  compute: (t1: T1, t2: T2) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>]
): Subscription;
export function effect<T1, T2, T3>(
  compute: (t1: T1, t2: T2, t3: T3,) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>]
): Subscription;
export function effect<T1, T2, T3, T4>(
  compute: (t1: T1, t2: T2, t3: T3, t4: T4) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>]
): Subscription;
export function effect<T1, T2, T3, T4, T5>(
  compute: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => ((() => void) | void),
  deps: [Subscribable<T1>, Subscribable<T2>, Subscribable<T3>, Subscribable<T4>, Subscribable<T5>]
): Subscription;
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

export function toSubscribable<T>(v: MaybeSubscribable<T>): Subscribable<T> {
  if (isSubscribable(v)) {
    return v;
  }

  return new Observable(v);
}

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

// export function combine<T>(
//   obj: MapMaybeSubscribable<T>,
// ): Subscribable<T> & Gettable<T> {
//   throw new Error('not implemented');
// }
