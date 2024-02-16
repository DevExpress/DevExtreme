import { extend } from '@js/core/utils/extend';
import DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import { ModuleType } from '@ts/grids/grid_core/m_types';
import { dataSourceAdapterExtender as virtualScrollingDataSourceAdapterExtender, virtualScrollingModule } from '@ts/grids/grid_core/virtual_scrolling/m_virtual_scrolling';

import dataSourceAdapterProvider from './data_source_adapter/m_data_source_adapter';
import gridCore from './m_core';

const oldDefaultOptions = virtualScrollingModule.defaultOptions;
const originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data;

virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
  _loadOnOptionChange() {
    const virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;

    virtualScrollController && virtualScrollController.reset();
    this.callBase();
  },
});
const dataSourceAdapterExtender = (Base: ModuleType<DataSourceAdapter>) => class VirtualScrollingDataSourceAdapterExtender extends virtualScrollingDataSourceAdapterExtender(Base) {
  changeRowExpand() {
    return super.changeRowExpand.apply(this, arguments as any).done(() => {
      const viewportItemIndex = this.getViewportItemIndex();

      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  }
};

gridCore.registerModule('virtualScrolling', extend({}, virtualScrollingModule, {
  defaultOptions() {
    return extend(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual',
      },
    });
  },
}));

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
