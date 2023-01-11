import { UnknownRecord } from './types';

export function getKeys<T extends UnknownRecord>(object: T) {
  return Reflect.ownKeys(object) as (keyof T)[];
}

export function getChangedKeys<T extends UnknownRecord>(
  prev: T,
  next: T,
): (keyof T)[] {
  return getKeys(next).filter((key) => next[key] !== prev[key]);
}
