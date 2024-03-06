import { extend } from '@js/core/utils/extend';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import { keyboardNavigationModule } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import core from './m_core';

const keyboardNavigation = (Base: ModuleType<KeyboardNavigationController>) => class TreeListKeyboardNavigationControllerExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _leftRightKeysHandler(eventArgs, _isEditing?) {
    const rowIndex = this.getVisibleRowIndex();
    const dataController = this._dataController;

    if (eventArgs.ctrl) {
      const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
      const key = dataController.getKeyByRowIndex(rowIndex);
      if (directionCode === 'nextInRow') {
        // @ts-expect-error
        dataController.expandRow(key);
      } else {
        // @ts-expect-error
        dataController.collapseRow(key);
      }
    } else {
      return super._leftRightKeysHandler.apply(this, arguments as any);
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
