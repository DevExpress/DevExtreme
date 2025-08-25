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
