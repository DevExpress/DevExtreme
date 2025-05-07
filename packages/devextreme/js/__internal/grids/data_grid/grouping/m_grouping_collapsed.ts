import { errors as dataErrors } from '@js/common/data/errors';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import errors from '@js/ui/widget/ui.errors';

import dataGridCore from '../m_core';
import { createGroupFilter } from '../m_utils';
import { createOffsetFilter, GroupingHelper as GroupingHelperCore } from './m_grouping_core';

function getContinuationGroupCount(groupOffset, pageSize, groupSize, groupIndex) {
  groupIndex = groupIndex || 0;
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

const foreachExpandedGroups = function (that, callback, updateGroups?) {
  return that.foreachGroups((groupInfo, parents) => {
    if (groupInfo.isExpanded) {
      return callback(groupInfo, parents);
    }
  }, true, false, updateGroups, updateGroups);
};

const processGroupItems = function (that, items, groupsCount, expandedInfo, path, isCustomLoading?, isLastGroupExpanded?) {
  let isExpanded;

  expandedInfo.items = expandedInfo.items || [];
  expandedInfo.paths = expandedInfo.paths || [];
  expandedInfo.count = expandedInfo.count || 0;
  expandedInfo.lastCount = expandedInfo.lastCount || 0;

  if (!groupsCount) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.items !== undefined) {
      path.push(item.key);

      if (isCustomLoading) {
        isExpanded = true;
      } else {
        const groupInfo = that.findGroupInfo(path);
        isExpanded = groupInfo && groupInfo.isExpanded;
      }
      if (!isExpanded) {
        item.collapsedItems = item.items;
        item.items = null;
      } else if (item.items) {
        processGroupItems(that, item.items, groupsCount - 1, expandedInfo, path, isCustomLoading, isLastGroupExpanded);
      } else if (groupsCount === 1 && item.count && (!isCustomLoading || isLastGroupExpanded)) {
        expandedInfo.items.push(item);
        expandedInfo.paths.push(path.slice(0));
        expandedInfo.count += expandedInfo.lastCount;
        expandedInfo.lastCount = item.count;
      }
      path.pop();
    }
  }
};

const updateGroupInfoItem = function (that, item, isLastGroupLevel, path, offset) {
  const groupInfo = that.findGroupInfo(path);
  let count;

  if (!groupInfo) {
    if (isLastGroupLevel) {
      count = item.count > 0 ? item.count : item.items.length;
    }

    that.addGroupInfo({
      isExpanded: that._isGroupExpanded(path.length - 1),
      path: path.slice(0),
      offset,
      count: count || 0,
    });
  } else {
    if (isLastGroupLevel) {
      groupInfo.count = item.count > 0 ? item.count : item.items && item.items.length || 0;
    } else {
      item.count = groupInfo.count || item.count;
    }
    groupInfo.offset = offset;
  }
};

const updateGroupInfos = function (that, options, items, loadedGroupCount, groupIndex?, path?, parentIndex?) {
  const groupCount = options.group ? options.group.length : 0;
  const isLastGroupLevel = groupCount === loadedGroupCount;
  const remotePaging = options.remoteOperations.paging;
  let offset = 0;
  let totalCount = 0;
  let count;

  groupIndex = groupIndex || 0;
  path = path || [];

  if (remotePaging && !parentIndex) {
    offset = groupIndex === 0 ? options.skip || 0 : options.skips[groupIndex - 1] || 0;
  }

  if (groupIndex >= loadedGroupCount) return items.length;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item) {
      path.push(item.key);

      if ((!item.count && !item.items) || item.items === undefined) {
        return -1;
      }

      updateGroupInfoItem(that, item, isLastGroupLevel, path, offset + i);

      count = item.items ? updateGroupInfos(that, options, item.items, loadedGroupCount, groupIndex + 1, path, i) : item.count || -1;
      if (count < 0) {
        return -1;
      }
      totalCount += count;
      path.pop();
    }
  }
  return totalCount;
};

const isGroupExpanded = function (groups, groupIndex) {
  return groups && groups.length && groups[groupIndex] && !!groups[groupIndex].isExpanded;
};

const getTotalOffset = function (groupInfos, pageSize, offset) {
  let groupSize;
  let totalOffset = offset;

  for (let groupIndex = 0; groupIndex < groupInfos.length; groupIndex++) {
    groupSize = groupInfos[groupIndex].offset + 1;
    if (groupIndex > 0) {
      groupSize += groupInfos[groupIndex - 1].childrenTotalCount;
      if (pageSize) {
        groupSize += getContinuationGroupCount(totalOffset, pageSize, groupSize, groupIndex - 1) * groupIndex;
      }
    }
    totalOffset += groupSize;
  }

  return totalOffset;
};

