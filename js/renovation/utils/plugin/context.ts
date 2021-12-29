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

export type SelectorFunc<R> = (...args) => R;

export class PluginSelector<R> extends PluginEntity<R, R> {
  readonly deps: PluginEntity<unknown, unknown>[];

  readonly func: SelectorFunc<R>;

  constructor(deps: PluginEntity<unknown, unknown>[], func: SelectorFunc<R>) {
    super();
    this.deps = deps;
    this.func = func;
  }
}

export function createValue<T>(): PluginEntity<T, T> {
  return new PluginEntity<T, T>();
}

// export function createSelector<A, R>(
//   deps: [PluginEntity<A, A>],
//   func: (a: A) => R
// ): PluginSelector<R>;

// export function createSelector<A, B, R>(
//   deps: [PluginEntity<A, A>, PluginEntity<B, B>],
//   func: (a: A, b: B) => R
// ): PluginSelector<R>;

// export function createSelector<A, B, C, R>(
//   deps: [PluginEntity<A, A>, PluginEntity<B, B>, PluginEntity<C, C>],
//   func: (a: A, b: B, c: C) => R
// ): PluginSelector<R>;

export function createSelector<R>(
  deps: PluginEntity<unknown, unknown>[],
  func: SelectorFunc<R>,
): PluginSelector<R> {
  return new PluginSelector<R>(deps, func);
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

type Subscription = (callbackValue: unknown) => void;

export class Plugins {
  private readonly items: Record<number, unknown> = {};

  private readonly subscriptions: Record<number, Subscription[]> = {};

  private readonly subscribedSelectors: Record<number, boolean> = {};

  set<T, S>(entity: PluginEntity<T, S>, value: S, force = false): void {
    if (entity.id in this.items && this.items[entity.id] === value && !force) return;

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

    this.set(entity, value, true);

    return (): void => {
      const index = value.indexOf(item);
      if (index >= 0) {
        value.splice(index, 1);
        this.set(entity, value, true);
      }
    };
  }

  extendPlaceholder(
    entity: PluginEntity<PlaceholderStoreValue, PlaceholderStoreValue>, /* TODO PluginPlaceholder */
    order: number,
    component: unknown,
    deps: PluginEntity<unknown, unknown>[] = [],
  ): () => void {
    const value = (this.items[entity.id] || []) as PlaceholderStoreValue;
    const insertIndex = value.filter((item) => item.order < order).length;
    const item = { order, component, deps };
    value.splice(insertIndex, 0, item);
    this.set(entity, value, true);
    return (): void => {
      const index = value.indexOf(item);
      if (index >= 0) {
        value.splice(index, 1);
        this.set(entity, value, true);
      }
    };
  }

  getValue<T, S>(entity: PluginEntity<T, S>): T {
    this.update(entity);
    const value = this.items[entity.id] as S;
    return entity.getValue(value);
  }

  hasValue<T, S>(entity: PluginEntity<T, S>): boolean {
    return entity.id in this.items;
  }

  updateSelectorValue<R>(entity: PluginSelector<R>): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const childValues = entity.deps.map((childEntity) => this.getValue(childEntity));
    const newValue = entity.func.apply(null, childValues);
    this.set(entity, newValue);
  }

  subscribeToSelectorDeps<R>(entity: PluginSelector<R>): void {
    if (!this.subscribedSelectors[entity.id]) {
      this.subscribedSelectors[entity.id] = true;
      entity.deps.forEach((childEntity) => {
        const childSubscriptions = this.getSubscriptions(childEntity);
        childSubscriptions.push(() => {
          this.update(entity);
        });
      });
    }
  }

  update<T, S>(entity: PluginEntity<T, S>): void {
    if (entity instanceof PluginSelector) {
      entity.deps.forEach((child) => {
        this.update(child);
      });

      this.subscribeToSelectorDeps(entity);

      if (entity.deps.every((childEntity) => this.hasValue(childEntity))) {
        this.updateSelectorValue(entity);
      }
    }
  }

  getSubscriptions<T, S>(entity: PluginEntity<T, S>): Subscription[] {
    const subscriptions = this.subscriptions[entity.id] || [];

    this.subscriptions[entity.id] = subscriptions;

    return subscriptions;
  }

  watch<T, S>(entity: PluginEntity<T, S>, callback: (value: T) => void): () => void {
    this.update(entity);

    if (this.hasValue(entity)) {
      const value = this.items[entity.id] as S;
      const callbackValue = entity.getValue(value);
      callback(callbackValue);
    }

    const subscriptions = this.getSubscriptions(entity);

    subscriptions.push(callback as Subscription);

    return (): void => {
      const index = subscriptions.indexOf(callback as Subscription);
      if (index >= 0) {
        subscriptions.splice(index, 1);
      }
    };
  }
}

export const PluginsContext = createContext<Plugins | null>(null);
