/* eslint-disable @typescript-eslint/no-dynamic-delete */
import ArrayStore from '@js/common/data/array_store';
import { applyBatch } from '@js/common/data/array_utils';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { getKeyHash } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import type { EventsStrategy } from '@ts/core/events_strategy';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { ChangingEvent, StoreLoadOptions } from '@ts/data/data_source/types';
import type { BeforePushEvent } from '@ts/data/types';

import gridCoreUtils from '../m_utils';
import modules from '../modules/modules';
import { CustomLoader } from './custom_loader';
import {
  calculateOperationTypes,
  cloneItems,
  createEmptyCachedData,
  getPageDataFromCache,
  setPageDataToCache,
} from './m_data_source_adapter_utils';
import type {
  ChangedEvent, LoadOperation, OperationTypes, RawItemData, RemoteOperationsOptions,
} from './types';
import { normalizeRemoteOperations } from './utils/remoteOperations';

export default class DataSourceAdapter extends modules.Controller {
  public _dataSource!: DataSource;

  private _remoteOperations!: RemoteOperationsOptions;

  private _isLastPage!: boolean;

  private _hasLastPage!: boolean;

  private _currentTotalCount!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- virtual_scrolling override
  protected _items: any;

  private _cachedData!: LoadOperation['cachedData'];

  protected _cachedStoreData?: RawItemData[];

  private _cachedPagingData?: RawItemData[];

  private _lastOperationTypes!: OperationTypes;

  private _eventsStrategy!: EventsStrategy;

  protected _totalCountCorrection!: number;

  protected _lastLoadOptions?: LoadOperation['lastLoadOptions'];

  private _dataIndexGetter?: (data: RawItemData) => number;

  private _dataIndexByKey?: Record<string, number>;

  private _isRefreshing?: boolean;

  private _loadingOperationTypes?: OperationTypes;

  private _isRefreshed?: boolean;

  protected _lastOperationId?: number;

  private _operationTypes?: OperationTypes;

  public changed!: Callback<[ChangedEvent?]>;

  public loadingChanged!: Callback<[boolean]>;

  public loadError!: Callback<[Error | string]>;

  public customizeStoreLoadOptions!: Callback<[LoadOperation]>;

  public changing!: Callback<[ChangingEvent]>;

  public pushed!: Callback<[StoreChange[]]>;

  private dataChangedHandlerProxy!: (e: ChangedEvent) => void;

  private customizeStoreLoadOptionsHandlerProxy!: (e: LoadOperation) => void;

  private customizeLoadResultHandlerProxy!: (e: LoadOperation) => void;

  private loadingChangedHandlerProxy!: (e: boolean) => void;

  private loadErrorHandlerProxy!: (e: Error | string) => void;

  private pushHandlerProxy!: (e: BeforePushEvent) => void;

  private changingHandlerProxy!: (e: ChangingEvent) => void;

  public customLoader!: CustomLoader;

  public init(dataSource?: DataSource): void {
    if (!dataSource) {
      return;
    }

    this._dataSource = dataSource;
    this._remoteOperations = normalizeRemoteOperations(
      this.option('remoteOperations'),
      dataSource.store(),
    );

    this._isLastPage = !dataSource.isLastPage();
    this._hasLastPage = false;
    this._currentTotalCount = 0;
    this._cachedData = createEmptyCachedData();
    this._lastOperationTypes = {};
    this._eventsStrategy = dataSource._eventsStrategy;
    this._totalCountCorrection = 0;
    this.customLoader = new CustomLoader(
      dataSource,
      () => this.option('loadingTimeout'),
      (operation) => this.customizeStoreLoadOptionsHandler(operation),
      (operation) => this.customizeLoadResultHandler(operation),
    );

    this.changed = Callbacks();
    this.loadingChanged = Callbacks();
    this.loadError = Callbacks();
    this.customizeStoreLoadOptions = Callbacks();
    this.changing = Callbacks();
    this.pushed = Callbacks();

    this.dataChangedHandlerProxy = this.dataChangedHandler.bind(this);
    this.customizeStoreLoadOptionsHandlerProxy = this.customizeStoreLoadOptionsHandler.bind(this);
    this.customizeLoadResultHandlerProxy = this.customizeLoadResultHandler.bind(this);
    this.loadingChangedHandlerProxy = this.loadingChangedHandler.bind(this);
    this.loadErrorHandlerProxy = this.loadErrorHandler.bind(this);
    this.pushHandlerProxy = this.pushHandler.bind(this);
    this.changingHandlerProxy = this.changingHandler.bind(this);

    dataSource.on('changed', this.dataChangedHandlerProxy);
    dataSource.on('customizeStoreLoadOptions', this.customizeStoreLoadOptionsHandlerProxy);
    dataSource.on('customizeLoadResult', this.customizeLoadResultHandlerProxy);
    dataSource.on('loadingChanged', this.loadingChangedHandlerProxy);
    dataSource.on('loadError', this.loadErrorHandlerProxy);
    dataSource.on('changing', this.changingHandlerProxy);
    dataSource.store().on('beforePush', this.pushHandlerProxy);
  }

