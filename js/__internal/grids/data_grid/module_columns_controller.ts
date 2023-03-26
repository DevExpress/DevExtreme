// @ts-expect-error
import { columnsControllerModule } from '@js/ui/grid_core/ui.grid_core.columns_controller';
import { extend } from '@js/core/utils/extend';
import gridCore from './module_core';

gridCore.registerModule('columns', {
  defaultOptions() {
    return extend(true, {}, columnsControllerModule.defaultOptions(), {
      commonColumnSettings: {
        allowExporting: true,
      },
    });
  },
  controllers: columnsControllerModule.controllers,
});
