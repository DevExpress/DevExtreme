import './module_not_extended/editor_factory';

import { editingModule } from '@js/ui/grid_core/ui.grid_core.editing';
import { extend } from '@js/core/utils/extend';
import gridCore from './module_core';

gridCore.registerModule('editing', extend(true, {}, editingModule, {
  extenders: {
    controllers: {
      data: {
        _changeRowExpandCore(key) {
          const editingController = this._editingController;

          if (Array.isArray(key)) {
            editingController && editingController.refresh();
          }

          return this.callBase.apply(this, arguments);
        },
      },
    },
  },
}));
