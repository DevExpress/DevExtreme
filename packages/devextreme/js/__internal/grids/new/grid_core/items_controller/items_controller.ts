import formatHelper from '@js/format_helper';
import { computed, state } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';

import type { Column, DataRow } from '../columns_controller/types';
import type { DataObject, Key } from '../data_controller/types';

export class ItemsController {
  public static dependencies = [
    DataController, ColumnsController,
  ] as const;

  public readonly additionalItems = state<DataRow[]>([]);

  public readonly items = computed(
    (dataItems, columns, additionalItems) => dataItems
      .map(
        (item, itemIndex) => this.createDataRow(
          item,
          columns,
          itemIndex,
        ),
      ).concat(additionalItems),
    [
      this.dataController.items,
      this.columnsController.visibleColumns,
      this.additionalItems,
    ],
  );

  constructor(
    protected readonly dataController: DataController,
    protected readonly columnsController: ColumnsController,
  ) {}

  public findItemByKey(items: DataRow[], key: Key): DataRow | null {
    return items.find((item) => item.key === key) ?? null;
  }

  public createDataRow(
    data: DataObject,
    columns: Column[],
    itemIndex: number,
    key?: Key,
  ): DataRow {
    const itemKey = key ?? this.dataController.getDataKey(data);

    return {
      // @ts-expect-error
      cells: columns.map((c) => {
        const displayValue = c.calculateDisplayValue(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let text = formatHelper.format(displayValue as any, c.format);

        if (c.customizeText) {
          text = c.customizeText({
            value: displayValue,
            valueText: text,
          });
        }

        return {
          column: c,
          value: c.calculateCellValue(data),
          displayValue,
          text,
        };
      }),
      key: itemKey,
      index: itemIndex,
      data,
    };
  }
}
