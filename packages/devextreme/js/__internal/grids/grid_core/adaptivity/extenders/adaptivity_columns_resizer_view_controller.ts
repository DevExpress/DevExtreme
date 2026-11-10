import type { dxElementWrapper } from '@js/core/renderer';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/columns_resizing_reordering';
import type { ColumnPointProps, ModuleType } from '@ts/grids/grid_core/types';

import { HIDDEN_COLUMNS_WIDTH } from '../const';

export const adaptivityColumnsResizerViewControllerExtender = (
  Base: ModuleType<ColumnsResizerViewController>,
): ModuleType<ColumnsResizerViewController> => class AdaptivityColumnsResizerViewControllerExtender
  extends Base {
  protected _pointCreated(
    point: ColumnPointProps,
    columns: Column[],
    cells?: dxElementWrapper,
  ): boolean {
    const result = super._pointCreated(point, columns, cells);
    const currentColumn: Partial<Column> = columns[point.columnIndex] || {};
    const nextColumnIndex = this._getNextColumnIndex(point.columnIndex);
    const nextColumn: Partial<Column> = columns[nextColumnIndex] || {};
    const hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command;
    const hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH
      || hasHiddenColumnsOnly;

    return result || !!hasAdaptiveHiddenWidth;
  }

  protected _getNextColumnIndex(currentColumnIndex: number): number {
    const visibleColumns = this._columnsController.getVisibleColumns();
    let index = super._getNextColumnIndex(currentColumnIndex);

    while (visibleColumns[index]?.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      index += 1;
    }

    return index;
  }
};
