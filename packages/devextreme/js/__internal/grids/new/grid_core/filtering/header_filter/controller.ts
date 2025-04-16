import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/index';

import { OptionsController } from '../../options_controller/options_controller';
import { getComposedHeaderFilter } from './utils';

export class HeaderFilterController {
  public static dependencies = [
    OptionsController,
    ColumnsController,
  ] as const;

  public readonly composedHeaderFilter: SubsGets<unknown>;

  constructor(
    private readonly optionsController: OptionsController,
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
      (columns) => columns.map((c) => {
        delete c.headerFilter?.values;
        delete c.filterType;
        return c;
      }),
    );
  }
}
