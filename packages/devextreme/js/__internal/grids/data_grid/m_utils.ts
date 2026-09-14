import { normalizeSortingInfo } from '@js/common/data/utils';
import { isDefined } from '@ts/core/utils/m_type';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';

import type { Column } from './types';

export function createGroupFilter(path, storeLoadOptions) {
  const groups = normalizeSortingInfo(storeLoadOptions.group);

  const filter: any = [];

  for (let i = 0; i < path.length; i++) {
    filter.push([groups[i].selector, '=', path[i]]);
  }

  if (storeLoadOptions.filter) {
    filter.push(storeLoadOptions.filter);
  }
  return combineFilters(filter);
}

export const isDataColumn = (column?: Column): boolean => {
  const result = column && (!isDefined(column.groupIndex) || column.showWhenGrouped);
  return !!result;
};
