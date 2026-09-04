import type { Callback } from '@js/core/utils/callbacks';
import { deferRender } from '@js/core/utils/common';
import { logger } from '@js/core/utils/console';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import errors from '@js/ui/widget/ui.errors';
import { findChanges } from '@ts/core/utils/m_array_compare';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type Store from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { ChangingEvent } from '@ts/data/data_source/types';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  ChangedEvent, LoadOperation, OperationTypes, RawItemData,
} from '@ts/grids/grid_core/data_source_adapter/types';
import { isLocalStore } from '@ts/grids/grid_core/data_source_adapter/utils/store';
import modules from '@ts/grids/grid_core/m_modules';
import type {
  Controllers, Module, OptionChanged, RowKey,
} from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import type { CustomLoadResult } from '../data_source_adapter/custom_loader';
import type {
  BinaryDataFilterExpression,
  CallbackFlags,
  DataChange,
  DataFilter,
  GeneratedItem,
  GetUpdatedColumnIndices,
  ItemChange,
  ItemChangeOptions,
  ItemOperationOptions,
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
  UpdateItemChange,
  UserState,
} from './types';
import { resolvePaginate, syncPaging } from './utils/paging';
import { getRefreshOptions } from './utils/refresh';
import {
  attachChangedItems,
  canDiffColumns,
  convertToUpdateChange,
  getChangedRowIndices,
  getDataRowIndex,
  getGroupColumnIndices,
  getItemChange,
  getRowKey,
  indexRowsByKey,
  partialUpdateItem,
  resolveRepaintChangesOnly,
  syncRowsAfterChange,
  updateKeptRows,
} from './utils/row_changes';
import { generateRowValues } from './utils/row_values';

export class DataController extends modules.Controller {
  public _dataSource?: DataSourceAdapter | null;

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

  private _rowIndexOffset?: number;

  private _loadingText?: string;

  public dataErrorOccurred!: Callback;

  public pageChanged!: Callback<[number?]>;

  public pushed!: Callback<[StoreChange[]]>;

  public changed!: Callback<[DataChange]>;

  public loadingChanged!: Callback<[boolean, string?]>;

  public dataSourceChanged!: Callback<[]>;

  public rowIndicesChanged!: Callback<[RowIndexCorrection]>;

  protected dataSourceController!: DataSourceController;

  // TODO public controller
  public _columnsController!: Controllers['columns'];

  private _filterExcludedColumn: Column | null = null;

  private loadErrorHandlerProxy!: (e: Error | string) => void;

  private dataPushedHandlerProxy!: (changes: StoreChange[]) => void;

  private dataChangedHandlerProxy!: (e?: ChangedEvent) => void;

  public init(): void {
    this._items = [];
    this._cachedProcessedItems = null;
    this.dataSourceController = this.getController('dataSource');
    this._columnsController = this.getController('columns');

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

    this.resetDataSource();
  }

  /**
   * TODO: Define this method only in masterDetail.
   * Remove the override from adaptive behavior
   * and move the implementation to masterDetail.
   *
   * @extended: adaptivity, master_detail
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getRowIndicesForExpand(key: RowKey): number[] {
    return [];
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _getPagingOptionValue(optionName: PagingOptionName): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._dataSource![optionName]();
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
    this.resetDataSource();
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

  public getDataSource(): DataSource | null {
    return this._dataSource?._dataSource ?? null;
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
      const additionalFilter = this.calculateAdditionalFilter();

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
    if (!dataSource) {
      return;
    }
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
        this.applyFilter();
        filterApplied = true;
      }

      if (this.shouldUpdateItemsAfterColumnsChange(optionNames)) {
        this.updateItemsAfterColumnsChanged();
      }

      if (isDefined(optionNames.visible)) {
        const column = this._columnsController.columnOption(e.columnIndex);
        const hasFilterValue = isDefined(column?.filterValue) || isDefined(column?.filterValues);

        if (hasFilterValue) {
          this.applyFilter();
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
          const additionalFilter = this.calculateAdditionalFilter();
          return Boolean(additionalFilter?.length);
        };

        const needApplyFilter = this._needApplyFilter;
        this._needApplyFilter = false;

        if (needApplyFilter && !this._isAllDataTypesDefined && hasAdditionalFilter()) {
          errors.log('W1005', this.component.NAME);
          this.applyFilter();
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

  /**
   * @extended: state_storing, virtual_scrolling
   */
  protected resetDataSource(): DeferredObj<unknown> | undefined {
    this._initDataSource();
    this._loadDataSource();

    return undefined;
  }

