import DataSource from '../../data/data_source';
import { LoadOptions as BaseLoadOptions } from '../../data';
import { Controller, InternalGridOptions } from './ui.grid_core.modules';
import { Callback } from '../../core/utils/callbacks';
import { HandleDataChangedArguments } from './ui.grid_core.data_controller';

type RemoteOperations = Exclude<InternalGridOptions['remoteOperations'], 'auto' | boolean | undefined>;

interface LoadOptions extends BaseLoadOptions {
  pageIndex?: number;
  pageSize?: number;
  groupExpand?: boolean;
}

interface OperationTypes {
  filtering?: boolean;
  fullReload?: boolean;
  groupExpanding?: boolean;
  grouping?: boolean;
  pageIndex?: boolean;
  pageSize?: boolean;
  paging?: boolean;
  reload?: boolean;
  skip?: boolean;
  sorting?: boolean;
  take?: boolean;
}

interface State {
  _cachedData: any;
  _cachedPagingData: any;
  _cachedStoreData: any;
  _currentTotalCount: any;
  _customLoadOptions: any;
  _dataIndexGetter: any;
  _dataSource: DataSource;
  _eventsStrategy: any;
  _hasLastPage: any;
  _isCustomLoading: any;
  _isLastPage: any;
  _isLoadingAll: any;
  _isRefreshed: any;
  _isRefreshing: any;
  _items: any;
  _lastLoadOptions: any;
  _lastOperationId: any;
  _lastOperationTypes: any;
  _loadingOperationTypes: any;
  _operationTypes: any;
  _optionCache: any;
  _remoteOperations: RemoteOperations;
  _scheduleLoadCallbacks: any;
  _totalCountCorrection: any;

  always: Callback;
  changed: Callback<[HandleDataChangedArguments]>;
  changing: Callback;
  customizeStoreLoadOptions: Callback;
  loadError: Callback;
  loadingChanged: Callback;
  pushed: Callback;

  _dataChangedHandler: DataSourceAdapter['_handleDataChanged'];
  _customizeStoreLoadOptionsHandler: DataSourceAdapter['_handleCustomizeStoreLoadOptions'];
  _dataLoadedHandler: DataSourceAdapter['_handleDataLoaded'];
  _loadingChangedHandler: DataSourceAdapter['_handleLoadingChanged'];
  _loadErrorHandler: DataSourceAdapter['_handleLoadError'];
  _pushHandler: DataSourceAdapter['_handlePush'];
  _changingHandler: DataSourceAdapter['_handleChanging'];
}

export interface DataSourceAdapter extends Omit<Controller, 'init' | 'dispose'>, Omit<DataSource, 'on' | 'off'>, State {
  init: (this: this, dataSource: DataSource, remoteOperations: RemoteOperations) => void;

  remoteOperations: (this: this) => RemoteOperations;

  dispose: (this: this, isSharedDataSource?: boolean) => void;

  refresh: (this: this, options, operationTypes) => any;

  resetCurrentTotalCount: (this: this) => any;

  resetCache: (this: this) => any;

  resetPagesCache: (this: this, isLiveUpdate?) => any;

  _needClearStoreDataCache: (this: this) => any;

  push: (this: this, changes, fromStore) => any;

  getDataIndexGetter: (this: this) => any;

  _getKeyInfo: (this: this) => any;

  _needToCopyDataObject: () => any;

  _applyBatch: (this: this, changes, fromStore?) => any;

  _handlePush: (this: this, { changes }) => any;

  _handleChanging: (this: this, e) => any;

  _needCleanCacheByOperation: (this: this, operationType, remoteOperations: RemoteOperations) => any;

  _customizeRemoteOperations: (this: this, options, operationTypes) => any;

  _handleCustomizeStoreLoadOptions: (this: this, options) => any;

  _handleDataLoading: (this: this, options) => any;

  _handleDataLoadingCore: (this: this, options) => any;

  _handleDataLoaded: (this: this, options) => any;

  _handleDataLoadedCore: (this: this, options) => any;

  _handleLoadingChanged: (this: this, isLoading) => any;

  _handleLoadError: (this: this, error) => any;

  _loadPageSize: (this: this) => any;

  _handleDataChanged: (this: this, args) => any;

  _scheduleCustomLoadCallbacks: (this: this, deferred) => any;

  loadingOperationTypes: (this: this) => any;

  operationTypes: (this: this) => OperationTypes;

  lastLoadOptions: (this: this) => any;

  isLastPage: (this: this) => any;

  _dataSourceTotalCount: (this: this) => any;

  totalCount: (this: this) => any;

  totalCountCorrection: (this: this) => any;

  itemsCount: (this: this) => any;

  totalItemsCount: (this: this) => any;

  pageSize: (this: this) => any;

  pageCount: (this: this) => number;

  hasKnownLastPage: (this: this) => any;

  loadFromStore: (this: this, loadOptions, store?) => any;

  isCustomLoading: (this: this) => any;

  load: (this: this, options?: any) => any;

  reload: (this: this, full?) => any;

  getCachedStoreData: (this: this) => any;

}
