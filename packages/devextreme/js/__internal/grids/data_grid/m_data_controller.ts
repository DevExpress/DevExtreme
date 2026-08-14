import errors from '@js/ui/widget/ui.errors';
import { DataController, dataControllerModule } from '@ts/grids/grid_core/data_controller/data_controller';

import type { DataSourceAdapterProvider } from '../grid_core/data_source_adapter/types';
import gridCore from './m_core';
import dataSourceAdapterProvider from './m_data_source_adapter';

class DataGridDataController extends DataController {
  protected _getDataSourceAdapterProvider(): DataSourceAdapterProvider {
    return dataSourceAdapterProvider;
  }

  protected _getSpecificDataSourceOption() {
    const dataSource = this.option('dataSource');

    if (dataSource && !Array.isArray(dataSource) && this.option('keyExpr')) {
      errors.log('W1011');
    }

    return super._getSpecificDataSourceOption();
  }
}

export { DataGridDataController as DataController };

gridCore.registerModule('data', {
  defaultOptions: dataControllerModule.defaultOptions,
  controllers: {
    data: DataGridDataController,
  },
});
