import type { Store } from '@js/common/data';
import type { Callback } from '@js/core/utils/callbacks';
import { deferRender } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import errors from '@js/ui/widget/ui.errors';
import { findChanges } from '@ts/core/utils/m_array_compare';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type { ChangingEvent, DataSource, StoreLoadOptions } from '@ts/data/data_source/types';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  ChangedEvent, DataSourceAdapterProvider, LoadOperation, OperationTypes, RawItemData,
} from '@ts/grids/grid_core/data_source_adapter/types';
import { isLocalStore } from '@ts/grids/grid_core/data_source_adapter/utils/store';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { FilterSyncController } from '@ts/grids/grid_core/filter/m_filter_sync';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import modules from '@ts/grids/grid_core/m_modules';
import type {
  Controllers, Module, OptionChanged, RowKey,
} from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { VirtualScrollController } from '@ts/grids/grid_core/virtual_scrolling/m_virtual_scrolling_core';

import { DataHelperMixin } from './data_helper_mixin';
import type {
  BinaryDataFilterExpression,
  CallbackFlags,
  ChangedRows,
  DataChange,
  DataFilter,
  DataSourceAdapterLike,
  GeneratedItem,
  ItemChange,
  ItemProcessingOptions,
  PagingChanges,
  PagingDataSource,
  PagingOptionName,
  PagingResult,
  ProcessedItem,
  RefreshOptions,
  RowIndexByKey,
  RowIndexCorrection,
  UpdateChange,
  UpdateRowChange,
  UserState,
} from './types';
import { resolvePaginate, syncPaging } from './utils/paging';
import { getRefreshOptions } from './utils/refresh';
import {
  getChangedRowIndices,
  getDataRowIndex,
  getRowKey,
  getRowOperation,
  indexRowsByKey,
  initChangedRows,
  isSameGroupRowState,
  markUpdateChange,
  pushChangedRow,
  resetChangedRows,
  updateRowCells,
} from './utils/row_changes';
import { generateRowValues } from './utils/row_values';

export class DataController extends DataHelperMixin(modules.Controller) {
  protected _items!: ProcessedItem[];

  private _cachedProcessedItems!: ProcessedItem[] | null;

  protected _isPaging!: boolean;

  private _currentOperationTypes!: OperationTypes | null;

  protected _isLoading!: boolean;

  private _isCustomLoading!: boolean;

  protected _repaintChangesOnly?: boolean;

  protected changes!: DataChange[];

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

  public pushed!: Callback<[StoreChange[]]>;

  public changed!: Callback<[DataChange]>;

  public loadingChanged!: Callback<[boolean, string?]>;

  public dataSourceChanged!: Callback<[]>;

  public rowIndicesChanged!: Callback<[RowIndexCorrection]>;

  protected _lastRenderingPageIndex?: number;

  protected _isPagingByRendering?: boolean;

  // TODO public controller
  public _columnsController!: Controllers['columns'];

  protected _adaptiveColumnsController!: Controllers['adaptiveColumns'];

  // TODO public controller
  public _rowsScrollController?: VirtualScrollController | null;

  protected _editingController!: EditingController;

  protected _filterSyncController!: FilterSyncController;

  private _filterExcludedColumn: Column | null = null;

  protected _focusController!: FocusController;

  private loadErrorHandlerProxy!: (e: Error | string) => void;

  private dataPushedHandlerProxy!: (changes: StoreChange[]) => void;

  private dataChangedHandlerProxy!: (e?: ChangedEvent) => void;

