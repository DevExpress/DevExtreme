import { UnknownRecord } from './types';

export function getKeys<T extends UnknownRecord>(object: T) {
  return Reflect.ownKeys(object) as (keyof T)[];
}
