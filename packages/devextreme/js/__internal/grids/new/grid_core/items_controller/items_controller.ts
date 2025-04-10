import { equalByValue } from '@js/core/utils/common';
import formatHelper from '@js/format_helper';
import { computed, state } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import type { Column, DataRow } from '../columns_controller/types';
import type { DataObject, Key } from '../data_controller/types';

export class ItemsController {
  private readonly selectedCardKeys = state<Key[]>([]);

  public static dependencies = [
    DataController,
    ColumnsController,
    SearchController,
  ] as const;

  public readonly items = computed(
    (
      dataItems,
      columns: Column[],
      selectedCardKeys,
      // NOTE: We should trigger computed by search options change
      // But all work with these options encapsulated in SearchController
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      highlightTextOptions,
    ) => dataItems.map(
      (item, itemIndex) => this.createDataRow(
        item,
        columns,
        itemIndex,
        selectedCardKeys,
      ),
    ),
    [
      this.dataController.items,
      this.columnsController.visibleColumns,
      this.selectedCardKeys,
      this.searchController.highlightTextOptions,
    ],
  );

  constructor(
    protected readonly dataController: DataController,
    protected readonly columnsController: ColumnsController,
    private readonly searchController: SearchController,
  ) {}

  public setSelectionState(keys: Key[]): void {
    this.selectedCardKeys.update(keys);
  }

  public createDataRow(
    data: DataObject,
    columns: Column[],
    itemIndex: number,
    selectedCardKeys?: Key[],
  ): DataRow {
    const itemKey = this.dataController.getDataKey(data);

    return {
      // @ts-expect-error
      cells: columns.map((column) => {
        const calculatedValue = column.calculateCellValue?.(data);
        const {
          // @ts-expect-error
          column: updatedColumn, value
        } = this.columnsController.updateColumnDataType(column, calculatedValue);
        const displayValue = value;
        const formattedText = formatHelper.format(displayValue as any, column.format);
        const text = column.customizeText
          ? column.customizeText({ value: displayValue, valueText: formattedText })
          : calculatedValue;
        const highlightedText = this.searchController
          // @ts-expect-error
          .getHighlightedText(text);

        return {
          column: updatedColumn,
          value,
          displayValue,
          text,
          highlightedText,
        };
      }),
      key: itemKey,
      index: itemIndex,
      isSelected: !!selectedCardKeys?.includes(itemKey),
      data,
    };
  }

  public getRowByKey(key: Key): DataRow | undefined {
    // eslint-disable-next-line spellcheck/spell-checker
    const items = this.items.unreactive_get();

    return items.find((item) => equalByValue(item.key, key));
  }
}
