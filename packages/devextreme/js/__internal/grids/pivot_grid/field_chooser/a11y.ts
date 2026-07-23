import messageLocalization from '@js/common/core/localization/message';

import type { SortOrderType } from './const';
import { SORT_ORDER } from './const';

const I18N_KEYS = {
  fieldLabel: 'dxPivotGrid-ariaFieldLabel',
  hasHeaderFilter: 'dxPivotGrid-ariaFieldHeaderFilterLabel',
  sortingAsc: 'dxPivotGrid-ariaFieldSortAscLabel',
  sortingDesc: 'dxPivotGrid-ariaFieldSortDescLabel',
  fieldsAreaDescription: 'dxPivotGrid-ariaFieldsAreaDescription',
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

export const getFieldsAreaA11yDescription = (): string => messageLocalization
  .format(I18N_KEYS.fieldsAreaDescription);

// The keyboard instructions are folded into the area's aria-label rather than
// exposed via aria-description: aria-description is an ARIA 1.3 draft attribute
// that screen readers do not read reliably, whereas the label composition
// mirrors how DataGrid/TreeList surface such instructions.
export const getFieldsAreaA11yLabel = (areaLabel: string): string => `${areaLabel}. ${getFieldsAreaA11yDescription()}`;

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
