import { isDefined } from '@js/core/utils/type';
import filterUtils from '@js/ui/shared/filtering';
import errors from '@js/ui/widget/ui.errors';
import {
  getDefaultOperation,
  removeFieldConditionsFromFilter,
  syncFilters,
} from '@ts/filter_builder/m_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { FilterValue, FilterValueCondition } from '@ts/grids/grid_core/data_controller/types';

import { FILTER_ROW_OPERATIONS, FILTER_TYPES_EXCLUDE, FILTER_TYPES_INCLUDE } from './const';
import type {
  FilterRowState,
  FilterSyncColumn,
  HeaderFilterState,
} from './types';

const getFilterTypeByOperation = (operation: unknown): Column['filterType'] | undefined => {
  switch (operation) {
    case 'anyof':
    case '=':
      return FILTER_TYPES_INCLUDE;
    case 'noneof':
    case '<>':
      return FILTER_TYPES_EXCLUDE;
    default:
      return undefined;
  }
};

export const getColumnIdentifier = (
  column: FilterSyncColumn,
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
): string | undefined => column.name || column.dataField;

const canSyncHeaderFilterWithFilterRow = (column: FilterSyncColumn): boolean => {
  const { filterValues } = column;
  const isOnlyNullFilterValue = filterValues?.length === 1 && filterValues[0] === null;

  if (isOnlyNullFilterValue) {
    return true;
  }

  const hasGroupInterval = Boolean(filterUtils.getGroupInterval(column));
  const hasOwnDataSource = Boolean(column.headerFilter?.dataSource);

  return !hasGroupInterval && !hasOwnDataSource;
};

export const checkForErrors = (columns: FilterSyncColumn[]): void => {
  columns.forEach((column) => {
    if (!isDefined(getColumnIdentifier(column)) && column.allowFiltering) {
      // @ts-expect-error `errors.Error` is not declared as a constructor
      throw new errors.Error('E1049', column.caption);
    }
  });
};

export const getConditionFromFilterRow = (
  column: FilterSyncColumn,
): FilterValueCondition | null => {
  const { filterValue } = column;

  if (!isDefined(filterValue)) {
    return null;
  }

  const operation: string = column.selectedFilterOperation
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    || column.defaultFilterOperation
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    || getDefaultOperation(column);

  return [getColumnIdentifier(column) as string, operation, filterValue];
};

export const getConditionFromHeaderFilter = (
  column: FilterSyncColumn,
): FilterValueCondition | null => {
  const { filterValues } = column;

  if (!filterValues) {
    return null;
  }

  const field = getColumnIdentifier(column) as string;
  const isExcluded = column.filterType === FILTER_TYPES_EXCLUDE;
  const isSingleValue = filterValues.length === 1
    && canSyncHeaderFilterWithFilterRow(column)
    && !Array.isArray(filterValues[0]);

  if (isSingleValue) {
    return [field, isExcluded ? '<>' : '=', filterValues[0]];
  }

  return [field, isExcluded ? 'noneof' : 'anyof', filterValues];
};

const getEmptyFilterValues = (): HeaderFilterState => ({
  filterType: FILTER_TYPES_INCLUDE,
  filterValues: undefined,
});

// A short `[field, value]` condition clears the column state instead of syncing it.
// Building the data filter rewrites it in place into `[field, '=', value]` first, so it
// only reaches here when that filter is skipped, e.g. `filterPanel.filterEnabled: false`.
export const getHeaderFilterFromCondition = (
  condition: FilterValueCondition | null,
  column: FilterSyncColumn,
): HeaderFilterState => {
  if (!condition) {
    return getEmptyFilterValues();
  }

  const value = condition[2];
  const hasArrayValue = Array.isArray(value);

  if (!hasArrayValue && !canSyncHeaderFilterWithFilterRow(column)) {
    return getEmptyFilterValues();
  }

  const filterType = getFilterTypeByOperation(condition[1]);

  if (!filterType) {
    return getEmptyFilterValues();
  }

  return {
    filterType,
    filterValues: hasArrayValue ? value : [value],
  };
};

// A short `[field, value]` condition clears the column state instead of syncing it.
// Building the data filter rewrites it in place into `[field, '=', value]` first, so it
// only reaches here when that filter is skipped, e.g. `filterPanel.filterEnabled: false`.
export const getFilterRowOptionsFromCondition = (
  condition: FilterValueCondition | null,
  column: FilterSyncColumn,
): FilterRowState => {
  const operation = condition?.[1] as Column['selectedFilterOperation'];
  const filterValue = condition?.[2];
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const filterOperations = column.filterOperations || column.defaultFilterOperations;

  const selectedOperationExists = !filterOperations
    || filterOperations.includes(operation as string);
  const isDefaultOperation = operation === column.defaultFilterOperation;
  const builtInOperationSelected = FILTER_ROW_OPERATIONS.includes(operation as string);
  const filterValueNotNullOrEmpty = filterValue !== null && filterValue !== '';
  const canApplyCondition = (selectedOperationExists || isDefaultOperation)
    && builtInOperationSelected
    && filterValueNotNullOrEmpty;

  if (!canApplyCondition) {
    return {
      filterValue: undefined,
      selectedFilterOperation: undefined,
      bufferedFilterValue: undefined,
      bufferedSelectedFilterOperation: undefined,
    };
  }

  const isImplicitDefaultOperation = isDefaultOperation
    && !isDefined(column.selectedFilterOperation);
  const selectedFilterOperation = isImplicitDefaultOperation
    ? column.selectedFilterOperation
    : operation;

  return {
    filterValue,
    selectedFilterOperation,
    bufferedFilterValue: undefined,
    bufferedSelectedFilterOperation: undefined,
  };
};

export const getFilterValueWithFilterRow = (
  filterValue: FilterValue,
  column: FilterSyncColumn,
): FilterValue => {
  const condition = getConditionFromFilterRow(column);

  if (isDefined(condition)) {
    return syncFilters(filterValue, condition) as FilterValue;
  }

  return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column)) as FilterValue;
};

export const getFilterValueWithHeaderFilter = (
  filterValue: FilterValue,
  column: FilterSyncColumn,
): FilterValue => {
  const condition = getConditionFromHeaderFilter(column);

  if (condition) {
    return syncFilters(filterValue, condition) as FilterValue;
  }

  return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column)) as FilterValue;
};
