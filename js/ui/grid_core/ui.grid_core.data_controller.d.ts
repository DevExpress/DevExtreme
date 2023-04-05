import DataSource, { DataSourceLike } from '../../data/data_source';
import Store from '../../data/abstract_store';

import { Controller, Controllers } from './ui.grid_core.modules';

type HandleDataChangedArguments = {
  changeType?: 'refresh' | 'update';
  isDelayed: boolean;
};

type Item = {
  rowType: 'data' | 'group' | 'groupFooter';
  data: any;
  key: any;
  values?: any[];
  isExpanded?: boolean;
  summaryCells?: any[];
};

interface State {
  _items: any[];
  _cachedProcessedItems: any[] | null;
  _dataSource: any;
  _isPaging: boolean;
  _currentOperationTypes: any;
  _dataChangedHandler: any;
  _isLoading: boolean;
  _isCustomLoading: boolean;
  _repaintChangesOnly: boolean | undefined;
  _changes: any[];
  _skipProcessingPagingChange: boolean | undefined;
  _useSortingGroupingFromColumns: boolean | undefined;
  _columnsUpdating: boolean | undefined;
  _needApplyFilter: boolean | undefined;
  _isDataSourceApplying: boolean | undefined;
  _isAllDataTypesDefined: boolean | undefined;
  _needUpdateDimensions: boolean | undefined;
  _isFilterApplying: boolean | undefined;
  _readyDeferred: any;
  _rowIndexOffset: number;
  _loadingText: string | undefined;
  _isSharedDataSource: boolean | undefined;
  dataErrorOccurred: any;
  pageChanged: any;
  pushed: any;
  changed: any;
  loadingChanged: any;
  dataSourceChanged: any;

  _columnsController: Controllers['columns'];
}

export interface DataController extends State, Controller {
  getDataSource(this: this): DataSource;
  dataSource(this: this): any;
  store(this: this): Store;

  setDataSource: (this: this, dataSource: DataSource | null) => void;
  _refreshDataSource: (this: this) => void;
  reset: (this: this) => void;
  _getPagingOptionValue: (this: this, optionName: string) => any;
  needToRefreshOnDataSourceChange: (this: this, args: any) => boolean;
  refresh: (this: this, ...args: any[]) => void;
  _setPagingOptions: (this: this, dataSource: any) => { isPaginateChanged: boolean; isPageSizeChanged: boolean; isPageIndexChanged: boolean } | false;
  isReady: (this: this) => boolean;
  getCombinedFilter: (this: this, returnDataField?: boolean) => any;
  combinedFilter: (this: this, filter: any, returnDataField?: boolean) => any;
  _calculateAdditionalFilter: (this: this) => any;
  waitReady: (this: this) => any;
  updateItems: (this: this, ...args: any[]) => void;
  _applyFilter: (this: this) => void;
  _getSpecificDataSourceOption: (this: this) => DataSourceLike<any> | null;
  _initDataSource: (this: this) => void;
  _loadDataSource: (this: this) => any;
  getRowIndexDelta: (this: this) => number;
  _beforeProcessItems: (this: this, items: any[]) => any[];
  _processItems: (this: this, items: any[], change: any) => any[];
  _afterProcessItems: (this: this, items: Item[], change?: any) => any[];
  _processItem: (this: this, item: any, options: any) => any;
  _generateDataItem: (this: this, data: any, options: any) => Item;
  _processDataItem: (this: this, data: Item, options: any) => Item;
  keyOf: (this: this, obj: any) => any;
  generateDataValues: (this: this, columns: any[], isModified: boolean) => any[];
  _applyChange: (this: this, change: any) => void;
  _applyChangeFull: (this: this, change: any) => void;
  _applyChangeUpdate: (this: this, change: any) => void;
  _applyChangesOnly: (this: this, change: any) => void;
  items: (this: this, ...args: any) => any;
  _getRowIndices: (this: this, change: any) => any[];
  _partialUpdateRow: (this: this, oldItem: any, newItem: any, visibleRowIndex: number, isLiveUpdate?: boolean) => any[];
  _getChangedColumnIndices: (this: this, oldItem: any, newItem: any, visibleRowIndex: number, isLiveUpdate?: boolean) => any[];
  _isCellChanged: (this: this, oldRow, newRow, visibleRowIndex: number, columnIndex: number, isLiveUpdate?: boolean) => boolean;
  _isItemEquals: (this: this, item1: Item, item2: Item) => boolean;
  _correctRowIndices: any;
  getRowIndexOffset: (this: this) => number;
  isLoading: (this: this) => boolean;
  _updateItemsCore: (this: this, ...args: any) => any;
  _fireChanged: (this: this, ...args: any) => any;
  loadingOperationTypes: (this: this, ...args: any) => any;
  resetFilterApplying: (this: this) => void;
  filter: (this: this, ...args: any) => any;
  clearFilter: (this: this, ...args: any) => any;
  _fireDataSourceChanged: (this: this, ...args: any) => any;
  _createDataSourceAdapter: (this: this, ...args: any) => any;
  _createDataSourceAdapterCore: (this: this, ...args: any) => any;
  _getDataSourceAdapter: (this: this, ...args: any) => any;
  isLocalStore: (this: this, ...args: any) => any;
  isCustomStore: (this: this, ...args: any) => any;
  getVisibleRows: (this: this, ...args: any) => any;
  searchByText: (this: this, ...args: any) => any;
  isEmpty: (this: this, ...args: any) => any;
  pageCount: (this: this, ...args: any) => any;
  _fireLoadingChanged: (this: this, ...args: any) => any;
  loadAll: (this: this, ...args: any) => any;
  getKeyByRowIndex: (this: this, ...args: any) => any;
  getRowIndexByKey: (this: this, ...args: any) => any;
  byKey: (this: this, ...args: any) => any;
  key: (this: this, ...args: any) => any;
  getDataByKeys: (this: this, ...args: any) => any;
  pageIndex: (this: this, ...args: any) => any;
  pageSize: (this: this, ...args: any) => any;
  beginCustomLoading: (this: this, ...args: any) => any;
  endCustomLoading: (this: this, ...args: any) => any;
  load: (this: this, ...args: any) => any;
  reload: (this: this, ...args: any) => any;
  _disposeDataSource: (this: this, ...args: any) => any;
  dispose: (this: this, ...args: any) => any;
  repaintRows: (this: this, ...args: any) => any;
  skipProcessingPagingChange: (this: this, ...args: any) => any;
  getUserState: (this: this, ...args: any) => any;
  getCachedStoreData: (this: this, ...args: any) => any;
  isLastPageLoaded: (this: this, ...args: any) => any;
  getDataIndex: (this: this, ...args: any) => any;

  _handleColumnsChanged: (this: this, args: any) => void;
  _columnsChangedHandler: this['_handleColumnsChanged'];
  _handleLoadingChanged: (this: this, args: any) => void;
  _loadingChangedHandler: this['_handleLoadingChanged'];
  _handleLoadError: (this: this, args: any) => void;
  _loadErrorHandler: this['_handleLoadError'];
  _handleCustomizeStoreLoadOptions: (this: this, args: any) => void;
  _customizeStoreLoadOptionsHandler: this['_handleCustomizeStoreLoadOptions'];
  _handleChanging: (this: this, args: any) => void;
  _changingHandler: this['_handleChanging'];
  _handleDataPushed: (this: this, args: any) => void;
  _dataPushedHandler: this['_handleDataPushed'];

  fireError: (this: this) => void;
  _handleDataSourceChange: (this: this, args: any) => boolean;
  _handleDataChanged: (this: this, e?: HandleDataChangedArguments) => void;
}
