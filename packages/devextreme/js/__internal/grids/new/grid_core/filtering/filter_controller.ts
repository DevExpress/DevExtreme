/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Signal } from '@preact/signals-core';
import { computed, signal } from '@preact/signals-core';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { ColumnsController } from '../columns_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import type { WidgetMock } from '../widget_mock';
import { anyOf, noneOf } from './legacy_filter_custom_operations';
import type { AppliedFilters } from './types';
import { getAppliedFilterExpressions } from './utils';

export class FilterController {
  private readonly filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');

  public readonly filterPanelFilterEnabled = this.options.oneWay('filterPanel.filterEnabled');

  public readonly filterPanelVisible = this.options.oneWay('filterPanel.visible');

  public readonly filterValueOption = this.options.twoWay('filterValue');

  public readonly filterBuilderPopupOptions = this.options.oneWay('filterBuilderPopup');

  public readonly filterPanelOptions = this.options.twoWay('filterPanel');

  public readonly filterBuilderOptions = this.options.twoWay('filterBuilder');

  public readonly filterSyncEnabledOption = this.options.oneWay('filterSyncEnabled');

  public readonly appliedFilters: Signal<AppliedFilters> = signal({});

  public static dependencies = [
    OptionsController,
    ColumnsController,
  ] as const;

  public readonly filterSyncEnabled = computed(
    () => {
      const filterSyncEnabledOption = this.filterSyncEnabledOption.value;
      const filterPanelVisible = !!this.filterPanelVisible.value;

      if (filterSyncEnabledOption === 'auto') {
        return !!filterPanelVisible;
      }

      return !!filterSyncEnabledOption;
    },
  );

  public readonly customOperations = computed(
    () => [
      anyOf(this.gridGetter),
      noneOf(this.gridGetter),
    ]
      .concat(this.filterBuilderCustomOperations.value)
      .filter((o) => o),
  );

  public readonly filterPanelValue = computed(
    () => {
      const filterPanelFilterEnabled = this.filterPanelFilterEnabled.value;
      const filterValueOption = this.filterValueOption.value;

      return filterPanelFilterEnabled ? filterValueOption : null;
    },
  );

  public readonly filterSyncValue = computed(() => {
    const filterSyncEnabled = this.filterSyncEnabled.value;
    const filterPanelValue = this.filterPanelValue.value;

    return filterSyncEnabled ? filterPanelValue : null;
  });

  private readonly appliedFilterExpressions = computed(
    () => getAppliedFilterExpressions(
      this.appliedFilters.value,
      this.columnsController.filterableColumns.value,
      this.customOperations.value,
      this.filterSyncEnabled.value,
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

  public widgetMockGetter = (): WidgetMock | null => null;

  private readonly gridGetter = (): unknown => this.widgetMockGetter();

  public clearFilterCallback = (): void => {};

  public clearFilter(): void {
    this.clearFilterCallback();
  }
}
