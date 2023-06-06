import { extend } from '@js/core/utils/extend';
import { columnsControllerModule } from '../grid_core/columns_controller/module';
import gridCore from './module_core';

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
