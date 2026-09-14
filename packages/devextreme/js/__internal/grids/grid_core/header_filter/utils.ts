import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import { isColumnExcluded } from '@ts/grids/grid_core/filter/utils';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

export const allowHeaderFiltering = (
  column: Column,
): boolean | undefined => column.allowHeaderFiltering ?? column.allowFiltering;

export function invertFilterExpression(filter: DataFilter): DataFilter {
  return ['!', filter] as DataFilter;
}

const allowHeaderFilterExpression = (column: Column): boolean => !!(
  allowHeaderFiltering(column) && column.calculateFilterExpression
);

const hasHeaderFilterValues = (
  column: Column,
): boolean => Array.isArray(column.filterValues) && column.filterValues.length > 0;

const needDeserializeValue = (column: Column): boolean => !!column.deserializeValue
  && !gridCoreUtils.isDateType(column.dataType)
  && column.dataType !== 'number';

const withColumnIndex = (filter: DataFilter, columnIndex: number | undefined): DataFilter => {
  if (filter) {
    (filter as { columnIndex?: number }).columnIndex = columnIndex;
  }

  return filter;
};

const createValueExpression = (column: Column, filterValue: unknown): DataFilter => {
  if (Array.isArray(filterValue)) {
    return filterValue as DataFilter;
  }

  const value = needDeserializeValue(column)
    ? column.deserializeValue?.(filterValue)
    : filterValue;

  return column.createFilterExpression?.(value, '=', 'headerFilter');
};

export const createHeaderFilterExpression = (column: Column): DataFilter => {
  const valueExpressions = (column.filterValues ?? []).map(
    (filterValue) => withColumnIndex(createValueExpression(column, filterValue), column.index),
  );
  const columnFilter = gridCoreUtils.combineFilters(valueExpressions, 'or');

  return column.filterType === 'exclude'
    ? invertFilterExpression(columnFilter)
    : columnFilter;
};

export const createHeaderFilterExpressions = (
  columns: Column[],
  excludedColumn: Column | null,
): DataFilter[] => columns
  .filter((column) => allowHeaderFilterExpression(column)
    && hasHeaderFilterValues(column)
    && !isColumnExcluded(column, excludedColumn))
  .map((column) => createHeaderFilterExpression(column));
