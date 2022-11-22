import { getKeys, ObjectType } from '../utils';

export function getChangedKeys<TModel extends ObjectType>(
  prev: TModel,
  next: TModel,
): (keyof TModel)[] {
  return getKeys(next).filter((key) => next[key] !== prev[key]);
}
