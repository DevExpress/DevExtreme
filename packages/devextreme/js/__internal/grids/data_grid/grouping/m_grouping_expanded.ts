import dataQuery from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { keysEqual } from '@js/common/data/utils';
import { toComparable } from '@js/core/utils/data';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';

import dataGridCore from '../m_core';
import { createGroupFilter } from '../m_utils';
import { createOffsetFilter, GroupingHelper as GroupingHelperCore } from './m_grouping_core';

const loadTotalCount = function (dataSource, options) {
  // @ts-expect-error
  const d = new Deferred();
  const loadOptions = extend({ skip: 0, take: 1, requireTotalCount: true }, options);

  dataSource.load(loadOptions).done((data, extra) => {
    d.resolve(extra && extra.totalCount);
  }).fail(d.reject.bind(d));
  return d;
};

/// #DEBUG
export { loadTotalCount };

/// #ENDDEBUG

const foreachCollapsedGroups = function (that, callback, updateOffsets?) {
  return that.foreachGroups((groupInfo) => {
    if (!groupInfo.isExpanded) {
      return callback(groupInfo);
    }
  }, false, false, updateOffsets, true);
};

const correctSkipLoadOption = function (that, skip) {
  let skipCorrection = 0;
  let resultSkip = skip || 0;

  if (skip) {
    // @ts-expect-error
    foreachCollapsedGroups(that, (groupInfo) => {
      if (groupInfo.offset - skipCorrection >= skip) {
        return false;
      }
      skipCorrection += groupInfo.count - 1;
    });
    resultSkip += skipCorrection;
  }
  return resultSkip;
};

const processGroupItems = function (that, items, path, offset, skipFirstItem, take) {
  let removeLastItemsCount = 0;
  let needRemoveFirstItem = false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.items !== undefined) {
      path.push(item.key);
      const groupInfo = that.findGroupInfo(path);

      if (groupInfo && !groupInfo.isExpanded) {
        item.collapsedItems = item.items;
        item.items = null;
        offset += groupInfo.count;
        take--;
        if (take < 0) {
          removeLastItemsCount++;
        }
        if (skipFirstItem) {
          needRemoveFirstItem = true;
        }
      } else if (item.items) {
        const offsetInfo = processGroupItems(that, item.items, path, offset, skipFirstItem, take);
        if (skipFirstItem) {
          if (offsetInfo.offset - offset > 1) {
            item.isContinuation = true;
          } else {
            needRemoveFirstItem = true;
          }
        }
        offset = offsetInfo.offset;
        take = offsetInfo.take;
        if (take < 0) {
          if (item.items.length) {
            item.isContinuationOnNextPage = true;
          } else {
            removeLastItemsCount++;
          }
        }
      }
      path.pop();
    } else {
      if (skipFirstItem) {
        needRemoveFirstItem = true;
      }
      offset++;
      take--;
      if (take < 0) {
        removeLastItemsCount++;
      }
    }
    skipFirstItem = false;
  }
  if (needRemoveFirstItem) {
    items.splice(0, 1);
  }
  if (removeLastItemsCount) {
    items.splice(-removeLastItemsCount, removeLastItemsCount);
  }
  return {
    offset,
    take,
  };
};

const pathEquals = function (path1, path2) {
  if (path1.length !== path2.length) return false;
  for (let i = 0; i < path1.length; i++) {
    if (!keysEqual(null, path1[i], path2[i])) {
      return false;
    }
  }
  return true;
};

const updateGroupOffsets = function (that, items, path, offset, additionalGroupInfo?) {
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if ('key' in item && item.items !== undefined) {
      path.push(item.key);
      if (additionalGroupInfo && pathEquals(additionalGroupInfo.path, path) && !item.isContinuation) {
        additionalGroupInfo.offset = offset;
      }
      const groupInfo = that.findGroupInfo(path);
      if (groupInfo && !item.isContinuation) {
        groupInfo.offset = offset;
      }
      if (groupInfo && !groupInfo.isExpanded) {
        offset += groupInfo.count;
      } else {
        offset = updateGroupOffsets(that, item.items, path, offset, additionalGroupInfo);
      }
      path.pop();
    } else {
      offset++;
    }
  }
  return offset;
};

