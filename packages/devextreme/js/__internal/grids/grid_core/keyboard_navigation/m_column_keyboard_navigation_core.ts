import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';

import { Direction } from './const';
import type { ColumnFocusDispatcher } from './m_column_focus_dispatcher';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

export class ColumnKeyboardNavigationController extends KeyboardNavigationControllerCore {
  public columnFocusDispatcher!: ColumnFocusDispatcher;

  protected getVisibleIndex(column, rowIndex = 0) {
    return this._columnsController.getVisibleIndex(column.index, rowIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getNewVisibleIndex(visibleIndex, direction, targetLocation) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    targetLocation?: string,
  ) {
    return direction === Direction.Next ? newVisibleIndex - 1 : newVisibleIndex;
  }

  protected renderCompleted(e: any): void {
    super.renderCompleted(e);

    if (this.isNeedToFocus) {
      const restoreViewFocus = () => {
        this.component.off('contentReady', restoreViewFocus);
        this.restoreViewFocus();
        this.isNeedToFocus = false;
      };

      this.component.on('contentReady', restoreViewFocus);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isColumnValidForReordering(column, direction, rowIndex): boolean {
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
    const visibleIndex = this.getVisibleIndex(column, rowIndex);
    const newVisibleIndex = this.getNewVisibleIndex(
      visibleIndex,
      direction,
      targetLocation,
    );
    const newFocusedColumnIndex = this.getNewFocusedColumnIndex(
      newVisibleIndex >= 0 ? newVisibleIndex : visibleIndex,
      direction,
      targetLocation,
    );

    this.isNeedToFocus = true;
    this.setFocusedCellPosition(rowIndex, newFocusedColumnIndex);
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

  public restoreViewFocus() {
    this.columnFocusDispatcher?.restoreFocus(this);
  }

  public focusCell(cellPosition?) {
    const $focusedCell = cellPosition ? $(this._getCell(cellPosition)) : this._getFocusedCell();

    // @ts-expect-error
    eventsEngine.trigger($focusedCell, 'focus');
  }
}
