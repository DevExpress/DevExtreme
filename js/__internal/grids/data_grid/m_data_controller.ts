import errors from '@js/ui/widget/ui.errors';
import { dataControllerModule } from '@ts/grids/grid_core/data_controller/m_data_controller';

import gridCore from './m_core';
import dataSourceAdapterProvider from './m_data_source_adapter';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const DataController = (dataControllerModule.controllers?.data as any)?.inherit((function () {
  return {
    _getDataSourceAdapter() {
      return dataSourceAdapterProvider;
    },

    _getSpecificDataSourceOption() {
      const dataSource = this.option('dataSource');

      if (dataSource && !Array.isArray(dataSource) && this.option('keyExpr')) {
        errors.log('W1011');
      }

      return this.callBase();
    },
  };
})());

gridCore.registerModule('data', {
  defaultOptions: dataControllerModule.defaultOptions,
  controllers: {
    data: DataController,
  },
});
