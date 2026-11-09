import type { ScalarFilterValue } from '@js/common/grids';
import dateSerialization from '@js/core/utils/date_serialization';
import { isBoolean, isDate } from '@js/core/utils/type';
import type { ColumnDataSourceParameter } from '@ts/grids/grid_core/columns_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type {
  BinaryDataFilterExpression,
  DataFilterExpression,
  DataFilterPredicate,
  DataFilterSelector,
} from '@ts/grids/grid_core/filter/types';

import type {
  OperationFilterOptions,
  SortFilterValue,
  SortFilterValueOptions,
  ValueGetter,
} from './types';

const getSortFilterValue = (
  selector: string | ValueGetter,
  rowData: RawItemData,
  {
    isRemoteFiltering,
    dateSerializationFormat,
    getSelector,
  }: SortFilterValueOptions,
): SortFilterValue => {
  const getter: ValueGetter = typeof selector === 'function'
    ? selector
    : getSelector(selector) ?? ((data): unknown => data[selector]);
  const rawValue = getter(rowData);

  // @ts-expect-error row data is untyped
  const safeValue: ScalarFilterValue = isRemoteFiltering && isDate(rawValue)
    ? dateSerialization.serializeDate(rawValue, dateSerializationFormat)
    : rawValue;

  return {
    getter,
    rawValue,
    safeValue,
  };
};

const generateBooleanFilter = (
  selector: DataFilterSelector,
  value: ScalarFilterValue,
  desc: boolean,
): BinaryDataFilterExpression | undefined => {
  switch (true) {
    case value === false && desc:
      return [selector, '=', true];
    case value === false && !desc:
      return [selector, '=', null];
    case value === true && !desc:
    case !isBoolean(value) && desc:
      return [selector, '<>', value];
    default:
      return undefined;
  }
};

const generateSortFilter = (
  selector: string | ValueGetter,
  { desc, compare }: ColumnDataSourceParameter,
  { getter, rawValue, safeValue }: SortFilterValue,
  isRemoteSorting: boolean,
): DataFilterExpression | DataFilterPredicate => {
  if (compare && !isRemoteSorting) {
    return (data: RawItemData): boolean => (desc
      ? compare(rawValue, getter(data)) <= -1
      : compare(rawValue, getter(data)) >= 1);
  }

  const filter: DataFilterExpression = [selector, desc ? '>' : '<', safeValue];

  return desc ? filter : [filter, 'or', [selector, '=', null]];
};

export const generateOperationFilterByKey = (
  keyFilter: DataFilterExpression,
  rowData: RawItemData,
  sort: ColumnDataSourceParameter[] | null,
  options: OperationFilterOptions,
): DataFilterExpression => {
  if (!sort) {
    return keyFilter;
  }

  const { isRemoteSorting } = options;

  return sort.reduceRight<DataFilterExpression>((filter, sortInfo) => {
    const { selector, desc } = sortInfo;

    if (!selector) {
      return filter;
    }

    const sortValue = getSortFilterValue(selector, rowData, options);
    const { rawValue, safeValue } = sortValue;
    const sameValueFilter: DataFilterExpression = [[selector, '=', safeValue], 'and', filter];

    if (rawValue === null || isBoolean(rawValue)) {
      const booleanFilter = generateBooleanFilter(selector, safeValue, desc);

      return booleanFilter ? [booleanFilter, 'or', sameValueFilter] : sameValueFilter;
    }

    const sortFilter = generateSortFilter(selector, sortInfo, sortValue, isRemoteSorting);

    return [sortFilter, 'or', sameValueFilter];
  }, keyFilter);
};
