import { applyBatch } from '@js/common/data/array_utils';
import OperationManager from '@js/common/data/data_source/operation_manager';
import {
  CANCELED_TOKEN,
  isPending,
  mapDataRespectingGrouping,
  normalizeDataSourceOptions,
  normalizeLoadResult,
  normalizeStoreLoadOptionAccessorArguments,
} from '@js/common/data/data_source/utils';
import { errors } from '@js/common/data/errors';
import { throttleChanges } from '@js/common/data/utils';
import { EventsStrategy } from '@js/core/events_strategy';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { create } from '@js/core/utils/queue';
import {
  isBoolean, isDefined, isEmptyObject, isNumeric, isObject, isString,
} from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import commonUtils from '@ts/core/utils/m_common';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import CustomStore from '@ts/data/custom_store';

import type {
  ChangedEvent, DataSourceEventName, EventOptionName, LoadOperation,
  LoadResult, NormalizedDataSourceOptions, StoreLoadOptions,
} from './types';

// Mirrors the coercion the global `isFinite` applies to non-numeric values.
const isFiniteValue = (value: unknown): value is number => isFinite(Number(value));

interface DelayedLoadTask {
  abort: () => void;
}

interface BeforePushAggregationArgs {
  changes: StoreChange[];
  waitFor: unknown[];
}

const EVENT_OPTIONS: { option: EventOptionName; event: DataSourceEventName }[] = [
  { option: 'onChanged', event: 'changed' },
  { option: 'onLoadError', event: 'loadError' },
  { option: 'onLoadingChanged', event: 'loadingChanged' },
  { option: 'onCustomizeLoadResult', event: 'customizeLoadResult' },
  { option: 'onCustomizeStoreLoadOptions', event: 'customizeStoreLoadOptions' },
];

export class DataSource {
  _eventsStrategy: EventsStrategy;

  _store: Store;

  _changedTime: number;

  _onPushHandler: Function;

  _aggregationTimeoutId?: number;

  _storeLoadOptions: StoreLoadOptions;

  _mapFunc?: Function;

  _postProcessFunc?: Function;

  _pageIndex: number;

  _pageSize: number;

  _loadingCount: number;

  _loadQueue: ReturnType<typeof create>;

  _searchValue: unknown;

  _searchOperation: StoreLoadOptions['searchOperation'];

  _searchExpr: StoreLoadOptions['searchExpr'];

  _paginate?: boolean;

  _reshapeOnPush: boolean;

  _operationManager: OperationManager;

  _delayedLoadTask?: DelayedLoadTask;

  _disposed = false;

  _items: unknown[] = [];

  _userData: Record<string, unknown> = {};

  _totalCount = -1;

  _isLoaded = false;

  _isLastPage = false;

  constructor(options?: unknown) {
    const dataSourceOptions: NormalizedDataSourceOptions = normalizeDataSourceOptions(
      options,
      undefined,
    );

    this._eventsStrategy = new EventsStrategy(this, {
      syncStrategy: true,
    });

    this._store = dataSourceOptions.store;
    this._changedTime = 0;

    const needThrottling = dataSourceOptions.pushAggregationTimeout !== 0;

    if (needThrottling) {
      const throttlingTimeout = dataSourceOptions.pushAggregationTimeout === undefined
        ? (): number => this._changedTime * 5
        : dataSourceOptions.pushAggregationTimeout;

      const pushState: {
        deferred?: DeferredObj<unknown>;
        lastWaiters?: unknown[];
      } = {};

      const throttlingPushHandler = throttleChanges((changes: StoreChange[]) => {
        pushState.deferred?.resolve();
        const storePushPending = when(...pushState.lastWaiters ?? []);
        storePushPending.done(() => this._onPush(changes));

        pushState.lastWaiters = undefined;
        pushState.deferred = undefined;
      }, throttlingTimeout);

      this._onPushHandler = (args: BeforePushAggregationArgs): void => {
        this._aggregationTimeoutId = throttlingPushHandler(args.changes);

        pushState.deferred ??= Deferred<unknown>();

        pushState.lastWaiters = args.waitFor;
        args.waitFor.push(pushState.deferred.promise());
      };
      this._store.on('beforePushAggregation', this._onPushHandler);
    } else {
      this._onPushHandler = (changes: StoreChange[]): void => this._onPush(changes);
      this._store.on('push', this._onPushHandler);
    }

    this._storeLoadOptions = this._extractLoadOptions(dataSourceOptions);

    this._mapFunc = dataSourceOptions.map;

    this._postProcessFunc = dataSourceOptions.postProcess;

    this._pageIndex = dataSourceOptions.pageIndex !== undefined ? dataSourceOptions.pageIndex : 0;

    this._pageSize = dataSourceOptions.pageSize !== undefined ? dataSourceOptions.pageSize : 20;

    this._loadingCount = 0;
    this._loadQueue = this._createLoadQueue();

    this._searchValue = 'searchValue' in dataSourceOptions ? dataSourceOptions.searchValue : null;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._searchOperation = dataSourceOptions.searchOperation || 'contains';

    this._searchExpr = dataSourceOptions.searchExpr;

    this._paginate = dataSourceOptions.paginate;

    this._reshapeOnPush = dataSourceOptions.reshapeOnPush ?? false;

    EVENT_OPTIONS.forEach(({ option, event }) => {
      const handler = dataSourceOptions[option];

      if (handler) {
        this.on(event, handler);
      }
    });

    this._operationManager = new OperationManager();
    this._init();
  }

