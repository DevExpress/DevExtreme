import dataSourceAdapterProvider from '@ts/grids/data_grid/m_data_source_adapter';
import { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { DataSourceAdapterProvider } from '@ts/grids/grid_core/data_source_adapter/types';

export class DataGridDataSourceController extends DataSourceController {
  protected getAdapterProvider(): DataSourceAdapterProvider {
    return dataSourceAdapterProvider;
  }
}
