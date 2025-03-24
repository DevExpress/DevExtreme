import { computed } from '@ts/core/reactive/index';

import { OptionsController } from '../options_controller/options_controller';

export class FilterController {
  public readonly filter = this.options.twoWay('filterValue');

  public readonly filterEnabled = this.options.twoWay('filterPanel.filterEnabled');

  public static dependencies = [OptionsController] as const;

  public readonly displayFilter = computed(
    (filter, filterEnabled) => (filterEnabled ? filter : null),
    // return gridCoreUtils.combineFilters([filter, searchFilter]);
    [this.filter, this.filterEnabled],
  );

  constructor(
    private readonly options: OptionsController,
  ) { }

  public clearFilter(): void {
    this.filter.update(null);
  }
}
