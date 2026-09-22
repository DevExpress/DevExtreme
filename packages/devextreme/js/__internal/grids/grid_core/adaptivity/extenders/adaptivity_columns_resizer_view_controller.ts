/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-plusplus */
import type { dxElementWrapper } from '@js/core/renderer';
import type { ColumnsResizerViewController } from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import { HIDDEN_COLUMNS_WIDTH } from '../const';

export const adaptivityColumnsResizerViewControllerExtender = (
  Base: ModuleType<ColumnsResizerViewController>,
): ModuleType<ColumnsResizerViewController> => class AdaptivityColumnsResizerViewControllerExtender extends Base {
  protected _pointCreated(point, columns, cells?: dxElementWrapper) {
    const result = super._pointCreated(point, columns, cells);
    const currentColumn = columns[point.columnIndex] || {};
    const nextColumnIndex = this._getNextColumnIndex(point.columnIndex);
    const nextColumn = columns[nextColumnIndex] || {};
    const hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command;
    const hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH || hasHiddenColumnsOnly;

    return result || hasAdaptiveHiddenWidth;
  }

  protected _getNextColumnIndex(currentColumnIndex) {
    const visibleColumns = this._columnsController.getVisibleColumns();
    let index = super._getNextColumnIndex(currentColumnIndex);

    while (visibleColumns[index]?.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      index++;
    }

    return index;
  }
};
