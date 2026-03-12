import { isCommandKeyPressed } from '@js/common/core/events/utils';
import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { FocusedCellPosition } from '@ts/grids/grid_core/keyboard_navigation/const';
import { KEY_CODES } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_column_keyboard_navigation_core';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

export const ColumnKeyboardNavigationMixin = <T extends ModuleType<ColumnKeyboardNavigationController>>(Base: T) => class ColumnKeyboardNavigationMixin extends Base {
  private ungroupColumnByPressingKey(e): void {
    const column = this.getColumnFromEvent(e);
    const rowIndex = this.getRowIndexFromEvent(e);

    this.ungroupColumn(column, rowIndex);
    e.originalEvent?.preventDefault();
  }

  protected getFocusedCellPositionByColumn(column): FocusedCellPosition | undefined {
    if (!column) {
      return undefined;
    }

    const newRowIndex = this._columnsController
      .getRowIndex(column.index, true);

    return {
      rowIndex: newRowIndex,
      columnIndex: this.getVisibleIndex(
        column,
        newRowIndex,
      ),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getRowIndexFromEvent(e): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getColumnFromEvent(e): any {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getNewFocusedColumnBeforeUngrouping(column, rowIndex: number): Column | undefined {
    return column;
  }

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

  protected changeGroupColumnIndex(groupIndex: number, column, newFocusedColumn): void {
    this._columnsController.beginUpdate();
    this._columnsController.columnOption(column.dataField, 'groupIndex', groupIndex);

    const newFocusedCellPosition = this.getFocusedCellPositionByColumn(newFocusedColumn);

    this.updateViewFocusPosition(newFocusedCellPosition);
    this._columnsController.endUpdate();
  }

  public canUngroupColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && e.shift && isCommandKeyPressed(e.originalEvent);
  }

  public canUngroupAllColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && e.shift && e.alt;
  }

  public ungroupColumn(column, rowIndex = 0): void {
    if (isDefined(column?.groupIndex)) {
      const newFocusedColumn = this.getNewFocusedColumnBeforeUngrouping(
        column,
        rowIndex,
      );

      this.changeGroupColumnIndex(-1, column, newFocusedColumn);
    }
  }

  public ungroupAllColumns(): void {
    this._columnsController.clearGrouping();
  }
};
