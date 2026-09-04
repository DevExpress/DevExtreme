import type { LoadOptions, Query } from '@js/common/data';
import { errors, handleError } from '@js/common/data/errors';
import storeHelper from '@js/common/data/store_helper';
import { processRequestResultLock } from '@js/common/data/utils';
import { EventsStrategy } from '@js/core/events_strategy';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isEmptyObject } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';

const { queryByOptions } = storeHelper;

export type StoreKey = string | string[];

export type StoreErrorHandler = (error: unknown) => void;

export interface LangParams {
  locale?: string;
  collatorOptions?: Intl.CollatorOptions;
}

export interface StoreLoadOptions extends LoadOptions<unknown> {
  langParams?: LangParams;
  _langParams?: LangParams;
}

type StoreEventOptionName = 'onLoaded'
  | 'onLoading'
  | 'onInserted'
  | 'onInserting'
  | 'onUpdated'
  | 'onUpdating'
  | 'onPush'
  | 'onRemoved'
  | 'onRemoving'
  | 'onModified'
  | 'onModifying';

export type StoreOptions = {
  key?: StoreKey;
  errorHandler?: StoreErrorHandler;
} & Partial<Record<StoreEventOptionName, Function>>;

export type StoreConstructor = new (options?: StoreOptions) => Store;

const EVENT_OPTION_NAMES: StoreEventOptionName[] = [
  'onLoaded',
  'onLoading',
  'onInserted',
  'onInserting',
  'onUpdated',
  'onUpdating',
  'onPush',
  'onRemoved',
  'onRemoving',
  'onModified',
  'onModifying',
];

const storeImpl: Record<string, StoreConstructor> = {};

class Store {
  _eventsStrategy: EventsStrategy;

  _langParams: LangParams = {};

  _key?: StoreKey;

  _keyGetter?: Function;

  _errorHandler?: StoreErrorHandler;

  _useDefaultSearch: boolean;

  constructor(options?: StoreOptions) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const storeOptions: StoreOptions = options || {};

    this._eventsStrategy = new EventsStrategy(this);

    EVENT_OPTION_NAMES.forEach((optionName) => {
      const handler = storeOptions[optionName];

      if (handler) {
        this.on(optionName.slice(2).toLowerCase(), handler);
      }
    });

    this._key = storeOptions.key;

    this._errorHandler = storeOptions.errorHandler;

