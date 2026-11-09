import { normalizeSortingInfo } from '@js/common/data/utils';
import type { ScalarFilterValue } from '@js/common/grids';
import { isDefined } from '@ts/core/utils/type';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { DataFilter, DataFilterSelector } from '@ts/grids/grid_core/filter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';

import type { Column } from './types';

export function createGroupFilter(
  path: unknown[],
  storeLoadOptions: Pick<StoreLoadOptions, 'group' | 'filter'>,
): DataFilter {
  const groups = normalizeSortingInfo(storeLoadOptions.group);

  const filter: DataFilter[] = [];

  for (let i = 0; i < path.length; i += 1) {
    // @ts-expect-error normalizeSortingInfo types selectors loosely
    const groupSelector: DataFilterSelector = groups[i].selector;
    // @ts-expect-error group keys are untyped
    const groupKey: ScalarFilterValue = path[i];

    filter.push([groupSelector, '=', groupKey]);
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
