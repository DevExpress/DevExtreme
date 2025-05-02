import { isCommandKeyPressed } from '@js/common/core/events/utils';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import { Direction, ViewName } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { HeadersKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_headers_keyboard_navigation';
import { headersKeyboardNavigationModule } from '@ts/grids/grid_core/keyboard_navigation/m_headers_keyboard_navigation';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import gridCore from '../m_core';

const headersKeyboardNavigation = (
  Base: ModuleType<HeadersKeyboardNavigationController>,
) => class HeadersKeyboardNavigationControllerExtender extends Base {
  private ctrlGKeyHandler(e): void {
    const $cell = $(e.originalEvent.target).closest('td');
    const rowIndex = this._getRowIndex($cell.parent());
    const column = this._getColumnByCellElement($cell, rowIndex);
    const contextMenuEnabled = this.option('grouping.contextMenuEnabled');

    if (!isDefined(column.groupIndex) && column?.allowGrouping && contextMenuEnabled) {
      this.moveColumn({
        column,
        sourceLocation: 'headers',
        targetLocation: 'group',
        rowIndex,
      });
      e.originalEvent?.preventDefault();
    }
  }

  protected keyDownHandler(e): boolean {
    const isHandled = super.keyDownHandler(e);

    if (isHandled) {
      return true;
    }

    if (e.keyName.toLowerCase() === 'g' && isCommandKeyPressed(e.originalEvent)) {
      this.ctrlGKeyHandler(e);
    }

    return false;
  }

  protected getNewFocusedColumnIndex(visibleIndex, direction, targetLocation): number {
    if (targetLocation === ViewName.Group) {
      const focusableColumns = this.getFocusableColumns();
      const lastFocusableColumn = focusableColumns[focusableColumns.length - 1];

      if (visibleIndex === this._columnsController.getVisibleIndex(lastFocusableColumn.index)) {
        return super.getNewVisibleIndex(visibleIndex, Direction.Previous, targetLocation) + 1;
      }

      return super.getNewVisibleIndex(visibleIndex, Direction.Next, targetLocation) - 1;
    }

    return super.getNewFocusedColumnIndex(visibleIndex, direction, targetLocation);
  }

  public moveColumn(options) {
    const {
      column,
      sourceLocation,
      targetLocation,
      rowIndex = 0,
    } = options;

    if (targetLocation === ViewName.Group) {
      const visibleIndex = this.getVisibleIndex(column, rowIndex);
      const newVisibleIndex = this._columnsController.getGroupColumns()?.length ?? 0;
      const newFocusedColumnIndex = column.showWhenGrouped ? visibleIndex + 1 : this.getNewFocusedColumnIndex(
        visibleIndex,
        Direction.Next,
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
    } else {
      super.moveColumn(options);
    }
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
