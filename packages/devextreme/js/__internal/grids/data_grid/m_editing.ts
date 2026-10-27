import './module_not_extended/editor_factory';

import type { DeferredObj } from '@js/core/utils/deferred';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import { editingModule } from '@ts/grids/grid_core/editing/editing';
import type { EditingDataControllerExtension } from '@ts/grids/grid_core/editing/extenders/editing_data_controller';
import { editingDataControllerExtender } from '@ts/grids/grid_core/editing/extenders/editing_data_controller';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';

import gridCore from './core';
import type { GroupingDataControllerExtension } from './grouping/m_grouping';

const data = (
  Base: ModuleType<DataController & GroupingDataControllerExtension>,
): ModuleType<
  DataController & EditingDataControllerExtension & GroupingDataControllerExtension
> => class DataGridEditingDataControllerExtender extends editingDataControllerExtender(Base) {
  public changeRowExpandCore(key: RowKey): DeferredObj<unknown> {
    if (Array.isArray(key)) {
      this._editingController?.refresh();
    }

    return super.changeRowExpandCore(key);
  }
};

gridCore.registerModule('editing', {
  ...editingModule,
  extenders: {
    ...editingModule.extenders,
    controllers: {
      ...editingModule.extenders.controllers,
      data,
    },
  },
});
