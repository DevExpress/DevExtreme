import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { isColumnExcluded } from '@ts/grids/grid_core/filter/utils';

const allowFilterRowFiltering = (column: Column): boolean => !!(
  column.allowFiltering
  && column.calculateFilterExpression
  && column.createFilterExpression
);

export const createFilterRowExpression = (column: Column): DataFilter => {
  const selectedFilterOperation = column.selectedFilterOperation
    || column.defaultFilterOperation;

  return column.createFilterExpression?.(column.filterValue, selectedFilterOperation, 'filterRow');
};

export const createFilterRowExpressions = (
  columns: Column[],
  excludedColumn: Column | null,
): DataFilter[] => columns
  .filter((column) => allowFilterRowFiltering(column)
    && isDefined(column.filterValue)
    && !isColumnExcluded(column, excludedColumn))
  .map(createFilterRowExpression);
