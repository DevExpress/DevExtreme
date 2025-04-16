import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/index';

import { getComposedHeaderFilter } from './utils';

export class HeaderFilterController {
  public static dependencies = [
    ColumnsController,
  ] as const;

  public readonly composedHeaderFilter: SubsGets<unknown>;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    this.composedHeaderFilter = computed(
      (columns) => getComposedHeaderFilter(columns),
      [
        this.columnsController.visibleColumns,
      ],
    );
  }

  public clearHeaderFilters(): void {
    this.columnsController.updateColumns(
      (columns) => columns.map((col) => {
        delete col.headerFilter?.values;
        delete col.filterType;
        return col;
      }),
    );
  }
}
