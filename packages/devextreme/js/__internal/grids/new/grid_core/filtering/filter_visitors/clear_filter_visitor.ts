/* eslint-disable spellcheck/spell-checker */
import { OptionsController } from '../../options_controller/options_controller';
import { SearchController } from '../../search';
import { FilterController } from '../filter_controller';
import { HeaderFilterController } from '../header_filter';

export class ClearFilterVisitor {
  public static dependencies = [
    OptionsController,
    SearchController,
    HeaderFilterController,
    FilterController,
  ] as const;

  private readonly filter = this.options.twoWay('filterValue');

  public readonly filterSyncEnabled = this.options.oneWay('filterSyncEnabled');

  constructor(
    private readonly options: OptionsController,
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly filterController: FilterController,
  ) {
    this.filterController.clearFilterCallback = this.clearFilters;
    this.filterController.clearFilterContext = this;
  }

  public clearFilters(): void {
    this.searchController.searchTextOption.update('');
    this.filter.update(null);
    if (!this.filterSyncEnabled.unreactive_get()) {
      this.headerFilterController.clearHeaderFilters();
    }
  }
}
