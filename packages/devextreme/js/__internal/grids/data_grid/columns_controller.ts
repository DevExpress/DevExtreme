import { extend } from '@js/core/utils/extend';
import { columnsControllerModule } from '@ts/grids/grid_core/columns_controller/columns_controller';

import gridCore from './core';

gridCore.registerModule('columns', {
  defaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() returns any
    return extend(true, {}, columnsControllerModule.defaultOptions?.(), {
      commonColumnSettings: {
        allowExporting: true,
      },
    });
  },
  controllers: columnsControllerModule.controllers,
});
