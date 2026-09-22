import { adaptivityModule } from '@ts/grids/grid_core/adaptivity/adaptivity_module';

import gridCore from '../m_core';
import { adaptivityExportViewControllerExtender } from './extenders/adaptivity_export_view_controller';

gridCore.registerModule('adaptivity', {
  ...adaptivityModule,
  extenders: {
    ...adaptivityModule.extenders,
    controllers: {
      ...adaptivityModule.extenders?.controllers,
      export: adaptivityExportViewControllerExtender,
    },
  },
});
