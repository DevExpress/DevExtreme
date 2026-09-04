import errors from '@js/ui/widget/ui.errors';
import { DataController, dataControllerModule } from '@ts/grids/grid_core/data_controller/data_controller';

import gridCore from './m_core';

class DataGridDataController extends DataController {
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
