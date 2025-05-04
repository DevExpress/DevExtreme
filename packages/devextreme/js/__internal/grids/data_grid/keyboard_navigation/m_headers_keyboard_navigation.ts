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

  protected getNewVisibleIndex(visibleIndex, direction, targetLocation): number {
    if (targetLocation === ViewName.Group) {
      return this._columnsController.getGroupColumns()?.length ?? 0;
    }

    return super.getNewVisibleIndex(visibleIndex, direction, targetLocation);
  }

  protected getNewFocusedColumnIndex(
    visibleIndex: number,
    direction: Direction,
    targetLocation: ViewName,
    showWhenGrouped?: boolean,
  ): number {
    if (targetLocation === ViewName.Group) {
      if (showWhenGrouped) {
        return visibleIndex + 1;
      }

      const focusableColumns = this.getFocusableColumns();
      const lastFocusableColumn = focusableColumns[focusableColumns.length - 1];

      if (visibleIndex === this._columnsController.getVisibleIndex(lastFocusableColumn.index)) {
        return this.getNewVisibleIndex(visibleIndex, Direction.Previous, ViewName.Headers) + 1;
      }

      return this.getNewVisibleIndex(visibleIndex, Direction.Next, ViewName.Headers) - 1;
    }

    return super.getNewFocusedColumnIndex(
      visibleIndex,
      direction,
      targetLocation,
      showWhenGrouped,
    );
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
