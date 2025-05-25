import { isCommandKeyPressed } from '@js/common/core/events/utils';
import { isDefined } from '@js/core/utils/type';
import { Direction, KEY_CODES } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_column_keyboard_navigation_core';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

export const ColumnKeyboardNavigationMixin = <T extends ModuleType<ColumnKeyboardNavigationController>>(Base: T) => class ColumnKeyboardNavigationMixin extends Base {
  private ungroupColumnByPressingKey(e): void {
    const column = this.getColumnFromEvent(e);
    const rowIndex = this.getRowIndexFromEvent(e);

    this.ungroupColumn(column, rowIndex);
    e.originalEvent?.preventDefault();
  }

  protected ungroupColumn(column, rowIndex = 0): void {
    if (isDefined(column?.groupIndex)) {
      const newFocusedColumnIndex = this.getNewFocusedColumnIndexAfterUngrouping(
        column,
        rowIndex,
      );
      const newFocusedCellPosition = newFocusedColumnIndex >= 0
        ? { rowIndex, columnIndex: newFocusedColumnIndex }
        : undefined;

      this.updateViewFocusPosition(newFocusedCellPosition);
      this._columnsController.columnOption(column.dataField, 'groupIndex', -1);
    }
  }

  protected getNewFocusedColumnIndexAfterUngrouping(
    column,
    rowIndex = 0,
  ): number {
    const visibleColumnIndex = this.getVisibleIndex(column, rowIndex);

    return this.getNewFocusedColumnIndex(visibleColumnIndex, Direction.Next);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getRowIndexFromEvent(e): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getColumnFromEvent(e): any {}

  protected keyDownHandler(e): boolean {
    let isHandled = super.keyDownHandler(e);

    if (isHandled) {
      return true;
    }

    if (this.canUngroupColumnByPressingKey(e)) {
      this.ungroupColumnByPressingKey(e);
      isHandled = true;
    } else if (this.canUngroupAllColumnByPressingKey(e)) {
      this.ungroupAllColumns();
      isHandled = true;
    }

    return isHandled;
  }

  public canUngroupColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && e.shift && isCommandKeyPressed(e.originalEvent);
  }

  public canUngroupAllColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && e.shift && e.alt;
  }

  public ungroupAllColumns(): void {
    this._columnsController.clearGrouping();
  }
};
