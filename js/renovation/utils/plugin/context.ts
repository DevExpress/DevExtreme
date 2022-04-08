/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable max-classes-per-file */
import { createContext } from '@devextreme-generator/declarations';

let nextEntityId = 1;

export class PluginEntity<T, S=T> {
  id: number;

  constructor() {
    this.id = nextEntityId;
    nextEntityId += 1;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  getValue(value: S, _plugins: Plugins): T {
    return value as unknown as T;
  }
}

export interface GetterStoreValueItem<T> {
  order: number;
  func: (...args: unknown[]) => T;
  deps?: PluginEntity<unknown, unknown> [];
  unsubscribe?: () => void;
}

export type GetterStoreValue<T> = GetterStoreValueItem<T>[];

export type PlaceholderStoreValue = { order: number; component: unknown }[];

export class PluginGetter<T> extends PluginEntity<T, GetterStoreValue<T>> {
  private readonly defaultValue: T;

  constructor(defaultValue: T) {
    super();
    this.defaultValue = defaultValue;
  }

  getValue(value: GetterStoreValue<T>, plugins: Plugins): T {
    if (!value) {
      return this.defaultValue;
    }
    return value.reduce((base, item) => {
      if (plugins && item.deps) {
        const hasValues = item.deps.every((entity) => plugins.hasValue(entity));
        if (!hasValues) {
          return base;
        }

        const args = item.deps.map((entity) => {
          if (entity.id === this.id) {
            return base;
          }
          return plugins.getValue(entity);
        });
        return item.func.apply(null, args);
      }
      return item.func(base);
    }, this.defaultValue);
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

export function createValue<T>(): PluginEntity<T> {
  return new PluginEntity<T, T>();
}

// export function createSelector<R, A>(
//   deps: [PluginEntity<A, unknown>],
//   func: (a: A) => R
// ): PluginSelector<R>;

// export function createSelector<R, A, B>(
//   deps: [PluginEntity<A, unknown>, PluginEntity<B, unknown>],
//   func: (a: A, b: B) => R
// ): PluginSelector<R>;

// export function createSelector<R, A, B, C>(
//   deps: [PluginEntity<A, unknown>, PluginEntity<B, unknown>, PluginEntity<C, unknown>],
//   func: (a: A, b: B, c: C) => R
// ): PluginSelector<R>;

// export function createSelector<R, A, B, C, D>(
//   deps: [
//     PluginEntity<A, unknown>,
//     PluginEntity<B, unknown>,
//     PluginEntity<C, unknown>,
//     PluginEntity<D, unknown>,
//   ],
//   func: (a: A, b: B, c: C, d: D) => R
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

function createUnsubscribeFunction(
  childSubscriptionsList: Subscription[][],
  subscription: Subscription,
): () => void {
  return (): void => {
    childSubscriptionsList.forEach((childSubscriptions) => {
      const index = childSubscriptions.indexOf(subscription);
      /* istanbul ignore next */
      if (index >= 0) {
        childSubscriptions.splice(index, 1);
      }
    });
  };
}

export class Plugins {
  private readonly items: Record<number, unknown> = {};

  private readonly subscriptions: Record<number, Subscription[]> = {};

  private readonly subscribedSelectors: Record<number, boolean> = {};

  set<T, S>(entity: PluginEntity<T, S>, value: S, force = false): void {
    if (entity.id in this.items && this.items[entity.id] === value && !force) return;

    this.items[entity.id] = value;

    this.fireSubscriptions(entity);
  }

  fireSubscriptions<T, S>(entity: PluginEntity<T, S>): void {
    const value = this.items[entity.id] as S;

    const subscriptions = this.subscriptions[entity.id];
    if (subscriptions) {
      const callbackValue = entity.getValue(value, this);

      subscriptions.forEach((handler) => {
        handler(callbackValue);
      });
    }
  }

  extend<T>(
    entity: PluginGetter<T>,
    order: number,
    func: (base: T) => T,
    deps?: PluginEntity<unknown, unknown> [],
  ): () => void {
    const value = (this.items[entity.id] || []) as GetterStoreValue<T>;
    const insertIndex = value.filter((item) => item.order < order).length;
    const item = {
      order,
      func: func as (...args: unknown[]) => T,
      deps,
    };
    const unsubscribe = deps ? this.subscribeToGetterItemDeps(entity, deps) : undefined;
    value.splice(insertIndex, 0, item);
    this.set(entity, value, true);

    return (): void => {
      const index = value.indexOf(item);
      if (index >= 0) {
        value.splice(index, 1);
        unsubscribe?.();
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

  getValue<T, S>(entity: PluginEntity<T, S>): T | undefined {
    this.update(entity);
    const value = this.items[entity.id] as S;
    return entity.getValue(value, this);
  }

  hasValue<T, S>(entity: PluginEntity<T, S>): boolean {
    if (entity instanceof PluginGetter) {
      return true;
    }

    return entity.id in this.items;
  }

  updateSelectorValue<R>(entity: PluginSelector<R>): void {
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
          this.update(entity, true);
        });
      });
    }
  }

  subscribeToGetterItemDeps<T>(
    getter: PluginGetter<T>,
    deps: PluginEntity<unknown>[],
  ): () => void {
    const fireEntitySubscriptions = (): void => this.fireSubscriptions(getter);
    const childSubscriptionsList = deps
      .filter((childEntity) => childEntity.id !== getter.id)
      .map((childEntity) => this.getSubscriptions(childEntity));

    childSubscriptionsList.forEach((childSubscriptions) => {
      childSubscriptions.push(fireEntitySubscriptions);
    });
    return createUnsubscribeFunction(
      childSubscriptionsList,
      fireEntitySubscriptions,
    );
  }

  updateSelector<T>(entity: PluginSelector<T>): void {
    entity.deps.forEach((child) => {
      this.update(child);
    });

    this.subscribeToSelectorDeps(entity);

    if (entity.deps.every((childEntity) => this.hasValue(childEntity))) {
      this.updateSelectorValue(entity);
    }
  }

  update<T, S>(entity: PluginEntity<T, S>, force = false): void {
    if (entity instanceof PluginSelector) {
      if (!this.hasValue(entity) || force) {
        this.updateSelector(entity);
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
      const callbackValue = entity.getValue(value, this);
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

  callAction<
    Args extends unknown[], R,
  >(entity: PluginEntity<(...args: Args) => R>, ...args: Args): R | undefined {
    const value = this.getValue(entity);
    return value?.(...args);
  }
}

export const PluginsContext = createContext<Plugins | null>(null);
