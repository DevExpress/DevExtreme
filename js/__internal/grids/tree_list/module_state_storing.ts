import { extend } from '@js/core/utils/extend';
import { stateStoringModule } from '@js/ui/grid_core/ui.grid_core.state_storing';
import treeListCore from './module_core';

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
