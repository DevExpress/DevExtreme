/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DraggingHeaderViewController } from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import { HIDDEN_COLUMNS_WIDTH } from '../const';

export const adaptivityDraggingHeaderViewControllerExtender = (
  Base: ModuleType<DraggingHeaderViewController>,
): ModuleType<DraggingHeaderViewController> => class AdaptivityDraggingHeaderViewControllerExtender
  extends Base {
  protected _pointCreated({
    point, columns, location, sourceColumn, cells,
  }) {
    const result = super._pointCreated({
      point, columns, location, sourceColumn, cells,
    });
    const column = columns[point.columnIndex - 1] || {};
    const hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;

    return result || hasAdaptiveHiddenWidth;
  }
};