  _init(): void {
    this._items = [];
    this._userData = {};
    this._totalCount = -1;
    this._isLoaded = false;

    if (!isDefined(this._paginate)) {
      this._paginate = !this.group();
    }

    this._isLastPage = !this._paginate;
  }

  dispose(): void {
    this._store.off('beforePushAggregation', this._onPushHandler);
    this._store.off('push', this._onPushHandler);
    this._eventsStrategy.dispose();
    clearTimeout(this._aggregationTimeoutId);

    this._delayedLoadTask?.abort();
    this._operationManager.cancelAll();

    // The references are dropped, not just cleared, exactly as the former `delete` did.
    Reflect.deleteProperty(this, '_store');
    Reflect.deleteProperty(this, '_items');
    Reflect.deleteProperty(this, '_delayedLoadTask');

    this._disposed = true;
  }

  _extractLoadOptions(options: NormalizedDataSourceOptions): StoreLoadOptions {
    const result: StoreLoadOptions = {};
    let names = ['sort', 'filter', 'langParams', 'select', 'group', 'requireTotalCount'];
    const customNames = this._store._customLoadOptions();

    if (customNames) {
      names = names.concat(customNames);
    }

    names.forEach((name) => {
      result[name] = options[name];
    });

    return result;
  }

  loadOptions(): StoreLoadOptions {
    return this._storeLoadOptions;
  }

  items(): unknown[] {
    return this._items;
  }

  pageIndex(): number;
  pageIndex(newIndex: number): void;
  pageIndex(newIndex?: number): number | undefined {
    if (!isDefined(newIndex) || !isNumeric(newIndex)) {
      return this._pageIndex;
    }

    this._pageIndex = newIndex;
    this._isLastPage = !this._paginate;

    return undefined;
  }

  paginate(): boolean | undefined;
  paginate(value: boolean): void;
  paginate(value?: boolean): boolean | undefined {
    if (!isBoolean(value)) {
      return this._paginate;
    }

    if (this._paginate !== value) {
      this._paginate = value;
      this.pageIndex(0);
    }

    return undefined;
  }

  pageSize(): number;
  pageSize(value: number): void;
  pageSize(value?: number): number | undefined {
    if (!isDefined(value) || !isNumeric(value)) {
      return this._pageSize;
    }

    this._pageSize = value;

    return undefined;
  }

  isLastPage(): boolean {
    return this._isLastPage;
  }

  generateStoreLoadOptionAccessor(optionName: string): (args: unknown[]) => unknown {
    return (args: unknown[]): unknown => {
      const normalizedArgs = normalizeStoreLoadOptionAccessorArguments(args);
      if (normalizedArgs === undefined) {
        return this._storeLoadOptions[optionName];
      }

      this._storeLoadOptions[optionName] = normalizedArgs;

      return undefined;
    };
  }

  sort(): StoreLoadOptions['sort'];
  sort(...sortExpr: NonNullable<StoreLoadOptions['sort']>[]): void;
  sort(...args: unknown[]): unknown {
    return this.generateStoreLoadOptionAccessor('sort')(args);
  }

  filter(): StoreLoadOptions['filter'];
  filter(...filterExpr: NonNullable<StoreLoadOptions['filter']>[]): void;
  filter(...args: unknown[]): unknown {
    const newFilter = normalizeStoreLoadOptionAccessorArguments(args);
    if (newFilter === undefined) {
      return this._storeLoadOptions.filter;
    }

    this._storeLoadOptions.filter = newFilter;
    this.pageIndex(0);

    return undefined;
  }