const removeGroupLoadOption = function (storeLoadOptions, loadOptions) {
  if (loadOptions.group) {
    const groups = dataGridCore.normalizeSortingInfo(loadOptions.group);
    const sorts = dataGridCore.normalizeSortingInfo(storeLoadOptions.sort);
    storeLoadOptions.sort = storeHelper.arrangeSortingInfo(groups, sorts);
    delete loadOptions.group;
  }
};

const createNotGroupFilter = function (path, storeLoadOptions, group) {
  const groups = dataGridCore.normalizeSortingInfo(group || storeLoadOptions.group);
  let filter: any[] = [];

  for (let i = 0; i < path.length; i++) {
    const filterElement: any[] = [];
    for (let j = 0; j <= i; j++) {
      filterElement.push([groups[j].selector, i === j ? '<>' : '=', path[j]]);
    }
    filter.push(dataGridCore.combineFilters(filterElement));
  }
  filter = dataGridCore.combineFilters(filter, 'or');

  return dataGridCore.combineFilters([filter, storeLoadOptions.filter]);
};

const getGroupCount = function (item, groupCount) {
  let count = item.count || item.items.length;

  if (!item.count && groupCount > 1) {
    count = 0;
    for (let i = 0; i < item.items.length; i++) {
      count += getGroupCount(item.items[i], groupCount - 1);
    }
  }

  return count;
};

export class GroupingHelper extends GroupingHelperCore {
  protected handleDataLoading(options?) {
    const that = this;
    const { storeLoadOptions } = options;
    const collapsedGroups: any[] = [];
    let collapsedItemsCount = 0;
    let skipFirstItem = false;
    let take;
    const { group } = options.loadOptions;
    let skipCorrection = 0;

    removeGroupLoadOption(storeLoadOptions, options.loadOptions);

    options.group = options.group || group;

    if (options.isCustomLoading) {
      return;
    }

    const loadOptions = extend({}, storeLoadOptions);

    loadOptions.skip = correctSkipLoadOption(that, storeLoadOptions.skip);

    if (loadOptions.skip && loadOptions.take && group) {
      loadOptions.skip--;
      loadOptions.take++;
      skipFirstItem = true;
    }

    if (loadOptions.take && group) {
      take = loadOptions.take;
      loadOptions.take++;
    }

    // @ts-expect-error
    foreachCollapsedGroups(that, (groupInfo) => {
      if (groupInfo.offset >= loadOptions.skip + loadOptions.take + skipCorrection) {
        return false;
      } if (groupInfo.offset >= loadOptions.skip + skipCorrection && groupInfo.count) {
        skipCorrection += groupInfo.count - 1;
        collapsedGroups.push(groupInfo);
        collapsedItemsCount += groupInfo.count;
      }
    });

    each(collapsedGroups, function () {
      loadOptions.filter = createNotGroupFilter(this.path, loadOptions, group);
    });

    options.storeLoadOptions = loadOptions;
    options.collapsedGroups = collapsedGroups;
    options.collapsedItemsCount = collapsedItemsCount;
    options.skip = loadOptions.skip || 0;
    options.skipFirstItem = skipFirstItem;
    options.take = take;
  }

