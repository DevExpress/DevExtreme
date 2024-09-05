import { computed } from '@ts/core/reactive';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import { Headers } from './headers';

export class HeadersView extends View {
  public vdom = computed(
    (columns) => (
      <Headers
        columns={columns}
        onReorder={this.onReorder.bind(this)}
      />
    ),
    [this.columnsController.columns],
  );

  public onReorder(fromIndex: number, toIndex: number): void {
    this.columnsController.columns.update((columns) => {
      const column = columns[fromIndex];
      const newColumns = columns.slice();
      newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, column);
      return newColumns;
    });
  }

  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }
}
