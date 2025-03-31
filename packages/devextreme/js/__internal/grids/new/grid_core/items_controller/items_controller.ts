import formatHelper from '@js/format_helper';
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import type { Column, DataRow } from '../columns_controller/types';
import type { DataObject } from '../data_controller/types';

export class ItemsController {
  public static dependencies = [
    DataController,
    ColumnsController,
    SearchController,
  ] as const;

  public readonly items = computed(
    (
      dataItems,
      columns: Column[],
      // NOTE: We should trigger computed by search options change
      // But all work with these options encapsulated in SearchHighlightTextProcessor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      highlightTextOptions,
    ) => dataItems.map(
      (item, itemIndex) => this.createDataRow(
        item,
        columns,
        itemIndex,
      ),
    ),
    [
      this.dataController.items,
      this.columnsController.visibleColumns,
      this.searchController.highlightTextOptions,
    ],
  );

  constructor(
    protected readonly dataController: DataController,
    protected readonly columnsController: ColumnsController,
    private readonly searchController: SearchController,
  ) {}

  public createDataRow(
    data: DataObject,
    columns: Column[],
    itemIndex: number,
  ): DataRow {
    const itemKey = this.dataController.getDataKey(data);

    return {
      cells: columns.map((column) => {
        const value = column.calculateCellValue(data);
        const displayValue = column.calculateDisplayValue(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedText = formatHelper.format(displayValue as any, column.format);
        const text = column.customizeText
          ? column.customizeText({ value: displayValue, valueText: formattedText })
          : formattedText;
        const highlightedText = this.searchController
          .getHighlightedText(text);

        return {
          column,
          value,
          displayValue,
          text,
          highlightedText,
        };
      }),
      key: itemKey,
      index: itemIndex,
      data,
    };
  }
}
