import { ObjectType } from './types';

export function getKeys<T extends ObjectType>(object: T) {
  return Reflect.ownKeys(object) as (keyof T)[];
}
