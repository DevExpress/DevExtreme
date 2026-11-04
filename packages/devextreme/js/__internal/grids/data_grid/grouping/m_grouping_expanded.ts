import dataQuery from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { keysEqual } from '@js/common/data/utils';
import { toComparable } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { SortingInfo } from '@ts/data/utils';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { LoadOperation, OperationTypes } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';
import type { VirtualScrollingDataSourceAdapterExtension } from '@ts/grids/grid_core/virtual_scrolling/types';

import dataGridCore from '../core';
import { createGroupFilter } from '../utils';
import type { GroupingDataSourceAdapter } from './m_grouping';
import { createOffsetFilter, GroupingHelper as GroupingHelperCore } from './m_grouping_core';
import type {
  DataItem,
  ForeachGroupsCallback,
  ForeachGroupsResult,
  GroupInfoData,
  GroupingLoadOperation,
  GroupItemData,
  GroupItemsPosition,
  GroupItemsProcessingState,
} from './types';

const loadTotalCount = function loadTotalCount(
  dataSourceAdapter: DataSourceAdapter,
  options: StoreLoadOptions,
): DeferredObj<number> {
  const d = Deferred<number>();
  const loadOptions = extend({ skip: 0, take: 1, requireTotalCount: true }, options);

  dataSourceAdapter.customLoader.load(loadOptions)
    .done(({ extra }) => {
      // @ts-expect-error extra is loaded with requireTotalCount
      d.resolve(extra.totalCount);
    })
    .fail((...args: unknown[]) => {
      // @ts-expect-error badly typed Deferred.reject
      d.reject(...args);
    });
  return d;
};

const foreachCollapsedGroups = function foreachCollapsedGroups(
  that: GroupingHelperCore,
  callback: (groupInfo: GroupInfoData) => ReturnType<ForeachGroupsCallback>,
  updateOffsets?: boolean,
): ForeachGroupsResult {
  return that.foreachGroups((groupInfo) => {
    if (!groupInfo.isExpanded) {
      return callback(groupInfo);
    }
    return undefined;
  }, false, false, updateOffsets, true);
};

const correctSkipLoadOption = function correctSkipLoadOption(
  that: GroupingHelperCore,
  skip: number | undefined,
): number {
  let skipCorrection = 0;
  let resultSkip = skip || 0;

  if (skip) {
    foreachCollapsedGroups(that, (groupInfo) => {
      if (groupInfo.offset - skipCorrection >= skip) {
        return false;
      }
      skipCorrection += groupInfo.count - 1;
      return undefined;
    });
    resultSkip += skipCorrection;
  }
  return resultSkip;
};

const processCollapsedGroupItem = function processCollapsedGroupItem(
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
};

const processExpandedGroupItem = function processExpandedGroupItem(
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
};

const processDataItem = function processDataItem(state: GroupItemsProcessingState): void {
  if (state.skipFirstItem) {
    state.needRemoveFirstItem = true;
  }
  state.offset += 1;
  state.take -= 1;
  if (state.take < 0) {
    state.removeLastItemsCount += 1;
  }
};

const processGroupItems = function processGroupItems(
  that: GroupingHelperCore,
  items: GroupItemData[],
  path: unknown[],
  offset: number,
  skipFirstItem: boolean | undefined,
  take: number,
): GroupItemsPosition {
  const state: GroupItemsProcessingState = {
    offset,
    take,
    skipFirstItem,
    needRemoveFirstItem: false,
    removeLastItemsCount: 0,
  };

  for (const item of items) {
    if (item.items !== undefined) {
      path.push(item.key);
      const groupInfo = that.findGroupInfo(path);

      if (groupInfo && !groupInfo.isExpanded) {
        processCollapsedGroupItem(item, groupInfo.count, state);
      } else if (item.items) {
        const childItemsPosition = processGroupItems(
          that,
          item.items,
          path,
          state.offset,
          state.skipFirstItem,
          state.take,
        );
        processExpandedGroupItem(item, item.items, childItemsPosition, state);
      }
      path.pop();
    } else {
      processDataItem(state);
    }
    state.skipFirstItem = false;
  }
  if (state.needRemoveFirstItem) {
    items.splice(0, 1);
  }
  if (state.removeLastItemsCount) {
    items.splice(-state.removeLastItemsCount, state.removeLastItemsCount);
  }
  return {
    offset: state.offset,
    take: state.take,
  };
};

const pathEquals = function pathEquals(path1: unknown[], path2: unknown[]): boolean {
  if (path1.length !== path2.length) return false;
  for (let i = 0; i < path1.length; i += 1) {
    if (!keysEqual(null, path1[i], path2[i])) {
      return false;
    }
  }
  return true;
};

const isGroupItem = (item: DataItem): item is GroupItemData => (
  'key' in item && item.items !== undefined
);

/**
 * Recalculates flat-data offsets for all known groups after an expand/collapse operation.
 * Walks the item tree recursively, updating stored offsets so that subsequent
 * paging and rendering use correct row positions.
 * The optional pendingGroupInfo carries offset data for a group whose expand state
 * is about to change but hasn't been persisted yet.
 */
