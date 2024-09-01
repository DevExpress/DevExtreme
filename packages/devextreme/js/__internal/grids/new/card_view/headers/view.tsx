import { computed } from '@ts/core/reactive';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import { Headers } from './headers';

export class HeadersView extends View {
  public vdom = computed(
    (columns) => <Headers columns={columns} />,
    [this.columnsController.columns],
  );

  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }
}
