import messageLocalization from '@js/common/core/localization/message';
import type { ItemClickEvent } from '@js/ui/context_menu';

import { Direction } from '../keyboard_navigation/const';
import type { ContextMenuItemsOptions, GridContextMenuItem } from '../views/types';
import { CONTEXT_MENU_MOVE_NEXT_ICON_NAME, CONTEXT_MENU_MOVE_PREVIOUS_ICON_NAME } from './const';
import type { MixinBase } from './types';

/* eslint-disable-next-line
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/explicit-function-return-type
  -- TS can't name the class type of a generic mixin */
export const ColumnContextMenuMixin = <T extends MixinBase>(Base: T) => class extends Base {
  protected isNeedToFocusColumn = false;

  public getMoveColumnContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem<Direction>[] {
    const { column, rowIndex } = options;
    const allowColumnReordering = this.isColumnReorderingEnabled?.(options?.column);
    const keyboardNavigationController = this.getKeyboardNavigationController?.();

    if (!column || !allowColumnReordering || !keyboardNavigationController) {
      return [];
    }

    const rtlEnabled = this.option('rtlEnabled');
    const onItemClick = (e: ItemClickEvent<GridContextMenuItem<Direction>>): void => {
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
