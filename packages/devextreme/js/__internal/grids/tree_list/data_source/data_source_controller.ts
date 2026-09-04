import { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { DataSourceAdapterProvider } from '@ts/grids/grid_core/data_source_adapter/types';
import dataSourceAdapterProvider from '@ts/grids/tree_list/data_source_adapter/m_data_source_adapter';

export class TreeListDataSourceController extends DataSourceController {
  protected getAdapterProvider(): DataSourceAdapterProvider {
    return dataSourceAdapterProvider;
  }
}