  public dispose(isSharedDataSource?: boolean): void {
    const dataSource = this._dataSource;
    const store = dataSource.store();

    dataSource.off('changed', this.dataChangedHandlerProxy);
    dataSource.off('customizeStoreLoadOptions', this.customizeStoreLoadOptionsHandlerProxy);
    dataSource.off('customizeLoadResult', this.customizeLoadResultHandlerProxy);
    dataSource.off('loadingChanged', this.loadingChangedHandlerProxy);
    dataSource.off('loadError', this.loadErrorHandlerProxy);
    dataSource.off('changing', this.changingHandlerProxy);
    store?.off('beforePush', this.pushHandlerProxy);

    if (!isSharedDataSource) {
      dataSource.dispose();
    }
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  public filter(): StoreLoadOptions['filter'];
  public filter(filterExpr: StoreLoadOptions['filter']): void;
  public filter(...args: unknown[]): unknown {
    return (this._dataSource.filter as (...a: unknown[]) => unknown)(...args);
  }

  public sort(): StoreLoadOptions['sort'];
  public sort(sortExpr: StoreLoadOptions['sort']): void;
  public sort(...args: unknown[]): unknown {
    return (this._dataSource.sort as (...a: unknown[]) => unknown)(...args);
  }

  public group(): StoreLoadOptions['group'];
  public group(groupExpr: StoreLoadOptions['group']): void;
  public group(...args: unknown[]): unknown {
    return (this._dataSource.group as (...a: unknown[]) => unknown)(...args);
  }

  public select(): StoreLoadOptions['select'];
  public select(selectExpr: StoreLoadOptions['select']): void;
  public select(...args: unknown[]): unknown {
    return (this._dataSource.select as (...a: unknown[]) => unknown)(...args);
  }

  public paginate(): boolean | undefined;
  public paginate(value: boolean): void;
  public paginate(value?: boolean): boolean | undefined {
    return (this._dataSource.paginate as (...a: unknown[]) => boolean | undefined)(value);
  }

  public requireTotalCount(): StoreLoadOptions['requireTotalCount'];
  public requireTotalCount(value: boolean): void;
  public requireTotalCount(value?: boolean): unknown {
    return (this._dataSource.requireTotalCount as (...a: unknown[]) => unknown)(value);
  }

  public store(): Store {
    return this._dataSource.store();
  }

  public key(): StoreKey | undefined {
    return this._dataSource.key();
  }

  public isLoading(): boolean {
    return this._dataSource.isLoading();
  }

  public beginLoading(): void {
    this._dataSource.beginLoading();
  }

  public endLoading(): void {
    this._dataSource.endLoading();
  }

  public loadOptions(): StoreLoadOptions {
    return this._dataSource.loadOptions();
  }

  public cancel(operationId: number): boolean {
    return this._dataSource.cancel(operationId);
  }

  public cancelAll(): void {
    this._dataSource.cancelAll();
  }

  public remoteOperations(): RemoteOperationsOptions {
    return this._remoteOperations;
  }

  /**
   * @extended: virtual_scrolling
   */
  public refresh(options: LoadOperation, operationTypes: OperationTypes): void {
    const dataSource = this._dataSource;

    if (operationTypes.reload) {
      this.resetCurrentTotalCount();
      this._isLastPage = !dataSource.paginate();
      this._hasLastPage = this._isLastPage;
    }
  }

  public resetCurrentTotalCount(): void {
    this._currentTotalCount = 0;
    this._totalCountCorrection = 0;
  }

  protected setCachedStoreData(data: RawItemData[] | undefined): void {
    this._cachedStoreData = data;
    this._dataIndexByKey = undefined;
  }

  protected resetCache(): void {
    this.setCachedStoreData(undefined);
    this._cachedPagingData = undefined;
  }

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected resetPagesCache(isLiveUpdate?: boolean): void {
    this._cachedData = createEmptyCachedData();
  }

  private _needClearStoreDataCache(): boolean {
    const remoteOperations = this.remoteOperations();
    const operationTypes = this._calculateOperationTypes(this._lastLoadOptions ?? {}, {});
    const isLocalOperations = Object.keys(remoteOperations).every(
      (operationName) => !operationTypes[operationName as keyof OperationTypes]
        || !remoteOperations[operationName as keyof RemoteOperationsOptions],
    );

    return !isLocalOperations;
  }

  public push(changes: StoreChange[], fromStore: boolean): void {
    const store = this.store();

    if (this._needClearStoreDataCache()) {
      this.setCachedStoreData(undefined);
    }

    this._cachedPagingData = undefined;

    this.resetPagesCache(true);

    if (this._cachedStoreData) {
      applyBatch({
        keyInfo: store,
        data: this._cachedStoreData,
        changes,
      });
      // applyBatch mutates _cachedStoreData in place, bypassing setCachedStoreData
      this._dataIndexByKey = undefined;
    }

    if (!fromStore) {
      this._applyBatch(changes);
    }

    this.pushed.fire(changes);
  }

  public getDataIndexGetter(): (data: RawItemData) => number {
    if (!this._dataIndexGetter) {
      const store = this.store();

      this._dataIndexGetter = (data): number => {
        if (!this._dataIndexByKey) {
          const storeData = this._cachedStoreData ?? [];

          this._dataIndexByKey = {};

          for (let i = 0; i < storeData.length; i += 1) {
            this._dataIndexByKey[getKeyHash(store.keyOf(storeData[i]))] = i;
          }
        }

        return this._dataIndexByKey[getKeyHash(store.keyOf(data))];
      };
    }

    return this._dataIndexGetter;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected _getKeyInfo(): Store {
    return this.store();
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected _needToCopyDataObject(): boolean {
    return true;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected _applyBatch(changes: StoreChange[], fromStore = false): void {
    const keyInfo = this._getKeyInfo();
    const dataSource = this._dataSource;
    const groupCount = gridCoreUtils.normalizeSortingInfo(this.group()).length;
    const isReshapeMode = this.option('editing.refreshMode') === 'reshape';
    const isVirtualMode = this.option('scrolling.mode') === 'virtual';

    const filteredChanges = changes.filter(
      (change) => !dataSource.paginate() || change.type !== 'insert' || change.index !== undefined,
    );

    const getItemCount = (): number => (groupCount ? this.itemsCount() : this.items().length);
    const oldItemCount = getItemCount();

    applyBatch({
      keyInfo,
      data: this._items,
      changes: filteredChanges,
      groupCount,
      useInsertIndex: true,
      skipCopying: !this._needToCopyDataObject(),
    });
    applyBatch({
      keyInfo,
      data: dataSource.items(),
      changes: filteredChanges,
      groupCount,
      useInsertIndex: true,
      skipCopying: !this._needToCopyDataObject(),
    });

    const needUpdateTotalCountCorrection = this._currentTotalCount > 0 || (
      (fromStore || !isReshapeMode)
                  && isVirtualMode
    );

    if (needUpdateTotalCountCorrection) {
      this._totalCountCorrection += getItemCount() - oldItemCount;
    }

    filteredChanges.splice(0, filteredChanges.length);
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected pushHandler({ changes }: BeforePushEvent): void {
    this.push(changes, true);
  }

  protected changingHandler(e: ChangingEvent): void {
    this.changing.fire(e);
    this._applyBatch(e.changes, true);
  }

  private _needCleanCacheByOperation(
    operationType: string,
    remoteOperations: RemoteOperationsOptions,
  ): boolean {
    const operationTypesByOrder = ['filtering', 'sorting', 'paging'];
    const operationTypeIndex = operationTypesByOrder.indexOf(operationType);
    const currentOperationTypes = operationTypeIndex >= 0
      ? operationTypesByOrder.slice(operationTypeIndex)
      : [operationType];

    return currentOperationTypes.some(
      (type) => remoteOperations[type as keyof RemoteOperationsOptions],
    );
  }

  protected _calculateOperationTypes(
    loadOptions: StoreLoadOptions,
    lastLoadOptions: (StoreLoadOptions & { groupExpand?: boolean }) | undefined,
    isFullReload?: boolean,
  ): OperationTypes {
    return calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload);
  }

  /**
   * @extended: virtual_scrolling, TreeLists's data_source_adapter, DataGrid's m_grouping
   */
  protected _customizeRemoteOperations(
    options: LoadOperation,
    operationTypes: OperationTypes,
  ): void {
    let cachedStoreData = this._cachedStoreData;
    let cachedPagingData = this._cachedPagingData;
    let cachedData = this._cachedData;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- set before load
    let remoteOperations = options.remoteOperations!;

    if ((options.storeLoadOptions.filter && !remoteOperations.filtering)
      || (options.storeLoadOptions.sort && !remoteOperations.sorting)) {
      remoteOperations = {
        filtering: remoteOperations.filtering,
        summary: remoteOperations.summary,
      };
      options.remoteOperations = remoteOperations;
    }

    if (operationTypes.fullReload) {
      cachedStoreData = undefined;
      cachedPagingData = undefined;
      cachedData = createEmptyCachedData();
    } else {
      if (operationTypes.reload) {
        cachedPagingData = undefined;
        cachedData = createEmptyCachedData();
      } else if (operationTypes.groupExpanding) {
        cachedData = createEmptyCachedData();
      }

      each(operationTypes, (operationType, value) => {
        if (value && this._needCleanCacheByOperation(operationType, remoteOperations)) {
          cachedStoreData = undefined;
          cachedPagingData = undefined;
        }
      });
    }

    if (cachedPagingData) {
      remoteOperations.paging = false;
    }

    options.cachedStoreData = cachedStoreData;
    options.cachedPagingData = cachedPagingData;
    options.cachedData = cachedData;

    if (!options.isCustomLoading) {
      this.setCachedStoreData(cachedStoreData);
      this._cachedPagingData = cachedPagingData;
      this._cachedData = cachedData;
    }
  }

  protected customizeStoreLoadOptionsHandler(options: LoadOperation): void {
    this._handleDataLoading(options);
    if (!(Array.isArray(options.data) && options.data.length === 0)) {
      options.data = getPageDataFromCache(options, true) ?? options.cachedStoreData;
    }
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _handleDataLoading(options: LoadOperation): void {
    const dataSource = this._dataSource;
    const lastLoadOptions = this._lastLoadOptions;

    this.customizeStoreLoadOptions.fire(options);

    options.delay = this.option('loadingTimeout');
    options.originalStoreLoadOptions = options.storeLoadOptions;
    options.remoteOperations = extend({}, this.remoteOperations());

    const isFullReload = !this.isLoaded() && !this._isRefreshing;

    if (this.option('integrationOptions.renderedOnServer') && !this.isLoaded()) {
      options.delay = undefined;
    }

    const loadOptions = extend(
      { pageIndex: this.pageIndex(), pageSize: this.pageSize() },
      options.storeLoadOptions,
    );

    const operationTypes = this._calculateOperationTypes(
      loadOptions,
      lastLoadOptions,
      isFullReload,
    );

    this._customizeRemoteOperations(options, operationTypes);

    if (!options.isCustomLoading) {
      const isRefreshing = this._isRefreshing;

      options.pageIndex = dataSource.pageIndex();
      options.lastLoadOptions = loadOptions;
      options.operationTypes = operationTypes;
      this._loadingOperationTypes = operationTypes;
      this._isRefreshing = true;

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of flags
      when(isRefreshing || this._isRefreshed || this.refresh(options, operationTypes)).done(() => {
        if (this._lastOperationId === options.operationId) {
          this._isRefreshed = true;
          this.load().always(() => {
            this._isRefreshed = false;
          });
        }
      }).fail(() => {
        // `operationId` is only absent on the synthetic load operations
        // `loadAll` builds, and those are always custom loading.
        // @ts-expect-error operationId is set for non-custom loading
        dataSource.cancel(options.operationId);
      }).always(() => {
        this._isRefreshing = false;
      });

      // @ts-expect-error an unset id before the first load cancels nothing
      dataSource.cancel(this._lastOperationId);
      this._lastOperationId = options.operationId;

      if (this._isRefreshing) {
        // @ts-expect-error operationId is set for non-custom loading
        dataSource.cancel(this._lastOperationId);
      }
    }

    this._handleDataLoadingCore(options);
  }

  private _handleDataLoadingCore(options: LoadOperation): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- set before load
    const remoteOperations = options.remoteOperations!;

    const loadOptions: StoreLoadOptions = {};
    options.loadOptions = loadOptions;

    // @ts-expect-error cachedData is set before load
    const cachedExtra = options.cachedData.extra;
    const localLoadOptionNames = {
      filter: !remoteOperations.filtering,
      sort: !remoteOperations.sorting,
      group: !remoteOperations.grouping,
      summary: !remoteOperations.summary,
      skip: !remoteOperations.paging,
      take: !remoteOperations.paging,
      requireTotalCount: (cachedExtra !== undefined && 'totalCount' in cachedExtra) || !remoteOperations.paging,
      langParams: !remoteOperations.filtering || !remoteOperations.sorting,
    };

    each(options.storeLoadOptions, (optionName, optionValue) => {
      if (localLoadOptionNames[optionName]) {
        loadOptions[optionName] = optionValue;
        delete options.storeLoadOptions[optionName];
      }
    });

    if (cachedExtra) {
      options.extra = cachedExtra;
    }
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  public customizeLoadResultHandler(options: LoadOperation): void {
    const { loadOptions } = options;
    const localPaging = options.remoteOperations && !options.remoteOperations.paging;
    const { cachedData } = options;
    const { storeLoadOptions } = options;
    const needCache = this.option('cacheEnabled') !== false && storeLoadOptions;
    const needPageCache = needCache && !options.isCustomLoading && cachedData
      && (!localPaging || storeLoadOptions.group);
    const needPagingCache = needCache && localPaging;
    const needStoreCache = needPagingCache && !options.isCustomLoading;

    if (!loadOptions) {
      // @ts-expect-error operationId is set for non-custom loading
      this._dataSource.cancel(options.operationId);
      return;
    }

    if (localPaging) {
      options.skip = loadOptions.skip;
      options.take = loadOptions.take;

      delete loadOptions.skip;
      delete loadOptions.take;
    }

    if (loadOptions.group) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- group may be ''
      loadOptions.group = options.group || loadOptions.group;
    }

    const groupCount = gridCoreUtils.normalizeSortingInfo(
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- group may be ''
      options.group || storeLoadOptions.group || loadOptions.group,
    ).length;

    if (options.cachedDataPartBegin) {
      options.data = options.cachedDataPartBegin.concat(options.data as RawItemData[]);
    }

    if (options.cachedDataPartEnd) {
      options.data = (options.data as RawItemData[]).concat(options.cachedDataPartEnd);
    }

    if (!needPageCache || !getPageDataFromCache(options)) {
      if (needPagingCache && options.cachedPagingData) {
        options.data = cloneItems(options.cachedPagingData, groupCount);
      } else {
        const cachedStoreData = this._cachedStoreData;
        if (needStoreCache && !cachedStoreData) {
          this.setCachedStoreData(cloneItems(
            options.data as RawItemData[],
            gridCoreUtils.normalizeSortingInfo(storeLoadOptions.group).length,
          ));
        } else if (needStoreCache && cachedStoreData && options.mergeStoreLoadData) {
          this.setCachedStoreData(cachedStoreData.concat(options.data as RawItemData[]));
          options.data = this._cachedStoreData;
        }
        new ArrayStore(options.data as RawItemData[]).load(loadOptions).done((data) => {
          options.data = data as RawItemData[];
          if (needStoreCache) {
            this._cachedPagingData = cloneItems(options.data, groupCount);
          }
        }).fail((error) => {
          // @ts-expect-error badly typed Deferred
          options.data = Deferred().reject(error);
        });
      }

      if (loadOptions.requireTotalCount && localPaging) {
        options.extra = isPlainObject(options.extra) ? options.extra : {};
        options.extra.totalCount = (options.data as RawItemData[]).length;
      }

      if (options.extra && (options.extra.totalCount ?? -1) >= 0
        && (storeLoadOptions.requireTotalCount === false
          || loadOptions.requireTotalCount === false)) {
        options.extra.totalCount = -1;
      }

      if (!loadOptions.data
        && (storeLoadOptions.requireTotalCount || (options.extra?.totalCount ?? -1) >= 0)) {
        this._totalCountCorrection = 0;
      }

      this.customizeLoadResultHandlerCore(options);

      if (needPageCache) {
        cachedData.extra = cachedData.extra ?? extend({}, options.extra);
        when(options.data).done((data) => {
          setPageDataToCache(options, data as RawItemData[], groupCount);
        });
      }
    }

    when(options.data).done(() => {
      if (options.lastLoadOptions) {
        this._lastLoadOptions = options.lastLoadOptions;

        Object.keys(options.operationTypes ?? {}).forEach((operationType) => {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of flags
          this._lastOperationTypes[operationType] ||= options.operationTypes?.[operationType];
        });
      }
    });
    options.storeLoadOptions = options.originalStoreLoadOptions as typeof options.storeLoadOptions;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected customizeLoadResultHandlerCore(options: LoadOperation): void {
    if (options.remoteOperations && !options.remoteOperations.paging
      && Array.isArray(options.data)) {
      if (options.skip !== undefined) {
        options.data = options.data.slice(options.skip);
      }
      if (options.take !== undefined) {
        options.data = options.data.slice(0, options.take);
      }
    }
  }

  /**
   * @extended virtual_scrolling
   */
  protected loadingChangedHandler(isLoading: boolean): void {
    this.loadingChanged.fire(isLoading);
  }

  /**
   * @extended virtual_scrolling
   */
  protected loadErrorHandler(error: Error | string): void {
    this.loadError.fire(error);
    this.changed.fire({
      changeType: 'loadError',
      error,
    });
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _loadPageSize(): number {
    return this.pageSize();
  }

  /**
   * @extended: virtual_scrolling
   */
  // ChangedEvent
  protected dataChangedHandler(e?: ChangedEvent): void {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned below
    let currentTotalCount: number;
    const dataSource = this._dataSource;
    let isLoading = false;

    // At this stage e.changeType can be defined only if virtual scrolling
    // and scrolling.legacyMode is true
    const isDataLoading = !e || isDefined(e.changeType);

    const itemsCount = this.itemsCount();

    if (isDataLoading) {
      this._isLastPage = !itemsCount || !this._loadPageSize() || itemsCount < this._loadPageSize();

      if (this._isLastPage) {
        this._hasLastPage = true;
      }
    }

    if (dataSource.totalCount() >= 0) {
      if (dataSource.pageIndex() >= this.pageCount()) {
        dataSource.pageIndex(this.pageCount() - 1);
        this.pageIndex(dataSource.pageIndex());
        this.resetPagesCache();
        dataSource.load();
        isLoading = true;
      }
    } else if (isDataLoading) {
      currentTotalCount = dataSource.pageIndex() * this.pageSize() + itemsCount;
      if (currentTotalCount > this._currentTotalCount) {
        this._currentTotalCount = currentTotalCount;
        if (dataSource.pageIndex() === 0 || !this.option('scrolling.legacyMode')) {
          this._totalCountCorrection = 0;
        }
      }
      if (itemsCount === 0 && dataSource.pageIndex() >= this.pageCount()) {
        dataSource.pageIndex(this.pageCount() - 1);
        if (this.option('scrolling.mode') !== 'infinite') {
          dataSource.load();
          isLoading = true;
        }
      }
    }

    if (!isLoading) {
      this._operationTypes = this._lastOperationTypes;
      this._lastOperationTypes = {};

      this.component._optionCache = {};
      this.changed.fire(e);
      this.component._optionCache = undefined;
    }
  }

  public loadingOperationTypes(): OperationTypes | undefined {
    return this._loadingOperationTypes;
  }

  public operationTypes(): OperationTypes | null {
    return this._operationTypes ?? null;
  }

  public lastLoadOptions(): NonNullable<LoadOperation['lastLoadOptions']> {
    return this._lastLoadOptions ?? {} as NonNullable<LoadOperation['lastLoadOptions']>;
  }

  private isLastPage(): boolean {
    return this._isLastPage;
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _dataSourceTotalCount(): number {
    return this._dataSource.totalCount();
  }

  /**
   * @extended: virtual_scrolling, TreeLists's data_source_adapter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _changeRowExpandCore(path?: unknown): void {}

  /**
   * @extended: TreeLists's data_source_adapter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public changeRowExpand(path?: unknown): DeferredObj<unknown> | undefined {
    return undefined;
  }

  public totalCount(): number {
    const count = (this._currentTotalCount || this._dataSourceTotalCount())
      + this._totalCountCorrection;
    return parseInt(String(count), 10);
  }

  public totalCountCorrection(): number {
    return this._totalCountCorrection;
  }

  /**
   * @extended: virtual_scrolling
   * @protected
   */
  public items(): RawItemData[] {
    return (this._items ?? []) as RawItemData[];
  }

  /**
   * @extended: virtual_scrolling
   */
  public itemsCount(): number {
    return this._dataSource.items().length;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  public totalItemsCount(): number {
    return this.totalCount();
  }

  public pageSize(): number;
  public pageSize(value: number): void;
  public pageSize(value?: number): number | void {
    if (value === undefined) {
      return this._dataSource.paginate()
        ? this._dataSource.pageSize()
        : 0;
    }
    return this._dataSource.pageSize(value);
  }

  public pageCount(): number {
    const count = this.totalItemsCount() - this._totalCountCorrection;
    const pageSize = this.pageSize();

    if (pageSize && count > 0) {
      return Math.max(1, Math.ceil(count / pageSize));
    }
    return 1;
  }

  public hasKnownLastPage(): boolean {
    return this._hasLastPage || this._dataSource.totalCount() >= 0;
  }

  /**
   * @extended: virtual_scrolling
   */
  public load(): DeferredObj<unknown> {
    return this._dataSource.load() as unknown as DeferredObj<unknown>;
  }

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public reload(full?: boolean, changesOnly?: boolean): DeferredObj<unknown> {
    const result = full ? this._dataSource.reload() : this._dataSource.load();
    return result as unknown as DeferredObj<unknown>;
  }

  public getCachedStoreData(): RawItemData[] | undefined {
    return this._cachedStoreData;
  }

  /**
   * @exended: virtual_scrolling
   */
  public isLoaded(): boolean {
    return this._dataSource.isLoaded();
  }

  /**
   * @extended: virtual_scrolling
   */
  public pageIndex(): number;
  public pageIndex(pageIndex: number): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public pageIndex(pageIndex?: number): number | void {}
}
