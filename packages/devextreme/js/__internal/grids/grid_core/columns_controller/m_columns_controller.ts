/* eslint-disable prefer-destructuring */
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import type { ColumnBase } from '@js/common/grids';
import config from '@js/core/config';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { compileGetter } from '@js/core/utils/data';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { orderEach } from '@js/core/utils/object';
import {
  isDefined, isFunction, isNumeric, isObject, isPlainObject,
  isString,
} from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
import Store from '@js/data/abstract_store';
import filterUtils from '@js/ui/shared/filtering';
import errors from '@js/ui/widget/ui.errors';
import inflector from '@ts/core/utils/m_inflector';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { StateStoringController } from '@ts/grids/grid_core/state_storing/m_state_storing_core';

import modules from '../m_modules';
import type { Module } from '../m_types';
import gridCoreUtils from '../m_utils';
import { StickyPosition } from '../sticky_columns/const';
import {
  COLUMN_CHOOSER_LOCATION,
  COLUMN_OPTION_REGEXP,
  COMMAND_EXPAND_CLASS,
  DATATYPE_OPERATIONS,
  DETAIL_COMMAND_COLUMN_NAME,
  GROUP_COMMAND_COLUMN_NAME,
  GROUP_LOCATION,
  MAX_SAFE_INTEGER,
  USER_STATE_FIELD_NAMES,
} from './const';
import {
  addExpandColumn,
  applyUserState,
  assignColumns,
  columnOptionCore,
  convertOwnerBandToColumnReference,
  createColumn,
  createColumnsFromDataSource,
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
  isFirstOrLastColumn,
  isSortOrderValid,
  mergeColumns,
  moveColumnToGroup,
  numberToString, processBandColumns,
  processExpandColumns,
  resetBandColumnsCache,
  resetColumnsCache,
  setFilterOperationsAsDefaultValues,
  sortColumns,
  strictParseNumber,
  updateColumnChanges,
  updateColumnGroupIndexes,
  updateIndexes,
  updateSerializers,
} from './m_columns_controller_utils';

export interface Column extends ColumnBase {
  parseValue: (text: string) => unknown;
}

export class ColumnsController extends modules.Controller {
  public _skipProcessingColumnsChange: any;

  public _commandColumns: any;

  public _columns: any;

  private _isColumnsFromOptions: any;

  public _columnsUserState: any;

  private _dataSourceApplied: any;

  private _dataSource: any;

  public _ignoreColumnOptionNames: any;

  private _dataSourceColumnsCount: any;

  private _visibleColumns: any;

  private _fixedColumns: any;

  private _rowCount: any;

  public _bandColumnsCache: any;

  public _reinitAfterLookupChanges: any;

  private readonly _previousColumns: any;

  public _hasUserState: any;

  private __groupingUpdated: any;

  private __sortingUpdated: any;

  public columnsChanged: any;

  public _columnChanges: any;

  protected _dataController!: DataController;

  protected _focusController!: FocusController;

  protected _stateStoringController!: StateStoringController;

  public init(isApplyingUserState?): void {
    this._dataController = this.getController('data');
    this._focusController = this.getController('focus');
    this._stateStoringController = this.getController('stateStoring');
    const columns = this.option('columns');

    this._commandColumns = this._commandColumns || [];
    this._columns = this._columns || [];
    this._isColumnsFromOptions = !!columns;

    if (this._isColumnsFromOptions) {
      assignColumns(this, columns ? createColumnsFromOptions(this, columns) : []);
      applyUserState(this);
    } else {
      assignColumns(this, this._columnsUserState ? createColumnsFromOptions(this, this._columnsUserState) : this._columns);
    }

    addExpandColumn(this);

    if (this._dataSourceApplied) {
      this.applyDataSource(this._dataSource, true, isApplyingUserState);
    } else {
      updateIndexes(this);
    }

    this._checkColumns();
  }

  public _getExpandColumnOptions() {
    return {
      type: 'expand',
      command: 'expand',
      width: 'auto',
      cssClass: COMMAND_EXPAND_CLASS,
      allowEditing: false, // T165142
      allowGrouping: false,
      allowSorting: false,
      allowResizing: false,
      allowReordering: false,
      allowHiding: false,
    };
  }

  public _getFirstItems(dataSource) {
    let groupsCount;
    let items: any = [];

    const getFirstItemsCore = function (items, groupsCount) {
      if (!items || !groupsCount) {
        return items;
      }
      for (let i = 0; i < items.length; i++) {
        const childItems = getFirstItemsCore(items[i].items || items[i].collapsedItems, groupsCount - 1);
        if (childItems && childItems.length) {
          return childItems;
        }
      }
    };

    if (dataSource && dataSource.items().length > 0) {
      groupsCount = gridCoreUtils.normalizeSortingInfo(dataSource.group()).length;
      items = getFirstItemsCore(dataSource.items(), groupsCount) || [];
    }
    return items;
  }

  protected _endUpdateCore() {
    !this._skipProcessingColumnsChange && fireColumnsChanged(this);
  }

  protected callbackNames() {
    return ['columnsChanged'];
  }

  public getColumnByPath(path, columns?) {
    const that = this;
    let column;
    const columnIndexes: any = [];

    path.replace(COLUMN_OPTION_REGEXP, (_, columnIndex) => {
      // eslint-disable-next-line radix
      columnIndexes.push(parseInt(columnIndex));
      return '';
    });

    if (columnIndexes.length) {
      if (columns) {
        column = columnIndexes.reduce((column, index) => column && column.columns && column.columns[index], { columns });
      } else {
        column = getColumnByIndexes(that, columnIndexes);
      }
    }

    return column;
  }

