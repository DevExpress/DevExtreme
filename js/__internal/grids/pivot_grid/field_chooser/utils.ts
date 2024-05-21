import type { SortOrderType } from './const';
import { SORT_ORDER } from './const';

export const reverseSortOrder = (
  sortOrder: SortOrderType,
): SortOrderType => (sortOrder === SORT_ORDER.descending
  ? SORT_ORDER.ascending
  : SORT_ORDER.descending);
