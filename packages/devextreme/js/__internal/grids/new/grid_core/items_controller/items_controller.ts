import { equalByValue } from '@js/core/utils/common';
import formatHelper from '@js/format_helper';
import { computed, signal } from '@preact/signals-core';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import type { Column, DataRow } from '../columns_controller/types';
import type { DataObject, Key } from '../data_controller/types';
import { parseValue } from '../utils';

export class ItemsController {
  private readonly selectedCardKeys = signal<Key[]>([]);

  public static dependencies = [
    DataController,
    ColumnsController,
    SearchController,
  ] as const;

  public readonly additionalItems = signal<DataRow[]>([]);

  public readonly items = computed(
    () => {
      // NOTE: We should trigger computed by search options change
      // But all work with these options encapsulated in SearchHighlightTextProcessor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.searchController.highlightTextOptions.value;
      return this.dataController.items.value.map(
        (item, itemIndex) => this.createDataRow(
          item,
          this.columnsController.visibleColumns.value,
          itemIndex,
          this.selectedCardKeys.value,
        ),
      ).concat(
        this.additionalItems.value,
      );
    },
  );

  constructor(
    protected readonly dataController: DataController,
    protected readonly columnsController: ColumnsController,
    private readonly searchController: SearchController,
  ) {}

  public setSelectionState(keys: Key[]): void {
    this.selectedCardKeys.value = keys;
  }

  public findItemByKey(items: DataRow[], key: Key): DataRow | null {
    return items.find((item) => item.key === key) ?? null;
  }

  public createDataRow(
    data: DataObject,
    columns: Column[],
    itemIndex: number,
    selectedCardKeys?: Key[],
    key?: Key,
  ): DataRow {
    const itemKey = key ?? this.dataController.getDataKey(data);

    return {
      cells: columns.map((column, index) => {
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
          index,
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
    const items = this.items.peek();

    return items.find((item) => equalByValue(item.key, key));
  }
}
