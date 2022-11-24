import { getKeys, ObjectType } from '../utils';

export function getChangedKeys<TState extends ObjectType>(
  prev: TState,
  next: TState,
): (keyof TState)[] {
  return getKeys(next).filter((key) => next[key] !== prev[key]);
}
