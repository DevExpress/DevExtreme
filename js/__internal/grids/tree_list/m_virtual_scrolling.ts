import { extend } from '@js/core/utils/extend';
import { virtualScrollingModule } from '@ts/grids/grid_core/virtual_scrolling/m_virtual_scrolling';

import dataSourceAdapter from './data_source_adapter/m_data_source_adapter';
import gridCore from './m_core';

const oldDefaultOptions = virtualScrollingModule.defaultOptions;
const originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data;
const originalDataSourceAdapterExtender = virtualScrollingModule.extenders.dataSourceAdapter;

virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
  _loadOnOptionChange() {
    const virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;

    virtualScrollController && virtualScrollController.reset();
    this.callBase();
  },
});

virtualScrollingModule.extenders.dataSourceAdapter = extend({}, originalDataSourceAdapterExtender, {
  changeRowExpand() {
    return this.callBase.apply(this, arguments).done(() => {
      const viewportItemIndex = this.getViewportItemIndex();

      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  },
});

gridCore.registerModule('virtualScrolling', extend({}, virtualScrollingModule, {
  defaultOptions() {
    return extend(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual',
      },
    });
  },
}));

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
