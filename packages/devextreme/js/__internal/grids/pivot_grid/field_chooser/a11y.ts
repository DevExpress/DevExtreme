import messageLocalization from '@js/common/core/localization/message';

import type { SortOrderType } from './const';
import { SORT_ORDER } from './const';

const I18N_KEYS = {
  fieldLabel: 'dxPivotGrid-ariaFieldLabel',
  hasHeaderFilter: 'dxPivotGrid-ariaFieldHeaderFilterLabel',
  sortingAsc: 'dxPivotGrid-ariaFieldSortAscLabel',
  sortingDesc: 'dxPivotGrid-ariaFieldSortDescLabel',
};

const I18N_MESSAGE_SEPARATOR = ', ';

export interface FieldItemA11yOptions {
  sortOrder?: SortOrderType;
  hasHeaderFilterValue?: boolean;
}

const getSortingLabel = (sortOrder?: SortOrderType): string | null => {
  switch (sortOrder) {
    case SORT_ORDER.ascending:
      return messageLocalization.format(I18N_KEYS.sortingAsc);
    case SORT_ORDER.descending:
      return messageLocalization.format(I18N_KEYS.sortingDesc);
    default:
      return null;
  }
};

export const getFieldItemA11yLabel = (
  caption: string,
  { sortOrder, hasHeaderFilterValue }: FieldItemA11yOptions,
): string => [
  // @ts-expect-error format typing does not accept substitution args
  messageLocalization.format(I18N_KEYS.fieldLabel, caption),
  hasHeaderFilterValue ? messageLocalization.format(I18N_KEYS.hasHeaderFilter) : null,
  getSortingLabel(sortOrder),
]
  .filter((message) => !!message)
  .join(I18N_MESSAGE_SEPARATOR);
