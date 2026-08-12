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
import { isDefined, isFunction, isPlainObject } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import type { ChangingEvent, DataSource } from '@ts/data/data_source/types';
import type { BeforePushEvent } from '@ts/data/store_types';

import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
import {
  calculateOperationTypes,
  cloneItems,
  createEmptyCachedData,
  executeTask,
  getPageDataFromCache,
  setPageDataToCache,
} from './m_data_source_adapter_utils';
import type {
  ChangedEvent, LoadOperation, OperationTypes, RemoteOperationsOptions,
} from './types';
import { normalizeRemoteOperations } from './utils/remoteOperations';

export default class DataSourceAdapter extends modules.Controller {
  protected _dataSource!: DataSource;

  private _remoteOperations!: RemoteOperationsOptions;

  private _isLastPage!: boolean;

  private _hasLastPage!: boolean;

  private _currentTotalCount: any;

  protected _items: any;

  private _cachedData: any;

  protected _cachedStoreData: any;

  private _cachedPagingData: any;

  private _lastOperationTypes!: OperationTypes;

  private _eventsStrategy: any;

  protected _totalCountCorrection: any;

  protected _isLoadingAll: any;

  protected _lastLoadOptions: any;

  private _dataIndexGetter: any;

  private _dataIndexByKey: any;

  private _isRefreshing: any;

  private _loadingOperationTypes?: OperationTypes;

  private _isRefreshed: any;

  protected _lastOperationId: any;

  private _operationTypes?: OperationTypes;

  private _isCustomLoading: any;

  public changed!: Callback<[ChangedEvent?]>;

  public loadingChanged!: Callback<[boolean]>;

  public loadError!: Callback<[Error | string]>;

  public customizeStoreLoadOptions!: Callback<[LoadOperation]>;

  public changing!: Callback<[ChangingEvent]>;

  public pushed!: Callback<[StoreChange[]]>;

  private dataChangedHandlerProxy!: (e: ChangedEvent) => void;

  private customizeStoreLoadOptionsHandlerProxy!: (e: LoadOperation) => void;

  private customizeLoadResultHandlerProxy!: (e: any) => any;

  private loadingChangedHandlerProxy!: (e: any) => any;

  private loadErrorHandlerProxy!: (e: Error | string) => void;

  private pushHandlerProxy!: (e: BeforePushEvent) => any;

  private changingHandlerProxy!: (e: ChangingEvent) => void;

  protected store!: () => any;

  private readonly group!: (args?: any) => any;

