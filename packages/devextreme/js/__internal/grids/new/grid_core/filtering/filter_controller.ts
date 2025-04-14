/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { computed } from '@ts/core/reactive';
import { getFilterExpression } from '@ts/filter_builder/m_utils';
import { anyOf, noneOf } from '@ts/grids/grid_core/filter/m_filter_custom_operations';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { ColumnsController } from '../columns_controller';
import { OptionsController } from '../options_controller/options_controller';
import { SearchController } from '../search';
import { HeaderFilterController } from './header_filter';

export class FilterController {
  public readonly filter = this.options.twoWay('filterValue');

  public readonly filterEnabled = this.options.twoWay('filterPanel.filterEnabled');

  public readonly filterSyncEnabled = this.options.oneWay('filterSyncEnabled');

  private readonly filterBuilderCustomOperations = this.options.oneWay('filterBuilder.customOperations');

  public static dependencies = [
    OptionsController,
    ColumnsController,
    SearchController,
    HeaderFilterController,
  ] as const;

  private readonly filterPanelValue = computed(
    (filterValue, filterEnabled) => (filterEnabled ? filterValue : undefined),
    [
      this.filter,
      this.filterEnabled,
    ],
  );

  private readonly customOperations = computed(
    (fbCustomOperations) => [
      anyOf(null),
      noneOf(null),
    ].concat(fbCustomOperations)
      .filter((o) => o),
    [this.filterBuilderCustomOperations],
  );

  public readonly displayFilter = computed(
    (
      columns,
      filterPanelValue,
      headerFilterValue,
      searchFilter,
      filterSyncEnabled,
      customOperations,
    ) => {
      const filters = [filterPanelValue, searchFilter];
      if (!filterSyncEnabled) {
        const headerFilterExpression = getFilterExpression(headerFilterValue, columns, customOperations, 'filterBuilder');
        filters.push(headerFilterExpression);
      }
      return gridCoreUtils.combineFilters(filters);
    },
    [
      this.columnsController.visibleColumns,
      this.filterPanelValue,
      this.headerFilterController.composedHeaderFilter,
      this.searchController.searchFilter,
      this.filterSyncEnabled,
      this.customOperations,
    ],
  );

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
  ) { }

  public clearFilter(): void {
    this.searchController.searchTextOption.update('');
    this.filter.update(null);
    if (!this.filterSyncEnabled.unreactive_get()) {
      this.headerFilterController.clearHeaderFilters();
    }
  }
}
