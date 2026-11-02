import { isDefined, isEmptyObject } from '@js/core/utils/type';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { Column, DropLocationNames } from '@ts/grids/grid_core/columns_controller/types';

import type { ColumnFocusDispatcher } from './column_focus_dispatcher';
import { Direction } from './const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './keyboard_navigation_core';
import type { FocusedCellPosition } from './types';

export class ColumnKeyboardNavigationController extends KeyboardNavigationControllerCore {
  public columnFocusDispatcher!: ColumnFocusDispatcher;

  protected keyDownHandler(e: KeyboardKeyDownEvent): boolean {
    return this.processOnKeyDown(e);
  }

  protected getVisibleIndex(
    column: Column,
    rowIndex?: number,
  ): number {
    return this._columnsController.getVisibleIndex(column.index, rowIndex);
  }

  protected getNewVisibleIndex(
    visibleIndex: number,
    rowIndex: number,
    direction: Direction,
  ): number {
    /*
          We need to add 2 to the index instead of 1,
          because that's how normalization of these indexes works.

          For example, we have columns with the following indexes:
          0 1 2 3

          We drag 1 to the right. Its index becomes 3.
          0 2 3(1) 3(3)

          After normalization of the indexes:
          0 1(2) 2(1) 3(3)
      */
    return direction === 'previous' ? visibleIndex - 1 : visibleIndex + 2;
  }

  protected getNewFocusedColumnIndex(
    newVisibleIndex: number,
    direction: Direction,
  ): number {
    return direction === Direction.Next ? newVisibleIndex - 1 : newVisibleIndex;
  }

  protected resizeCompleted(): void {
    if (this.needToRestoreFocus) {
      this.restoreFocus();
    }
  }

  protected resetFocusedCellPosition(): void {
    this._focusedCellPosition = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  public canReorderColumn(column: Column, direction: Direction, rowIndex: number): boolean {
    return false;
  }

  public init(): void {
    super.init();

    this.columnFocusDispatcher = this.getController('columnFocusDispatcher');
    this.columnFocusDispatcher?.registerKeyboardNavigationController(this);
  }

  public moveColumn(column: Column, direction: Direction = Direction.Next, rowIndex = 0): void {
    // @ts-expect-error column controllers always have a headers or group panel view
    const viewName: DropLocationNames = this.getFocusedView().getName();
    const visibleIndex = this.getVisibleIndex(column, rowIndex);
    const newVisibleIndex = this.getNewVisibleIndex(visibleIndex, rowIndex, direction);
    const newFocusedColumnIndex = this.getNewFocusedColumnIndex(newVisibleIndex, direction);

    this.updateViewFocusPosition({
      rowIndex,
      columnIndex: newFocusedColumnIndex,
    });
    this._columnsController.moveColumn(
      { columnIndex: visibleIndex, rowIndex },
      { columnIndex: newVisibleIndex, rowIndex },
      viewName,
      viewName,
    );
  }

  public getFirstFocusableVisibleIndex(): number {
    return -1;
  }

  public updateViewFocusPosition(cellPosition?: FocusedCellPosition): void {
    this.columnFocusDispatcher?.updateFocusPosition(this, cellPosition);
  }

  public updateFocusPosition(cellPosition?: FocusedCellPosition): void {
    this.needToRestoreFocus = true;

    if (isDefined(cellPosition)) {
      this.setFocusedCellPosition(cellPosition.rowIndex, cellPosition.columnIndex);
    } else {
      this.resetFocusedCellPosition();
    }
  }

  public restoreFocus(): void {
    this.needToRestoreFocus = false;

    if (isEmptyObject(this._focusedCellPosition)) {
      this.setFocusedCellPosition(0, this.getFirstFocusableVisibleIndex());
    }

    const $focusedCell = this._getFocusedCell();
    $focusedCell?.[0]?.focus({ preventScroll: true });
  }
}
