import { computed, effect } from '@ts/core/reactive/index';

import { SearchController } from '../../search/index';
import { FilterController } from '../filter_controller';
import { HeaderFilterController } from '../header_filter/index';

export class GetAppliedFilterVisitor {
  public static dependencies = [
    SearchController,
    HeaderFilterController,
    FilterController,
  ] as const;

  private readonly filterPanelValue = computed(
    (filterValue, filterEnabled) => (filterEnabled ? filterValue : undefined),
    [
      this.filterController.filterValueOption,
      this.filterController.filterPanelFilterEnabled,
    ],
  );

  constructor(
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly filterController: FilterController,
  ) {
    effect(
      (filterPanel, headerFilter, search) => {
        this.filterController.appliedFilters.update({
          filterPanel,
          headerFilter,
          search,
        });
      },
      [
        this.filterPanelValue,
        this.headerFilterController.composedHeaderFilter,
        this.searchController.searchFilter,
      ],
    );
  }
}
