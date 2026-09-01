import type { InternalGridOptions } from '@ts/grids/grid_core/m_types';

import { filterSyncDataControllerExtender } from './extenders/filter_sync_data_controller';
import { columnHeadersView, FilterSyncController } from './m_filter_sync';

export const filterSyncModule = {
  defaultOptions(): Pick<InternalGridOptions, 'filterValue' | 'filterSyncEnabled'> {
    return {
      filterValue: null,
      filterSyncEnabled: 'auto',
    };
  },
  controllers: {
    filterSync: FilterSyncController,
  },
  extenders: {
    controllers: {
      data: filterSyncDataControllerExtender,
    },
    views: {
      columnHeadersView,
    },
  },
};
