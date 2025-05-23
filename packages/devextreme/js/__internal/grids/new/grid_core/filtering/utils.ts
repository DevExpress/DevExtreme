import { getFilterExpression } from '@ts/filter_builder/m_utils';

import type { Column } from '../columns_controller/types';
import type { AppliedFilters } from './types';

export const getAppliedFilterExpressions = (
  appliedFilters: AppliedFilters,
  columns: Column[],
  customOperations: unknown[],
  filterSyncEnabled: boolean,
): unknown[] => {
  const filters = [
    getFilterExpression(appliedFilters.filterPanel, columns, customOperations, 'filterBuilder'),
    // Note: Search filters do not contain filter expressions
    appliedFilters.search,
  ];

  if (!filterSyncEnabled) {
    filters.push(getFilterExpression(appliedFilters.headerFilter, columns, customOperations, 'filterBuilder'));
  }

  return filters.filter((filter) => filter);
};
