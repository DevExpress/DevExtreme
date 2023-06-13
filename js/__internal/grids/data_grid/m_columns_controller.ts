import { extend } from '@js/core/utils/extend';
import { columnsControllerModule } from '@ts/grids/grid_core/columns_controller/m_columns_controller';

import gridCore from './m_core';

gridCore.registerModule('columns', {
  defaultOptions() {
    return extend(true, {}, (columnsControllerModule as any).defaultOptions(), {
      commonColumnSettings: {
        allowExporting: true,
      },
    });
  },
  controllers: columnsControllerModule.controllers,
});
