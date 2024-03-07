import { extend } from '@js/core/utils/extend';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import { dataMasterDetailExtenderMixin, masterDetailModule } from '@ts/grids/grid_core/master_detail/m_master_detail';

import treeListCore from './m_core';

const data = (Base: ModuleType<DataController>) => class DataMasterDetailTreeListExtender extends dataMasterDetailExtenderMixin(Base) {
  protected isRowExpanded() {
    // @ts-expect-error
    return this.isRowExpandedHack.apply(this, arguments);
  }

  protected _processItems() {
    // @ts-expect-error
    return this._processItemsHack.apply(this, arguments);
  }

  protected _processDataItem() {
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
