import type { SortOrder } from '@js/common';

import type { Column } from '../columns_controller/types';

export function getNextSortOrder(
  currentOrder?: SortOrder,
  ctrlKey?: boolean,
): SortOrder | undefined {
  if (ctrlKey) {
    return undefined;
  }
  if (currentOrder === 'asc') {
    return 'desc';
  }
  return 'asc';
}

export function sortOrderDelegate(a: Column, b: Column): number {
  if (a.sortIndex !== undefined && b.sortIndex === undefined) {
    return -1;
  }
  if (b.sortIndex !== undefined && a.sortIndex === undefined) {
    return 1;
  }
  if (a.sortIndex !== undefined && b.sortIndex !== undefined) {
    return a.sortIndex - b.sortIndex;
  }
  if (a.sortIndex === undefined && b.sortIndex === undefined) {
    return a.visibleIndex - b.visibleIndex;
  }
  throw new Error('Invalid state');
}
