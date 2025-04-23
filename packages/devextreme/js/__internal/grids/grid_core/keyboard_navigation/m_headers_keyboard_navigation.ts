import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

import type { Views } from '../m_types';
import { StickyPosition } from '../sticky_columns/const';
import { getColumnFixedPosition } from '../sticky_columns/utils';
import { Direction } from './const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

export class HeadersKeyboardNavigationController extends KeyboardNavigationControllerCore {
  protected _columnHeadersView!: Views['columnHeadersView'];

  private isHeaderValidForReordering(column, direction, rowIndex): boolean {
    const allowReordering = this._columnHeadersView.isReorderingEnabled(column);

    if (!allowReordering) {
      return false;
    }

    const draggableColumns = this.getDraggableColumns(column, rowIndex);
    const isFirstColumn = column.index === draggableColumns[0].index;
    const isLastColumn = column.index === draggableColumns[draggableColumns.length - 1].index;

    return direction === Direction.Next ? !isLastColumn : !isFirstColumn;
  }

  private leftRightKeysHandler(e): void {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const $cell = $(originalEvent.target).closest('td');
      const rowIndex = this._getRowIndex($cell.parent());
      const column = this._getColumnByCellElement($cell, rowIndex);
      const direction = this.getDirectionByKeyName(e.keyName);

      if (this.isHeaderValidForReordering(column, direction, rowIndex)) {
        const visibleIndex = this._columnsController.getVisibleIndex(column.index, rowIndex);
        const newVisibleIndex = this.getNewVisibleIndex(visibleIndex, direction);
        const newFocusedColumnIndex = direction === Direction.Next
          ? newVisibleIndex - 1
          : newVisibleIndex;

        this.isNeedToFocus = true;
        this.setFocusedCellPosition(rowIndex, newFocusedColumnIndex);
        this._columnsController.moveColumn(
          { columnIndex: visibleIndex, rowIndex },
          { columnIndex: newVisibleIndex, rowIndex },
          'headers',
          'headers',
        );
      }
      originalEvent?.preventDefault();
    }
  }

  protected getDraggableColumns(
    column,
    rowIndex: number,
  ): any[] {
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns(rowIndex, true)
      ?.filter((col) => col.ownerBand === column?.ownerBand
        && (!isDefined(col.type) || columnsController.isCustomCommandColumn(col)));

    if (column?.fixed) {
      const fixedPosition = getColumnFixedPosition(columnsController, column);

      if (fixedPosition !== StickyPosition.Sticky) {
        return visibleColumns
          .filter((col) => col.fixed
            && getColumnFixedPosition(columnsController, col) === fixedPosition);
      }
    }

    return visibleColumns.filter((column) => !column.fixed || column.fixedPosition === StickyPosition.Sticky);
  }

  protected keyDownHandler(e): void {
    const isHandled = this.processOnKeyDown(e);

    if (isHandled) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (e.keyName) {
      case 'tab': {
        this.tabKeyHandler(e);
        break;
      }
      case 'leftArrow':
      case 'rightArrow':
        this.leftRightKeysHandler(e);
        break;
    }
  }

  protected getNewVisibleIndex(visibleIndex, direction) {
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
  protected tabKeyHandler(e): void {}

  protected getCellIndex($cell): number {
    return this._columnHeadersView.getCellIndex($cell);
  }

  protected _getCell(cellPosition): dxElementWrapper {
    return this._columnHeadersView?.getCell(cellPosition);
  }

  protected getFocusedView(): any {
    return this.getView('columnHeadersView');
  }

  protected focusinHandler(e): void {
    this._updateFocusedCellPosition($(e.target));
  }

  protected getFocusinSelector(): string {
    return '.dx-header-row > td';
  }

  public init(): void {
    super.init();
    this._columnHeadersView = this.getView('columnHeadersView');
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
  },
};