const updateGroupOffsets = (
  that: GroupingHelperCore,
  items: DataItem[] | null,
  path: unknown[],
  offset: number,
  pendingGroupInfo?: GroupInfoData,
): number => {
  if (!items) {
    return offset;
  }

  let currentOffset = offset;

  for (const item of items) {
    if (isGroupItem(item)) {
      path.push(item.key);

      const isPendingGroup = pendingGroupInfo && pathEquals(pendingGroupInfo.path, path);
      const groupInfo = that.findGroupInfo(path);

      // Only update offset for the first occurrence; continuation parts keep the original offset
      if (isPendingGroup && !item.isContinuation) {
        pendingGroupInfo.offset = currentOffset;
      }

      if (groupInfo && !item.isContinuation) {
        groupInfo.offset = currentOffset;
      }

      if (groupInfo && !groupInfo.isExpanded) {
        // Collapsed group: skip over all its children in the flat index
        currentOffset += groupInfo.count;
      } else if (isPendingGroup && !pendingGroupInfo.isExpanded) {
        // Pending collapse: the group isn't persisted yet, but we already need its count
        currentOffset += pendingGroupInfo.count;
      } else if (item.items) {
        // Expanded group: recurse into children to accumulate their offsets
        currentOffset = updateGroupOffsets(that, item.items, path, currentOffset, pendingGroupInfo);
      }

      path.pop();
    } else {
      currentOffset += 1;
    }
  }

  return currentOffset;
};

/// #DEBUG
export { loadTotalCount, updateGroupOffsets };

/// #ENDDEBUG

const removeGroupLoadOption = function removeGroupLoadOption(
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
};

const createNotGroupFilter = function createNotGroupFilter(
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
};

const getGroupCount = function getGroupCount(item: GroupItemData, groupCount: number): number {
  if (item.count) {
    return item.count;
  }

  const items = item.items ?? [];

  if (groupCount <= 1) {
    return items.length;
  }

  let count = 0;
  for (const childItem of items) {
    count += getGroupCount(childItem, groupCount - 1);
  }

  return count;
};

export class GroupingHelper extends GroupingHelperCore {
  public handleDataLoading(options: GroupingLoadOperation): void {
    const { storeLoadOptions } = options;
    const collapsedGroups: GroupInfoData[] = [];
    let collapsedItemsCount = 0;
    let skipFirstItem = false;
    const { loadOptions: localLoadOptions } = options;
    let skipCorrection = 0;

    if (!localLoadOptions) {
      return;
    }

    const { group } = localLoadOptions;

    removeGroupLoadOption(storeLoadOptions, localLoadOptions);

    options.group = options.group || group;

    if (options.isCustomLoading) {
      return;
    }

    const loadOptions: StoreLoadOptions = extend({}, storeLoadOptions);

    loadOptions.skip = correctSkipLoadOption(this, storeLoadOptions.skip);

    if (loadOptions.skip && loadOptions.take && group) {
      loadOptions.skip -= 1;
      loadOptions.take += 1;
      skipFirstItem = true;
    }

    const take = loadOptions.take && group ? loadOptions.take : undefined;

    if (take !== undefined) {
      loadOptions.take = take + 1;
    }

    let loadEndOffset = Number(loadOptions.skip) + Number(loadOptions.take);

    this.foreachGroups((groupInfo) => {
      // loadEndOffset should be corrected for expanding group to properly calculate group filter
      if (groupInfo.isPending && groupInfo.isExpanded && groupInfo.count) {
        loadEndOffset += groupInfo.count;
      }

      if (!groupInfo.isExpanded) {
        if (groupInfo.offset >= loadEndOffset + skipCorrection) {
          return false;
        }

        if (groupInfo.offset >= Number(loadOptions.skip) + skipCorrection && groupInfo.count) {
          skipCorrection += groupInfo.count - 1;
          collapsedGroups.push(groupInfo);
          collapsedItemsCount += groupInfo.count;
        }
      }

      if (groupInfo.isPending) {
        delete groupInfo.isPending;
      }

      return undefined;
    }, false, false, undefined, true);

    collapsedGroups.forEach((collapsedGroup) => {
      loadOptions.filter = createNotGroupFilter(collapsedGroup.path, loadOptions, group);
    });

    options.storeLoadOptions = loadOptions;
    options.collapsedGroups = collapsedGroups;
    options.collapsedItemsCount = collapsedItemsCount;
    options.skip = loadOptions.skip || 0;
    options.skipFirstItem = skipFirstItem;
    options.take = take;
  }

