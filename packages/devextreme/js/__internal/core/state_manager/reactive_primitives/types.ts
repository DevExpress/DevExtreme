import type * as SignalsCore from '@preact/signals-core';

export type Signal<T> = SignalsCore.Signal<T>;
export type ReadonlySignal<T> = SignalsCore.ReadonlySignal<T>;

export type EffectCleanup = () => void;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type EffectFn = () => void | EffectCleanup;

export type ComputedFunction<T> = () => T;

export type BatchFunction = () => void;

// eslint-disable-next-line spellcheck/spell-checker
export type UntrackedFunction<T> = () => T;
