import { adaptivityModule } from '@ts/grids/grid_core/adaptivity/adaptivity_module';

import gridCore from '../m_core';
import { adaptivityExportExtender } from './extenders/adaptivity_export';

gridCore.registerModule('adaptivity', {
  ...adaptivityModule,
  extenders: {
    ...adaptivityModule.extenders,
    controllers: {
      ...adaptivityModule.extenders?.controllers,
      export: adaptivityExportExtender,
    },
  },
});
