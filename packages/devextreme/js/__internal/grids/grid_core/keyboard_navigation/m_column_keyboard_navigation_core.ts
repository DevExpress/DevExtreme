import { Direction } from './const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

export class ColumnKeyboardNavigationController extends KeyboardNavigationControllerCore {
  protected getVisibleIndex(column, rowIndex = 0) {
    return this._columnsController.getVisibleIndex(column.index, rowIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getNewVisibleIndex(visibleIndex, direction, sourceLocation, targetLocation) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isColumnValidForReordering(column, direction, rowIndex): boolean {
    return false;
  }

  public moveColumn({
    column,
    sourceLocation,
    targetLocation,
    direction = Direction.Next,
    rowIndex = 0,
  }) {
    const visibleIndex = this.getVisibleIndex(column, rowIndex);
    const newVisibleIndex = this.getNewVisibleIndex(
      visibleIndex,
      direction,
      sourceLocation,
      targetLocation,
    );
    const newFocusedColumnIndex = direction === Direction.Next
      ? newVisibleIndex - 1
      : newVisibleIndex;

    this.isNeedToFocus = true;
    this.setFocusedCellPosition(rowIndex, newFocusedColumnIndex);
    this._columnsController.moveColumn(
      { columnIndex: visibleIndex, rowIndex },
      { columnIndex: newVisibleIndex, rowIndex },
      sourceLocation,
      targetLocation,
    );
  }
}
