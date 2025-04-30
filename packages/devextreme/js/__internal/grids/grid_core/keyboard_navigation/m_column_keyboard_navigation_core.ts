/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';

import type { ModuleType } from '../m_types';
import type { ColumnsView } from '../views/m_columns_view';
import {
  CONTEXT_MENU_MOVE_NEXT_ICON, CONTEXT_MENU_MOVE_PREVIOUS_ICON, Direction,
} from './const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

export class ColumnKeyboardNavigationController extends KeyboardNavigationControllerCore {
  protected getVisibleIndex(column, rowIndex = 0) {
    return this._columnsController.getVisibleIndex(column.index, rowIndex);
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
  public isColumnValidForReordering(column, direction, rowIndex): boolean {
    return false;
  }

  public moveColumn({
    column,
    sourceLocation,
    targetLocation,
    direction = Direction.Next,
    rowIndex = 0,
  }) {
    const visibleIndex = this.getVisibleIndex(column, rowIndex);
    const newVisibleIndex = this.getNewVisibleIndex(visibleIndex, direction, sourceLocation, targetLocation);
    const newFocusedColumnIndex = direction === Direction.Next
      ? newVisibleIndex - 1
      : newVisibleIndex;

    this.isNeedToFocus = true;
    this.setFocusedCellPosition(rowIndex, newFocusedColumnIndex);
    this._columnsController.moveColumn(
      { columnIndex: visibleIndex, rowIndex },
      { columnIndex: newVisibleIndex, rowIndex },
      sourceLocation,
      targetLocation,
    );
  }
}

interface ColumnContextMenuMixinRequirements extends ColumnsView {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  isColumnReorderingEnabled?(column: any): boolean;

  // eslint-disable-next-line @typescript-eslint/method-signature-style
  getKeyboardNavigationController?(): ColumnKeyboardNavigationController;
}

export const ColumnContextMenuMixin = <T extends ModuleType<ColumnContextMenuMixinRequirements>>(Base: T) => class ColumnContextMenuMixin extends Base {
  private isNeedToFocusColumn = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected contextMenuHiddenHandler(e) {
    const keyboardNavigationController = this.getKeyboardNavigationController?.();

    if (this.isNeedToFocusColumn) {
      keyboardNavigationController?.restoreFocus();
      this.isNeedToFocusColumn = false;
    }
  }

  public getMoveColumnContextMenuItems(options): any {
    const items: any = [];
    const { column, rowIndex } = options;
    const allowColumnReordering = this.isColumnReorderingEnabled?.(options?.column);

    if (allowColumnReordering) {
      const keyboardNavigationController = this.getKeyboardNavigationController?.();

      if (keyboardNavigationController) {
        const rtlEnabled = this.option('rtlEnabled');
        const viewName = this.getName();
        const onItemClick = (e) => {
          this.isNeedToFocusColumn = true;
          keyboardNavigationController.moveColumn({
            column,
            sourceLocation: viewName,
            targetLocation: viewName,
            direction: e.itemData?.value,
            rowIndex,
          });
        };

        items.push(
          {
            text: messageLocalization.format('dxDataGrid-moveColumnToTheLeft'),
            value: Direction.Previous,
            beginGroup: true,
            disabled: !keyboardNavigationController.isColumnValidForReordering(
              column,
              Direction.Previous,
              rowIndex,
            ),
            icon: rtlEnabled ? CONTEXT_MENU_MOVE_NEXT_ICON : CONTEXT_MENU_MOVE_PREVIOUS_ICON,
            onItemClick,
          },
          {
            text: messageLocalization.format('dxDataGrid-moveColumnToTheRight'),
            value: Direction.Next,
            disabled: !keyboardNavigationController.isColumnValidForReordering(
              column,
              Direction.Next,
              rowIndex,
            ),
            icon: rtlEnabled ? CONTEXT_MENU_MOVE_PREVIOUS_ICON : CONTEXT_MENU_MOVE_NEXT_ICON,
            onItemClick,
          },
        );
      }
    }

    return items;
  }
};
