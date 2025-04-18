import { computed, effect } from '@preact/signals-core';

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
    () => (
      this.filterController.filterPanelFilterEnabled.value
        ? this.filterController.filterValueOption.value
        : undefined
    ),
  );

  constructor(
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly filterController: FilterController,
  ) {
    effect(() => {
      this.filterController.appliedFilters.value = {
        filterPanel: this.filterPanelValue.value,
        headerFilter: this.headerFilterController.composedHeaderFilter.value,
        search: this.searchController.searchFilter.value,
      };
    });
  }
}
