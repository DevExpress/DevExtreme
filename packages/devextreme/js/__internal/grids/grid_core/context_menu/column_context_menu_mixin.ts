import messageLocalization from '@js/common/core/localization/message';
import type { ItemClickEvent } from '@js/ui/context_menu';

import { Direction } from '../keyboard_navigation/const';
import type { ModuleType } from '../types';
import type { ContextMenuItemsOptions } from '../views/types';
import { ICONS } from './const';
import type { ColumnContextMenu, MixinBase, MoveColumnMenuItem } from './types';

export const ColumnContextMenuMixin = <T extends MixinBase>(
  Base: T,
): T & ModuleType<ColumnContextMenu> => class extends Base {
  protected isNeedToFocusColumn = false;

  public getMoveColumnContextMenuItems(options: ContextMenuItemsOptions): MoveColumnMenuItem[] {
    const { column, rowIndex } = options;
    const allowColumnReordering = this.isColumnReorderingEnabled?.(column);
    const keyboardNavigationController = this.getKeyboardNavigationController?.();

    if (!column || !allowColumnReordering || !keyboardNavigationController) {
      return [];
    }

    const rtlEnabled = this.option('rtlEnabled');
    const onItemClick = (e: ItemClickEvent<MoveColumnMenuItem>): void => {
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
        icon: rtlEnabled ? ICONS.moveColumnNext : ICONS.moveColumnPrevious,
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
        icon: rtlEnabled ? ICONS.moveColumnPrevious : ICONS.moveColumnNext,
        onItemClick,
      },
    ];
  }
};
