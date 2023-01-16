import { UnknownRecord } from './types';

export function getKeys<T extends UnknownRecord>(object: T) {
  return Reflect.ownKeys(object) as (keyof T)[];
}

export function getChangedKeys<TState extends UnknownRecord>(
  prev: TState,
  next: TState,
): (keyof TState)[] {
  return getKeys(next).filter((key) => next[key] !== prev[key]);
}
