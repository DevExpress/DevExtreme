import type { ReadonlySignal } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/index';
import type { HeaderFilterInfo } from '@ts/grids/new/grid_core/filtering/header_filter/types';

import type { FilterValue } from '../types';
import { getComposedHeaderFilter, getHeaderFilterInfoArray } from './utils';

export class HeaderFilterController {
  public static dependencies = [
    ColumnsController,
  ] as const;

  public readonly headerFilterInfoArray: ReadonlySignal<HeaderFilterInfo[]>;

  public readonly composedHeaderFilter: ReadonlySignal<FilterValue>;

  constructor(
    private readonly columnsController: ColumnsController,
  ) {
    this.headerFilterInfoArray = computed(
      () => getHeaderFilterInfoArray(this.columnsController.visibleColumns.value),
    );

    this.composedHeaderFilter = computed(
      () => getComposedHeaderFilter(this.headerFilterInfoArray.value),
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
