import { SearchController } from '../../search/index';
import { FilterController } from '../filter_controller';
import { FilterSyncController } from '../filter_sync/controller';
import { HeaderFilterController } from '../header_filter/index';

export class ClearFilterVisitor {
  public static dependencies = [
    SearchController,
    HeaderFilterController,
    FilterController,
    FilterSyncController,
  ] as const;

  constructor(
    private readonly searchController: SearchController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly filterController: FilterController,
    private readonly filterSyncController: FilterSyncController,
  ) {
    this.filterController.clearFilterCallback = (): void => { this.clearFilters(); };
  }

  public clearFilters(): void {
    this.searchController.searchTextOption.value = '';
    this.filterController.filterValueOption.value = null;
    // Note: if filterSync is enabled headerFilters should be cleared already
    if (!this.filterSyncController.filterSyncEnabled.value) {
      this.headerFilterController.clearHeaderFilters();
    }
  }
}
