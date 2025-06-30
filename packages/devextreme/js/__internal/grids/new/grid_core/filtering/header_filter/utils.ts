import type { FilterType } from '@js/common/grids';
import errors from '@js/core/errors';
import { isDefined } from '@js/core/utils/type';
import filterUtils from '@js/ui/shared/filtering';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';

import type { FilterValue } from '../types';
import type { HeaderFilterInfo, HeaderFilterRootOptions, HeaderFilterValuesType } from './types';

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

export const isColumnFilterable = (column: Column): boolean => isFilteringAllowed(column);

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

// NOTE: Logic from util function grid_core/filter/m_filter_sync "getConditionFromHeaderFilter"
export const getHeaderFilterValuesType = (
  column: Column,
): HeaderFilterValuesType => {
  const { filterValues } = column;

  // NOTE: if empty or an empty array
  if (!filterValues?.length) {
    return 'empty';
  }

  const [firstFilterItem] = filterValues;
  const hasGroupInterval = !!filterUtils.getGroupInterval(column);
  const hasCustomDataSource = !!column.headerFilter?.dataSource;

  const isSingleValue = filterValues.length === 1
    && !Array.isArray(firstFilterItem)
    // NOTE: "canSyncHeaderFilterWithFilterRow" logic part
    && (
      (!hasGroupInterval && !hasCustomDataSource)
      || (filterValues.length === 1 && firstFilterItem === null)
    );

  return isSingleValue
    ? 'single-value'
    : 'values-or-condition';
};

export const getHeaderFilterInfo = (
  column: Column,
): HeaderFilterInfo | null => {
  if (!isFilteringAllowed(column)) {
    return null;
  }

  const columnId = getColumnIdentifier(column);
  const headerFilterValueType = getHeaderFilterValuesType(column);

  if (headerFilterValueType === 'empty') {
    return {
      type: 'empty',
      columnId,
      filterType: 'include',
      filterValues: [],
      composedFilterValues: [],
    };
  }

  const { filterType, filterValues } = column;
  const normalizedFilterType = filterType ?? 'include';
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

  const composedFilterValues = gridCoreUtils.combineFilters(
    [...filterExpression, ...filterValuesWithExpressions],
    'or',
  );

  return {
    type: headerFilterValueType,
    columnId,
    filterType: normalizedFilterType,
    filterValues,
    composedFilterValues,
  };
};

export const getHeaderFilterInfoArray = (
  columns: Column[],
): HeaderFilterInfo[] => columns
  .map((column) => getHeaderFilterInfo(column))
  .filter((info): info is HeaderFilterInfo => !!info);

export const getComposedHeaderFilter = (
  headerFilterInfoArray: HeaderFilterInfo[],
): FilterValue => headerFilterInfoArray
  // NOTE: Exclude empty header filters from the composed header filter value
  .filter(({ type }) => type !== 'empty')
  .reduce<FilterValue>((
    result,
    { composedFilterValues },
    idx,
    infoArray,
  ) => {
    result.push(composedFilterValues);

    if (idx < infoArray.length - 1) {
      result.push('and');
    }

    return result;
  }, []);
