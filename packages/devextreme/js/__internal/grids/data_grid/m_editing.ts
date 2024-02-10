import './module_not_extended/editor_factory';

import { extend } from '@js/core/utils/extend';
import { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import { dataControllerEditingExtenderMixin, editingModule } from '@ts/grids/grid_core/editing/m_editing';
import { ModuleType } from '@ts/grids/grid_core/m_types';

import gridCore from './m_core';

const data = (Base: ModuleType<DataController>) => class DataEditingDataGridExtender extends dataControllerEditingExtenderMixin(Base) {
  // NOTE: There is no _changeRowExpandCore method in the grid_core/editing, so everything ok
  _changeRowExpandCore(key) {
    const editingController = this._editingController;

    if (Array.isArray(key)) {
      editingController && editingController.refresh();
    }

    // @ts-expect-error
    return super._changeRowExpandCore.apply(this, arguments);
  }
};

gridCore.registerModule('editing', extend(true, {}, editingModule, {
  extenders: {
    controllers: {
      data,
    },
  },
}));
