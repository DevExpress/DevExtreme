import { normalizeSortingInfo } from '@js/common/data/utils';
import $ from '@js/core/renderer';
import { when } from '@js/core/utils/deferred';

import gridCore from '../m_core';

export function createOffsetFilter(path, storeLoadOptions, lastLevelOnly?) {
  const groups = normalizeSortingInfo(storeLoadOptions.group);
  let filter: any[] = [];

  for (let i = lastLevelOnly ? path.length - 1 : 0; i < path.length; i++) {
    const filterElement: any[] = [];
    for (let j = 0; j <= i; j++) {
      const { selector } = groups[j];
      if (i === j && (path[j] === null || path[j] === false || path[j] === true)) {
        if (path[j] === false) {
          filterElement.push([selector, '=', groups[j].desc ? true : null]);
        } else if (path[j] ? !groups[j].desc : groups[j].desc) {
          filterElement.push([selector, '<>', path[j]]);
        } else {
          filterElement.push([selector, '<>', null]);
          filterElement.push([selector, '=', null]);
        }
      } else {
        const currentFilter = [selector, i === j ? groups[j].desc ? '>' : '<' : '=', path[j]];
        if (currentFilter[1] === '<') {
          filterElement.push([currentFilter, 'or', [selector, '=', null]]);
        } else {
          filterElement.push(currentFilter);
        }
      }
    }
    filter.push(gridCore.combineFilters(filterElement));
  }

  filter = gridCore.combineFilters(filter, 'or');

  return gridCore.combineFilters([filter, storeLoadOptions.filter]);
}

const findGroupInfoByKey = function (groupsInfo, key) {
  const { hash } = groupsInfo;

  return hash && hash[JSON.stringify(key)];
};

const getGroupInfoIndexByOffset = function (groupsInfo, offset) {
  let leftIndex = 0;
  let rightIndex = groupsInfo.length - 1;

  if (!groupsInfo.length) {
    return 0;
  }

  do {
    const middleIndex = (rightIndex + leftIndex) >> 1;
    if (groupsInfo[middleIndex].offset > offset) {
      rightIndex = middleIndex;
    } else {
      leftIndex = middleIndex;
    }
  } while (rightIndex - leftIndex > 1);

  let index;
  for (index = leftIndex; index <= rightIndex; index++) {
    if (groupsInfo[index].offset > offset) {
      break;
    }
  }
  return index;
};

const cleanGroupsInfo = function (groupsInfo, groupIndex, groupsCount) {
  for (let i = 0; i < groupsInfo.length; i++) {
    if (groupIndex + 1 >= groupsCount) {
      groupsInfo[i].children = [];
    } else {
      cleanGroupsInfo(groupsInfo[i].children, groupIndex + 1, groupsCount);
    }
  }
};

const calculateItemsCount = function (that, items, groupsCount) {
  let result = 0;

  if (items) {
    if (!groupsCount) {
      result = items.length;
    } else {
      for (let i = 0; i < items.length; i++) {
        if (that.isGroupItemCountable(items[i])) {
          result++;
        }
        result += calculateItemsCount(that, items[i].items, groupsCount - 1);
      }
    }
  }
  return result;
};

export class GroupingHelper {
  protected readonly _dataSource: any;

  private _groupsInfo: any;

  private _totalCountCorrection: any;

  protected _group: any;

  constructor(dataSourceAdapter) {
    this._dataSource = dataSourceAdapter;
    this.reset();
  }

  private reset() {
    this._groupsInfo = [];
    this._totalCountCorrection = 0;
  }

  private totalCountCorrection() {
    return this._totalCountCorrection;
  }

  protected updateTotalItemsCount(totalCountCorrection) {
    this._totalCountCorrection = totalCountCorrection || 0;
  }

  protected isGroupItemCountable(item) {
    return !this._isVirtualPaging() || !item.isContinuation;
  }

  public _isVirtualPaging() {
    const scrollingMode = this._dataSource.option('scrolling.mode');

    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  }

  private itemsCount() {
    const dataSourceAdapter = this._dataSource;
    const dataSource = dataSourceAdapter._dataSource;
    const groupCount = gridCore.normalizeSortingInfo(dataSource.group() || []).length;
    const itemsCount = calculateItemsCount(this, dataSource.items(), groupCount);

    return itemsCount;
  }

