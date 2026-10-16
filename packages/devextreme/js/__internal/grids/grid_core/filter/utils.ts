import type { LangParams } from '@js/common/data';
import type { ScalarFilterValue } from '@js/common/grids';
import { toComparable } from '@js/core/utils/data';
import { isFunction } from '@js/core/utils/type';
import type { Column, ColumnSelector } from '@ts/grids/grid_core/columns_controller/types';

import type { DataFilter, FilterCombiner } from './types';

export const isColumnExcluded = (
  column: Column,
  excludedColumn: Column | null,
): boolean => !!excludedColumn && excludedColumn.index === column.index;

export function combineFilters(
  filters: unknown[],
  operation: FilterCombiner = 'and',
): DataFilter {
  const parts: unknown[] = [];

  for (const filter of filters) {
    const isMatchNothing = Array.isArray(filter) && filter.length === 1 && filter[0] === '!';

    if (isMatchNothing && operation === 'and') {
      return ['!'];
    }

    if (filter && !(isMatchNothing && operation === 'or')) {
      if (parts.length) {
        parts.push(operation);
      }
      parts.push(filter);
    }
  }

  if (!parts.length) {
    return undefined;
  }

  return (parts.length === 1 ? parts[0] : parts) as DataFilter;
}

export function equalFilterParameters(
  filter1: DataFilter | ScalarFilterValue,
  filter2: DataFilter | ScalarFilterValue,
  langParams?: LangParams,
): boolean {
  if (Array.isArray(filter1) && Array.isArray(filter2)) {
    if (filter1.length !== filter2.length) {
      return false;
    }

    for (let index = 0; index < filter1.length; index += 1) {
      if (!equalFilterParameters(filter1[index], filter2[index], langParams)) {
        return false;
      }
    }

    return true;
  }

  if (isFunction(filter1) && isFunction(filter2)) {
    const selector1 = filter1 as ColumnSelector;
    const selector2 = filter2 as ColumnSelector;

    if ((selector1.columnIndex ?? -1) >= 0 && (selector2.columnIndex ?? -1) >= 0) {
      return selector1.columnIndex === selector2.columnIndex
        && toComparable(selector1.filterValue, undefined, langParams)
          === toComparable(selector2.filterValue, undefined, langParams)
        && toComparable(selector1.selectedFilterOperation, undefined, langParams)
          === toComparable(selector2.selectedFilterOperation, undefined, langParams);
    }
  }

  const comparable1 = toComparable(filter1, undefined, langParams);
  const comparable2 = toComparable(filter2, undefined, langParams);

  // eslint-disable-next-line eqeqeq
  return comparable1 == comparable2;
}
