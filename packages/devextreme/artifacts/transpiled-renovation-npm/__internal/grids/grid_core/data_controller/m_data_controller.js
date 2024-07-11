"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataControllerModule = exports.DataController = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _array_compare = require("../../../../core/utils/array_compare");
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _custom_store = _interopRequireDefault(require("../../../../data/custom_store"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_data_helper_mixin = require("./m_data_helper_mixin");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/method-signature-style */

const changePaging = function (that, optionName, value) {
  const dataSource = that._dataSource;
  if (dataSource) {
    if (value !== undefined) {
      const oldValue = that._getPagingOptionValue(optionName);
      if (oldValue !== value) {
        if (optionName === 'pageSize') {
          dataSource.pageIndex(0);
        }
        dataSource[optionName](value);
        that._skipProcessingPagingChange = true;
        that.option(`paging.${optionName}`, value);
        that._skipProcessingPagingChange = false;
        const pageIndex = dataSource.pageIndex();
        that._isPaging = optionName === 'pageIndex';
        return dataSource[optionName === 'pageIndex' ? 'load' : 'reload']().done(() => {
          that._isPaging = false;
          that.pageChanged.fire(pageIndex);
        });
      }
      return (0, _deferred.Deferred)().resolve().promise();
    }
    return dataSource[optionName]();
  }
  return 0;
};
class DataController extends (0, _m_data_helper_mixin.DataHelperMixin)(_m_modules.default.Controller) {
  init() {
    this._items = [];
    this._cachedProcessedItems = null;
    this._columnsController = this.getController('columns');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editingController = this.getController('editing');
    this._editorFactoryController = this.getController('editorFactory');
    this._errorHandlingController = this.getController('errorHandling');
    this._filterSyncController = this.getController('filterSync');
    this._applyFilterController = this.getController('applyFilter');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._focusController = this.getController('focus');
    this._headerFilterController = this.getController('headerFilter');
    this._selectionController = this.getController('selection');
    this._stateStoringController = this.getController('stateStoring');
    this._validatingController = this.getController('validating');
    this._isPaging = false;
    this._currentOperationTypes = null;
    this._dataChangedHandler = e => {
      this._currentOperationTypes = this._dataSource.operationTypes();
      this._handleDataChanged(e);
      this._currentOperationTypes = null;
    };
    this._columnsChangedHandler = this._handleColumnsChanged.bind(this);
    this._loadingChangedHandler = this._handleLoadingChanged.bind(this);
    this._loadErrorHandler = this._handleLoadError.bind(this);
    this._customizeStoreLoadOptionsHandler = this._handleCustomizeStoreLoadOptions.bind(this);
    this._changingHandler = this._handleChanging.bind(this);
    this._dataPushedHandler = this._handleDataPushed.bind(this);
    this._columnsController.columnsChanged.add(this._columnsChangedHandler);
    this._isLoading = false;
    this._isCustomLoading = false;
    this._repaintChangesOnly = undefined;
    this._changes = [];
    this.createAction('onDataErrorOccurred');
    this.dataErrorOccurred.add(error => this.executeAction('onDataErrorOccurred', {
      error
    }));
    this._refreshDataSource();
    this.postCtor();
  }
  /**
   * @extended: virtual_scrolling
   */
  _getPagingOptionValue(optionName) {
    return this._dataSource[optionName]();
  }
  callbackNames() {
    return ['changed', 'loadingChanged', 'dataErrorOccurred', 'pageChanged', 'dataSourceChanged', 'pushed'];
  }
  callbackFlags(name) {
    if (name === 'dataErrorOccurred') {
      return {
        stopOnFalse: true
      };
    }
    return undefined;
  }
  publicMethods() {
    return ['_disposeDataSource', 'beginCustomLoading', 'byKey', 'clearFilter', 'endCustomLoading', 'filter', 'getCombinedFilter', 'getDataByKeys', 'getDataSource', 'getKeyByRowIndex', 'getRowIndexByKey', 'getVisibleRows', 'keyOf', 'pageCount', 'pageIndex', 'pageSize', 'refresh', 'repaintRows', 'totalCount'];
  }
  /**
   * @extended: virtual_scrolling
   */
  reset() {
    this._columnsController.reset();
    this._items = [];
    this._refreshDataSource();
  }
  /**
   * @extended: editing
   */
  _handleDataSourceChange(args) {
    if (args.value === args.previousValue || this.option('columns') && Array.isArray(args.value) && Array.isArray(args.previousValue)) {
      const isValueChanged = args.value !== args.previousValue;
      if (isValueChanged) {
        const store = this.store();
        if (store) {
          store._array = args.value;
        }
      }
      if (this.needToRefreshOnDataSourceChange(args)) {
        this.refresh(this.option('repaintChangesOnly'));
      }
      return true;
    }
    return false;
  }
  /**
   * @extended: editing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  needToRefreshOnDataSourceChange(args) {
    return true;
  }
  optionChanged(args) {
    const that = this;
    let dataSource;
    let changedPagingOptions;
    function handled() {
      args.handled = true;
    }
    if (args.name === 'dataSource' && args.name === args.fullName && this._handleDataSourceChange(args)) {
      handled();
      return;
    }
    switch (args.name) {
      case 'cacheEnabled':
      case 'repaintChangesOnly':
      case 'highlightChanges':
      case 'loadingTimeout':
        handled();
        break;
      case 'remoteOperations':
      case 'keyExpr':
      case 'dataSource':
      case 'scrolling':
        handled();
        that.reset();
        break;
      case 'paging':
        dataSource = that.dataSource();
        if (dataSource) {
          changedPagingOptions = that._setPagingOptions(dataSource);
          if (changedPagingOptions) {
            const pageIndex = dataSource.pageIndex();
            this._isPaging = changedPagingOptions.isPageIndexChanged;
            dataSource.load().done(() => {
              this._isPaging = false;
              that.pageChanged.fire(pageIndex);
            });
          }
        }
        handled();
        break;
      case 'rtlEnabled':
        that.reset();
        break;
      case 'columns':
        dataSource = that.dataSource();
        if (dataSource && dataSource.isLoading() && args.name === args.fullName) {
          this._useSortingGroupingFromColumns = true;
          dataSource.load();
        }
        break;
      default:
        super.optionChanged(args);
    }
  }
  isReady() {
    return !this._isLoading;
  }
  getDataSource() {
    return this._dataSource && this._dataSource._dataSource;
  }
  getCombinedFilter(returnDataField) {
    return this.combinedFilter(undefined, returnDataField);
  }
  combinedFilter(filter, returnDataField) {
    if (!this._dataSource) {
      return filter;
    }
    let combined = filter ?? this._dataSource.filter();
    const isColumnsTypesDefined = this._columnsController.isDataSourceApplied() || this._columnsController.isAllDataTypesDefined();
    if (isColumnsTypesDefined) {
      const additionalFilter = this._calculateAdditionalFilter();
      combined = additionalFilter ? _m_utils.default.combineFilters([additionalFilter, combined]) : combined;
    }
    const isRemoteFiltering = this._dataSource.remoteOperations().filtering || returnDataField;
    combined = this._columnsController.updateFilter(combined, isRemoteFiltering);
    return combined;
  }
  waitReady() {
    if (this._updateLockCount) {
      // @ts-expect-error
      this._readyDeferred = new _deferred.Deferred();
      return this._readyDeferred;
    }
    return (0, _deferred.when)();
  }
  /**
   * @extended: selection
   * @protected
   */
  _endUpdateCore() {
    const changes = this._changes;
    if (changes.length) {
      this._changes = [];
      const repaintChangesOnly = changes.every(change => change.repaintChangesOnly);
      this.updateItems(changes.length === 1 ? changes[0] : {
        repaintChangesOnly
      });
    }
    if (this._readyDeferred) {
      this._readyDeferred.resolve();
      this._readyDeferred = null;
    }
  }
  // Handlers
  _handleCustomizeStoreLoadOptions(e) {
    var _storeLoadOptions$fil;
    const columnsController = this._columnsController;
    const dataSource = this._dataSource;
    const {
      storeLoadOptions
    } = e;
    if (e.isCustomLoading && !storeLoadOptions.isLoadingAll) {
      return;
    }
    storeLoadOptions.filter = this.combinedFilter(storeLoadOptions.filter);
    if (((_storeLoadOptions$fil = storeLoadOptions.filter) === null || _storeLoadOptions$fil === void 0 ? void 0 : _storeLoadOptions$fil.length) === 1 && storeLoadOptions.filter[0] === '!') {
      e.data = [];
      e.extra = e.extra || {};
      e.extra.totalCount = 0;
    }
    if (!columnsController.isDataSourceApplied()) {
      columnsController.updateColumnDataTypes(dataSource);
    }
    this._columnsUpdating = true;
    columnsController.updateSortingGrouping(dataSource, !this._useSortingGroupingFromColumns);
    this._columnsUpdating = false;
    storeLoadOptions.sort = columnsController.getSortDataSourceParameters();
    storeLoadOptions.group = columnsController.getGroupDataSourceParameters();
    dataSource.sort(storeLoadOptions.sort);
    dataSource.group(storeLoadOptions.group);
    storeLoadOptions.sort = columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().sorting);
    e.group = columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().grouping);
  }
  _handleColumnsChanged(e) {
    const that = this;
    const {
      changeTypes
    } = e;
    const {
      optionNames
    } = e;
    let filterValue;
    let filterValues;
    let filterApplied;
    // B255430
    const updateItemsHandler = function (change) {
      var _change$changeTypes;
      that._columnsController.columnsChanged.remove(updateItemsHandler);
      that.updateItems({
        repaintChangesOnly: false,
        virtualColumnsScrolling: change === null || change === void 0 || (_change$changeTypes = change.changeTypes) === null || _change$changeTypes === void 0 ? void 0 : _change$changeTypes.virtualColumnsScrolling
      });
    };
    if (changeTypes.sorting || changeTypes.grouping) {
      if (that._dataSource && !that._columnsUpdating) {
        that._dataSource.group(that._columnsController.getGroupDataSourceParameters());
        that._dataSource.sort(that._columnsController.getSortDataSourceParameters());
        that.reload();
      }
    } else if (changeTypes.columns) {
      filterValues = that._columnsController.columnOption(e.columnIndex, 'filterValues');
      if (optionNames.filterValues || optionNames.filterType && Array.isArray(filterValues) || optionNames.filterValue || optionNames.selectedFilterOperation || optionNames.allowFiltering) {
        filterValue = that._columnsController.columnOption(e.columnIndex, 'filterValue');
        if (Array.isArray(filterValues) || e.columnIndex === undefined || (0, _type.isDefined)(filterValue) || !optionNames.selectedFilterOperation || optionNames.filterValue) {
          that._applyFilter();
          filterApplied = true;
        }
      }
      if (!that._needApplyFilter && !_m_utils.default.checkChanges(optionNames, ['width', 'visibleWidth', 'filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'filterValues', 'filterType'])) {
        // TODO remove resubscribing
        that._columnsController.columnsChanged.add(updateItemsHandler);
      }
      if ((0, _type.isDefined)(optionNames.visible)) {
        const column = that._columnsController.columnOption(e.columnIndex);
        if (column && ((0, _type.isDefined)(column.filterValue) || (0, _type.isDefined)(column.filterValues))) {
          that._applyFilter();
          filterApplied = true;
        }
      }
    }
    if (!filterApplied && changeTypes.filtering && !this._needApplyFilter) {
      that.reload();
    }
  }
  /**
   * @extended: selection
   */
  _handleDataChanged(e) {
    const that = this;
    const dataSource = that._dataSource;
    const columnsController = that._columnsController;
    let isAsyncDataSourceApplying = false;
    this._useSortingGroupingFromColumns = false;
    if (dataSource && !that._isDataSourceApplying) {
      that._isDataSourceApplying = true;
      (0, _deferred.when)(that._columnsController.applyDataSource(dataSource)).done(() => {
        if (that._isLoading) {
          that._handleLoadingChanged(false);
        }
        if (isAsyncDataSourceApplying && e && e.isDelayed) {
          e.isDelayed = false;
        }
        that._isDataSourceApplying = false;
        const hasAdditionalFilter = () => {
          const additionalFilter = that._calculateAdditionalFilter();
          return additionalFilter && additionalFilter.length;
        };
        const needApplyFilter = that._needApplyFilter;
        that._needApplyFilter = false;
        if (needApplyFilter && !that._isAllDataTypesDefined && hasAdditionalFilter()) {
          _ui.default.log('W1005', that.component.NAME);
          that._applyFilter();
        } else {
          that.updateItems(e, true);
        }
      }).fail(() => {
        that._isDataSourceApplying = false;
      });
      if (that._isDataSourceApplying) {
        isAsyncDataSourceApplying = true;
        that._handleLoadingChanged(true);
      }
      that._needApplyFilter = !that._columnsController.isDataSourceApplied();
      that._isAllDataTypesDefined = columnsController.isAllDataTypesDefined();
    }
  }
  _handleLoadingChanged(isLoading) {
    this._isLoading = isLoading;
    this._fireLoadingChanged();
  }
  /**
   * @extended: state_storing
   */
  _handleLoadError(e) {
    this.dataErrorOccurred.fire(e);
  }
  _handleDataPushed(changes) {
    this.pushed.fire(changes);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fireError() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.dataErrorOccurred.fire(_ui.default.Error.apply(_ui.default, args));
  }
  _setPagingOptions(dataSource) {
    const pageIndex = this.option('paging.pageIndex');
    const pageSize = this.option('paging.pageSize');
    const pagingEnabled = this.option('paging.enabled');
    const scrollingMode = this.option('scrolling.mode');
    const appendMode = scrollingMode === 'infinite';
    const virtualMode = scrollingMode === 'virtual';
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const paginate = pagingEnabled || virtualMode || appendMode;
    let isPaginateChanged = false;
    let isPageSizeChanged = false;
    let isPageIndexChanged = false;
    dataSource.requireTotalCount(!appendMode);
    if (pagingEnabled !== undefined && dataSource.paginate() !== paginate) {
      dataSource.paginate(paginate);
      isPaginateChanged = true;
    }
    if (pageSize !== undefined && dataSource.pageSize() !== pageSize) {
      dataSource.pageSize(pageSize);
      isPageSizeChanged = true;
    }
    if (pageIndex !== undefined && dataSource.pageIndex() !== pageIndex) {
      dataSource.pageIndex(pageIndex);
      isPageIndexChanged = true;
    }
    if (isPaginateChanged || isPageSizeChanged || isPageIndexChanged) {
      return {
        isPaginateChanged,
        isPageSizeChanged,
        isPageIndexChanged
      };
    }
    return false;
  }
  _getSpecificDataSourceOption() {
    const dataSource = this.option('dataSource');
    if (Array.isArray(dataSource)) {
      return {
        store: {
          type: 'array',
          data: dataSource,
          key: this.option('keyExpr')
        }
      };
    }
    return dataSource;
  }
  _initDataSource() {
    const that = this;
    const oldDataSource = this._dataSource;
    super._initDataSource();
    const dataSource = that._dataSource;
    that._useSortingGroupingFromColumns = true;
    that._cachedProcessedItems = null;
    if (dataSource) {
      const changedPagingOptions = that._setPagingOptions(dataSource);
      this._isPaging = changedPagingOptions === null || changedPagingOptions === void 0 ? void 0 : changedPagingOptions.isPageIndexChanged;
      that.setDataSource(dataSource);
    } else if (oldDataSource) {
      that.updateItems();
    }
  }
  /**
   * @extended: selection, virtual_scrolling
   */
  _loadDataSource() {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const result = new _deferred.Deferred();
    (0, _deferred.when)(this._columnsController.refresh(true)).always(() => {
      if (dataSource) {
        dataSource.load().done(function () {
          that._isPaging = false;
          result.resolve.apply(result, arguments);
        }).fail(result.reject);
      } else {
        result.resolve();
      }
    });
    return result.promise();
  }
  /**
   * @extended: DataGrid's grouping
   */
  _beforeProcessItems(items) {
    return items.slice(0);
  }
  /**
   * @extended: virtual_scrolling
   */
  getRowIndexDelta() {
    return 0;
  }
  /**
   * @extended: virtual_scrolling
   */
  getDataIndex(change) {
    const visibleItems = this._items;
    const lastVisibleItem = change.changeType === 'append' && visibleItems.length > 0 ? visibleItems[visibleItems.length - 1] : null;
    return (0, _type.isDefined)(lastVisibleItem === null || lastVisibleItem === void 0 ? void 0 : lastVisibleItem.dataIndex) ? lastVisibleItem.dataIndex + 1 : 0;
  }
  /**
   * @extended: adaptivity, master_detail, virtual_scrolling
   */
  _processItems(items, change) {
    const that = this;
    const rowIndexDelta = that.getRowIndexDelta();
    const {
      changeType
    } = change;
    const visibleColumns = that._columnsController.getVisibleColumns(null, changeType === 'loadingAll');
    const dataIndex = this.getDataIndex(change);
    const options = {
      visibleColumns,
      dataIndex
    };
    const result = [];
    (0, _iterator.each)(items, (index, item) => {
      if ((0, _type.isDefined)(item)) {
        // @ts-expect-error
        options.rowIndex = index - rowIndexDelta;
        item = that._processItem(item, options);
        result.push(item);
      }
    });
    return result;
  }
  /**
   * @extended: editing
   */
  _processItem(item, options) {
    item = this._generateDataItem(item, options);
    item = this._processDataItem(item, options);
    item.dataIndex = options.dataIndex++;
    return item;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _generateDataItem(data, options) {
    return {
      rowType: 'data',
      data,
      key: this.keyOf(data)
    };
  }
  /**
   * @extended: selection, editing, master_detail, TreeList's master_detail
   */
  _processDataItem(dataItem, options) {
    dataItem.values = this.generateDataValues(dataItem.data, options.visibleColumns);
    return dataItem;
  }
  generateDataValues(data, columns, isModified) {
    const values = [];
    let value;
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      value = isModified ? undefined : null;
      if (!column.command) {
        if (column.calculateCellValue) {
          value = column.calculateCellValue(data);
        } else if (column.dataField) {
          value = data[column.dataField];
        }
      }
      values.push(value);
    }
    return values;
  }
  /**
   * @extende: virtual_scrolling, focus, selection
   */
  _applyChange(change) {
    const that = this;
    if (change.changeType === 'update') {
      that._applyChangeUpdate(change);
    } else if (that.items().length && change.repaintChangesOnly && change.changeType === 'refresh') {
      that._applyChangesOnly(change);
    } else if (change.changeType === 'refresh') {
      that._applyChangeFull(change);
    }
  }
  _applyChangeFull(change) {
    this._items = change.items.slice(0);
  }
  _getRowIndices(change) {
    const rowIndices = change.rowIndices.slice(0);
    const rowIndexDelta = this.getRowIndexDelta();
    rowIndices.sort((a, b) => a - b);
    for (let i = 0; i < rowIndices.length; i++) {
      let correctedRowIndex = rowIndices[i];
      if (change.allowInvisibleRowIndices) {
        correctedRowIndex += rowIndexDelta;
      }
      if (correctedRowIndex < 0) {
        rowIndices.splice(i, 1);
        i--;
      }
    }
    return rowIndices;
  }
  /**
   * @extended: editing
   */
  _applyChangeUpdate(change) {
    const that = this;
    const {
      items
    } = change;
    const rowIndices = that._getRowIndices(change);
    const rowIndexDelta = that.getRowIndexDelta();
    const repaintChangesOnly = that.option('repaintChangesOnly');
    let prevIndex = -1;
    let rowIndexCorrection = 0;
    let changeType;
    change.items = [];
    change.rowIndices = [];
    change.columnIndices = [];
    change.changeTypes = [];
    const equalItems = function (item1, item2, strict) {
      let result = item1 && item2 && (0, _common.equalByValue)(item1.key, item2.key);
      if (result && strict) {
        result = item1.rowType === item2.rowType && (item2.rowType !== 'detail' || item1.isEditing === item2.isEditing);
      }
      return result;
    };
    (0, _iterator.each)(rowIndices, (index, rowIndex) => {
      let columnIndices;
      rowIndex += rowIndexCorrection + rowIndexDelta;
      if (prevIndex === rowIndex) return;
      prevIndex = rowIndex;
      const oldItem = that._items[rowIndex];
      const oldNextItem = that._items[rowIndex + 1];
      const newItem = items[rowIndex];
      const newNextItem = items[rowIndex + 1];
      const strict = equalItems(oldItem, oldNextItem) || equalItems(newItem, newNextItem);
      if (newItem) {
        newItem.rowIndex = rowIndex;
        change.items.push(newItem);
      }
      if (oldItem && newItem && equalItems(oldItem, newItem, strict)) {
        changeType = 'update';
        that._items[rowIndex] = newItem;
        if (oldItem.visible !== newItem.visible) {
          change.items.splice(-1, 1, {
            visible: newItem.visible
          });
        } else if (repaintChangesOnly && !change.isFullUpdate) {
          columnIndices = that._partialUpdateRow(oldItem, newItem, rowIndex - rowIndexDelta);
        }
      } else if (newItem && !oldItem || newNextItem && equalItems(oldItem, newNextItem, strict)) {
        changeType = 'insert';
        that._items.splice(rowIndex, 0, newItem);
        rowIndexCorrection++;
      } else if (oldItem && !newItem || oldNextItem && equalItems(newItem, oldNextItem, strict)) {
        changeType = 'remove';
        that._items.splice(rowIndex, 1);
        rowIndexCorrection--;
        prevIndex = -1;
      } else if (newItem) {
        changeType = 'update';
        that._items[rowIndex] = newItem;
      } else {
        return;
      }
      change.rowIndices.push(rowIndex - rowIndexDelta);
      change.changeTypes.push(changeType);
      change.columnIndices.push(columnIndices);
    });
  }
  /**
   * @extended: editing, validating
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    if (JSON.stringify(oldRow.values[columnIndex]) !== JSON.stringify(newRow.values[columnIndex])) {
      return true;
    }
    function isCellModified(row, columnIndex) {
      return row.modifiedValues ? row.modifiedValues[columnIndex] !== undefined : false;
    }
    if (isCellModified(oldRow, columnIndex) !== isCellModified(newRow, columnIndex)) {
      return true;
    }
    return false;
  }
  /**
   * @extended: editing_row_based, editing, editing_form_based
   */
  _getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    let columnIndices;
    if (oldItem.rowType === newItem.rowType) {
      if (newItem.rowType !== 'group' && newItem.rowType !== 'groupFooter') {
        columnIndices = [];
        if (newItem.rowType !== 'detail') {
          for (let columnIndex = 0; columnIndex < oldItem.values.length; columnIndex++) {
            if (this._isCellChanged(oldItem, newItem, visibleRowIndex, columnIndex, isLiveUpdate)) {
              columnIndices.push(columnIndex);
            }
          }
        }
      }
      if (newItem.rowType === 'group' && oldItem.cells) {
        const isRowStateEquals = newItem.isExpanded === oldItem.isExpanded && newItem.data.isContinuation === oldItem.data.isContinuation && newItem.data.isContinuationOnNextPage === oldItem.data.isContinuationOnNextPage;
        if (isRowStateEquals) {
          columnIndices = oldItem.cells.map((cell, index) => {
            var _cell$column;
            return ((_cell$column = cell.column) === null || _cell$column === void 0 ? void 0 : _cell$column.type) !== 'groupExpand' ? index : -1;
          }).filter(index => index >= 0);
        }
      }
    }
    return columnIndices;
  }
  _partialUpdateRow(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    var _changedColumnIndices;
    let changedColumnIndices = this._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
    if ((_changedColumnIndices = changedColumnIndices) !== null && _changedColumnIndices !== void 0 && _changedColumnIndices.length && this.option('dataRowTemplate')) {
      changedColumnIndices = undefined;
    }
    if (changedColumnIndices) {
      oldItem.cells && oldItem.cells.forEach((cell, columnIndex) => {
        const isCellChanged = changedColumnIndices.indexOf(columnIndex) >= 0;
        if (!isCellChanged && cell && cell.update) {
          cell.update(newItem);
        }
      });
      newItem.update = oldItem.update;
      newItem.watch = oldItem.watch;
      newItem.cells = oldItem.cells;
      if (isLiveUpdate) {
        newItem.oldValues = oldItem.values;
      }
      oldItem.update && oldItem.update(newItem);
    }
    return changedColumnIndices;
  }
  _isItemEquals(item1, item2) {
    if (JSON.stringify(item1.values) !== JSON.stringify(item2.values)) {
      return false;
    }
    const compareFields = ['modified', 'isNewRow', 'removed', 'isEditing'];
    if (compareFields.some(field => item1[field] !== item2[field])) {
      return false;
    }
    if (item1.rowType === 'group' || item1.rowType === 'groupFooter') {
      var _item1$data, _item2$data, _item1$data2, _item2$data2;
      const expandedMatch = item1.isExpanded === item2.isExpanded;
      const summaryCellsMatch = JSON.stringify(item1.summaryCells) === JSON.stringify(item2.summaryCells);
      const continuationMatch = ((_item1$data = item1.data) === null || _item1$data === void 0 ? void 0 : _item1$data.isContinuation) === ((_item2$data = item2.data) === null || _item2$data === void 0 ? void 0 : _item2$data.isContinuation) && ((_item1$data2 = item1.data) === null || _item1$data2 === void 0 ? void 0 : _item1$data2.isContinuationOnNextPage) === ((_item2$data2 = item2.data) === null || _item2$data2 === void 0 ? void 0 : _item2$data2.isContinuationOnNextPage);
      if (!expandedMatch || !summaryCellsMatch || !continuationMatch) {
        return false;
      }
    }
    return true;
  }
  /**
   * @extended: editing
   */
  _applyChangesOnly(change) {
    const rowIndices = [];
    const columnIndices = [];
    const changeTypes = [];
    const items = [];
    const newIndexByKey = {};
    const isLiveUpdate = (change === null || change === void 0 ? void 0 : change.isLiveUpdate) ?? true;
    function getRowKey(row) {
      if (row) {
        return `${row.rowType},${JSON.stringify(row.key)}`;
      }
      return undefined;
    }
    const isItemEquals = (item1, item2) => {
      if (!this._isItemEquals(item1, item2)) {
        return false;
      }
      if (item1.cells) {
        item1.update && item1.update(item2);
        item1.cells.forEach(cell => {
          if (cell && cell.update) {
            cell.update(item2, true);
          }
        });
      }
      return true;
    };
    const currentItems = this._items;
    const oldItems = currentItems.slice();
    change.items.forEach((item, index) => {
      const key = getRowKey(item);
      newIndexByKey[key] = index;
      item.rowIndex = index;
    });
    const result = (0, _array_compare.findChanges)(oldItems, change.items, getRowKey, isItemEquals);
    if (!result) {
      this._applyChangeFull(change);
      return;
    }
    result.forEach(change => {
      switch (change.type) {
        case 'update':
          {
            const {
              index
            } = change;
            const newItem = change.data;
            const {
              oldItem
            } = change;
            const changedColumnIndices = this._partialUpdateRow(oldItem, newItem, index, isLiveUpdate);
            rowIndices.push(index);
            changeTypes.push('update');
            items.push(newItem);
            currentItems[index] = newItem;
            columnIndices.push(changedColumnIndices);
            break;
          }
        case 'insert':
          rowIndices.push(change.index);
          changeTypes.push('insert');
          items.push(change.data);
          columnIndices.push(undefined);
          currentItems.splice(change.index, 0, change.data);
          break;
        case 'remove':
          rowIndices.push(change.index);
          changeTypes.push('remove');
          currentItems.splice(change.index, 1);
          items.push(change.oldItem);
          columnIndices.push(undefined);
          break;
        default:
          break;
      }
    });
    change.repaintChangesOnly = true;
    change.changeType = 'update';
    change.rowIndices = rowIndices;
    change.columnIndices = columnIndices;
    change.changeTypes = changeTypes;
    change.items = items;
    if (oldItems.length) {
      change.isLiveUpdate = true;
    }
    this._correctRowIndices(rowIndex => {
      const oldRowIndexOffset = this._rowIndexOffset || 0;
      const rowIndexOffset = this.getRowIndexOffset();
      const oldItem = oldItems[rowIndex - oldRowIndexOffset];
      const key = getRowKey(oldItem);
      const newVisibleRowIndex = newIndexByKey[key];
      return newVisibleRowIndex >= 0 ? newVisibleRowIndex + rowIndexOffset - rowIndex : 0;
    });
  }
  /**
   * @extended: keyboard_navigation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _correctRowIndices(rowIndex) {}
  /**
   * @extend: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _afterProcessItems(items, change) {
    return items;
  }
  /**
   * @extende: virtual_scrolling, editing
   */
  _updateItemsCore(change) {
    let items;
    const dataSource = this._dataSource;
    const changeType = change.changeType || 'refresh';
    change.changeType = changeType;
    if (dataSource) {
      const cachedProcessedItems = this._cachedProcessedItems;
      if (change.useProcessedItemsCache && cachedProcessedItems) {
        items = cachedProcessedItems;
      } else {
        items = change.items || dataSource.items();
        items = this._beforeProcessItems(items);
        items = this._processItems(items, change);
        this._cachedProcessedItems = items;
      }
      items = this._afterProcessItems(items, change);
      change.items = items;
      const oldItems = this._items.length === items.length && this._items;
      this._applyChange(change);
      const rowIndexDelta = this.getRowIndexDelta();
      (0, _iterator.each)(this._items, (index, item) => {
        item.rowIndex = index - rowIndexDelta;
        if (oldItems) {
          item.cells = oldItems[index].cells ?? [];
        }
        const newItem = items[index];
        if (newItem) {
          item.loadIndex = newItem.loadIndex;
        }
      });
      this._rowIndexOffset = this.getRowIndexOffset();
    } else {
      this._items = [];
    }
  }
  _handleChanging(e) {
    const that = this;
    const rows = that.getVisibleRows();
    const dataSource = that.dataSource();
    if (dataSource) {
      e.changes.forEach(change => {
        if (change.type === 'insert' && change.index >= 0) {
          let dataIndex = 0;
          for (let i = 0; i < change.index; i++) {
            const row = rows[i];
            if (row && (row.rowType === 'data' || row.rowType === 'group')) {
              dataIndex++;
            }
          }
          change.index = dataIndex;
        }
      });
    }
  }
  updateItems(change, isDataChanged) {
    change = change || {};
    const that = this;
    if (that._repaintChangesOnly !== undefined) {
      change.repaintChangesOnly = change.repaintChangesOnly ?? that._repaintChangesOnly;
      change.needUpdateDimensions = change.needUpdateDimensions || that._needUpdateDimensions;
    } else if (change.changes) {
      change.repaintChangesOnly = that.option('repaintChangesOnly');
    } else if (isDataChanged) {
      const operationTypes = that.dataSource().operationTypes();
      change.repaintChangesOnly = operationTypes && !operationTypes.grouping && !operationTypes.filtering && that.option('repaintChangesOnly');
      change.isDataChanged = true;
      if (operationTypes && (operationTypes.reload || operationTypes.paging || operationTypes.groupExpanding)) {
        change.needUpdateDimensions = true;
      }
    }
    if (that._updateLockCount && !change.cancel) {
      that._changes.push(change);
      return;
    }
    that._updateItemsCore(change);
    if (change.cancel) return;
    that._fireChanged(change);
  }
  loadingOperationTypes() {
    const dataSource = this.dataSource();
    return dataSource && dataSource.loadingOperationTypes() || {};
  }
  /**
   * @extended: virtual_scrolling, focus
   */
  _fireChanged(change) {
    if (this._currentOperationTypes) {
      change.operationTypes = this._currentOperationTypes;
      this._currentOperationTypes = null;
    }
    (0, _common.deferRender)(() => {
      this.changed.fire(change);
    });
  }
  /**
   * @extended: state_storing
   */
  isLoading() {
    return this._isLoading || this._isCustomLoading;
  }
  _fireLoadingChanged() {
    this.loadingChanged.fire(this.isLoading(), this._loadingText);
  }
  /**
   * @extended: filter_row, filter_sync, header_filter, search
   */
  _calculateAdditionalFilter() {
    return null;
  }
  /**
   * @extended: filter_sync, virtual_scrolling
   */
  _applyFilter() {
    const dataSource = this._dataSource;
    if (dataSource) {
      dataSource.pageIndex(0);
      this._isFilterApplying = true;
      return this.reload().done(() => {
        if (this._isFilterApplying) {
          this.pageChanged.fire();
        }
      });
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  }
  resetFilterApplying() {
    this._isFilterApplying = false;
  }
  filter(filterExpr) {
    const dataSource = this._dataSource;
    const filter = dataSource && dataSource.filter();
    if (arguments.length === 0) {
      return filter;
    }
    filterExpr = arguments.length > 1 ? Array.prototype.slice.call(arguments, 0) : filterExpr;
    if (_m_utils.default.equalFilterParameters(filter, filterExpr)) {
      return;
    }
    if (dataSource) {
      dataSource.filter(filterExpr);
    }
    this._applyFilter();
  }
  /**
   * @extended: filter_sync
   */
  clearFilter(filterName) {
    const that = this;
    const columnsController = that._columnsController;
    const clearColumnOption = function (optionName) {
      const columnCount = columnsController.columnCount();
      for (let index = 0; index < columnCount; index++) {
        columnsController.columnOption(index, optionName, undefined);
      }
    };
    that.component.beginUpdate();
    if (arguments.length > 0) {
      switch (filterName) {
        case 'dataSource':
          that.filter(null);
          break;
        case 'search':
          // @ts-expect-error
          that.searchByText('');
          break;
        case 'header':
          clearColumnOption('filterValues');
          break;
        case 'row':
          clearColumnOption('filterValue');
          break;
        default:
          break;
      }
    } else {
      that.filter(null);
      // @ts-expect-error
      that.searchByText('');
      clearColumnOption('filterValue');
      clearColumnOption('bufferedFilterValue');
      clearColumnOption('filterValues');
    }
    that.component.endUpdate();
  }
  _fireDataSourceChanged() {
    const that = this;
    const changedHandler = function () {
      that.changed.remove(changedHandler);
      that.dataSourceChanged.fire();
    };
    that.changed.add(changedHandler);
  }
  _getDataSourceAdapter() {}
  /**
   * @extended: DataGrid's summary
   */
  _createDataSourceAdapterCore(dataSource, remoteOperations) {
    const dataSourceAdapterProvider = this._getDataSourceAdapter();
    const dataSourceAdapter = dataSourceAdapterProvider.create(this.component);
    dataSourceAdapter.init(dataSource, remoteOperations);
    return dataSourceAdapter;
  }
  isLocalStore() {
    let store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.store();
    return store instanceof _array_store.default;
  }
  isCustomStore(store) {
    store = store || this.store();
    return store instanceof _custom_store.default;
  }
  _createDataSourceAdapter(dataSource) {
    let remoteOperations = this.option('remoteOperations');
    const store = dataSource.store();
    const enabledRemoteOperations = {
      filtering: true,
      sorting: true,
      paging: true,
      grouping: true,
      summary: true
    };
    // @ts-expect-error
    if ((0, _type.isObject)(remoteOperations) && remoteOperations.groupPaging) {
      remoteOperations = (0, _extend.extend)({}, enabledRemoteOperations, remoteOperations);
    }
    if (remoteOperations === 'auto') {
      remoteOperations = this.isLocalStore(store) || this.isCustomStore(store) ? {} : {
        filtering: true,
        sorting: true,
        paging: true
      };
    }
    if (remoteOperations === true) {
      remoteOperations = enabledRemoteOperations;
    }
    return this._createDataSourceAdapterCore(dataSource, remoteOperations);
  }
  setDataSource(dataSource) {
    const that = this;
    const oldDataSource = that._dataSource;
    if (!dataSource && oldDataSource) {
      oldDataSource.cancelAll();
      oldDataSource.changed.remove(that._dataChangedHandler);
      oldDataSource.loadingChanged.remove(that._loadingChangedHandler);
      oldDataSource.loadError.remove(that._loadErrorHandler);
      oldDataSource.customizeStoreLoadOptions.remove(that._customizeStoreLoadOptionsHandler);
      oldDataSource.changing.remove(that._changingHandler);
      oldDataSource.pushed.remove(that._dataPushedHandler);
      oldDataSource.dispose(that._isSharedDataSource);
    }
    if (dataSource) {
      dataSource = that._createDataSourceAdapter(dataSource);
    }
    that._dataSource = dataSource;
    if (dataSource) {
      that._fireDataSourceChanged();
      that._isLoading = !dataSource.isLoaded();
      that._needApplyFilter = true;
      that._isAllDataTypesDefined = that._columnsController.isAllDataTypesDefined();
      dataSource.changed.add(that._dataChangedHandler);
      dataSource.loadingChanged.add(that._loadingChangedHandler);
      dataSource.loadError.add(that._loadErrorHandler);
      dataSource.customizeStoreLoadOptions.add(that._customizeStoreLoadOptionsHandler);
      dataSource.changing.add(that._changingHandler);
      dataSource.pushed.add(that._dataPushedHandler);
    }
  }
  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  items(byLoaded) {
    return this._items;
  }
  /**
   * @extended: virtual_scrolling
   */
  isEmpty() {
    return !this.items().length;
  }
  pageCount() {
    return this._dataSource ? this._dataSource.pageCount() : 1;
  }
  dataSource() {
    return this._dataSource;
  }
  store() {
    const dataSource = this._dataSource;
    return dataSource && dataSource.store();
  }
  loadAll(data) {
    let skipFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const dataSource = that._dataSource;
    if (dataSource) {
      if (data) {
        const options = {
          data,
          isCustomLoading: true,
          storeLoadOptions: {
            isLoadingAll: true
          },
          loadOptions: {
            filter: skipFilter ? null : that.getCombinedFilter(),
            group: dataSource.group(),
            sort: dataSource.sort()
          }
        };
        dataSource._handleDataLoaded(options);
        (0, _deferred.when)(options.data).done(data => {
          var _options$extra;
          data = that._beforeProcessItems(data);
          d.resolve(that._processItems(data, {
            changeType: 'loadingAll'
          }), (_options$extra = options.extra) === null || _options$extra === void 0 ? void 0 : _options$extra.summary);
        }).fail(d.reject);
      } else if (!dataSource.isLoading()) {
        const loadOptions = (0, _extend.extend)({}, dataSource.loadOptions(), {
          isLoadingAll: true,
          requireTotalCount: false
        });
        dataSource.load(loadOptions).done((items, extra) => {
          items = that._beforeProcessItems(items);
          items = that._processItems(items, {
            changeType: 'loadingAll'
          });
          d.resolve(items, extra && extra.summary);
        }).fail(d.reject);
      } else {
        d.reject();
      }
    } else {
      d.resolve([]);
    }
    return d;
  }
  getKeyByRowIndex(rowIndex, byLoaded) {
    const item = this.items(byLoaded)[rowIndex];
    if (item) {
      return item.key;
    }
  }
  getRowIndexByKey(key, byLoaded) {
    return _m_utils.default.getIndexByKey(key, this.items(byLoaded));
  }
  keyOf(data) {
    const store = this.store();
    if (store) {
      return store.keyOf(data);
    }
  }
  byKey(key) {
    const store = this.store();
    const rowIndex = this.getRowIndexByKey(key);
    let result;
    if (!store) return;
    if (rowIndex >= 0) {
      // @ts-expect-error
      result = new _deferred.Deferred().resolve(this.items()[rowIndex].data);
    }
    return result || store.byKey(key);
  }
  key() {
    const store = this.store();
    if (store) {
      return store.key();
    }
  }
  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRowIndexOffset(byLoadedRows) {
    return 0;
  }
  getDataByKeys(rowKeys) {
    const that = this;
    // @ts-expect-error
    const result = new _deferred.Deferred();
    const deferreds = [];
    const data = [];
    (0, _iterator.each)(rowKeys, (index, key) => {
      deferreds.push(that.byKey(key).done(keyData => {
        data[index] = keyData;
      }));
    });
    _deferred.when.apply(_renderer.default, deferreds).always(() => {
      result.resolve(data);
    });
    return result;
  }
  /**
   * @extended: virtual_scrolling
   */
  pageIndex(value) {
    return changePaging(this, 'pageIndex', value);
  }
  pageSize(value) {
    return changePaging(this, 'pageSize', value);
  }
  beginCustomLoading(messageText) {
    this._isCustomLoading = true;
    this._loadingText = messageText || '';
    this._fireLoadingChanged();
  }
  endCustomLoading() {
    this._isCustomLoading = false;
    this._loadingText = undefined;
    this._fireLoadingChanged();
  }
  /**
   * @extended: virtual_scrolling, selection
   */
  refresh(options) {
    if (options === true) {
      options = {
        reload: true,
        changesOnly: true
      };
    } else if (!options) {
      options = {
        lookup: true,
        selection: true,
        reload: true
      };
    }
    const that = this;
    const dataSource = that.getDataSource();
    const {
      changesOnly
    } = options;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const customizeLoadResult = function () {
      that._repaintChangesOnly = !!changesOnly;
    };
    (0, _deferred.when)(!options.lookup || that._columnsController.refresh()).always(() => {
      if (options.load || options.reload) {
        dataSource && dataSource.on('customizeLoadResult', customizeLoadResult);
        (0, _deferred.when)(that.reload(options.reload, changesOnly)).always(() => {
          dataSource && dataSource.off('customizeLoadResult', customizeLoadResult);
          that._repaintChangesOnly = undefined;
        }).done(d.resolve).fail(d.reject);
      } else {
        that.updateItems({
          repaintChangesOnly: options.changesOnly
        });
        d.resolve();
      }
    });
    return d.promise();
  }
  getVisibleRows() {
    return this.items();
  }
  _disposeDataSource() {
    if (this._dataSource && this._dataSource._eventsStrategy) {
      this._dataSource._eventsStrategy.off('loadingChanged', this.readyWatcher);
    }
    this.setDataSource(null);
  }
  dispose() {
    this._disposeDataSource();
    super.dispose();
  }
  /**
   * @extended editing
   */
  repaintRows(rowIndexes, changesOnly) {
    rowIndexes = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];
    if (rowIndexes.length > 1 || (0, _type.isDefined)(rowIndexes[0])) {
      this.updateItems({
        changeType: 'update',
        rowIndices: rowIndexes,
        isFullUpdate: !changesOnly
      });
    }
  }
  skipProcessingPagingChange(fullName) {
    return this._skipProcessingPagingChange && (fullName === 'paging.pageIndex' || fullName === 'paging.pageSize');
  }
  /**
   * @extended: TreeList's state_storing
   */
  getUserState() {
    return {
      searchText: this.option('searchPanel.text'),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize()
    };
  }
  getCachedStoreData() {
    return this._dataSource && this._dataSource.getCachedStoreData();
  }
  /**
   * @extended: virtual_scrolling
   */
  isLastPageLoaded() {
    const pageIndex = this.pageIndex();
    const pageCount = this.pageCount();
    return pageIndex === pageCount - 1;
  }
  load() {
    var _this$_dataSource;
    return (_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 ? void 0 : _this$_dataSource.load();
  }
  /**
   * @extended: editing, virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reload(reload, changesOnly) {
    var _this$_dataSource2;
    return (_this$_dataSource2 = this._dataSource) === null || _this$_dataSource2 === void 0 ? void 0 : _this$_dataSource2.reload(reload, changesOnly);
  }
  push() {
    var _this$_dataSource3;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return (_this$_dataSource3 = this._dataSource) === null || _this$_dataSource3 === void 0 ? void 0 : _this$_dataSource3.push(...args);
  }
  itemsCount() {
    var _this$_dataSource4;
    return this._dataSource ? (_this$_dataSource4 = this._dataSource) === null || _this$_dataSource4 === void 0 ? void 0 : _this$_dataSource4.itemsCount() : 0;
  }
  totalItemsCount() {
    var _this$_dataSource5;
    return this._dataSource ? (_this$_dataSource5 = this._dataSource) === null || _this$_dataSource5 === void 0 ? void 0 : _this$_dataSource5.totalItemsCount() : 0;
  }
  hasKnownLastPage() {
    var _this$_dataSource6;
    return this._dataSource ? (_this$_dataSource6 = this._dataSource) === null || _this$_dataSource6 === void 0 ? void 0 : _this$_dataSource6.hasKnownLastPage() : true;
  }
  /**
   * @extended: state_storing
   */
  isLoaded() {
    var _this$_dataSource7;
    return this._dataSource ? (_this$_dataSource7 = this._dataSource) === null || _this$_dataSource7 === void 0 ? void 0 : _this$_dataSource7.isLoaded() : true;
  }
  totalCount() {
    var _this$_dataSource8;
    return this._dataSource ? (_this$_dataSource8 = this._dataSource) === null || _this$_dataSource8 === void 0 ? void 0 : _this$_dataSource8.totalCount() : 0;
  }
  hasLoadOperation() {
    var _this$_dataSource9;
    const operationTypes = ((_this$_dataSource9 = this._dataSource) === null || _this$_dataSource9 === void 0 ? void 0 : _this$_dataSource9.operationTypes()) ?? {};
    return Object.keys(operationTypes).some(type => operationTypes[type]);
  }
}
exports.DataController = DataController;
const dataControllerModule = exports.dataControllerModule = {
  defaultOptions() {
    return {
      loadingTimeout: 0,
      dataSource: null,
      cacheEnabled: true,
      repaintChangesOnly: false,
      highlightChanges: false,
      onDataErrorOccurred: null,
      remoteOperations: 'auto',
      paging: {
        enabled: true,
        pageSize: undefined,
        pageIndex: undefined
      }
    };
  },
  controllers: {
    data: DataController
  }
};