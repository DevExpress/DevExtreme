import { isDefined, isEmptyObject } from '@js/core/utils/type';

import { Direction, ViewName } from './const';
import type { ColumnFocusDispatcher } from './m_column_focus_dispatcher';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

export class ColumnKeyboardNavigationController extends KeyboardNavigationControllerCore {
  public columnFocusDispatcher!: ColumnFocusDispatcher;

  protected keyDownHandler(e): boolean {
    return this.processOnKeyDown(e);
  }

  protected getVisibleIndex(
    column,
    rowIndex?: number,
    sourceLocation?: ViewName,
  ): number {
    if (sourceLocation === ViewName.Group) {
      return column.groupIndex as number;
    }

    const visibleIndex = this._columnsController.getVisibleIndex(column.index, rowIndex);
    const columnIndexOffset = this.getColumnIndexOffset(visibleIndex);

    return visibleIndex >= 0 ? visibleIndex + columnIndexOffset : -1;
  }

  protected getNewVisibleIndex(
    visibleIndex: number,
    direction: Direction,
    sourceLocation?: ViewName,
    targetLocation?: ViewName,
  ): number {
    const isUngroupColumn = sourceLocation === ViewName.Group
      && targetLocation === ViewName.Headers;

    if (isUngroupColumn) {
      return -1;
    }

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
    sourceLocation: ViewName,
    targetLocation: ViewName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showWhenGrouped = false,
  ): number {
    return direction === Direction.Next ? newVisibleIndex - 1 : newVisibleIndex;
  }

  protected resizeCompleted(): void {
    if (this.needToRestoreFocus) {
      this.restoreFocus();
      this.needToRestoreFocus = false;
    }
  }

  protected resetFocusedCellPosition(): void {
    this._focusedCellPosition = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public canReorderColumn(column, direction, rowIndex): boolean {
    return false;
  }

  public init() {
    super.init();

    this.columnFocusDispatcher = this.getController('columnFocusDispatcher');
    this.columnFocusDispatcher?.registerKeyboardNavigationController(this);
  }

  public moveColumn({
    column,
    sourceLocation,
    targetLocation,
    direction = Direction.Next,
    rowIndex = 0,
  }) {
    const isGrouping = sourceLocation === ViewName.Headers && targetLocation === ViewName.Group;
    const visibleIndex = this.getVisibleIndex(column, rowIndex, sourceLocation);
    const newVisibleIndex = this.getNewVisibleIndex(
      visibleIndex,
      direction,
      sourceLocation,
      targetLocation,
    );
    const newFocusedColumnIndex = this.getNewFocusedColumnIndex(
      !isGrouping && newVisibleIndex >= 0 ? newVisibleIndex : visibleIndex,
      direction,
      sourceLocation,
      targetLocation,
      column.showWhenGrouped,
    );

    this.updateViewFocusPosition(newFocusedColumnIndex >= 0 ? {
      rowIndex,
      columnIndex: newFocusedColumnIndex,
    } : undefined);
    this._columnsController.moveColumn(
      { columnIndex: visibleIndex, rowIndex },
      { columnIndex: newVisibleIndex, rowIndex },
      sourceLocation,
      targetLocation,
    );
  }

  public getFirstFocusableVisibleIndex(): number {
    return -1;
  }

  public updateViewFocusPosition(cellPosition?: { rowIndex: number; columnIndex: number }) {
    this.columnFocusDispatcher?.updateFocusPosition(this, cellPosition);
  }

  public updateFocusPosition(cellPosition?: { rowIndex: number; columnIndex: number }) {
    this.needToRestoreFocus = true;

    if (isDefined(cellPosition)) {
      this.setFocusedCellPosition(cellPosition.rowIndex, cellPosition.columnIndex);
    } else {
      this.resetFocusedCellPosition();
    }
  }

  public restoreViewFocus() {
    this.columnFocusDispatcher?.restoreFocus(this);
  }

  public restoreFocus() {
    if (isEmptyObject(this._focusedCellPosition)) {
      this.setFocusedCellPosition(0, this.getFirstFocusableVisibleIndex());
    }

    const $focusedCell = this._getFocusedCell();
    $focusedCell?.[0]?.focus({ preventScroll: true });
  }
}
