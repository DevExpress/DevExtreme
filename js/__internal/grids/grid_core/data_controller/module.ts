/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable class-methods-use-this */
import $ from '@js/core/renderer';
import ArrayStore from '@js/data/array_store';
import CustomStore from '@js/data/custom_store';
import { deferRender, equalByValue } from '@js/core/utils/common';
import { each } from '@js/core/utils/iterator';
import { isDefined, isObject } from '@js/core/utils/type';
import { extend } from '@js/core/utils/extend';
import DataHelperMixin from '@js/data_helper';
import { when, Deferred } from '@js/core/utils/deferred';
import { findChanges } from '@js/core/utils/array_compare';
import errors from '@js/ui/widget/ui.errors';
import gridCoreUtils from '../module_utils';
import modules from '../modules';
import type {
  Module, ModuleType, Controllers, Controller as ControllerType,
} from '../module_types';
import type { SearchDataControllerExtension } from '../search/module';

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
        return dataSource[optionName === 'pageIndex' ? 'load' : 'reload']()
          .done(() => {
            that._isPaging = false;
            that.pageChanged.fire(pageIndex);
          });
      }
      return Deferred().resolve().promise();
    }
    return dataSource[optionName]();
  }

  return 0;
};

interface HandleDataChangedArguments {
  changeType?: 'refresh' | 'update' | 'loadError';
  isDelayed?: boolean;
  isLiveUpdate?: boolean;
  error?: any;
}

type UserData = Record<string, unknown>;

interface Item {
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
}

interface DataHelperMixinType {
  _refreshDataSource(): any;
  _initDataSource(): any;
}

type DataControllerBaseType = ModuleType<ControllerType
& DataHelperMixinType
& SearchDataControllerExtension>;

const ControllerWithDataMixin: DataControllerBaseType = modules.Controller.inherit(DataHelperMixin);

export class DataController extends ControllerWithDataMixin {
  _items!: Item[];

  _cachedProcessedItems!: Item[] | null;

  _dataSource!: any;

  _isPaging!: boolean;

  _currentOperationTypes: any | null;

  _isLoading!: boolean;

  _isCustomLoading!: boolean;

  _repaintChangesOnly?: boolean;

  _changes!: any[];

  _skipProcessingPagingChange: boolean | undefined;

  _useSortingGroupingFromColumns: boolean | undefined;

  _columnsUpdating: boolean | undefined;

  _needApplyFilter: boolean | undefined;

  _isDataSourceApplying: boolean | undefined;

  _isAllDataTypesDefined: boolean | undefined;

  _needUpdateDimensions: boolean | undefined;

  _isFilterApplying: boolean | undefined;

  _readyDeferred: any;

  _rowIndexOffset!: number;

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

  _columnsController!: Controllers['columns'];

  _editingController: any;

  _rowsScrollController: any;

  _columnsChangedHandler!: (e: any) => any;

  _loadingChangedHandler!: (e: any) => any;

  _loadErrorHandler!: (e: any) => any;

  _customizeStoreLoadOptionsHandler!: (e: any) => any;

  _changingHandler!: (e: any) => any;

  _dataPushedHandler!: (e: any) => any;

  _dataChangedHandler!: (e: HandleDataChangedArguments) => any;

  init() {
    const that = this;
    that._items = [];
    that._cachedProcessedItems = null;
    that._columnsController = this.getController('columns');

    that._isPaging = false;
    that._currentOperationTypes = null;
    that._dataChangedHandler = (e) => {
      that._currentOperationTypes = this._dataSource.operationTypes();
      that._handleDataChanged(e);
      that._currentOperationTypes = null;
    };
    that._columnsChangedHandler = that._handleColumnsChanged.bind(that);
    that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
    that._loadErrorHandler = that._handleLoadError.bind(that);
    that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);
    that._changingHandler = that._handleChanging.bind(that);
    that._dataPushedHandler = that._handleDataPushed.bind(that);

    that._columnsController.columnsChanged.add(that._columnsChangedHandler);

    that._isLoading = false;
    that._isCustomLoading = false;
    that._repaintChangesOnly = undefined;
    that._changes = [];

    that.createAction('onDataErrorOccurred');

    that.dataErrorOccurred.add((error) => that.executeAction('onDataErrorOccurred', { error }));

