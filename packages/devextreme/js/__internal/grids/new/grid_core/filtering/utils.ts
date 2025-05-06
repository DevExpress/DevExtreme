import { getFilterExpression } from '@ts/filter_builder/m_utils';

import type { Column } from '../columns_controller/types';
import type { AppliedFilters } from './types';

export const getAppliedFilterExpressions = (
  appliedFilters: AppliedFilters,
  columns: Column[],
  customOperations: unknown[],

): unknown[] => [
  getFilterExpression(appliedFilters.filterPanel, columns, customOperations, 'filterBuilder'),
  getFilterExpression(appliedFilters.headerFilter, columns, customOperations, 'filterBuilder'),
  // Note: Search filters do not contain filter expressions
  appliedFilters.search,
].filter((filter) => filter);
