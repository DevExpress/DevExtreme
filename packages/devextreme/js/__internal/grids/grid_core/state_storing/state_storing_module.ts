import type { StateStoring } from '@js/common/grids';

import { stateStoringDataControllerExtender } from './extenders/state_storing_data_controller';
import { columns, rowsView, selection } from './m_state_storing';
import { GridStateStoringController } from './state_storing_controller';

export const stateStoringModule = {
  defaultOptions(): { stateStoring: StateStoring } {
    return {
      stateStoring: {
        enabled: false,
        storageKey: undefined,
        type: 'localStorage',
        customLoad: undefined,
        customSave: undefined,
        savingTimeout: 2000,
      },
    };
  },
  controllers: {
    stateStoring: GridStateStoringController,
  },
  extenders: {
    views: {
      rowsView,
    },
    controllers: {
      columns,
      data: stateStoringDataControllerExtender,
      selection,
    },
  },
};
