import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DraggingHeaderViewController } from '@ts/grids/grid_core/columns_resizing_reordering/columns_resizing_reordering';
import type { DraggingPointCreatedOptions } from '@ts/grids/grid_core/columns_resizing_reordering/types';
import type { ModuleType } from '@ts/grids/grid_core/types';

import { HIDDEN_COLUMNS_WIDTH } from '../const';

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
    const column: Partial<Column> = columns[point.columnIndex - 1] || {};
    const hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;

    return result || hasAdaptiveHiddenWidth;
  }
};
