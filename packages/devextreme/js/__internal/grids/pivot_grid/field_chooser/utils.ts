import type { SortOrderType } from './const';
import { SORT_ORDER } from './const';

export const reverseSortOrder = (
  sortOrder: SortOrderType,
): SortOrderType => (sortOrder === SORT_ORDER.descending
  ? SORT_ORDER.ascending
  : SORT_ORDER.descending);

export const shouldCancelDragging = (
  field: { isMeasure?: boolean } | undefined,
  targetGroup: string,
): boolean => {
  if (!field) {
    return false;
  }

  if (field.isMeasure === true) {
    return targetGroup === 'column' || targetGroup === 'row' || targetGroup === 'filter';
  }

  if (field.isMeasure === false && targetGroup === 'data') {
    return true;
  }

  return false;
};