  public init(): void {
    this._items = [];
    this._cachedProcessedItems = null;
    this._columnsController = this.getController('columns');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editingController = this.getController('editing');
    this._filterSyncController = this.getController('filterSync');
    this._focusController = this.getController('focus');

    this._isPaging = false;
    this._currentOperationTypes = null;
    this.dataChangedHandlerProxy = this.dataChangedHandler.bind(this);
    this.loadErrorHandlerProxy = this.loadErrorHandler.bind(this);
    this.dataPushedHandlerProxy = this.dataPushedHandler.bind(this);

    this._columnsController.columnsChanged.add(this.columnsChangedHandler.bind(this));

    this._isLoading = false;
    this._isCustomLoading = false;
    this._repaintChangesOnly = undefined;
    this.changes = [];

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
    return ['changed', 'loadingChanged', 'dataErrorOccurred', 'pageChanged', 'dataSourceChanged', 'pushed', 'rowIndicesChanged'];
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
        if (isLocalStore(store)) {
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

  public getFilterExcludedColumn(): Column | null {
    return this._filterExcludedColumn;
  }

  public getCombinedFilterWithExcludedColumn(
    excludedColumn: Column | null,
    returnDataField?: boolean,
  ): DataFilter {
    this._filterExcludedColumn = excludedColumn;
    try {
      return this.getCombinedFilter(returnDataField);
    } finally {
      this._filterExcludedColumn = null;
    }
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
    const { changes } = this;

    if (changes.length) {
      this.changes = [];
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
  private readonly customizeStoreLoadOptionsHandler = (e: LoadOperation): void => {
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
    try {
      columnsController.updateSortingGrouping(dataSource, !this._useSortingGroupingFromColumns);
    } finally {
      this._columnsUpdating = false;
    }

    storeLoadOptions.sort = columnsController.getSortDataSourceParameters();
    storeLoadOptions.group = columnsController.getGroupDataSourceParameters();
    dataSource.sort(storeLoadOptions.sort);
    dataSource.group(storeLoadOptions.group);

    storeLoadOptions.sort = columnsController
      .getSortDataSourceParameters(!dataSource.remoteOperations().sorting);

    e.group = columnsController
      .getGroupDataSourceParameters(!dataSource.remoteOperations().grouping);
  };

  private updateItemsAfterColumnsChanged(): void {
    const updateItemsHandler = (change: ColumnsChanges): void => {
      this._columnsController.columnsChanged.remove(updateItemsHandler);

      this.updateItems({
        changeType: 'refresh',
        repaintChangesOnly: false,
        event: change?.changeTypes?.event,
        virtualColumnsScrolling: change?.changeTypes?.virtualColumnsScrolling,
      });
    };

    // TODO remove resubscribing
    this._columnsController.columnsChanged.add(updateItemsHandler);
  }

  private shouldUpdateItemsAfterColumnsChange(optionNames: ColumnsChanges['optionNames']): boolean {
    const excludedOptionNames = [
      'width',
      'visibleWidth',
      'filterValue',
      'bufferedFilterValue',
      'selectedFilterOperation',
      'filterValues',
      'filterType',
    ];

    return !this._needApplyFilter && !gridCoreUtils.checkChanges(optionNames, excludedOptionNames);
  }

  private shouldApplyFilter(e: ColumnsChanges): boolean {
    const { optionNames, columnIndex } = e;
    const filterValues = this._columnsController.columnOption(columnIndex, 'filterValues');

    const isFilterOptionChanged = Boolean(optionNames.filterValues)
      || Boolean(optionNames.filterValue)
      || Boolean(optionNames.selectedFilterOperation)
      || Boolean(optionNames.allowFiltering)
      || Boolean(optionNames.filterType && Array.isArray(filterValues));

    if (!isFilterOptionChanged) {
      return false;
    }

    const isImmediateFilterChange = !optionNames.selectedFilterOperation
      || optionNames.filterValue;

    if (isImmediateFilterChange) {
      return true;
    }

    if (columnIndex === undefined) {
      return true;
    }

    const filterValue = this._columnsController.columnOption(columnIndex, 'filterValue');
    const hasFilterValue = isDefined(filterValue) || Array.isArray(filterValues);

    return hasFilterValue;
  }

  private columnsChangedHandler(e: ColumnsChanges): void {
    const { changeTypes, optionNames } = e;
    let filterApplied = false;

    if (changeTypes.sorting || changeTypes.grouping) {
      if (this._dataSource && !this._columnsUpdating) {
        this._dataSource.group(this._columnsController.getGroupDataSourceParameters());
        this._dataSource.sort(this._columnsController.getSortDataSourceParameters());
        this.reload();
      }
    } else if (changeTypes.columns) {
      if (this.shouldApplyFilter(e)) {
        this._applyFilter();
        filterApplied = true;
      }

      if (this.shouldUpdateItemsAfterColumnsChange(optionNames)) {
        this.updateItemsAfterColumnsChanged();
      }

      if (isDefined(optionNames.visible)) {
        const column = this._columnsController.columnOption(e.columnIndex);
        const hasFilterValue = isDefined(column?.filterValue) || isDefined(column?.filterValues);

        if (hasFilterValue) {
          this._applyFilter();
          filterApplied = true;
        }
      }
    }

    if (!filterApplied && changeTypes.filtering && !this._needApplyFilter) {
      this.reload();
    }
  }

  /**
   * @extended: selection
   */
  protected dataChangedHandler(e?: ChangedEvent): void {
    const dataSource = this._dataSource;
    let isAsyncDataSourceApplying = false;

    this._useSortingGroupingFromColumns = false;

    if (dataSource && !this._isDataSourceApplying) {
      this._isDataSourceApplying = true;

      when(this._columnsController.applyDataSource(dataSource)).done(() => {
        if (this._isLoading) {
          this.loadingChangedHandler(false);
        }

        // @ts-expect-error e.isDelayed is set for virtual scrolling with scrolling.legacyMode
        if (isAsyncDataSourceApplying && e?.isDelayed) {
          // @ts-expect-error e.isDelayed is set for virtual scrolling with scrolling.legacyMode
          e.isDelayed = false;
        }

        this._isDataSourceApplying = false;

        const hasAdditionalFilter = (): boolean => {
          const additionalFilter = this._calculateAdditionalFilter();
          return Boolean(additionalFilter?.length);
        };

        const needApplyFilter = this._needApplyFilter;
        this._needApplyFilter = false;

        if (needApplyFilter && !this._isAllDataTypesDefined && hasAdditionalFilter()) {
          errors.log('W1005', this.component.NAME);
          this._applyFilter();
        } else {
          this._currentOperationTypes = dataSource.operationTypes();

          const change: DataChange = isDefined(e)
            ? {
              ...e,
              changeType: e?.changeType ?? 'refresh',
            // in virtual scrolling with scrolling.legacyMode, e has more fields
            } as DataChange
            : { changeType: 'refresh' };

          this.updateItems(change, true);
        }
      }).fail(() => {
        this._isDataSourceApplying = false;
      });

      if (this._isDataSourceApplying) {
        isAsyncDataSourceApplying = true;
        this.loadingChangedHandler(true);
      }

      this._needApplyFilter = !this._columnsController.isDataSourceApplied();
      this._isAllDataTypesDefined = this._columnsController.isAllDataTypesDefined();
    }
  }

  private readonly loadingChangedHandler = (isLoading: boolean): void => {
    this._isLoading = isLoading;
    this._fireLoadingChanged();
  };

  /**
   * @extended: state_storing
   */
  protected loadErrorHandler(e: Error | string): void {
    this.dataErrorOccurred.fire(e);
  }

  protected dataPushedHandler(changes: StoreChange[]): void {
    this.pushed.fire(changes);
  }

  public fireError(...args: unknown[]): void {
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

  protected _getSpecificDataSourceOption(): unknown {
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
    const dataSource = this._dataSource;
    const result: DeferredObj<unknown> = Deferred();

    when(this._columnsController.refresh(true)).always(() => {
      if (dataSource) {
        dataSource.load().done((...args: unknown[]) => {
          this._isPaging = false;
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
  protected getRowIndexDelta(): number {
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
    const { changeType } = change;

    const visibleColumns = this._columnsController.getVisibleColumns(null, changeType === 'loadingAll');
    const dataIndex = this.getDataIndex(change);
    const rowIndexDelta = this.getRowIndexDelta();

    const options: ItemProcessingOptions = {
      visibleColumns,
      dataIndex,
    };
    const result: ProcessedItem[] = [];

    items.forEach((item, index: number) => {
      if (!isDefined(item)) {
        return;
      }

      options.rowIndex = index - rowIndexDelta;
      result.push(this._processItem(item, options));
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
  protected _applyChange(change: DataChange): void {
    if (!('changeType' in change)) {
      return;
    }

    if (change.changeType === 'update') {
      this.applyChangeUpdate(change);
    } else if (change.changeType === 'refresh') {
      if (this.items().length && change.repaintChangesOnly) {
        this.applyChangesOnly(change);
      } else {
        this._applyChangeFull(change);
      }
    }
  }

  private _applyChangeFull(change: DataChange): void {
    this._items = (change.items ?? []).slice(0);
  }

  private updateRow(
    newItem: ProcessedItem,
    rowIndex: number,
    visibleRowIndex: number,
    isPartialUpdate: boolean,
  ): UpdateRowChange {
    const oldItem = this._items[rowIndex];

    this._items[rowIndex] = newItem;

    if (oldItem.visible !== newItem.visible) {
      return {
        changeType: 'update',
        rowIndex: visibleRowIndex,
        item: { visible: newItem.visible } as ProcessedItem,
      };
    }

    return {
      changeType: 'update',
      rowIndex: visibleRowIndex,
      item: newItem,
      columnIndices: isPartialUpdate
        ? this._partialUpdateRow(oldItem, newItem, visibleRowIndex)
        : undefined,
    };
  }

  private applyRowOperation(
    newItems: ProcessedItem[],
    rowIndex: number,
    rowIndexDelta: number,
    isPartialUpdate: boolean,
  ): UpdateRowChange | undefined {
    const visibleRowIndex = rowIndex - rowIndexDelta;
    const item = newItems[rowIndex];

    if (item) {
      item.rowIndex = rowIndex;
    }

    switch (getRowOperation(this._items, newItems, rowIndex)) {
      case 'update':
        return this.updateRow(item, rowIndex, visibleRowIndex, isPartialUpdate);
      case 'insert':
        this._items.splice(rowIndex, 0, item);
        return { changeType: 'insert', rowIndex: visibleRowIndex, item };
      case 'remove':
        this._items.splice(rowIndex, 1);
        return { changeType: 'remove', rowIndex: visibleRowIndex, item };
      case 'replace':
        this._items[rowIndex] = item;
        return { changeType: 'update', rowIndex: visibleRowIndex, item };
      default:
        return undefined;
    }
  }

  /**
   * @extended: editing
   */
  protected applyChangeUpdate(change: UpdateChange): void {
    const newItems = change.items ?? [];
    const rowIndexDelta = this.getRowIndexDelta();
    const isPartialUpdate = Boolean(this.option('repaintChangesOnly')) && !change.isFullUpdate;
    const rowIndices = getChangedRowIndices(
      change.rowIndices,
      rowIndexDelta,
      change.allowInvisibleRowIndices,
    );
    const changedRows = resetChangedRows(change);
    let prevRowIndex = -1;
    let rowIndexCorrection = 0;

    rowIndices.forEach((changedRowIndex: number) => {
      const rowIndex = changedRowIndex + rowIndexCorrection + rowIndexDelta;

      if (prevRowIndex === rowIndex) {
        return;
      }

      prevRowIndex = rowIndex;

      const changedRow = this.applyRowOperation(newItems, rowIndex, rowIndexDelta, isPartialUpdate);

      if (!changedRow) {
        return;
      }

      pushChangedRow(changedRows, changedRow);

      if (changedRow.changeType === 'insert') {
        rowIndexCorrection += 1;
      } else if (changedRow.changeType === 'remove') {
        rowIndexCorrection -= 1;
        prevRowIndex = -1;
      }
    });
  }

  /**
   * @extended: editing, validating
   */
  protected _isCellChanged(
    oldRow: ProcessedItem,
    newRow: ProcessedItem,
    visibleRowIndex: number,
    columnIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLiveUpdate?: boolean,
  ): boolean {
    const oldValue = oldRow.values[columnIndex];
    const newValue = newRow.values[columnIndex];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      return true;
    }

    const isCellModified = (
      row: ProcessedItem,
    ): boolean => row.modifiedValues?.[columnIndex] !== undefined;

    return isCellModified(oldRow) !== isCellModified(newRow);
  }

  /**
   * @extended: editing_row_based, editing, editing_form_based
   */
  protected _getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    if (oldItem.rowType !== newItem.rowType) {
      return undefined;
    }

    if (newItem.rowType === 'group') {
      if (!oldItem.cells || !isSameGroupRowState(oldItem, newItem)) {
        return undefined;
      }

      return oldItem.cells
        .map((cell, index) => (cell.column?.type !== 'groupExpand' ? index : -1))
        .filter((index) => index >= 0);
    }

    if (newItem.rowType === 'groupFooter') {
      return undefined;
    }

    const columnIndices: number[] = [];

    if (newItem.rowType === 'detail') {
      return columnIndices;
    }

    for (let columnIndex = 0; columnIndex < oldItem.values.length; columnIndex += 1) {
      if (this._isCellChanged(oldItem, newItem, visibleRowIndex, columnIndex, isLiveUpdate)) {
        columnIndices.push(columnIndex);
      }
    }

    return columnIndices;
  }

  private _partialUpdateRow(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    const changedColumnIndices = this
      ._getChangedColumnIndices(
        oldItem,
        newItem,
        visibleRowIndex,
        isLiveUpdate,
      );
    const columnIndices = changedColumnIndices?.length && this.option('dataRowTemplate')
      ? undefined
      : changedColumnIndices;

    if (columnIndices) {
      oldItem.cells?.forEach((cell, columnIndex) => {
        const isCellChanged = columnIndices.includes(columnIndex);
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

    return columnIndices;
  }

  protected _isItemEquals(item1: ProcessedItem, item2: ProcessedItem): boolean {
    if (JSON.stringify(item1.values) !== JSON.stringify(item2.values)) {
      return false;
    }

    const compareFields = ['modified', 'isNewRow', 'removed', 'isEditing'] as const;
    if (compareFields.some((field) => item1[field] !== item2[field])) {
      return false;
    }

    if (item1.rowType === 'group' || item1.rowType === 'groupFooter') {
      const summaryCellsMatch = JSON.stringify(item1.summaryCells)
        === JSON.stringify(item2.summaryCells);

      if (!summaryCellsMatch || !isSameGroupRowState(item1, item2)) {
        return false;
      }
    }

    return true;
  }

  private applyItemChange(
    itemChange: ItemChange,
    isLiveUpdate: boolean,
  ): UpdateRowChange | undefined {
    const { index } = itemChange;

    switch (itemChange.type) {
      case 'update': {
        const newItem = itemChange.data;
        const columnIndices = this._partialUpdateRow(
          itemChange.oldItem,
          newItem,
          index,
          isLiveUpdate,
        );

        this._items[index] = newItem;

        return {
          changeType: 'update', rowIndex: index, item: newItem, columnIndices,
        };
      }
      case 'insert':
        this._items.splice(index, 0, itemChange.data);
        return { changeType: 'insert', rowIndex: index, item: itemChange.data };
      case 'remove':
        this._items.splice(index, 1);
        return { changeType: 'remove', rowIndex: index, item: itemChange.oldItem };
      default:
        return undefined;
    }
  }

  private findItemChanges(
    oldItems: ProcessedItem[],
    newItems: ProcessedItem[],
  ): ItemChange[] | undefined {
    const isItemEquals = (item1: ProcessedItem, item2: ProcessedItem): boolean => {
      if (!this._isItemEquals(item1, item2)) {
        return false;
      }

      updateRowCells(item1, item2);

      return true;
    };

    return findChanges({
      oldItems,
      newItems,
      getKey: getRowKey,
      isItemEquals,
    });
  }

  private applyItemChanges(itemChanges: ItemChange[], isLiveUpdate: boolean): ChangedRows {
    const changedRows = initChangedRows();

    itemChanges.forEach((itemChange) => {
      const changedRow = this.applyItemChange(itemChange, isLiveUpdate);

      if (changedRow) {
        pushChangedRow(changedRows, changedRow);
      }
    });

    return changedRows;
  }

  private getRowIndexCorrection(
    rowIndex: number,
    oldItems: ProcessedItem[],
    newIndexByKey: RowIndexByKey,
  ): number {
    const oldRowIndexOffset = this._rowIndexOffset || 0;
    const rowIndexOffset = this.getRowIndexOffset();
    const oldItem = oldItems[rowIndex - oldRowIndexOffset];
    const newVisibleRowIndex = oldItem ? newIndexByKey[getRowKey(oldItem)] : undefined;

    return newVisibleRowIndex === undefined ? 0 : newVisibleRowIndex + rowIndexOffset - rowIndex;
  }

  /**
   * @extended: editing
   */
  protected applyChangesOnly(change: DataChange): void {
    const newItems = change.items ?? [];
    const oldItems = this._items.slice();
    const newIndexByKey = indexRowsByKey(newItems);
    const itemChanges = this.findItemChanges(oldItems, newItems);

    if (!itemChanges) {
      this._applyChangeFull(change);
      return;
    }

    const changedRows = this.applyItemChanges(itemChanges, change.isLiveUpdate ?? true);

    markUpdateChange(change, changedRows);

    if (oldItems.length) {
      change.isLiveUpdate = true;
    }

    this.rowIndicesChanged.fire(
      (rowIndex: number): number => this.getRowIndexCorrection(rowIndex, oldItems, newIndexByKey),
    );
  }

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

        // change.items at this stage is defined only if virtualScrolling
        // + legacyScrollingMode enabled
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

  private readonly changingHandler = (e: ChangingEvent): void => {
    const rows = this.getVisibleRows();
    const dataSource = this.dataSource();

    if (!dataSource) {
      return;
    }

    e.changes.forEach((change) => {
      if (change.type === 'insert' && change.index !== undefined && change.index >= 0) {
        change.index = getDataRowIndex(rows, change.index);
      }
    });
  };

  public updateItems(
    change: DataChange = { changeType: 'refresh' },
    isDataChanged?: boolean,
  ): void {
    change.isFirstRender = !this.changed.fired();

    if (this._repaintChangesOnly !== undefined) {
      change.repaintChangesOnly ??= this._repaintChangesOnly;
      change.needUpdateDimensions = change.needUpdateDimensions || this._needUpdateDimensions;
    } else if (change.changes) {
      change.repaintChangesOnly = this.option('repaintChangesOnly');
    } else if (isDataChanged) {
      const operationTypes: OperationTypes | undefined = this.dataSource().operationTypes();

      change.isDataChanged = true;
      change.repaintChangesOnly = operationTypes && !operationTypes.grouping
        && !operationTypes.filtering && this.option('repaintChangesOnly');

      if (this.needUpdateDimensions(operationTypes)) {
        change.needUpdateDimensions = true;
      }
    }

    if (this._updateLockCount && !change.cancel) {
      this.changes.push(change);
      return;
    }

    this._updateItemsCore(change);

    if (change.cancel) return;

    this._fireChanged(change);
  }

  /**
   * @extended: TreeList's data_controller
   */
  protected needUpdateDimensions(operationTypes?: OperationTypes): boolean {
    return Boolean(
      operationTypes?.reload || operationTypes?.paging || operationTypes?.groupExpanding,
    );
  }

  public loadingOperationTypes(): OperationTypes {
    const dataSource = this.dataSource();
    const operationTypes: OperationTypes | undefined = dataSource?.loadingOperationTypes();

    return operationTypes ?? {};
  }

  /**
   * @extended: virtual_scrolling, focus
   */
  protected _fireChanged(change: DataChange): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender((): void => {
      this.changed.fire(change);
    });
  }

  /**
   * @extended: state_storing
   */
  public isLoading(): boolean {
    return this._isLoading || this._isCustomLoading;
  }

  private _fireLoadingChanged(): void {
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
      return undefined;
    }

    this._dataSource?.filter(filterExpr);
    this._applyFilter();

    return undefined;
  }

  /**
   * @extended: filter_sync
   */
  protected clearFilter(filterName?: string): void {
    const columnsController = this._columnsController;
    const clearColumnOption = (optionName: string): void => {
      const columnCount = columnsController.columnCount();

      for (let index = 0; index < columnCount; index += 1) {
        columnsController.columnOption(index, optionName, undefined);
      }
    };

    this.component.beginUpdate();

    if (arguments.length > 0) {
      switch (filterName) {
        case 'dataSource':
          this.filter(null);
          break;
        case 'search':
          // @ts-expect-error
          this.searchByText('');
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
      this.filter(null);
      // @ts-expect-error
      this.searchByText('');
      clearColumnOption('filterValue');
      clearColumnOption('bufferedFilterValue');
      clearColumnOption('filterValues');
    }

    this.component.endUpdate();
  }

  private readonly fireDataSourceChanged = (): void => {
    this.changed.remove(this.fireDataSourceChanged);
    this.dataSourceChanged.fire();
  };

  protected _getDataSourceAdapterProvider(): DataSourceAdapterProvider {
    throw new Error('Method not implemented.');
  }

  protected _createDataSourceAdapter(dataSource: DataSource): DataSourceAdapter {
    const dataSourceAdapterProvider = this._getDataSourceAdapterProvider();
    const dataSourceAdapter = dataSourceAdapterProvider.create(this.component);

    dataSourceAdapter.init(dataSource);
    return dataSourceAdapter;
  }

  private subscribeToDataSource(dataSourceAdapter: DataSourceAdapter): void {
    dataSourceAdapter.changed.add(this.dataChangedHandlerProxy);
    dataSourceAdapter.loadingChanged.add(this.loadingChangedHandler);
    dataSourceAdapter.loadError.add(this.loadErrorHandlerProxy);
    dataSourceAdapter.customizeStoreLoadOptions.add(this.customizeStoreLoadOptionsHandler);
    dataSourceAdapter.changing.add(this.changingHandler);
    dataSourceAdapter.pushed.add(this.dataPushedHandlerProxy);
  }

  private unsubscribeFromDataSource(dataSourceAdapter: DataSourceAdapter): void {
    dataSourceAdapter.changed.remove(this.dataChangedHandlerProxy);
    dataSourceAdapter.loadingChanged.remove(this.loadingChangedHandler);
    dataSourceAdapter.loadError.remove(this.loadErrorHandlerProxy);
    dataSourceAdapter.customizeStoreLoadOptions.remove(this.customizeStoreLoadOptionsHandler);
    dataSourceAdapter.changing.remove(this.changingHandler);
    dataSourceAdapter.pushed.remove(this.dataPushedHandlerProxy);
  }

  private setDataSource(dataSource: DataSource | null): void {
    const oldDataSource = this._dataSource;

    if (!dataSource && oldDataSource) {
      oldDataSource.cancelAll();
      this.unsubscribeFromDataSource(oldDataSource);
      oldDataSource.dispose(this._isSharedDataSource);
    }

    const dataSourceAdapter = dataSource
      ? this._createDataSourceAdapter(dataSource)
      : null;

    this._dataSource = dataSourceAdapter;

    if (dataSourceAdapter) {
      this._isLoading = !dataSourceAdapter.isLoaded();
      this._needApplyFilter = true;
      this._isAllDataTypesDefined = this._columnsController.isAllDataTypesDefined();

      this.changed.add(this.fireDataSourceChanged);
      this.subscribeToDataSource(dataSourceAdapter);
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
  public isEmpty(): boolean {
    return !this.items().length;
  }

  public pageCount(): number {
    return this._dataSource ? this._dataSource.pageCount() as number : 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public dataSource(): any {
    return this._dataSource;
  }

  public store(): Store | undefined {
    return this._dataSource?.store() as Store | undefined;
  }

  public loadAll(data?: RawItemData[], skipFilter = false): DeferredObj<ProcessedItem[]> {
    const d = Deferred<ProcessedItem[]>();
    const dataSource = this._dataSource;

    if (dataSource) {
      if (data) {
        const loadOperation: Omit<LoadOperation, 'data'> & Required<Pick<LoadOperation, 'data'>> = {
          data,
          isCustomLoading: true,
          storeLoadOptions: { isLoadingAll: true },
          loadOptions: {
            filter: skipFilter ? null : this.getCombinedFilter(),
            group: dataSource.group(),
            sort: dataSource.sort(),
          },
        };
        dataSource.customizeLoadResultHandler(loadOperation);

        when<RawItemData[]>(loadOperation.data)
          .done((loadedData: RawItemData[]): void => {
            const items = this._processItems(
              this._beforeProcessItems(loadedData),
              { changeType: 'loadingAll' },
            );
            // @ts-expect-error DataGrid-only summary leaks into grid_core
            d.resolve(items, loadOperation.extra?.summary);
          })
          .fail(d.reject as (...args: unknown[]) => void);
      } else if (!dataSource.isLoading()) {
        const loadOptions: StoreLoadOptions & { isLoadingAll: boolean } = {
          ...dataSource.loadOptions(),
          isLoadingAll: true,
          requireTotalCount: false,
        };
        dataSource.load(loadOptions)
          .done((loadedItems: RawItemData[], extra: LoadOperation['extra']): void => {
            const items = this._processItems(
              this._beforeProcessItems(loadedItems),
              { changeType: 'loadingAll' },
            );
            // @ts-expect-error DataGrid-only summary leaks into grid_core
            d.resolve(items, extra?.summary);
          })
          .fail(d.reject);
      } else {
        d.reject();
      }
    } else {
      d.resolve([]);
    }

    return d;
  }

  public async getAllDataRowKeys(): Promise<RowKey[]> {
    const items = await Promise.resolve(this.loadAll(undefined));

    return items
      .filter((item) => item.rowType === 'data')
      .map((item): RowKey => item.key);
  }

  public getKeyByRowIndex(rowIndex: number, byLoaded?: boolean): RowKey | undefined {
    const item = this.items(byLoaded)[rowIndex];

    return item?.key;
  }

  public getRowIndexByKey(key: RowKey, byLoaded?: boolean): number {
    return gridCoreUtils.getIndexByKey(key, this.items(byLoaded));
  }

  public getRowByKey(key: RowKey): ProcessedItem | undefined {
    return this.items()?.[this.getRowIndexByKey(key)];
  }

  public keyOf(data: RawItemData): RowKey | undefined {
    return this.store()?.keyOf(data);
  }

  private byKey(key: RowKey): DeferredObj<RawItemData> {
    const store = this.store();

    if (!store) {
      return Deferred<RawItemData>().reject();
    }

    const rowIndex = this.getRowIndexByKey(key);

    if (rowIndex >= 0) {
      return Deferred<RawItemData>().resolve(this.items()[rowIndex].data);
    }

    return fromPromise(store.byKey(key)) as DeferredObj<RawItemData>;
  }

  public key(): string | string[] | undefined {
    return this.store()?.key();
  }

  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getRowIndexOffset(byLoadedRows?: boolean): number {
    return 0;
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
    try {
      if (optionName === 'pageSize' && value === 0) {
        dataSource.pageIndex(0);
        this.option('paging.pageIndex', 0);
      }
      dataSource[optionName](value);
      this.option(`paging.${optionName}`, value);
    } finally {
      this._skipProcessingPagingChange = false;
    }

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

  public isCustomLoading(): boolean {
    return this._isCustomLoading || !!this._dataSource?.isCustomLoading();
  }

  public beginCustomLoading(messageText?: string): void {
    this._isCustomLoading = true;
    this._loadingText = messageText ?? '';
    this._fireLoadingChanged();
  }

  public endCustomLoading(): void {
    this._isCustomLoading = false;
    this._loadingText = undefined;
    this._fireLoadingChanged();
  }

  /**
   * @extended: virtual_scrolling, selection
   */
  public refresh(options?: boolean | RefreshOptions): DeferredObj<unknown> {
    const refreshOptions = getRefreshOptions(options);

    const dataSource = this.getDataSource();
    const { changesOnly } = refreshOptions;
    const d = Deferred();

    const customizeLoadResult = (): void => {
      this._repaintChangesOnly = !!changesOnly;
    };

    const columnsRefreshResult = refreshOptions.lookup ? this._columnsController.refresh() : true;
    when(columnsRefreshResult).always(() => {
      if (refreshOptions.load || refreshOptions.reload) {
        dataSource?.on('customizeLoadResult', customizeLoadResult);

        when(this.reload(refreshOptions.reload, changesOnly)).always(() => {
          dataSource?.off('customizeLoadResult', customizeLoadResult);
          this._repaintChangesOnly = undefined;
        }).done(d.resolve as (...args: unknown[]) => void)
          .fail(d.reject as (...args: unknown[]) => void);
      } else {
        this.updateItems({
          changeType: 'refresh',
          repaintChangesOnly: refreshOptions.changesOnly,
        });
        d.resolve();
      }
    });

    // @ts-expect-error
    return d.promise();
  }

  public getVisibleRows(): ProcessedItem[] {
    return this.items();
  }

  protected _disposeDataSource(): void {
    if (this._dataSource?._eventsStrategy) {
      this._dataSource._eventsStrategy.off('loadingChanged', this.readyWatcher);
    }
    this.setDataSource(null);
  }

  public dispose(): void {
    this._disposeDataSource();
    super.dispose();
  }

  /**
   * @extended editing
   */
  public repaintRows(
    rowIndexes: number | (number | undefined)[] | undefined,
    changesOnly?: boolean,
  ): void {
    const rowIndices = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];

    if (rowIndices.length > 1 || isDefined(rowIndices[0])) {
      this.updateItems({
        changeType: 'update',
        rowIndices: rowIndices as number[],
        isFullUpdate: !changesOnly,
      });
    }
  }

  public skipProcessingPagingChange(fullName: string): boolean {
    return !!this._skipProcessingPagingChange && (fullName === 'paging.pageIndex' || fullName === 'paging.pageSize');
  }

  /**
   * @extended: TreeList's state_storing
   */
  public getUserState(): UserState {
    return {
      searchText: this.option('searchPanel.text'),
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    };
  }

  public getCachedStoreData(): RawItemData[] | undefined {
    return this._dataSource?.getCachedStoreData() as RawItemData[] | undefined;
  }

  /**
   * @extended: virtual_scrolling
   */
  public isLastPageLoaded(): boolean {
    const pageIndex = this.pageIndex();
    const pageCount = this.pageCount();
    return pageIndex === (pageCount - 1);
  }

  public load(): DeferredObj<unknown> {
    return this._dataSource?.load() as DeferredObj<unknown>;
  }

  /**
   * @extended: editing, virtual_scrolling
   */

  public reload(reload?: boolean, changesOnly?: boolean): DeferredObj<unknown> {
    return this._dataSource?.reload(reload, changesOnly) as DeferredObj<unknown>;
  }

  public push(...args: unknown[]): unknown {
    return this._dataSource?.push(...args);
  }

  private itemsCount(): number {
    return (this._dataSource ? this._dataSource.itemsCount() : 0) as number;
  }

  public totalItemsCount(): number {
    return (this._dataSource ? this._dataSource.totalItemsCount() : 0) as number;
  }

  public hasKnownLastPage(): boolean {
    return (this._dataSource ? this._dataSource.hasKnownLastPage() : true) as boolean;
  }

  /**
   * @extended: state_storing
   */
  public isLoaded(): boolean {
    return (this._dataSource ? this._dataSource.isLoaded() : true) as boolean;
  }

  public totalCount(): number {
    return (this._dataSource ? this._dataSource.totalCount() : 0) as number;
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
      dataSource: undefined,
      cacheEnabled: true,
      repaintChangesOnly: false,
      highlightChanges: false,
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
