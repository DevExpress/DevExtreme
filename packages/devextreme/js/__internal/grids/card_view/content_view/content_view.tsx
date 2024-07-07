import { computed } from '@ts/core/reactive';

import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import { asInferno, View } from '../core/view';
import { DataController } from '../data_controller/data_controller';
import { Card } from './card';

export const CLASSES = {
  content: 'dx-cardview-content',
};

export class ContentView extends View {
  private readonly items = computed(
    (dataItems, columns: Column[]) => dataItems.map(
      (item) => this.columnsController.createDataRow(
        item,
        columns,
      ),
    ),
    [this.dataController.items, this.columnsController.columns],
  );

  public vdom = computed(
    (items) => (
      <div className={CLASSES.content}>
        {items.map((item) => (
          <Card row={item}></Card>
        ))}
      </div>
    ),
    [this.items],
  );

  static dependencies = [DataController, ColumnsController] as const;

  constructor(
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }
}
