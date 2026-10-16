import type { StateStoring } from '@js/common/grids';

import {
  stateStoringColumnsControllerExtender,
} from './extenders/state_storing_columns_controller';
import { stateStoringDataControllerExtender } from './extenders/state_storing_data_controller';
import { rowsView, selection } from './m_state_storing';
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
      columns: stateStoringColumnsControllerExtender,
      data: stateStoringDataControllerExtender,
      selection,
    },
  },
};
