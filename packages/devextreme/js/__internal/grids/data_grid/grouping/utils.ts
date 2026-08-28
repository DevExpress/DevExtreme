import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

export function isSameExpandedState(item1: ProcessedItem, item2: ProcessedItem): boolean {
  return item1.isExpanded === item2.isExpanded;
}

export function isSameContinuationState(item1: ProcessedItem, item2: ProcessedItem): boolean {
  return item1.data?.isContinuation === item2.data?.isContinuation
    && item1.data?.isContinuationOnNextPage === item2.data?.isContinuationOnNextPage;
}
