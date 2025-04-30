/* eslint-disable max-classes-per-file */
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ModuleType, Views } from '../m_types';
import { StickyPosition } from '../sticky_columns/const';
import { getColumnFixedPosition } from '../sticky_columns/utils';
import { Direction } from './const';
import { ColumnContextMenuMixin, ColumnKeyboardNavigationController } from './m_column_keyboard_navigation_core';

export class HeadersKeyboardNavigationController extends ColumnKeyboardNavigationController {
  protected _columnHeadersView!: Views['columnHeadersView'];

  private leftRightKeysHandler(e): void {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const $cell = $(originalEvent.target).closest('td');
      const direction = this.getDirectionByKeyName(e.keyName);
      const rowIndex = this._getRowIndex($cell.parent());
      const column = this._getColumnByCellElement($cell, rowIndex);

      if (this.isColumnValidForReordering(column, direction, rowIndex)) {
        this.moveColumn({
          column,
          sourceLocation: 'headers',
          targetLocation: 'headers',
          direction,
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

  public isColumnValidForReordering(column, direction, rowIndex): boolean {
    const allowReordering = this._columnHeadersView.isColumnReorderingEnabled(column);

    if (!allowReordering) {
      return false;
    }

    const draggableColumns = this.getDraggableColumns(column, rowIndex);
    const isFirstColumn = column.index === draggableColumns[0].index;
    const isLastColumn = column.index === draggableColumns[draggableColumns.length - 1].index;

    return direction === Direction.Next ? !isLastColumn : !isFirstColumn;
  }
}

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
) => class ColumnHeadersViewKeyboardNavigationExtender extends ColumnContextMenuMixin(Base) {
  public getKeyboardNavigationController() {
    return this.getController('headersKeyboardNavigation');
  }

  public getContextMenuItems(options) {
    let items: any = super.getContextMenuItems(options);
    const moveColumnItems = this.getMoveColumnContextMenuItems(options);

    if (moveColumnItems?.length) {
      items = items ?? [];
      items.push(...moveColumnItems);
    }

    return items;
  }
};

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
  },
  extenders: {
    views: {
      columnHeadersView,
    },
  },
};