function applyContinuationToGroupItem(options, expandedInfo, groupLevel, expandedItemIndex) {
  const item = expandedInfo.items[expandedItemIndex];
  const skip = options.skips && options.skips[groupLevel];
  const take = options.takes && options.takes[groupLevel];
  const isLastExpandedItem = expandedItemIndex === expandedInfo.items.length - 1;
  const isFirstExpandedItem = expandedItemIndex === 0;
  const lastExpandedItemSkip = isFirstExpandedItem && skip || 0;
  const isItemsTruncatedByTake = item.count > take + lastExpandedItemSkip;

  if (isFirstExpandedItem && skip !== undefined) {
    item.isContinuation = true;
  }

  if (isLastExpandedItem && take !== undefined && isItemsTruncatedByTake) {
    item.isContinuationOnNextPage = true;
  }
}

function fillSkipTakeInExpandedInfo(options, expandedInfo, currentGroupCount) {
  const currentGroupIndex = currentGroupCount - 1;
  const groupCount = options.group ? options.group.length : 0;

  expandedInfo.skip = options.skips && options.skips[currentGroupIndex];
  if (options.takes && options.takes[currentGroupIndex] !== undefined) {
    if (groupCount === currentGroupCount) {
      expandedInfo.take = expandedInfo.count ? expandedInfo.count - (expandedInfo.skip || 0) : 0;
    } else {
      expandedInfo.take = 0;
    }
    expandedInfo.take += options.takes[currentGroupIndex];
  }
}

function isDataDeferred(data) {
  return !Array.isArray(data);
}

function makeDataDeferred(options) {
  if (!isDataDeferred(options.data)) {
    // @ts-expect-error
    options.data = new Deferred();
  }
}

function loadGroupItems(that, options, loadedGroupCount, expandedInfo, groupLevel, data) {
  if (!options.isCustomLoading) {
    expandedInfo = {};

    processGroupItems(that, data, loadedGroupCount, expandedInfo, []);

    fillSkipTakeInExpandedInfo(options, expandedInfo, loadedGroupCount);
  }

  const groupCount = options.group ? options.group.length : 0;

  if (expandedInfo.paths.length && (groupCount - loadedGroupCount > 0)) {
    makeDataDeferred(options);
    loadExpandedGroups(that, options, expandedInfo, loadedGroupCount, groupLevel, data);
  } else if (expandedInfo.paths.length && options.storeLoadOptions.group) {
    makeDataDeferred(options);
    loadLastLevelGroupItems(that, options, expandedInfo, data);
  } else if (isDataDeferred(options.data)) {
    options.data.resolve(data);
  }
}

