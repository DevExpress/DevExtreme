import { isCommandKeyPressed } from '@js/common/core/events/utils';
import { KEY_CODES } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_column_keyboard_navigation_core';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

export const ColumnKeyboardNavigationMixin = <T extends ModuleType<ColumnKeyboardNavigationController>>(Base: T) => class ColumnKeyboardNavigationMixin extends Base {
  protected ungroupColumn(e): void {
    const column = this.getColumnFromEvent(e);
    const contextMenuEnabled = this.option('grouping.contextMenuEnabled');

    if (column && contextMenuEnabled) {
      this.moveColumn({
        column,
        sourceLocation: 'group',
        targetLocation: 'headers',
      });

      e.originalEvent?.preventDefault();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getColumnFromEvent(e): any {}

  protected keyDownHandler(e): boolean {
    let isHandled = super.keyDownHandler(e);

    if (isHandled) {
      return true;
    }

    if (this.canUngroupColumnByPressingKey(e)) {
      this.ungroupColumn(e);
      isHandled = true;
    } else if (this.canUngroupAllColumnByPressingKey(e)) {
      this.ungroupAllColumns();
      isHandled = true;
    }

    return isHandled;
  }

  public canUngroupColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && e.shift && isCommandKeyPressed(e.originalEvent);
  }

  public canUngroupAllColumnByPressingKey(e): boolean {
    return e.which === KEY_CODES.G && e.shift && e.alt;
  }

  public ungroupAllColumns(): void {
    this._columnsController.clearGrouping();
  }
};