    that._refreshDataSource();
  }

  _getPagingOptionValue(optionName) {
    return this._dataSource[optionName]();
  }

  callbackNames() {
    return ['changed', 'loadingChanged', 'dataErrorOccurred', 'pageChanged', 'dataSourceChanged', 'pushed'];
  }

  callbackFlags(name?: string) {
    if (name === 'dataErrorOccurred') {
      return { stopOnFalse: true };
    }

    return undefined;
  }

  publicMethods() {
    return [
      'beginCustomLoading',
      'endCustomLoading',
      'refresh',
      'filter',
      'clearFilter',
      'getCombinedFilter',
      'keyOf',
      'byKey',
      'getDataByKeys',
      'pageIndex',
      'pageSize',
      'pageCount',
      'totalCount',
      '_disposeDataSource',
      'getKeyByRowIndex',
      'getRowIndexByKey',
      'getDataSource',
      'getVisibleRows',
      'repaintRows',
    ];
  }

  reset() {
    this._columnsController.reset();
    this._items = [];
    this._refreshDataSource();
  }

  _handleDataSourceChange(args) {
    if (args.value === args.previousValue || (
      this.option('columns')
                    && Array.isArray(args.value)
                    && Array.isArray(args.previousValue)
    )) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  needToRefreshOnDataSourceChange(args?) {
    return true;
  }

  optionChanged(args) {
    const that = this;
    let dataSource;
    let changedPagingOptions;

    function handled() {
      args.handled = true;
    }

    if (args.name === 'dataSource'
                    && args.name === args.fullName
                    && this._handleDataSourceChange(args)) {
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

  getCombinedFilter(returnDataField?) {
    return this.combinedFilter(undefined, returnDataField);
  }

  combinedFilter(filter, returnDataField?) {
    const that = this;
    const dataSource = that._dataSource;
    const columnsController = that._columnsController;

    if (dataSource) {
      if (filter === undefined) {
        filter = dataSource.filter();
      }

      const additionalFilter = that._calculateAdditionalFilter();
      if (additionalFilter) {
        if (columnsController.isDataSourceApplied() || columnsController.isAllDataTypesDefined()) {
          filter = gridCoreUtils.combineFilters([additionalFilter, filter]);
        }
      }

      filter = columnsController.updateFilter(filter, returnDataField || dataSource.remoteOperations().filtering);
    }
    return filter;
  }

  waitReady() {
    if (this._updateLockCount) {
      // @ts-expect-error
      this._readyDeferred = new Deferred();
      return this._readyDeferred;
    }
    return when();
  }

  _endUpdateCore() {
    const changes = this._changes;

    if (changes.length) {
      this._changes = [];
      const repaintChangesOnly = changes.every((change) => change.repaintChangesOnly);
      this.updateItems(changes.length === 1 ? changes[0] : { repaintChangesOnly });
    }

    if (this._readyDeferred) {
      this._readyDeferred.resolve();
      this._readyDeferred = null;
    }
  }

  // Handlers
  _handleCustomizeStoreLoadOptions(e) {
    const columnsController = this._columnsController;
    const dataSource = this._dataSource;
    const { storeLoadOptions } = e;

    if (e.isCustomLoading && !storeLoadOptions.isLoadingAll) {
      return;
    }

    storeLoadOptions.filter = this.combinedFilter(storeLoadOptions.filter);

    if (storeLoadOptions.filter?.length === 1 && storeLoadOptions.filter[0] === '!') {
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
    const { changeTypes } = e;
    const { optionNames } = e;
    let filterValue;
    let filterValues;
    let filterApplied;

    // B255430
    const updateItemsHandler = function (change) {
      that._columnsController.columnsChanged.remove(updateItemsHandler);
      that.updateItems({
        repaintChangesOnly: false,
        virtualColumnsScrolling: change?.changeTypes?.virtualColumnsScrolling,
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

        if (Array.isArray(filterValues) || e.columnIndex === undefined || isDefined(filterValue) || !optionNames.selectedFilterOperation || optionNames.filterValue) {
          that._applyFilter();
          filterApplied = true;
        }
      }

      if (!that._needApplyFilter && !gridCoreUtils.checkChanges(optionNames, ['width', 'visibleWidth', 'filterValue', 'bufferedFilterValue', 'selectedFilterOperation', 'filterValues', 'filterType'])) {
        // TODO remove resubscribing
        that._columnsController.columnsChanged.add(updateItemsHandler);
      }

      if (isDefined(optionNames.visible)) {
        const column = that._columnsController.columnOption(e.columnIndex);
        if (column && (isDefined(column.filterValue) || isDefined(column.filterValues))) {
          that._applyFilter();
          filterApplied = true;
        }
      }
    }
    if (!filterApplied && changeTypes.filtering) {
      that.reload();
    }
  }

  _handleDataChanged(e: HandleDataChangedArguments) {
    const that = this;
    const dataSource = that._dataSource;
    const columnsController = that._columnsController;
    let isAsyncDataSourceApplying = false;

    this._useSortingGroupingFromColumns = false;

    if (dataSource && !that._isDataSourceApplying) {
      that._isDataSourceApplying = true;

      when(that._columnsController.applyDataSource(dataSource)).done(() => {
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
          errors.log('W1005', that.component.NAME);
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

  _handleLoadError(e) {
    this.dataErrorOccurred.fire(e);
  }

  _handleDataPushed(changes) {
    this.pushed.fire(changes);
  }

  fireError() {
    // @ts-expect-error
    this.dataErrorOccurred.fire(errors.Error.apply(errors, arguments));
  }

  _setPagingOptions(dataSource): any {
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
        isPageIndexChanged,
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
          key: this.option('keyExpr'),
        },
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

      this._isPaging = changedPagingOptions?.isPageIndexChanged;
      that.setDataSource(dataSource);
    } else if (oldDataSource) {
      that.updateItems();
    }
  }

  _loadDataSource() {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const result = new Deferred();

    when(this._columnsController.refresh(true)).always(() => {
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

  _beforeProcessItems(items) {
    return items.slice(0);
  }

  getRowIndexDelta() {
    return 0;
  }

  getDataIndex(change) {
    const visibleItems = this._items;
    const lastVisibleItem = change.changeType === 'append' && visibleItems.length > 0 ? visibleItems[visibleItems.length - 1] : null;

    return isDefined(lastVisibleItem?.dataIndex) ? lastVisibleItem!.dataIndex + 1 : 0;
  }

  _processItems(items, change) {
    const that = this;
    const rowIndexDelta = that.getRowIndexDelta();
    const { changeType } = change;
    const visibleColumns = that._columnsController.getVisibleColumns(null, changeType === 'loadingAll');
    const dataIndex = this.getDataIndex(change);

    const options = {
      visibleColumns,
      dataIndex,
    };
    const result: any[] = [];

    each(items, (index, item) => {
      if (isDefined(item)) {
        // @ts-expect-error
        options.rowIndex = index - rowIndexDelta;
        item = that._processItem(item, options);
        result.push(item);
      }
    });

    return result;
  }

  _processItem(item, options) {
    item = this._generateDataItem(item, options);
    item = this._processDataItem(item, options);
    item.dataIndex = options.dataIndex++;
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _generateDataItem(data, options?) {
    return {
      rowType: 'data',
      data,
      key: this.keyOf(data),
    };
  }

  _processDataItem(dataItem, options) {
    dataItem.values = this.generateDataValues(dataItem.data, options.visibleColumns);
    return dataItem;
  }

  generateDataValues(data, columns, isModified?) {
    const values: any[] = [];
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

  _applyChangeUpdate(change) {
    const that = this;
    const { items } = change;
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

    const equalItems = function (item1, item2, strict?) {
      let result = item1 && item2 && equalByValue(item1.key, item2.key);
      if (result && strict) {
        result = item1.rowType === item2.rowType && (item2.rowType !== 'detail' || item1.isEditing === item2.isEditing);
      }
      return result;
    };

    each(rowIndices, (index, rowIndex) => {
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
          change.items.splice(-1, 1, { visible: newItem.visible });
        } else if (repaintChangesOnly && !change.isFullUpdate) {
          columnIndices = that._partialUpdateRow(oldItem, newItem, rowIndex - rowIndexDelta);
        }
      } else if (newItem && !oldItem || (newNextItem && equalItems(oldItem, newNextItem, strict))) {
        changeType = 'insert';
        that._items.splice(rowIndex, 0, newItem);
        rowIndexCorrection++;
      } else if (oldItem && !newItem || (oldNextItem && equalItems(newItem, oldNextItem, strict))) {
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
      if (newItem.rowType === 'group' && newItem.isExpanded === oldItem.isExpanded && oldItem.cells) {
        columnIndices = oldItem.cells.map((cell, index) => (cell.column?.type !== 'groupExpand' ? index : -1)).filter((index) => index >= 0);
      }
    }
    return columnIndices;
  }

  _partialUpdateRow(oldItem, newItem, visibleRowIndex, isLiveUpdate?) {
    let changedColumnIndices = this._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);

    if (changedColumnIndices?.length && this.option('dataRowTemplate')) {
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
    if (compareFields.some((field) => item1[field] !== item2[field])) {
      return false;
    }

    if (item1.rowType === 'group' || item1.rowType === 'groupFooter') {
      const expandedMatch = item1.isExpanded === item2.isExpanded;
      const summaryCellsMatch = JSON.stringify(item1.summaryCells) === JSON.stringify(item2.summaryCells);
      const continuationMatch = item1.data?.isContinuation === item2.data?.isContinuation && item1.data?.isContinuationOnNextPage === item2.data?.isContinuationOnNextPage;
      if (!expandedMatch || !summaryCellsMatch || !continuationMatch) {
        return false;
      }
    }

    return true;
  }

  _applyChangesOnly(change) {
    const rowIndices: any[] = [];
    const columnIndices: any[] = [];
    const changeTypes: string[] = [];
    const items: any[] = [];
    const newIndexByKey = {};
    const isLiveUpdate = change?.isLiveUpdate ?? true;

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
        item1.cells.forEach((cell) => {
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
      newIndexByKey[key!] = index;
      item.rowIndex = index;
    });

    const result = findChanges(oldItems, change.items, getRowKey, isItemEquals);

    if (!result) {
      this._applyChangeFull(change);
      return;
    }

    result.forEach((change) => {
      switch (change.type) {
        case 'update': {
          const { index } = change;
          const newItem = change.data;
          const { oldItem } = change;
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

    this._correctRowIndices((rowIndex) => {
      const oldRowIndexOffset = this._rowIndexOffset || 0;
      const rowIndexOffset = this.getRowIndexOffset();
      const oldItem = oldItems[rowIndex - oldRowIndexOffset];
      const key = getRowKey(oldItem);
      const newVisibleRowIndex = newIndexByKey[key!];

      return newVisibleRowIndex >= 0 ? newVisibleRowIndex + rowIndexOffset - rowIndex : 0;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _correctRowIndices(rowIndex: any): any { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _afterProcessItems(items, change?) {
    return items;
  }

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
      each(this._items, (index, item) => {
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
      e.changes.forEach((change) => {
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

  updateItems(change?, isDataChanged?) {
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

  _fireChanged(change) {
    if (this._currentOperationTypes) {
      change.operationTypes = this._currentOperationTypes;
      this._currentOperationTypes = null;
    }
    deferRender(() => {
      this.changed.fire(change);
    });
  }

  isLoading() {
    return this._isLoading || this._isCustomLoading;
  }

  _fireLoadingChanged() {
    this.loadingChanged.fire(this.isLoading(), this._loadingText);
  }

  _calculateAdditionalFilter(): any {
    return null;
  }

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

    if (gridCoreUtils.equalFilterParameters(filter, filterExpr)) {
      return;
    }
    if (dataSource) {
      dataSource.filter(filterExpr);
    }
    this._applyFilter();
  }

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

  _getDataSourceAdapter(): any {}

  _createDataSourceAdapterCore(dataSource, remoteOperations) {
    const dataSourceAdapterProvider = this._getDataSourceAdapter();
    const dataSourceAdapter = dataSourceAdapterProvider.create(this.component);

    dataSourceAdapter.init(dataSource, remoteOperations);
    return dataSourceAdapter;
  }

  isLocalStore(store) {
    store = store || this.store();
    return store instanceof ArrayStore;
  }

  isCustomStore(store) {
    store = store || this.store();
    return store instanceof CustomStore;
  }

  _createDataSourceAdapter(dataSource) {
    let remoteOperations: any = this.option('remoteOperations');
    const store = dataSource.store();
    const enabledRemoteOperations = {
      filtering: true, sorting: true, paging: true, grouping: true, summary: true,
    };

    // @ts-expect-error
    if (isObject(remoteOperations) && remoteOperations.groupPaging) {
      remoteOperations = extend({}, enabledRemoteOperations, remoteOperations);
    }

    if (remoteOperations === 'auto') {
      remoteOperations = this.isLocalStore(store) || this.isCustomStore(store) ? {} : { filtering: true, sorting: true, paging: true };
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  items(byLoaded?) {
    return this._items;
  }

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
    const that = this;
    // @ts-expect-error
    const d = new Deferred();
    const dataSource = that._dataSource;

    if (dataSource) {
      if (data) {
        const options: Record<string, any> = {
          data,
          isCustomLoading: true,
          storeLoadOptions: { isLoadingAll: true },
          loadOptions: {
            filter: that.getCombinedFilter(),
            group: dataSource.group(),
            sort: dataSource.sort(),
          },
        };
        dataSource._handleDataLoaded(options);
        when(options.data).done((data) => {
          data = that._beforeProcessItems(data);
          d.resolve(that._processItems(data, { changeType: 'loadingAll' }), options.extra?.summary);
        }).fail(d.reject);
      } else if (!dataSource.isLoading()) {
        const loadOptions = extend({}, dataSource.loadOptions(), { isLoadingAll: true, requireTotalCount: false });
        dataSource.load(loadOptions).done((items, extra) => {
          items = that._beforeProcessItems(items);
          items = that._processItems(items, { changeType: 'loadingAll' });
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

  getKeyByRowIndex(rowIndex, byLoaded?) {
    const item = this.items(byLoaded)[rowIndex];
    if (item) {
      return item.key;
    }
  }

  getRowIndexByKey(key, byLoaded?) {
    return gridCoreUtils.getIndexByKey(key, this.items(byLoaded));
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
      result = new Deferred().resolve(this.items()[rowIndex].data);
    }

    return result || store.byKey(key);
  }

  key() {
    const store = this.store();

    if (store) {
      return store.key();
    }
  }

  getRowIndexOffset() {
    return 0;
  }

  getDataByKeys(rowKeys) {
    const that = this;
    // @ts-expect-error
    const result = new Deferred();
    const deferreds: any[] = [];
    const data = [];

    each(rowKeys, (index, key) => {
      deferreds.push(that.byKey(key).done((keyData) => {
        data[index] = keyData;
      }));
    });

    when.apply($, deferreds).always(() => {
      result.resolve(data);
    });

    return result;
  }

  pageIndex(value?) {
    return changePaging(this, 'pageIndex', value);
  }

  pageSize(value?) {
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

  refresh(options) {
    if (options === true) {
      options = { reload: true, changesOnly: true };
    } else if (!options) {
      options = { lookup: true, selection: true, reload: true };
    }

    const that = this;
    const dataSource = that.getDataSource();
    const { changesOnly } = options;
    // @ts-expect-error
    const d = new Deferred();

    const customizeLoadResult = function () {
      that._repaintChangesOnly = !!changesOnly;
    };

    when(!options.lookup || that._columnsController.refresh()).always(() => {
      if (options.load || options.reload) {
        dataSource && dataSource.on('customizeLoadResult', customizeLoadResult);

        when(that.reload(options.reload, changesOnly)).always(() => {
          dataSource && dataSource.off('customizeLoadResult', customizeLoadResult);
          that._repaintChangesOnly = undefined;
        }).done(d.resolve).fail(d.reject);
      } else {
        that.updateItems({ repaintChangesOnly: options.changesOnly });
        d.resolve();
      }
    });

    return d.promise();
  }

  getVisibleRows() {
    return this.items();
  }

  _disposeDataSource() {
    this.setDataSource(null);
  }

  dispose() {
    this._disposeDataSource();
    super.dispose();
  }

  repaintRows(rowIndexes, changesOnly) {
    rowIndexes = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];

    if (rowIndexes.length > 1 || isDefined(rowIndexes[0])) {
      this.updateItems({ changeType: 'update', rowIndices: rowIndexes, isFullUpdate: !changesOnly });
    }
  }

  skipProcessingPagingChange(fullName) {
    return this._skipProcessingPagingChange && (fullName === 'paging.pageIndex' || fullName === 'paging.pageSize');
  }

  getUserState() {
    return {
      searchText: this.option('searchPanel.text'),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    };
  }

  getCachedStoreData() {
    return this._dataSource && this._dataSource.getCachedStoreData();
  }

  isLastPageLoaded() {
    const pageIndex = this.pageIndex();
    const pageCount = this.pageCount();
    return pageIndex === (pageCount - 1);
  }

  load(): any {
    return this._dataSource?.load();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reload(reload?, changesOnly?): any {
    return this._dataSource?.reload(reload, changesOnly);
  }

  push(...args) {
    return this._dataSource?.push(...args);
  }

  itemsCount() {
    return this._dataSource ? this._dataSource?.itemsCount() : 0;
  }

  totalItemsCount() {
    return this._dataSource ? this._dataSource?.totalItemsCount() : 0;
  }

  hasKnownLastPage() {
    return this._dataSource ? this._dataSource?.hasKnownLastPage() : true;
  }

  isLoaded() {
    return this._dataSource ? this._dataSource?.isLoaded() : true;
  }

  totalCount() {
    return this._dataSource ? this._dataSource?.totalCount() : 0;
  }
}
export const dataControllerModule: Module = {
  defaultOptions() {
    return {
      loadingTimeout: 0,
      dataSource: null,
      cacheEnabled: true,
      repaintChangesOnly: false,
      highlightChanges: false,
      onDataErrorOccurred: null as any as undefined,
      remoteOperations: 'auto',
      paging: {
        enabled: true,
        pageSize: undefined,
        pageIndex: undefined,
      },
    };
  },
  controllers: {
    data: DataController,
  },
};
