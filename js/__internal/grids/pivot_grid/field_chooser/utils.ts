import { SortOrder } from './const';

export const reverseSortOrder = (
  sortOrder: SortOrder,
): SortOrder => (sortOrder === SortOrder.descending
  ? SortOrder.ascending
  : SortOrder.descending);
