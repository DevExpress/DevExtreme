import { extend } from '@js/core/utils/extend';
import {
  isDefined, isEmptyObject, isString,
} from '@js/core/utils/type';
import type { Format } from '@js/localization';
import type { SummaryGroupItem as SummaryGroupItemOption } from '@js/ui/data_grid';
import type { Column } from '@ts/grids/data_grid/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange, ItemProcessingOptions, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/m_types';

import type { ProcessGroupItemsOptions } from '../../grouping/types';
import gridCore from '../../m_core';
import { isDataColumn } from '../../m_utils';
import { DATAGRID_GROUP_FOOTER_ROW_TYPE, DATAGRID_TOTAL_FOOTER_ROW_TYPE } from '../const';
import type {
  CalculateSummaryCellsArgs, ColumnMap, FooterItem, SummaryCellItem,
  SummaryGroupItem,
} from '../types';
import { getColumnFromMap, getSummaryCellIndex } from '../utils';
import { getGroupAggregates } from '../utils/get_group_aggregates';
import { getSummaryItemIndex } from '../utils/get_summary_item_index';

export const summaryDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class SummaryDataControllerExtender extends Base {
  private _footerItems!: FooterItem[];

  public init(): void {
    this._footerItems = [];
    super.init();
  }

  public publicMethods(): string[] {
    return [...super.publicMethods(), 'getTotalSummaryValue'];
  }

  public footerItems(): FooterItem[] {
    return this._footerItems;
  }

  public getTotalSummaryValue(summaryItemName?: string | number | null): unknown {
    const summaryItemIndex = getSummaryItemIndex(this.option('summary.totalItems'), summaryItemName);
    const aggregates = this._dataSource.totalAggregates();

    if (aggregates.length && summaryItemIndex > -1) {
      return aggregates[summaryItemIndex];
    }

    return undefined;
  }

  private _isGroupFooterVisible(): boolean {
    const groupItems = this.option('summary.groupItems') ?? [];

    for (const groupItem of groupItems) {
      const columnName = groupItem.showInColumn ?? groupItem.column;
      const column = this._columnsController.columnOption(columnName);

      if (groupItem.showInGroupFooter && isDataColumn(column)) {
        return true;
      }
    }

    return false;
  }

  protected _processGroupItems(
    items: RawItemData[],
    groupsCount: number,
    options?: ProcessGroupItemsOptions & { isGroupFooterVisible?: boolean },
  ): RawItemData[] {
    const data = options?.data;
    // @ts-expect-error
    const result = super._processGroupItems(items, groupsCount, options) as RawItemData[];

    if (options) {
      options.isGroupFooterVisible ??= this._isGroupFooterVisible();

      if (
        data?.items
        && options.isGroupFooterVisible
        && (options.collectContinuationItems || !data.isContinuationOnNextPage)
      ) {
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

  protected _processGroupItem(
    groupItem: SummaryGroupItem,
    options: ItemProcessingOptions<Column> & {
      summaryGroupItems?: SummaryGroupItemOption[];
      summaryColumnMap?: ColumnMap;
    },
  ): ProcessedItem {
    options.summaryGroupItems ??= this.option('summary.groupItems') ?? [];
    options.summaryColumnMap ??= this._buildColumnLookupMap();

    if (groupItem.rowType === 'group') {
      let groupColumnIndex = -1;
      let afterGroupColumnIndex = -1;

      options.visibleColumns.forEach((column, visibleIndex) => {
        const prevColumn = options.visibleColumns[visibleIndex - 1];

        if (groupItem.groupIndex === column.groupIndex) {
          groupColumnIndex = column.index ?? -1;
        }

        if (visibleIndex > 0 && prevColumn.command === 'expand' && column.command !== 'expand') {
          afterGroupColumnIndex = column.index ?? -1;
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
            return column.index ?? -1;
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
          summaryItem.showInGroupFooter && isDataColumn(column) ? (column?.index ?? -1) : -1
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
  }: CalculateSummaryCellsArgs): SummaryCellItem[][] {
    const summaryCells: SummaryCellItem[][] = [];
    const summaryCellsByColumns: Record<number, SummaryCellItem[]> = {};

    const getColumnByKey = (key?: string): Column | undefined => (
      columnMap
        ? getColumnFromMap(key, columnMap)
        : (this._columnsController.columnOption(key) as Column | undefined)
    );
    const getValueFormat = (summaryItem: SummaryCellItem, column?: Column): Format | undefined => {
      if (isDefined(summaryItem.valueFormat)) {
        return summaryItem.valueFormat;
      }

      if (summaryItem.summaryType !== 'count') {
        return gridCore.getFormatByDataType(column?.dataType);
      }

      return undefined;
    };

    summaryItems.forEach((summaryItem, summaryIndex) => {
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

        if (!Number.isNaN(aggregate as number)) {
          summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
            value: isString(aggregate) && column?.deserializeValue
              ? column.deserializeValue(aggregate)
              : aggregate,
            valueFormat: getValueFormat(summaryItem, column),
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

  private _getSummaryCells(summaryTotalItems, totalAggregates): SummaryCellItem[][] {
    const columnsController = this._columnsController;

    return this._calculateSummaryCells({
      summaryItems: summaryTotalItems,
      aggregates: totalAggregates,
      visibleColumns: columnsController.getVisibleColumns(),
      calculateTargetColumnIndex: (_, column): number => (
        isDataColumn(column) ? (column?.index ?? -1) : -1
      ),
    });
  }

  protected _updateItemsCore(change: DataChange): void {
    const dataSource = this._dataSource;
    const summaryTotalItems = this.option('summary.totalItems');
    const oldSummaryCells = this._footerItems?.[0]?.summaryCells;

    this._footerItems = [];

    if (dataSource && summaryTotalItems?.length) {
      const totalAggregates = dataSource.totalAggregates();
      const summaryCells = this._getSummaryCells(summaryTotalItems, totalAggregates);

      if (change?.repaintChangesOnly && oldSummaryCells) {
        change.totalColumnIndices = summaryCells.map((summaryCell, index) => {
          if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
            return index;
          }
          return -1;
        }).filter((index) => index >= 0);
      }

      if (summaryCells.length) {
        this._footerItems.push({
          rowType: DATAGRID_TOTAL_FOOTER_ROW_TYPE,
          summaryCells,
        });
      }
    }

    super._updateItemsCore(change);
  }

  public optionChanged(e: OptionChanged): void {
    if (['summary', 'sortByGroupSummaryInfo'].includes(e.name)) {
      e.name = 'dataSource';
    }

    super.optionChanged(e);
  }
};
