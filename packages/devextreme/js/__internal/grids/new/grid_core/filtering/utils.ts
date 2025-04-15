/* eslint-disable @typescript-eslint/no-unsafe-return */
import { getFilterExpression } from '@ts/filter_builder/m_utils';

import type { Column } from '../columns_controller/types';
import type { AppliedFilters } from './types';

export const getAppliedFilterExpressions = (
  appliedFilters: AppliedFilters,
  columns: Column[],
  customOperations: unknown[],

): unknown[] => {
  const filterExpressions = [
    appliedFilters.filterPanel,
    appliedFilters.headerFilter,
  ].map(
    (filter) => getFilterExpression(filter, columns, customOperations, 'filterBuilder'),
  );
  // Note: Search filters do not contain filter expressions
  filterExpressions.push(appliedFilters.search);
  return filterExpressions.filter((f) => f);
};
