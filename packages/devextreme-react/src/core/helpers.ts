/* eslint-disable max-classes-per-file, no-restricted-syntax */
import { IElementDescriptor } from './configuration/react/element';
import { TemplateInstantiationModel } from './types';

export function generateID(): string {
  return Math.random().toString(36).substring(2);
}

export class DoubleKeyMap<TKey1, TKey2, TValue> {
  private readonly _map: Map<TKey1, Map<TKey2, TValue>> = new Map();

  public set({ key1, key2 }: { key1: TKey1; key2: TKey2 }, value: TValue): void {
    let innerMap = this._map.get(key1);
    if (!innerMap) {
      innerMap = new Map<TKey2, TValue>();
      this._map.set(key1, innerMap);
    }

    innerMap.set(key2, value);
  }

  public get({ key1, key2 }: { key1: TKey1; key2: TKey2 }): TValue | undefined {
    const innerMap = this._map.get(key1);
    return innerMap ? innerMap.get(key2) : undefined;
  }

  public delete({ key1, key2 }: { key1: TKey1; key2: TKey2 }): void {
    const innerMap = this._map.get(key1);
    if (!innerMap) {
      return;
    }

    innerMap.delete(key2);
    if (innerMap.size === 0) {
      this._map.delete(key1);
    }
  }

  public clear(): void {
    this._map.clear();
  }

  public get empty(): boolean {
    return this._map.size === 0;
  }

  * [Symbol.iterator](): Generator<[{ key1: TKey1; key2: TKey2 }, TValue]> {
    for (const [key1, innerMap] of this._map) {
      for (const [key2, value] of innerMap) {
        yield [{ key1, key2 }, value];
      }
    }
  }
}

export class TemplateInstantiationModels extends DoubleKeyMap<any, HTMLElement, TemplateInstantiationModel> {}

export function capitalizeFirstLetter(text: string): string {
  if (text.length) {
    return `${text[0].toUpperCase()}${text.substr(1)}`;
  }
  return '';
}

export function hasExpectedChildren(elementDescriptor: IElementDescriptor): boolean {
  return !!Object.keys(elementDescriptor.ExpectedChildren || {}).length;
}
