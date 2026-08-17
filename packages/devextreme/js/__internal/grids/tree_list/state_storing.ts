/* eslint-disable max-classes-per-file */
import type { UserState } from '@ts/grids/grid_core/data_controller/types';
import type {
  StateStoringDataControllerExtension,
} from '@ts/grids/grid_core/state_storing/extenders/state_storing_data_controller';
import {
  GridStateStoringController,
} from '@ts/grids/grid_core/state_storing/state_storing_controller';
import { stateStoringModule } from '@ts/grids/grid_core/state_storing/state_storing_module';
import type { GridState } from '@ts/grids/grid_core/state_storing/types';

import type { DataController } from '../grid_core/data_controller/data_controller';
import type { ModuleType } from '../grid_core/m_types';
import treeListCore from './m_core';

class TreeListStateStoringController extends GridStateStoringController {
  protected applyState(state: GridState): void {
    super.applyState(state);
    this.option('expandedRowKeys', state.expandedRowKeys ? state.expandedRowKeys.slice() : []);
  }
}

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
  controllers: {
    ...stateStoringModule.controllers,
    stateStoring: TreeListStateStoringController,
  },
  extenders: {
    ...stateStoringModule.extenders,
    controllers: {
      ...stateStoringModule.extenders.controllers,
      data,
    },
  },
});
