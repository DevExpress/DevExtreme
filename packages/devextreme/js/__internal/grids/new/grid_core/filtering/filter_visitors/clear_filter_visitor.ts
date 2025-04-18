import { SearchController } from '../../search/index';
import { FilterController } from '../filter_controller';
import { HeaderFilterController } from '../header_filter/index';

export class ClearFilterVisitor {
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
    this.filterController.clearFilterCallback = (): void => { this.clearFilters(); };
  }

  public clearFilters(): void {
    this.searchController.searchTextOption.value = '';
    this.filterController.filterValueOption.value = null;
    // Note: if filterSync is enabled headerFilters should be cleared already
    this.headerFilterController.clearHeaderFilters();
  }
}
