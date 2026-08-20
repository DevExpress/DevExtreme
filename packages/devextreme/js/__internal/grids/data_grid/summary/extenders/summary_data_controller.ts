/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-self-compare */
/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable prefer-rest-params */
/* eslint-disable @stylistic/max-len */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  isDefined, isEmptyObject, isString,
} from '@js/core/utils/type';
import type { DataSource } from '@ts/data/data_source/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { RawItemData, RemoteOperationsOptions } from '@ts/grids/grid_core/data_source_adapter/types';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import gridCore from '../../m_core';
import { DATAGRID_GROUP_FOOTER_ROW_TYPE, DATAGRID_TOTAL_FOOTER_ROW_TYPE } from '../const';
import type {
  CalculateSummaryCellsArgs, ColumnMap, SummaryCellItem, SummaryOptions,
} from '../types';
import { getColumnFromMap, getSummaryCellIndex } from '../utils';
import { findSummaryItem } from '../utils/find_summary_item';
import { getGroupAggregates } from '../utils/get_group_aggregates';
import { getSummaryOptions } from '../utils/get_summary_options';

export const summaryDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class SummaryDataControllerExtender extends Base {
  private _footerItems!: any[];

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

  protected _createDataSourceAdapter(dataSource: DataSource) {
    const dataSourceAdapter = super._createDataSourceAdapter(dataSource);

    // @ts-expect-error summaryGetter is defined in summary DataSourceAdapterExtender
    dataSourceAdapter.summaryGetter(
      (remoteOperations: RemoteOperationsOptions): SummaryOptions | undefined => {
        const summary = this.option('summary');

        if (!summary) {
          return undefined;
        }

        const result = getSummaryOptions({
          summary,
          sortByGroupSummaryInfo: this.option('sortByGroupSummaryInfo'),
          remoteOperations: remoteOperations ?? dataSourceAdapter.remoteOperations(),
          getUpdatedItemData: (data) => this._editingController.getUpdatedData(data) as RawItemData,
          columnOption: (id) => this._columnsController.columnOption(id) as Column | undefined,
          groupColumns: this._columnsController.getGroupColumns(),
          component: this.component as any,
        });
        return result;
      },
    );

    return dataSourceAdapter;
  }

  public publicMethods(): string[] {
    return [...super.publicMethods(), 'getTotalSummaryValue'];
  }

  private getTotalSummaryValue(summaryItemName) {
    const summaryItemIndex = findSummaryItem(this.option('summary.totalItems'), summaryItemName);
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
