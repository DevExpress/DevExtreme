import type { Subscription } from './subscription';

export interface Subscribable<T> {
  subscribe: (callback: Callback<T>) => Subscription;
}

export type MaybeSubscribable<T> = T | Subscribable<T>;

export function isSubscribable<T>(value: unknown): value is Subscribable<T> {
  return typeof value === 'object' && !!value && 'subscribe' in value;
}

export type Callback<T> = (value: T) => void;

export interface Updatable<T> {
  update: (value: T) => void;
}

export interface Gettable<T> {
  unreactive_get: () => T;
}
