import type { Column, FilterField } from '@ts/grids/grid_core/columns_controller/types';

/**
 * Column-like shape used by filter sync. Compatible with
 * `Column`, `FilterField`, and persisted `ColumnUserState`.
 */
export type FilterSyncColumn = Partial<FilterField>;

/** The column options a header filter is expressed through. */
export type HeaderFilterState = Pick<Column, 'filterType' | 'filterValues'>;

/** The column options a filter row is expressed through. */
export type FilterRowState = Pick<Column,
  'filterValue' | 'selectedFilterOperation' | 'bufferedFilterValue' | 'bufferedSelectedFilterOperation'
>;
