import type { DraggingHeaderViewController } from '@ts/grids/grid_core/columns_resizing_reordering/columns_resizing_reordering';
import type { DraggingPointCreatedOptions } from '@ts/grids/grid_core/columns_resizing_reordering/types';
import type { ModuleType } from '@ts/grids/grid_core/types';

import { hasHiddenWidth } from '../utils';

export const adaptivityDraggingHeaderViewControllerExtender = (
  Base: ModuleType<DraggingHeaderViewController>,
): ModuleType<DraggingHeaderViewController> => class AdaptivityDraggingHeaderViewControllerExtender
  extends Base {
  protected _pointCreated({
    point, columns, location, sourceColumn, cells,
  }: DraggingPointCreatedOptions): boolean {
    const result = super._pointCreated({
      point, columns, location, sourceColumn, cells,
    });
    return result || hasHiddenWidth(columns[point.columnIndex - 1]);
  }
};
