import formatHelper from '@js/format_helper';
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';

import type { Column, DataRow } from '../columns_controller/types';
import type { DataObject } from '../data_controller/types';

export class ItemsController {
  public static dependencies = [
    DataController, ColumnsController,
  ] as const;

  public readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item, itemIndex) => this.createDataRow(
        item,
        columns,
        itemIndex,
      ),
    ),
    [this.dataController.items, this.columnsController.visibleColumns],
  );

  constructor(
    protected readonly dataController: DataController,
    protected readonly columnsController: ColumnsController,
  ) {}

  public createDataRow(
    data: DataObject,
    columns: Column[],
    itemIndex: number,
  ): DataRow {
    const itemKey = this.dataController.getDataKey(data);

    return {
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
