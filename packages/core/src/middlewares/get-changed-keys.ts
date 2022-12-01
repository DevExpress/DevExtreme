import { getKeys, UnknownRecord } from '../utils';

export function getChangedKeys<TState extends UnknownRecord>(
  prev: TState,
  next: TState,
): (keyof TState)[] {
  return getKeys(next).filter((key) => next[key] !== prev[key]);
}
