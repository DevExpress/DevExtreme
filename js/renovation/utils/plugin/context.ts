/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable max-classes-per-file */
import { createContext } from '@devextreme-generator/declarations';

let nextEntityId = 1;

export class PluginEntity<T, S> {
  id: number;

  constructor() {
    this.id = nextEntityId;
    nextEntityId += 1;
  }

  // eslint-disable-next-line class-methods-use-this
  getValue(value: S): T {
    return value as unknown as T;
  }
}

export type GetterStoreValue<T> = ({ order: number; func: (base: T) => T })[];

export type PlaceholderStoreValue = { order: number; component: unknown }[];

export class PluginGetter<T> extends PluginEntity<T, GetterStoreValue<T>> {
  private readonly defaultValue: T;

  constructor(defaultValue: T) {
    super();
    this.defaultValue = defaultValue;
  }

  // eslint-disable-next-line class-methods-use-this
  getValue(value: GetterStoreValue<T>): T {
    return value.reduce((base, item) => item.func(base), this.defaultValue);
  }
}

export function createValue<T>(): PluginEntity<T, T> {
  return new PluginEntity<T, T>();
}

export function createGetter<T>(defaultValue: T): PluginGetter<T> {
  return new PluginGetter<T>(defaultValue);
}

/*
// TODO
export class PluginPlaceholder extends PluginEntity<unknown[], unknown[]> {
}
*/

export function createPlaceholder(): PluginEntity<PlaceholderStoreValue, PlaceholderStoreValue> {
  return new PluginEntity<PlaceholderStoreValue, PlaceholderStoreValue>(); // TODO PluginPlaceholder
}

export class Plugins {
  private readonly items: Record<number, unknown> = {};

  private readonly subscriptions: Record<number, ((callbackValue: unknown) => void)[]> = {};

  set<T, S>(entity: PluginEntity<T, S>, value: S): void {
    this.items[entity.id] = value;
    const subscriptions = this.subscriptions[entity.id];
    if (subscriptions) {
      const callbackValue = entity.getValue(value);

      subscriptions.forEach((handler) => {
        handler(callbackValue);
      });
    }
  }

  extend<T>(entity: PluginGetter<T>, order: number, func: (base: T) => T): () => void {
    const value = (this.items[entity.id] || []) as GetterStoreValue<T>;
    const insertIndex = value.filter((item) => item.order < order).length;
    const item = { order, func };
    value.splice(insertIndex, 0, item);

    this.set(entity, value);

    return (): void => {
      const index = value.indexOf(item);
      if (index >= 0) {
        value.splice(index, 1);
        this.set(entity, value);
      }
    };
  }

  extendPlaceholder(
    entity: PluginEntity<PlaceholderStoreValue, PlaceholderStoreValue>, /* TODO PluginPlaceholder */
    order: number,
    component: unknown,
  ): () => void {
    const value = (this.items[entity.id] || []) as PlaceholderStoreValue;
    const insertIndex = value.filter((item) => item.order < order).length;
    const item = { order, component };
    value.splice(insertIndex, 0, item);
    this.set(entity, value);
    return (): void => {
      const index = value.indexOf(item);
      if (index >= 0) {
        value.splice(index, 1);
        this.set(entity, value);
      }
    };
  }

  getValue<T, S>(entity: PluginEntity<T, S>): T {
    const value = this.items[entity.id] as S;
    return entity.getValue(value);
  }

  watch<T, S>(entity: PluginEntity<T, S>, callback: (value: T) => void): () => void {
    const value = this.items[entity.id] as S;
    const subscriptions = this.subscriptions[entity.id] || [];

    this.subscriptions[entity.id] = subscriptions;

    if (value !== undefined) {
      const callbackValue = entity.getValue(value);
      callback(callbackValue);
    }

    subscriptions.push(callback as (callback: unknown) => void);

    return (): void => {
      const index = subscriptions.indexOf(callback as (callback: unknown) => void);
      if (index >= 0) {
        subscriptions.splice(index, 1);
      }
    };
  }
}

export const PluginsContext = createContext<Plugins | null>(null);
