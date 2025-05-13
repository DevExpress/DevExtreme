import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';
import { getElementLocationInternal } from '@ts/ui/scroll_view/utils/get_element_location_internal';

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
    let isHandled = super.keyDownHandler(e);

    if (isHandled) {
      return true;
    }

    // eslint-disable-next-line default-case
    switch (e.keyName) {
      case 'tab': {
        this.tabKeyHandler(e);
        isHandled = true;
        break;
      }
      case 'leftArrow':
      case 'rightArrow':
        this.leftRightKeysHandler(e);
        isHandled = true;
        break;
    }

    return isHandled;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected tabKeyHandler(e): void {}

  protected getCellIndex($cell): number {
    return this._columnHeadersView.getCellIndex($cell);
  }

  protected _getCell(cellPosition): dxElementWrapper {
    const columnIndexOffset = this.getColumnIndexOffset(cellPosition.columnIndex);
    const columnIndex = cellPosition.columnIndex >= 0
      ? cellPosition.columnIndex - columnIndexOffset
      : -1;

    return this._columnHeadersView?.getCell({
      rowIndex: cellPosition.rowIndex,
      columnIndex,
    });
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

  protected getContainerBoundingRect($container: dxElementWrapper) {
    const containerRect = getBoundingRect($container.get(0));

    return {
      left: containerRect.left,
      right: containerRect.right,
    };
  }

  protected getScrollPadding(
    $container: dxElementWrapper,
  ): {
      left: number;
      right: number;
    } {
    const containerRect = getBoundingRect($container.get(0));
    const containerBoundingRect = this.getContainerBoundingRect($container);

    return {
      left: containerBoundingRect.left - containerRect.left,
      right: containerRect.right - containerBoundingRect.right,
    };
  }

  protected isOutsideVisibleArea = (
    $element: dxElementWrapper,
    $container: dxElementWrapper,
  ): boolean => {
    const elementRect = getBoundingRect($element.get(0));
    const elementRectLeft = Math.round(elementRect.left);
    const elementRectRight = Math.round(elementRect.right);
    const containerBoundingRect = this.getContainerBoundingRect($container);

    return elementRectLeft < containerBoundingRect.left
      || elementRectRight > containerBoundingRect.right;
  };

  protected scrollToColumn($cell: dxElementWrapper): void {
    const scrollable = this.getView('rowsView')?.getScrollable();

    if (scrollable) {
      const cellIsOutsideVisibleArea = this.isOutsideVisibleArea(
        $cell,
        $(this._columnHeadersView.getContent()),
      );

      if (cellIsOutsideVisibleArea) {
        const scrollPadding = this.getScrollPadding($(scrollable.container()));
        const scrollPosition = getElementLocationInternal(
          $cell[0],
          'horizontal',
          $(this._columnHeadersView.getContent())[0],
          scrollable.scrollOffset(),
          scrollPadding,
          this.addWidgetPrefix('table'),
        );

        const isNeedToRenderVirtualColumns = this._columnsController
          ?.isNeedToRenderVirtualColumns(scrollPosition);

        if (isNeedToRenderVirtualColumns) {
          this.needToRestoreFocus = true;
        }

        scrollable.scrollTo({ x: scrollPosition });
      }
    }
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

  public restoreFocus(): void {
    const $focusedCell = this._getFocusedCell();

    if ($focusedCell?.length) {
      this.scrollToColumn($focusedCell);
    }

    super.restoreFocus();
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
    columnFocusDispatcher: ColumnFocusDispatcher,
  },
};
