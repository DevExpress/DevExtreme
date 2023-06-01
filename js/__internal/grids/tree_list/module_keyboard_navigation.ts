import { extend } from '@js/core/utils/extend';
import { keyboardNavigationModule } from '@js/ui/grid_core/ui.grid_core.keyboard_navigation';
import core from './module_core';

core.registerModule('keyboardNavigation', extend(true, {}, keyboardNavigationModule, {
  extenders: {
    controllers: {
      keyboardNavigation: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _leftRightKeysHandler(eventArgs, isEditing) {
          const rowIndex = this.getVisibleRowIndex();
          const dataController = this._dataController;

          if (eventArgs.ctrl) {
            const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
            const key = dataController.getKeyByRowIndex(rowIndex);
            if (directionCode === 'nextInRow') {
              dataController.expandRow(key);
            } else {
              dataController.collapseRow(key);
            }
          } else {
            return this.callBase.apply(this, arguments);
          }
        },
      },
    },
  },
}));