  protected handleDataLoaded(options, callBase) {
    const that = this;
    const { collapsedGroups } = options;
    const groups = dataGridCore.normalizeSortingInfo(options.group);
    const groupCount = groups.length;

    function appendCollapsedPath(data, path, groups, collapsedGroup, offset) {
      if (!data || !path.length || !groups.length) return;

      let keyValue;
      let i;
      const pathValue = toComparable(path[0], true);

      for (i = 0; i < data.length; i++) {
        keyValue = toComparable(data[i].key, true);
        if (offset >= collapsedGroup.offset || pathValue === keyValue) {
          break;
        } else {
          offset += getGroupCount(data[i], groups.length);
        }
      }

      if (!data.length || pathValue !== keyValue) {
        data.splice(i, 0, { key: path[0], items: [], count: path.length === 1 ? collapsedGroup.count : undefined });
      }
      appendCollapsedPath(data[i].items, path.slice(1), groups.slice(1), collapsedGroup, offset);
    }

    if (options.collapsedItemsCount && options.extra && options.extra.totalCount >= 0) {
      if (!options.extra._totalCountWasIncreasedByCollapsedItems) {
        options.extra.totalCount += options.collapsedItemsCount;
        options.extra._totalCountWasIncreasedByCollapsedItems = true;
      }
    }

    callBase(options);

    if (groupCount) {
      let { data } = options;
      // @ts-expect-error
      const query = dataQuery(data);
      storeHelper.multiLevelGroup(query, groups).enumerate().done((groupedData) => {
        data = groupedData;
      });
      if (collapsedGroups) {
        for (let pathIndex = 0; pathIndex < collapsedGroups.length; pathIndex++) {
          appendCollapsedPath(data, collapsedGroups[pathIndex].path, groups, collapsedGroups[pathIndex], options.skip);
        }
      }
      if (!options.isCustomLoading) {
        processGroupItems(that, data, [], options.skip, options.skipFirstItem, options.take);
      }
      options.data = data;
    }
  }

  protected isGroupItemCountable(item) {
    return item.items === null;
  }

  protected updateTotalItemsCount() {
    let itemsCountCorrection = 0;

    foreachCollapsedGroups(this, (groupInfo) => {
      if (groupInfo.count) {
        itemsCountCorrection -= groupInfo.count - 1;
      }
    });
    super.updateTotalItemsCount(itemsCountCorrection);
  }

  private changeRowExpand(path) {
    const that = this;
    const dataSource = that._dataSource;
    const beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : dataSource.pageIndex();
    const dataSourceItems = dataSource.items();
    const offset = correctSkipLoadOption(that, beginPageIndex * dataSource.pageSize());
    let groupInfo = that.findGroupInfo(path);
    let groupCountQuery;

    if (groupInfo && !groupInfo.isExpanded) {
      // @ts-expect-error
      groupCountQuery = new Deferred().resolve(groupInfo.count);
    } else {
      groupCountQuery = loadTotalCount(dataSource, {
        filter: createGroupFilter(path, {
          filter: dataSource.filter(),
          group: dataSource.group(),
        }),
      });
    }

    return when(groupCountQuery).done((count) => {
      // eslint-disable-next-line radix
      count = parseInt(count.length ? count[0] : count);
      if (groupInfo) {
        updateGroupOffsets(that, dataSourceItems, [], offset);
        groupInfo.isExpanded = !groupInfo.isExpanded;
        groupInfo.count = count;
      } else {
        groupInfo = {
          offset: -1,
          count,
          path,
          isExpanded: false,
        };
        updateGroupOffsets(that, dataSourceItems, [], offset, groupInfo);
        if (groupInfo.offset >= 0) {
          that.addGroupInfo(groupInfo);
        }
      }
      that.updateTotalItemsCount();
    }).fail(function () {
      dataSource._eventsStrategy.fireEvent('loadError', arguments);
    });
  }

  protected allowCollapseAll() {
    return false;
  }

  protected refresh(options, operationTypes?) {
    const that = this;
    const { storeLoadOptions } = options;
    const dataSource = that._dataSource;

    // @ts-expect-error
    super.refresh.apply(this, arguments);

    if (operationTypes.reload) {
      return foreachCollapsedGroups(that, (groupInfo) => {
        const groupCountQuery = loadTotalCount(dataSource, { filter: createGroupFilter(groupInfo.path, storeLoadOptions) });
        const groupOffsetQuery = loadTotalCount(dataSource, { filter: createOffsetFilter(groupInfo.path, storeLoadOptions) });

        return when(groupOffsetQuery, groupCountQuery).done((offset, count) => {
          // eslint-disable-next-line radix
          offset = parseInt(offset.length ? offset[0] : offset);
          // eslint-disable-next-line radix
          count = parseInt(count.length ? count[0] : count);
          groupInfo.offset = offset;
          if (groupInfo.count !== count) {
            groupInfo.count = count;
            that.updateTotalItemsCount();
          }
        });
      }, true);
    }
  }
}
