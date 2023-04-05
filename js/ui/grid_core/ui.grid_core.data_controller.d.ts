import DataSource, { DataSourceLike } from '../../data/data_source';
import { DataSourceAdapter, OperationTypes, RemoteOperations } from './ui.grid_core.data_source_adapter';
import { Store } from '../../data/index';

import { Controller, Controllers, OptionChangedArgs } from './ui.grid_core.modules';

type HandleDataChangedArguments = {
  changeType?: 'refresh' | 'update' | 'loadError';
  isDelayed?: boolean;
  isLiveUpdate?: boolean;
  error?: any;
};

type UserData = Record<string, unknown>;

type Item = {
  rowType: 'data' | 'group' | 'groupFooter';
  data: UserData;
  dataIndex?: number;
  values?: unknown[];
  visible?: boolean;
  isExpanded?: boolean;
  summaryCells?: unknown[];
  rowIndex?: number;
  cells?: unknown[];
  loadIndex?: number;
  key: unknown;
};

interface State {
  _items: Item[];
  _cachedProcessedItems: Item[] | null;
  _dataSource: DataSourceAdapter;
  _isPaging: boolean;
  _currentOperationTypes: OperationTypes | null;
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
  _adaptiveExpandedKey: any;
  _lastRenderingPageIndex: any;
  _isPagingByRendering: any;

  _columnsController: Controllers['columns'];
  _editingController: Controllers['editing'];
  _rowsScrollController: any;

  _columnsChangedHandler: DataController['_handleColumnsChanged'];
  _loadingChangedHandler: DataController['_handleLoadingChanged'];
  _loadErrorHandler: DataController['_handleLoadError'];
  _customizeStoreLoadOptionsHandler: DataController['_handleCustomizeStoreLoadOptions'];
  _changingHandler: DataController['_handleChanging'];
  _dataPushedHandler: DataController['_handleDataPushed'];
  _dataChangedHandler: DataController['_handleDataChanged'];
}

export interface DataController extends State, Controller {
  getDataSource(this: this): DataSource;

  dataSource(this: this): DataSourceAdapter;

  store(this: this): Store;

  setDataSource: (this: this, dataSource: DataSource | null) => void;

  _refreshDataSource: (this: this) => void;

  reset: (this: this) => void;

  _getPagingOptionValue: (this: this, optionName: string) => any;

  needToRefreshOnDataSourceChange: (this: this, args: OptionChangedArgs<'dataSource'>) => boolean;

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

  _processItems: (this: this, items: any, change: any) => any;

  _afterProcessItems: (this: this, items: Item[], change?: any) => any[];

  _processItem: (this: this, item: any, options: any) => any;

  _generateDataItem: (this: this, data: any, options: any) => Item;

  _processDataItem: (this: this, data: Item, options: any) => Item;

  keyOf: (this: this, obj: any) => any;

  generateDataValues: (this: this, data: UserData, columns: any[], isModified?: boolean) => any[];

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

  getRowIndexOffset: (this: this, byLoadedRows?: boolean) => number;

  isLoading: (this: this) => boolean;

  _updateItemsCore: (this: this, ...args: any) => any;

  _fireChanged: (this: this, ...args: any) => any;

  loadingOperationTypes: (this: this, ...args: any) => any;

  resetFilterApplying: (this: this) => void;

  filter: (this: this, ...args: any) => any;

  clearFilter: (this: this, ...args: any) => any;

  _fireDataSourceChanged: (this: this, ...args: any) => any;

  _createDataSourceAdapter: (this: this, dataSource: DataSource) => DataSourceAdapter;

  _createDataSourceAdapterCore: (this: this, dataSource: DataSource, remoteOperations: RemoteOperations) => DataSourceAdapter;

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

  _handleLoadingChanged: (this: this, args: any) => void;

  _handleLoadError: (this: this, args: any) => void;

  _handleCustomizeStoreLoadOptions: (this: this, args: any) => void;

  _handleChanging: (this: this, args: any) => void;

  _handleDataPushed: (this: this, args: any) => void;

  fireError: (this: this, error: string, ...args: unknown[]) => void;

  _handleDataSourceChange: (this: this, args: OptionChangedArgs<'dataSource'>) => boolean;

  _handleDataChanged: (this: this, e: HandleDataChangedArguments) => void;

  totalItemsCount: (this: this, ...args: any) => any;

  isLoaded: (this: this, ...args: any) => any;

  totalCount: (this: this) => number;

  adaptiveExpandedKey: (this: this, ...args: any) => any;

  toggleExpandAdaptiveDetailRow: (this: this, ...args: any) => any;

  _getRowIndicesForExpand: (this: this, ...args: any) => any;

  push: (this: this, ...args: any) => any;

  _updateEditRow: (this: this, ...args: any) => any;

  _updateEditItem: (this: this, ...args: any) => any;

  changeRowExpand: (this: this, ...args: any) => any;

  getMaxRowIndex: (this: this, ...args: any) => any;

  _correctRowIndices: (this: this, ...args: any) => any;

  virtualItemsCount: (this: this, ...args: any) => any;

  _getLastItemIndex: (this: this, ...args: any) => any;

  getPageIndexByKey: (this: this, ...args: any) => any;

  _updatePageIndexes: (this: this, ...args: any) => any;

  _updateFocusedRow: (this: this, ...args: any) => any;

  isPagingByRendering: (this: this, ...args: any) => any;

  getGlobalRowIndexByKey: (this: this, ...args: any) => any;

  _calculateGlobalRowIndexByGroupedData: (this: this, ...args: any) => any;

  _calculateGlobalRowIndexByFlatData: (this: this, ...args: any) => any;

  _generateFilterByKey: (this: this, ...args: any) => any;

  _concatWithCombinedFilter: (this: this, ...args: any) => any;

  _generateOperationFilterByKey: (this: this, ...args: any) => any;

  _generateBooleanFilter: (this: this, ...args: any) => any;
}
