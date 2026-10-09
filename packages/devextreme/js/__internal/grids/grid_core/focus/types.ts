import type { Callback } from '@js/core/utils/callbacks';

import type { DataChange } from '../data_controller/types';
import type { RawItemData } from '../data_source_adapter/types';

export interface FocusDataControllerExtension {
  _updatePageIndexes: () => void;
  afterChanged: Callback<[DataChange]>;
  getLastChange: () => DataChange | undefined;
}

export type ValueGetter = (data: RawItemData) => unknown;

export interface SortFilterValueOptions {
  isRemoteFiltering: boolean;
  dateSerializationFormat: string | undefined;
  getSelector: (selector: string) => ValueGetter | undefined;
}

export interface SortFilterValue {
  getter: ValueGetter;
  rawValue: unknown;
  safeValue: unknown;
}
