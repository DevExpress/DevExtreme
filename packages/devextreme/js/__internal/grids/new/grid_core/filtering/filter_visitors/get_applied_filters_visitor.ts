import { computed, effect } from '@ts/core/reactive';

import { OptionsController } from '../../options_controller/options_controller';
import { SearchController } from '../../search';
import { FilterController } from '../filter_controller';
import { HeaderFilterController } from '../header_filter';

export class GetAppliedFilterVisitor {
  public static dependencies = [
    OptionsController,
    SearchController,
    HeaderFilterController,
    FilterController,
  ] as const;

  public readonly filter = this.options.twoWay('filterValue');

  public readonly filterEnabled = this.options.twoWay('filterPanel.filterEnabled');

  private readonly filterPanelValue = computed(
    (filterValue, filterEnabled) => (filterEnabled ? filterValue : undefined),
    [
      this.filter,
      this.filterEnabled,
    ],
  );

  constructor(
    private readonly options: OptionsController,
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
