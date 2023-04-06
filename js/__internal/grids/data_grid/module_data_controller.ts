import errors from '@js/ui/widget/ui.errors';
// @ts-expect-error
import { dataControllerModule } from '@js/ui/grid_core/ui.grid_core.data_controller';
import gridCore from './module_core';
import dataSourceAdapterProvider from './module_data_source_adapter';

export const DataController = dataControllerModule.controllers.data.inherit((function () {
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
