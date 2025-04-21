import { equalByValue } from '@js/core/utils/common';
import formatHelper from '@js/format_helper';
import { computed, state } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import type { Column, DataRow } from '../columns_controller/types';
import type { DataObject, Key } from '../data_controller/types';
import { parseValue } from '../utils';

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
      this.columnsController.columns,
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
      cells: columns.map((column) => {
        const value = column.calculateCellValue(data);
        const displayValue = column.calculateDisplayValue(data);

        const formattedText = formatHelper.format(
          parseValue(column, displayValue as string) as never,
          column.format,
        );
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