  public handleDataLoaded(
    options: GroupingLoadOperation,
    callBase: (options: LoadOperation) => void,
  ): void {
    const { collapsedGroups, collapsedItemsCount, extra } = options;
    const groups = dataGridCore.normalizeSortingInfo(options.group);
    const groupCount = groups.length;

    function appendCollapsedPath(
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

    if (collapsedItemsCount && extra?.totalCount !== undefined && extra.totalCount >= 0) {
      if (!extra._totalCountWasIncreasedByCollapsedItems) {
        extra.totalCount += collapsedItemsCount;
        extra._totalCountWasIncreasedByCollapsedItems = true;
      }
    }

    callBase(options);

    if (groupCount) {
      // @ts-expect-error data is loaded here
      let { data }: { data: GroupItemData[] } = options;
      const query = dataQuery(data);
      storeHelper.multiLevelGroup(query, groups).enumerate().done((groupedData) => {
        // @ts-expect-error multiLevelGroup() resolves group items
        data = groupedData;
      });
      if (collapsedGroups) {
        for (const collapsedGroup of collapsedGroups) {
          appendCollapsedPath(
            data,
            collapsedGroup.path,
            groups,
            collapsedGroup,
            Number(options.skip),
          );
        }
      }
      if (!options.isCustomLoading) {
        processGroupItems(
          this,
          data,
          [],
          Number(options.skip),
          options.skipFirstItem,
          Number(options.take),
        );
      }
      options.data = data;
    }
  }

  public isGroupItemCountable(item: GroupItemData): boolean {
    return item.items === null;
  }

  protected updateTotalItemsCount(): void {
    let itemsCountCorrection = 0;

    foreachCollapsedGroups(this, (groupInfo) => {
      if (groupInfo.count) {
        itemsCountCorrection -= groupInfo.count - 1;
      }
      return undefined;
    });
    super.updateTotalItemsCount(itemsCountCorrection);
  }

  public changeRowExpand(path: unknown[]): DeferredObj<unknown> {
    const { dataSourceAdapter }: {
      dataSourceAdapter: GroupingDataSourceAdapter
      & Partial<VirtualScrollingDataSourceAdapterExtension>;
    } = this;
    const beginPageIndex = dataSourceAdapter.beginPageIndex
      ? dataSourceAdapter.beginPageIndex()
      : dataSourceAdapter.pageIndex();
    const dataSourceItems = dataSourceAdapter.items();
    const offset = correctSkipLoadOption(this, beginPageIndex * dataSourceAdapter.pageSize());
    const groupInfo = this.findGroupInfo(path);
    const groupCountQuery = groupInfo && !groupInfo.isExpanded
      ? Deferred<number>().resolve(groupInfo.count)
      : loadTotalCount(dataSourceAdapter, {
        filter: createGroupFilter(path, {
          filter: dataSourceAdapter.filter(),
          group: dataSourceAdapter.group(),
        }),
      });

    return when(groupCountQuery).done((count) => {
      // @ts-expect-error parseInt() takes a value that when() may wrap in an array
      const normalizedCount = parseInt(count.length ? count[0] : count, 10);
      const pendingGroupInfo: GroupInfoData = {
        offset: groupInfo ? groupInfo.offset : -1,
        path: groupInfo ? groupInfo.path : path,
        isExpanded: groupInfo ? !groupInfo.isExpanded : false,
        count: normalizedCount,
        isPending: true,
      };

      updateGroupOffsets(this, dataSourceItems, [], offset, pendingGroupInfo);

      if (groupInfo) {
        groupInfo.isExpanded = !groupInfo.isExpanded;
        groupInfo.count = normalizedCount;
        groupInfo.isPending = true;
      } else if (pendingGroupInfo.offset >= 0) {
        this.addGroupInfo(pendingGroupInfo);
      }
      this.updateTotalItemsCount();
    }).fail((...args: unknown[]) => {
      dataSourceAdapter._dataSource._eventsStrategy.fireEvent('loadError', args);
    });
  }

  public allowCollapseAll(): boolean {
    return false;
  }

  public refresh(options: LoadOperation, operationTypes: OperationTypes): ForeachGroupsResult {
    const { storeLoadOptions } = options;
    const { dataSourceAdapter } = this;

    super.refresh(options, operationTypes);

    if (operationTypes.reload) {
      return foreachCollapsedGroups(this, (groupInfo) => {
        const groupCountQuery = loadTotalCount(dataSourceAdapter, {
          filter: createGroupFilter(groupInfo.path, storeLoadOptions),
        });
        const groupOffsetQuery = loadTotalCount(dataSourceAdapter, {
          filter: createOffsetFilter(groupInfo.path, storeLoadOptions),
        });

        return when(groupOffsetQuery, groupCountQuery).done((offset, count) => {
          // @ts-expect-error parseInt() takes a value that when() may wrap in an array
          // eslint-disable-next-line radix
          const loadedOffset = parseInt(offset.length ? offset[0] : offset);
          // @ts-expect-error parseInt() takes a value that when() may wrap in an array
          // eslint-disable-next-line radix
          const loadedCount = parseInt(count.length ? count[0] : count);
          groupInfo.offset = loadedOffset;
          if (groupInfo.count !== loadedCount) {
            groupInfo.count = loadedCount;
            this.updateTotalItemsCount();
          }
        });
      }, true);
    }

    return undefined;
  }
}
