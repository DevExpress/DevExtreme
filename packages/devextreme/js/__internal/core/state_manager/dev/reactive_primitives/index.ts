import * as Reactive from '../../prod/reactive_primitives/index';
import type {
  BatchFunction,
  ComputedFunction,
  EffectCleanup,
  EffectFn,
  ReadonlySignal,
  Signal,
  // eslint-disable-next-line spellcheck/spell-checker
  UntrackedFunction,
} from '../../prod/reactive_primitives/types';

export type {
  ReadonlySignal,
  Signal,
} from '../../prod/reactive_primitives/types';

export function signal<T>(initialValue: T): Signal<T> {
  const signalInstance = Reactive.signal(initialValue);

  const trace = new Error().stack;
  if (trace) {
    Object.defineProperty(signalInstance, 'stack', {
      value: trace,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  return signalInstance;
}

export function computed<T>(fn: ComputedFunction<T>): ReadonlySignal<T> {
  const computedInstance = Reactive.computed(fn);

  const trace = new Error().stack;

  if (trace) {
    Object.defineProperty(computedInstance, 'stack', {
      value: trace,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  return computedInstance;
}

export function effect(fn: EffectFn): EffectCleanup {
  return Reactive.effect(fn);
}

export function batch(fn: BatchFunction): void {
  Reactive.batch(fn);
}

// eslint-disable-next-line spellcheck/spell-checker
export function untracked<T>(fn: UntrackedFunction<T>): T {
  // eslint-disable-next-line spellcheck/spell-checker
  return Reactive.untracked(fn);
}
