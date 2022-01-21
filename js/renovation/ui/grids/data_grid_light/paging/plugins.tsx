import { createValue, createSelector } from '../../../../utils/plugin/context';
import { TotalCount } from '../data_grid_light';

export const PageIndex = createValue<number>();
export const SetPageIndex = createValue<(pageIndex: number) => void>();
export const PageSize = createValue<number | 'all'>();
export const SetPageSize = createValue<(pageSize: number | 'all') => void>();

export const PageCount = createSelector(
  [TotalCount, PageSize],
  (totalCount, pageSize) => {
    if (pageSize === 'all') {
      return 1;
    }
    return Math.ceil(totalCount / pageSize);
  },
);
