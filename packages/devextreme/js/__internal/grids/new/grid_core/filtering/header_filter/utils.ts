import type { FilterType } from '@js/common/grids';
import errors from '@js/core/errors';
import { isDefined } from '@js/core/utils/type';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';

import type { FilterValue } from '../types';
import type { HeaderFilterRootOptions } from './types';

export const mergeColumnHeaderFilterOptions = (
  column: Column,
  rootOptions: HeaderFilterRootOptions | undefined,
): Column => {
  const { texts, visible, ...restRootOptions } = rootOptions ?? {};

  return {
    ...column,
    allowHeaderFiltering: !!rootOptions?.visible
      && !!column?.allowFiltering
      && !!column?.allowHeaderFiltering,
    headerFilter: {
      ...restRootOptions,
      ...column?.headerFilter,
      search: {
        ...restRootOptions?.search,
        ...column?.headerFilter?.search,
      },
    },
  };
};

export const getColumnIdentifier = (column: Column): string => column.name ?? column.dataField;

export const getColumnName = (column: Column): string => {
  const name = getColumnIdentifier(column);
  if (!isDefined(name)) {
    throw errors.Error('E1049', column.caption);
  }
  return name;
};

export const getFilterOperator = (values: unknown, filterType?: FilterType): string => {
  const isInclude = !filterType || filterType === 'include';
  const isValueArray = Array.isArray(values);
  switch (true) {
    case isValueArray && isInclude:
      return 'anyof';
    case isValueArray && !isInclude:
      return 'noneof';
    case !isValueArray && isInclude:
      return '=';
    case !isValueArray && !isInclude:
      return '<>';
    default: throw new Error('Invalid state');
  }
};

const isFilteringAllowed = (column: Column): boolean => column.allowFiltering
|| column.allowHeaderFiltering;

export const isColumnFilterable = (column: Column): boolean => isFilteringAllowed(column)
&& !!column.dataField;

export const needCreateHeaderFilter = (column: Column): boolean => {
  const values = column.filterValues;
  const hasSelectedItems = isDefined(values) && values.length > 0;

  return isFilteringAllowed(column) && hasSelectedItems;
};

const getFilterExpression = (filterValues: FilterValue, column: Column): FilterValue => {
  const columnName = getColumnName(column);
  const hasGroupInterval = !!column.headerFilter?.groupInterval;

  const needNormalizeFilterValues = filterValues?.length === 1
    && !hasGroupInterval;
  const normalizedFilterValues = needNormalizeFilterValues
    ? filterValues[0]
    : filterValues;
  const filterOperator = getFilterOperator(normalizedFilterValues, column.filterType);

  return [columnName, filterOperator, normalizedFilterValues];
};

export const getComposedHeaderFilter = (columns: Column[]): FilterValue => {
  const filterValue: FilterValue = [];
  const filterableColumns = columns.filter((col) => needCreateHeaderFilter(col));

  filterableColumns.forEach((column, index) => {
    const { filterValues } = column;
    const normalizedFilterValues = Array.isArray(filterValues)
      ? filterValues
      : [filterValues];

    const filterValuesWithExpressions = normalizedFilterValues
      .filter((value) => Array.isArray(value));
    const filterValuesWithoutExpressions = normalizedFilterValues
      .filter((value) => !Array.isArray(value));

    const filterExpression = filterValuesWithoutExpressions.length
      ? [getFilterExpression(filterValuesWithoutExpressions, column)]
      : [];

    filterValue.push(gridCoreUtils.combineFilters([...filterExpression, ...filterValuesWithExpressions], 'or'));

    if (index < filterableColumns.length - 1) {
      filterValue.push('and');
    }
  });

  return filterValue;
};
