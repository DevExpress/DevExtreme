/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Signal } from '@preact/signals-core';
import { computed, signal } from '@preact/signals-core';
import { anyOf, noneOf } from '@ts/grids/grid_core/filter/m_filter_custom_operations';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { ColumnsController } from '../columns_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import type { AppliedFilters } from './types';
import { getAppliedFilterExpressions } from './utils';

export class FilterController {
  private readonly filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');

  public readonly filterPanelFilterEnabled = this.options.oneWay('filterPanel.filterEnabled');

  public readonly filterValueOption = this.options.twoWay('filterValue');

  public readonly appliedFilters: Signal<AppliedFilters> = signal({});

  public static dependencies = [
    OptionsController,
    ColumnsController,
  ] as const;

  public readonly customOperations = computed(
    () => [
      anyOf(null),
      noneOf(null),
    ]
      .concat(this.filterBuilderCustomOperations.value)
      .filter((o) => o),
  );

  private readonly appliedFilterExpressions = computed(
    () => getAppliedFilterExpressions(
      this.appliedFilters.value,
      this.columnsController.visibleColumns.value,
      this.customOperations.value,
    ),
  );

  public readonly displayFilter = computed(
    () => gridCoreUtils.combineFilters(
      this.appliedFilterExpressions.value,
    ),
  );

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) { }

  public clearFilterCallback = (): void => {};

  public clearFilter(): void {
    this.clearFilterCallback();
  }
}