  group(): StoreLoadOptions['group'];
  group(...groupExpr: NonNullable<StoreLoadOptions['group']>[]): void;
  group(...args: unknown[]): unknown {
    return this.generateStoreLoadOptionAccessor('group')(args);
  }

  select(): StoreLoadOptions['select'];
  select(...selectExpr: NonNullable<StoreLoadOptions['select']>[]): void;
  select(...args: unknown[]): unknown {
    return this.generateStoreLoadOptionAccessor('select')(args);
  }

  requireTotalCount(): StoreLoadOptions['requireTotalCount'];
  requireTotalCount(value: boolean): void;
  requireTotalCount(value?: boolean): unknown {
    if (!isBoolean(value)) {
      return this._storeLoadOptions.requireTotalCount;
    }

    this._storeLoadOptions.requireTotalCount = value;

    return undefined;
  }

  searchValue(): StoreLoadOptions['searchValue'];
  searchValue(value: StoreLoadOptions['searchValue']): void;
  searchValue(...args: unknown[]): unknown {
    if (args.length < 1) {
      return this._searchValue;
    }

    const [value] = args;

    this._searchValue = value;
    this.pageIndex(0);

    return undefined;
  }

  searchOperation(): StoreLoadOptions['searchOperation'];
  searchOperation(op: NonNullable<StoreLoadOptions['searchOperation']>): void;
  searchOperation(op?: StoreLoadOptions['searchOperation']): unknown {
    if (!isDefined(op) || !isString(op)) {
      return this._searchOperation;
    }

    this._searchOperation = op;
    this.pageIndex(0);

    return undefined;
  }

  searchExpr(): StoreLoadOptions['searchExpr'];
  searchExpr(...expr: (string | Function)[]): void;
  searchExpr(...args: (string | Function)[]): unknown {
    if (args.length === 0) {
      return this._searchExpr;
    }

    this._searchExpr = args.length > 1 ? args : args[0];
    this.pageIndex(0);

    return undefined;
  }

  store(): Store {
    return this._store;
  }

  key(): StoreKey | undefined {
    return this._store?.key();
  }

  totalCount(): number {
    return this._totalCount;
  }

  isLoaded(): boolean {
    return this._isLoaded;
  }

  isLoading(): boolean {
    return this._loadingCount > 0;
  }

  beginLoading(): void {
    this._changeLoadingCount(1);
  }

  endLoading(): void {
    this._changeLoadingCount(-1);
  }

  _createLoadQueue(): ReturnType<typeof create> {
    return create();
  }

  _changeLoadingCount(increment: number): void {
    const oldLoading = this.isLoading();

    this._loadingCount += increment;
    const newLoading = this.isLoading();

    if (oldLoading !== newLoading) {
      this._eventsStrategy.fireEvent('loadingChanged', [newLoading]);
    }
  }

  _scheduleLoadCallbacks(deferred: DeferredObj<unknown>): void {
    this.beginLoading();

    deferred.always(() => {
      this.endLoading();
    });
  }

  _scheduleFailCallbacks(deferred: DeferredObj<unknown>): void {
    deferred.fail((...args: unknown[]) => {
      if (args[0] === CANCELED_TOKEN) {
        return;
      }

      this._eventsStrategy.fireEvent('loadError', args);
    });
  }

  _fireChanged(e?: ChangedEvent): void {
    const date = Date.now();
    this._eventsStrategy.fireEvent('changed', [e]);
    this._changedTime = Date.now() - date;
  }

  _scheduleChangedCallbacks(deferred: DeferredObj<unknown>): void {
    deferred.done(() => this._fireChanged());
  }

  loadSingle(...args: unknown[]): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    const key = this.key();
    const store = this._store;
    const options = this._createStoreLoadOptions();
    const handleDone = (data: unknown): void => {
      const isEmptyArray = Array.isArray(data) && !data.length;
      if (!isDefined(data) || isEmptyArray) {
        d.reject(errors.Error('E4009'));
      } else {
        const items = Array.isArray(data) ? data : [data];
        d.resolve(this._applyMapFunction(items)[0]);
      }
    };

    this._scheduleFailCallbacks(d);

    const [propName, propValue] = args.length < 2 ? [key, args[0]] : args;

    delete options.skip;
    delete options.group;
    delete options.refresh;
    delete options.pageIndex;
    delete options.searchString;
    const shouldForceByKey = (): boolean => store instanceof CustomStore && !store._byKeyViaLoad();

