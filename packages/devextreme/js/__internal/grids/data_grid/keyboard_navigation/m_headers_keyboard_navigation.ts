import { isCommandKeyPressed } from '@js/common/core/events/utils';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import { KEY_CODES } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { HeadersKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_headers_keyboard_navigation';
import { headersKeyboardNavigationModule } from '@ts/grids/grid_core/keyboard_navigation/m_headers_keyboard_navigation';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import gridCore from '../m_core';
import { ColumnKeyboardNavigationMixin } from './m_column_keyboard_navigation_mixin';

const headersKeyboardNavigation = (
  Base: ModuleType<HeadersKeyboardNavigationController>,
) => class HeadersKeyboardNavigationControllerExtender extends ColumnKeyboardNavigationMixin(Base) {
  private getNewFocusedColumnBeforeGrouping(
    column,
    rowIndex: number,
  ): any {
    if (column.showWhenGrouped) {
      return column;
    }

    let focusableColumns = this.getFocusableColumns(rowIndex);

    if (focusableColumns.length === 1 && isDefined(column.ownerBand)) {
      focusableColumns = this.getFocusableColumns();
    }

    if (focusableColumns.length === 1) {
      return;
    }

    const visibleColumnIndex = focusableColumns.findIndex((col) => col.index === column.index);

    if (visibleColumnIndex === focusableColumns.length - 1) {
      return focusableColumns[visibleColumnIndex - 1];
    }

    return focusableColumns[visibleColumnIndex + 1];
  }

  private groupColumnByPressingKey(e): void {
    const $cell = $(e.originalEvent.target).closest('td');
    const rowIndex = this._getRowIndex($cell.parent());
    const column = this._getColumnByCellElement($cell, rowIndex);

    this.groupColumn(column, rowIndex);
    e.originalEvent?.preventDefault();
  }

  private canGroupColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && isCommandKeyPressed(e.originalEvent);
  }

  protected getRowIndexFromEvent(e): number {
    const $cell = $(e.originalEvent.target).closest('td');

    return this._getRowIndex($cell.parent());
  }

  protected getColumnFromEvent(e) {
    const $cell = $(e.originalEvent.target).closest('td');
    const rowIndex = this._getRowIndex($cell.parent());

    return this._getColumnByCellElement($cell, rowIndex);
  }

  protected keyDownHandler(e): boolean {
    let isHandled = super.keyDownHandler(e);

    if (isHandled) {
      return true;
    }

    if (this.canGroupColumnByPressingKey(e)) {
      this.groupColumnByPressingKey(e);
      isHandled = true;
    }

    return isHandled;
  }

  public groupColumn(column, rowIndex = 0): void {
    if (!isDefined(column.groupIndex) && column?.allowGrouping) {
      const newGroupIndex = this._columnsController.getGroupColumns()?.length ?? 0;
      const newFocusedColumn = this.getNewFocusedColumnBeforeGrouping(
        column,
        rowIndex,
      );

      this._columnsController.beginUpdate();
      this._columnsController.columnOption(column.dataField, 'groupIndex', newGroupIndex);

      const newFocusedCellPosition = this.getFocusedCellPositionByColumn(newFocusedColumn);

      this.updateViewFocusPosition(newFocusedCellPosition);
      this._columnsController.endUpdate();
    }
  }

  public ungroupAllColumns(): void {
    const $focusedCell = this._getFocusedCell();
    const focusedColumn = this._getColumnByCellElement($focusedCell);

    this._columnsController.beginUpdate();
    super.ungroupAllColumns();

    const rowIndex = this._columnsController.getRowIndex(focusedColumn.index, true);
    const newVisibleIndex = this.getVisibleIndex(focusedColumn);

    this.updateFocusPosition({
      rowIndex,
      columnIndex: newVisibleIndex,
    });
    this._columnsController.endUpdate();
  }
};

gridCore.registerModule('headersKeyboardNavigation', {
  ...headersKeyboardNavigationModule,
  extenders: {
    controllers: {
      headersKeyboardNavigation,
    },
  },
});
