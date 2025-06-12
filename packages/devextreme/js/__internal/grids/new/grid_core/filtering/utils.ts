import type { FilterDescriptor } from '@js/data';
import { isString } from '@ts/core/utils/m_type';
import { getFilterExpression } from '@ts/filter_builder/m_utils';

import type { Column } from '../columns_controller/types';
import { addDataFieldToComputedColumns } from '../columns_controller/utils';
import type { AppliedFilters } from './types';

export const getAppliedFilterExpressions = (
  appliedFilters: AppliedFilters,
  columns: Column[],
  customOperations: unknown[],
  filterSyncEnabled: boolean,
): unknown[] => {
  const filters = [
    getFilterExpression(appliedFilters.filterPanel, addDataFieldToComputedColumns(columns), customOperations, 'filterBuilder'),
    // Note: Search filters do not contain filter expressions
    appliedFilters.search,
  ];

  if (!filterSyncEnabled) {
    filters.push(getFilterExpression(appliedFilters.headerFilter, addDataFieldToComputedColumns(columns), customOperations, 'headerFilter'));
  }

  return filters.filter((filter) => filter);
};

export const normalizeFilterWithSelectors = (
  filter: FilterDescriptor,
  columns: Column[],
  remoteFiltering: boolean,
): FilterDescriptor => {
  if (!Array.isArray(filter)) return filter;

  const resultFilter = [...filter];

  if (isString(resultFilter[0]) && resultFilter[0] !== '!') {
    const column = columns.find((c) => (c.dataField ?? c.name) === resultFilter[0]);

    if (column && !remoteFiltering) {
      resultFilter[0] = column.calculateFieldValue.bind(column);
    }
  }

  for (let i = 0; i < resultFilter.length; i += 1) {
    resultFilter[i] = normalizeFilterWithSelectors(resultFilter[i], columns, remoteFiltering);
  }

  return resultFilter;
};
