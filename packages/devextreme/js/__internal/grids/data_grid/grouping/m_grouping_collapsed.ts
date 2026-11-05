import type { GroupDescriptor } from '@js/common/data';
import { errors as dataErrors } from '@js/common/data/errors';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import errors from '@js/ui/widget/ui.errors';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { SummaryDataSourceAdapterExtension } from '@ts/grids/data_grid/summary/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { LoadOperation, OperationTypes, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';
import { isVirtualPaging } from '@ts/grids/grid_core/utils';

import dataGridCore from '../core';
import { createGroupFilter } from '../utils';
import type { GroupingDataSourceAdapter } from './m_grouping';
import { GroupingHelper as GroupingHelperCore } from './m_grouping_core';
import type {
  ExpandedGroupsInfo,
  ForeachGroupsCallback,
  ForeachGroupsResult,
  GroupingLoadOperation,
  GroupItemData,
  GroupItemsLoadResult,
  GroupPagingCallback,
  GroupPagingOptions,
} from './types';
import {
  applyContinuationToGroupItem,
  createExpandedGroupsInfo,
  createOffsetFilter,
  fillSkipTakeInExpandedInfo,
  getContinuationGroupCount,
  getGroupLevelCount,
  getTotalOffset,
  isDataDeferred,
  isGroupExpanded,
  makeDataDeferred,
} from './utils';

const loadGroupTotalCount = function loadGroupTotalCount(
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
};

const getLoadedGroupItems = function getLoadedGroupItems(
  options: Pick<LoadOperation, 'data'>,
): GroupItemData[] {
  // @ts-expect-error grouped load results hold group items
  return options.data;
};

export class GroupingHelper extends GroupingHelperCore {
  private foreachExpandedGroups(
    callback: ForeachGroupsCallback,
    updateGroups?: boolean,
  ): ForeachGroupsResult {
    return this.foreachGroups((groupInfo, parents) => {
      if (groupInfo.isExpanded) {
        return callback(groupInfo, parents);
      }
      return undefined;
    }, true, false, updateGroups, updateGroups);
  }

  private processGroupItems(
    items: GroupItemData[],
    groupsCount: number,
    expandedInfo: ExpandedGroupsInfo,
    path: unknown[],
    isCustomLoading?: boolean,
    isLastGroupExpanded?: boolean,
  ): void {
    if (!groupsCount) {
      return;
    }

    for (const item of items) {
      if (item.items !== undefined) {
        path.push(item.key);

        const isExpanded = isCustomLoading ? true : this.findGroupInfo(path)?.isExpanded;

        if (!isExpanded) {
          item.collapsedItems = item.items;
          item.items = null;
        } else if (item.items) {
          this.processGroupItems(
            item.items,
            groupsCount - 1,
            expandedInfo,
            path,
            isCustomLoading,
            isLastGroupExpanded,
          );
        } else if (
          groupsCount === 1 && item.count && (!isCustomLoading || isLastGroupExpanded)
        ) {
          expandedInfo.items.push(item);
          expandedInfo.paths.push(path.slice(0));
          expandedInfo.count += expandedInfo.lastCount;
          expandedInfo.lastCount = item.count;
        }
        path.pop();
      }
    }
  }

  private updateGroupInfoItem(
    item: GroupItemData,
    isLastGroupLevel: boolean,
    path: unknown[],
    offset: number,
  ): void {
    const groupInfo = this.findGroupInfo(path);
    const itemCount = item.count ?? 0;
    const lastLevelCount = itemCount > 0 ? itemCount : item.items?.length ?? 0;

    if (!groupInfo) {
      this.addGroupInfo({
        isExpanded: this._isGroupExpanded(path.length - 1),
        path: path.slice(0),
        offset,
        count: isLastGroupLevel ? lastLevelCount : 0,
      });
    } else {
      if (isLastGroupLevel) {
        groupInfo.count = lastLevelCount;
      } else {
        item.count = groupInfo.count || item.count;
      }
      groupInfo.offset = offset;
    }
  }

