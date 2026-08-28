import { isDefined, isString } from '@js/core/utils/type';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { GroupItem } from './types';

export function isGroupNode(
  item: RawItemData,
): item is RawItemData & { key: unknown; items: RawItemData[] | null | undefined } {
  return 'items' in item;
}

// Also matches 'groupFooter' rows, which the summary module adds to the same stream.
export function isGroupRow(item: RawItemData | GroupItem): item is GroupItem {
  return isDefined(item.groupIndex)
    && isString(item.rowType)
    && item.rowType.startsWith('group');
}

export function isSameExpandedState(item1: ProcessedItem, item2: ProcessedItem): boolean {
  return item1.isExpanded === item2.isExpanded;
}

export function isSameContinuationState(item1: ProcessedItem, item2: ProcessedItem): boolean {
  return item1.data?.isContinuation === item2.data?.isContinuation
    && item1.data?.isContinuationOnNextPage === item2.data?.isContinuationOnNextPage;
}
