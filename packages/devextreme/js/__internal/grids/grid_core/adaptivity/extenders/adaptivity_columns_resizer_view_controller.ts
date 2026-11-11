import type { dxElementWrapper } from '@js/core/renderer';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/columns_resizing_reordering';
import type { ColumnPointProps, ModuleType } from '@ts/grids/grid_core/types';

import { hasHiddenWidth } from '../utils';

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
    const nextColumnIndex = this._getNextColumnIndex(point.columnIndex);
    const nextColumn: Column | undefined = columns[nextColumnIndex];
    const hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && !!nextColumn?.command;

    return result || hasHiddenWidth(columns[point.columnIndex]) || hasHiddenColumnsOnly;
  }

  protected _getNextColumnIndex(currentColumnIndex: number): number {
    const visibleColumns = this._columnsController.getVisibleColumns();
    let index = super._getNextColumnIndex(currentColumnIndex);

    while (hasHiddenWidth(visibleColumns[index])) {
      index += 1;
    }

    return index;
  }
};
