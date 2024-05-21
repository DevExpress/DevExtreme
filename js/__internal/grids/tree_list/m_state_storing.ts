// eslint-disable-next-line max-classes-per-file
import { stateStoringModule } from '@ts/grids/grid_core/state_storing/m_state_storing';

import type { DataController } from '../grid_core/data_controller/m_data_controller';
import type { ModuleType } from '../grid_core/m_types';
import type { StateStoringController } from '../grid_core/state_storing/m_state_storing_core';
import treeListCore from './m_core';

const stateStoring = (
  Base: ModuleType<StateStoringController>,
) => class TreeListStateStoringExtender extends stateStoringModule.extenders.controllers.stateStoring(Base) {
  protected applyState(state) {
    super.applyState(state);
    this.option('expandedRowKeys', state.expandedRowKeys ? state.expandedRowKeys.slice() : []);
  }
};

const data = (
  Base: ModuleType<DataController>,
) => class TreeListStateStoringDataExtender extends stateStoringModule.extenders.controllers.data(Base) {
  public getUserState() {
    const state = super.getUserState();

    if (!this.option('autoExpandAll')) {
      state.expandedRowKeys = this.option('expandedRowKeys');
    }

    return state;
  }
};

treeListCore.registerModule('stateStoring', {
  ...stateStoringModule,
  extenders: {
    ...stateStoringModule.extenders,
    controllers: {
      ...stateStoringModule.extenders.controllers,
      stateStoring,
      data,
    },
  },
});
