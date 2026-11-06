import type { ScalarFilterValue } from '@js/common/grids';
import dateSerialization from '@js/core/utils/date_serialization';
import { isDate } from '@js/core/utils/type';

import type { RawItemData } from '../data_source_adapter/types';
import type { SortFilterValue, SortFilterValueOptions, ValueGetter } from './types';

export const getSortFilterValue = (
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
