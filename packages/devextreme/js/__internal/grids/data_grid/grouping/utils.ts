import { errors as dataErrors } from '@js/common/data/errors';
import storeHelper from '@js/common/data/store_helper';
import { keysEqual, normalizeSortingInfo } from '@js/common/data/utils';
import { toComparable } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { SortingInfo, SortingSelector } from '@ts/data/utils';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { LoadOperation, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';
import type { RowKey } from '@ts/grids/grid_core/types';

import dataGridCore from '../core';
import type {
  DataItem,
  ExpandedGroupsInfo,
  GroupInfo,
  GroupInfoData,
  GroupInfoLevel,
  GroupItem,
  GroupItemData,
  GroupItemsPosition,
  GroupItemsProcessingState,
  GroupPagingOptions,
} from './types';

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

export function getGroupColumnIndices(
  oldItem: ProcessedItem,
  newItem: ProcessedItem,
): number[] | undefined {
  const isSameState = isSameExpandedState(oldItem, newItem)
    && isSameContinuationState(oldItem, newItem);

  if (!oldItem.cells || !isSameState) {
    return undefined;
  }

  return oldItem.cells
    .map((cell, index) => (cell.column?.type !== 'groupExpand' ? index : -1))
    .filter((index) => index >= 0);
}

function createNullOrBooleanKeyFilters(
  selector: SortingSelector | undefined,
  key: boolean | null,
  desc: boolean,
): unknown[] {
  if (key === false) {
    return [[selector, '=', desc ? true : null]];
  }
  if (key ? !desc : desc) {
    return [[selector, '<>', key]];
  }
  return [[selector, '<>', null], [selector, '=', null]];
}

export function createOffsetFilter(
  path: unknown[],
  storeLoadOptions: StoreLoadOptions,
  lastLevelOnly?: boolean,
): DataFilter {
  const groups = normalizeSortingInfo(storeLoadOptions.group);
  const filters: DataFilter[] = [];

  for (let i = lastLevelOnly ? path.length - 1 : 0; i < path.length; i += 1) {
    const filterElement: unknown[] = [];
    for (let j = 0; j <= i; j += 1) {
      const { selector, desc } = groups[j];
      const key = path[j];
      const isLastLevel = i === j;
      const isNullOrBooleanKey = key === null || key === false || key === true;
      if (isLastLevel && isNullOrBooleanKey) {
        filterElement.push(...createNullOrBooleanKeyFilters(selector, key, desc));
      } else {
        const lastLevelOperation = desc ? '>' : '<';
        const operation = isLastLevel ? lastLevelOperation : '=';
        const currentFilter = [selector, operation, key];
        filterElement.push(
          operation === '<' ? [currentFilter, 'or', [selector, '=', null]] : currentFilter,
        );
      }
    }
    filters.push(combineFilters(filterElement));
  }

  const filter = combineFilters(filters, 'or');

  return combineFilters([filter, storeLoadOptions.filter]);
}

export function createNotGroupFilter(
  path: unknown[],
  storeLoadOptions: StoreLoadOptions,
  group: StoreLoadOptions['group'],
): DataFilter {
  const groups = dataGridCore.normalizeSortingInfo(group || storeLoadOptions.group);
  const filters: DataFilter[] = [];

  for (let i = 0; i < path.length; i += 1) {
    const filterElement: unknown[] = [];
    for (let j = 0; j <= i; j += 1) {
      filterElement.push([groups[j].selector, i === j ? '<>' : '=', path[j]]);
    }
    filters.push(combineFilters(filterElement));
  }
  const filter = combineFilters(filters, 'or');

  return combineFilters([filter, storeLoadOptions.filter]);
}

export function removeGroupLoadOption(
  storeLoadOptions: StoreLoadOptions,
  loadOptions: StoreLoadOptions,
): void {
  if (loadOptions.group) {
    const groups = dataGridCore.normalizeSortingInfo(loadOptions.group);
    const sorts = dataGridCore.normalizeSortingInfo(storeLoadOptions.sort);
    // @ts-expect-error arrangeSortingInfo() types selector wider than public KeySelector
    storeLoadOptions.sort = storeHelper.arrangeSortingInfo(groups, sorts);
    delete loadOptions.group;
  }
}

export function findGroupInfoByKey(
  groupsInfo: GroupInfoLevel,
  key: RowKey,
): GroupInfo | undefined {
  const { hash } = groupsInfo;

  return hash?.[JSON.stringify(key)];
}

export function getGroupInfoIndexByOffset(groupsInfo: GroupInfoLevel, offset: number): number {
  let leftIndex = 0;
  let rightIndex = groupsInfo.length - 1;

  if (!groupsInfo.length) {
    return 0;
  }

  do {
    const middleIndex = Math.floor((rightIndex + leftIndex) / 2);
    if (groupsInfo[middleIndex].offset > offset) {
      rightIndex = middleIndex;
    } else {
      leftIndex = middleIndex;
    }
  } while (rightIndex - leftIndex > 1);

  let index = leftIndex;
  for (; index <= rightIndex; index += 1) {
    if (groupsInfo[index].offset > offset) {
      break;
    }
  }
  return index;
}

export function cleanGroupsInfo(
  groupsInfo: GroupInfoLevel,
  groupIndex: number,
  groupsCount: number,
): void {
  for (const groupInfo of groupsInfo) {
    if (groupIndex + 1 >= groupsCount) {
      groupInfo.children = [];
    } else {
      cleanGroupsInfo(groupInfo.children, groupIndex + 1, groupsCount);
    }
  }
}

export function pathEquals(path1: unknown[], path2: unknown[]): boolean {
  if (path1.length !== path2.length) return false;
  for (let i = 0; i < path1.length; i += 1) {
    if (!keysEqual(null, path1[i], path2[i])) {
      return false;
    }
  }
  return true;
}

export function isGroupItem(item: DataItem): item is GroupItemData {
  return 'key' in item && item.items !== undefined;
}

export function getGroupCount(item: GroupItemData, groupCount: number): number {
  if (item.count) {
    return item.count;
  }

  const items = item.items ?? [];

  if (groupCount <= 1) {
    return items.length;
  }

  let count = 0;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- store items may be non-array
  for (let i = 0; i < items.length; i += 1) {
    count += getGroupCount(items[i], groupCount - 1);
  }

  return count;
}

export function appendCollapsedPath(
  data: GroupItemData[] | null,
  path: unknown[],
  levelGroups: SortingInfo[],
  collapsedGroup: GroupInfoData,
  offset: number,
): void {
  if (!data || !path.length || !levelGroups.length) return;

  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the loop
  let keyValue: unknown;
  let i = 0;
  let currentOffset = offset;
  const pathValue = toComparable(path[0], true);

  for (; i < data.length; i += 1) {
    keyValue = toComparable(data[i].key, true);
    if (currentOffset >= collapsedGroup.offset || pathValue === keyValue) {
      break;
    } else {
      currentOffset += getGroupCount(data[i], levelGroups.length);
    }
  }

  if (!data.length || pathValue !== keyValue) {
    data.splice(i, 0, {
      key: path[0],
      items: [],
      count: path.length === 1 ? collapsedGroup.count : undefined,
    });
  }
  appendCollapsedPath(
    data[i].items,
    path.slice(1),
    levelGroups.slice(1),
    collapsedGroup,
    currentOffset,
  );
}

export function processCollapsedGroupItem(
  item: GroupItemData,
  count: number,
  state: GroupItemsProcessingState,
): void {
  item.collapsedItems = item.items;
  item.items = null;
  state.offset += count;
  state.take -= 1;
  if (state.take < 0) {
    state.removeLastItemsCount += 1;
  }
  if (state.skipFirstItem) {
    state.needRemoveFirstItem = true;
  }
}

export function processExpandedGroupItem(
  item: GroupItemData,
  childItems: GroupItemData[],
  childItemsPosition: GroupItemsPosition,
  state: GroupItemsProcessingState,
): void {
  if (state.skipFirstItem) {
    if (childItemsPosition.offset - state.offset > 1) {
      item.isContinuation = true;
    } else {
      state.needRemoveFirstItem = true;
    }
  }
  state.offset = childItemsPosition.offset;
  state.take = childItemsPosition.take;
  if (state.take < 0) {
    if (childItems.length) {
      item.isContinuationOnNextPage = true;
    } else {
      state.removeLastItemsCount += 1;
    }
  }
}

export function getGroupLevelCount(group: StoreLoadOptions['group']): number {
  return Array.isArray(group) ? group.length : 0;
}

export function getContinuationGroupCount(
  groupOffset: number,
  pageSize: number,
  groupSize: number,
  groupIndex = 0,
): number {
  if (pageSize > 1 && groupSize > 0) {
    let pageOffset = (groupOffset - Math.floor(groupOffset / pageSize) * pageSize) || pageSize;
    pageOffset += groupSize - groupIndex - 2;
    if (pageOffset < 0) {
      pageOffset += pageSize;
    }
    return Math.floor(pageOffset / (pageSize - groupIndex - 1));
  }
  return 0;
}

export function createExpandedGroupsInfo(): ExpandedGroupsInfo {
  return {
    items: [],
    paths: [],
    count: 0,
    lastCount: 0,
  };
}

export function isGroupExpanded(groups: StoreLoadOptions['group'], groupIndex: number): boolean {
  if (!Array.isArray(groups)) {
    return false;
  }
  const group = groups[groupIndex];
  return !!group && typeof group === 'object' && !!group.isExpanded;
}

export function getTotalOffset(
  groupInfos: GroupInfoData[],
  pageSize: number,
  offset: number,
): number {
  let totalOffset = offset;

  for (let groupIndex = 0; groupIndex < groupInfos.length; groupIndex += 1) {
    let groupSize = groupInfos[groupIndex].offset + 1;
    if (groupIndex > 0) {
      groupSize += groupInfos[groupIndex - 1].childrenTotalCount ?? 0;
      if (pageSize) {
        groupSize += getContinuationGroupCount(totalOffset, pageSize, groupSize, groupIndex - 1)
          * groupIndex;
      }
    }
    totalOffset += groupSize;
  }

  return totalOffset;
}

export function applyContinuationToGroupItem(
  options: GroupPagingOptions,
  expandedInfo: ExpandedGroupsInfo,
  groupLevel: number,
  expandedItemIndex: number,
): void {
  const item = expandedInfo.items[expandedItemIndex];
  const skip = options.skips?.[groupLevel];
  const take = options.takes?.[groupLevel];
  const isLastExpandedItem = expandedItemIndex === expandedInfo.items.length - 1;
  const isFirstExpandedItem = expandedItemIndex === 0;
  const lastExpandedItemSkip = (isFirstExpandedItem && skip) || 0;
  const isItemsTruncatedByTake = Number(item.count) > Number(take) + lastExpandedItemSkip;

  if (isFirstExpandedItem && skip !== undefined) {
    item.isContinuation = true;
  }

  if (isLastExpandedItem && take !== undefined && isItemsTruncatedByTake) {
    item.isContinuationOnNextPage = true;
  }
}

export function fillSkipTakeInExpandedInfo(
  options: GroupPagingOptions & Pick<LoadOperation, 'group'>,
  expandedInfo: ExpandedGroupsInfo,
  currentGroupCount: number,
): void {
  const currentGroupIndex = currentGroupCount - 1;
  const groupCount = getGroupLevelCount(options.group);
  const take = options.takes?.[currentGroupIndex];

  expandedInfo.skip = options.skips?.[currentGroupIndex];
  if (take !== undefined) {
    if (groupCount === currentGroupCount) {
      expandedInfo.take = expandedInfo.count ? expandedInfo.count - (expandedInfo.skip || 0) : 0;
    } else {
      expandedInfo.take = 0;
    }
    expandedInfo.take += take;
  }
}

export function isDataDeferred(
  data: LoadOperation['data'],
): data is DeferredObj<RawItemData[]> | undefined {
  return !Array.isArray(data);
}

export function makeDataDeferred(options: LoadOperation): DeferredObj<RawItemData[]> | undefined {
  if (!isDataDeferred(options.data)) {
    options.data = Deferred<RawItemData[]>();
  }
  return options.data;
}

export function getLoadedGroupItems(options: Pick<LoadOperation, 'data'>): GroupItemData[] {
  // @ts-expect-error grouped load results hold group items
  return options.data;
}

export function loadGroupTotalCount(
  dataSourceAdapter: DataSourceAdapter,
  options: StoreLoadOptions,
): DeferredObj<number> {
  const d = Deferred<number>();
  const isGrouping = getGroupLevelCount(options.group) > 0;
  // @ts-expect-error StoreLoadOptions.group is typed without null
  const loadOptions: StoreLoadOptions = extend({
    skip: 0, take: 1, requireGroupCount: isGrouping, requireTotalCount: !isGrouping,
  }, options, { group: isGrouping ? options.group : null });

  dataSourceAdapter.customLoader.load(loadOptions).done(({ extra }) => {
    const count = extra && (isGrouping ? extra.groupCount : extra.totalCount);

    if (count === undefined || !isFinite(count)) {
      // @ts-expect-error badly typed Deferred.reject
      d.reject(dataErrors.Error(isGrouping ? 'E4022' : 'E4021'));
      return;
    }
    d.resolve(count);
  }).fail((...args: unknown[]) => {
    // @ts-expect-error badly typed Deferred.reject
    d.reject(...args);
  });
  return d;
}

export function processDataItem(state: GroupItemsProcessingState): void {
  if (state.skipFirstItem) {
    state.needRemoveFirstItem = true;
  }
  state.offset += 1;
  state.take -= 1;
  if (state.take < 0) {
    state.removeLastItemsCount += 1;
  }
}
