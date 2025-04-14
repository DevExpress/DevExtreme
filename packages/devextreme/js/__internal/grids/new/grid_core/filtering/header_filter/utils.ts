import type { FilterType } from '@js/common/grids';
import errors from '@js/core/errors';
import { isDefined } from '@js/core/utils/type';
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';

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

export const getColumnName = (column: Column): string => {
  const name = column.name ?? column.dataField;
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

export const getComposedHeaderFilter = (columns: Column[]): unknown => {
  const filterValue: unknown[] = [];
  const filterableColumns = columns
    .filter((c) => c.allowFiltering
      && c.allowHeaderFiltering
      && c.headerFilter?.values !== undefined);
  filterableColumns
    .forEach((c, index) => {
      filterValue.push([
        getColumnName(c),
        getFilterOperator(c.headerFilter?.values, c.filterType),
        c.headerFilter?.values,
      ]);
      if (index < filterableColumns.length - 1) {
        filterValue.push('and');
      }
    });
  return filterValue;
};
