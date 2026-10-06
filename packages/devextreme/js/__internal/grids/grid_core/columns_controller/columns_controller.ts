import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { orderEach } from '@js/core/utils/object';
import {
  isDefined, isFunction, isNumeric, isObject, isPlainObject, isString,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
import Store from '@js/data/abstract_store';
import type { Grouping, GroupPanel } from '@js/ui/data_grid';
import filterUtils from '@js/ui/shared/filtering';
import errors from '@js/ui/widget/ui.errors';
import inflector from '@ts/core/utils/m_inflector';
import type { SortingInfo, SortingSelector } from '@ts/data/utils';
import type {
  BandColumnsCache,
  Column,
  ColumnDataSourceParameter,
  ColumnFilterExpression,
  ColumnIdentifier,
  ColumnIndex,
  ColumnOptionChanged,
  ColumnOptionsUpdate,
  ColumnsChanges,
  ColumnsControllerOptionChanged,
  ColumnsControllerOptions,
  ColumnsDataSourceParameters,
  ColumnSelector,
  ColumnsOptionChanged,
  ColumnUserState,
  DropLocationNames,
  FilterField,
  GroupColumn,
  IndexedColumns,
  ProcessedColumn,
  ProcessedLookup,
  SavedColumnState,
} from '@ts/grids/grid_core/columns_controller/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import type { Module } from '@ts/grids/grid_core/types';

import { AI_COLUMN_NAME } from '../ai_column/const';
import gridCoreUtils from '../m_utils';
import modules from '../modules/modules';
import { StickyPosition } from '../sticky_columns/const';
import {
  addExpandColumn,
  assignColumns,
  columnOptionCore,
  convertOwnerBandToColumnReference,
  createColumn,
  createColumnsFromDataSourceAdapter,
  createColumnsFromOptions,
  defaultSetCellValue,
  digitsCount,
  findColumn,
  fireColumnsChanged,
  getAlignmentByDataType,
  getChildrenByBandColumn,
  getColumnByIndexes,
  getColumnIndexByVisibleIndex,
  getCustomizeTextByDataType,
  getDataColumns,
  getFixedPosition,
  getParentBandColumns,
  getRowCount,
  getSerializationFormat,
  getValueDataType,
  isColumnFixed,
  isColumnNameRequired,
  isFirstOrLastColumn,
  isSortOrderValid,
  mergeColumns,
  numberToString,
  processBandColumns,
  processExpandColumns,
  reserveGroupIndex,
  resetBandColumnsCache,
  setFilterOperationsAsDefaultValues,
  sortColumnsByCaption,
  strictParseNumber,
  updateColumnChanges,
  updateColumnGroupIndexes,
  updateColumnIndexes,
  updateIndexes,
  updateSerializers,
} from './columns_controller_utils';
import {
  CLASSES,
  COLUMN_CHOOSER_LOCATION,
  COLUMN_OPTION_REGEXP,
  DATATYPE_OPERATIONS,
  DETAIL_COMMAND_COLUMN_NAME,
  GROUP_COMMAND_COLUMN_NAME,
  GROUP_LOCATION,
  MAX_SAFE_INTEGER,
  USER_STATE_FIELD_NAMES,
} from './const';
import { UserStateApplier } from './user_state_applier';

type ColumnOptionsList = (Column | SortingSelector | undefined)[];

export class ColumnsController extends modules.Controller {
  public _skipProcessingColumnsChange!: string | boolean;

  public _commandColumns!: Column[];

  public _columns!: Column[];

  private _isColumnsFromOptions!: boolean;

  public _columnsUserState?: SavedColumnState[] | null;

  private dataSourceAdapterApplied?: boolean;

  private appliedDataSourceAdapter?: DataSourceAdapter | null;

  public _ignoreColumnOptionNames!: string[] | null;

  private generatedColumnsCount?: number | undefined;

  private _visibleColumns?: Column[][];

  private _fixedColumns?: Column[][];

  private _rowCount?: number;

  public _bandColumnsCache?: BandColumnsCache;

  public _reinitAfterLookupChanges?: boolean;

  public _previousColumns?: Column[];

  public _hasUserState!: boolean;

  private __groupingUpdated?: boolean;

  private __sortingUpdated?: boolean;

  public columnsChanged!: Callback<[ColumnsChanges]>;

  public aiColumnOptionChanged!: Callback<[Column, string, unknown]>;

  public _columnChanges?: ColumnsChanges;

  public _isWarnedAboutUnsupportedProperties?: boolean;

  private getCommonColumnSettings(column?: Column): Partial<Column> | undefined {
    switch (true) {
      case !column?.type:
        return this.option('commonColumnSettings');
      case column?.type === AI_COLUMN_NAME:
        return this.getAIColumnSettings();
      default:
        return {};
    }
  }

  private getAIColumnSettings(): Partial<Column> {
    return {
      allowHiding: true,
      ai: {
        mode: 'auto',
        showHeaderMenu: true,
      },
    };
  }

  public init(isApplyingUserState?: boolean): void {
    const columns = this.option('columns');

    this._commandColumns = this._commandColumns || [];
    this._columns = this._columns || [];
    this._isColumnsFromOptions = !!columns;

    if (this._isColumnsFromOptions) {
      assignColumns(this, columns ? createColumnsFromOptions(this, columns) : []);
      this.applyUserState();
    } else {
      assignColumns(
        this,
        this._columnsUserState
          ? createColumnsFromOptions(this, this._columnsUserState)
          : this._columns,
      );
    }

    addExpandColumn(this);

    if (this.dataSourceAdapterApplied) {
      this.applyDataSourceAdapter(this.appliedDataSourceAdapter, true, isApplyingUserState);
    } else {
      updateIndexes(this);
    }

    this._checkColumns();
  }

  public _getExpandColumnOptions(): Column {
    return {
      type: 'expand',
      command: 'expand',
      width: 'auto',
      cssClass: CLASSES.commandExpand,
      allowEditing: false, // T165142
      allowGrouping: false,
      allowSorting: false,
      allowResizing: false,
      allowReordering: false,
      allowHiding: false,
    };
  }

  public _getFirstItems(dataSourceAdapter?: DataSourceAdapter): RawItemData[] {
    let items: RawItemData[] = [];

    const getFirstItemsCore = (
      groupItems: RawItemData[] | undefined,
      remainingGroups: number,
    ): RawItemData[] | undefined => {
      if (!groupItems || !remainingGroups) {
        return groupItems;
      }
      for (const item of groupItems) {
        const childItems = getFirstItemsCore(
          // @ts-expect-error the adapter does not describe nested group items
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip falsy
          item.items || item.collapsedItems,
          remainingGroups - 1,
        );
        if (childItems?.length) {
          return childItems;
        }
      }
      return undefined;
    };

    if (dataSourceAdapter && dataSourceAdapter.items().length > 0) {
      const groupsCount = gridCoreUtils.normalizeSortingInfo(dataSourceAdapter.group()).length;
      items = getFirstItemsCore(dataSourceAdapter.items(), groupsCount) ?? [];
    }
    return items;
  }

  protected _endUpdateCore(): void {
    if (!this._skipProcessingColumnsChange) {
      fireColumnsChanged(this);
    }
  }

  protected callbackNames(): string[] {
    return ['columnsChanged', 'aiColumnOptionChanged'];
  }

  public getColumnByPath(path: string): Column | undefined;

  public getColumnByPath(
    path: string,
    columns: (Column | string)[] | undefined,
  ): Column | string | undefined;

  public getColumnByPath(
    path: string,
    columns?: (Column | string)[],
  ): Column | string | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- missing path
    let column: Column | string | undefined;
    const columnIndexes: number[] = [];

    path.replace(COLUMN_OPTION_REGEXP, (_, columnIndex) => {
      // eslint-disable-next-line radix
      columnIndexes.push(parseInt(columnIndex));
      return '';
    });

    if (columnIndexes.length) {
      if (columns) {
        column = columnIndexes.reduce<Column | string | undefined>(
          (currentColumn, index) => currentColumn && (
            isString(currentColumn) ? undefined : currentColumn.columns?.[index]
          ),
          { columns },
        );
      } else {
        column = getColumnByIndexes(this, columnIndexes);
      }
    }

    return column;
  }

  public optionChanged(args: ColumnsControllerOptionChanged): void {
    switch (args.name) {
      case 'adaptColumnWidthByRatio':
        args.handled = true;
        break;
      case 'dataSource':
        if (args.value !== args.previousValue && !this.option('columns')
          && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
          this._columns = [];
        }
        break;
      case 'columns': {
        let needUpdateRequireResize = this._skipProcessingColumnsChange;
        args.handled = true;

        if (!this._skipProcessingColumnsChange) {
          if (args.fullName === 'columns') {
            this._columnsUserState = null;
            this._ignoreColumnOptionNames = null;
            this.init();
          } else {
            this._columnOptionChanged(args);
            needUpdateRequireResize = true;
          }
        }

        if (needUpdateRequireResize) {
          this._updateRequireResize(args);
        }
        break;
      }
      case 'commonColumnSettings':
      case 'columnAutoWidth':
      case 'allowColumnResizing':
      case 'allowColumnReordering':
      case 'columnFixing':
      case 'grouping':
      case 'groupPanel':
      case 'regenerateColumnsByVisibleItems':
      case 'customizeColumns':
      case 'columnHidingEnabled':
      case 'dateSerializationFormat':
      case 'columnResizingMode':
      case 'columnMinWidth':
      case 'columnWidth': {
        args.handled = true;
        const ignoreColumnOptionNames = args.fullName === 'columnWidth' && ['width'];
        this.reinit(ignoreColumnOptionNames);
        break;
      }
      case 'rtlEnabled':
        this.reinit();
        break;
      case 'onColumnsChanging':
        break;
      default:
        super.optionChanged(args);
    }
  }

  private _columnOptionChanged(args: ColumnOptionChanged): void {
    const column = this.getColumnByPath(args.fullName);
    const columnOptionName = this.getColumnOptionNameByFullName(args.fullName);

    if (column) {
      const columnOptionValue = columnOptionName
        ? { [columnOptionName]: args.value }
        : args.value;

      this._skipProcessingColumnsChange = args.fullName;
      // @ts-expect-error whole-column option changes have an opaque value
      this.columnOption(column.index, columnOptionValue);
      this._skipProcessingColumnsChange = false;
    }
  }

  private setRequireResize(): void {
    if (!this.component._updateLockCount || !this._updateLockCount) {
      return;
    }

    this.component._requireResize = true;
    this.getController('resizing')?.resetLastResizeTime?.();
  }

  private _updateRequireResize(args: ColumnsOptionChanged | ColumnOptionChanged): void {
    if (args.fullName.replace(COLUMN_OPTION_REGEXP, '') === 'width') {
      this.setRequireResize();
    }
  }

  private _isWidthChanging(
    column: Column,
    option: string | ColumnOptionsUpdate | undefined,
    value: unknown,
    notFireEvent?: boolean,
  ): boolean {
    if (notFireEvent) {
      return false;
    }

    if (isObject(option)) {
      return 'width' in option && !equalByValue(column.width, option.width);
    }

    return option === 'width' && !equalByValue(column.width, value);
  }

  public publicMethods(): string[] {
    return [
      'addColumn', 'deleteColumn', 'columnOption', 'columnCount', 'clearSorting', 'clearGrouping',
      'getVisibleColumns', 'getVisibleColumnIndex', 'getColumns',
    ];
  }

  public applyDataSourceAdapter(
    dataSourceAdapter?: DataSourceAdapter | null,
    forceApplying?: boolean,
    isApplyingUserState?: boolean,
  ): DeferredObj<unknown> | undefined {
    const isDataSourceAdapterLoaded = dataSourceAdapter?.isLoaded();

    this.appliedDataSourceAdapter = dataSourceAdapter;

    const shouldApplyDataSourceAdapter = !this.dataSourceAdapterApplied
      || this.generatedColumnsCount === 0 || Boolean(forceApplying)
      || this.option('regenerateColumnsByVisibleItems');
    if (shouldApplyDataSourceAdapter) {
      if (!dataSourceAdapter || !isDataSourceAdapterLoaded) {
        this.dataSourceAdapterApplied = false;
        updateIndexes(this);
        return undefined;
      }

      if (!this._isColumnsFromOptions) {
        const columnsFromDataSourceAdapter = createColumnsFromDataSourceAdapter(
          this,
          dataSourceAdapter,
        );
        if (columnsFromDataSourceAdapter.length) {
          assignColumns(this, columnsFromDataSourceAdapter);
          this.generatedColumnsCount = this._columns.length;
          this.applyUserState();
        }
      }
      return this.updateColumns(dataSourceAdapter, forceApplying, isApplyingUserState);
    }

    const hasUpdatedDataTypes = dataSourceAdapter && isDataSourceAdapterLoaded
      && !this.isAllDataTypesDefined(true) && this.updateColumnDataTypes(dataSourceAdapter);
    if (hasUpdatedDataTypes) {
      updateColumnChanges(this, 'columns');
      fireColumnsChanged(this);
      // @ts-expect-error promise() is typed as native Promise but exposes Deferred callbacks
      return Deferred().reject().promise();
    }
    return undefined;
  }

  public reset(): void {
    this.appliedDataSourceAdapter = null;
    this.dataSourceAdapterApplied = false;
    this.generatedColumnsCount = undefined;
    this.reinit();
  }

  /**
   * @extended: virtual_columns
   * @private
   */
  public resetColumnsCache(): void {
    this._visibleColumns = undefined;
    this._fixedColumns = undefined;
    this._rowCount = undefined;
    resetBandColumnsCache(this);
  }

  public reinit(ignoreColumnOptionNames?: string[] | false): void {
    this._columnsUserState = this.getUserState();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- false clears list
    this._ignoreColumnOptionNames = ignoreColumnOptionNames || null;
    this.init();

    if (ignoreColumnOptionNames) {
      this._ignoreColumnOptionNames = null;
    }
  }

  public isInitialized(): boolean {
    return !!this._columns.length || !!this.option('columns');
  }

  public isDataSourceAdapterApplied(): boolean | undefined {
    return this.dataSourceAdapterApplied;
  }

  public getCommonSettings(column?: Column): Partial<Column> {
    const commonColumnSettings = this.getCommonColumnSettings(column);
    const groupingOptions: Grouping = this.option('grouping') ?? {};
    const groupPanelOptions: GroupPanel = this.option('groupPanel') ?? {};

    return extend({
      allowFixing: this.option('columnFixing.enabled'),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- false -> undefined
      allowResizing: this.option('allowColumnResizing') || undefined,
      allowReordering: this.option('allowColumnReordering'),
      minWidth: this.option('columnMinWidth'),
      width: this.option('columnWidth'),
      autoExpandGroup: groupingOptions.autoExpandAll,
      allowCollapsing: groupingOptions.allowCollapsing,
      allowGrouping: (groupPanelOptions.allowColumnDragging && groupPanelOptions.visible)
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- false fallback
        || groupingOptions.contextMenuEnabled,
    }, commonColumnSettings);
  }

  public isColumnOptionUsed(optionName: string): boolean {
    for (const column of this._columns) {
      if (column[optionName]) {
        return true;
      }
    }

    return false;
  }

  public isAllDataTypesDefined(checkSerializers?: boolean): boolean {
    const columns = this._columns;

    if (!columns.length) {
      return false;
    }

    for (const column of columns) {
      const requiresDataType = Boolean(column.dataField)
        || column.calculateCellValue !== column.defaultCalculateCellValue;
      const isDataTypeIncomplete = requiresDataType && (!column.dataType
        || (checkSerializers && column.deserializeValue
          && column.serializationFormat === undefined));

      if (isDataTypeIncomplete) {
        return false;
      }
    }

    return true;
  }

  public getColumns(): Column[] {
    return this._columns;
  }

  public getColumnByName(columnName: string): Column | undefined {
    return this.getColumns().find((column) => column.name === columnName);
  }

  public isBandColumnsUsed(): boolean {
    return this.getColumns().some((column) => column.isBand);
  }

  public getGroupColumns(): GroupColumn[] {
    const result: GroupColumn[] = [];

    this._columns
      .filter((column): column is GroupColumn => isDefined(column.groupIndex) && !column.type)
      .forEach((column) => {
        result[column.groupIndex] = column;
      });
    return result;
  }

  /**
   * @extended: state_storing
   */
  protected _shouldReturnVisibleColumns(): boolean {
    return true;
  }

  /**
   * @extended: virtual_column
   */
  protected _compileVisibleColumns(rowIndex?: number | null, isBase?: boolean): Column[];
  protected _compileVisibleColumns(rowIndex?: number | null): Column[] {
    this._visibleColumns = this._visibleColumns ?? this._compileVisibleColumnsCore();
    const effectiveRowIndex = isDefined(rowIndex) ? rowIndex : this._visibleColumns.length - 1;

    return this._visibleColumns[effectiveRowIndex] ?? [];
  }

  public getVisibleColumns(...args: [rowIndex?: number | null, isBase?: boolean]): Column[] {
    if (!this._shouldReturnVisibleColumns()) {
      return [];
    }

    return this._compileVisibleColumns(...args);
  }

  /**
   * @extended: virtual_column
   */
  public getFixedColumns(rowIndex?: number | null): Column[] {
    this._fixedColumns = this._fixedColumns ?? this._getFixedColumnsCore();
    const effectiveRowIndex = isDefined(rowIndex) ? rowIndex : this._fixedColumns.length - 1;

    return this._fixedColumns[effectiveRowIndex] ?? [];
  }

  public getFilteringColumns(): FilterField[] {
    const isFilterableColumn = (column: Column): boolean => {
      const hasIdentifier = !!column.dataField || !!column.name;
      const allowsFiltering = !!column.allowFiltering || !!column.allowHeaderFiltering;
      return hasIdentifier && allowsFiltering && !column.type;
    };

    const toFilterField = (column: Column): FilterField => {
      const field: FilterField = extend(true, {}, column);
      if (!isDefined(field.dataField)) {
        field.dataField = field.name;
      }
      field.filterOperations = column.filterOperations !== column.defaultFilterOperations
        ? field.filterOperations
        : null;
      return field;
    };

    const columns: Column[] = this.getColumns();
    return columns.filter(isFilterableColumn).map(toFilterField);
  }

  /**
   * @extended: virtual_column
   */
  public getColumnIndexOffset(): number {
    return 0;
  }

  // TODO: Rename to getFixedColumns after removing the old fixed columns implementation
  public getStickyColumns(rowIndex?: number): Column[] {
    const visibleColumns = this.getVisibleColumns(rowIndex, true);

    return visibleColumns.filter((column) => column.fixed);
  }

  private _getFixedColumnsCore(): Column[][] {
    const result: Column[][] = [];
    const rowCount = this.getRowCount();
    const isColumnFixing = this._isColumnFixing();
    if (!isColumnFixing) {
      return result;
    }
    const transparentColumn: Column = { command: 'transparent' };
    let transparentColspan = 0;
    const getColspan = (column: Column): number => (
      column.isBand && column.colspan ? column.colspan : 1
    );

    for (let i = 0; i <= rowCount; i += 1) {
      let notFixedColumnCount = 0;
      let lastFixedPosition: Column['fixedPosition'] | null = null;
      let transparentColumnIndex: number | null = null;
      const visibleColumns = this.getVisibleColumns(i, true);

      for (let j = 0; j < visibleColumns.length; j += 1) {
        const prevColumn = visibleColumns[j - 1];
        const column = visibleColumns[j];

        if (!column.fixed || column.fixedPosition === StickyPosition.Sticky) {
          transparentColspan += i === 0 ? getColspan(column) : 0;

          notFixedColumnCount += 1;
          transparentColumnIndex ??= j;
        } else if (prevColumn && prevColumn.fixed
            && getFixedPosition(this, prevColumn) !== getFixedPosition(this, column)) {
          transparentColumnIndex ??= j;
        } else {
          lastFixedPosition = column.fixedPosition;
        }
      }

      if (i === 0
          && (notFixedColumnCount === 0 || notFixedColumnCount >= visibleColumns.length)) {
        return [];
      }

      if (!isDefined(transparentColumnIndex)) {
        transparentColumnIndex = lastFixedPosition === 'right' ? 0 : visibleColumns.length;
      }

      result[i] = visibleColumns.slice(0);
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- replace zero
      if (!transparentColumn.colspan) {
        transparentColumn.colspan = transparentColspan;
      }
      result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn);
    }

    return result.map((columns) => columns.map((column) => {
      const newColumn = { ...column };
      if (newColumn.headerId) {
        newColumn.headerId += '-fixed';
      }
      return newColumn;
    }));
  }

  public _isColumnFixing(): boolean | undefined {
    let isColumnFixing = this.option('columnFixing.enabled');

    if (!isColumnFixing && this._columns.some((column) => column.fixed)) {
      isColumnFixing = true;
    }

    return isColumnFixing;
  }

  /**
   * @extended: master_detail
   */
  protected _getExpandColumnsCore(): Column[] {
    return this.getGroupColumns();
  }

  private getExpandColumns(): Column[] {
    let expandColumns: Column[] = this._getExpandColumnsCore();
    const firstGroupColumn = expandColumns.filter((column) => column.groupIndex === 0)[0];
    const isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed;
    const isColumnFixing = this._isColumnFixing();
    const rtlEnabled = this.option('rtlEnabled');
    const expandColumn = expandColumns.length ? this.columnOption('command:expand') : undefined;

    expandColumns = map(expandColumns, (column: Column): Column => extend(
      {},
      {
        ...column,
        ownerBand: undefined,
      },
      {
        visibleWidth: null,
        minWidth: null,
        cellTemplate: !isDefined(column.groupIndex) ? column.cellTemplate : null,
        headerCellTemplate: null,
        fixed: !isDefined(column.groupIndex) || !isFixedFirstGroupColumn ? isColumnFixing : true,
        fixedPosition: rtlEnabled ? 'right' : 'left',
      },
      expandColumn,
      {
        index: column.index,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip empty type
        type: column.type || GROUP_COMMAND_COLUMN_NAME,
      },
    ));

    return expandColumns;
  }

  public getBandColumnsCache(): BandColumnsCache {
    if (!this._bandColumnsCache) {
      const columns = this._columns;
      const columnChildrenByIndex: Record<number, Column[]> = {};
      const columnParentByIndex: Record<number, Column> = {};
      let isPlain = true;

      columns.forEach((column) => {
        const { ownerBand } = column;
        // @ts-expect-error ownerBand holds the band column until updateColumnIndexes sets its index
        let parentIndex: number = isObject(ownerBand) ? ownerBand.index : ownerBand;
        const parent = columns[parentIndex];

        if (column.hasColumns) {
          isPlain = false;
        }

        if (column.colspan) {
          column.colspan = undefined;
        }

        if (column.rowspan) {
          column.rowspan = undefined;
        }

        if (parent) {
          if (isDefined(column.index)) {
            columnParentByIndex[column.index] = parent;
          }
        } else {
          parentIndex = -1;
        }

        columnChildrenByIndex[parentIndex] = columnChildrenByIndex[parentIndex] || [];
        columnChildrenByIndex[parentIndex].push(column);
      });

      this._bandColumnsCache = {
        isPlain,
        columnChildrenByIndex,
        columnParentByIndex,
      };
    }

    return this._bandColumnsCache;
  }

  /**
   * @extended: adaptivity
   */
  protected _isColumnVisible(column: Column): boolean {
    return !!column.visible && this.isParentColumnVisible(column.index);
  }

  private _isColumnInGroupPanel(column: Column): boolean {
    return isDefined(column.groupIndex) && !column.showWhenGrouped;
  }

  public hasVisibleDataColumns(): boolean {
    const columns = this._columns;

    return columns.some((column) => {
      const isVisible = this._isColumnVisible(column);
      const isInGroupPanel = this._isColumnInGroupPanel(column);
      const isCommand = !!column.command;

      return isVisible && !isInGroupPanel && !isCommand;
    });
  }

  private _compileVisibleColumnsCore(): Column[][] {
    const bandColumnsCache = this.getBandColumnsCache();
    const columns: Column[] = mergeColumns(this, this._columns, this._commandColumns, true);

    processBandColumns(this, columns, bandColumnsCache);

    const indexedColumns = this._getIndexedColumns(columns);

    const visibleColumns = this._getVisibleColumnsFromIndexed(indexedColumns);

    const isDataColumnsInvisible = !this.hasVisibleDataColumns();

    if (isDataColumnsInvisible && this._columns.length) {
      visibleColumns[visibleColumns.length - 1].push({ command: 'empty', type: 'empty' });
    }

    return visibleColumns;
  }

  private _getIndexedColumns(columns: Column[]): IndexedColumns {
    const rtlEnabled = this.option('rtlEnabled');
    const rowCount = this.getRowCount();
    const columnDigitsCount = digitsCount(columns.length);

    const bandColumnsCache = this.getBandColumnsCache();

    const positiveIndexedColumns: IndexedColumns['positiveIndexedColumns'] = [];
    const negativeIndexedColumns: IndexedColumns['negativeIndexedColumns'] = [];

    for (let i = 0; i < rowCount; i += 1) {
      negativeIndexedColumns[i] = {};

      // 0 - fixed columns on the left side
      // 1 - not fixed columns
      // 2 - fixed columns on the right side
      positiveIndexedColumns[i] = [{}, {}, {}];
    }

    columns.forEach((column) => {
      const { visibleIndex } = column;
      const isVisible = this._isColumnVisible(column);
      const isInGroupPanel = this._isColumnInGroupPanel(column);

      if (!isVisible || isInGroupPanel) {
        return;
      }

      const parentBandColumns = getParentBandColumns(
        column.index,
        bandColumnsCache.columnParentByIndex,
      );
      const rowIndex = parentBandColumns.length;
      let targetIndex: string | number = visibleIndex ?? 'undefined';
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let indexedColumns: Record<string, Column[]>;

      if (isDefined(visibleIndex) && visibleIndex < 0) {
        targetIndex = -visibleIndex;
        indexedColumns = negativeIndexedColumns[rowIndex];
      } else {
        column.fixed = parentBandColumns[0]?.fixed ?? column.fixed;
        column.fixedPosition = parentBandColumns[0]?.fixedPosition ?? column.fixedPosition;

        if (column.fixed && column.fixedPosition !== StickyPosition.Sticky) {
          const isDefaultCommandColumn = !!column.command
            && !gridCoreUtils.isCustomCommandColumn(this._columns, column);

          let isFixedToEnd = column.fixedPosition === 'right';

          if (rtlEnabled && !isDefaultCommandColumn) {
            isFixedToEnd = !isFixedToEnd;
          }

          indexedColumns = isFixedToEnd
            ? positiveIndexedColumns[rowIndex][2]
            : positiveIndexedColumns[rowIndex][0];
        } else {
          [, indexedColumns] = positiveIndexedColumns[rowIndex];
        }
      }

      // normalizeIndexes gives every band and band child a numeric visibleIndex
      if (parentBandColumns.length && isNumeric(targetIndex)) {
        targetIndex = numberToString(targetIndex, columnDigitsCount);

        for (let i = parentBandColumns.length - 1; i >= 0; i -= 1) {
          const { visibleIndex: parentVisibleIndex } = parentBandColumns[i];

          if (isNumeric(parentVisibleIndex)) {
            const parentTargetIndex = numberToString(parentVisibleIndex, columnDigitsCount);
            targetIndex = `${parentTargetIndex}${targetIndex}`;
          }
        }
      }

      indexedColumns[targetIndex] = indexedColumns[targetIndex] || [];
      indexedColumns[targetIndex].push(column);
    });

    return {
      positiveIndexedColumns, negativeIndexedColumns,
    };
  }

  private _getVisibleColumnsFromIndexed({
    positiveIndexedColumns,
    negativeIndexedColumns,
  }: IndexedColumns): Column[][] {
    const result: Column[][] = [];
    const rowCount: number = this.getRowCount();
    const expandColumns: Column[] = mergeColumns(this, this.getExpandColumns(), this._columns);

    // Process header rows columns
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      result.push([]);

      orderEach(negativeIndexedColumns[rowIndex], (_: string, columns: Column[]) => {
        result[rowIndex].unshift(...columns);
      });
    }

    const firstExpandColumnIndex = result[0].length;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      positiveIndexedColumns[rowIndex].forEach((columnsByFixing) => {
        orderEach(columnsByFixing, (_: string, columnsByVisibleIndex: Column[]) => {
          result[rowIndex].push(...columnsByVisibleIndex);
        });
      });
    }

    // The order of processing is important
    processExpandColumns(
      result[0],
      expandColumns,
      DETAIL_COMMAND_COLUMN_NAME,
      firstExpandColumnIndex,
      rowCount,
    );
    processExpandColumns(
      result[0],
      expandColumns,
      GROUP_COMMAND_COLUMN_NAME,
      firstExpandColumnIndex,
      rowCount,
    );

    // Process table body columns
    result.push(getDataColumns(result));

    return result;
  }

  public getInvisibleColumns(
    columns?: Column[],
    bandColumnIndex?: number,
  ): Column[] {
    let result: Column[] = [];
    const sourceColumns = columns ?? this._columns;

    sourceColumns.forEach((column) => {
      if (column.ownerBand !== bandColumnIndex) {
        return;
      }
      if (column.isBand) {
        const hiddenColumnsByBand = !column.visible
          ? this.getChildrenByBandColumn(column.index)
          : this.getInvisibleColumns(
            this.getChildrenByBandColumn(column.index),
            column.index,
          );

        if (hiddenColumnsByBand.length) {
          result.push(column);
          result = result.concat(hiddenColumnsByBand);
        }
        return;
      }
      if (!column.visible) {
        result.push(column);
      }
    });

    return result;
  }

  public getChooserColumns(getAllColumns?: boolean): Column[] {
    const columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();
    const columnChooserColumns = columns.filter((column) => column.showInColumnChooser);

    const sortOrder = this.option('columnChooser.sortOrder');

    sortColumnsByCaption(columnChooserColumns, sortOrder);

    return columnChooserColumns;
  }

  /**
   * @extended: column_chooser
   */
  public allowMoveColumn(
    fromVisibleIndex: ColumnIndex,
    toVisibleIndex: ColumnIndex,
    sourceLocation: DropLocationNames,
    targetLocation: DropLocationNames,
  ): boolean | undefined {
    const columnIndex = getColumnIndexByVisibleIndex(this, fromVisibleIndex, sourceLocation);
    const sourceColumn = this._columns[columnIndex];

    const allowsMoving = sourceColumn
      && (Boolean(sourceColumn.allowReordering)
        || Boolean(sourceColumn.allowGrouping) || Boolean(sourceColumn.allowHiding));
    if (allowsMoving) {
      if (sourceLocation === targetLocation) {
        if (sourceLocation === COLUMN_CHOOSER_LOCATION) {
          return false;
        }

        const fromColumnIndex = isObject(fromVisibleIndex)
          ? fromVisibleIndex.columnIndex : fromVisibleIndex;
        const toColumnIndex = isObject(toVisibleIndex)
          ? toVisibleIndex.columnIndex : toVisibleIndex;

        return fromColumnIndex !== toColumnIndex && fromColumnIndex + 1 !== toColumnIndex;
      } if ((sourceLocation === GROUP_LOCATION && targetLocation !== COLUMN_CHOOSER_LOCATION)
        || targetLocation === GROUP_LOCATION) {
        return sourceColumn && sourceColumn.allowGrouping;
      } if (sourceLocation === COLUMN_CHOOSER_LOCATION
        || targetLocation === COLUMN_CHOOSER_LOCATION) {
        return sourceColumn && sourceColumn.allowHiding;
      }
      return true;
    }
    return false;
  }

  public moveColumn(
    fromVisibleIndex: ColumnIndex,
    toVisibleIndex: ColumnIndex,
    sourceLocation: DropLocationNames,
    targetLocation: DropLocationNames,
  ): void {
    const options: Partial<Column> = {};
    // eslint-disable-next-line @typescript-eslint/init-declarations -- absent groupIndex
    let prevGroupIndex: number | undefined;
    const fromIndex = getColumnIndexByVisibleIndex(this, fromVisibleIndex, sourceLocation);
    const toIndex = getColumnIndexByVisibleIndex(this, toVisibleIndex, targetLocation);

    if (fromIndex >= 0) {
      const column = this._columns[fromIndex];
      const toColumnIndex = isObject(toVisibleIndex)
        ? toVisibleIndex.columnIndex : toVisibleIndex;
      let targetGroupIndex = toIndex >= 0 ? this._columns[toIndex].groupIndex : -1;

      if (isDefined(column.groupIndex) && sourceLocation === GROUP_LOCATION) {
        if (isDefined(targetGroupIndex) && targetGroupIndex > column.groupIndex) {
          targetGroupIndex -= 1;
        }
        if (targetLocation !== GROUP_LOCATION) {
          options.groupIndex = undefined;
        } else {
          prevGroupIndex = column.groupIndex;
          delete column.groupIndex;
          updateColumnGroupIndexes(this);
        }
      }

      if (targetLocation === GROUP_LOCATION) {
        options.groupIndex = reserveGroupIndex(this, targetGroupIndex);
        column.groupIndex = prevGroupIndex;
      } else if (toColumnIndex >= 0) {
        const targetColumn = this._columns[toIndex];

        if (!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
          options.visibleIndex = MAX_SAFE_INTEGER;
        } else if (isColumnFixed(this, column) !== isColumnFixed(this, targetColumn)) {
          options.visibleIndex = MAX_SAFE_INTEGER;
        } else {
          options.visibleIndex = targetColumn.visibleIndex;
        }
      }

      const isVisible = targetLocation !== COLUMN_CHOOSER_LOCATION;

      if (column.visible !== isVisible) {
        options.visible = isVisible;
      }

      this.columnOption(column.index, options);
    }
  }

  public allowColumnSorting(column?: Column): boolean | undefined {
    const sortingOptions = this.option('sorting');
    const allowSorting = sortingOptions?.mode === 'single' || sortingOptions?.mode === 'multiple';

    return allowSorting && column?.allowSorting;
  }

  public changeSortOrder(columnIndex: number, sortOrder?: string | null): void {
    const options: Partial<Column> = {};
    const sortingOptions = this.option('sorting');
    const sortingMode = sortingOptions?.mode;
    const needResetSorting = sortingMode === 'single' || !sortOrder;
    const column = this._columns[columnIndex];
    const nextSortOrder = (sortingColumn: Column): boolean => {
      if (sortOrder === 'ctrl') {
        if (!(('sortOrder' in sortingColumn) && ('sortIndex' in sortingColumn))) {
          return false;
        }

        options.sortOrder = undefined;
        options.sortIndex = undefined;
      } else if (isDefined(sortingColumn.groupIndex) || isDefined(sortingColumn.sortIndex)) {
        options.sortOrder = sortingColumn.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        options.sortOrder = 'asc';
      }

      return true;
    };

    if (this.allowColumnSorting(column)) {
      if (needResetSorting && !isDefined(column.groupIndex)) {
        this._columns.forEach((currentColumn, index) => {
          if (index !== columnIndex && currentColumn.sortOrder) {
            if (!isDefined(currentColumn.groupIndex)) {
              delete currentColumn.sortOrder;
            }
            delete currentColumn.sortIndex;
          }
        });
      }
      if (isSortOrderValid(sortOrder)) {
        if (column.sortOrder !== sortOrder) {
          options.sortOrder = sortOrder;
        }
      } else if (sortOrder === 'none') {
        if (column.sortOrder) {
          options.sortIndex = undefined;
          options.sortOrder = undefined;
        }
      } else {
        nextSortOrder(column);
      }
    }

    this.columnOption(column.index, options);
  }

  /**
   * @extended: focus
   */
  public getSortDataSourceParameters(
    useLocalSelector?: boolean,
    sortByKey?: boolean,
  ): ColumnDataSourceParameter[] | null;
  public getSortDataSourceParameters(
    useLocalSelector?: boolean,
  ): ColumnDataSourceParameter[] | null {
    const sortColumns: Column[] = [];
    const sort: ColumnDataSourceParameter[] = [];

    this._columns.forEach((column) => {
      const hasSortSelector = Boolean(column.dataField)
        || Boolean(column.selector) || Boolean(column.calculateCellValue);
      if (hasSortSelector && isDefined(column.sortIndex) && !isDefined(column.groupIndex)) {
        sortColumns[column.sortIndex] = column;
      }
    });
    sortColumns.forEach((column) => {
      const { sortOrder } = column;
      if (isSortOrderValid(sortOrder)) {
        const sortItem: ColumnDataSourceParameter = {
          /* eslint-disable @typescript-eslint/prefer-nullish-coalescing -- skip falsy selectors */
          selector: column.calculateSortValue || column.displayField || column.calculateDisplayValue
            || (useLocalSelector && column.selector)
            || column.dataField || column.calculateCellValue,
          /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
          desc: column.sortOrder === 'desc',
        };

        if (column.sortingMethod) {
          sortItem.compare = column.sortingMethod.bind(column);
        }

        sort.push(sortItem);
      }
    });
    return sort.length > 0 ? sort : null;
  }

  public getGroupDataSourceParameters(
    useLocalSelector?: boolean,
  ): ColumnDataSourceParameter[] | null {
    const group: ColumnDataSourceParameter[] = [];

    for (const column of this.getGroupColumns()) {
      /* eslint-disable @typescript-eslint/prefer-nullish-coalescing -- skip falsy selectors */
      const selector = column.calculateGroupValue || column.displayField
        || column.calculateDisplayValue
        || (useLocalSelector && column.selector) || column.dataField || column.calculateCellValue;
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
      if (selector) {
        const groupItem: ColumnDataSourceParameter = {
          selector,
          desc: column.sortOrder === 'desc',
          isExpanded: !!column.autoExpandGroup,
        };

        if (column.sortingMethod) {
          groupItem.compare = column.sortingMethod.bind(column);
        }

        group.push(groupItem);
      }
    }
    return group.length > 0 ? group : null;
  }

  public refresh(updateNewLookupsOnly?: boolean): DeferredObj<unknown> {
    const deferreds: (DeferredObj<unknown> | undefined)[] = [];

    this._columns.forEach((column) => {
      const { lookup } = column;

      if (lookup && !column.calculateDisplayValue) {
        if (updateNewLookupsOnly && lookup.valueMap) {
          return;
        }

        if (lookup.update) {
          deferreds.push(lookup.update());
        }
      }
    });
    return when.apply($, deferreds).done(() => {
      this.resetColumnsCache();
    });
  }

  private _updateColumnOptions(column: Column, columnIndex: number): void {
    // @ts-expect-error createColumn initializes calculateCellValue
    const defaultSelector = (data: RawItemData): unknown => column.calculateCellValue(data);
    const shouldTakeOriginalCallbackFromPrevious = this._reinitAfterLookupChanges
      && this._previousColumns?.[columnIndex];

    column.selector = column.selector ?? defaultSelector;
    column.selector.columnIndex = columnIndex;
    column.selector.originalCallback = shouldTakeOriginalCallbackFromPrevious
      ? this._previousColumns?.[columnIndex].selector?.originalCallback ?? column.selector
      : column.selector;

    [
      'calculateSortValue', 'calculateGroupValue', 'calculateDisplayValue',
    ].forEach((calculateCallbackName) => {
      const calculateCallback = column[calculateCallbackName];
      if (isFunction(calculateCallback)) {
        if (!calculateCallback.originalCallback) {
          const context = { column };
          column[calculateCallbackName] = function calculateValue(data): unknown {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped callback
            return calculateCallback.call(context.column, data);
          };
          column[calculateCallbackName].originalCallback = calculateCallback;
          column[calculateCallbackName].columnIndex = columnIndex;
          column[calculateCallbackName].context = context;
        } else {
          column[calculateCallbackName].context.column = column;
        }
      }
    });

    if (isString(column.calculateDisplayValue)) {
      column.displayField = column.calculateDisplayValue;
      column.calculateDisplayValue = compileGetter(column.displayField) as ColumnSelector;
    }
    if (column.calculateDisplayValue) {
      column.displayValueMap = column.displayValueMap ?? {};
    }

    updateSerializers(column, column.dataType);

    const { lookup } = column;
    if (lookup) {
      updateSerializers(lookup, lookup.dataType);
    }

    const dataType = lookup ? lookup.dataType : column.dataType;
    if (dataType) {
      column.alignment = column.alignment
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip empty text
        || getAlignmentByDataType(dataType, this.option('rtlEnabled'));
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip falsy format
      column.format = column.format || gridCoreUtils.getFormatByDataType(dataType);
      column.customizeText = column.customizeText ?? getCustomizeTextByDataType(dataType);
      column.defaultFilterOperations = column.defaultFilterOperations
        ?? (lookup ? [] : (DATATYPE_OPERATIONS[dataType] ?? []));
      if (!isDefined(column.filterOperations)) {
        setFilterOperationsAsDefaultValues(column);
      }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip empty string
      column.defaultFilterOperation = column.filterOperations?.[0] || '=';
      column.showEditorAlways = isDefined(column.showEditorAlways)
        ? column.showEditorAlways : dataType === 'boolean' && !column.cellTemplate && !column.lookup;
    }
  }

  public updateColumnDataTypes(dataSourceAdapter?: DataSourceAdapter): boolean {
    const dateSerializationFormat = this.option('dateSerializationFormat');
    const firstItems = this._getFirstItems(dataSourceAdapter);
    let isColumnDataTypesUpdated = false;

    each(this._columns, (index, column) => {
      if (column.type === AI_COLUMN_NAME) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/init-declarations -- absent samples
      let dataType: Column['dataType'];
      // eslint-disable-next-line @typescript-eslint/init-declarations -- absent lookup samples
      let lookupDataType: Column['dataType'];
      const { lookup } = column;

      if (gridCoreUtils.isDateType(column.dataType) && column.serializationFormat === undefined) {
        column.serializationFormat = dateSerializationFormat;
      }
      if (lookup && gridCoreUtils.isDateType(lookup.dataType)
        && column.serializationFormat === undefined) {
        lookup.serializationFormat = dateSerializationFormat;
      }

      const inferDataTypes = (): void => {
        for (const item of firstItems) {
          const value = (column as ProcessedColumn).calculateCellValue(item);

          if (!column.dataType) {
            const valueDataType = getValueDataType(value);
            dataType = dataType ?? valueDataType;
            if (dataType && valueDataType && dataType !== valueDataType) {
              dataType = 'string';
            }
          }

          if (lookup && !lookup.dataType) {
            const valueDataType = getValueDataType(
              gridCoreUtils.getDisplayValue(column, value, item),
            );
            lookupDataType = lookupDataType ?? valueDataType;
            if (lookupDataType && valueDataType && lookupDataType !== valueDataType) {
              lookupDataType = 'string';
            }
          }
        }
        if (dataType || lookupDataType) {
          if (dataType) {
            column.dataType = dataType;
          }

          if (lookup && lookupDataType) {
            lookup.dataType = lookupDataType;
          }
          isColumnDataTypesUpdated = true;
        }
      };

      const inferSerializationFormats = (): void => {
        for (const item of firstItems) {
          const value = (column as ProcessedColumn).calculateCellValue(item, true);

          if (column.serializationFormat === undefined) {
            column.serializationFormat = getSerializationFormat(column.dataType, value);
          }

          if (lookup && lookup.serializationFormat === undefined) {
            lookup.serializationFormat = getSerializationFormat(
              lookup.dataType,
              (lookup as ProcessedLookup).calculateCellValue(value, true),
            );
          }
        }
      };

      if (column.calculateCellValue && firstItems.length) {
        if (!column.dataType || (lookup && !lookup.dataType)) {
          inferDataTypes();
        }
        const needsSerializationFormat = column.serializationFormat === undefined
          || (lookup && lookup.serializationFormat === undefined);
        if (needsSerializationFormat) {
          inferSerializationFormats();
        }
      }

      this._updateColumnOptions(column, index);
    });

    return isColumnDataTypesUpdated;
  }

  private _customizeColumns(columns: Column[]): void {
    const customizeColumns = (
      this.option('customizeColumns') as ColumnsControllerOptions['customizeColumns']
    );

    if (customizeColumns) {
      const hasOwnerBand = columns.some((column) => isObject(column.ownerBand));

      if (hasOwnerBand) {
        updateIndexes(this);
      }

      customizeColumns(columns);
      assignColumns(this, createColumnsFromOptions(this, columns));
    }
  }

  public updateColumns(
    dataSourceAdapter?: DataSourceAdapter | null,
    forceApplying?: boolean,
    isApplyingUserState?: boolean,
  ): DeferredObj<unknown> | undefined {
    if (!forceApplying) {
      this.updateSortingGrouping(dataSourceAdapter);
    }

    if (!dataSourceAdapter || dataSourceAdapter.isLoaded()) {
      const sortParameters = dataSourceAdapter
        ? (dataSourceAdapter.sort() ?? [])
        : this.getSortDataSourceParameters();
      const groupParameters = dataSourceAdapter
        ? (dataSourceAdapter.group() ?? [])
        : this.getGroupDataSourceParameters();
      const filterParameters = dataSourceAdapter?.lastLoadOptions().filter;

      if (!isApplyingUserState) {
        this._customizeColumns(this._columns);
      }

      updateIndexes(this);

      const columns = this._columns;
      return when(this.refresh(true)).always(() => {
        if (this._columns !== columns) return;

        this._updateChanges(dataSourceAdapter, {
          sorting: sortParameters,
          grouping: groupParameters,
          filtering: filterParameters,
        });

        fireColumnsChanged(this);
      });
    }
    return undefined;
  }

  private _updateChanges(
    dataSourceAdapter: DataSourceAdapter | null | undefined,
    parameters: ColumnsDataSourceParameters,
  ): void {
    if (dataSourceAdapter) {
      this.updateColumnDataTypes(dataSourceAdapter);
      this.dataSourceAdapterApplied = true;
    }

    if (!gridCoreUtils.equalSortParameters(
      parameters.sorting,
      this.getSortDataSourceParameters(),
    )) {
      updateColumnChanges(this, 'sorting');
    }
    if (!gridCoreUtils.equalSortParameters(
      parameters.grouping,
      this.getGroupDataSourceParameters(),
    )) {
      updateColumnChanges(this, 'grouping');
    }

    const columnChanges = updateColumnChanges(this, 'columns');
    columnChanges.appliedFilters ??= [];
    columnChanges.appliedFilters.push(parameters.filtering);
  }

  public updateSortingGrouping(
    dataSourceAdapter?: DataSourceAdapter | null,
    fromDataSource?: boolean,
  ): void {
    if (!dataSourceAdapter) {
      return;
    }

    let isColumnsChanged = false;
    const updateSortGroupParameterIndexes = (
      columns: Column[],
      sortParameters: SortingInfo[] | null | undefined,
      indexParameterName: string,
    ): void => {
      const referencedGroupValues: string[] = columns
        .filter((column): column is Column & { calculateGroupValue: string } => (
          isString(column.calculateGroupValue)
        ))
        .map((column) => column.calculateGroupValue);

      columns.forEach((column) => {
        const isReferencedAsGroupValue = indexParameterName === 'groupIndex'
          && referencedGroupValues.some(
            (groupValue) => column.dataField === groupValue || column.name === groupValue,
          );

        if (isReferencedAsGroupValue) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete column[indexParameterName];
        if (!sortParameters) {
          return;
        }
        const parameterIndex = sortParameters.findIndex(({ selector }) => (
          selector === column.dataField
          || selector === column.name
          || selector === column.displayField
          || gridCoreUtils.isEqualSelectors(selector, column.selector)
          || gridCoreUtils.isSelectorEqualWithCallback(selector, column.calculateCellValue)
          || gridCoreUtils.isEqualSelectors(selector, column.calculateGroupValue)
          || (isFunction(column.calculateDisplayValue)
            && gridCoreUtils.isSelectorEqualWithCallback(selector, column.calculateDisplayValue))
        ));
        if (parameterIndex < 0) {
          return;
        }

        const { desc, isExpanded } = sortParameters[parameterIndex];
        if (fromDataSource) {
          let { sortOrder } = column;
          if (!('sortOrder' in column)) {
            sortOrder = desc ? 'desc' : 'asc';
          }
          column.sortOrder = sortOrder;
        } else {
          column.sortOrder = column.sortOrder ?? (desc ? 'desc' : 'asc');
        }

        if (isExpanded !== undefined) {
          column.autoExpandGroup = isExpanded;
        }

        column[indexParameterName] = parameterIndex;
      });
    };
    const sortParameters = gridCoreUtils.normalizeSortingInfo(dataSourceAdapter.sort());
    const groupParameters = gridCoreUtils.normalizeSortingInfo(dataSourceAdapter.group());
    const columnsGroupParameters = this.getGroupDataSourceParameters();
    const columnsSortParameters = this.getSortDataSourceParameters();
    const changeTypes = this._columnChanges?.changeTypes;
    const sortingChanged = !gridCoreUtils.equalSortParameters(
      sortParameters,
      columnsSortParameters,
    );
    const needToApplySortingFromDataSource = fromDataSource && !changeTypes?.sorting;
    const needToApplyGroupingFromDataSource = fromDataSource && !changeTypes?.grouping;
    const groupingChanged = !gridCoreUtils.equalSortParameters(
      groupParameters,
      columnsGroupParameters,
      true,
    );
    const groupExpandingChanged = !groupingChanged
        && !gridCoreUtils.equalSortParameters(groupParameters, columnsGroupParameters);

    if (!this._columns.length) {
      each(groupParameters, (_: number, group) => {
        (this._columns as ColumnOptionsList).push(group.selector);
      });
      each(sortParameters, (_: number, sort) => {
        if (!isFunction(sort.selector)) {
          (this._columns as ColumnOptionsList).push(sort.selector);
        }
      });
      assignColumns(this, createColumnsFromOptions(this, this._columns));
    }

    const shouldApplyGrouping = (Boolean(needToApplyGroupingFromDataSource)
        || (!columnsGroupParameters && !this._hasUserState))
        && (groupingChanged || groupExpandingChanged);
    if (shouldApplyGrouping) {
      /// #DEBUG
      this.__groupingUpdated = true;
      /// #ENDDEBUG
      updateSortGroupParameterIndexes(this._columns, groupParameters, 'groupIndex');
      if (fromDataSource) {
        if (groupingChanged) {
          updateColumnChanges(this, 'grouping');
        }
        if (groupExpandingChanged) {
          updateColumnChanges(this, 'groupExpanding');
        }
        isColumnsChanged = true;
      }
    }

    const shouldApplySorting = (Boolean(needToApplySortingFromDataSource)
        || (!columnsSortParameters && !this._hasUserState)) && sortingChanged;
    if (shouldApplySorting) {
      /// #DEBUG
      this.__sortingUpdated = true;
      /// #ENDDEBUG
      updateSortGroupParameterIndexes(this._columns, sortParameters, 'sortIndex');
      if (fromDataSource) {
        updateColumnChanges(this, 'sorting');
        isColumnsChanged = true;
      }
    }
    if (isColumnsChanged) {
      fireColumnsChanged(this);
    }
  }

  public columnCount(): number {
    return this._columns ? this._columns.length : 0;
  }

  public columnOption(identifier: ColumnIdentifier | undefined): Column | undefined;

  public columnOption<TKey extends keyof Column>(
    identifier: ColumnIdentifier | undefined,
    option: TKey,
  ): Column[TKey] | undefined;

  public columnOption(
    identifier: ColumnIdentifier | undefined,
    option: string,
  ): unknown;

  public columnOption(
    identifier: ColumnIdentifier | undefined,
    option: string | ColumnOptionsUpdate,
    value?: unknown,
    notFireEvent?: boolean,
  ): void;

  public columnOption(
    identifier: ColumnIdentifier | undefined,
    option?: string | ColumnOptionsUpdate,
    value?: unknown,
    notFireEvent?: boolean,
  ): unknown {
    const columns = this._columns.concat(this._commandColumns);
    const column = findColumn(columns, identifier);

    if (!column) {
      return undefined;
    }

    if (arguments.length === 1) {
      return extend({}, column);
    }

    if (isString(option) && arguments.length === 2) {
      return columnOptionCore(this, column, option);
    }

    const applyOptions = (): void => {
      if (isString(option)) {
        columnOptionCore(this, column, option, value, notFireEvent);
      } else if (isObject(option)) {
        each(option, (optionName, optionValue) => {
          columnOptionCore(this, column, optionName, optionValue, notFireEvent);
        });
      }

      fireColumnsChanged(this);
    };

    const isWidthChanging = this._isWidthChanging(column, option, value, notFireEvent);
    const needOwnUpdateCycle = isWidthChanging
      && !this._updateLockCount
      && !this.component._updateLockCount;

    if (needOwnUpdateCycle) {
      this.component.beginUpdate();
      try {
        applyOptions();
        this.setRequireResize();
      } finally {
        this.component.endUpdate();
      }
    } else {
      applyOptions();

      if (isWidthChanging) {
        this.setRequireResize();
      }
    }

    return undefined;
  }

  private clearSorting(): void {
    const columnCount = this.columnCount();

    this.beginUpdate();

    for (let i = 0; i < columnCount; i += 1) {
      this.columnOption(i, 'sortOrder', undefined);
      // Delete the option to prevent loadOptions synchronization conflicts (T1147379).
      delete (findColumn(this._columns, i) as Column).sortOrder;
    }
    this.endUpdate();
  }

  public clearGrouping(): void {
    const columnCount = this.columnCount();

    this.beginUpdate();

    for (let i = 0; i < columnCount; i += 1) {
      this.columnOption(i, 'groupIndex', undefined);
    }
    this.endUpdate();
  }

  public getVisibleIndex(index: number | undefined, rowIndex?: number | null): number {
    const columns = this.getVisibleColumns(rowIndex);

    for (let i = columns.length - 1; i >= 0; i -= 1) {
      if (columns[i].index === index) {
        return i;
      }
    }
    return -1;
  }

  public getVisibleIndexByColumn(column: Column, rowIndex?: number | null): number {
    const visibleColumns = this.getVisibleColumns(rowIndex);
    const visibleColumn = visibleColumns.find((col) => (
      col.index === column.index && col.command === column.command
    ));
    return visibleColumn ? visibleColumns.indexOf(visibleColumn) : -1;
  }

  public getVisibleColumnIndex(id: ColumnIdentifier, rowIndex?: number | null): number {
    const index = this.columnOption(id, 'index');

    return this.getVisibleIndex(index, rowIndex);
  }

  private addColumn(options: Column | string): void {
    let column = createColumn(this, options) as Column;
    const index = this._columns.length;

    this._columns.push(column);

    if (column.isBand) {
      this._columns = createColumnsFromOptions(this, this._columns);
      column = this._columns[index];
    }

    column.added = options;
    updateIndexes(this, column);
    this.updateColumns(this.appliedDataSourceAdapter);
    this._checkColumns();
  }

  private deleteColumn(id: ColumnIdentifier): void {
    const column = this.columnOption(id);

    if (column && isDefined(column.index) && column.index >= 0) {
      convertOwnerBandToColumnReference(this._columns);
      this._columns.splice(column.index, 1);

      if (column.isBand) {
        const childIndexes = this.getChildrenByBandColumn(column.index)
          .map((childColumn) => childColumn.index);
        this._columns = this._columns.filter((currentColumn) => (
          !childIndexes.includes(currentColumn.index)
        ));
      }

      updateIndexes(this);
      this.updateColumns(this.appliedDataSourceAdapter);
    }
  }

  public addCommandColumn(options: Column): void {
    let commandColumn = this._commandColumns.find((column) => (
      column.command === options.command
    ));

    if (!commandColumn) {
      commandColumn = options;
      this._commandColumns.push(commandColumn);
    }
  }

  private applyUserState(): void {
    const columnsUserState = this._columnsUserState;

    if (!columnsUserState) {
      return;
    }

    const { columns, hasAddedBands } = new UserStateApplier({
      columns: this._columns,
      columnsUserState,
      ignoreColumnOptionNames: this._ignoreColumnOptionNames ?? [],
      hasUserState: this._hasUserState,
      createColumn: (columnOptions): Column => createColumn(
        this,
        isString(columnOptions) ? { dataField: columnOptions } : columnOptions,
      ),
    }).apply();

    if (hasAddedBands) {
      updateColumnIndexes(this);
      assignColumns(this, createColumnsFromOptions(this, columns));
    } else {
      assignColumns(this, columns);
    }
  }

  private getUserState(): ColumnUserState[] {
    const columns = this._columns;
    const result: ColumnUserState[] = [];
    let i = 0;

    function handleStateField(value: keyof ColumnUserState): void {
      if (columns[i][value] !== undefined) {
        result[i][value] = columns[i][value];
      }
    }

    for (i = 0; i < columns.length; i += 1) {
      result[i] = {};
      USER_STATE_FIELD_NAMES.forEach(handleStateField);
    }
    return result;
  }

  public setName(column: Column): void {
    if (!isColumnNameRequired(column)) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip empty names
      column.name = column.name || column.dataField || column.type;
    }
  }

  private getIgnoreColumnOptionNames(): string[] {
    const ignoreColumnOptionNames = this.option('stateStoring.ignoreColumnOptionNames');

    if (ignoreColumnOptionNames) {
      return ignoreColumnOptionNames;
    }

    const result: string[] = [];
    const commonColumnSettings = this.getCommonSettings();

    if (!this.option('columnChooser.enabled')) {
      result.push('visible');
    }
    if (this.option('sorting.mode') === 'none') {
      result.push('sortIndex', 'sortOrder');
    }
    if (!commonColumnSettings.allowGrouping) {
      result.push('groupIndex');
    }
    if (!commonColumnSettings.allowFixing) {
      result.push('fixed', 'fixedPosition');
    }
    if (!commonColumnSettings.allowResizing) {
      result.push('width', 'visibleWidth');
    }

    const isFilterPanelHidden = !this.option('filterPanel.visible');

    if (!this.option('filterRow.visible') && isFilterPanelHidden) {
      result.push('filterValue', 'selectedFilterOperation');
    }
    if (!this.option('headerFilter.visible') && isFilterPanelHidden) {
      result.push('filterValues', 'filterType');
    }

    return result;
  }

  public setUserState(state?: SavedColumnState[]): void {
    const dataSourceAdapter = this.appliedDataSourceAdapter;

    state?.forEach(this.setName);

    this._columnsUserState = state;
    this._ignoreColumnOptionNames = this.getIgnoreColumnOptionNames();
    this._hasUserState = !!state;

    updateColumnChanges(this, 'filtering');
    this.init(true);

    if (dataSourceAdapter) {
      // @ts-expect-error the adapter types do not support null to clear sorting
      dataSourceAdapter.sort(this.getSortDataSourceParameters());
      // @ts-expect-error the adapter types do not support null to clear grouping
      dataSourceAdapter.group(this.getGroupDataSourceParameters());
    }
  }

  public _checkColumns(): void {
    const usedNames = {};
    const duplicatedNames: string[] = [];
    let hasEditableColumnWithoutName = false;
    let hasColumnsWithoutRequiredNames = false;

    this._columns.forEach((column) => {
      const { name } = column;
      const isBand = column.columns?.length;

      const isEditable = column.allowEditing
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip empty field
        && (column.dataField || column.setCellValue) && !isBand;

      if (name) {
        if (usedNames[name]) {
          duplicatedNames.push(`"${name}"`);
        }

        usedNames[name] = true;
      } else if (isColumnNameRequired(column)) {
        hasColumnsWithoutRequiredNames = true;
      } else if (isEditable) {
        hasEditableColumnWithoutName = true;
      }
    });

    if (duplicatedNames.length) {
      errors.log('E1059', duplicatedNames.join(', '));
    }

    if (hasColumnsWithoutRequiredNames) {
      errors.log('E1066');
    }

    if (hasEditableColumnWithoutName) {
      errors.log('E1060');
    }
  }

  public _createCalculatedColumnOptions(
    columnOptions: Column,
    bandColumn?: Column,
  ): Column {
    let calculatedColumnOptions: Column = {};
    let { dataField }: { dataField?: Column['dataField'] | null } = columnOptions;

    const isBand = (Array.isArray(columnOptions.columns) && columnOptions.columns.length)
      || columnOptions.isBand;
    if (isBand) {
      calculatedColumnOptions.isBand = true;
      dataField = null;
    }

    if (dataField) {
      if (isString(dataField)) {
        const getter = compileGetter(dataField) as ColumnSelector;
        calculatedColumnOptions = {
          caption: inflector.captionize(dataField),
          calculateCellValue(
            this: Column,
            data: RawItemData,
            skipDeserialization?: boolean,
          ): unknown {
            const value = getter(data);
            return this.deserializeValue && !skipDeserialization
              ? this.deserializeValue(value) : value;
          },
          setCellValue: defaultSetCellValue,
          parseValue(text: string): unknown {
            // eslint-disable-next-line @typescript-eslint/init-declarations -- invalid input
            let result: unknown;

            if (this.dataType === 'number') {
              if (isString(text) && this.format) {
                result = strictParseNumber(text.trim(), this.format);
              } else if (isDefined(text) && isNumeric(text)) {
                result = Number(text);
              }
            } else if (this.dataType === 'boolean') {
              if (text === this.trueText) {
                result = true;
              } else if (text === this.falseText) {
                result = false;
              }
            } else if (gridCoreUtils.isDateType(this.dataType)) {
              const parsedValue = dateLocalization.parse(text, this.format);
              if (parsedValue) {
                result = parsedValue;
              }
            } else {
              result = text;
            }
            return result;
          },
        };
      }

      calculatedColumnOptions.allowFiltering = true;
    } else {
      calculatedColumnOptions.allowFiltering = !!columnOptions.calculateFilterExpression;
    }
    calculatedColumnOptions.calculateFilterExpression = function calculateFilterExpression(
      ...args: Parameters<NonNullable<Column['calculateFilterExpression']>>
    ): ReturnType<NonNullable<Column['calculateFilterExpression']>> {
      const expression = filterUtils.defaultCalculateFilterExpression.call(this, ...args);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- filterUtils is untyped
      return expression;
    };

    calculatedColumnOptions.defaultFilterOperation = '=';

    calculatedColumnOptions.createFilterExpression = function createFilterExpression(
      this: Column,
      filterValue: unknown,
      selectedFilterOperation: string | null | undefined,
    ): DataFilter {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- missing callback
      let result: ColumnFilterExpression | null | undefined;
      if (this.calculateFilterExpression) {
        // @ts-expect-error filter callbacks have a partially typed variadic contract
        // eslint-disable-next-line prefer-spread, prefer-rest-params -- forward filter arguments
        result = this.calculateFilterExpression.apply(this, arguments);
      }
      if (isFunction(result)) {
        result = [result, '=', true];
      }
      if (result) {
        result.columnIndex = this.index;
        result.filterValue = filterValue;
        result.selectedFilterOperation = selectedFilterOperation;
      }
      // @ts-expect-error column filter callbacks can return untyped predicate expressions
      return result;
    };

    if (!dataField || !isString(dataField)) {
      calculatedColumnOptions.allowSorting = false;
      calculatedColumnOptions.allowGrouping = false;
      calculatedColumnOptions.calculateCellValue = (): null => null;
    }

    if (bandColumn) {
      calculatedColumnOptions.allowFixing = false;
    }
    if (columnOptions.dataType) {
      calculatedColumnOptions.userDataType = columnOptions.dataType;
    }
    if (columnOptions.selectedFilterOperation
      && !('defaultSelectedFilterOperation' in calculatedColumnOptions)) {
      calculatedColumnOptions.defaultSelectedFilterOperation = (
        columnOptions.selectedFilterOperation
      );
    }
    if (columnOptions.lookup && columnOptions.type !== AI_COLUMN_NAME) {
      calculatedColumnOptions.lookup = {
        calculateCellValue(value: unknown, skipDeserialization?: boolean): unknown {
          let lookupValue = value;
          if (this.valueExpr) {
            // @ts-expect-error lookup values are supplied by an untyped data source
            lookupValue = this.valueMap?.[value];
          }
          return this.deserializeValue && !skipDeserialization
            ? this.deserializeValue(lookupValue) : lookupValue;
        },

        updateValueMap(): void {
          this.valueMap = {};
          if (this.items) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- compileGetter result
            const calculateValue: any = compileGetter(this.valueExpr);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- compileGetter result
            const calculateDisplayValue: any = compileGetter(this.displayExpr);
            for (const item of this.items) {
              const displayValue = calculateDisplayValue(item);
              this.valueMap[calculateValue(item)] = displayValue;
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- empty type
              this.dataType = this.dataType || getValueDataType(displayValue);
            }
          }
        },
        update(): DeferredObj<unknown> | undefined {
          let { dataSource } = this;

          if (dataSource) {
            if (isFunction(dataSource) && !variableWrapper.isWrapped(dataSource)) {
              dataSource = dataSource({});
            }
            const isSupportedDataSource = isPlainObject(dataSource)
              || (dataSource instanceof Store) || Array.isArray(dataSource);
            if (isSupportedDataSource) {
              if (this.valueExpr) {
                const dataSourceOptions = normalizeDataSourceOptions(dataSource);
                dataSourceOptions.paginate = false;
                dataSource = new DataSource(dataSourceOptions);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- untyped source
                return dataSource.load().done((data) => {
                  this.items = data;
                  this.updateValueMap?.();
                });
              }
            } else {
              errors.log('E1016');
            }
          } else {
            this.updateValueMap?.();
          }
          return undefined;
        },
      };
    }

    calculatedColumnOptions.resizedCallbacks = Callbacks();
    if (columnOptions.resized) {
      calculatedColumnOptions.resizedCallbacks.add(columnOptions.resized.bind(columnOptions));
    }

    Object.keys(calculatedColumnOptions).forEach((optionName) => {
      if (isFunction(calculatedColumnOptions[optionName]) && !optionName.startsWith('default')) {
        const defaultOptionName = `default${optionName.charAt(0).toUpperCase()}${optionName.substr(1)}`;
        calculatedColumnOptions[defaultOptionName] = calculatedColumnOptions[optionName];
      }
    });

    return calculatedColumnOptions;
  }

  public getRowCount(): number {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- recompute zero
    this._rowCount = this._rowCount || getRowCount(this);

    return this._rowCount;
  }

  public getRowIndex(columnIndex: number, alwaysGetRowIndex?: boolean): number {
    const column = this._columns[columnIndex];
    if (!column) {
      return 0;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- skip empty command
    const isCommandOrGroupColumn = column.command || this._isColumnInGroupPanel(column);
    const isVisibleDataColumn = column.visible && !isCommandOrGroupColumn;
    if (!alwaysGetRowIndex && !isVisibleDataColumn) {
      return 0;
    }

    const bandColumnsCache = this.getBandColumnsCache();
    return getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex).length;
  }

  public getChildrenByBandColumn(
    bandColumnIndex: number | undefined,
    onlyVisibleDirectChildren?: boolean,
  ): Column[] {
    const bandColumnsCache = this.getBandColumnsCache();
    const result = getChildrenByBandColumn(
      bandColumnIndex,
      bandColumnsCache.columnChildrenByIndex,
      !onlyVisibleDirectChildren,
    );

    if (onlyVisibleDirectChildren) {
      return result
        .filter((column) => column.visible && !column.command)
        .sort((column1, column2) => (
          Number(column1.visibleIndex) - Number(column2.visibleIndex)
        ));
    }

    return result;
  }

  public getVisibleDataColumnsByBandColumn(bandColumnIndex: number): Column[] {
    const result = this.getChildrenByBandColumn(bandColumnIndex, true);

    return result
      .filter((column) => !column.isBand && column.visible);
  }

  public isParentBandColumn(columnIndex: number, bandColumnIndex: number): boolean {
    let result = false;
    const column = this._columns[columnIndex];
    const bandColumnsCache = this.getBandColumnsCache();
    const parentBandColumns = column
      && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

    if (parentBandColumns) { // T416483 - fix for jquery 2.1.4
      for (const bandColumn of parentBandColumns) {
        if (bandColumn.index === bandColumnIndex) {
          result = true;
          break;
        }
      }
    }

    return result;
  }

  public isParentColumnVisible(columnIndex: number | undefined): boolean {
    let result = true;
    const bandColumnsCache = this.getBandColumnsCache();
    const bandColumns = columnIndex !== undefined && columnIndex >= 0
      && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

    if (bandColumns) {
      for (const bandColumn of bandColumns) {
        result = result && !!bandColumn.visible;
        if (!result) {
          break;
        }
      }
    }

    return result;
  }

  public getParentColumn(column: Column, needDirectParent = false): Column | undefined {
    const bandColumnsCache = this.getBandColumnsCache();
    const parentColumns = getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex);
    const parentColumnIndex = needDirectParent ? -1 : 0;

    return parentColumns.at(parentColumnIndex);
  }

  public isFirstColumn(
    column: Column,
    rowIndex: number | null,
    onlyWithinBandColumn = false,
    fixedPosition?: StickyPosition,
  ): boolean {
    return isFirstOrLastColumn(this, column, rowIndex, onlyWithinBandColumn, false, fixedPosition);
  }

  public isLastColumn(
    column: Column,
    rowIndex: number | null,
    onlyWithinBandColumn = false,
    fixedPosition?: StickyPosition,
  ): boolean {
    return isFirstOrLastColumn(this, column, rowIndex, onlyWithinBandColumn, true, fixedPosition);
  }

  public isCustomCommandColumn(commandColumn: Column): boolean {
    return gridCoreUtils.isCustomCommandColumn(this._columns, commandColumn);
  }

  public getColumnId(column: Column): string | number | undefined {
    if (column.command && column.type === GROUP_COMMAND_COLUMN_NAME) {
      if (gridCoreUtils.isCustomCommandColumn(this._columns, column)) {
        return `type:${column.type}`;
      }

      return `command:${column.command}`;
    }

    return column.index;
  }

  public getCustomizeTextByDataType(dataType?: string): Column['customizeText'] {
    return getCustomizeTextByDataType(dataType);
  }

  public getHeaderContentAlignment(columnAlignment: string | undefined): string | undefined {
    const rtlEnabled = this.option('rtlEnabled');

    if (rtlEnabled) {
      return columnAlignment === 'left' ? 'right' : 'left';
    }

    return columnAlignment;
  }

  public isVirtualMode(): boolean {
    return false;
  }

  /**
   * @extended: virtual_column
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isNeedToRenderVirtualColumns(scrollPosition: number): boolean {
    return false;
  }

  public getColumnOptionNameByFullName(fullName: string): string {
    return fullName.replace(COLUMN_OPTION_REGEXP, '');
  }

  public getFirstColumn(rowIndex: number | null): Column | undefined {
    const visibleColumns = this.getVisibleColumns(rowIndex);

    return visibleColumns.find((column: Column) => this.isFirstColumn(column, rowIndex));
  }

  /**
   * @extended: m_adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isAdaptiveHiddenColumn(column: Column): boolean {
    return false;
  }
}

export const columnsControllerModule: Module = {
  defaultOptions() {
    return {
      commonColumnSettings: {
        allowFiltering: true,
        allowHiding: true,
        allowSorting: true,
        allowEditing: true,
        encodeHtml: true,
        trueText: messageLocalization.format('dxDataGrid-trueText'),
        falseText: messageLocalization.format('dxDataGrid-falseText'),
      },
      allowColumnReordering: false,
      allowColumnResizing: false,
      columnResizingMode: 'nextColumn',
      columnMinWidth: undefined,
      columnWidth: undefined,
      adaptColumnWidthByRatio: true,

      columns: undefined,
      regenerateColumnsByVisibleItems: false,
      customizeColumns: null,
      dateSerializationFormat: undefined,
    };
  },
  controllers: {
    columns: ColumnsController,
  },
};
