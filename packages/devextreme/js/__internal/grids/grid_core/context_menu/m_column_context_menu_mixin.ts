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

  private onContextMenuHiddenContext!: (event: Event) => void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onContextMenuHidden(e) {
    if (this.isNeedToFocusColumn) {
      const keyboardNavigationController = this.getKeyboardNavigationController?.();

      keyboardNavigationController?.restoreViewFocus();
      this.isNeedToFocusColumn = false;
    }
  }

  public init() {
    super.init();

    const contextMenuController = this.getController('contextMenu');
    this.onContextMenuHiddenContext = this.onContextMenuHiddenContext
      || this.onContextMenuHidden.bind(this);

    contextMenuController.contextMenuHidden.remove(this.onContextMenuHiddenContext);
    contextMenuController.contextMenuHidden.add(this.onContextMenuHiddenContext);
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
            icon: rtlEnabled ? CONTEXT_MENU_MOVE_NEXT_ICON_NAME : CONTEXT_MENU_MOVE_PREVIOUS_ICON_NAME,
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
            icon: rtlEnabled ? CONTEXT_MENU_MOVE_PREVIOUS_ICON_NAME : CONTEXT_MENU_MOVE_NEXT_ICON_NAME,
            onItemClick,
          },
        );
      }
    }

    return items;
  }
};