  public init(dataSource?: DataSource): void {
    if (!dataSource) {
      return;
    }

    const that = this;

    that._dataSource = dataSource;
    that._remoteOperations = normalizeRemoteOperations(
      this.option('remoteOperations'),
      dataSource.store(),
    );

    that._isLastPage = !dataSource.isLastPage();
    that._hasLastPage = false;
    that._currentTotalCount = 0;
    that._cachedData = createEmptyCachedData();
    that._lastOperationTypes = {};
    that._eventsStrategy = dataSource._eventsStrategy;
    that._totalCountCorrection = 0;
    that._isLoadingAll = false;

    that.changed = Callbacks();
    that.loadingChanged = Callbacks();
    that.loadError = Callbacks();
    that.customizeStoreLoadOptions = Callbacks();
    that.changing = Callbacks();
    that.pushed = Callbacks();

    that.dataChangedHandlerProxy = that.dataChangedHandler.bind(that);
    that.customizeStoreLoadOptionsHandlerProxy = that.customizeStoreLoadOptionsHandler.bind(that);
    that.customizeLoadResultHandlerProxy = that.customizeLoadResultHandler.bind(that);
    that.loadingChangedHandlerProxy = that.loadingChangedHandler.bind(that);
    that.loadErrorHandlerProxy = that.loadErrorHandler.bind(that);
    that.pushHandlerProxy = that.pushHandler.bind(that);
    that.changingHandlerProxy = that.changingHandler.bind(that);

    dataSource.on('changed', that.dataChangedHandlerProxy);
    dataSource.on('customizeStoreLoadOptions', that.customizeStoreLoadOptionsHandlerProxy);
    dataSource.on('customizeLoadResult', that.customizeLoadResultHandlerProxy);
    dataSource.on('loadingChanged', that.loadingChangedHandlerProxy);
    dataSource.on('loadError', that.loadErrorHandlerProxy);
    dataSource.on('changing', that.changingHandlerProxy);
    dataSource.store().on('beforePush', that.pushHandlerProxy);

    // TODO: remove copying dataSource's members
    each(dataSource, (memberName, member) => {
      if (!that[memberName] && isFunction(member)) {
        that[memberName] = function () {
          return this._dataSource[memberName].apply(this._dataSource, arguments);
        };
      }
    });
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
  public remoteOperations(): RemoteOperationsOptions {
    return this._remoteOperations;
  }

  /**
   * @extended: virtual_scrolling
   */
  public refresh(options, operationTypes) {
    const that = this;
    const dataSource = that._dataSource;

    if (operationTypes.reload) {
      that.resetCurrentTotalCount();
      that._isLastPage = !dataSource.paginate();
      that._hasLastPage = that._isLastPage;
    }
  }

  private resetCurrentTotalCount() {
    this._currentTotalCount = 0;
    this._totalCountCorrection = 0;
  }

  protected setCachedStoreData(data): void {
    this._cachedStoreData = data;
    this._dataIndexByKey = undefined;
  }

  protected resetCache() {
    this.setCachedStoreData(undefined);
    this._cachedPagingData = undefined;
  }

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected resetPagesCache(isLiveUpdate?) {
    this._cachedData = createEmptyCachedData();
  }

  private _needClearStoreDataCache() {
    const remoteOperations = this.remoteOperations();
    const operationTypes = this._calculateOperationTypes(this._lastLoadOptions || {}, {});
    const isLocalOperations = Object.keys(remoteOperations).every((operationName) => !operationTypes[operationName] || !remoteOperations[operationName]);

    return !isLocalOperations;
  }

  private push(changes: StoreChange[], fromStore: boolean): void {
    const store = this.store();

    if (this._needClearStoreDataCache()) {
      this.setCachedStoreData(undefined);
    }

    this._cachedPagingData = undefined;

    this.resetPagesCache(true);

    if (this._cachedStoreData) {
      // @ts-expect-error
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

  private getDataIndexGetter() {
    if (!this._dataIndexGetter) {
      const store = this.store();

      this._dataIndexGetter = (data) => {
        if (!this._dataIndexByKey) {
          const storeData = this._cachedStoreData ?? [];

          this._dataIndexByKey = {};

          for (let i = 0; i < storeData.length; i++) {
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
  protected _getKeyInfo() {
    return this.store();
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected _needToCopyDataObject() {
    return true;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected _applyBatch(changes, fromStore?) {
    const keyInfo = this._getKeyInfo();
    const dataSource = this._dataSource;
    const groupCount = gridCoreUtils.normalizeSortingInfo(this.group()).length;
    const isReshapeMode = this.option('editing.refreshMode') === 'reshape';
    const isVirtualMode = this.option('scrolling.mode') === 'virtual';

    changes = changes.filter((change) => !dataSource.paginate() || change.type !== 'insert' || change.index !== undefined);

    const getItemCount = () => (groupCount ? this.itemsCount() : this.items().length);
    const oldItemCount = getItemCount();

    // @ts-expect-error
    applyBatch({
      keyInfo,
      data: this._items,
      changes,
      groupCount,
      useInsertIndex: true,
      skipCopying: !this._needToCopyDataObject(),
    });
    // @ts-expect-error
    applyBatch({
      keyInfo,
      data: dataSource.items(),
      changes,
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

    changes.splice(0, changes.length);
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

  private _needCleanCacheByOperation(operationType, remoteOperations) {
    const operationTypesByOrder = ['filtering', 'sorting', 'paging'];
    const operationTypeIndex = operationTypesByOrder.indexOf(operationType);
    const currentOperationTypes = operationTypeIndex >= 0 ? operationTypesByOrder.slice(operationTypeIndex) : [operationType];

    return currentOperationTypes.some((operationType) => remoteOperations[operationType]);
  }

  protected _calculateOperationTypes(
    loadOptions,
    lastLoadOptions,
    isFullReload?: boolean,
  ): OperationTypes {
    return calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload);
  }

  /**
   * @extended: virtual_scrolling, TreeLists's data_source_adapter, DataGrid's m_grouping
   */
  protected _customizeRemoteOperations(options, operationTypes) {
    let cachedStoreData = this._cachedStoreData;
    let cachedPagingData = this._cachedPagingData;
    let cachedData = this._cachedData;

    if ((options.storeLoadOptions.filter && !options.remoteOperations.filtering) || (options.storeLoadOptions.sort && !options.remoteOperations.sorting)) {
      options.remoteOperations = {
        filtering: options.remoteOperations.filtering,
        summary: options.remoteOperations.summary,
      };
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
        if (value && this._needCleanCacheByOperation(operationType, options.remoteOperations)) {
          cachedStoreData = undefined;
          cachedPagingData = undefined;
        }
      });
    }

    if (cachedPagingData) {
      options.remoteOperations.paging = false;
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
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      options.data = getPageDataFromCache(options, true) || options.cachedStoreData;
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

    const loadOptions = extend({ pageIndex: this.pageIndex(), pageSize: this.pageSize() }, options.storeLoadOptions);

    const operationTypes = this._calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload);

    this._customizeRemoteOperations(options, operationTypes);

    if (!options.isCustomLoading) {
      const isRefreshing = this._isRefreshing;

      options.pageIndex = dataSource.pageIndex();
      options.lastLoadOptions = loadOptions;
      options.operationTypes = operationTypes;
      this._loadingOperationTypes = operationTypes;
      this._isRefreshing = true;

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
        dataSource.cancel(options.operationId!);
      }).always(() => {
        this._isRefreshing = false;
      });

      dataSource.cancel(this._lastOperationId);
      this._lastOperationId = options.operationId;

      if (this._isRefreshing) {
        dataSource.cancel(this._lastOperationId);
      }
    }

    this._handleDataLoadingCore(options);
  }

  private _handleDataLoadingCore(options) {
    const { remoteOperations } = options;

    options.loadOptions = {};

    const cachedExtra = options.cachedData.extra;
    const localLoadOptionNames = {
      filter: !remoteOperations.filtering,
      sort: !remoteOperations.sorting,
      group: !remoteOperations.grouping,
      summary: !remoteOperations.summary,
      skip: !remoteOperations.paging,
      take: !remoteOperations.paging,
      requireTotalCount: cachedExtra && 'totalCount' in cachedExtra || !remoteOperations.paging,
      langParams: !remoteOperations.filtering || !remoteOperations.sorting,
    };

    each(options.storeLoadOptions, (optionName, optionValue) => {
      if (localLoadOptionNames[optionName]) {
        options.loadOptions[optionName] = optionValue;
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
  protected customizeLoadResultHandler(options) {
    const { loadOptions } = options;
    const localPaging = options.remoteOperations && !options.remoteOperations.paging;
    const { cachedData } = options;
    const { storeLoadOptions } = options;
    const needCache = this.option('cacheEnabled') !== false && storeLoadOptions;
    const needPageCache = needCache && !options.isCustomLoading && cachedData && (!localPaging || storeLoadOptions.group);
    const needPagingCache = needCache && localPaging;
    const needStoreCache = needPagingCache && !options.isCustomLoading;

    if (!loadOptions) {
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
      loadOptions.group = options.group || loadOptions.group;
    }

    const groupCount = gridCoreUtils.normalizeSortingInfo(options.group || storeLoadOptions.group || loadOptions.group).length;

    if (options.cachedDataPartBegin) {
      options.data = options.cachedDataPartBegin.concat(options.data);
    }

    if (options.cachedDataPartEnd) {
      options.data = options.data.concat(options.cachedDataPartEnd);
    }

    if (!needPageCache || !getPageDataFromCache(options)) {
      if (needPagingCache && options.cachedPagingData) {
        options.data = cloneItems(options.cachedPagingData, groupCount);
      } else {
        if (needStoreCache) {
          if (!this._cachedStoreData) {
            this.setCachedStoreData(cloneItems(options.data, gridCoreUtils.normalizeSortingInfo(storeLoadOptions.group).length));
          } else if (options.mergeStoreLoadData) {
            this.setCachedStoreData(this._cachedStoreData.concat(options.data));
            options.data = this._cachedStoreData;
          }
        }
        new ArrayStore(options.data).load(loadOptions).done((data) => {
          options.data = data;
          if (needStoreCache) {
            this._cachedPagingData = cloneItems(options.data, groupCount);
          }
        }).fail((error) => {
          // @ts-expect-error
          options.data = new Deferred().reject(error);
        });
      }

      if (loadOptions.requireTotalCount && localPaging) {
        options.extra = isPlainObject(options.extra) ? options.extra : {};
        options.extra.totalCount = options.data.length;
      }

      if (options.extra && options.extra.totalCount >= 0 && (storeLoadOptions.requireTotalCount === false || loadOptions.requireTotalCount === false)) {
        options.extra.totalCount = -1;
      }

      if (!loadOptions.data && (storeLoadOptions.requireTotalCount || (options.extra?.totalCount ?? -1) >= 0)) {
        this._totalCountCorrection = 0;
      }

      this.customizeLoadResultHandlerCore(options);

      if (needPageCache) {
        cachedData.extra = cachedData.extra || extend({}, options.extra);
        when(options.data).done((data) => {
          setPageDataToCache(options, data, groupCount);
        });
      }
    }

    when(options.data).done(() => {
      if (options.lastLoadOptions) {
        this._lastLoadOptions = options.lastLoadOptions;

        Object.keys(options.operationTypes).forEach((operationType) => {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          this._lastOperationTypes[operationType] ||= options.operationTypes[operationType];
        });
      }
    });
    options.storeLoadOptions = options.originalStoreLoadOptions;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected customizeLoadResultHandlerCore(options) {
    if (options.remoteOperations && !options.remoteOperations.paging && Array.isArray(options.data)) {
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
  protected _loadPageSize() {
    return this.pageSize();
  }

  /**
   * @extended: virtual_scrolling
   */
  // ChangedEvent
  protected dataChangedHandler(e?: ChangedEvent): void {
    let currentTotalCount;
    const dataSource = this._dataSource;
    let isLoading = false;

    // At this stage e.changeType can be defined only if virtual scrolling and scrolling.legacyMode is true
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

  private _scheduleCustomLoadCallbacks(deferred) {
    const that = this;

    that._isCustomLoading = true;
    deferred.always(() => {
      that._isCustomLoading = false;
    });
  }

  private loadingOperationTypes() {
    return this._loadingOperationTypes;
  }

  public operationTypes(): OperationTypes | undefined {
    return this._operationTypes;
  }

  private lastLoadOptions() {
    return this._lastLoadOptions || {};
  }

  private isLastPage() {
    return this._isLastPage;
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _dataSourceTotalCount() {
    return this._dataSource.totalCount();
  }

  /**
   * @extended: virtual_scrolling, TreeLists's data_source_adapter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _changeRowExpandCore(path?: any) {}

  /**
   * @extended: TreeLists's data_source_adapter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected changeRowExpand(path?: any): any {}

  private totalCount() {
    // eslint-disable-next-line radix
    return parseInt((this._currentTotalCount || this._dataSourceTotalCount()) + this._totalCountCorrection);
  }

  private totalCountCorrection() {
    return this._totalCountCorrection;
  }

  /**
   * @extended: virtual_scrolling
   * @protected
   */
  protected items(): any {}

  /**
   * @extended: virtual_scrolling
   */
  protected itemsCount() {
    return this._dataSource.items().length;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected totalItemsCount() {
    return this.totalCount();
  }

  protected pageSize(): number;
  protected pageSize(value: number): void;
  protected pageSize(value?: number): number | void {
    if (value === undefined) {
      return this._dataSource.paginate()
        ? this._dataSource.pageSize()
        : 0;
    }
    return this._dataSource.pageSize(value);
  }

  protected pageCount() {
    const that = this;
    const count = that.totalItemsCount() - that._totalCountCorrection;
    const pageSize = that.pageSize();

    if (pageSize && count > 0) {
      return Math.max(1, Math.ceil(count / pageSize));
    }
    return 1;
  }

  protected hasKnownLastPage() {
    return this._hasLastPage || this._dataSource.totalCount() >= 0;
  }

  protected loadFromStore(loadOptions, store?) {
    const dataSource = this._dataSource;
    // @ts-expect-error
    const d = new Deferred();

    if (!dataSource) return;

    store = store || dataSource.store();

    store.load(loadOptions).done((data, extra) => {
      if (data && !Array.isArray(data) && Array.isArray(data.data)) {
        extra = data;
        data = data.data;
      }
      d.resolve(data, extra);
    }).fail(d.reject);

    return d;
  }

  protected isCustomLoading() {
    return !!this._isCustomLoading;
  }

  /**
   * @extended: virtual_scrolling
   */
  protected load(options?): DeferredObj<unknown> {
    const that = this;
    const dataSource = that._dataSource;
    const d = Deferred();

    if (options) {
      const store = dataSource.store();
      const dataSourceLoadOptions = dataSource.loadOptions();
      const loadResult: any = {
        storeLoadOptions: extend({}, options, { langParams: dataSourceLoadOptions?.langParams }),
        isCustomLoading: true,
      };

      // @ts-expect-error badly typed Store type
      each(store._customLoadOptions() || [], (_, optionName) => {
        if (!(optionName in loadResult.storeLoadOptions)) {
          loadResult.storeLoadOptions[optionName] = dataSourceLoadOptions[optionName];
        }
      });

      this._isLoadingAll = options.isLoadingAll;

      that._scheduleCustomLoadCallbacks(d);
      dataSource._scheduleLoadCallbacks(d);

      that.customizeStoreLoadOptionsHandler(loadResult);
      executeTask(() => {
        if (!dataSource.store()) {
          d.reject('canceled');
          return;
        }

        when(loadResult.data || that.loadFromStore(loadResult.storeLoadOptions)).done((data, extra) => {
          loadResult.data = data;
          loadResult.extra = extra || {};
          that.customizeLoadResultHandler(loadResult);

          if (options.requireTotalCount && loadResult.extra.totalCount === undefined) {
            loadResult.extra.totalCount = store.totalCount(loadResult.storeLoadOptions);
          }
          // TODO map function??
          when(loadResult.data, loadResult.extra.totalCount).done((data, totalCount) => {
            loadResult.extra.totalCount = totalCount;
            d.resolve(data, loadResult.extra);
          }).fail((e) => { d.reject(e); });
        }).fail((e) => { d.reject(e); });
      }, that.option('loadingTimeout'));

      return d.fail(function () {
        that._eventsStrategy.fireEvent('loadError', arguments);
      }).always(() => {
        this._isLoadingAll = false;
      }).promise() as unknown as DeferredObj<unknown>;
    }
    return dataSource.load() as unknown as DeferredObj<unknown>;
  }

  /**
   * @extended: virtual_scrolling
   */
  protected reload(full: boolean): DeferredObj<unknown> {
    const result = full ? this._dataSource.reload() : this._dataSource.load();
    return result as unknown as DeferredObj<unknown>;
  }

  private getCachedStoreData() {
    return this._cachedStoreData;
  }

  /**
   * @exended: virtual_scrolling
   */
  public isLoaded(): any {}

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected pageIndex(pageIndex?) {}
}
