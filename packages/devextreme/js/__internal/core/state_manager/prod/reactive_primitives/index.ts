import * as SignalsCore from '@preact/signals-core';

import type {
  BatchFunction,
  ComputedFunction,
  EffectCleanup,
  EffectFn,
  ReadonlySignal,
  Signal,
  // eslint-disable-next-line spellcheck/spell-checker
  UntrackedFunction,
} from './types';

export type {
  ReadonlySignal,
  Signal,
} from './types';

export function signal<T>(initialValue: T): Signal<T> {
  return SignalsCore.signal(initialValue);
}

export function computed<T>(fn: ComputedFunction<T>): ReadonlySignal<T> {
  return SignalsCore.computed(fn);
}

export function effect(fn: EffectFn): EffectCleanup {
  return SignalsCore.effect(fn);
}

export function batch(fn: BatchFunction): void {
  SignalsCore.batch(fn);
}

// eslint-disable-next-line spellcheck/spell-checker
export function untracked<T>(fn: UntrackedFunction<T>): T {
  // eslint-disable-next-line spellcheck/spell-checker
  return SignalsCore.untracked(fn);
}

const trackSink: { last: unknown } = { last: undefined };

/**
 * Registers `values` as dependencies of the enclosing computed/effect without using them.
 *
 * A standalone `signal.value;` read is load-bearing - it IS the subscription -
 * but minifiers with `compress.pure_getters` delete it. A property assignment survives,
 * because `pure_getters` makes no claim about setters (T1334012).
 *
 * The sink is cleared before returning: holding on to it would keep whatever was tracked last -
 * often a whole item array - strongly referenced until the next `track` call anywhere.
 */
export function track(...values: unknown[]): void {
  for (const value of values) {
    trackSink.last = value;
  }

  trackSink.last = undefined;
}
