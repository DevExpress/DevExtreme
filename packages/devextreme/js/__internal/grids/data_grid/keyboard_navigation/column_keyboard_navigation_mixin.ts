import { isCommandKeyPressed } from '@js/common/core/events/utils';
import { isDefined } from '@js/core/utils/type';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import { KEY_CODES } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { FocusedCellPosition } from '@ts/grids/grid_core/keyboard_navigation/types';

import type { MixinBase } from './types';

/* eslint-disable-next-line
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/explicit-function-return-type
  -- TS can't name the class type of a generic mixin */
export const ColumnKeyboardNavigationMixin = <T extends MixinBase>(Base: T) => class extends Base {
  private ungroupColumnByPressingKey(e: KeyboardKeyDownEvent): void {
    const column = this.getColumnFromEvent(e);
    const rowIndex = this.getRowIndexFromEvent(e);

    this.ungroupColumn(column, rowIndex);
    e.originalEvent?.preventDefault();
  }

  protected getFocusedCellPositionByColumn(
    column: Column | undefined,
  ): FocusedCellPosition | undefined {
    if (!column) {
      return undefined;
    }

    const newRowIndex = this._columnsController
      .getRowIndex(column.index ?? -1, true);

    return {
      rowIndex: newRowIndex,
      columnIndex: this.getVisibleIndex(
        column,
        newRowIndex,
      ),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected getRowIndexFromEvent(e: KeyboardKeyDownEvent): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected getColumnFromEvent(e: KeyboardKeyDownEvent): Column | undefined {
    return undefined;
  }

  protected getNewFocusedColumnBeforeUngrouping(
    column: Column,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
    rowIndex: number,
  ): Column | undefined {
    return column;
  }

  protected keyDownHandler(e: KeyboardKeyDownEvent): boolean {
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

  protected changeGroupColumnIndex(
    groupIndex: number,
    column: Column,
    newFocusedColumn: Column | undefined,
  ): void {
    this._columnsController.beginUpdate();
    this._columnsController.columnOption(column.dataField, 'groupIndex', groupIndex);

    const newFocusedCellPosition = this.getFocusedCellPositionByColumn(newFocusedColumn);

    this.updateViewFocusPosition(newFocusedCellPosition);
    this._columnsController.endUpdate();
  }

  public canUngroupColumnByPressingKey(e: KeyboardKeyDownEvent): boolean {
    return e.which === KEY_CODES.G && e.shift && isCommandKeyPressed(e.originalEvent);
  }

  public canUngroupAllColumnByPressingKey(e: KeyboardKeyDownEvent): boolean {
    return e.which === KEY_CODES.G && e.shift && e.alt;
  }

  public ungroupColumn(column: Column | undefined, rowIndex = 0): void {
    if (column && isDefined(column.groupIndex)) {
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
