import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';

export const createIdFilter = (field: unknown, keys: unknown[]): DataFilter => combineFilters(
  keys.map((key) => [field, '=', key]),
  'or',
);
