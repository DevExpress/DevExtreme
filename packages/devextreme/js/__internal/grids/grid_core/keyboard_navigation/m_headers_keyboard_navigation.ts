import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { Views } from '../m_types';
import { StickyPosition } from '../sticky_columns/const';
import { GridCoreStickyColumnsDom } from '../sticky_columns/dom';
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
        this.moveColumn(
          column,
          direction,
          rowIndex,
        );
      }
      originalEvent?.preventDefault();
    }
  }

  private correctFocusedColumnIndexAfterScroll(columnIndexOffset: number): void {
    if (isDefined(this._focusedCellPosition?.columnIndex)) {
      const columnIndexOffsetDiff = this._columnsController.getColumnIndexOffset() - columnIndexOffset;

      this.setFocusedColumnIndex(
        this._focusedCellPosition.columnIndex - columnIndexOffsetDiff,
      );
    }
  }

  protected getColumnVisibleIndexCorrection(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visibleColumnIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rowIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    direction: Direction,
  ): number {
    return 0;
  }

  protected getNewVisibleIndex(
    visibleIndex: number,
    rowIndex: number,
    direction: Direction,
  ): number {
    const newVisibleIndex = super.getNewVisibleIndex(
      visibleIndex,
      rowIndex,
      direction,
    );
    const indexCorrection = this.getColumnVisibleIndexCorrection(
      visibleIndex,
      rowIndex,
      direction,
    );

    return newVisibleIndex + indexCorrection;
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

  protected getFocusableColumns(rowIndex?: number, bandColumnId?: number): Column[] {
    const visibleColumns = this._columnsController.getVisibleColumns(rowIndex);
    const isColumnFocusable = (column: Column): boolean => !isDefined(column.type)
        || this._columnsController.isCustomCommandColumn(column);
    const result: Column[] = visibleColumns.filter(isColumnFocusable);

    if (isDefined(bandColumnId)) {
      return result.filter((column: Column): boolean => column.ownerBand === bandColumnId);
    }

    return result;
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
    const isFixedCell = GridCoreStickyColumnsDom
      .isFixedCell($focusedCell, this.addWidgetPrefix.bind(this));

    if (isFixedCell) {
      super.restoreFocus();
      return;
    }

    const focusedCellIsOutsideVisibleArea = $focusedCell.length && this.isOutsideVisibleArea(
      $focusedCell,
      $(this._columnHeadersView.getContent()),
    );

    if (focusedCellIsOutsideVisibleArea) {
      const columnIndexOffset = this._columnsController.getColumnIndexOffset();

      this.needToRestoreFocus = false;
      this.scrollToNextCell($focusedCell).then(() => {
        this.correctFocusedColumnIndexAfterScroll(columnIndexOffset);
        super.restoreFocus();
      });
      return;
    }

    super.restoreFocus();
  }

  public needToFocus(): boolean {
    return this.needToRestoreFocus;
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
    columnFocusDispatcher: ColumnFocusDispatcher,
  },
};
