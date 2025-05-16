import { effect } from '@preact/signals-core';

import { SearchController } from '../../search/index';
import { FilterController } from '../filter_controller';
import { HeaderFilterController } from '../header_filter/index';

export class GetAppliedFilterVisitor {
  public static dependencies = [
    SearchController,
    HeaderFilterController,
    FilterController,
  ] as const;

  constructor(
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly filterController: FilterController,
  ) {
    effect(() => {
      this.filterController.appliedFilters.value = {
        filterPanel: this.filterController.filterPanelValue.value,
        headerFilter: this.headerFilterController.composedHeaderFilter.value,
        search: this.searchController.searchFilter.value,
      };
    });
  }
}
