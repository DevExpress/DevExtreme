import type { SortOrder } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import { isDefined } from '@js/core/utils/type';

import { I18N_KEYS, I18N_MESSAGE_SEPARATOR } from './const';

interface ColumnOptions {
  hasHeaderFilterValue?: boolean;
  sortOrder?: SortOrder;
  sortIndex?: number;
}

export const getCommonA11yLabel = (
  columnName: string,
  // @ts-expect-error bad i18n types
): string => messageLocalization.format(I18N_KEYS.common, columnName);

export const getHeaderFilterA11yLabel = (
  hasHeaderFilterValue?: boolean,
): string | null => (hasHeaderFilterValue
  ? messageLocalization.format(I18N_KEYS.headerFilter)
  : null);

export const getSortingA11yLabel = (
  sortOrder?: SortOrder,
): string | null => {
  switch (sortOrder) {
    case 'asc':
      return messageLocalization.format(I18N_KEYS.sortingAsc);
    case 'desc':
      return messageLocalization.format(I18N_KEYS.sortingDesc);
    default:
      return null;
  }
};

export const getSortIndexA11yLabel = (
  sortOrder?: SortOrder,
  sortIndex?: number,
): string | null => (sortOrder && isDefined(sortIndex)
  // @ts-expect-error bad i18n types
  ? messageLocalization.format(I18N_KEYS.sortIndex, sortIndex + 1)
  : null);

export const getHeaderItemA11yLabel = (
  columnName: string,
  {
    sortOrder,
    sortIndex,
    hasHeaderFilterValue,
  }: ColumnOptions,
): string => [
  getCommonA11yLabel(columnName),
  getHeaderFilterA11yLabel(hasHeaderFilterValue),
  getSortingA11yLabel(sortOrder),
  getSortIndexA11yLabel(sortOrder, sortIndex),
]
  .filter((msg) => !!msg)
  .join(I18N_MESSAGE_SEPARATOR);
