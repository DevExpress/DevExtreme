/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { SubsGetsUpd } from '@ts/core/reactive';
import { computed, state } from '@ts/core/reactive';
import { anyOf, noneOf } from '@ts/grids/grid_core/filter/m_filter_custom_operations';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { ColumnsController } from '../columns_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { AppliedFilters } from './types';
import { getAppliedFilterExpressions } from './utils';

export class FilterController {
  public readonly filterSyncEnabled = this.options.oneWay('filterSyncEnabled');

  private readonly filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');

  public readonly appliedFilters: SubsGetsUpd<AppliedFilters> = state({});

  public static dependencies = [
    OptionsController,
    ColumnsController,
  ] as const;

  public readonly customOperations = computed(
    (fbCustomOperations) => [
      anyOf(null),
      noneOf(null),
    ].concat(fbCustomOperations)
      .filter((o) => o),
    [this.filterBuilderCustomOperations],
  );

  private readonly appliedFilterExpressions = computed(
    (
      appliedFilters,
      columns,
      customOperations,
    ) => getAppliedFilterExpressions(appliedFilters, columns, customOperations),
    [
      this.appliedFilters,
      this.columnsController.visibleColumns,
      this.customOperations,
    ],
  );

  public readonly displayFilter = computed(
    (filters) => gridCoreUtils.combineFilters(filters),
    [
      this.appliedFilterExpressions,
    ],
  );

  public clearFilterContext: unknown = null;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) { }

  public clearFilterCallback = (): void => {};

  public clearFilter(): void {
    this.clearFilterCallback.call(this.clearFilterContext);
  }
}
