import type { Constructor } from '@ts/grids/new/grid_core/types';

import type { GridCoreNewBase } from '../widget';

/* eslint-disable-next-line
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/explicit-function-return-type
  -- TS can't name the class type of a generic mixin */
export function PublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithFilterController extends GridCore {
    public clearFilter(): void {
      this.filterSyncController.clearFilters();
    }
  };
}
