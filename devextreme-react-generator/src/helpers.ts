import * as dasherize from 'dasherize';
import { extname as getPathExtension } from 'path';

export function removeExtension(path: string): string {
  return path.slice(0, -getPathExtension(path).length);
}

export function removePrefix(value: string, prefix: string): string {
  return new RegExp(`^${prefix}`, 'i').test(value) ? value.substring(prefix.length) : value;
}

export function toKebabCase(value: string): string {
  return dasherize(value);
}

export function uppercaseFirst(value: string): string {
  return value[0].toUpperCase() + value.substr(1);
}

export function lowercaseFirst(value: string): string {
  return value[0].toLowerCase() + value.substr(1);
}

export function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, undefined, { caseFirst: 'upper' });
}

export function createKeyComparator<T>(keyGetter: (x: T) => string) {
  return (a: T, b: T): number => compareStrings(keyGetter(a), keyGetter(b));
}

export function removeElement<T>(array: T[], element: T): void {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function isEmptyArray(array: any[] | undefined | null): boolean {
  return array === undefined || array === null || array.length === 0;
}

export function isNotEmptyArray(array: any[] | undefined | null): boolean {
  return !isEmptyArray(array);
}

export function isPlainObject(value: Record<string, any>): boolean {
  return value.constructor === Object;
}
