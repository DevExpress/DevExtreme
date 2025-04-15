import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

import type { Views } from '../m_types';
import { StickyPosition } from '../sticky_columns/const';
import { getColumnFixedPosition, isFirstFixedColumn, isLastFixedColumn } from '../sticky_columns/utils';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

enum Direction {
  Next = 'next',
  Previous = 'previous',
}

export class HeadersKeyboardNavigationController extends KeyboardNavigationControllerCore {
  protected _columnHeadersView!: Views['columnHeadersView'];

  private getDirectionByKeyName(keyName): Direction {
    const rtlEnabled = this.option('rtlEnabled');

    switch (keyName) {
      case 'leftArrow': {
        return rtlEnabled ? Direction.Next : Direction.Previous;
      }
      case 'rightArrow': {
        return rtlEnabled ? Direction.Previous : Direction.Next;
        break;
      }
      default: {
        return Direction.Next;
      }
    }
  }

  private isHeaderValidForReordering(column, direction, rowIndex): boolean {
    const columnsController = this._columnsController;
    const allowReordering = this._columnHeadersView.allowDragging(column);

    if (!allowReordering) {
      return false;
    }

    if (column.fixed && column.fixedPosition !== StickyPosition.Sticky) {
      const fixedPosition = getColumnFixedPosition(columnsController, column);

      return direction === Direction.Next ? !isLastFixedColumn(
        columnsController,
        column,
        rowIndex,
        isDefined(column.ownerBand),
        fixedPosition,
      ) : !isFirstFixedColumn(
        columnsController,
        column,
        rowIndex,
        isDefined(column.ownerBand),
        fixedPosition,
      );
    }

    const unfixedColumns = columnsController.getUnfixedAndStickyColumns(rowIndex, column.ownerBand);
    const isFirstColumn = column.index === unfixedColumns[0].index;
    const isLastColumn = column.index === unfixedColumns[unfixedColumns.length - 1].index;

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
        const newFocusedColumnIndex = direction === 'next' ? newVisibleIndex - 1 : newVisibleIndex;

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
