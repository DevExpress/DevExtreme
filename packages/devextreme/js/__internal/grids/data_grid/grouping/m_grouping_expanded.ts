import dataQuery from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { LoadOperation, OperationTypes } from '@ts/grids/grid_core/data_source_adapter/types';
import type { VirtualScrollingDataSourceAdapterExtension } from '@ts/grids/grid_core/virtual_scrolling/types';

import dataGridCore from '../core';
import { createGroupFilter } from '../utils';
import type { GroupingDataSourceAdapter } from './m_grouping';
import { GroupingHelper as GroupingHelperCore } from './m_grouping_core';
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
import {
  appendCollapsedPath,
  createNotGroupFilter,
  createOffsetFilter,
  isGroupItem,
  pathEquals,
  processCollapsedGroupItem,
  processDataItem,
  processExpandedGroupItem,
  removeGroupLoadOption,
} from './utils';

const loadTotalCount = function loadTotalCount(
  dataSourceAdapter: DataSourceAdapter,
  options: StoreLoadOptions,
): DeferredObj<number> {
  const d = Deferred<number>();
  const loadOptions = extend({ skip: 0, take: 1, requireTotalCount: true }, options);

  dataSourceAdapter.customLoader.load(loadOptions)
    .done(({ extra }) => {
      if (extra?.totalCount === undefined) {
        d.reject();
        return;
      }
      d.resolve(extra.totalCount);
    })
    .fail((...args: unknown[]) => {
      // @ts-expect-error badly typed Deferred.reject
      d.reject(...args);
    });
  return d;
};

/// #DEBUG
export { loadTotalCount };

/// #ENDDEBUG

export class GroupingHelper extends GroupingHelperCore {
  private foreachCollapsedGroups(
    callback: (groupInfo: GroupInfoData) => ReturnType<ForeachGroupsCallback>,
    updateOffsets?: boolean,
  ): ForeachGroupsResult {
    return this.foreachGroups((groupInfo) => {
      if (!groupInfo.isExpanded) {
        return callback(groupInfo);
      }
      return undefined;
    }, false, false, updateOffsets, true);
  }

  private correctSkipLoadOption(skip: number | undefined): number {
    let skipCorrection = 0;
    let resultSkip = skip || 0;

    if (skip) {
      this.foreachCollapsedGroups((groupInfo) => {
        if (groupInfo.offset - skipCorrection >= skip) {
          return false;
        }
        skipCorrection += groupInfo.count - 1;
        return undefined;
      });
      resultSkip += skipCorrection;
    }
    return resultSkip;
  }

  private processGroupItems(
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

    // eslint-disable-next-line @typescript-eslint/prefer-for-of -- store items may be non-array
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.items !== undefined) {
        path.push(item.key);
        const groupInfo = this.findGroupInfo(path);

        if (groupInfo && !groupInfo.isExpanded) {
          processCollapsedGroupItem(item, groupInfo.count, state);
        } else if (item.items) {
          const childItemsPosition = this.processGroupItems(
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
  }

  /**
   * Recalculates flat-data offsets for all known groups after an expand/collapse operation.
   * Walks the item tree recursively, updating stored offsets so that subsequent
   * paging and rendering use correct row positions.
   * The optional pendingGroupInfo carries offset data for a group whose expand state
   * is about to change but hasn't been persisted yet.
   */
  public updateGroupOffsets(
    items: DataItem[] | null,
    path: unknown[],
    offset: number,
    pendingGroupInfo?: GroupInfoData,
  ): number {
    if (!items) {
      return offset;
    }

    let currentOffset = offset;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of -- store items may be non-array
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (isGroupItem(item)) {
        path.push(item.key);

        const isPendingGroup = pendingGroupInfo && pathEquals(pendingGroupInfo.path, path);
        const groupInfo = this.findGroupInfo(path);

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
          currentOffset = this.updateGroupOffsets(
            item.items,
            path,
            currentOffset,
            pendingGroupInfo,
          );
        }

        path.pop();
      } else {
        currentOffset += 1;
      }
    }

    return currentOffset;
  }

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

    loadOptions.skip = this.correctSkipLoadOption(storeLoadOptions.skip);

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
    customizeLoadResult: (options: LoadOperation) => void,
  ): void {
    const { collapsedGroups, collapsedItemsCount, extra } = options;
    const groups = dataGridCore.normalizeSortingInfo(options.group);
    const groupCount = groups.length;

    if (collapsedItemsCount && extra?.totalCount !== undefined && extra.totalCount >= 0) {
      if (!extra._totalCountWasIncreasedByCollapsedItems) {
        extra.totalCount += collapsedItemsCount;
        extra._totalCountWasIncreasedByCollapsedItems = true;
      }
    }

    customizeLoadResult(options);

    const { data: loadedData } = options;

    if (groupCount && Array.isArray(loadedData)) {
      let data: GroupItemData[] = [];
      const query = dataQuery(loadedData);
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
        this.processGroupItems(
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

  private updateTotalItemsCount(): void {
    let itemsCountCorrection = 0;

    this.foreachCollapsedGroups((groupInfo) => {
      if (groupInfo.count) {
        itemsCountCorrection -= groupInfo.count - 1;
      }
      return undefined;
    });
    this.setTotalCountCorrection(itemsCountCorrection);
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
    const offset = this.correctSkipLoadOption(beginPageIndex * dataSourceAdapter.pageSize());
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

      this.updateGroupOffsets(dataSourceItems, [], offset, pendingGroupInfo);

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

    super.refresh(options, operationTypes);

    if (operationTypes.reload) {
      return this.foreachCollapsedGroups((groupInfo) => {
        const groupCountQuery = loadTotalCount(this.dataSourceAdapter, {
          filter: createGroupFilter(groupInfo.path, storeLoadOptions),
        });
        const groupOffsetQuery = loadTotalCount(this.dataSourceAdapter, {
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
