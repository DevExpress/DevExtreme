import gridCore from '@ts/grids/data_grid/core';

import { DataGridDataSourceController } from './data_source_controller';

gridCore.registerModule('dataSource', {
  controllers: {
    dataSource: DataGridDataSourceController,
  },
});
