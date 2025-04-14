import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller';

import { OptionsController } from '../../options_controller/options_controller';
import { getComposedHeaderFilter } from './utils';

export type PopupState = {
  element: Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>;
} | null;

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
