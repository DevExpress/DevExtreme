/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Signal } from '@preact/signals-core';
import { computed, signal } from '@preact/signals-core';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { ColumnsController } from '../columns_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import type { AppliedFilters } from './types';
import { getAppliedFilterExpressions } from './utils';

export class FilterController {
  public readonly filterPanelFilterEnabled = this.options.oneWay('filterPanel.filterEnabled');

  public readonly filterPanelVisible = this.options.oneWay('filterPanel.visible');

  public readonly filterValueOption = this.options.twoWay('filterValue');

  public readonly filterBuilderPopupOptions = this.options.oneWay('filterBuilderPopup');

  public readonly filterPanelOptions = this.options.twoWay('filterPanel');

  public readonly filterBuilderOptions = this.options.twoWay('filterBuilder');

  public readonly filterSyncEnabledOption = this.options.oneWay('filterSyncEnabled');

  public readonly appliedFilters: Signal<AppliedFilters> = signal({});

  public readonly customOperations: Signal<unknown[]> = signal([]);

  public static dependencies = [
    OptionsController,
    ColumnsController,
  ] as const;

  public readonly filterSyncEnabled = computed(() => (
    this.filterSyncEnabledOption.value === 'auto'
      ? !!this.filterPanelVisible.value
      : !!this.filterSyncEnabledOption.value
  ));

  public readonly filterPanelValue = computed(() => (
    this.filterPanelFilterEnabled.value
      ? this.filterValueOption.value
      : null
  ));

  public readonly filterSyncValue = computed(() => (
    this.filterSyncEnabled.value
      ? this.filterPanelValue.value
      : null
  ));

  private readonly appliedFilterExpressions = computed(
    () => {
      const isCustomOperationsCreated = this.customOperations.value.length > 0;

      if (!isCustomOperationsCreated) {
        return [];
      }

      return getAppliedFilterExpressions(
        this.appliedFilters.value,
        this.columnsController.filterableColumns.value,
        this.customOperations.value,
        this.filterSyncEnabled.value,
      );
    },
  );

  public readonly displayFilter = computed(
    () => gridCoreUtils.combineFilters(
      this.appliedFilterExpressions.value,
    ) ?? null,
  );

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) {}
}
