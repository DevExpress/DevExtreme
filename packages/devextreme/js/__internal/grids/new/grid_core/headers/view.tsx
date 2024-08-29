import { computed } from '@ts/core/reactive';

import { ColumnsController } from '../columns_controller/columns_controller';
import { View } from '../core/view';
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
