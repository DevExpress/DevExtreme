import { computed, Subscribable } from '@ts/core/reactive';
import { InfernoNode } from 'inferno';

import { ColumnsController } from '../columns_controller/columns_controller';
import { View } from '../core/view';

export class HeadersView extends View {
  public vdom = computed(
    (columns) => (
      <div>
        {columns.map((c) => (
          <div>{c.name}</div>
        ))}
      </div>
    ),
    [this.columnsController.columns],
  );

  static dependencies = [ColumnsController] as const;

  constructor(private readonly columnsController: ColumnsController) {
    super();
  }
}