function loadExpandedGroups(that, options, expandedInfo, loadedGroupCount, groupLevel, data) {
  const groups = options.group || [];
  const currentGroup = groups[groupLevel + 1];
  const deferreds: any[] = [];

  each(expandedInfo.paths, (expandedItemIndex) => {
    const loadOptions: any = {
      requireTotalCount: false,
      requireGroupCount: true,
      group: [currentGroup],
      groupSummary: options.storeLoadOptions.groupSummary,
      filter: createGroupFilter(expandedInfo.paths[expandedItemIndex], {
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

    const loadResult = loadOptions.take === 0 ? [] : that._dataSource.loadFromStore(loadOptions);

    when(loadResult).done((data) => {
      const item = expandedInfo.items[expandedItemIndex];

      applyContinuationToGroupItem(options, expandedInfo, groupLevel, expandedItemIndex);

      item.items = data;
    });

    deferreds.push(loadResult);
  });

  when.apply(null, deferreds).done(() => {
    updateGroupInfos(that, options, data, loadedGroupCount + 1);

    loadGroupItems(that, options, loadedGroupCount + 1, expandedInfo, groupLevel + 1, data);
  });
}

function loadLastLevelGroupItems(that, options, expandedInfo, data) {
  const expandedFilters: any[] = [];
  const groups = options.group || [];

  each(expandedInfo.paths, (_, expandedPath) => {
    expandedFilters.push(createGroupFilter(expandedPath, {
      group: options.isCustomLoading ? options.storeLoadOptions.group : groups,
    }));
  });

  let { filter } = options.storeLoadOptions;

  if (!options.storeLoadOptions.isLoadingAll) {
    filter = dataGridCore.combineFilters([filter, dataGridCore.combineFilters(expandedFilters, 'or')]);
  }

  const loadOptions = extend({}, options.storeLoadOptions, {
    requireTotalCount: false,
    requireGroupCount: false,
    group: null,
    sort: groups.concat(dataGridCore.normalizeSortingInfo(options.storeLoadOptions.sort || [])),
    filter,
  });

  const isPagingLocal = that._dataSource.isLastLevelGroupItemsPagingLocal();

  if (!isPagingLocal) {
    loadOptions.skip = expandedInfo.skip;
    loadOptions.take = expandedInfo.take;
  }

  when(expandedInfo.take === 0 ? [] : that._dataSource.loadFromStore(loadOptions)).done((items) => {
    if (isPagingLocal) {
      items = that._dataSource.sortLastLevelGroupItems(items, groups, expandedInfo.paths);
      items = expandedInfo.skip ? items.slice(expandedInfo.skip) : items;
      items = expandedInfo.take ? items.slice(0, expandedInfo.take) : items;
    }
    each(expandedInfo.items, (index, item) => {
      const itemCount = item.count - (index === 0 && expandedInfo.skip || 0);
      const expandedItems = items.splice(0, itemCount);

      applyContinuationToGroupItem(options, expandedInfo, groups.length - 1, index);
      item.items = expandedItems;
    });
    options.data.resolve(data);
  }).fail(options.data.reject);
}

const loadGroupTotalCount = function (dataSource, options) {
  // @ts-expect-error
  const d = new Deferred();
  const isGrouping = !!(options.group && options.group.length);
  const loadOptions = extend({
    skip: 0, take: 1, requireGroupCount: isGrouping, requireTotalCount: !isGrouping,
  }, options, { group: isGrouping ? options.group : null });

  dataSource.load(loadOptions).done((data, extra) => {
    const count = extra && (isGrouping ? extra.groupCount : extra.totalCount);

    if (!isFinite(count)) {
      d.reject(dataErrors.Error(isGrouping ? 'E4022' : 'E4021'));
      return;
    }
    d.resolve(count);
  }).fail(d.reject.bind(d));
  return d;
};

export class GroupingHelper extends GroupingHelperCore {
  public updateTotalItemsCount(options) {
    let totalItemsCount = 0;
    const totalCount = options.extra && options.extra.totalCount || 0;
    const groupCount = options.extra && options.extra.groupCount || 0;
    const pageSize = this._dataSource.pageSize();
    const isVirtualPaging = this._isVirtualPaging();

    foreachExpandedGroups(this, (groupInfo) => {
      groupInfo.childrenTotalCount = 0;
    });

    foreachExpandedGroups(this, (groupInfo, parents) => {
      const totalOffset = getTotalOffset(parents, isVirtualPaging ? 0 : pageSize, totalItemsCount);
      let count = groupInfo.count + groupInfo.childrenTotalCount;

      if (!isVirtualPaging) {
        count += getContinuationGroupCount(totalOffset, pageSize, count, parents.length - 1);
      }
      if (parents[parents.length - 2]) {
        parents[parents.length - 2].childrenTotalCount += count;
      } else {
        totalItemsCount += count;
      }
    });
    super.updateTotalItemsCount(totalItemsCount - totalCount + groupCount);
  }

  private _isGroupExpanded(groupIndex) {
    const groups = this._dataSource.group();
    return isGroupExpanded(groups, groupIndex);
  }

  private _updatePagingOptions(options, callback?) {
    const that = this;
    const isVirtualPaging = that._isVirtualPaging();
    const pageSize = that._dataSource.pageSize();
    const skips: any[] = [];
    const takes: any[] = [];
    let skipChildrenTotalCount = 0;
    let childrenTotalCount = 0;

    if (options.take) {
      foreachExpandedGroups(this, (groupInfo) => {
        groupInfo.childrenTotalCount = 0;
        groupInfo.skipChildrenTotalCount = 0;
      });
      foreachExpandedGroups(that, (groupInfo, parents) => {
        let take;
        let takeCorrection = 0;
        let parentTakeCorrection = 0;
        const totalOffset = getTotalOffset(parents, isVirtualPaging ? 0 : pageSize, childrenTotalCount);
        let continuationGroupCount = 0;
        let skipContinuationGroupCount = 0;
        let groupInfoCount = groupInfo.count + groupInfo.childrenTotalCount;
        let childrenGroupInfoCount = groupInfoCount;

        callback && callback(groupInfo, totalOffset);

        const skip = options.skip - totalOffset;
        if (totalOffset <= options.skip + options.take && groupInfoCount) {
          take = options.take;

          if (!isVirtualPaging) {
            continuationGroupCount = getContinuationGroupCount(totalOffset, pageSize, groupInfoCount, parents.length - 1);
            groupInfoCount += continuationGroupCount * parents.length;
            childrenGroupInfoCount += continuationGroupCount;
            if (pageSize && skip >= 0) {
              takeCorrection = parents.length;
              parentTakeCorrection = parents.length - 1;
              skipContinuationGroupCount = Math.floor(skip / pageSize);
            }
          }

          if (skip >= 0) {
            if (totalOffset + groupInfoCount > options.skip) {
              skips.unshift(skip - skipContinuationGroupCount * takeCorrection - groupInfo.skipChildrenTotalCount);
            }
            if (totalOffset + groupInfoCount >= options.skip + take) {
              takes.unshift(take - takeCorrection - groupInfo.childrenTotalCount + groupInfo.skipChildrenTotalCount);
            }
          } else if (totalOffset + groupInfoCount >= options.skip + take) {
            takes.unshift(take + skip - groupInfo.childrenTotalCount);
          }
        }

        if (totalOffset <= options.skip) {
          if (parents[parents.length - 2]) {
            parents[parents.length - 2].skipChildrenTotalCount += Math.min(childrenGroupInfoCount, skip + 1 - skipContinuationGroupCount * parentTakeCorrection);
          } else {
            skipChildrenTotalCount += Math.min(childrenGroupInfoCount, skip + 1);
          }
        }
        if (totalOffset <= options.skip + take) {
          groupInfoCount = Math.min(childrenGroupInfoCount, skip + take - (skipContinuationGroupCount + 1) * parentTakeCorrection);
          if (parents[parents.length - 2]) {
            parents[parents.length - 2].childrenTotalCount += groupInfoCount;
          } else {
            childrenTotalCount += groupInfoCount;
          }
        }
      });
      options.skip -= skipChildrenTotalCount;
      options.take -= childrenTotalCount - skipChildrenTotalCount;
    }

    options.skips = skips;
    options.takes = takes;
  }

  private changeRowExpand(path) {
    const that = this;
    const groupInfo = that.findGroupInfo(path);
    const dataSource = that._dataSource;
    const remoteGroupPaging = dataSource.remoteOperations().groupPaging;
    const groups = dataGridCore.normalizeSortingInfo(dataSource.group());

    if (groupInfo) {
      groupInfo.isExpanded = !groupInfo.isExpanded;

      if (remoteGroupPaging && groupInfo.isExpanded && path.length < groups.length) {
        return loadGroupTotalCount(dataSource, {
          filter: createGroupFilter(path, {
            filter: dataSource.lastLoadOptions().filter,
            group: dataSource.group(),
          }),
          group: [groups[path.length]],
          select: dataSource.select(),
        }).done((groupCount) => {
          groupInfo.count = groupCount;
        });
      }
      // @ts-expect-error
      return new Deferred().resolve();
    }
    // @ts-expect-error
    return new Deferred().reject();
  }

  protected handleDataLoading(options?) {
    const that = this;
    const { storeLoadOptions } = options;
    const groups = dataGridCore.normalizeSortingInfo(storeLoadOptions.group || options.loadOptions.group);

    if (options.isCustomLoading || !groups.length) {
      return;
    }

    if (options.remoteOperations.grouping) {
      const remotePaging = that._dataSource.remoteOperations().paging;

      storeLoadOptions.group = dataGridCore.normalizeSortingInfo(storeLoadOptions.group);
      storeLoadOptions.group.forEach((group, index) => {
        const isLastGroup = index === storeLoadOptions.group.length - 1;
        group.isExpanded = !remotePaging || !isLastGroup;
      });
    }

    options.group = options.group || groups;

    if (options.remoteOperations.paging) {
      options.skip = storeLoadOptions.skip;
      options.take = storeLoadOptions.take;
      storeLoadOptions.requireGroupCount = true;
      storeLoadOptions.group = groups.slice(0, 1);
      that._updatePagingOptions(options);

      storeLoadOptions.skip = options.skip;
      storeLoadOptions.take = options.take;
    } else {
      options.skip = options.loadOptions.skip;
      options.take = options.loadOptions.take;
      that._updatePagingOptions(options);
    }
  }

  protected handleDataLoadedCore(options, callBase) {
    const that = this;
    const loadedGroupCount = dataGridCore.normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group).length;
    const groupCount = options.group ? options.group.length : 0;
    let totalCount;
    const expandedInfo = {};

    if (options.isCustomLoading) {
      callBase(options);

      processGroupItems(that, options.data, loadedGroupCount, expandedInfo, [], options.isCustomLoading, options.storeLoadOptions.isLoadingAll);
    } else {
      if (!options.remoteOperations.paging) {
        that.foreachGroups((groupInfo) => { groupInfo.count = 0; });
      }

      totalCount = updateGroupInfos(that, options, options.data, loadedGroupCount);

      if (totalCount < 0) {
        // @ts-expect-error
        options.data = new Deferred().reject(errors.Error('E1037'));
        return;
      }

      if (!options.remoteOperations.paging) {
        if (loadedGroupCount && options.extra && options.loadOptions.requireTotalCount) {
          options.extra.totalCount = totalCount;
          options.extra.groupCount = options.data.length;
        }
      }

      if (groupCount && options.storeLoadOptions.requireGroupCount && !isFinite(options.extra.groupCount)) {
        // @ts-expect-error
        options.data = new Deferred().reject(dataErrors.Error('E4022'));
        return;
      }

      that.updateTotalItemsCount(options);

      if (!options.remoteOperations.paging) {
        that._updatePagingOptions(options);
        options.lastLoadOptions.skips = options.skips;
        options.lastLoadOptions.takes = options.takes;
      }
      callBase(options);

      if (!options.remoteOperations.paging) {
        that._processPaging(options, loadedGroupCount);
      }
    }

    loadGroupItems(that, options, loadedGroupCount, expandedInfo, 0, options.data);
  }

  private _processSkips(items, skips, groupCount) {
    if (!groupCount) return;

    const firstItem = items[0];
    const skip = skips[0];
    const children = firstItem && firstItem.items;

    if (skip !== undefined) {
      firstItem.isContinuation = true;

      if (children) {
        firstItem.items = children.slice(skip);
        this._processSkips(firstItem.items, skips.slice(1), groupCount - 1);
      }
    }
  }

  private _processTakes(items, skips, takes, groupCount, parents?) {
    if (!groupCount || !items) return;

    parents = parents || [];

    const lastItem = items[items.length - 1];
    let children = lastItem && lastItem.items;
    const take = takes[0];
    const skip = skips[0];

    if (lastItem) {
      const maxTakeCount = (lastItem.count - (lastItem.isContinuation && skip || 0)) || children.length;

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

  private _processPaging(options, groupCount) {
    this._processSkips(options.data, options.skips, groupCount);
    this._processTakes(options.data, options.skips, options.takes, groupCount);
  }

  private isLastLevelGroupItemsPagingLocal() {
    return false;
  }

  private sortLastLevelGroupItems(items) {
    return items;
  }

  protected refresh(options, operationTypes?) {
    const that = this;
    const dataSource = that._dataSource;
    const { storeLoadOptions } = options;
    const group = options.group || options.storeLoadOptions.group;
    const oldGroups = dataGridCore.normalizeSortingInfo(that._group);
    let isExpanded;
    let groupIndex;

    function handleGroup(groupInfo, parents) {
      if (parents.length === groupIndex + 1) {
        groupInfo.isExpanded = isExpanded;
      }
    }

    for (groupIndex = 0; groupIndex < oldGroups.length; groupIndex++) {
      isExpanded = isGroupExpanded(group, groupIndex);
      if (isGroupExpanded(that._group, groupIndex) !== isExpanded) {
        that.foreachGroups(handleGroup);
      }
    }

    // @ts-expect-error
    super.refresh.apply(this, arguments);

    if (group && options.remoteOperations.paging && operationTypes.reload) {
      return foreachExpandedGroups(that, (groupInfo) => {
        const groupCountQuery = loadGroupTotalCount(dataSource, {
          filter: createGroupFilter(groupInfo.path, {
            filter: storeLoadOptions.filter,
            group,
          }),
          group: group.slice(groupInfo.path.length),
          select: storeLoadOptions.select,
        });
        const groupOffsetQuery = loadGroupTotalCount(dataSource, {
          filter: createOffsetFilter(groupInfo.path, {
            filter: storeLoadOptions.filter,
            group,
          }, true),
          group: group.slice(groupInfo.path.length - 1, groupInfo.path.length),
          select: storeLoadOptions.select,
        });

        return when(groupOffsetQuery, groupCountQuery).done((offset, count) => {
          // eslint-disable-next-line radix
          offset = parseInt(offset.length ? offset[0] : offset);
          // eslint-disable-next-line radix
          count = parseInt(count.length ? count[0] : count);
          groupInfo.offset = offset;
          if (groupInfo.count !== count) {
            groupInfo.count = count;
            that.updateTotalItemsCount(options);
          }
        });
      }, true);
    }
  }
}

/// #DEBUG
export { getContinuationGroupCount };
/// #ENDDEBUG
