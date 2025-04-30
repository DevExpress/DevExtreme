import type { ReadonlySignal } from '@preact/signals-core';
import { computed } from '@preact/signals-core';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/index';

import { getComposedHeaderFilter } from './utils';

export class HeaderFilterController {
  public static dependencies = [
    ColumnsController,
  ] as const;

  public readonly composedHeaderFilter: ReadonlySignal<unknown>;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    this.composedHeaderFilter = computed(
      () => getComposedHeaderFilter(
        this.columnsController.visibleColumns.value,
      ),
    );
  }

  public clearHeaderFilters(): void {
    this.columnsController.updateColumns(
      (columns) => columns.map((col) => {
        delete col.filterValues;
        delete col.filterType;
        return col;
      }),
    );
  }
}
