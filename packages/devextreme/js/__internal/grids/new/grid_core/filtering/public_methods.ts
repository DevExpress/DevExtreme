import type { GridCoreClass, Mixin } from '@ts/grids/new/grid_core/types';

import type { FilterPublicMethods } from './types';

export function PublicMethods<T extends GridCoreClass>(
  GridCore: T,
): Mixin<T, FilterPublicMethods> {
  return class GridCoreWithFilterController extends GridCore {
    public clearFilter(): void {
      this.filterSyncController.clearFilters();
    }
  };
}
