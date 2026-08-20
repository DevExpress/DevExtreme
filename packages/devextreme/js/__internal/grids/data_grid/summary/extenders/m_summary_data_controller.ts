import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import {
  isDefined, isEmptyObject, isString,
} from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import type { DataSource } from '@ts/data/data_source/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import gridCore from '../../m_core';
import { DATAGRID_GROUP_FOOTER_ROW_TYPE, DATAGRID_TOTAL_FOOTER_ROW_TYPE } from '../const';
import type { CalculateSummaryCellsArgs, ColumnMap, SummaryCellItem } from '../types';
import { getColumnFromMap, getSummaryCellIndex } from '../utils';

const getGroupAggregates = (data) => data.summary || data.aggregates || [];

export const summaryDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class SummaryDataControllerExtender extends Base {
  private _footerItems!: any[];

  // MYTODO: change to private after DataController._editingController is removed
  protected _editingController!: EditingController;

  public init(): void {
    this._footerItems = [];
    this._editingController = this.getController('editing');
    super.init();
  }

  private _isDataColumn(column) {
    return column && (!isDefined(column.groupIndex) || column.showWhenGrouped);
  }

  private _isGroupFooterVisible() {
    const groupItems: any = this.option('summary.groupItems') || [];

    for (let i = 0; i < groupItems.length; i++) {
      const groupItem = groupItems[i];
      const column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
      if (groupItem.showInGroupFooter && this._isDataColumn(column)) {
        return true;
      }
    }

    return false;
  }

  private _processGroupItems(items, groupCount, options) {
    const data = options?.data;
    // @ts-expect-error
    const result = super._processGroupItems.apply(this, arguments);

    if (options) {
      if (options.isGroupFooterVisible === undefined) {
        options.isGroupFooterVisible = this._isGroupFooterVisible();
      }

      if (data?.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
        result.push({
          rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
          key: options.path.slice(),
          data,
          groupIndex: options.path.length - 1,
          values: [],
        });
      }
    }
    return result;
  }

  private _processGroupItem(groupItem, options) {
    options.summaryGroupItems ??= this.option('summary.groupItems') || [];
    options.summaryColumnMap ??= this._buildColumnLookupMap();

    if (groupItem.rowType === 'group') {
      let groupColumnIndex = -1;
      let afterGroupColumnIndex = -1;

      each(options.visibleColumns, function (visibleIndex: any) {
        const prevColumn = options.visibleColumns[visibleIndex - 1];

        if (groupItem.groupIndex === this.groupIndex) {
          groupColumnIndex = this.index;
        }

        if (visibleIndex > 0 && prevColumn.command === 'expand' && this.command !== 'expand') {
          afterGroupColumnIndex = this.index;
        }
      });

      groupItem.summaryCells = this._calculateSummaryCells({
        summaryItems: options.summaryGroupItems,
        aggregates: getGroupAggregates(groupItem.data),
        visibleColumns: options.visibleColumns,
        calculateTargetColumnIndex: (summaryItem, column) => {
          if (summaryItem.showInGroupFooter) {
            return -1;
          }

          if (summaryItem.alignByColumn
            && column
            && !isDefined(column.groupIndex)
            && (column.index !== afterGroupColumnIndex)
          ) {
            return column.index;
          }

          return groupColumnIndex;
        },
        isGroupRow: true,
        columnMap: options.summaryColumnMap,
      });
    }

    if (groupItem.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE) {
      groupItem.summaryCells = this._calculateSummaryCells({
        summaryItems: options.summaryGroupItems,
        aggregates: getGroupAggregates(groupItem.data),
        visibleColumns: options.visibleColumns,
        calculateTargetColumnIndex: (summaryItem, column) => (
          summaryItem.showInGroupFooter && this._isDataColumn(column) ? column.index : -1
        ),
        isGroupRow: false,
        columnMap: options.summaryColumnMap,
      });
    }

    return groupItem;
  }

  // The map is built once per _processItems cycle (via options) and discarded after.
  private _buildColumnLookupMap(): ColumnMap {
    const columnMap: ColumnMap = new Map();
    const allColumns = this._columnsController.getColumns();

    for (const column of allColumns) {
      const copiedColumn = { ...column };
      // The method registers each column under a few keys: index, name, dataField, and caption.
      // This is because the developer can specify summaryItem.column (and summaryItem.showInColumn)
      // in any of these forms — number for column index and string for all the rest.
      const keys = [
        column.index,
        column.name,
        column.dataField,
        column.caption,
      ].filter((key) => (
        key !== undefined && !columnMap.has(key)
      ));

      for (const key of keys) {
        columnMap.set(key, copiedColumn);
      }
    }

    return columnMap;
  }

  private _calculateSummaryCells({
    summaryItems,
    aggregates,
    visibleColumns,
    calculateTargetColumnIndex,
    isGroupRow,
    columnMap,
  }: CalculateSummaryCellsArgs) {
    const summaryCells: SummaryCellItem[][] = [];
    const summaryCellsByColumns: Record<number, SummaryCellItem[]> = {};
    const getColumnByKey = (key) => (
      columnMap
        ? getColumnFromMap(key, columnMap)
        : this._columnsController.columnOption(key)
    );

    each(summaryItems, (summaryIndex, summaryItem) => {
      const column = getColumnByKey(summaryItem.column);
      const showInColumn = summaryItem.showInColumn
        ? getColumnByKey(summaryItem.showInColumn)
        : undefined;
      const columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn ?? column);

      if (columnIndex >= 0) {
        if (!summaryCellsByColumns[columnIndex]) {
          summaryCellsByColumns[columnIndex] = [];
        }

        const aggregate = aggregates[summaryIndex];
        if (aggregate === aggregate) {
          let valueFormat;
          if (isDefined(summaryItem.valueFormat)) {
            valueFormat = summaryItem.valueFormat;
          } else if (summaryItem.summaryType !== 'count') {
            valueFormat = gridCore.getFormatByDataType(column?.dataType);
          }
          summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
            value: isString(aggregate) && column?.deserializeValue
              ? column.deserializeValue(aggregate)
              : aggregate,
            valueFormat,
            columnCaption: column && column.index !== columnIndex ? column.caption : undefined,
          }));
        }
      }
    });

    if (!isEmptyObject(summaryCellsByColumns)) {
      visibleColumns.forEach((column, visibleIndex) => {
        const prevColumn = visibleColumns[visibleIndex - 1];
        const columnIndex = getSummaryCellIndex(column, prevColumn, isGroupRow);

        summaryCells.push(summaryCellsByColumns[columnIndex] || []);
      });
    }

    return summaryCells;
  }

  private _getSummaryCells(summaryTotalItems, totalAggregates) {
    const columnsController = this._columnsController;

    return this._calculateSummaryCells({
      summaryItems: summaryTotalItems,
      aggregates: totalAggregates,
      visibleColumns: columnsController.getVisibleColumns(),
      calculateTargetColumnIndex: (_, column) => (
        this._isDataColumn(column) ? column.index : -1
      ),
    });
  }

  protected _updateItemsCore(change) {
    const that = this;
    let summaryCells: SummaryCellItem[][] | undefined;
    const dataSource = that._dataSource;
    const footerItems = that._footerItems;
    const oldSummaryCells = footerItems?.[0]?.summaryCells;
    const summaryTotalItems: any = that.option('summary.totalItems');

    that._footerItems = [];
    if (dataSource && summaryTotalItems?.length) {
      const totalAggregates = dataSource.totalAggregates();
      summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);

      if (change?.repaintChangesOnly && oldSummaryCells) {
        change.totalColumnIndices = summaryCells.map((summaryCell, index) => {
          if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
            return index;
          }
          return -1;
        }).filter((index) => index >= 0);
      }

      if (summaryCells.length) {
        that._footerItems.push({
          rowType: DATAGRID_TOTAL_FOOTER_ROW_TYPE,
          summaryCells,
        });
      }
    }
    super._updateItemsCore(change);
  }

  private _prepareUnsavedDataSelector(selector) {
    if (this.option('summary.recalculateWhileEditing')) {
      const editingController = this._editingController;
      if (editingController) {
        return function (data) {
          data = editingController.getUpdatedData(data);
          return selector(data);
        };
      }
    }

    return selector;
  }

  private _prepareAggregateSelector(selector, aggregator) {
    selector = this._prepareUnsavedDataSelector(selector);

    if (aggregator === 'avg' || aggregator === 'sum') {
      return function (data) {
        const value = selector(data);
        return isDefined(value) ? Number(value) : value;
      };
    }

    return selector;
  }

  private _getAggregates(summaryItems, remoteOperations) {
    const that = this;
    let calculateCustomSummary: any = that.option('summary.calculateCustomSummary');
    const commonSkipEmptyValues = that.option('summary.skipEmptyValues');

    return map(summaryItems || [], (summaryItem) => {
      const column = this._columnsController.columnOption(summaryItem.column);
      const calculateCellValue = column?.calculateCellValue ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column);
      let aggregator = summaryItem.summaryType || 'count';
      const skipEmptyValues = isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;

      if (remoteOperations) {
        return {
          selector: summaryItem.column,
          summaryType: aggregator,
        };
      }
      const selector = that._prepareAggregateSelector(calculateCellValue, aggregator);

      if (aggregator === 'custom') {
        if (!calculateCustomSummary) {
          errors.log('E1026');
          calculateCustomSummary = function () { };
        }
        const options: any = {
          component: that.component,
          name: summaryItem.name,
        };
        calculateCustomSummary(options);
        options.summaryProcess = 'calculate';
        aggregator = {
          seed(groupIndex) {
            options.summaryProcess = 'start';
            options.totalValue = undefined;
            options.groupIndex = groupIndex;
            delete options.value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
          step(totalValue, value) {
            options.summaryProcess = 'calculate';
            options.totalValue = totalValue;
            options.value = value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
          finalize(totalValue) {
            options.summaryProcess = 'finalize';
            options.totalValue = totalValue;
            delete options.value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
        };
      }
      return {
        selector,
        aggregator,
        skipEmptyValues,
      };
    });
  }

  private _addSortInfo(sortByGroups, groupColumn, selector, sortOrder) {
    if (groupColumn) {
      const { groupIndex } = groupColumn;
      sortOrder = sortOrder || groupColumn.sortOrder;
      if (isDefined(groupIndex)) {
        sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
        sortByGroups[groupIndex].push({
          selector,
          desc: sortOrder === 'desc',
        });
      }
    }
  }

  private _findSummaryItem(summaryItems, name) {
    let summaryItemIndex: any = -1;

    const getFullName = function (summaryItem) {
      const { summaryType } = summaryItem;
      const { column } = summaryItem;

      return summaryType && column && `${summaryType}_${column}`;
    };

    if (isDefined(name)) {
      // @ts-expect-error
      each(summaryItems || [], function (index) {
        if (this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
          summaryItemIndex = index;
          return false;
        }
      });
    }
    return summaryItemIndex;
  }

  private _getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems) {
    const that = this;
    const columnsController = that._columnsController;
    const groupColumns = columnsController.getGroupColumns();
    const sortByGroups = [];

    if (!groupSummaryItems?.length) return;

    each(sortByGroupSummaryInfo || [], function () {
      const { sortOrder } = this;
      let { groupColumn } = this;
      const summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);

      if (summaryItemIndex < 0) return;

      const selector = function (data) {
        return getGroupAggregates(data)[summaryItemIndex];
      };

      if (isDefined(groupColumn)) {
        groupColumn = columnsController.columnOption(groupColumn);
        that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
      } else {
        each(groupColumns, (groupIndex, groupColumn) => {
          that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
        });
      }
    });
    return sortByGroups;
  }

  protected _createDataSourceAdapter(dataSource: DataSource) {
    const dataSourceAdapter = super._createDataSourceAdapter(dataSource);

    // @ts-expect-error summaryGetter is defined in summary DataSourceAdapterExtender
    dataSourceAdapter.summaryGetter((currentRemoteOperations) => {
      const result = this._getSummaryOptions(
        currentRemoteOperations ?? dataSourceAdapter.remoteOperations(),
      );
      return result;
    });

    return dataSourceAdapter;
  }

  private _getSummaryOptions(remoteOperations) {
    const that = this;
    const groupSummaryItems = that.option('summary.groupItems');
    const totalSummaryItems = that.option('summary.totalItems');
    const sortByGroupSummaryInfo = that.option('sortByGroupSummaryInfo');
    const groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations?.grouping && remoteOperations.summary);
    const totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations?.summary);
    const sortByGroups = function () {
      return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems);
    };

    if (groupAggregates.length || totalAggregates.length) {
      return {
        groupAggregates,
        totalAggregates,
        sortByGroups,
      };
    }

    return undefined;
  }

  public publicMethods(): string[] {
    return [...super.publicMethods(), 'getTotalSummaryValue'];
  }

  private getTotalSummaryValue(summaryItemName) {
    const summaryItemIndex = this._findSummaryItem(this.option('summary.totalItems'), summaryItemName);
    const aggregates = this._dataSource.totalAggregates();

    if (aggregates.length && summaryItemIndex > -1) {
      return aggregates[summaryItemIndex];
    }
  }

  public optionChanged(args) {
    if (args.name === 'summary' || args.name === 'sortByGroupSummaryInfo') {
      args.name = 'dataSource';
    }
    super.optionChanged(args);
  }

  public footerItems() {
    return this._footerItems;
  }
};
