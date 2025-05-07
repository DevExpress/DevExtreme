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
import { ColumnFocusDispatcher } from './m_column_focus_dispatcher';
import { ColumnKeyboardNavigationController } from './m_column_keyboard_navigation_core';

export class HeadersKeyboardNavigationController extends ColumnKeyboardNavigationController {
  protected _columnHeadersView!: Views['columnHeadersView'];

  private leftRightKeysHandler(e): void {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const $cell = $(originalEvent.target).closest('td');
      const direction = this.getDirectionByKeyName(e.keyName);
      const rowIndex = this._getRowIndex($cell.parent());
      const column = this._getColumnByCellElement($cell, rowIndex);

      if (this.canReorderColumn(column, direction, rowIndex)) {
        this.moveColumn({
          column,
          sourceLocation: 'headers',
          targetLocation: 'headers',
          direction,
          rowIndex,
        });
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

  protected keyDownHandler(e): boolean {
    const isHandled = this.processOnKeyDown(e);

    if (isHandled) {
      return true;
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

    return false;
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

  protected getFocusableColumns(): any[] {
    const visibleColumns = this._columnsController.getVisibleColumns();

    return visibleColumns.filter(
      (column) => !isDefined(column.type)
        || this._columnsController.isCustomCommandColumn(column),
    );
  }

  public init(): void {
    super.init();
    this._columnHeadersView = this.getView('columnHeadersView');
  }

  public canReorderColumn(column, direction, rowIndex): boolean {
    const allowReordering = this._columnHeadersView.isColumnReorderingEnabled(column);

    if (!allowReordering) {
      return false;
    }

    const draggableColumns = this.getDraggableColumns(column, rowIndex);
    const isFirstColumn = column.index === draggableColumns[0].index;
    const isLastColumn = column.index === draggableColumns[draggableColumns.length - 1].index;

    return direction === Direction.Next ? !isLastColumn : !isFirstColumn;
  }

  public getFirstFocusableVisibleIndex(): number {
    const focusableColumns = this.getFocusableColumns();

    if (focusableColumns?.length) {
      return this._columnsController.getVisibleIndex(focusableColumns[0].index);
    }

    return -1;
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
    columnFocusDispatcher: ColumnFocusDispatcher,
  },
};