  public foreachGroups(callback, childrenAtFirst?, foreachCollapsedGroups?, updateOffsets?, updateParentOffsets?) {
    const that = this;

    function foreachGroupsCore(groupsInfo, callback, childrenAtFirst, parents) {
      const callbackResults: any[] = [];

      function executeCallback(callback, data, parents, callbackResults) {
        const callbackResult = data && callback(data, parents);
        callbackResult && callbackResults.push(callbackResult);
        return callbackResult;
      }

      for (let i = 0; i < groupsInfo.length; i++) {
        parents.push(groupsInfo[i].data);
        if (!childrenAtFirst && executeCallback(callback, groupsInfo[i].data, parents, callbackResults) === false) {
          return false;
        }
        if (!groupsInfo[i].data || groupsInfo[i].data.isExpanded || foreachCollapsedGroups) {
          const { children } = groupsInfo[i];
          const callbackResult = children.length && foreachGroupsCore(children, callback, childrenAtFirst, parents);
          callbackResult && callbackResults.push(callbackResult);
          if (callbackResult === false) {
            return false;
          }
        }
        if (childrenAtFirst && executeCallback(callback, groupsInfo[i].data, parents, callbackResults) === false) {
          return false;
        }
        if (!groupsInfo[i].data || groupsInfo[i].data.offset !== groupsInfo[i].offset) {
          updateOffsets = true;
        }
        parents.pop();
      }

      const currentParents = updateParentOffsets && parents.slice(0);
      return updateOffsets && when.apply($, callbackResults).always(() => {
        that._updateGroupInfoOffsets(groupsInfo, currentParents);
      });
    }

    return foreachGroupsCore(that._groupsInfo, callback, childrenAtFirst, []);
  }

  private _updateGroupInfoOffsets(groupsInfo, parents?) {
    parents = parents || [];

    for (let index = 0; index < groupsInfo.length; index++) {
      const groupInfo = groupsInfo[index];

      if (groupInfo.data && groupInfo.data.offset !== groupInfo.offset) {
        groupInfo.offset = groupInfo.data.offset;

        for (let parentIndex = 0; parentIndex < parents.length; parentIndex++) {
          parents[parentIndex].offset = groupInfo.offset;
        }
      }
    }

    groupsInfo.sort((a, b) => a.offset - b.offset);
  }

  public findGroupInfo(path) {
    const that = this;
    let groupInfo;
    let groupsInfo = that._groupsInfo;

    for (let pathIndex = 0; groupsInfo && pathIndex < path.length; pathIndex++) {
      groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
      groupsInfo = groupInfo && groupInfo.children;
    }

    return groupInfo && groupInfo.data;
  }

  public addGroupInfo(groupInfoData) {
    const that = this;
    let groupInfo;
    const { path } = groupInfoData;
    let groupsInfo = that._groupsInfo;

    for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
      groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
      if (!groupInfo) {
        groupInfo = {
          key: path[pathIndex],
          offset: groupInfoData.offset,
          data: { offset: groupInfoData.offset, isExpanded: true, path: path.slice(0, pathIndex + 1) },
          children: [],
        };
        const index = getGroupInfoIndexByOffset(groupsInfo, groupInfoData.offset);
        groupsInfo.splice(index, 0, groupInfo);
        groupsInfo.hash = groupsInfo.hash || {};
        groupsInfo.hash[JSON.stringify(groupInfo.key)] = groupInfo;
      }
      if (pathIndex === path.length - 1) {
        groupInfo.data = groupInfoData;
        if (groupInfo.offset !== groupInfoData.offset) {
          that._updateGroupInfoOffsets(groupsInfo);
        }
      }
      groupsInfo = groupInfo.children;
    }
  }

  protected allowCollapseAll() {
    return true;
  }

  protected refresh(options) {
    const that = this;
    const { storeLoadOptions } = options;
    const groups = normalizeSortingInfo(storeLoadOptions.group || []);
    const oldGroups = '_group' in that ? normalizeSortingInfo(that._group || []) : groups;
    let groupsCount = Math.min(oldGroups.length, groups.length);

    that._group = storeLoadOptions.group;

    for (let groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
      if (oldGroups[groupIndex].selector !== groups[groupIndex].selector) {
        groupsCount = groupIndex;
        break;
      }
    }

    if (!groupsCount) {
      that.reset();
    } else {
      cleanGroupsInfo(that._groupsInfo, 0, groupsCount);
    }
  }

  protected handleDataLoading() {
  }

  protected handleDataLoaded(options, callBase) {
    callBase(options);
  }

  protected handleDataLoadedCore(options, callBase) {
    callBase(options);
  }
}
