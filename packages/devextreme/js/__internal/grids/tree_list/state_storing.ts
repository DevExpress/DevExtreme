// eslint-disable-next-line max-classes-per-file
import type { UserState } from '@ts/grids/grid_core/data_controller/types';
import type {
  StateStoringDataControllerExtension,
} from '@ts/grids/grid_core/state_storing/extenders/state_storing_data_controller';
import { stateStoringModule } from '@ts/grids/grid_core/state_storing/state_storing_module';

import type { DataController } from '../grid_core/data_controller/data_controller';
import type { ModuleType } from '../grid_core/m_types';
import type { StateStoringController } from '../grid_core/state_storing/m_state_storing_controller';
import treeListCore from './m_core';

const stateStoring = (
  Base: ModuleType<StateStoringController>,
  // eslint-disable-next-line @stylistic/max-len
): ModuleType<StateStoringController> => class TreeListStateStoringExtender extends stateStoringModule.extenders.controllers.stateStoring(Base) {
  protected applyState(state): void {
    super.applyState(state);
    this.option('expandedRowKeys', state.expandedRowKeys ? state.expandedRowKeys.slice() : []);
  }
};

const data = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & StateStoringDataControllerExtension
// eslint-disable-next-line @stylistic/max-len
> => class TreeListStateStoringDataExtender extends stateStoringModule.extenders.controllers.data(Base) {
  public getUserState(): UserState {
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
