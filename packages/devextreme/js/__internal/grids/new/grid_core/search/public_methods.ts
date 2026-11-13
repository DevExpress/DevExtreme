import type { GridCoreClass, Mixin } from '@ts/grids/new/grid_core/types';

import type { SearchPublicMethods } from './types';

export function PublicMethods<T extends GridCoreClass>(
  GridCore: T,
): Mixin<T, SearchPublicMethods> {
  return class GridCoreWithSearchController extends GridCore {
    public searchByText(text: string): void {
      this.searchController.updateSearchText(text);
    }
  };
}
