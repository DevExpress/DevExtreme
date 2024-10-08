/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import { Headers } from './headers';

export class HeadersView extends View {
  public vdom = computed(
    (columns) => (
      <Headers
        columns={columns}
        onReorder={this.onReorder.bind(this)}
        onAdd={this.onAdd.bind(this)}
      />
    ),
    [this.columnsController.visibleColumns],
  );

  public static dependencies = [ColumnsController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    super();
  }

  public onReorder(visibleFromIndex: number, visibleToIndex: number): void {
    const cs = this.columnsController.columns.unreactive_get();
    const vcs = this.columnsController.visibleColumns.unreactive_get();
    const fromIndex = cs.indexOf(vcs[visibleFromIndex]);
    const toIndex = cs.indexOf(vcs[visibleToIndex]);

    this.columnsController.columns.updateFunc((columns) => {
      const column = columns[fromIndex];
      const newColumns = columns.slice();
      newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, column);
      return newColumns;
    });
  }

  public onAdd(nonVisibleFromIndex: number, visibleToIndex: number): void {
    const cs = this.columnsController.columns.unreactive_get();
    const vcs = this.columnsController.visibleColumns.unreactive_get();
    const nvcs = this.columnsController.nonVisibleColumns.unreactive_get();
    const fromIndex = cs.indexOf(nvcs[nonVisibleFromIndex]);
    const toIndex = cs.indexOf(vcs[visibleToIndex]);

    this.columnsController.columns.updateFunc((columns) => {
      const column = columns[fromIndex];
      const newColumns = columns.slice();
      newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, { ...column, visible: true });
      return newColumns;
    });
  }
}
