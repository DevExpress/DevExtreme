// TODO: fix the rules disabled below
/* eslint-disable @stylistic/max-len */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable consistent-return */
/* eslint-disable max-depth */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import type { DataSource } from '@js/common/data';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import { deferRender, equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import { findChanges } from '@ts/core/utils/m_array_compare';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import type { ErrorHandlingController } from '@ts/grids/grid_core/error_handling/m_error_handling';
import type { ApplyFilterViewController } from '@ts/grids/grid_core/filter/m_filter_row';
import type { FilterSyncController } from '@ts/grids/grid_core/filter/m_filter_sync';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { HeaderFilterController } from '@ts/grids/grid_core/header_filter/m_header_filter';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import type { StateStoringController } from '@ts/grids/grid_core/state_storing/m_state_storing_core';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';

import type { ColumnsChanges } from '../columns_controller/types';
import type { ChangedEvent, LoadOperation, OperationTypes } from '../data_source_adapter/types';
import modules from '../m_modules';
import type {
  Controllers, Module, OptionChanged,
} from '../m_types';
import gridCoreUtils from '../m_utils';
import type { VirtualScrollController } from '../virtual_scrolling/m_virtual_scrolling_core';
import { DataHelperMixin } from './data_helper_mixin';
import type {
  BinaryDataFilterExpression,
  CallbackFlags,
  DataChange,
  DataFilter,
  DataSourceAdapterLike,
  GeneratedItem,
  ItemProcessingOptions,
  PagingChanges,
  PagingDataSource,
  PagingOptionName,
  PagingResult,
  ProcessedItem,
  RawItemData,
} from './types';
import { resolvePaginate, syncPaging } from './utils/paging';
import { generateRowValues } from './utils/row_values';

export class DataController extends DataHelperMixin(modules.Controller) {
  protected _items!: ProcessedItem[];

  private _cachedProcessedItems!: ProcessedItem[] | null;

  protected _isPaging!: boolean;

  private _currentOperationTypes!: OperationTypes | null;

  protected _isLoading!: boolean;

  private _isCustomLoading!: boolean;

  protected _repaintChangesOnly?: boolean;

  protected _changes!: DataChange[];

  private _skipProcessingPagingChange?: boolean;

  private _useSortingGroupingFromColumns?: boolean;

  private _columnsUpdating?: boolean;

  private _needApplyFilter?: boolean;

  private _isDataSourceApplying?: boolean;

  private _isAllDataTypesDefined?: boolean;

  protected _needUpdateDimensions?: boolean;

  private _isFilterApplying?: boolean;

  private _readyDeferred?: DeferredObj<void>;

  private _rowIndexOffset!: number;

  private _loadingText?: string;

  public dataErrorOccurred!: Callback;

  public pageChanged!: Callback<[number?]>;

  public pushed!: Callback<[unknown]>;

  public changed!: Callback;

  public loadingChanged!: Callback<[boolean, string?]>;

  public dataSourceChanged!: Callback<[]>;

  protected _lastRenderingPageIndex?: number;

  protected _isPagingByRendering?: boolean;

  // TODO public controller
  public _columnsController!: Controllers['columns'];

  protected _adaptiveColumnsController!: Controllers['adaptiveColumns'];

  // TODO public controller
  public _rowsScrollController?: VirtualScrollController | null;

  protected _editingController!: EditingController;

  protected _editorFactoryController!: EditorFactory;

  protected _errorHandlingController!: ErrorHandlingController;

  protected _filterSyncController!: FilterSyncController;

  protected _headerFilterController!: HeaderFilterController;

  protected _applyFilterController!: ApplyFilterViewController;

  protected _keyboardNavigationController!: KeyboardNavigationController;

  protected _focusController!: FocusController;

  protected _selectionController!: SelectionController;

  protected _stateStoringController!: StateStoringController;

  protected _validatingController!: ValidatingController;

  private _loadingChangedHandler!: (isLoading: boolean) => void;

  private _loadErrorHandler!: (e: unknown) => void;

  private _changingHandler!: (e: unknown) => void;

  private _dataPushedHandler!: (changes: unknown) => void;

  private _dataChangedHandlerProxy!: (e: ChangedEvent) => void;

  public init(): void {
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
    this._dataChangedHandlerProxy = this._dataChangedHandler.bind(this);
    this._loadingChangedHandler = this._handleLoadingChanged.bind(this);
    this._loadErrorHandler = this._handleLoadError.bind(this);
    this._changingHandler = this._handleChanging.bind(this);
    this._dataPushedHandler = this._handleDataPushed.bind(this);

    this._columnsController.columnsChanged.add(this._columnsChangedHandler.bind(this));

    this._isLoading = false;
    this._isCustomLoading = false;
    this._repaintChangesOnly = undefined;
    this._changes = [];

    this.createAction('onDataErrorOccurred');

    this.dataErrorOccurred.add((error) => this.executeAction('onDataErrorOccurred', { error }));

    this._refreshDataSource();
    this.postInit();
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _getPagingOptionValue(optionName: PagingOptionName): number {
    return this._dataSource[optionName]() as number;
  }

  protected callbackNames(): string[] {
    return ['changed', 'loadingChanged', 'dataErrorOccurred', 'pageChanged', 'dataSourceChanged', 'pushed'];
  }

  protected callbackFlags(name?: string): CallbackFlags | undefined {
    if (name === 'dataErrorOccurred') {
      return { stopOnFalse: true };
    }

    return undefined;
  }

  public publicMethods(): string[] {
    return [
      '_disposeDataSource',
      'beginCustomLoading',
      'byKey',
      'clearFilter',
      'endCustomLoading',
      'filter',
      'getCombinedFilter',
      'getDataByKeys',
      'getDataSource',
      'getKeyByRowIndex',
      'getRowIndexByKey',
      'getVisibleRows',
      'keyOf',
      'pageCount',
      'pageIndex',
      'pageSize',
      'refresh',
      'repaintRows',
      'totalCount',
    ];
  }

  /**
   * @extended: virtual_scrolling
   */
  public reset(): void {
    this._columnsController.reset();
    this._items = [];
    this._refreshDataSource();
  }

  /**
   * @extended: editing
   */
  protected _handleDataSourceChange(args: OptionChanged): boolean {
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

  /**
   * @extended: editing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected needToRefreshOnDataSourceChange(args?: OptionChanged): boolean {
    return true;
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'dataSource'
        && args.name === args.fullName
        && this._handleDataSourceChange(args)
    ) {
      args.handled = true;
      return;
    }

    switch (args.name) {
      case 'cacheEnabled':
      case 'repaintChangesOnly':
      case 'highlightChanges':
      case 'loadingTimeout':
        args.handled = true;
        break;
      case 'remoteOperations':
      case 'keyExpr':
      case 'dataSource':
      case 'scrolling':
        args.handled = true;
        this.reset();
        break;
      case 'paging': {
        const dataSource = this.dataSource();

        if (dataSource) {
          const changedPagingOptions = this.applyPagingOptions(dataSource);
          if (changedPagingOptions.hasChanges) {
            const pageIndex = dataSource.pageIndex();

            this._isPaging = changedPagingOptions.isPageIndexChanged;

            dataSource.load().done(() => {
              this._isPaging = false;
              this.pageChanged.fire(pageIndex);
            });
          }
        }
        args.handled = true;
        break;
      }
      case 'rtlEnabled':
        this.reset();
        break;
      case 'columns': {
        const dataSource = this.dataSource();

        if (dataSource?.isLoading() && args.name === args.fullName) {
          this._useSortingGroupingFromColumns = true;
          dataSource.load();
        }
        break;
      }
      default:
        super.optionChanged(args);
    }
  }

  public isReady(): boolean {
    return !this._isLoading;
  }

  public getDataSource(): DataSource | null | undefined {
    const adapter: DataSourceAdapterLike | null | undefined = this._dataSource;
    return adapter ? adapter._dataSource : null;
  }

  public getCombinedFilter(returnDataField?: boolean): DataFilter {
    return this.combinedFilter(undefined, returnDataField);
  }

  private combinedFilter(filter: DataFilter, returnDataField?: boolean): DataFilter {
    if (!this._dataSource) {
      return filter;
    }

    let combined: DataFilter = filter ?? this._dataSource.filter();

    const isColumnsTypesDefined = this._columnsController.isDataSourceApplied()
      || this._columnsController.isAllDataTypesDefined();

    if (isColumnsTypesDefined) {
      const additionalFilter = this._calculateAdditionalFilter();

      combined = additionalFilter
        ? gridCoreUtils.combineFilters([additionalFilter, combined])
        : combined;
    }

    const isRemoteFiltering = this._dataSource.remoteOperations().filtering || returnDataField;

    combined = this._columnsController.updateFilter(combined, isRemoteFiltering);

    return combined;
  }

  public waitReady(): DeferredObj<void> {
    if (this._updateLockCount) {
      // @ts-expect-error
      this._readyDeferred = new Deferred();
      return this._readyDeferred as DeferredObj<void>;
    }
    return when();
  }

  /**
   * @extended: selection
   * @protected
   */
  protected _endUpdateCore(): void {
    const changes = this._changes;

    if (changes.length) {
      this._changes = [];
      const repaintChangesOnly = changes.every((change) => change.repaintChangesOnly);
      const change: DataChange = changes.length === 1
        ? changes[0]
        : { changeType: 'refresh', repaintChangesOnly };

      this.updateItems(change);
    }

    if (this._readyDeferred) {
      this._readyDeferred.resolve();
      this._readyDeferred = undefined;
    }
  }

  // Handlers
  private readonly _customizeStoreLoadOptionsHandler = (e: LoadOperation): void => {
    const columnsController = this._columnsController;
    const dataSource = this._dataSource;
    const { storeLoadOptions } = e;

    if (e.isCustomLoading && !storeLoadOptions.isLoadingAll) {
      return;
    }

    storeLoadOptions.filter = this.combinedFilter(storeLoadOptions.filter);

    if (Array.isArray(storeLoadOptions.filter)
      && storeLoadOptions.filter.length === 1
      && storeLoadOptions.filter[0] === '!') {
      e.data = [];
      e.extra = e.extra ?? {};
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

    storeLoadOptions.sort = columnsController
      .getSortDataSourceParameters(!dataSource.remoteOperations().sorting);

    e.group = columnsController
      .getGroupDataSourceParameters(!dataSource.remoteOperations().grouping);
  };

  private _columnsChangedHandler(e: ColumnsChanges): void {
    const that = this;
    const { changeTypes, optionNames } = e;
    let filterApplied = false;

    // B255430
    const updateItemsHandler = (change: ColumnsChanges): void => {
      that._columnsController.columnsChanged.remove(updateItemsHandler);

      that.updateItems({
        changeType: 'refresh',
        repaintChangesOnly: false,
        event: change?.changeTypes?.event,
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
      const filterValues = that._columnsController.columnOption(e.columnIndex, 'filterValues');

      if (optionNames.filterValues
        || (optionNames.filterType && Array.isArray(filterValues))
        || optionNames.filterValue
        || optionNames.selectedFilterOperation
        || optionNames.allowFiltering
      ) {
        const filterValue = that._columnsController.columnOption(e.columnIndex, 'filterValue');

        if (Array.isArray(filterValues)
          || e.columnIndex === undefined
          || isDefined(filterValue)
          || !optionNames.selectedFilterOperation
          || optionNames.filterValue
        ) {
          that._applyFilter();
          filterApplied = true;
        }
      }

      const excludedOptionNames = [
        'width',
        'visibleWidth',
        'filterValue',
        'bufferedFilterValue',
        'selectedFilterOperation',
        'filterValues',
        'filterType',
      ];

      if (!that._needApplyFilter && !gridCoreUtils.checkChanges(optionNames, excludedOptionNames)) {
        // TODO remove resubscribing
        that._columnsController.columnsChanged.add(updateItemsHandler);
      }

      if (isDefined(optionNames.visible)) {
        const column = that._columnsController.columnOption(e.columnIndex);
        const hasFilterValue = isDefined(column?.filterValue) || isDefined(column?.filterValues);

        if (hasFilterValue) {
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
  protected _dataChangedHandler(e?: ChangedEvent): void {
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

        // @ts-expect-error e.isDelayed is set for virtual scrolling with scrolling.legacyMode
        if (isAsyncDataSourceApplying && e?.isDelayed) {
          // @ts-expect-error e.isDelayed is set for virtual scrolling with scrolling.legacyMode
          e.isDelayed = false;
        }

        that._isDataSourceApplying = false;

        const hasAdditionalFilter = (): boolean => {
          const additionalFilter = that._calculateAdditionalFilter();
          return Boolean(additionalFilter?.length);
        };

        const needApplyFilter = that._needApplyFilter;
        that._needApplyFilter = false;

        if (needApplyFilter && !that._isAllDataTypesDefined && hasAdditionalFilter()) {
          errors.log('W1005', that.component.NAME);
          that._applyFilter();
        } else {
          this._currentOperationTypes = dataSource.operationTypes();

          const change: DataChange = isDefined(e)
            ? {
              ...e,
              changeType: e?.changeType ?? 'refresh',
            // need to cast, because in virtual scrolling with scrolling.legacyMode, e has more fields
            } as DataChange
            : { changeType: 'refresh' };

          that.updateItems(change, true);
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

  private _handleLoadingChanged(isLoading) {
    this._isLoading = isLoading;
    this._fireLoadingChanged();
  }

  /**
   * @extended: state_storing
   */
  protected _handleLoadError(e) {
    this.dataErrorOccurred.fire(e);
  }

  protected _handleDataPushed(changes) {
    this.pushed.fire(changes);
  }

  public fireError(...args: unknown[]) {
    this.dataErrorOccurred.fire(errors.Error(...args));
  }

  private applyPagingOptions(dataSource: PagingDataSource): PagingChanges {
    const { scrolling, paging } = this.option();

    // Not paging state to reconcile, but a per-load request flag: infinite
    // scrolling detects the last page locally and needs no grand total.
    dataSource.requireTotalCount(scrolling?.mode !== 'infinite');

    return syncPaging(dataSource, {
      paginate: resolvePaginate(paging?.enabled, scrolling?.mode),
      pageSize: paging?.pageSize,
      pageIndex: paging?.pageIndex,
    });
  }

  protected _getSpecificDataSourceOption() {
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

  protected _initDataSource(): void {
    const hadDataSource = !!this._dataSource;

    super._initDataSource();

    // The raw DataSource for the new options, or null when there is no
    // dataSource option. `setDataSource` below wraps it in the adapter.
    const dataSource = this._dataSource;
    this._useSortingGroupingFromColumns = true;
    this._cachedProcessedItems = null;

    if (dataSource) {
      const { isPageIndexChanged } = this.applyPagingOptions(dataSource);

      this._isPaging = isPageIndexChanged;
      this.setDataSource(dataSource);
    } else if (hadDataSource) {
      this.updateItems();
    }
  }

  /**
   * @extended: selection, virtual_scrolling
   */
  // The mixin base types this as `void`, but the override returns a Deferred
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected _loadDataSource(): DeferredObj<unknown> {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error Deferred lacks a construct signature in its typings
    const result: DeferredObj<unknown> = new Deferred();

    when(this._columnsController.refresh(true)).always(() => {
      if (dataSource) {
        dataSource.load().done((...args: unknown[]) => {
          that._isPaging = false;
          result.resolve(...args);
        }).fail(result.reject);
      } else {
        result.resolve();
      }
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return result.promise();
  }

  /**
   * @extended: DataGrid's grouping
   */
  protected _beforeProcessItems(items: RawItemData[]): RawItemData[] {
    return items.slice(0);
  }

  /**
   * @extended: virtual_scrolling
   */
  protected getRowIndexDelta() {
    return 0;
  }

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getDataIndex(change: DataChange): number { return 0; }

  /**
   * @extended: adaptivity, editing, master_detail, virtual_scrolling
   */
  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const rowIndexDelta = this.getRowIndexDelta();
    const { changeType } = change;
    const visibleColumns = this._columnsController.getVisibleColumns(null, changeType === 'loadingAll');
    const dataIndex = this.getDataIndex(change);

    const options: ItemProcessingOptions = {
      visibleColumns,
      dataIndex,
    };
    const result: ProcessedItem[] = [];

    items.forEach((item, index) => {
      if (isDefined(item)) {
        options.rowIndex = index - rowIndexDelta;
        result.push(this._processItem(item, options));
      }
    });

    return result;
  }

  /**
   * @extended: editing, grouping (DataGrid)
   */
  protected _processItem(dataItem: RawItemData, options: ItemProcessingOptions): ProcessedItem {
    const generatedItem = this._generateDataItem(dataItem, options);
    const processedItem = this._processDataItem(generatedItem, options);

    options.dataIndex += 1;

    return processedItem;
  }

  /**
   * @extended: treelist
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _generateDataItem(data: RawItemData, options?: ItemProcessingOptions): GeneratedItem {
    return {
      rowType: 'data',
      data,
      key: this.keyOf(data),
    };
  }

  /**
   * @extended: selection, editing, master_detail, TreeList's master_detail
   */
  protected _processDataItem(
    generatedItem: GeneratedItem,
    options: ItemProcessingOptions,
  ): ProcessedItem {
    return {
      ...generatedItem,
      values: generateRowValues(generatedItem.data, options.visibleColumns),
      dataIndex: options.dataIndex,
    };
  }

  /**
   * @extende: virtual_scrolling, focus, selection
   */
  protected _applyChange(change: DataChange) {
    const that = this;

    if (!('changeType' in change)) {
      return;
    }

    if (change.changeType === 'update') {
      that._applyChangeUpdate(change);
    } else if (change.changeType === 'refresh') {
      if (that.items().length && change.repaintChangesOnly) {
        that._applyChangesOnly(change);
      } else {
        that._applyChangeFull(change);
      }
    }
  }

  private _applyChangeFull(change) {
    this._items = change.items.slice(0);
  }

  private _getRowIndices(change) {
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
  protected _applyChangeUpdate(change) {
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

  /**
   * @extended: editing, validating
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
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
  protected _getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
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
        const isRowStateEquals = newItem.isExpanded === oldItem.isExpanded
        && newItem.data.isContinuation === oldItem.data.isContinuation
        && newItem.data.isContinuationOnNextPage === oldItem.data.isContinuationOnNextPage;

        if (isRowStateEquals) {
          columnIndices = oldItem.cells.map((cell, index) => (cell.column?.type !== 'groupExpand' ? index : -1)).filter((index) => index >= 0);
        }
      }
    }
    return columnIndices;
  }

  private _partialUpdateRow(oldItem, newItem, visibleRowIndex, isLiveUpdate?) {
    let changedColumnIndices = this._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);

    if (changedColumnIndices?.length && this.option('dataRowTemplate')) {
      changedColumnIndices = undefined;
    }

    if (changedColumnIndices) {
      oldItem.cells?.forEach((cell, columnIndex) => {
        const isCellChanged = changedColumnIndices.indexOf(columnIndex) >= 0;
        if (!isCellChanged && cell?.update) {
          cell.update(newItem);
        }
      });

      newItem.update = oldItem.update;
      newItem.watch = oldItem.watch;
      newItem.cells = oldItem.cells;

      if (isLiveUpdate) {
        newItem.oldValues = oldItem.values;
      }

      oldItem.update?.(newItem);
    }

    return changedColumnIndices;
  }

  protected _isItemEquals(item1, item2) {
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

  /**
   * @extended: editing
   */
  protected _applyChangesOnly(change) {
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
        item1.update?.(item2);
        item1.cells.forEach((cell) => {
          if (cell?.update) {
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

    const result = findChanges({
      oldItems,
      newItems: change.items,
      getKey: getRowKey,
      isItemEquals,
    });

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

  /**
   * @extended: keyboard_navigation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _correctRowIndices(rowIndex: any): any { }

  /**
   * @extend: virtual_scrolling
   */
  protected _afterProcessItems(items: ProcessedItem[]): ProcessedItem[] {
    return items;
  }

  /**
   * @extende: virtual_scrolling, editing
   */
  protected _updateItemsCore(change: DataChange): void {
    const dataSource = this._dataSource;

    change.operationTypes ??= this._currentOperationTypes;
    this._currentOperationTypes = null;

    if (dataSource) {
      const getProcessedItems = (): ProcessedItem[] => {
        const cachedProcessedItems = this._cachedProcessedItems;
        const useProcessedItemsCache = 'useProcessedItemsCache' in change && change.useProcessedItemsCache;

        if (useProcessedItemsCache && cachedProcessedItems) {
          return cachedProcessedItems;
        }

        // change.items at this stage is defined only if virtualScrolling + legacyScrollingMode enabled
        const dataItems = this._beforeProcessItems(change.items ?? dataSource.items());
        const processedItems = this._processItems(dataItems, change);

        this._cachedProcessedItems = processedItems;

        return processedItems;
      };

      const items = this._afterProcessItems(getProcessedItems());
      const oldItems = this._items.length === items.length ? this._items : null;

      change.items = items;

      this._applyChange(change);

      const rowIndexDelta = this.getRowIndexDelta();

      this._items.forEach((item, index) => {
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

  private _handleChanging(e) {
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

  public updateItems(
    change: DataChange = { changeType: 'refresh' },
    isDataChanged?: boolean,
  ) {
    change.isFirstRender = !this.changed.fired();

    if (this._repaintChangesOnly !== undefined) {
      change.repaintChangesOnly ??= this._repaintChangesOnly;
      change.needUpdateDimensions = change.needUpdateDimensions || this._needUpdateDimensions;
    } else if (change.changes) {
      change.repaintChangesOnly = this.option('repaintChangesOnly');
    } else if (isDataChanged) {
      const operationTypes = this.dataSource().operationTypes();

      change.isDataChanged = true;
      change.repaintChangesOnly = operationTypes && !operationTypes.grouping && !operationTypes.filtering && this.option('repaintChangesOnly');

      if (this.needUpdateDimensions(operationTypes)) {
        change.needUpdateDimensions = true;
      }
    }

    if (this._updateLockCount && !change.cancel) {
      this._changes.push(change);
      return;
    }

    this._updateItemsCore(change);

    if (change.cancel) return;

    this._fireChanged(change);
  }

  protected needUpdateDimensions(operationTypes: OperationTypes) {
    return operationTypes && (
      operationTypes.reload || operationTypes.paging || operationTypes.groupExpanding
    );
  }

  public loadingOperationTypes() {
    const dataSource = this.dataSource();

    return dataSource?.loadingOperationTypes() || {};
  }

  /**
   * @extended: virtual_scrolling, focus
   */
  protected _fireChanged(change) {
    deferRender(() => {
      this.changed.fire(change);
    });
  }

  /**
   * @extended: state_storing
   */
  public isLoading() {
    return this._isLoading || this._isCustomLoading;
  }

  private _fireLoadingChanged() {
    this.loadingChanged.fire(this.isLoading(), this._loadingText);
  }

  /**
   * @extended: filter_row, filter_sync, header_filter, search
   */
  protected _calculateAdditionalFilter(): DataFilter {
    return null;
  }

  /**
   * @extended: filter_sync, virtual_scrolling
   */
  protected _applyFilter(): DeferredObj<unknown> {
    const dataSource = this._dataSource;

    if (dataSource) {
      dataSource.pageIndex(0);
      if (this.option('paging.pageIndex')) {
        this._silentOption('paging.pageIndex', 0);
      }
      this._isFilterApplying = true;

      return this.reload().done(() => {
        if (this._isFilterApplying) {
          this.pageChanged.fire();
        }
      });
    }

    return Deferred().resolve();
  }

  public resetFilterApplying(): void {
    this._isFilterApplying = false;
  }

  private filter(): DataFilter;
  private filter(filterExpr: DataFilter): void;
  private filter(...binaryFilterExpr: BinaryDataFilterExpression): void;
  private filter(...filterArgs: [] | [DataFilter] | BinaryDataFilterExpression): DataFilter | void {
    const filter: DataFilter = this._dataSource?.filter();
    const langParams = this._dataSource?.loadOptions?.()?.langParams;

    if (filterArgs.length === 0) {
      return filter;
    }

    const filterExpr: DataFilter = filterArgs.length === 1 ? filterArgs[0] : filterArgs;

    if (gridCoreUtils.equalFilterParameters(filter, filterExpr, langParams)) {
      return;
    }

    this._dataSource?.filter(filterExpr);
    this._applyFilter();
  }

  /**
   * @extended: filter_sync
   */
  protected clearFilter(filterName?: string): void {
    const that = this;
    const columnsController = that._columnsController;
    const clearColumnOption = (optionName: string): void => {
      const columnCount = columnsController.columnCount();

      for (let index = 0; index < columnCount; index += 1) {
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

  private _fireDataSourceChanged() {
    const that = this;

    const changedHandler = function () {
      that.changed.remove(changedHandler);
      that.dataSourceChanged.fire();
    };

    that.changed.add(changedHandler);
  }

  protected _getDataSourceAdapter(): any {}

  protected _createDataSourceAdapter(dataSource) {
    const dataSourceAdapterProvider = this._getDataSourceAdapter();
    const dataSourceAdapter = dataSourceAdapterProvider.create(this.component);

    dataSourceAdapter.init(dataSource);
    return dataSourceAdapter;
  }

  private setDataSource(dataSource) {
    const that = this;
    const oldDataSource = that._dataSource;

    if (!dataSource && oldDataSource) {
      oldDataSource.cancelAll();
      oldDataSource.changed.remove(that._dataChangedHandlerProxy);
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
      dataSource.changed.add(that._dataChangedHandlerProxy);
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
  public items(byLoaded?: boolean): ProcessedItem[] {
    return this._items;
  }

  /**
   * @extended: virtual_scrolling
   */
  public isEmpty() {
    return !this.items().length;
  }

  public pageCount() {
    return this._dataSource ? this._dataSource.pageCount() : 1;
  }

  public dataSource() {
    return this._dataSource;
  }

  public store() {
    const dataSource = this._dataSource;
    return dataSource?.store();
  }

  public loadAll(data, skipFilter = false) {
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
            filter: skipFilter ? null : that.getCombinedFilter(),
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
          d.resolve(items, extra?.summary);
        }).fail(d.reject);
      } else {
        d.reject();
      }
    } else {
      d.resolve([]);
    }
    return d;
  }

  public getKeyByRowIndex(rowIndex, byLoaded?) {
    const item = this.items(byLoaded)[rowIndex];
    if (item) {
      return item.key;
    }
  }

  public getRowIndexByKey(key, byLoaded?) {
    return gridCoreUtils.getIndexByKey(key, this.items(byLoaded));
  }

  public getRowByKey(key: unknown): ProcessedItem | undefined {
    return this.items()?.[this.getRowIndexByKey(key)];
  }

  public keyOf(data) {
    const store = this.store();
    if (store) {
      return store.keyOf(data);
    }
  }

  private byKey(key) {
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

  public key() {
    const store = this.store();

    if (store) {
      return store.key();
    }
  }

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getRowIndexOffset(byLoadedRows?: boolean) {
    return 0;
  }

  private getDataByKeys(rowKeys) {
    const that = this;
    // @ts-expect-error
    const result = new Deferred();
    const deferreds: any[] = [];
    const data: any[] = [];

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

  private changePaging(optionName: PagingOptionName, value?: number): PagingResult {
    const dataSource = this._dataSource;

    if (!dataSource) {
      return optionName === 'pageIndex' && value !== undefined
        ? Deferred().resolve().promise()
        : 0;
    }

    if (value === undefined) {
      return dataSource[optionName]() as number;
    }

    const oldValue = this._getPagingOptionValue(optionName);
    if (oldValue === value) {
      return Deferred().resolve().promise();
    }

    this._skipProcessingPagingChange = true;
    if (optionName === 'pageSize' && value === 0) {
      dataSource.pageIndex(0);
      this.option('paging.pageIndex', 0);
    }
    dataSource[optionName](value);
    this.option(`paging.${optionName}`, value);
    this._skipProcessingPagingChange = false;

    const pageIndex = dataSource.pageIndex();
    this._isPaging = optionName === 'pageIndex';

    const loadResult: DeferredObj<unknown> = dataSource[optionName === 'pageIndex' ? 'load' : 'reload']();

    return loadResult.done(() => {
      this._isPaging = false;
      this.pageChanged.fire(pageIndex);
    });
  }

  /**
   * @extended: virtual_scrolling
   */
  public pageIndex(): number;
  public pageIndex(value: number): DeferredObj<unknown>;
  public pageIndex(value?: number): PagingResult {
    return this.changePaging('pageIndex', value);
  }

  public pageSize(): number;
  public pageSize(value: number): PagingResult;
  public pageSize(value?: number): PagingResult {
    return this.changePaging('pageSize', value);
  }

  public isCustomLoading() {
    return this._isCustomLoading || this._dataSource?.isCustomLoading();
  }

  public beginCustomLoading(messageText?: string) {
    this._isCustomLoading = true;
    this._loadingText = messageText ?? '';
    this._fireLoadingChanged();
  }

  public endCustomLoading() {
    this._isCustomLoading = false;
    this._loadingText = undefined;
    this._fireLoadingChanged();
  }

  /**
   * @extended: virtual_scrolling, selection
   */
  public refresh(options) {
    if (options === true) {
      options = { reload: true, changesOnly: true };
    } else if (!options) {
      options = { reload: true, lookup: true };
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
        // @ts-expect-error `customizeLoadResult` is an internal DataSource event
        dataSource?.on('customizeLoadResult', customizeLoadResult);

        when(that.reload(options.reload, changesOnly)).always(() => {
          // @ts-expect-error `customizeLoadResult` is an internal DataSource event
          dataSource?.off('customizeLoadResult', customizeLoadResult);
          that._repaintChangesOnly = undefined;
        }).done(d.resolve).fail(d.reject);
      } else {
        that.updateItems({
          changeType: 'refresh',
          repaintChangesOnly: options.changesOnly,
        });
        d.resolve();
      }
    });

    return d.promise();
  }

  public getVisibleRows() {
    return this.items();
  }

  protected _disposeDataSource() {
    if (this._dataSource?._eventsStrategy) {
      this._dataSource._eventsStrategy.off('loadingChanged', this.readyWatcher);
    }
    this.setDataSource(null);
  }

  public dispose() {
    this._disposeDataSource();
    super.dispose();
  }

  /**
   * @extended editing
   */
  public repaintRows(rowIndexes, changesOnly) {
    rowIndexes = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];

    if (rowIndexes.length > 1 || isDefined(rowIndexes[0])) {
      this.updateItems({
        changeType: 'update',
        rowIndices: rowIndexes,
        isFullUpdate: !changesOnly,
      });
    }
  }

  public skipProcessingPagingChange(fullName) {
    return this._skipProcessingPagingChange && (fullName === 'paging.pageIndex' || fullName === 'paging.pageSize');
  }

  /**
   * @extended: TreeList's state_storing
   */
  public getUserState(): any {
    return {
      searchText: this.option('searchPanel.text'),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    };
  }

  public getCachedStoreData() {
    return this._dataSource?.getCachedStoreData();
  }

  /**
   * @extended: virtual_scrolling
   */
  public isLastPageLoaded() {
    const pageIndex = this.pageIndex();
    const pageCount = this.pageCount();
    return pageIndex === (pageCount - 1);
  }

  public load(): any {
    return this._dataSource?.load();
  }

  /**
   * @extended: editing, virtual_scrolling
   */

  public reload(reload?, changesOnly?): any {
    return this._dataSource?.reload(reload, changesOnly);
  }

  public push(...args) {
    return this._dataSource?.push(...args);
  }

  private itemsCount() {
    return this._dataSource ? this._dataSource?.itemsCount() : 0;
  }

  public totalItemsCount() {
    return this._dataSource ? this._dataSource?.totalItemsCount() : 0;
  }

  public hasKnownLastPage() {
    return this._dataSource ? this._dataSource?.hasKnownLastPage() : true;
  }

  /**
   * @extended: state_storing
   */
  public isLoaded() {
    return this._dataSource ? this._dataSource?.isLoaded() : true;
  }

  public totalCount() {
    return this._dataSource ? this._dataSource?.totalCount() : 0;
  }

  public hasLoadOperation(): boolean {
    const operationTypes = this._dataSource?.operationTypes() ?? {};

    return Object.keys(operationTypes).some((type) => operationTypes[type]);
  }

  /**
   * @extended: virtual_scrolling
   */
  public isViewportChanging(): boolean {
    return false;
  }

  public resetCachedProcessedItems(): void {
    this._cachedProcessedItems = null;
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
