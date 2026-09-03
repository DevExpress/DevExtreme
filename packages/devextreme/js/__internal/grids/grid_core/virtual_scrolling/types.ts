import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type { VirtualItemsCount } from '@ts/grids/grid_core/virtual_data_loader/types';

export interface ChangedLoadParams {
  pageIndex: number;
  loadPageCount: number;
}

export interface VirtualScrollingDataSourceAdapterExtension {
  getRenderTime: () => number | undefined;
  setRenderTime: (value: number) => void;
}

export interface VirtualScrollingDataSourceHolder {
  _dataSource?: (DataSourceAdapter & VirtualScrollingDataSourceAdapterExtension) | null;
}

export interface VirtualScrollingDataControllerExtension {
  virtualItemsCount: () => VirtualItemsCount | undefined;
}