  private updateGroupInfos(
    options: GroupingLoadOperation,
    items: GroupItemData[],
    loadedGroupCount: number,
    groupIndex = 0,
    path: unknown[] = [],
    parentIndex?: number,
  ): number {
    const groupCount = getGroupLevelCount(options.group);
    const isLastGroupLevel = groupCount === loadedGroupCount;
    const remotePaging = options.remoteOperations?.paging;
    let offset = 0;
    let totalCount = 0;

    if (remotePaging && !parentIndex) {
      offset = groupIndex === 0 ? options.skip || 0 : options.skips?.[groupIndex - 1] || 0;
    }

    if (groupIndex >= loadedGroupCount) {
      return items.length;
    }

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item) {
        path.push(item.key);

        if ((!item.count && !item.items) || item.items === undefined) {
          return -1;
        }

        this.updateGroupInfoItem(item, isLastGroupLevel, path, offset + i);

        const count = item.items
          ? this.updateGroupInfos(options, item.items, loadedGroupCount, groupIndex + 1, path, i)
          : item.count || -1;
        if (count < 0) {
          return -1;
        }
        totalCount += count;
        path.pop();
      }
    }
    return totalCount;
  }

  private collectExpandedGroupsInfo(
    options: GroupingLoadOperation,
    loadedGroupCount: number,
    data: GroupItemData[],
  ): ExpandedGroupsInfo {
    const expandedInfo = createExpandedGroupsInfo();

    this.processGroupItems(data, loadedGroupCount, expandedInfo, []);

    fillSkipTakeInExpandedInfo(options, expandedInfo, loadedGroupCount);

    return expandedInfo;
  }

  private loadGroupItems(
    options: GroupingLoadOperation,
    loadedGroupCount: number,
    expandedInfo: ExpandedGroupsInfo,
    groupLevel: number,
    data: GroupItemData[],
  ): void {
    const currentExpandedInfo = options.isCustomLoading
      ? expandedInfo
      : this.collectExpandedGroupsInfo(options, loadedGroupCount, data);

    const groupCount = getGroupLevelCount(options.group);

    if (currentExpandedInfo.paths.length && (groupCount - loadedGroupCount > 0)) {
      makeDataDeferred(options);
      this.loadExpandedGroups(options, currentExpandedInfo, loadedGroupCount, groupLevel, data);
    } else if (currentExpandedInfo.paths.length && options.storeLoadOptions.group) {
      const dataDeferred = makeDataDeferred(options);
      if (dataDeferred) {
        this.loadLastLevelGroupItems(options, currentExpandedInfo, data, dataDeferred);
      }
    } else if (isDataDeferred(options.data)) {
      options.data?.resolve(data);
    }
  }

  private loadExpandedGroups(
    options: GroupingLoadOperation,
    expandedInfo: ExpandedGroupsInfo,
    loadedGroupCount: number,
    groupLevel: number,
    data: GroupItemData[],
  ): void {
    const groups = Array.isArray(options.group) ? options.group : [];
    const currentGroup = groups[groupLevel + 1];
    const deferreds: GroupItemsLoadResult[] = [];

    expandedInfo.paths.forEach((expandedPath, expandedItemIndex) => {
      const loadOptions: StoreLoadOptions = {
        requireTotalCount: false,
        requireGroupCount: true,
        group: [currentGroup],
        groupSummary: options.storeLoadOptions.groupSummary,
        filter: createGroupFilter(expandedPath, {
          filter: options.storeLoadOptions.filter,
          group: groups,
        }),
        select: options.storeLoadOptions.select,
        langParams: options.storeLoadOptions?.langParams,
      };

      if (expandedItemIndex === 0) {
        loadOptions.skip = expandedInfo.skip || 0;
      }

      if (expandedItemIndex === expandedInfo.paths.length - 1) {
        loadOptions.take = expandedInfo.take;
      }

      const loadDeferred: GroupItemsLoadResult = loadOptions.take === 0
        ? { data: [] }
        : this.dataSourceAdapter.customLoader.loadFromStore(loadOptions);

      when(loadDeferred)
        .done((loadResult) => {
          const item = expandedInfo.items[expandedItemIndex];

          applyContinuationToGroupItem(options, expandedInfo, groupLevel, expandedItemIndex);

          item.items = getLoadedGroupItems(loadResult);
        });

      deferreds.push(loadDeferred);
    });

    when(...deferreds).done(() => {
      this.updateGroupInfos(options, data, loadedGroupCount + 1);

      this.loadGroupItems(options, loadedGroupCount + 1, expandedInfo, groupLevel + 1, data);
    });
  }

  private loadLastLevelGroupItems(
    options: GroupingLoadOperation,
    expandedInfo: ExpandedGroupsInfo,
    data: GroupItemData[],
    dataDeferred: DeferredObj<RawItemData[]>,
  ): void {
    const { dataSourceAdapter }: {
      dataSourceAdapter: GroupingDataSourceAdapter & Partial<SummaryDataSourceAdapterExtension>;
    } = this;
    const groups = Array.isArray(options.group) ? options.group : [];
    const expandedFilters = expandedInfo.paths.map((expandedPath) => createGroupFilter(
      expandedPath,
      { group: options.isCustomLoading ? options.storeLoadOptions.group : groups },
    ));

    const filter = options.storeLoadOptions.isLoadingAll
      ? options.storeLoadOptions.filter
      : combineFilters([options.storeLoadOptions.filter, combineFilters(expandedFilters, 'or')]);

    // @ts-expect-error normalized sort and a null group don't fit StoreLoadOptions
    const loadOptions: StoreLoadOptions = extend({}, options.storeLoadOptions, {
      requireTotalCount: false,
      requireGroupCount: false,
      group: null,
      sort: [...groups, ...dataGridCore.normalizeSortingInfo(options.storeLoadOptions.sort || [])],
      filter,
    });

    const isPagingLocal = dataSourceAdapter.isLastLevelGroupItemsPagingLocal?.();

    if (!isPagingLocal) {
      loadOptions.skip = expandedInfo.skip;
      loadOptions.take = expandedInfo.take;
    }

    const loadDeferred: GroupItemsLoadResult = expandedInfo.take === 0
      ? { data: [] }
      : dataSourceAdapter.customLoader.loadFromStore(loadOptions);

    when(loadDeferred)
      .done((loadResult) => {
        let items = loadResult.data;

        if (isPagingLocal && dataSourceAdapter.sortLastLevelGroupItems) {
          // @ts-expect-error sortLastLevelGroupItems() takes normalized groups, returns unknown[]
          items = dataSourceAdapter.sortLastLevelGroupItems(items, groups, expandedInfo.paths);
          items = expandedInfo.skip ? items.slice(expandedInfo.skip) : items;
          items = expandedInfo.take ? items.slice(0, expandedInfo.take) : items;
        }
        expandedInfo.items.forEach((item, index) => {
          const itemCount = Number(item.count) - ((index === 0 && expandedInfo.skip) || 0);
          const expandedItems = items.splice(0, itemCount);

          applyContinuationToGroupItem(options, expandedInfo, groups.length - 1, index);
          // @ts-expect-error last-level group items hold data rows
          item.items = expandedItems;
        });
        dataDeferred.resolve(data);
      })
      // @ts-expect-error badly typed Deferred.reject
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      .fail(dataDeferred.reject);
  }

  private updateTotalItemsCount(options: LoadOperation): void {
    let totalItemsCount = 0;
    const totalCount = options.extra?.totalCount || 0;
    const groupCount = options.extra?.groupCount || 0;
    const pageSize = this.dataSourceAdapter.pageSize();
    const virtualPaging = isVirtualPaging(this.dataSourceAdapter.option('scrolling'));

    this.foreachExpandedGroups((groupInfo) => {
      groupInfo.childrenTotalCount = 0;
    });

    this.foreachExpandedGroups((groupInfo, parents) => {
      const totalOffset = getTotalOffset(parents, virtualPaging ? 0 : pageSize, totalItemsCount);
      const parent = parents[parents.length - 2];
      let count = groupInfo.count + (groupInfo.childrenTotalCount ?? 0);

      if (!virtualPaging) {
        count += getContinuationGroupCount(totalOffset, pageSize, count, parents.length - 1);
      }
      if (parent) {
        parent.childrenTotalCount = (parent.childrenTotalCount ?? 0) + count;
      } else {
        totalItemsCount += count;
      }
    });
    this.setTotalCountCorrection(totalItemsCount - totalCount + groupCount);
  }

  private _isGroupExpanded(groupIndex: number): boolean {
    return isGroupExpanded(this.dataSourceAdapter.group(), groupIndex);
  }

  public updatePagingOptions(options: GroupPagingOptions, callback?: GroupPagingCallback): void {
    const virtualPaging = isVirtualPaging(this.dataSourceAdapter.option('scrolling'));
    const pageSize = this.dataSourceAdapter.pageSize();
    const skips: number[] = [];
    const takes: number[] = [];
    let skipChildrenTotalCount = 0;
    let childrenTotalCount = 0;

    if (options.take) {
      const optionsSkip = Number(options.skip);
      const optionsTake = options.take;

      this.foreachExpandedGroups((groupInfo) => {
        groupInfo.childrenTotalCount = 0;
        groupInfo.skipChildrenTotalCount = 0;
      });
      this.foreachExpandedGroups((groupInfo, parents) => {
        let takeCorrection = 0;
        let parentTakeCorrection = 0;
        const totalOffset = getTotalOffset(
          parents,
          virtualPaging ? 0 : pageSize,
          childrenTotalCount,
        );
        const parent = parents[parents.length - 2];
        const groupChildrenTotalCount = groupInfo.childrenTotalCount ?? 0;
        const groupSkipChildrenTotalCount = groupInfo.skipChildrenTotalCount ?? 0;
        let continuationGroupCount = 0;
        let skipContinuationGroupCount = 0;
        let groupInfoCount = groupInfo.count + groupChildrenTotalCount;
        let childrenGroupInfoCount = groupInfoCount;

        callback?.(groupInfo, totalOffset);

        const skip = optionsSkip - totalOffset;
        const isInTakeRange = totalOffset <= optionsSkip + optionsTake && !!groupInfoCount;

        if (isInTakeRange) {
          if (!virtualPaging) {
            continuationGroupCount = getContinuationGroupCount(
              totalOffset,
              pageSize,
              groupInfoCount,
              parents.length - 1,
            );
            groupInfoCount += continuationGroupCount * parents.length;
            childrenGroupInfoCount += continuationGroupCount;
            if (pageSize && skip >= 0) {
              takeCorrection = parents.length;
              parentTakeCorrection = parents.length - 1;
              skipContinuationGroupCount = Math.floor(skip / pageSize);
            }
          }

          if (skip >= 0) {
            if (totalOffset + groupInfoCount > optionsSkip) {
              skips.unshift(
                skip - skipContinuationGroupCount * takeCorrection - groupSkipChildrenTotalCount,
              );
            }
            if (totalOffset + groupInfoCount >= optionsSkip + optionsTake) {
              takes.unshift(
                optionsTake - takeCorrection
                - groupChildrenTotalCount + groupSkipChildrenTotalCount,
              );
            }
          } else if (totalOffset + groupInfoCount >= optionsSkip + optionsTake) {
            takes.unshift(optionsTake + skip - groupChildrenTotalCount);
          }
        }

        if (totalOffset <= optionsSkip) {
          if (parent) {
            parent.skipChildrenTotalCount = (parent.skipChildrenTotalCount ?? 0) + Math.min(
              childrenGroupInfoCount,
              skip + 1 - skipContinuationGroupCount * parentTakeCorrection,
            );
          } else {
            skipChildrenTotalCount += Math.min(childrenGroupInfoCount, skip + 1);
          }
        }
        if (isInTakeRange) {
          groupInfoCount = Math.min(
            childrenGroupInfoCount,
            skip + optionsTake - (skipContinuationGroupCount + 1) * parentTakeCorrection,
          );
          if (parent) {
            parent.childrenTotalCount = (parent.childrenTotalCount ?? 0) + groupInfoCount;
          } else {
            childrenTotalCount += groupInfoCount;
          }
        }
      });
      options.skip = optionsSkip - skipChildrenTotalCount;
      options.take = optionsTake - (childrenTotalCount - skipChildrenTotalCount);
    }

    options.skips = skips;
    options.takes = takes;
  }

  public changeRowExpand(path: unknown[]): DeferredObj<unknown> {
    const groupInfo = this.findGroupInfo(path);
    const { dataSourceAdapter } = this;
    const remoteGroupPaging = dataSourceAdapter.remoteOperations().groupPaging;
    // @ts-expect-error normalizeSortingInfo() types selector wider than public KeySelector
    const groups: GroupDescriptor<unknown>[] = dataGridCore.normalizeSortingInfo(
      dataSourceAdapter.group(),
    );

    if (groupInfo) {
      groupInfo.isExpanded = !groupInfo.isExpanded;

      if (remoteGroupPaging && groupInfo.isExpanded && path.length < groups.length) {
        return loadGroupTotalCount(dataSourceAdapter, {
          filter: createGroupFilter(path, {
            filter: dataSourceAdapter.lastLoadOptions().filter,
            group: dataSourceAdapter.group(),
          }),
          group: [groups[path.length]],
          select: dataSourceAdapter.select(),
        }).done((groupCount) => {
          groupInfo.count = groupCount;
        });
      }
      return Deferred<unknown>().resolve();
    }
    return Deferred<unknown>().reject();
  }

  public handleDataLoading(options: GroupingLoadOperation): void {
    const { storeLoadOptions } = options;
    // @ts-expect-error normalizeSortingInfo() types selector wider than public KeySelector
    const groups: GroupDescriptor<unknown>[] = dataGridCore.normalizeSortingInfo(
      storeLoadOptions.group || options.loadOptions?.group,
    );

    if (options.isCustomLoading || !groups.length) {
      return;
    }

    if (options.remoteOperations?.grouping) {
      const remotePaging = this.dataSourceAdapter.remoteOperations().paging;
      const normalizedGroups = dataGridCore.normalizeSortingInfo(storeLoadOptions.group);

      normalizedGroups.forEach((group, index) => {
        const isLastGroup = index === normalizedGroups.length - 1;
        group.isExpanded = !remotePaging || !isLastGroup;
      });
      // @ts-expect-error normalizeSortingInfo() types selector wider than public KeySelector
      storeLoadOptions.group = normalizedGroups;
    }

    options.group = options.group || groups;

    if (options.remoteOperations?.paging) {
      options.skip = storeLoadOptions.skip;
      options.take = storeLoadOptions.take;
      storeLoadOptions.requireGroupCount = true;
      storeLoadOptions.group = groups.slice(0, 1);
      this.updatePagingOptions(options);

      storeLoadOptions.skip = options.skip;
      storeLoadOptions.take = options.take;
    } else {
      options.skip = options.loadOptions?.skip;
      options.take = options.loadOptions?.take;
      this.updatePagingOptions(options);
    }
  }

  public handleDataLoadedCore(
    options: GroupingLoadOperation,
    customizeLoadResult: (options: LoadOperation) => void,
  ): void {
    const loadedGroupCount = dataGridCore.normalizeSortingInfo(
      options.storeLoadOptions.group || options.loadOptions?.group,
    ).length;
    const groupCount = getGroupLevelCount(options.group);
    const expandedInfo = createExpandedGroupsInfo();

    if (options.isCustomLoading) {
      customizeLoadResult(options);

      this.processGroupItems(
        getLoadedGroupItems(options),
        loadedGroupCount,
        expandedInfo,
        [],
        options.isCustomLoading,
        options.storeLoadOptions.isLoadingAll,
      );
    } else {
      if (!options.remoteOperations?.paging) {
        this.foreachGroups((groupInfo) => { groupInfo.count = 0; });
      }

      const loadedItems = getLoadedGroupItems(options);
      const totalCount = this.updateGroupInfos(options, loadedItems, loadedGroupCount);

      if (totalCount < 0) {
        // @ts-expect-error badly typed Deferred.reject
        options.data = Deferred<RawItemData[]>().reject(errors.Error('E1037'));
        return;
      }

      if (!options.remoteOperations?.paging) {
        if (loadedGroupCount && options.extra && options.loadOptions?.requireTotalCount) {
          options.extra.totalCount = totalCount;
          options.extra.groupCount = loadedItems.length;
        }
      }

      if (
        groupCount
        && options.storeLoadOptions.requireGroupCount
        && !isFinite(Number(options.extra?.groupCount))
      ) {
        // @ts-expect-error badly typed Deferred.reject
        options.data = Deferred<RawItemData[]>().reject(dataErrors.Error('E4022'));
        return;
      }

      this.updateTotalItemsCount(options);

      if (!options.remoteOperations?.paging) {
        this.updatePagingOptions(options);
        if (options.lastLoadOptions) {
          options.lastLoadOptions.skips = options.skips;
          options.lastLoadOptions.takes = options.takes;
        }
      }
      customizeLoadResult(options);

      if (!options.remoteOperations?.paging) {
        this._processPaging(options, loadedGroupCount);
      }
    }

    this.loadGroupItems(options, loadedGroupCount, expandedInfo, 0, getLoadedGroupItems(options));
  }

  private _processSkips(
    items: GroupItemData[],
    skips: (number | undefined)[],
    groupCount: number,
  ): void {
    if (!groupCount) {
      return;
    }

    const firstItem = items[0];
    const skip = skips[0];
    const children = firstItem?.items;

    if (skip !== undefined) {
      firstItem.isContinuation = true;

      if (children) {
        firstItem.items = children.slice(skip);
        this._processSkips(firstItem.items, skips.slice(1), groupCount - 1);
      }
    }
  }

  private _processTakes(
    items: GroupItemData[] | null | undefined,
    skips: (number | undefined)[],
    takes: (number | undefined)[],
    groupCount: number,
    parents: GroupItemData[] = [],
  ): void {
    if (!groupCount || !items) {
      return;
    }

    const lastItem = items[items.length - 1];
    let children = lastItem?.items;
    const take = takes[0];
    const skip = skips[0];

    if (lastItem) {
      const skippedCount = (lastItem.isContinuation && skip) || 0;
      const maxTakeCount = (Number(lastItem.count) - skippedCount) || (children?.length ?? 0);

      if (take !== undefined && maxTakeCount > take) {
        lastItem.isContinuationOnNextPage = true;
        parents.forEach((parent) => {
          parent.isContinuationOnNextPage = true;
        });
        if (children) {
          children = children.slice(0, take);
          lastItem.items = children;
        }
      }
      parents.push(lastItem);
      this._processTakes(children, skips.slice(1), takes.slice(1), groupCount - 1, parents);
    }
  }

  private _processPaging(options: GroupingLoadOperation, groupCount: number): void {
    const { skips = [], takes = [] } = options;
    const items = getLoadedGroupItems(options);

    this._processSkips(items, skips, groupCount);
    this._processTakes(items, skips, takes, groupCount);
  }

  public refresh(options: LoadOperation, operationTypes: OperationTypes): ForeachGroupsResult {
    const { storeLoadOptions } = options;
    const group = options.group || storeLoadOptions.group;
    const oldGroups = dataGridCore.normalizeSortingInfo(this._group);

    for (let groupIndex = 0; groupIndex < oldGroups.length; groupIndex += 1) {
      const isExpanded = isGroupExpanded(group, groupIndex);
      if (isGroupExpanded(this._group, groupIndex) !== isExpanded) {
        this.foreachGroups((groupInfo, parents) => {
          if (parents.length === groupIndex + 1) {
            groupInfo.isExpanded = isExpanded;
          }
        });
      }
    }

    super.refresh(options, operationTypes);

    if (Array.isArray(group) && options.remoteOperations?.paging && operationTypes.reload) {
      return this.foreachExpandedGroups((groupInfo) => {
        const groupCountQuery = loadGroupTotalCount(this.dataSourceAdapter, {
          filter: createGroupFilter(groupInfo.path, {
            filter: storeLoadOptions.filter,
            group,
          }),
          group: group.slice(groupInfo.path.length),
          select: storeLoadOptions.select,
        });
        const groupOffsetQuery = loadGroupTotalCount(this.dataSourceAdapter, {
          filter: createOffsetFilter(groupInfo.path, {
            filter: storeLoadOptions.filter,
            group,
          }, true),
          group: group.slice(groupInfo.path.length - 1, groupInfo.path.length),
          select: storeLoadOptions.select,
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
            this.updateTotalItemsCount(options);
          }
        });
      }, true);
    }

    return undefined;
  }
}
