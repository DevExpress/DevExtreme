/* eslint-disable @typescript-eslint/no-unsafe-return */
import { computed } from '@ts/core/reactive/index';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { OptionsController } from '../options_controller/options_controller';
import { SearchController } from '../search';

export class FilterController {
  public readonly filter = this.options.twoWay('filterValue');

  public readonly filterEnabled = this.options.twoWay('filterPanel.filterEnabled');

  public static dependencies = [OptionsController, SearchController] as const;

  public readonly displayFilter = computed(
    (filterEnabled, filter, searchFilter) => {
      if (!filterEnabled) {
        return searchFilter;
      }
      return gridCoreUtils.combineFilters([filter, searchFilter]);
    },
    [
      this.filterEnabled,
      this.filter,
      this.searchController.searchFilter,
    ],
  );

  constructor(
    private readonly options: OptionsController,
    private readonly searchController: SearchController,
  ) { }

  public clearFilter(): void {
    this.filter.update(null);
  }
}
