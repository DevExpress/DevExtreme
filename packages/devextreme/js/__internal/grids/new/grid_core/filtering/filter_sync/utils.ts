import type { FilterType } from '@js/common/grids';
// 🚨🚨🚨 Complex utils functions from grid_core used here for merging filters
// TODO filterSync: move these utils to the new grid_core
import { removeFieldConditionsFromFilter, syncFilters } from '@ts/filter_builder/m_utils';
import type { HeaderFilterInfo } from '@ts/grids/new/grid_core/filtering/header_filter/types';

import type { FilterValue } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFilterValues = (filterConditions: FilterValue): any[] | undefined => {
  if (filterConditions.length !== 1) {
    return undefined;
  }

  const filterCondition = filterConditions[0];
  if (!filterCondition) {
    return undefined;
  }

  const value = filterCondition[2];
  const hasArrayValue = Array.isArray(value);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return hasArrayValue ? value : [value];
};

export const getFilterType = (filterConditions: FilterValue): FilterType | undefined => {
  if (filterConditions.length !== 1) {
    return undefined;
  }

  const filterCondition = filterConditions[0];

  if (!filterCondition) {
    return undefined;
  }
  const selectedFilterOperation = filterCondition[1];
  switch (selectedFilterOperation) {
    case 'anyof':
    case '=':
      return 'include';
    case 'noneof':
    case '<>':
      return 'exclude';
    default: return undefined;
  }
};

// NOTE: Logic from util function grid_core/filter/m_filter_sync "getConditionFromHeaderFilter"
export const getConditionFromHeaderFilter = ({
  type,
  columnId,
  filterType,
  filterValues,
}: HeaderFilterInfo): FilterValue | null => {
  const [firstFilterItem] = filterValues;

  switch (true) {
    case type === 'single-value' && filterType === 'exclude':
      return [columnId, '<>', firstFilterItem];
    case type === 'single-value' && filterType === 'include':
      return [columnId, '=', firstFilterItem];
    case type === 'values-or-condition' && filterType === 'exclude':
      return [columnId, 'noneof', filterValues];
    case type === 'values-or-condition' && filterType === 'include':
      return [columnId, 'anyof', filterValues];
    case type === 'empty':
    default:
      return null;
  }
};

// 🚨🚨🚨 Complex utils functions from grid_core used here for merging filters
// TODO filterSync: move these utils to the new grid_core
export const mergeFilterPanelWithHeaderFilterValues = (
  filterPanelValue: FilterValue,
  headerFilterInfoArray: HeaderFilterInfo[],
): FilterValue => headerFilterInfoArray
  .reduce<FilterValue>(
    (
      result,
      info,
    ) => {
      const value = getConditionFromHeaderFilter(info);
      return value
        ? syncFilters(result, value) as FilterValue
        : removeFieldConditionsFromFilter(result, info.columnId) as FilterValue;
    },
    filterPanelValue,
  );
