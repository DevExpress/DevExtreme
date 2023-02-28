import { Controller } from '../ui.grid_core.modules';

interface State {
  _skipProcessingColumnsChange: boolean | undefined;
  _commandColumns: any[];
  _columns: any[];
  _isColumnsFromOptions: boolean;
  _columnsUserState: any;
  _dataSourceApplied: boolean;
  _dataSource: any;
  _ignoreColumnOptionNames: any;
  _dataSourceColumnsCount: any;
  _visibleColumns: any;
  _fixedColumns: any;
  _rowCount: any;
  _bandColumnsCache: any;
  _reinitAfterLookupChanges: any;
  _previousColumns: any;
  _hasUserState: any;
  __groupingUpdated: any;
  __sortingUpdated: any;
  columnsChanged: any;
}

export interface ColumnsController extends Controller, State {
  _getExpandColumnOptions: (this: this, ...args: any[]) => any;

  _getFirstItems: (this: this, ...args: any[]) => any;

  _endUpdateCore: (this: this, ...args: any[]) => any;

  init: (this: this, isApplyingUserState?: boolean) => any;

  getColumnByPath: (this: this, ...args: any[]) => any;

  _columnOptionChanged: (this: this, ...args: any[]) => any;

  _updateRequireResize: (this: this, ...args: any[]) => any;

  applyDataSource: (this: this, ...args: any[]) => any;

  reset: (this: this, ...args: any[]) => any;

  resetColumnsCache: (this: this, ...args: any[]) => any;

  reinit: (this: this, ...args: any[]) => any;

  isInitialized: (this: this, ...args: any[]) => any;

  isDataSourceApplied: (this: this, ...args: any[]) => any;

  getCommonSettings: (this: this, ...args: any[]) => any;

  isColumnOptionUsed: (this: this, ...args: any[]) => any;

  isAllDataTypesDefined: (this: this, ...args: any[]) => any;

  getColumns: (this: this, ...args: any[]) => any;

  isBandColumnsUsed: (this: this, ...args: any[]) => any;

  getGroupColumns: (this: this, ...args: any[]) => any;

  _shouldReturnVisibleColumns: (this: this, ...args: any[]) => any;

  _compileVisibleColumns: (this: this, ...args: any[]) => any;

  getVisibleColumns: (this: this, ...args: any[]) => any;

  getFixedColumns: (this: this, ...args: any[]) => any;

  getFilteringColumns: (this: this, ...args: any[]) => any;

  getColumnIndexOffset: (this: this, ...args: any[]) => any;

  _getFixedColumnsCore: (this: this, ...args: any[]) => any;

  _isColumnFixing: (this: this, ...args: any[]) => any;

  _getExpandColumnsCore: (this: this, ...args: any[]) => any;

  getExpandColumns: (this: this, ...args: any[]) => any;

  getBandColumnsCache: (this: this, ...args: any[]) => any;

  _isColumnVisible: (this: this, ...args: any[]) => any;

  _compileVisibleColumnsCore: (this: this, ...args: any[]) => any;

  getInvisibleColumns: (this: this, ...args: any[]) => any;

  getChooserColumns: (this: this, ...args: any[]) => any;

  allowMoveColumn: (this: this, ...args: any[]) => any;

  moveColumn: (this: this, ...args: any[]) => any;

  changeSortOrder: (this: this, ...args: any[]) => any;

  getSortDataSourceParameters: (this: this, ...args: any[]) => any;

  getGroupDataSourceParameters: (this: this, ...args: any[]) => any;

  refresh: (this: this, ...args: any[]) => any;

  _updateColumnOptions: (this: this, ...args: any[]) => any;

  updateColumnDataTypes: (this: this, ...args: any[]) => any;

  _customizeColumns: (this: this, ...args: any[]) => any;

  updateColumns: (this: this, ...args: any[]) => any;

  _updateChanges: (this: this, ...args: any[]) => any;

  updateSortingGrouping: (this: this, ...args: any[]) => any;

  updateFilter: (this: this, ...args: any[]) => any;

  columnCount: (this: this, ...args: any[]) => any;

  columnOption: (this: this, ...args: any[]) => any;

  clearSorting: (this: this, ...args: any[]) => any;

  clearGrouping: (this: this, ...args: any[]) => any;

  getVisibleIndex: (this: this, ...args: any[]) => any;

  getVisibleIndexByColumn: (this: this, ...args: any[]) => any;

  getVisibleColumnIndex: (this: this, ...args: any[]) => any;

  addColumn: (this: this, ...args: any[]) => any;

  deleteColumn: (this: this, ...args: any[]) => any;

  addCommandColumn: (this: this, ...args: any[]) => any;

  getUserState: (this: this, ...args: any[]) => any;

  setName: (this: this, ...args: any[]) => any;

  setUserState: (this: this, ...args: any[]) => any;

  _checkColumns: (this: this, ...args: any[]) => any;

  _createCalculatedColumnOptions: (this: this, ...args: any[]) => any;

  getRowCount: (this: this, ...args: any[]) => any;

  getRowIndex: (this: this, ...args: any[]) => any;

  getChildrenByBandColumn: (this: this, ...args: any[]) => any;

  isParentBandColumn: (this: this, ...args: any[]) => any;

  isParentColumnVisible: (this: this, ...args: any[]) => any;

  getColumnId: (this: this, ...args: any[]) => any;

  getHeaderContentAlignment: (this: this, ...args: any[]) => any;

  getCustomizeTextByDataType: (this: this, ...args: any[]) => any;
}
