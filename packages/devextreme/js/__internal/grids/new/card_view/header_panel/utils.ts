import type { FilterType } from '@js/common/grids';

export const hasFilterValues = (
  filterType?: FilterType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterValues?: any[],
): boolean => filterType === 'exclude' || !!filterValues?.length;
