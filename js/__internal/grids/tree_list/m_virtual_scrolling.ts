/* eslint-disable max-classes-per-file */
import { extend } from '@js/core/utils/extend';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import {
  data as virtualScrollingDataControllerExtender,
  dataSourceAdapterExtender as virtualScrollingDataSourceAdapterExtender,
  virtualScrollingModule,
} from '@ts/grids/grid_core/virtual_scrolling/m_virtual_scrolling';

import dataSourceAdapterProvider from './data_source_adapter/m_data_source_adapter';
import gridCore from './m_core';

const oldDefaultOptions = virtualScrollingModule.defaultOptions;

virtualScrollingModule.extenders.controllers.data = (Base: ModuleType<DataController>) => class TreeListVirtualScrollingDataControllerExtender extends virtualScrollingDataControllerExtender(Base) {
  protected _loadOnOptionChange() {
    const virtualScrollController = this._dataSource?._virtualScrollController;

    virtualScrollController?.reset();
    // @ts-expect-error
    super._loadOnOptionChange();
  }
};

const dataSourceAdapterExtender = (Base: ModuleType<DataSourceAdapter>) => class VirtualScrollingDataSourceAdapterExtender extends virtualScrollingDataSourceAdapterExtender(Base) {
  protected changeRowExpand() {
    return super.changeRowExpand.apply(this, arguments as any).done(() => {
      const viewportItemIndex = this.getViewportItemIndex();

      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  }
};

gridCore.registerModule('virtualScrolling', {
  ...virtualScrollingModule,
  defaultOptions() {
    return extend(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual',
      },
    });
  },
});

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
