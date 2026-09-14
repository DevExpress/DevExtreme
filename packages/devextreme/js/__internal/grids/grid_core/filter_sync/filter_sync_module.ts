import type { InternalGridOptions } from '@ts/grids/grid_core/m_types';

import { filterSyncColumnHeadersViewExtender } from './extenders/filter_sync_column_headers_view';
import { filterSyncDataControllerExtender } from './extenders/filter_sync_data_controller';
import { FilterSyncController } from './m_filter_sync';

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
      columnHeadersView: filterSyncColumnHeadersViewExtender,
    },
  },
};
