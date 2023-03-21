import { SORT_ORDER, SortOrderType } from './const';

export const reverseSortOrder = (
  sortOrder: SortOrderType,
): SortOrderType => (sortOrder === SORT_ORDER.descending
  ? SORT_ORDER.ascending
  : SORT_ORDER.descending);
