/* eslint-disable @typescript-eslint/no-unsafe-return */
import { computed } from '@ts/core/reactive/index';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { getColumnByIndexOrName } from '@ts/grids/new/grid_core/columns_controller/utils';
import { HeaderFilterController } from '@ts/grids/new/grid_core/filtering/header_filter/controller';
import type {
  HeaderFilterRootOptions,
} from '@ts/grids/new/grid_core/filtering/header_filter/index';
import { anyOf, noneOf } from '@ts/grids/new/grid_core/filtering/legacy_filter_custom_operations';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import { ColumnsController } from '../columns_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import { getAppliedFilterExpressions } from './utils';

export class FilterController {
  private readonly filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');

  public readonly filterPanelFilterEnabled = this.options.twoWay('filterPanel.filterEnabled');

  public readonly filterPanelVisible = this.options.oneWay('filterPanel.visible');

  public readonly filterValueOption = this.options.twoWay('filterValue');

  public readonly filterBuilderPopupOptions = this.options.oneWay('filterBuilderPopup');

  public readonly filterPanelOptions = this.options.twoWay('filterPanel');

  public readonly filterBuilderOptions = this.options.twoWay('filterBuilder');

  public readonly filterSyncEnabledOption = this.options.oneWay('_filterSyncEnabled');

  public static dependencies = [
    OptionsController,
    ColumnsController,
    SearchController,
    HeaderFilterController,
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

  public readonly appliedFilters = computed(() => ({
    filterPanel: this.filterPanelValue.value,
    headerFilter: this.headerFilterController.composedHeaderFilter.value,
    search: this.searchController.searchFilter.value,
  }));

  public readonly customOperations = computed(() => {
    const config = {
      columnOption: (columnName: string): Column | undefined => {
        const columns = this.columnsController.columns.peek();

        return getColumnByIndexOrName(columns, columnName);
      },
      /*
        Note: Root headerFilter options are used because the legacy code handles retrieving
        options for specific columns on its own
      */
      getHeaderFilterOptions: (): HeaderFilterRootOptions => this.options.oneWay('headerFilter').peek(),
      getHeaderFilterController: (): unknown => this.headerFilterCompatibilityController,
    };

    const builtInCustomOperation = [
      anyOf(config),
      noneOf(config),
    ];

    return builtInCustomOperation
      .concat(this.filterBuilderCustomOperations.value)
      .filter((o) => o) as unknown[];
  });

  public readonly displayFilter = computed(
    () => {
      const appliedFilterExpressions = getAppliedFilterExpressions(
        this.appliedFilters.value,
        this.columnsController.filterableColumns.value,
        this.customOperations.value,
        this.filterSyncEnabled.value,
      );

      return gridCoreUtils.combineFilters(appliedFilterExpressions) ?? null;
    },
  );

  public headerFilterCompatibilityController: unknown = null;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
  ) {}
}
