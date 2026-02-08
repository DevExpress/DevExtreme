import messageLocalization from '@js/common/core/localization/message';

import { Direction } from '../keyboard_navigation/const';
import type { ColumnKeyboardNavigationController } from '../keyboard_navigation/m_column_keyboard_navigation_core';
import type { ModuleType } from '../m_types';
import type { ColumnsView } from '../views/m_columns_view';
import { CONTEXT_MENU_MOVE_NEXT_ICON_NAME, CONTEXT_MENU_MOVE_PREVIOUS_ICON_NAME } from './const';

interface ColumnContextMenuMixinRequirements extends ColumnsView {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  isColumnReorderingEnabled?(column: any): boolean;

  // eslint-disable-next-line @typescript-eslint/method-signature-style
  getKeyboardNavigationController?(): ColumnKeyboardNavigationController;
}

export const ColumnContextMenuMixin = <T extends ModuleType<ColumnContextMenuMixinRequirements>>(Base: T) => class ColumnContextMenuMixin extends Base {
  protected isNeedToFocusColumn = false;

  public getMoveColumnContextMenuItems(options): any {
    const { column, rowIndex } = options;
    const allowColumnReordering = this.isColumnReorderingEnabled?.(options?.column);
    const keyboardNavigationController = this.getKeyboardNavigationController?.();

    if (!allowColumnReordering || !keyboardNavigationController) {
      return [];
    }

    const rtlEnabled = this.option('rtlEnabled');
    const onItemClick = (e) => {
      this.isNeedToFocusColumn = true;
      keyboardNavigationController.moveColumn(
        column,
        e.itemData?.value,
        rowIndex,
      );
    };

    return [
      {
        text: rtlEnabled
          ? messageLocalization.format('dxDataGrid-moveColumnToTheRight')
          : messageLocalization.format('dxDataGrid-moveColumnToTheLeft'),
        value: Direction.Previous,
        beginGroup: true,
        disabled: !keyboardNavigationController.canReorderColumn(
          column,
          Direction.Previous,
          rowIndex,
        ),
        icon: rtlEnabled ? CONTEXT_MENU_MOVE_NEXT_ICON_NAME : CONTEXT_MENU_MOVE_PREVIOUS_ICON_NAME,
        onItemClick,
      },
      {
        text: rtlEnabled
          ? messageLocalization.format('dxDataGrid-moveColumnToTheLeft')
          : messageLocalization.format('dxDataGrid-moveColumnToTheRight'),
        value: Direction.Next,
        disabled: !keyboardNavigationController.canReorderColumn(
          column,
          Direction.Next,
          rowIndex,
        ),
        icon: rtlEnabled ? CONTEXT_MENU_MOVE_PREVIOUS_ICON_NAME : CONTEXT_MENU_MOVE_NEXT_ICON_NAME,
        onItemClick,
      },
    ];
  }
};
