import { extend } from '@js/core/utils/extend';
import { masterDetailModule } from '@js/ui/grid_core/ui.grid_core.master_detail';
import treeListCore from './module_core';

treeListCore.registerModule('masterDetail', extend(true, {}, masterDetailModule, {
  extenders: {
    controllers: {
      data: {
        isRowExpanded() {
          return this.callBase.apply(this, arguments);
        },
        _processItems() {
          return this.callBase.apply(this, arguments);
        },
        _processDataItem() {
          return this.callBase.apply(this, arguments);
        },
      },
    },
  },
}));
