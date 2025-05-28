import type { FilterType } from '@js/common/grids';

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
