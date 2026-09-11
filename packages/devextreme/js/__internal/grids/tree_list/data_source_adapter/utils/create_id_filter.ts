import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

export const createIdFilter = (field: unknown, keys: unknown[]): DataFilter => gridCoreUtils
  .combineFilters(
    keys.map((key) => [field, '=', key]),
    'or',
  );
