import type { FilterType } from '@js/common/grids';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFilterValues = (filterConditions: unknown[]): any[] | undefined => {
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

export const getFilterType = (filterConditions: unknown[]): FilterType => {
  if (filterConditions.length !== 1) {
    return 'include';
  }

  const filterCondition = filterConditions[0];

  if (!filterCondition) {
    return 'include';
  }
  const selectedFilterOperation = filterConditions[1];
  switch (selectedFilterOperation) {
    case 'noneof':
    case '<>':
      return 'exclude';
    default: return 'include';
  }
};
