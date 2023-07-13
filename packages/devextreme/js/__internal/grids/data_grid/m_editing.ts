import './module_not_extended/editor_factory';

import { extend } from '@js/core/utils/extend';
import { editingModule } from '@ts/grids/grid_core/editing/m_editing';

import gridCore from './m_core';

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