  public optionChanged(args) {
    let needUpdateRequireResize;

    switch (args.name) {
      case 'adaptColumnWidthByRatio':
        args.handled = true;
        break;
      case 'dataSource':
        if (args.value !== args.previousValue && !this.option('columns') && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
          this._columns = [];
        }
        break;
      case 'columns':
        needUpdateRequireResize = this._skipProcessingColumnsChange;
        args.handled = true;

        if (!this._skipProcessingColumnsChange) {
          if (args.name === args.fullName) {
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
      default:
        super.optionChanged(args);
    }
  }

  private _columnOptionChanged(args) {
    let columnOptionValue = {};
    const column = this.getColumnByPath(args.fullName);
    const columnOptionName = args.fullName.replace(COLUMN_OPTION_REGEXP, '');

    if (column) {
      if (columnOptionName) {
        columnOptionValue[columnOptionName] = args.value;
      } else {
        columnOptionValue = args.value;
      }

      this._skipProcessingColumnsChange = args.fullName;
      this.columnOption(column.index, columnOptionValue);
      this._skipProcessingColumnsChange = false;
    }
  }

  private _updateRequireResize(args) {
    const { component } = this;

    if (args.fullName.replace(COLUMN_OPTION_REGEXP, '') === 'width' && component._updateLockCount) {
      component._requireResize = true;
    }
  }

  public publicMethods() {
    return ['addColumn', 'deleteColumn', 'columnOption', 'columnCount', 'clearSorting', 'clearGrouping', 'getVisibleColumns', 'getVisibleColumnIndex'];
  }

  public applyDataSource(dataSource, forceApplying?, isApplyingUserState?) {
    const that = this;
    const isDataSourceLoaded = dataSource && dataSource.isLoaded();

    that._dataSource = dataSource;

    if (!that._dataSourceApplied || that._dataSourceColumnsCount === 0 || forceApplying || that.option('regenerateColumnsByVisibleItems')) {
      if (isDataSourceLoaded) {
        if (!that._isColumnsFromOptions) {
          const columnsFromDataSource = createColumnsFromDataSource(that, dataSource);
          if (columnsFromDataSource.length) {
            assignColumns(that, columnsFromDataSource);
            that._dataSourceColumnsCount = that._columns.length;
            applyUserState(that);
          }
        }
        return that.updateColumns(dataSource, forceApplying, isApplyingUserState);
      }
      that._dataSourceApplied = false;
      updateIndexes(that);
    } else if (isDataSourceLoaded && !that.isAllDataTypesDefined(true) && that.updateColumnDataTypes(dataSource)) {
      updateColumnChanges(that, 'columns');
      fireColumnsChanged(that);
      // @ts-expect-error
      return new Deferred().reject().promise();
    }
  }

  public reset() {
    this._dataSource = null;
    this._dataSourceApplied = false;
    this._dataSourceColumnsCount = undefined;
    this.reinit();
  }

  /**
   * @extended: virtual_columns
   * @private
   */
  public resetColumnsCache() {
    const that = this;
    that._visibleColumns = undefined;
    that._fixedColumns = undefined;
    that._rowCount = undefined;
    resetBandColumnsCache(that);
  }

  public reinit(ignoreColumnOptionNames?) {
    this._columnsUserState = this.getUserState();
    this._ignoreColumnOptionNames = ignoreColumnOptionNames || null;
    this.init();

    if (ignoreColumnOptionNames) {
      this._ignoreColumnOptionNames = null;
    }
  }

  public isInitialized() {
    return !!this._columns.length || !!this.option('columns');
  }

  public isDataSourceApplied() {
    return this._dataSourceApplied;
  }

  public getCommonSettings(column?) {
    const commonColumnSettings = (!column || !column.type) && this.option('commonColumnSettings') || {};
    const groupingOptions: any = this.option('grouping') ?? {};
    const groupPanelOptions: any = this.option('groupPanel') ?? {};

    return extend({
      allowFixing: this.option('columnFixing.enabled'),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      allowResizing: this.option('allowColumnResizing') || undefined,
      allowReordering: this.option('allowColumnReordering'),
      minWidth: this.option('columnMinWidth'),
      width: this.option('columnWidth'),
      autoExpandGroup: groupingOptions.autoExpandAll,
      allowCollapsing: groupingOptions.allowCollapsing,
      allowGrouping: groupPanelOptions.allowColumnDragging && groupPanelOptions.visible || groupingOptions.contextMenuEnabled,
    }, commonColumnSettings);
  }

  public isColumnOptionUsed(optionName): any {
    for (let i = 0; i < this._columns.length; i++) {
      if (this._columns[i][optionName]) {
        return true;
      }
    }
  }

  public isAllDataTypesDefined(checkSerializers?) {
    const columns = this._columns;

    if (!columns.length) {
      return false;
    }

    for (let i = 0; i < columns.length; i++) {
      if (!columns[i].dataField && columns[i].calculateCellValue === columns[i].defaultCalculateCellValue) {
        continue;
      }
      if (!columns[i].dataType || (checkSerializers && columns[i].deserializeValue && columns[i].serializationFormat === undefined)) {
        return false;
      }
    }

    return true;
  }

  public getColumns() {
    return this._columns;
  }

  public isBandColumnsUsed() {
    return this.getColumns().some((column) => column.isBand);
  }

  public getGroupColumns() {
    const result: any = [];

    each(this._columns, function () {
      const column = this;
      if (isDefined(column.groupIndex)) {
        result[column.groupIndex] = column;
      }
    });
    return result;
  }

  /**
   * @extended: state_storing
   */
  protected _shouldReturnVisibleColumns() {
    return true;
  }

  /**
   * @extended: virtual_column
   */
  protected _compileVisibleColumns(rowIndex?) {
    this._visibleColumns = this._visibleColumns || this._compileVisibleColumnsCore();
    rowIndex = isDefined(rowIndex) ? rowIndex : this._visibleColumns.length - 1;

    return this._visibleColumns[rowIndex] || [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getVisibleColumns(rowIndex?, isBase?: boolean) {
    if (!this._shouldReturnVisibleColumns()) {
      return [];
    }

    // @ts-expect-error
    return this._compileVisibleColumns.apply(this, arguments);
  }

  /**
   * @extended: virtual_column
   */
  public getFixedColumns(rowIndex?) {
    this._fixedColumns = this._fixedColumns || this._getFixedColumnsCore();
    rowIndex = isDefined(rowIndex) ? rowIndex : this._fixedColumns.length - 1;

    return this._fixedColumns[rowIndex] || [];
  }

  public getFilteringColumns() {
    return this.getColumns().filter((item) => (item.dataField || item.name) && (item.allowFiltering || item.allowHeaderFiltering)).map((item) => {
      const field = extend(true, {}, item);
      if (!isDefined(field.dataField)) {
        field.dataField = field.name;
      }
      field.filterOperations = item.filterOperations !== item.defaultFilterOperations ? field.filterOperations : null;
      return field;
    });
  }

  /**
   * @extended: virtual_column
   */
  public getColumnIndexOffset() {
    return 0;
  }

  // TODO: Need to rename this method to getFixedColumns after removing old fixed columns implementation
  public getStickyColumns(rowIndex?: number): any[] {
    const visibleColumns = this.getVisibleColumns(rowIndex, true);

    return visibleColumns.filter((column) => column.fixed);
  }

  private _getFixedColumnsCore() {
    const that = this;
    const result: any = [];
    const rowCount = that.getRowCount();
    const isColumnFixing = that._isColumnFixing();
    const transparentColumn: any = { command: 'transparent' };
    let transparentColspan = 0;
    let notFixedColumnCount;
    let transparentColumnIndex;
    let lastFixedPosition;

    if (isColumnFixing) {
      for (let i = 0; i <= rowCount; i++) {
        notFixedColumnCount = 0;
        lastFixedPosition = null;
        transparentColumnIndex = null;
        const visibleColumns = that.getVisibleColumns(i, true);

        for (let j = 0; j < visibleColumns.length; j++) {
          const prevColumn = visibleColumns[j - 1];
          const column = visibleColumns[j];

          if (!column.fixed || column.fixedPosition === StickyPosition.Sticky) {
            if (i === 0) {
              if (column.isBand && column.colspan) {
                transparentColspan += column.colspan;
              } else {
                transparentColspan++;
              }
            }

            notFixedColumnCount++;
            if (!isDefined(transparentColumnIndex)) {
              transparentColumnIndex = j;
            }
          } else if (prevColumn && prevColumn.fixed && getFixedPosition(that, prevColumn) !== getFixedPosition(that, column)) {
            if (!isDefined(transparentColumnIndex)) {
              transparentColumnIndex = j;
            }
          } else {
            lastFixedPosition = column.fixedPosition;
          }
        }

        if (i === 0 && (notFixedColumnCount === 0 || notFixedColumnCount >= visibleColumns.length)) {
          return [];
        }

        if (!isDefined(transparentColumnIndex)) {
          transparentColumnIndex = lastFixedPosition === 'right' ? 0 : visibleColumns.length;
        }

        result[i] = visibleColumns.slice(0);
        if (!transparentColumn.colspan) {
          transparentColumn.colspan = transparentColspan;
        }
        result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn);
      }
    }

    return result.map((columns) => columns.map((column) => {
      const newColumn = { ...column };
      if (newColumn.headerId) {
        newColumn.headerId += '-fixed';
      }
      return newColumn;
    }));
  }

  public _isColumnFixing() {
    let isColumnFixing = this.option('columnFixing.enabled');

    !isColumnFixing && each(this._columns, (_, column): any => {
      if (column.fixed) {
        isColumnFixing = true;
        return false;
      }
    });

    return isColumnFixing;
  }

  /**
   * @extended: master_detail
   */
  protected _getExpandColumnsCore() {
    return this.getGroupColumns();
  }

  private getExpandColumns() {
    let expandColumns = this._getExpandColumnsCore();
    let expandColumn;
    const firstGroupColumn = expandColumns.filter((column) => column.groupIndex === 0)[0];
    const isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed;
    const isColumnFixing = this._isColumnFixing();
    const rtlEnabled = this.option('rtlEnabled');

    if (expandColumns.length) {
      expandColumn = this.columnOption('command:expand');
    }

    expandColumns = map(expandColumns, (column) => extend({}, column, {
      visibleWidth: null,
      minWidth: null,
      cellTemplate: !isDefined(column.groupIndex) ? column.cellTemplate : null,
      headerCellTemplate: null,
      fixed: !isDefined(column.groupIndex) || !isFixedFirstGroupColumn ? isColumnFixing : true,
      fixedPosition: rtlEnabled ? 'right' : 'left',
    }, expandColumn, {
      index: column.index,
      type: column.type || GROUP_COMMAND_COLUMN_NAME,
    }));

    return expandColumns;
  }

  public getBandColumnsCache() {
    if (!this._bandColumnsCache) {
      const columns = this._columns;
      const columnChildrenByIndex = {};
      const columnParentByIndex = {};
      let isPlain = true;

      columns.forEach((column) => {
        const { ownerBand } = column;
        // @ts-expect-error
        let parentIndex = isObject(ownerBand) ? ownerBand.index : ownerBand;
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
          columnParentByIndex[column.index] = parent;
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
  protected _isColumnVisible(column) {
    return column.visible && this.isParentColumnVisible(column.index);
  }

  private _isColumnInGroupPanel(column) {
    return isDefined(column.groupIndex) && !column.showWhenGrouped;
  }

  public hasVisibleDataColumns(): boolean {
    const columns: any[] = this._columns;

    return columns.some((column) => {
      const isVisible = this._isColumnVisible(column);
      const isInGroupPanel = this._isColumnInGroupPanel(column);
      const isCommand = !!column.command;

      return isVisible && !isInGroupPanel && !isCommand;
    });
  }

  private _compileVisibleColumnsCore() {
    const bandColumnsCache = this.getBandColumnsCache();
    const columns = mergeColumns(this, this._columns, this._commandColumns, true);

    processBandColumns(this, columns, bandColumnsCache);

    const indexedColumns = this._getIndexedColumns(columns);

    const visibleColumns = this._getVisibleColumnsFromIndexed(indexedColumns);

    const isDataColumnsInvisible = !this.hasVisibleDataColumns();

    if (isDataColumnsInvisible && this._columns.length) {
      visibleColumns[visibleColumns.length - 1].push({ command: 'empty' });
    }

    return visibleColumns;
  }

  private _getIndexedColumns(columns) {
    const rtlEnabled = this.option('rtlEnabled');
    const rowCount = this.getRowCount();
    const columnDigitsCount = digitsCount(columns.length);

    const bandColumnsCache = this.getBandColumnsCache();

    const positiveIndexedColumns: any = [];
    const negativeIndexedColumns: any = [];

    for (let i = 0; i < rowCount; i += 1) {
      negativeIndexedColumns[i] = [{}];

      // 0 - fixed columns on the left side
      // 1 - not fixed columns
      // 2 - fixed columns on the right side
      positiveIndexedColumns[i] = [{}, {}, {}];
    }

    columns.forEach((column) => {
      let { visibleIndex } = column;
      let indexedColumns;

      const parentBandColumns = getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex);

      const isVisible = this._isColumnVisible(column);
      const isInGroupPanel = this._isColumnInGroupPanel(column);

      if (isVisible && !isInGroupPanel) {
        const rowIndex = parentBandColumns.length;

        if (visibleIndex < 0) {
          visibleIndex = -visibleIndex;
          indexedColumns = negativeIndexedColumns[rowIndex];
        } else {
          column.fixed = parentBandColumns[0]?.fixed ?? column.fixed;
          column.fixedPosition = parentBandColumns[0]?.fixedPosition ?? column.fixedPosition;

          if (column.fixed && column.fixedPosition !== StickyPosition.Sticky) {
            const isDefaultCommandColumn = !!column.command && !gridCoreUtils.isCustomCommandColumn(this._columns, column);

            let isFixedToEnd = column.fixedPosition === 'right';

            if (rtlEnabled && !isDefaultCommandColumn) {
              isFixedToEnd = !isFixedToEnd;
            }

            indexedColumns = isFixedToEnd
              ? positiveIndexedColumns[rowIndex][2]
              : positiveIndexedColumns[rowIndex][0];
          } else {
            indexedColumns = positiveIndexedColumns[rowIndex][1];
          }
        }

        if (parentBandColumns.length) {
          visibleIndex = numberToString(visibleIndex, columnDigitsCount);

          for (let i = parentBandColumns.length - 1; i >= 0; i -= 1) {
            visibleIndex = numberToString(parentBandColumns[i].visibleIndex, columnDigitsCount) + visibleIndex;
          }
        }

        indexedColumns[visibleIndex] = indexedColumns[visibleIndex] || [];
        indexedColumns[visibleIndex].push(column);
      }
    });

    return {
      positiveIndexedColumns, negativeIndexedColumns,
    };
  }

  private _getVisibleColumnsFromIndexed({ positiveIndexedColumns, negativeIndexedColumns }) {
    const result: any = [];

    const rowCount = this.getRowCount();
    const expandColumns = mergeColumns(this, this.getExpandColumns(), this._columns);

    let rowspanGroupColumns = 0;
    let rowspanExpandColumns = 0;

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      result.push([]);

      orderEach(negativeIndexedColumns[rowIndex], (_, columns) => {
        result[rowIndex].unshift.apply(result[rowIndex], columns);
      });

      const firstPositiveIndexColumn = result[rowIndex].length;
      const positiveIndexedRowColumns = positiveIndexedColumns[rowIndex];

      positiveIndexedRowColumns.forEach((columnsByFixing) => {
        orderEach(columnsByFixing, (_, columnsByVisibleIndex) => {
          result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex);
        });
      });

      // The order of processing is important
      if (rowspanExpandColumns <= rowIndex) {
        rowspanExpandColumns += processExpandColumns.call(this, result[rowIndex], expandColumns, DETAIL_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
      }

      if (rowspanGroupColumns <= rowIndex) {
        rowspanGroupColumns += processExpandColumns.call(this, result[rowIndex], expandColumns, GROUP_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
      }
    }

    result.push(getDataColumns(result));

    return result;
  }

  public getInvisibleColumns(columns?, bandColumnIndex?) {
    const that = this;
    let result: any = [];
    let hiddenColumnsByBand;

    columns = columns || that._columns;

    each(columns, (_, column) => {
      if (column.ownerBand !== bandColumnIndex) {
        return;
      }
      if (column.isBand) {
        if (!column.visible) {
          hiddenColumnsByBand = that.getChildrenByBandColumn(column.index);
        } else {
          hiddenColumnsByBand = that.getInvisibleColumns(that.getChildrenByBandColumn(column.index), column.index);
        }

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

  public getChooserColumns(getAllColumns?) {
    const columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();
    const columnChooserColumns = columns.filter((column) => column.showInColumnChooser);

    const sortOrder = this.option('columnChooser.sortOrder');

    return sortColumns(columnChooserColumns, sortOrder);
  }

  /**
   * @extended: column_chooser
   */
  public allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
    const that = this;
    const columnIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation);
    const sourceColumn = that._columns[columnIndex];

    if (sourceColumn && (sourceColumn.allowReordering || sourceColumn.allowGrouping || sourceColumn.allowHiding)) {
      if (sourceLocation === targetLocation) {
        if (sourceLocation === COLUMN_CHOOSER_LOCATION) {
          return false;
        }

        // @ts-expect-error
        fromVisibleIndex = isObject(fromVisibleIndex) ? fromVisibleIndex.columnIndex : fromVisibleIndex;
        // @ts-expect-error
        toVisibleIndex = isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;

        return fromVisibleIndex !== toVisibleIndex && fromVisibleIndex + 1 !== toVisibleIndex;
      } if ((sourceLocation === GROUP_LOCATION && targetLocation !== COLUMN_CHOOSER_LOCATION) || targetLocation === GROUP_LOCATION) {
        return sourceColumn && sourceColumn.allowGrouping;
      } if (sourceLocation === COLUMN_CHOOSER_LOCATION || targetLocation === COLUMN_CHOOSER_LOCATION) {
        return sourceColumn && sourceColumn.allowHiding;
      }
      return true;
    }
    return false;
  }

  public moveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
    const that = this;
    const options: any = {};
    let prevGroupIndex;
    const fromIndex = getColumnIndexByVisibleIndex(that, fromVisibleIndex, sourceLocation);
    const toIndex = getColumnIndexByVisibleIndex(that, toVisibleIndex, targetLocation);
    let targetGroupIndex;

    if (fromIndex >= 0) {
      const column = that._columns[fromIndex];
      // @ts-expect-error
      toVisibleIndex = isObject(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
      targetGroupIndex = toIndex >= 0 ? that._columns[toIndex].groupIndex : -1;

      if (isDefined(column.groupIndex) && sourceLocation === GROUP_LOCATION) {
        if (targetGroupIndex > column.groupIndex) {
          targetGroupIndex--;
        }
        if (targetLocation !== GROUP_LOCATION) {
          options.groupIndex = undefined;
        } else {
          prevGroupIndex = column.groupIndex;
          delete column.groupIndex;
          updateColumnGroupIndexes(that);
        }
      }

      if (targetLocation === GROUP_LOCATION) {
        options.groupIndex = moveColumnToGroup(that, column, targetGroupIndex);
        column.groupIndex = prevGroupIndex;
      } else if (toVisibleIndex >= 0) {
        const targetColumn = that._columns[toIndex];

        if (!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
          options.visibleIndex = MAX_SAFE_INTEGER;
        } else if (isColumnFixed(that, column) ^ isColumnFixed(that, targetColumn)) {
          options.visibleIndex = MAX_SAFE_INTEGER;
        } else {
          options.visibleIndex = targetColumn.visibleIndex;
        }
      }

      const isVisible = targetLocation !== COLUMN_CHOOSER_LOCATION;

      if (column.visible !== isVisible) {
        options.visible = isVisible;
      }

      that.columnOption(column.index, options);
    }
  }

  public changeSortOrder(columnIndex, sortOrder) {
    const that = this;
    const options: any = {};
    const sortingOptions = that.option('sorting');
    const sortingMode = sortingOptions && sortingOptions.mode;
    const needResetSorting = sortingMode === 'single' || !sortOrder;
    const allowSorting = sortingMode === 'single' || sortingMode === 'multiple';
    const column = that._columns[columnIndex];
    const nextSortOrder = function (column) {
      if (sortOrder === 'ctrl') {
        if (!(('sortOrder' in column) && ('sortIndex' in column))) {
          return false;
        }

        options.sortOrder = undefined;
        options.sortIndex = undefined;
      } else if (isDefined(column.groupIndex) || isDefined(column.sortIndex)) {
        options.sortOrder = column.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        options.sortOrder = 'asc';
      }

      return true;
    };

    if (allowSorting && column && column.allowSorting) {
      if (needResetSorting && !isDefined(column.groupIndex)) {
        each(that._columns, function (index) {
          if (index !== columnIndex && this.sortOrder) {
            if (!isDefined(this.groupIndex)) {
              delete this.sortOrder;
            }
            delete this.sortIndex;
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

    that.columnOption(column.index, options);
  }

  /**
   * @extended: focus
   */
  public getSortDataSourceParameters(useLocalSelector?) {
    const that = this;
    const sortColumns: any = [];
    const sort: any = [];

    each(that._columns, function () {
      if ((this.dataField || this.selector || this.calculateCellValue) && isDefined(this.sortIndex) && !isDefined(this.groupIndex)) {
        sortColumns[this.sortIndex] = this;
      }
    });
    each(sortColumns, function () {
      const sortOrder = this && this.sortOrder;
      if (isSortOrderValid(sortOrder)) {
        const sortItem: any = {
          selector: this.calculateSortValue || this.displayField || this.calculateDisplayValue || (useLocalSelector && this.selector) || this.dataField || this.calculateCellValue,
          desc: this.sortOrder === 'desc',
        };

        if (this.sortingMethod) {
          sortItem.compare = this.sortingMethod.bind(this);
        }

        sort.push(sortItem);
      }
    });
    return sort.length > 0 ? sort : null;
  }

  public getGroupDataSourceParameters(useLocalSelector?) {
    const group: any = [];

    each(this.getGroupColumns(), function () {
      const selector = this.calculateGroupValue || this.displayField || this.calculateDisplayValue || (useLocalSelector && this.selector) || this.dataField || this.calculateCellValue;
      if (selector) {
        const groupItem: any = {
          selector,
          desc: this.sortOrder === 'desc',
          isExpanded: !!this.autoExpandGroup,
        };

        if (this.sortingMethod) {
          groupItem.compare = this.sortingMethod.bind(this);
        }

        group.push(groupItem);
      }
    });
    return group.length > 0 ? group : null;
  }

  public refresh(updateNewLookupsOnly?) {
    const deferreds: any = [];

    each(this._columns, function () {
      const { lookup } = this;

      if (lookup && !this.calculateDisplayValue) {
        if (updateNewLookupsOnly && lookup.valueMap) {
          return;
        }

        if (lookup.update) {
          deferreds.push(lookup.update());
        }
      }
    });
    return when.apply($, deferreds).done(resetColumnsCache.bind(null, this));
  }

  private _updateColumnOptions(column, columnIndex) {
    const defaultSelector = (data) => column.calculateCellValue(data);
    const shouldTakeOriginalCallbackFromPrevious = this._reinitAfterLookupChanges
      && this._previousColumns?.[columnIndex];

    column.selector = column.selector ?? defaultSelector;
    column.selector.columnIndex = columnIndex;
    column.selector.originalCallback = shouldTakeOriginalCallbackFromPrevious
      ? this._previousColumns[columnIndex].selector?.originalCallback ?? column.selector
      : column.selector;

    each(['calculateSortValue', 'calculateGroupValue', 'calculateDisplayValue'], (_, calculateCallbackName) => {
      const calculateCallback = column[calculateCallbackName];
      if (isFunction(calculateCallback)) {
        if (!calculateCallback.originalCallback) {
          const context = { column };
          column[calculateCallbackName] = function (data) { return calculateCallback.call(context.column, data); };
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
      column.calculateDisplayValue = compileGetter(column.displayField);
    }
    if (column.calculateDisplayValue) {
      column.displayValueMap = column.displayValueMap || {};
    }

    updateSerializers(column, column.dataType);

    const { lookup } = column;
    if (lookup) {
      updateSerializers(lookup, lookup.dataType);
    }

    const dataType = lookup ? lookup.dataType : column.dataType;
    if (dataType) {
      column.alignment = column.alignment || getAlignmentByDataType(dataType, this.option('rtlEnabled'));
      column.format = column.format || gridCoreUtils.getFormatByDataType(dataType);
      column.customizeText = column.customizeText || getCustomizeTextByDataType(dataType);
      column.defaultFilterOperations = column.defaultFilterOperations || !lookup && DATATYPE_OPERATIONS[dataType] || [];
      if (!isDefined(column.filterOperations)) {
        setFilterOperationsAsDefaultValues(column);
      }
      column.defaultFilterOperation = column.filterOperations && column.filterOperations[0] || '=';
      column.showEditorAlways = isDefined(column.showEditorAlways) ? column.showEditorAlways : dataType === 'boolean' && !column.cellTemplate && !column.lookup;
    }
  }

  public updateColumnDataTypes(dataSource) {
    const that = this;
    const dateSerializationFormat = that.option('dateSerializationFormat');
    const firstItems = that._getFirstItems(dataSource);
    let isColumnDataTypesUpdated = false;

    each(that._columns, (index, column) => {
      let i;
      let value;
      let dataType;
      let lookupDataType;
      let valueDataType;
      const { lookup } = column;

      if (gridCoreUtils.isDateType(column.dataType) && column.serializationFormat === undefined) {
        column.serializationFormat = dateSerializationFormat;
      }
      if (lookup && gridCoreUtils.isDateType(lookup.dataType) && column.serializationFormat === undefined) {
        lookup.serializationFormat = dateSerializationFormat;
      }

      if (column.calculateCellValue && firstItems.length) {
        if (!column.dataType || (lookup && !lookup.dataType)) {
          for (i = 0; i < firstItems.length; i++) {
            value = column.calculateCellValue(firstItems[i]);

            if (!column.dataType) {
              valueDataType = getValueDataType(value);
              dataType = dataType || valueDataType;
              if (dataType && valueDataType && dataType !== valueDataType) {
                dataType = 'string';
              }
            }

            if (lookup && !lookup.dataType) {
              valueDataType = getValueDataType(gridCoreUtils.getDisplayValue(column, value, firstItems[i]));
              lookupDataType = lookupDataType || valueDataType;
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
        }
        if (column.serializationFormat === undefined || (lookup && lookup.serializationFormat === undefined)) {
          for (i = 0; i < firstItems.length; i++) {
            value = column.calculateCellValue(firstItems[i], true);

            if (column.serializationFormat === undefined) {
              column.serializationFormat = getSerializationFormat(column.dataType, value);
            }

            if (lookup && lookup.serializationFormat === undefined) {
              lookup.serializationFormat = getSerializationFormat(lookup.dataType, lookup.calculateCellValue(value, true));
            }
          }
        }
      }

      that._updateColumnOptions(column, index);
    });

    return isColumnDataTypesUpdated;
  }

  private _customizeColumns(columns) {
    const that = this;
    const customizeColumns: any = that.option('customizeColumns');

    if (customizeColumns) {
      const hasOwnerBand = columns.some((column) => isObject(column.ownerBand));

      if (hasOwnerBand) {
        updateIndexes(that);
      }

      customizeColumns(columns);
      assignColumns(that, createColumnsFromOptions(that, columns));
    }
  }

  public updateColumns(dataSource?, forceApplying?, isApplyingUserState?): any {
    if (!forceApplying) {
      this.updateSortingGrouping(dataSource);
    }

    if (!dataSource || dataSource.isLoaded()) {
      const sortParameters = dataSource ? dataSource.sort() || [] : this.getSortDataSourceParameters();
      const groupParameters = dataSource ? dataSource.group() || [] : this.getGroupDataSourceParameters();
      const filterParameters = dataSource?.lastLoadOptions().filter;

      if (!isApplyingUserState) {
        this._customizeColumns(this._columns);
      }

      updateIndexes(this);

      const columns = this._columns;
      return when(this.refresh(true)).always(() => {
        if (this._columns !== columns) return;

        this._updateChanges(dataSource, { sorting: sortParameters, grouping: groupParameters, filtering: filterParameters });

        fireColumnsChanged(this);
      });
    }
  }

  private _updateChanges(dataSource, parameters) {
    if (dataSource) {
      this.updateColumnDataTypes(dataSource);
      this._dataSourceApplied = true;
    }

    if (!gridCoreUtils.equalSortParameters(parameters.sorting, this.getSortDataSourceParameters())) {
      updateColumnChanges(this, 'sorting');
    }
    if (!gridCoreUtils.equalSortParameters(parameters.grouping, this.getGroupDataSourceParameters())) {
      updateColumnChanges(this, 'grouping');
    }

    if (this._dataController
      && !gridCoreUtils.equalFilterParameters(parameters.filtering, this._dataController.getCombinedFilter())) {
      updateColumnChanges(this, 'filtering');
    }
    updateColumnChanges(this, 'columns');
  }

  public updateSortingGrouping(dataSource, fromDataSource?) {
    const that = this;
    let sortParameters;
    let isColumnsChanged;
    const updateSortGroupParameterIndexes = function (columns, sortParameters, indexParameterName) {
      each(columns, (index, column) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete column[indexParameterName];
        if (sortParameters) {
          for (let i = 0; i < sortParameters.length; i++) {
            const { selector } = sortParameters[i];
            const { isExpanded } = sortParameters[i];

            if (selector === column.dataField
              || selector === column.name
              || selector === column.displayField
              || selector === column.selector
              || selector === column.calculateCellValue
              || selector === column.calculateGroupValue
              || selector === column.calculateDisplayValue
            ) {
              if (fromDataSource) {
                column.sortOrder = 'sortOrder' in column ? column.sortOrder : sortParameters[i].desc ? 'desc' : 'asc';
              } else {
                column.sortOrder = column.sortOrder || (sortParameters[i].desc ? 'desc' : 'asc');
              }

              if (isExpanded !== undefined) {
                column.autoExpandGroup = isExpanded;
              }

              column[indexParameterName] = i;
              break;
            }
          }
        }
      });
    };
    if (dataSource) {
      sortParameters = gridCoreUtils.normalizeSortingInfo(dataSource.sort());
      const groupParameters = gridCoreUtils.normalizeSortingInfo(dataSource.group());
      const columnsGroupParameters = that.getGroupDataSourceParameters();
      const columnsSortParameters = that.getSortDataSourceParameters();
      const groupingChanged = !gridCoreUtils.equalSortParameters(groupParameters, columnsGroupParameters, true);
      const groupExpandingChanged = !groupingChanged && !gridCoreUtils.equalSortParameters(groupParameters, columnsGroupParameters);

      if (!that._columns.length) {
        each(groupParameters, (index, group) => {
          that._columns.push(group.selector);
        });
        each(sortParameters, (index, sort) => {
          if (!isFunction(sort.selector)) {
            that._columns.push(sort.selector);
          }
        });
        assignColumns(that, createColumnsFromOptions(that, that._columns));
      }

      if ((fromDataSource || (!columnsGroupParameters && !that._hasUserState)) && (groupingChanged || groupExpandingChanged)) {
        /// #DEBUG
        that.__groupingUpdated = true;
        /// #ENDDEBUG
        updateSortGroupParameterIndexes(that._columns, groupParameters, 'groupIndex');
        if (fromDataSource) {
          groupingChanged && updateColumnChanges(that, 'grouping');
          groupExpandingChanged && updateColumnChanges(that, 'groupExpanding');
          isColumnsChanged = true;
        }
      }
      if ((fromDataSource || (!columnsSortParameters && !that._hasUserState)) && !gridCoreUtils.equalSortParameters(sortParameters, columnsSortParameters)) {
        /// #DEBUG
        that.__sortingUpdated = true;
        /// #ENDDEBUG
        updateSortGroupParameterIndexes(that._columns, sortParameters, 'sortIndex');
        if (fromDataSource) {
          updateColumnChanges(that, 'sorting');
          isColumnsChanged = true;
        }
      }
      if (isColumnsChanged) {
        fireColumnsChanged(that);
      }
    }
  }

  public updateFilter(filter, remoteFiltering, columnIndex?, filterValue?) {
    const that = this;

    if (!Array.isArray(filter)) return filter;

    filter = extend([], filter);

    columnIndex = filter.columnIndex !== undefined ? filter.columnIndex : columnIndex;
    filterValue = filter.filterValue !== undefined ? filter.filterValue : filterValue;

    if (isString(filter[0]) && filter[0] !== '!') {
      const column = that.columnOption(filter[0]);

      if (remoteFiltering) {
        if (config().forceIsoDateParsing && column && column.serializeValue && filter.length > 1) {
          filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1], 'filter');
        }
      } else if (column && column.selector) {
        filter[0] = column.selector;
        filter[0].columnIndex = column.index;
      }
    } else if (isFunction(filter[0])) {
      filter[0].columnIndex = columnIndex;
      filter[0].filterValue = filterValue;
      filter[0].selectedFilterOperation = filter.selectedFilterOperation;
    }

    for (let i = 0; i < filter.length; i++) {
      filter[i] = that.updateFilter(filter[i], remoteFiltering, columnIndex, filterValue);
    }

    return filter;
  }

  public columnCount() {
    return this._columns ? this._columns.length : 0;
  }

  public columnOption(identifier, option?, value?, notFireEvent?) {
    const that = this;
    const columns = that._columns.concat(that._commandColumns);
    const column = findColumn(columns, identifier);

    if (column) {
      if (arguments.length === 1) {
        return extend({}, column);
      }
      if (isString(option)) {
        if (arguments.length === 2) {
          return columnOptionCore(that, column, option);
        }
        columnOptionCore(that, column, option, value, notFireEvent);
      } else if (isObject(option)) {
        each(option, (optionName, value) => {
          columnOptionCore(that, column, optionName, value, notFireEvent);
        });
      }

      fireColumnsChanged(that);
    }
  }

  private clearSorting() {
    const that = this;
    const columnCount = this.columnCount();

    that.beginUpdate();

    for (let i = 0; i < columnCount; i++) {
      that.columnOption(i, 'sortOrder', undefined);
      // option needs to be deleted from column to prevert conflicts in syncing loadOptions from dataSource. See T1147379
      delete findColumn(that._columns, i).sortOrder;
    }
    that.endUpdate();
  }

  private clearGrouping() {
    const that = this;
    const columnCount = this.columnCount();

    that.beginUpdate();

    for (let i = 0; i < columnCount; i++) {
      that.columnOption(i, 'groupIndex', undefined);
    }
    that.endUpdate();
  }

  public getVisibleIndex(index, rowIndex?) {
    const columns = this.getVisibleColumns(rowIndex);

    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].index === index) {
        return i;
      }
    }
    return -1;
  }

  public getVisibleIndexByColumn(column, rowIndex) {
    const visibleColumns = this.getVisibleColumns(rowIndex);
    const visibleColumn = visibleColumns.filter((col) => col.index === column.index && col.command === column.command)[0];
    return visibleColumns.indexOf(visibleColumn);
  }

  public getVisibleColumnIndex(id, rowIndex?) {
    const index = this.columnOption(id, 'index');

    return this.getVisibleIndex(index, rowIndex);
  }

  private addColumn(options) {
    const that = this;
    let column = createColumn(that, options);
    const index = that._columns.length;

    that._columns.push(column);

    if (column.isBand) {
      that._columns = createColumnsFromOptions(that, that._columns);
      column = that._columns[index];
    }

    column.added = options;
    updateIndexes(that, column);
    that.updateColumns(that._dataSource);
    that._checkColumns();
  }

  private deleteColumn(id) {
    const that = this;
    const column = that.columnOption(id);

    if (column && column.index >= 0) {
      convertOwnerBandToColumnReference(that._columns);
      that._columns.splice(column.index, 1);

      if (column.isBand) {
        const childIndexes = that.getChildrenByBandColumn(column.index).map((column) => column.index);
        that._columns = that._columns.filter((column) => childIndexes.indexOf(column.index) < 0);
      }

      updateIndexes(that);
      that.updateColumns(that._dataSource);
    }
  }

  public addCommandColumn(options) {
    let commandColumn = this._commandColumns.filter((column) => column.command === options.command)[0];

    if (!commandColumn) {
      commandColumn = options;
      this._commandColumns.push(commandColumn);
    }
  }

  private getUserState() {
    const columns = this._columns;
    const result: any = [];
    let i;

    function handleStateField(index, value) {
      if (columns[i][value] !== undefined) {
        result[i][value] = columns[i][value];
      }
    }

    for (i = 0; i < columns.length; i++) {
      result[i] = {};
      each(USER_STATE_FIELD_NAMES, handleStateField);
    }
    return result;
  }

  public setName(column) {
    column.name = column.name || column.dataField || column.type;
  }

  public setUserState(state) {
    const that = this;
    const dataSource = that._dataSource;

    let ignoreColumnOptionNames: any = that.option('stateStoring.ignoreColumnOptionNames');

    state?.forEach(this.setName);

    if (!ignoreColumnOptionNames) {
      ignoreColumnOptionNames = [];
      const commonColumnSettings = that.getCommonSettings();

      if (!that.option('columnChooser.enabled')) ignoreColumnOptionNames.push('visible');
      if (that.option('sorting.mode') === 'none') ignoreColumnOptionNames.push('sortIndex', 'sortOrder');
      if (!commonColumnSettings.allowGrouping) ignoreColumnOptionNames.push('groupIndex');
      if (!commonColumnSettings.allowFixing) ignoreColumnOptionNames.push('fixed', 'fixedPosition');
      if (!commonColumnSettings.allowResizing) ignoreColumnOptionNames.push('width', 'visibleWidth');

      const isFilterPanelHidden = !that.option('filterPanel.visible');
      if (!that.option('filterRow.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValue', 'selectedFilterOperation');
      if (!that.option('headerFilter.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValues', 'filterType');
    }

    that._columnsUserState = state;
    that._ignoreColumnOptionNames = ignoreColumnOptionNames;
    that._hasUserState = !!state;

    updateColumnChanges(that, 'filtering');
    that.init(true);

    if (dataSource) {
      dataSource.sort(that.getSortDataSourceParameters());
      dataSource.group(that.getGroupDataSourceParameters());
    }
  }

  public _checkColumns() {
    const usedNames = {};
    let hasEditableColumnWithoutName = false;
    const duplicatedNames: any = [];
    this._columns.forEach((column) => {
      const { name } = column;
      const isBand = column.columns?.length;
      const isEditable = column.allowEditing && (column.dataField || column.setCellValue) && !isBand;
      if (name) {
        if (usedNames[name]) {
          duplicatedNames.push(`"${name}"`);
        }

        usedNames[name] = true;
      } else if (isEditable) {
        hasEditableColumnWithoutName = true;
      }
    });

    if (duplicatedNames.length) {
      errors.log('E1059', duplicatedNames.join(', '));
    }

    if (hasEditableColumnWithoutName) {
      errors.log('E1060');
    }
  }

  public _createCalculatedColumnOptions(columnOptions, bandColumn) {
    let calculatedColumnOptions: any = {};
    let { dataField } = columnOptions;

    if (Array.isArray(columnOptions.columns) && columnOptions.columns.length || columnOptions.isBand) {
      calculatedColumnOptions.isBand = true;
      dataField = null;
    }

    if (dataField) {
      if (isString(dataField)) {
        const getter = compileGetter(dataField);
        calculatedColumnOptions = {
          caption: inflector.captionize(dataField),
          calculateCellValue(data, skipDeserialization) {
            // @ts-expect-error
            const value = getter(data);
            return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
          },
          setCellValue: defaultSetCellValue,
          parseValue(text) {
            const column = this;
            let result;
            let parsedValue;

            if (column.dataType === 'number') {
              if (isString(text) && column.format) {
                result = strictParseNumber(text.trim(), column.format);
              } else if (isDefined(text) && isNumeric(text)) {
                result = Number(text);
              }
            } else if (column.dataType === 'boolean') {
              if (text === column.trueText) {
                result = true;
              } else if (text === column.falseText) {
                result = false;
              }
            } else if (gridCoreUtils.isDateType(column.dataType)) {
              // @ts-expect-error
              parsedValue = dateLocalization.parse(text, column.format);
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
    calculatedColumnOptions.calculateFilterExpression = function () {
      // @ts-expect-error
      return filterUtils.defaultCalculateFilterExpression.apply(this, arguments);
    };

    calculatedColumnOptions.defaultFilterOperation = '=';

    calculatedColumnOptions.createFilterExpression = function (filterValue, selectedFilterOperation) {
      let result;
      if (this.calculateFilterExpression) {
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
      return result;
    };

    if (!dataField || !isString(dataField)) {
      extend(true, calculatedColumnOptions, {
        allowSorting: false,
        allowGrouping: false,
        calculateCellValue() {
          return null;
        },
      });
    }

    if (bandColumn) {
      calculatedColumnOptions.allowFixing = false;
    }
    if (columnOptions.dataType) {
      calculatedColumnOptions.userDataType = columnOptions.dataType;
    }
    if (columnOptions.selectedFilterOperation && !('defaultSelectedFilterOperation' in calculatedColumnOptions)) {
      calculatedColumnOptions.defaultSelectedFilterOperation = columnOptions.selectedFilterOperation;
    }
    if (columnOptions.lookup) {
      calculatedColumnOptions.lookup = {
        calculateCellValue(value, skipDeserialization) {
          if (this.valueExpr) {
            value = this.valueMap && this.valueMap[value];
          }
          return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
        },

        updateValueMap() {
          this.valueMap = {};
          if (this.items) {
            const calculateValue: any = compileGetter(this.valueExpr);
            const calculateDisplayValue: any = compileGetter(this.displayExpr);
            for (let i = 0; i < this.items.length; i++) {
              const item = this.items[i];
              const displayValue = calculateDisplayValue(item);
              this.valueMap[calculateValue(item)] = displayValue;
              this.dataType = this.dataType || getValueDataType(displayValue);
            }
          }
        },
        update() {
          const that = this;
          let { dataSource } = that;

          if (dataSource) {
            if (isFunction(dataSource) && !variableWrapper.isWrapped(dataSource)) {
              dataSource = dataSource({});
            }
            if (isPlainObject(dataSource) || (dataSource instanceof Store) || Array.isArray(dataSource)) {
              if (that.valueExpr) {
                // @ts-expect-error
                const dataSourceOptions = normalizeDataSourceOptions(dataSource);
                dataSourceOptions.paginate = false;
                dataSource = new DataSource(dataSourceOptions);
                return dataSource.load().done((data) => {
                  that.items = data;
                  that.updateValueMap && that.updateValueMap();
                });
              }
            } else {
              errors.log('E1016');
            }
          } else {
            that.updateValueMap && that.updateValueMap();
          }
        },
      };
    }

    calculatedColumnOptions.resizedCallbacks = Callbacks();
    if (columnOptions.resized) {
      calculatedColumnOptions.resizedCallbacks.add(columnOptions.resized.bind(columnOptions));
    }

    each(calculatedColumnOptions, (optionName: any) => {
      if (isFunction(calculatedColumnOptions[optionName]) && optionName.indexOf('default') !== 0) {
        const defaultOptionName = `default${optionName.charAt(0).toUpperCase()}${optionName.substr(1)}`;
        calculatedColumnOptions[defaultOptionName] = calculatedColumnOptions[optionName];
      }
    });

    return calculatedColumnOptions;
  }

  public getRowCount() {
    this._rowCount = this._rowCount || getRowCount(this);

    return this._rowCount;
  }

  public getRowIndex(columnIndex, alwaysGetRowIndex?) {
    const column = this._columns[columnIndex];
    const bandColumnsCache = this.getBandColumnsCache();

    return column && (alwaysGetRowIndex || column.visible && !(column.command || isDefined(column.groupIndex))) ? getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex).length : 0;
  }

  public getChildrenByBandColumn(bandColumnIndex, onlyVisibleDirectChildren?) {
    const that = this;
    const bandColumnsCache = that.getBandColumnsCache();
    const result = getChildrenByBandColumn(bandColumnIndex, bandColumnsCache.columnChildrenByIndex, !onlyVisibleDirectChildren);

    if (onlyVisibleDirectChildren) {
      return result
        .filter((column) => column.visible && !column.command)
        .sort((column1, column2) => column1.visibleIndex - column2.visibleIndex);
    }

    return result;
  }

  public getVisibleDataColumnsByBandColumn(bandColumnIndex: number) {
    const that = this;
    const bandColumnsCache = that.getBandColumnsCache();
    const result = this.getChildrenByBandColumn(bandColumnIndex, bandColumnsCache.columnChildrenByIndex);

    return result
      .filter((column) => !column.isBand && column.visible);
  }

  public isParentBandColumn(columnIndex, bandColumnIndex) {
    let result = false;
    const column = this._columns[columnIndex];
    const bandColumnsCache = this.getBandColumnsCache();
    const parentBandColumns = column && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

    if (parentBandColumns) { // T416483 - fix for jquery 2.1.4
      each(parentBandColumns, (_, bandColumn): any => {
        if (bandColumn.index === bandColumnIndex) {
          result = true;
          return false;
        }
      });
    }

    return result;
  }

  public isParentColumnVisible(columnIndex) {
    let result = true;
    const bandColumnsCache = this.getBandColumnsCache();
    const bandColumns = columnIndex >= 0 && getParentBandColumns(columnIndex, bandColumnsCache.columnParentByIndex);

    bandColumns && each(bandColumns, (_, bandColumn) => {
      result = result && bandColumn.visible;
      return result;
    });

    return result;
  }

  public getParentColumn(column) {
    const bandColumnsCache = this.getBandColumnsCache();
    const bandColumns = getParentBandColumns(column.index, bandColumnsCache.columnParentByIndex);

    return bandColumns[0];
  }

  public isFirstColumn(
    column,
    rowIndex: number | null,
    onlyWithinBandColumn = false,
    fixedPosition?: StickyPosition,
  ): boolean {
    return isFirstOrLastColumn(this, column, rowIndex, onlyWithinBandColumn, false, fixedPosition);
  }

  public isLastColumn(
    column,
    rowIndex: number,
    onlyWithinBandColumn = false,
    fixedPosition?: StickyPosition,
  ): boolean {
    return isFirstOrLastColumn(this, column, rowIndex, onlyWithinBandColumn, true, fixedPosition);
  }

  public getColumnId(column) {
    if (column.command && column.type === GROUP_COMMAND_COLUMN_NAME) {
      if (gridCoreUtils.isCustomCommandColumn(this._columns, column)) {
        return `type:${column.type}`;
      }

      return `command:${column.command}`;
    }

    return column.index;
  }

  public getCustomizeTextByDataType(dataType) {
    return getCustomizeTextByDataType(dataType);
  }

  public getHeaderContentAlignment(columnAlignment) {
    const rtlEnabled = this.option('rtlEnabled');

    if (rtlEnabled) {
      return columnAlignment === 'left' ? 'right' : 'left';
    }

    return columnAlignment;
  }

  public isVirtualMode(): boolean {
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
