import { normalizeSortingInfo } from '@js/common/data/utils';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { when } from '@js/core/utils/deferred';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { SortingSelector } from '@ts/data/utils';
import type { LoadOperation, OperationTypes } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';
import gridCoreUtils, { isVirtualPaging } from '@ts/grids/grid_core/utils';

import gridCore from '../core';
import type { GroupingDataSourceAdapter } from './m_grouping';
import type {
  ForeachGroupsCallback,
  ForeachGroupsResult,
  GroupInfo,
  GroupInfoData,
  GroupInfoLevel,
  GroupingLoadOperation,
  GroupItemData,
} from './types';

const createBooleanKeyFilters = function createBooleanKeyFilters(
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
};

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
      if (isLastLevel && (key === null || key === false || key === true)) {
        filterElement.push(...createBooleanKeyFilters(selector, key, desc));
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

const findGroupInfoByKey = function findGroupInfoByKey(
  groupsInfo: GroupInfoLevel,
  key: unknown,
): GroupInfo | undefined {
  const { hash } = groupsInfo;

  return hash?.[JSON.stringify(key)];
};

const getGroupInfoIndexByOffset = function getGroupInfoIndexByOffset(
  groupsInfo: GroupInfoLevel,
  offset: number,
): number {
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
};

const cleanGroupsInfo = function cleanGroupsInfo(
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
};

const calculateItemsCount = function calculateItemsCount(
  that: GroupingHelper,
  items: GroupItemData[] | null | undefined,
  groupsCount: number,
): number {
  if (!items) {
    return 0;
  }

  if (!groupsCount) {
    return items.length;
  }

  let result = 0;
  for (const item of items) {
    if (that.isGroupItemCountable(item)) {
      result += 1;
    }
    result += calculateItemsCount(that, item.items, groupsCount - 1);
  }
  return result;
};

export abstract class GroupingHelper {
  public readonly dataSourceAdapter: GroupingDataSourceAdapter;

  public _groupsInfo!: GroupInfoLevel;

  private _totalCountCorrection!: number;

  protected declare _group: StoreLoadOptions['group'];

  constructor(dataSourceAdapter: GroupingDataSourceAdapter) {
    this.dataSourceAdapter = dataSourceAdapter;
    this.reset();
  }

  private reset(): void {
    this._groupsInfo = [];
    this._totalCountCorrection = 0;
  }

  public totalCountCorrection(): number {
    return this._totalCountCorrection;
  }

  protected updateTotalItemsCount(totalCountCorrection: number): void {
    this._totalCountCorrection = totalCountCorrection || 0;
  }

  public isGroupItemCountable(item: GroupItemData): boolean {
    return !isVirtualPaging(this.dataSourceAdapter.option('scrolling')) || !item.isContinuation;
  }

  public itemsCount(): number {
    const dataSource = this.dataSourceAdapter._dataSource;
    const groupCount = gridCore.normalizeSortingInfo(dataSource.group() || []).length;
    // @ts-expect-error DataSource.items() is typed as unknown[]
    const items: GroupItemData[] = dataSource.items();
    const itemsCount = calculateItemsCount(this, items, groupCount);

    return itemsCount;
  }

  public foreachGroups(
    callback: ForeachGroupsCallback,
    childrenAtFirst?: boolean,
    foreachCollapsedGroups?: boolean,
    updateOffsets?: boolean,
    updateParentOffsets?: boolean,
  ): ForeachGroupsResult {
    let needUpdateOffsets = updateOffsets;

    const executeCallback = (
      data: GroupInfoData,
      parents: GroupInfoData[],
      callbackResults: DeferredObj<unknown>[],
    ): ReturnType<ForeachGroupsCallback> => {
      const callbackResult = data && callback(data, parents);
      if (callbackResult) {
        callbackResults.push(callbackResult);
      }
      return callbackResult;
    };

    const foreachGroupsCore = (
      groupsInfo: GroupInfoLevel,
      parents: GroupInfoData[],
    ): ForeachGroupsResult => {
      const callbackResults: DeferredObj<unknown>[] = [];

      // eslint-disable-next-line @typescript-eslint/prefer-for-of -- callbacks may grow the level
      for (let i = 0; i < groupsInfo.length; i += 1) {
        parents.push(groupsInfo[i].data);
        if (
          !childrenAtFirst
          && executeCallback(groupsInfo[i].data, parents, callbackResults) === false
        ) {
          return false;
        }
        if (!groupsInfo[i].data || groupsInfo[i].data.isExpanded || foreachCollapsedGroups) {
          const { children } = groupsInfo[i];
          const callbackResult = children.length && foreachGroupsCore(children, parents);
          if (callbackResult) {
            callbackResults.push(callbackResult);
          }
          if (callbackResult === false) {
            return false;
          }
        }
        if (
          childrenAtFirst
          && executeCallback(groupsInfo[i].data, parents, callbackResults) === false
        ) {
          return false;
        }
        if (!groupsInfo[i].data || groupsInfo[i].data.offset !== groupsInfo[i].offset) {
          needUpdateOffsets = true;
        }
        parents.pop();
      }

      const currentParents = updateParentOffsets ? parents.slice(0) : undefined;
      return needUpdateOffsets && when.apply($, callbackResults).always(() => {
        this._updateGroupInfoOffsets(groupsInfo, currentParents);
      });
    };

    return foreachGroupsCore(this._groupsInfo, []);
  }

  private _updateGroupInfoOffsets(
    groupsInfo: GroupInfoLevel,
    parents: GroupInfoData[] = [],
  ): void {
    for (const groupInfo of groupsInfo) {
      if (groupInfo.data && groupInfo.data.offset !== groupInfo.offset) {
        groupInfo.offset = groupInfo.data.offset;

        for (const parent of parents) {
          parent.offset = groupInfo.offset;
        }
      }
    }

    groupsInfo.sort((a, b) => a.offset - b.offset);
  }

  public findGroupInfo(path: unknown[]): GroupInfoData | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the loop
    let groupInfo: GroupInfo | undefined;
    let groupsInfo: GroupInfoLevel | undefined = this._groupsInfo;

    for (let pathIndex = 0; groupsInfo && pathIndex < path.length; pathIndex += 1) {
      groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
      groupsInfo = groupInfo?.children;
    }

    return groupInfo?.data;
  }

  public addGroupInfo(groupInfoData: GroupInfoData): void {
    const { path } = groupInfoData;
    let groupsInfo = this._groupsInfo;

    for (let pathIndex = 0; pathIndex < path.length; pathIndex += 1) {
      let groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
      if (!groupInfo) {
        // @ts-expect-error a parent group has no count until its own group info is added
        const parentGroupInfoData: GroupInfoData = {
          offset: groupInfoData.offset,
          isExpanded: true,
          path: path.slice(0, pathIndex + 1),
        };
        groupInfo = {
          key: path[pathIndex],
          offset: groupInfoData.offset,
          data: parentGroupInfoData,
          children: [],
        };
        const index = getGroupInfoIndexByOffset(groupsInfo, groupInfoData.offset);
        groupsInfo.splice(index, 0, groupInfo);
        groupsInfo.hash ??= {};
        groupsInfo.hash[JSON.stringify(groupInfo.key)] = groupInfo;
      }
      if (pathIndex === path.length - 1) {
        groupInfo.data = groupInfoData;
        if (groupInfo.offset !== groupInfoData.offset) {
          this._updateGroupInfoOffsets(groupsInfo);
        }
      }
      groupsInfo = groupInfo.children;
    }
  }

  public allowCollapseAll(): boolean {
    return true;
  }

  public refresh(
    options: LoadOperation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    operationTypes: OperationTypes,
  ): ForeachGroupsResult {
    const { storeLoadOptions } = options;
    const groups = normalizeSortingInfo(storeLoadOptions.group || []);
    const oldGroups = '_group' in this ? normalizeSortingInfo(this._group || []) : groups;
    let groupsCount = Math.min(oldGroups.length, groups.length);

    this._group = storeLoadOptions.group;

    for (let groupIndex = 0; groupIndex < groupsCount; groupIndex += 1) {
      if (!gridCoreUtils.isEqualSelectors(
        oldGroups[groupIndex].selector,
        groups[groupIndex].selector,
      )) {
        groupsCount = groupIndex;
        break;
      }
    }

    if (!groupsCount) {
      this.reset();
    } else {
      cleanGroupsInfo(this._groupsInfo, 0, groupsCount);
    }

    return undefined;
  }

  public abstract handleDataLoading(options: GroupingLoadOperation): void;

  public handleDataLoaded(
    options: GroupingLoadOperation,
    callBase: (options: LoadOperation) => void,
  ): void {
    callBase(options);
  }

  public handleDataLoadedCore(
    options: GroupingLoadOperation,
    callBase: (options: LoadOperation) => void,
  ): void {
    callBase(options);
  }

  public abstract changeRowExpand(path: unknown[]): DeferredObj<unknown>;
}
