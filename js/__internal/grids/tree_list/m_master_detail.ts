import { extend } from '@js/core/utils/extend';
import { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import { ModuleType } from '@ts/grids/grid_core/m_types';
import { dataMasterDetailExtenderMixin, masterDetailModule } from '@ts/grids/grid_core/master_detail/m_master_detail';

import treeListCore from './m_core';

const data = (Base: ModuleType<DataController>) => class DataMasterDetailTreeListExtender extends dataMasterDetailExtenderMixin(Base) {
  isRowExpanded() {
    // @ts-expect-error
    return this.isRowExpandedHack.apply(this, arguments);
  }

  _processItems() {
    // @ts-expect-error
    return this._processItemsHack.apply(this, arguments);
  }

  _processDataItem() {
    // @ts-expect-error
    return this._processDataItemHack.apply(this, arguments);
  }
};

treeListCore.registerModule('masterDetail', extend(
  true,
  {},
  masterDetailModule,
  {
    extenders: {
      controllers: {
        data,
      },
    },
  },
));
