import dateSerialization from '@js/core/utils/date_serialization';
import { isDate } from '@js/core/utils/type';
import type { OrderingDescriptor } from '@js/data/data.types';

import type { RawItemData } from '../data_source_adapter/types';

type ValueGetter = (data: RawItemData) => unknown;

interface SortFilterValueOptions {
  isRemoteFiltering: boolean;
  dateSerializationFormat: string | undefined;
  getSelector: (selector: string) => ValueGetter | undefined;
}

interface SortFilterValue {
  getter: ValueGetter;
  rawValue: unknown;
  safeValue: unknown;
}

// TODO Vinogradov: Move it to ts and cover with unit tests.
const getSortFilterValue = (
  sortInfo: OrderingDescriptor<RawItemData>,
  rowData: RawItemData,
  {
    isRemoteFiltering,
    dateSerializationFormat,
    getSelector,
  }: SortFilterValueOptions,
): SortFilterValue => {
  const { selector } = sortInfo;
  const getter: ValueGetter = typeof selector === 'function'
    ? selector
    : getSelector(selector) ?? ((data): unknown => data[selector]);
  const rawValue = getter(rowData);

  const safeValue = isRemoteFiltering && isDate(rawValue)
    ? dateSerialization.serializeDate(rawValue, dateSerializationFormat)
    : rawValue;

  return {
    getter,
    rawValue,
    safeValue,
  };
};

export const UiGridCoreFocusUtils = {
  getSortFilterValue,
};
