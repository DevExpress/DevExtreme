import { extend } from '@js/core/utils/extend';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import { keyboardNavigationModule } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import { keyboardNavigationScrollableA11yExtender } from '@ts/grids/grid_core/keyboard_navigation/scrollable_a11y';
import type { KeyboardNavigationDataController } from '@ts/grids/grid_core/keyboard_navigation/types';
import type { ModuleType } from '@ts/grids/grid_core/types';
import core from '@ts/grids/tree_list/core';
import type { TreeListDataController } from '@ts/grids/tree_list/data_controller/data_controller';

const keyboardNavigation = (
  Base: ModuleType<KeyboardNavigationController>,
): ModuleType<KeyboardNavigationController> => class TreeListKeyboardNavigationControllerExtender
  extends keyboardNavigationScrollableA11yExtender(Base) {
  protected declare _dataController: KeyboardNavigationDataController & TreeListDataController;

  protected _leftRightKeysHandler(eventArgs: KeyboardKeyDownEvent, isEditing?: boolean): void {
    const rowIndex = this.getVisibleRowIndex();

    if (eventArgs.ctrl) {
      const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
      const key = this._dataController.getKeyByRowIndex(rowIndex);
      if (directionCode === 'nextInRow') {
        this._dataController.expandRow(key);
      } else {
        this._dataController.collapseRow(key);
      }
    } else {
      super._leftRightKeysHandler(eventArgs, isEditing);
    }
  }
};

core.registerModule('keyboardNavigation', extend(true, {}, keyboardNavigationModule, {
  extenders: {
    controllers: {
      keyboardNavigation,
    },
  },
}));