    this._useDefaultSearch = true;
  }

  static create(alias: string, options?: StoreOptions): Store {
    if (!(alias in storeImpl)) {
      throw errors.Error('E4020', alias);
    }

    return new storeImpl[alias](options);
  }

  static registerClass<T extends StoreConstructor>(type: T, alias?: string): T {
    if (alias) {
      storeImpl[alias] = type;
    }
    return type;
  }

  _clearCache(): void {}

  _customLoadOptions(): string[] | null {
    return null;
  }

  key(): StoreKey | undefined {
    return this._key;
  }

  keyOf(obj: unknown): unknown {
    // @ts-expect-error core/utils/data.d.ts types compileGetter as `(expr: string) => unknown`,
    // although it also accepts a compound key expression and returns a getter function
    const keyGetter: Function = this._keyGetter ?? compileGetter(this.key());

    this._keyGetter = keyGetter;

    const result: unknown = keyGetter(obj);

    return result;
  }

  _requireKey(): void {
    if (!this.key()) {
      throw errors.Error('E4005');
    }
  }

  load(options?: StoreLoadOptions): DeferredObj<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const loadOptions: StoreLoadOptions = options || {};

    this._eventsStrategy.fireEvent('loading', [loadOptions]);

    return this._withLock(this._loadImpl(loadOptions)).done((result) => {
      this._eventsStrategy.fireEvent('loaded', [result, loadOptions]);
    });
  }

  _loadImpl(options?: StoreLoadOptions): DeferredObj<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const loadOptions: StoreLoadOptions = options || {};

    if (!isEmptyObject(this._langParams)) {
      loadOptions._langParams = { ...this._langParams, ...loadOptions._langParams };
    }

    // @ts-expect-error `createQuery()` is declared with the public `Query` type, whose
    // enumerate() promises a native Promise, while the query implementations resolve a
    // Deferred (iteration 2: type createQuery() with the internal query interface)
    const result: DeferredObj<unknown[]> = queryByOptions(
      this.createQuery(loadOptions),
      loadOptions,
      false,
    ).enumerate();

    return result;
  }

  _withLock<T>(task: DeferredObj<T>): DeferredObj<T> {
    const result = Deferred<T>();

    task.done(function (this: DeferredObj<T>, ...args: T[]) {
      processRequestResultLock
        .promise()
        .done(() => {
          result.resolveWith(this, args);
        });
    }).fail(function (this: DeferredObj<T>, ...args: T[]) {
      result.rejectWith(this, args);
    });

    return result;
  }

  // Kept as a throwing member (not a TS `abstract` one) so that a descendant
  // that skips it still fails with E0001, as it did with Class.abstract.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createQuery(options?: StoreLoadOptions): Query {
    throw errors.Error('E0001');
  }

  totalCount(options?: StoreLoadOptions): DeferredObj<number> {
    return this._totalCountImpl(options);
  }

  _totalCountImpl(options?: StoreLoadOptions): DeferredObj<number> {
    // @ts-expect-error `createQuery()` is declared with the public `Query` type, whose
    // count() promises a native Promise, while the query implementations resolve a
    // Deferred (iteration 2: type createQuery() with the internal query interface)
    const result: DeferredObj<number> = queryByOptions(
      this.createQuery(options),
      options,
      true,
    ).count();

    return result;
  }

  byKey(key: unknown, extraOptions?: StoreLoadOptions): DeferredObj<unknown> {
    return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _byKeyImpl(key: unknown, extraOptions?: StoreLoadOptions): DeferredObj<unknown> {
    throw errors.Error('E0001');
  }

  insert(values: unknown): DeferredObj<unknown> {
    this._eventsStrategy.fireEvent('modifying', []);
    this._eventsStrategy.fireEvent('inserting', [values]);

    return this._addFailHandlers(this._insertImpl(values).done((callbackValues, callbackKey) => {
      this._eventsStrategy.fireEvent('inserted', [callbackValues, callbackKey]);
      this._eventsStrategy.fireEvent('modified', []);
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _insertImpl(values: unknown): DeferredObj<unknown> {
    throw errors.Error('E0001');
  }

  update(key: unknown, values: unknown): DeferredObj<unknown> {
    this._eventsStrategy.fireEvent('modifying', []);
    this._eventsStrategy.fireEvent('updating', [key, values]);

    return this._addFailHandlers(this._updateImpl(key, values).done(() => {
      this._eventsStrategy.fireEvent('updated', [key, values]);
      this._eventsStrategy.fireEvent('modified', []);
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateImpl(key: unknown, values: unknown): DeferredObj<unknown> {
    throw errors.Error('E0001');
  }

  push(changes: StoreChange[]): void {
    const beforePushArgs: { changes: StoreChange[]; waitFor: unknown[] } = {
      changes,
      waitFor: [],
    };

    this._eventsStrategy.fireEvent('beforePushAggregation', [beforePushArgs]);

    when(...beforePushArgs.waitFor).done(() => {
      this._pushImpl(changes);
      this._eventsStrategy.fireEvent('beforePush', [{ changes }]);
      this._eventsStrategy.fireEvent('push', [changes]);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pushImpl(changes: StoreChange[]): void {}

  remove(key: unknown): DeferredObj<unknown> {
    this._eventsStrategy.fireEvent('modifying', []);
    this._eventsStrategy.fireEvent('removing', [key]);

    return this._addFailHandlers(this._removeImpl(key).done((callbackKey) => {
      this._eventsStrategy.fireEvent('removed', [callbackKey]);
      this._eventsStrategy.fireEvent('modified', []);
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _removeImpl(key: unknown): DeferredObj<unknown> {
    throw errors.Error('E0001');
  }

  _addFailHandlers(deferred: DeferredObj<unknown>): DeferredObj<unknown> {
    return deferred.fail(this._errorHandler).fail(handleError);
  }

  on(eventName: string, eventHandler: Function): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  off(eventName: string, eventHandler?: Function): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
}

export default Store;
