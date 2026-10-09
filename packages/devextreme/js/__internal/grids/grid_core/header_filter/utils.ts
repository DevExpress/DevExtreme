import type { HeaderFilterGroupInterval } from '@js/common/grids';
import { each } from '@js/core/utils/iterator';
import { isDefined, isString } from '@js/core/utils/type';
import sharedFiltering from '@js/ui/shared/filtering';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { combineFilters, isColumnExcluded } from '@ts/grids/grid_core/filter/utils';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import type { EmptyDateValue, HeaderFilterGroup, HeaderFilterGroupItem } from './types';

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

const createHeaderFilterExpression = (column: Column): DataFilter => {
  const valueExpressions = (column.filterValues ?? []).map(
    (filterValue) => withColumnIndex(createValueExpression(column, filterValue), column.index),
  );
  const columnFilter = combineFilters(valueExpressions, 'or');

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
  .map(createHeaderFilterExpression);

const DATE_INTERVAL_SELECTORS = {
  year(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && value.getFullYear();
  },
  month(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && (value.getMonth() + 1);
  },
  day(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && value.getDate();
  },
  quarter(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && (Math.floor(value.getMonth() / 3) + 1);
  },
  hour(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && value.getHours();
  },
  minute(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && value.getMinutes();
  },
  second(value: Date | EmptyDateValue): number | EmptyDateValue {
    return value && value.getSeconds();
  },
};

const getIntervalSelector = function getIntervalSelector(
  this: Column & Required<Pick<Column, 'calculateCellValue'>>,
  interval: HeaderFilterGroupInterval | number,
  data: unknown,
): number | EmptyDateValue | null | undefined {
  const value = this.calculateCellValue(data);

  if (!isDefined(value)) {
    return null;
  }

  if (gridCoreUtils.isDateType(this.dataType) && isString(interval)) {
    return DATE_INTERVAL_SELECTORS[interval](value);
  }

  if (this.dataType === 'number') {
    const groupInterval = Number(interval);
    return Math.floor(Number(value) / groupInterval) * groupInterval;
  }

  return undefined;
};

export function getHeaderFilterGroupParameters(
  column: Column & Required<Pick<Column, 'calculateCellValue'>>,
  remoteGrouping?: boolean,
): HeaderFilterGroup {
  const dataField = column.dataField || column.name;
  const groupInterval = sharedFiltering.getGroupInterval(column);

  if (groupInterval) {
    const result: HeaderFilterGroupItem[] = [];

    each(groupInterval, (index, interval) => {
      result.push(remoteGrouping ? {
        selector: dataField,
        groupInterval: interval,
        isExpanded: index < groupInterval.length - 1,
        // @ts-ignore
      } : getIntervalSelector.bind(column, interval));
    });

    return result;
  }

  if (remoteGrouping) {
    return [{ selector: dataField, isExpanded: false }];
  }

  const selector = (data: unknown): unknown => {
    let value = column.calculateCellValue(data);

    if (value === undefined || value === '') {
      value = null;
    }
    return value;
  };

  if (column.sortingMethod) {
    return [{ selector, compare: column.sortingMethod.bind(column) }];
  }

  return selector;
}
