import type { StateStoring } from '@js/common/grids';

import { stateStoringDataControllerExtender } from './extenders/state_storing_data_controller';
import {
  columns,
  rowsView,
  selection,
  stateStoring,
} from './m_state_storing';
import { StateStoringController } from './m_state_storing_controller';

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
    stateStoring: StateStoringController,
  },
  extenders: {
    views: {
      rowsView,
    },
    controllers: {
      stateStoring,
      columns,
      data: stateStoringDataControllerExtender,
      selection,
    },
  },
};