  protected _initDataSource(): void {
    const hadDataSource = !!this._dataSource;

    this._disposeDataSource();

    const dataSource = this.dataSourceController.createDataSource();
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
  protected _loadDataSource(): DeferredObj<unknown> {
    const dataSource = this._dataSource;
    const result: DeferredObj<unknown> = Deferred();

    when(this._columnsController.refresh(true)).always(() => {
      if (dataSource) {
        dataSource.load().done((...args: unknown[]) => {
          this._isPaging = false;
          result.resolve(...args);
        }).fail((...args: unknown[]) => { result.reject(...args); });
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
        this.applyChangeFull(change);
      }
    }
  }

  private applyChangeFull(change: DataChange): void {
    this._items = (change.items ?? []).slice();
  }

  private applyItemOperations(
    rowIndices: number[],
    options: ItemOperationOptions,
  ): UpdateItemChange[] {
    const changedRows: UpdateItemChange[] = [];
    let prevRowIndex = -1;
    let rowIndexCorrection = 0;

    rowIndices.forEach((changedRowIndex) => {
      const rowIndex = changedRowIndex + rowIndexCorrection + options.rowIndexDelta;

      if (prevRowIndex === rowIndex) {
        return;
      }

      prevRowIndex = rowIndex;

      const itemChange = getItemChange(this._items, options.newItems, rowIndex);

      if (!itemChange) {
        return;
      }

      const changedItem = this.applyItemChange(itemChange, options);

      if (!changedItem) {
        return;
      }

      changedRows.push(changedItem);

      if (changedItem.changeType === 'insert') {
        rowIndexCorrection += 1;
      } else if (changedItem.changeType === 'remove') {
        rowIndexCorrection -= 1;
        prevRowIndex = -1;
      }
    });

    return changedRows;
  }

  private applyItemChange(
    itemChange: ItemChange,
    options: ItemChangeOptions,
  ): UpdateItemChange | undefined {
    const items = this._items;
    const { index } = itemChange;
    const rowIndex = index - options.rowIndexDelta;

    switch (itemChange.type) {
      case 'insert':
        items.splice(index, 0, itemChange.data);
        return { changeType: 'insert', rowIndex, item: itemChange.data };
      case 'remove':
        items.splice(index, 1);
        return { changeType: 'remove', rowIndex, item: itemChange.oldItem };
      case 'replace':
        items[index] = itemChange.data;
        return { changeType: 'update', rowIndex, item: itemChange.data };
      case 'updateVisibility':
        items[index] = itemChange.data;
        return {
          changeType: 'update',
          rowIndex,
          item: { visible: itemChange.data.visible } as ProcessedItem,
        };
      case 'update':
        items[index] = itemChange.data;

        return partialUpdateItem(rowIndex, {
          oldItem: itemChange.oldItem,
          newItem: itemChange.data,
          isLiveUpdate: options.isLiveUpdate,
          getUpdatedColumnIndices: options.isPartialUpdate
            ? this.getUpdatedColumnIndices
            : undefined,
        });
      default:
        return undefined;
    }
  }

  /**
   * @extended: editing
   */
  protected applyChangeUpdate(change: UpdateChange): void {
    const rowIndexDelta = this.getRowIndexDelta();
    const isPartialUpdate = Boolean(this.option('repaintChangesOnly')) && !change.isFullUpdate;
    const rowIndices = getChangedRowIndices(
      change.rowIndices,
      rowIndexDelta,
      change.allowInvisibleRowIndices,
    );

    const changedRows = this.applyItemOperations(rowIndices, {
      newItems: change.items ?? [],
      rowIndexDelta,
      isPartialUpdate,
    });

    attachChangedItems(change, changedRows);
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
  protected getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    if (!canDiffColumns(oldItem, newItem)) {
      return undefined;
    }

    switch (newItem.rowType) {
      case 'group':
        return getGroupColumnIndices(oldItem, newItem);
      case 'detail':
        return [];
      default:
        return this.getChangedColumnIndicesCore(oldItem, newItem, visibleRowIndex, isLiveUpdate);
    }
  }

  private getChangedColumnIndicesCore(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] {
    const columnIndices: number[] = [];

    for (let columnIndex = 0; columnIndex < oldItem.values.length; columnIndex += 1) {
      if (this._isCellChanged(oldItem, newItem, visibleRowIndex, columnIndex, isLiveUpdate)) {
        columnIndices.push(columnIndex);
      }
    }

    return columnIndices;
  }

  private readonly getUpdatedColumnIndices: GetUpdatedColumnIndices = (
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ) => {
    const changedColumnIndices = this.getChangedColumnIndices(
      oldItem,
      newItem,
      visibleRowIndex,
      isLiveUpdate,
    );
    const hasDataRowTemplate = !!this.option('dataRowTemplate');

    return changedColumnIndices?.length && hasDataRowTemplate ? undefined : changedColumnIndices;
  };

  /**
   * @extended: editing, grouping (DataGrid), summary (DataGrid), treelist
   */
  protected isSameRowState(item1: ProcessedItem, item2: ProcessedItem): boolean {
    return JSON.stringify(item1.values) === JSON.stringify(item2.values);
  }

  private applyItemChanges(itemChanges: ItemChange[], isLiveUpdate: boolean): UpdateItemChange[] {
    return itemChanges
      .map((itemChange) => this.applyItemChange(itemChange, {
        rowIndexDelta: 0,
        isPartialUpdate: true,
        isLiveUpdate,
      }))
      .filter((changedItem): changedItem is UpdateItemChange => changedItem !== undefined);
  }

  private getRowIndexCorrection(
    rowIndex: number,
    oldItems: ProcessedItem[],
    newIndexByKey: RowIndexByKey,
  ): number {
    const oldRowIndexOffset = this._rowIndexOffset ?? 0;
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
    const itemChanges = findChanges({
      oldItems,
      newItems,
      getKey: getRowKey,
      isItemEquals: this.isSameRowState.bind(this),
    });

    // Changes cannot be found for a moved row, duplicate keys, or any throw.
    if (!itemChanges) {
      this.applyChangeFull(change);
      return;
    }

    const newIndexByKey = indexRowsByKey(newItems);

    try {
      updateKeptRows(oldItems, newItems, newIndexByKey, itemChanges);
    } catch (error) {
      logger.error(error);
      this.applyChangeFull(change);
      return;
    }

    const updateRowChanges = this.applyItemChanges(itemChanges, change.isLiveUpdate ?? true);
    convertToUpdateChange(change, updateRowChanges);

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
    change.operationTypes ??= this._currentOperationTypes;
    this._currentOperationTypes = null;

    if (!this._dataSource) {
      this._items = [];
      return;
    }

    const newItems = this._afterProcessItems(this.getProcessedItems(change));
    const oldItems = this._items.length === newItems.length ? this._items : null;

    change.items = newItems;

    this._applyChange(change);

    syncRowsAfterChange(this._items, {
      newItems,
      oldItems,
      rowIndexDelta: this.getRowIndexDelta(),
    });

    this._rowIndexOffset = this.getRowIndexOffset();
  }

  private getProcessedItems(change: DataChange): ProcessedItem[] {
    const useProcessedItemsCache = 'useProcessedItemsCache' in change && change.useProcessedItemsCache;

    if (useProcessedItemsCache && this._cachedProcessedItems) {
      return this._cachedProcessedItems;
    }

    // change.items at this stage is defined only if virtualScrolling
    // + legacyScrollingMode enabled
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const items = (change.items ?? this._dataSource!.items()) as RawItemData[];
    const dataItems = this._beforeProcessItems(items);
    const processedItems = this._processItems(dataItems, change);

    this._cachedProcessedItems = processedItems;

    return processedItems;
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
    this.fillChangeFlags(change, isDataChanged);

    if (this._updateLockCount && !change.cancel) {
      this.changes.push(change);
      return;
    }

    this._updateItemsCore(change);

    if (change.cancel) {
      return;
    }

    this._fireChanged(change);
  }

  private fillChangeFlags(change: DataChange, isDataChanged?: boolean): void {
    change.isFirstRender = !this.changed.fired();

    if (this._repaintChangesOnly !== undefined) {
      change.repaintChangesOnly ??= this._repaintChangesOnly;
      change.needUpdateDimensions ||= this._needUpdateDimensions;
      return;
    }

    if (change.changes) {
      change.repaintChangesOnly = this.option('repaintChangesOnly');
      return;
    }

    if (!isDataChanged) {
      return;
    }

    const operationTypes = this.dataSource()?.operationTypes() ?? undefined;

    change.isDataChanged = true;
    change.repaintChangesOnly = resolveRepaintChangesOnly(
      operationTypes,
      this.option('repaintChangesOnly'),
    );

    if (this.needUpdateDimensions(operationTypes)) {
      change.needUpdateDimensions = true;
    }
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
  protected calculateAdditionalFilter(): DataFilter {
    return null;
  }

  /**
   * @extended: filter_sync, virtual_scrolling
   */
  protected applyFilter(): DeferredObj<unknown> {
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
    this.applyFilter();

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

    if (filterName !== undefined) {
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

  private setDataSource(dataSource: DataSource): void {
    const dataSourceAdapter = this.dataSourceController.createAdapter(dataSource);

    this._dataSource = dataSourceAdapter;

    this._isLoading = !dataSourceAdapter.isLoaded();
    this._needApplyFilter = true;
    this._isAllDataTypesDefined = this._columnsController.isAllDataTypesDefined();

    this.changed.add(this.fireDataSourceChanged);
    this.subscribeToDataSource(dataSourceAdapter);
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
    return this._dataSource ? this._dataSource.pageCount() : 1;
  }

  public dataSource(): DataSourceAdapter | undefined {
    return this._dataSource ?? undefined;
  }

  public store(): Store | undefined {
    return this._dataSource?.store();
  }

  public loadAllItems(
    data?: RawItemData[],
    skipFilter = false,
  ): DeferredObj<ProcessedItem[]> {
    const d = Deferred<ProcessedItem[]>();
    const dataSource = this._dataSource;

    if (!dataSource) {
      d.resolve([]);
      return d;
    }

    const resolveWithProcessedItems = (loadResult: CustomLoadResult): void => {
      const items = this._processItems(
        this._beforeProcessItems(loadResult.data),
        { changeType: 'loadingAll' },
      );

      // @ts-expect-error DataGrid-only summary leaks into grid_core
      d.resolve(items, loadResult.extra?.summary);
    };

    if (data) {
      dataSource.customLoader.processLoadedData(data, {
        filter: skipFilter ? null : this.getCombinedFilter(),
        group: dataSource.group(),
        sort: dataSource.sort(),
      })
        .done(resolveWithProcessedItems)
        .fail(d.reject as (...args: unknown[]) => void);
    } else if (!dataSource.isLoading()) {
      dataSource.customLoader.loadAll()
        .done(resolveWithProcessedItems)
        .fail(d.reject as (...args: unknown[]) => void);
    } else {
      d.reject();
    }

    return d;
  }

  public async getAllDataRowKeys(): Promise<RowKey[]> {
    const items = await Promise.resolve(this.loadAllItems());

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
      return dataSource[optionName]();
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
    return this._isCustomLoading || !!this._dataSource?.customLoader.isLoading();
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
    const oldDataSource = this._dataSource;

    if (oldDataSource) {
      // Before unsubscribing: cancelling in-flight loads still notifies this controller.
      oldDataSource.cancelAll();
      this.unsubscribeFromDataSource(oldDataSource);
    }

    this._dataSource = null;
    this.dataSourceController.disposeAdapter();
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
    return this._dataSource?.getCachedStoreData();
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

  public push(changes: StoreChange[], fromStore = false): void {
    this._dataSource?.push(changes, fromStore);
  }

  private itemsCount(): number {
    return (this._dataSource ? this._dataSource.itemsCount() : 0);
  }

  public totalItemsCount(): number {
    return (this._dataSource ? this._dataSource.totalItemsCount() : 0);
  }

  public hasKnownLastPage(): boolean {
    return (this._dataSource ? this._dataSource.hasKnownLastPage() : true);
  }

  /**
   * @extended: state_storing
   */
  public isLoaded(): boolean {
    return (this._dataSource ? this._dataSource.isLoaded() : true);
  }

  public totalCount(): number {
    return (this._dataSource ? this._dataSource.totalCount() : 0);
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
