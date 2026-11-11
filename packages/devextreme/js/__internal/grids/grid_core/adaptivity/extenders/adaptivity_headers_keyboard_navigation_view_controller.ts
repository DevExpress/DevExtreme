import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import type {
  HeadersKeyboardNavigationController,
} from '@ts/grids/grid_core/keyboard_navigation/headers_keyboard_navigation';
import type { ModuleType } from '@ts/grids/grid_core/types';

import { hasHiddenWidth } from '../utils';

export const adaptivityHeadersKeyboardNavigationViewControllerExtender = (
  Base: ModuleType<HeadersKeyboardNavigationController>,
): ModuleType<
  HeadersKeyboardNavigationController
> => class AdaptivityHeadersKeyboardNavigationViewControllerExtender extends Base {
  protected getColumnVisibleIndexCorrection(
    visibleIndex: number,
    rowIndex: number,
    direction: Direction,
  ): number {
    let indexCorrection = super.getColumnVisibleIndexCorrection(visibleIndex, rowIndex, direction);
    let visibleColumns = this._columnsController.getVisibleColumns(rowIndex);

    visibleColumns = direction === 'next'
      ? visibleColumns.slice(visibleIndex + 1)
      : visibleColumns.slice(0, visibleIndex).reverse();

    while (hasHiddenWidth(visibleColumns?.shift())) {
      indexCorrection += direction === 'next' ? 1 : -1;
    }

    return indexCorrection;
  }

  protected getFocusableColumns(rowIndex?: number, bandColumnId?: number): Column[] {
    return super.getFocusableColumns(rowIndex, bandColumnId)
      .filter((col) => !hasHiddenWidth(col));
  }

  protected getDraggableColumns(
    column: Column,
    rowIndex: number,
  ): Column[] {
    return super.getDraggableColumns(column, rowIndex)
      .filter((col) => !hasHiddenWidth(col));
  }
};
