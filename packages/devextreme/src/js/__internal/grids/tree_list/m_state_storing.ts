import { extend } from '@js/core/utils/extend';
import { stateStoringModule } from '@ts/grids/grid_core/state_storing/m_state_storing';

import treeListCore from './m_core';

const origApplyState = stateStoringModule.extenders.controllers.stateStoring.applyState;

treeListCore.registerModule('stateStoring', extend(true, {}, stateStoringModule, {
  extenders: {
    controllers: {
      stateStoring: {
        applyState(state) {
          origApplyState.apply(this, arguments as any);
          this.option('expandedRowKeys', state.expandedRowKeys ? state.expandedRowKeys.slice() : []);
        },
      },
      data: {
        getUserState() {
          const state = this.callBase.apply(this, arguments);

          if (!this.option('autoExpandAll')) {
            state.expandedRowKeys = this.option('expandedRowKeys');
          }

          return state;
        },
      },
    },
  },
}));
