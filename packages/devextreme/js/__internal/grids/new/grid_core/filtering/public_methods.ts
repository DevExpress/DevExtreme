/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Constructor } from '@ts/grids/new/grid_core/types';

import type { GridCoreNewBase } from '../widget';

export function PublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithFilterController extends GridCore {
    public clearFilter(): void {
      this.filterSyncController.clearFilters();
    }
  };
}