    // NOTE for CustomStore always using byKey
    // for backward compatibility with "old user datasource"
    const useByKey = propName === key || shouldForceByKey();

    if (!useByKey) {
      options.take = 1;
      options.filter = options.filter
        ? [options.filter, [propName, propValue]]
        : [propName, propValue];
    }

    const request = useByKey ? store.byKey(propValue, options) : store.load(options);

    request.fail((...failArgs: unknown[]) => { d.reject(...failArgs); }).done(handleDone);

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  }

  load(): DeferredObj<unknown> {
    const d = Deferred<unknown>();

    this._scheduleLoadCallbacks(d);
    this._scheduleFailCallbacks(d);
    this._scheduleChangedCallbacks(d);

    const loadOperation: LoadOperation = this._createLoadOperation(d);

    const loadTask = (): unknown => {
      if (this._disposed) {
        return undefined;
      }

      if (!isPending(d)) {
        return undefined;
      }

      return this._loadFromStore(loadOperation, d);
    };

    this._eventsStrategy.fireEvent('customizeStoreLoadOptions', [loadOperation]);

    this._loadQueue.add(() => {
      if (typeof loadOperation.delay === 'number') {
        this._delayedLoadTask = commonUtils.executeAsync(loadTask, loadOperation.delay);
      } else {
        loadTask();
      }
      return d.promise();
    }, undefined);

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise({
      operationId: loadOperation.operationId,
    });
  }

  _onPush(changes: StoreChange[]): void {
    if (this._reshapeOnPush) {
      this.load();
    } else {
      const changingArgs: {
        changes: StoreChange[];
        postProcessChanges?: (changes: StoreChange[]) => StoreChange[];
      } = { changes };
      this._eventsStrategy.fireEvent('changing', [changingArgs]);

      const group = this.group();
      const items = this.items();
      let groupLevel = 0;
      let dataSourceChanges = this.paginate() || group
        ? changes.filter((item) => item.type === 'update')
        : changes;

      if (group) {
        groupLevel = Array.isArray(group) ? group.length : 1;
      }

      if (this._mapFunc) {
        dataSourceChanges.forEach((item) => {
          if (item.type === 'insert') {
            item.data = this._mapFunc?.(item.data);
          }
        });
      }

      if (changingArgs.postProcessChanges) {
        dataSourceChanges = changingArgs.postProcessChanges(dataSourceChanges);
      }

      // @ts-expect-error array_utils is untyped: `applyBatch` destructures every option as required
      applyBatch({
        keyInfo: this.store(),
        data: items,
        changes: dataSourceChanges,
        groupCount: groupLevel,
        useInsertIndex: true,
      });
      this._fireChanged({ changes });
    }
  }

  _createLoadOperation(deferred: DeferredObj<unknown>): LoadOperation {
    const operationId: number = this._operationManager.add(deferred);
    const storeLoadOptions = this._createStoreLoadOptions();

    if (this._store && !isEmptyObject(storeLoadOptions.langParams)) {
      this._store._langParams = { ...this._store._langParams, ...storeLoadOptions.langParams };
    }

    deferred.always(() => this._operationManager.remove(operationId));

    return {
      operationId,
      storeLoadOptions,
    };
  }

  reload(): DeferredObj<unknown> {
    const store = this.store();

    store._clearCache();

    this._init();
    return this.load();
  }

  cancel(operationId: number): boolean {
    const result: boolean = this._operationManager.cancel(operationId);

    return result;
  }

  cancelAll(): void {
    this._operationManager.cancelAll();
  }

  _addSearchOptions(storeLoadOptions: StoreLoadOptions): void {
    if (this._disposed) {
      return;
    }

    if (this.store()._useDefaultSearch) {
      this._addSearchFilter(storeLoadOptions);
    } else {
      storeLoadOptions.searchOperation = this._searchOperation;
      storeLoadOptions.searchValue = this._searchValue;
      storeLoadOptions.searchExpr = this._searchExpr;
    }
  }

  _createStoreLoadOptions(): StoreLoadOptions {
    const result: StoreLoadOptions = extend({}, this._storeLoadOptions);

    this._addSearchOptions(result);

    if (this._paginate) {
      if (this._pageSize) {
        result.skip = this._pageIndex * this._pageSize;
        result.take = this._pageSize;
      }
    }

    result.userData = this._userData;

    return result;
  }

  _addSearchFilter(storeLoadOptions: StoreLoadOptions): void {
    const value = this._searchValue;
    const op = this._searchOperation;
    const searchFilter: unknown[] = [];

    if (!value) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const selector = this._searchExpr || 'this';
    const selectors: unknown[] = Array.isArray(selector) ? selector : [selector];

    // TODO optimize for byKey case

    selectors.forEach((item) => {
      if (searchFilter.length) {
        searchFilter.push('or');
      }
      searchFilter.push([item, op, value]);
    });

    if (storeLoadOptions.filter) {
      storeLoadOptions.filter = [searchFilter, storeLoadOptions.filter];
    } else {
      storeLoadOptions.filter = searchFilter;
    }
  }

  _loadFromStore(
    loadOptions: LoadOperation,
    pendingDeferred: DeferredObj<unknown>,
  ): DeferredObj<unknown> {
    const handleSuccess = (data: unknown, extra?: unknown): void => {
      if (this._disposed) {
        return;
      }

      if (!isPending(pendingDeferred)) {
        return;
      }

      // Process result
      const loadResult: LoadResult = extend(normalizeLoadResult(data, extra), loadOptions);

      this._eventsStrategy.fireEvent('customizeLoadResult', [loadResult]);
      when(loadResult.data).done((resolvedData: unknown[]) => {
        loadResult.data = resolvedData;
        this._processStoreLoadResult(loadResult, pendingDeferred);
      }).fail((...args: unknown[]) => { pendingDeferred.reject(...args); });
    };

    if (loadOptions.data) {
      return Deferred<unknown>().resolve(loadOptions.data).done(handleSuccess);
    }

    return this.store().load(loadOptions.storeLoadOptions)
      .done(handleSuccess)
      .fail((...args: unknown[]) => { pendingDeferred.reject(...args); });
  }

  _processStoreLoadResult(
    loadResult: LoadResult,
    pendingDeferred: DeferredObj<unknown>,
  ): void {
    const { storeLoadOptions } = loadResult;
    let { data, extra } = loadResult;

    const resolvePendingDeferred = (): DeferredObj<unknown> => {
      this._isLoaded = true;
      this._totalCount = isFiniteValue(extra.totalCount) ? extra.totalCount : -1;
      return pendingDeferred.resolve(data, extra);
    };

    const proceedLoadingTotalCount = (): void => {
      this.store().totalCount(storeLoadOptions)
        .done((count) => {
          extra.totalCount = count;
          resolvePendingDeferred();
        })
        .fail((...args: unknown[]) => { pendingDeferred.reject(...args); });
    };

    if (this._disposed) {
      return;
    }

    // todo: if operation is canceled there is no need to do data transformation

    data = this._applyPostProcessFunction(this._applyMapFunction(data));

    if (!isObject(extra)) {
      extra = {};
    }

    this._items = data;

    if (!data.length || !this._paginate || (this._pageSize && (data.length < this._pageSize))) {
      this._isLastPage = true;
    }

    if (storeLoadOptions.requireTotalCount && !isFiniteValue(extra.totalCount)) {
      proceedLoadingTotalCount();
    } else {
      resolvePendingDeferred();
    }
  }

  _applyMapFunction(data: unknown[]): unknown[] {
    if (this._mapFunc) {
      const mapped: unknown[] = mapDataRespectingGrouping(data, this._mapFunc, this.group());

      return mapped;
    }

    return data;
  }

  _applyPostProcessFunction(data: unknown[]): unknown[] {
    if (this._postProcessFunc) {
      const processed: unknown[] = this._postProcessFunc(data);

      return processed;
    }

    return data;
  }

  on(eventName: DataSourceEventName, eventHandler: Function): this;
  on(events: { [key in DataSourceEventName]?: Function }): this;
  on(
    eventName: DataSourceEventName | { [key in DataSourceEventName]?: Function },
    eventHandler?: Function,
  ): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  off(eventName: DataSourceEventName, eventHandler?: Function): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
}

/*
 * `Class.inherit()` defined prototype members as enumerable, and consumers still rely on
 * that: the grid's DataSourceAdapter copies a data source's members with a `for…in` loop
 * (see its "remove copying dataSource's members" TODO). ES6 class methods are not
 * enumerable, so restore the descriptors a data source used to expose.
 */
Object.getOwnPropertyNames(DataSource.prototype).forEach((memberName) => {
  if (memberName === 'constructor') {
    return;
  }

  const descriptor = Object.getOwnPropertyDescriptor(DataSource.prototype, memberName);

  if (descriptor) {
    Object.defineProperty(DataSource.prototype, memberName, { ...descriptor, enumerable: true });
  }
});
