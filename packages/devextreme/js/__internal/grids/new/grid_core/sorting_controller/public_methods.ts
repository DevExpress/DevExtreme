import type { GridCoreClass, Mixin } from '@ts/grids/new/grid_core/types';

import type { SortingPublicMethods } from './types';

export function PublicMethods<T extends GridCoreClass>(
  GridCore: T,
): Mixin<T, SortingPublicMethods> {
  return class GridCoreWithSortingController extends GridCore {
    public clearSorting(): void {
      this.sortingController.clearSorting();
    }
  };
}
