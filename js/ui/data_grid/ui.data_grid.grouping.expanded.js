import { toComparable } from '../../core/utils/data';
import { keysEqual } from '../../data/utils';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { arrangeSortingInfo, multiLevelGroup } from '../../data/store_helper';
import { combineFilters, normalizeSortingInfo } from './ui.data_grid.core';
import { GroupingHelper, createOffsetFilter } from './ui.data_grid.grouping.core';
import { createGroupFilter } from './ui.data_grid.utils';
import dataQuery from '../../data/query';
import { when, Deferred } from '../../core/utils/deferred';

const loadTotalCount = function(dataSource, options) {
    const d = new Deferred();
    const loadOptions = extend({ skip: 0, take: 1, requireTotalCount: true }, options);

    dataSource.load(loadOptions).done(function(data, extra) {
        d.resolve(extra && extra.totalCount);
    }).fail(d.reject.bind(d));
    return d;
};

///#DEBUG
exports.loadTotalCount = loadTotalCount;
///#ENDDEBUG

exports.GroupingHelper = GroupingHelper.inherit((function() {

    const foreachCollapsedGroups = function(that, callback, updateOffsets) {
        return that.foreachGroups(function(groupInfo) {
            if(!groupInfo.isExpanded) {
                return callback(groupInfo);
            }
        }, false, false, updateOffsets, true);
    };

    const correctSkipLoadOption = function(that, skip) {
        let skipCorrection = 0;
        let resultSkip = skip || 0;

        if(skip) {
            foreachCollapsedGroups(that, function(groupInfo) {
                if(groupInfo.offset - skipCorrection >= skip) {
                    return false;
                }
                skipCorrection += groupInfo.count - 1;
            });
            resultSkip += skipCorrection;
        }
        return resultSkip;
    };

    var processGroupItems = function(that, items, path, offset, skipFirstItem, take) {
        let i;
        let item;
        let offsetInfo;
        let removeLastItemsCount = 0;
        let needRemoveFirstItem = false;

        for(i = 0; i < items.length; i++) {
            item = items[i];
            if(item.items !== undefined) {
                path.push(item.key);
                const groupInfo = that.findGroupInfo(path);

                if(groupInfo && !groupInfo.isExpanded) {
                    item.collapsedItems = item.items;
                    item.items = null;
                    offset += groupInfo.count;
                    take--;
                    if(take < 0) {
                        removeLastItemsCount++;
                    }
                    if(skipFirstItem) {
                        needRemoveFirstItem = true;
                    }
                } else if(item.items) {
                    offsetInfo = processGroupItems(that, item.items, path, offset, skipFirstItem, take);
                    if(skipFirstItem) {
                        if(offsetInfo.offset - offset > 1) {
                            item.isContinuation = true;
                        } else {
                            needRemoveFirstItem = true;
                        }
                    }
                    offset = offsetInfo.offset;
                    take = offsetInfo.take;
                    if(take < 0) {
                        if(item.items.length) {
                            item.isContinuationOnNextPage = true;
                        } else {
                            removeLastItemsCount++;
                        }
                    }
                }
                path.pop();
            } else {
                if(skipFirstItem) {
                    needRemoveFirstItem = true;
                }
                offset++;
                take--;
                if(take < 0) {
                    removeLastItemsCount++;
                }

            }
            skipFirstItem = false;
        }
        if(needRemoveFirstItem) {
            items.splice(0, 1);
        }
        if(removeLastItemsCount) {
            items.splice(-removeLastItemsCount, removeLastItemsCount);
        }
        return {
            offset: offset,
            take: take
        };
    };

    const pathEquals = function(path1, path2) {
        let i;
        if(path1.length !== path2.length) return false;
        for(i = 0; i < path1.length; i++) {
            if(!keysEqual(null, path1[i], path2[i])) {
                return false;
            }
        }
        return true;
    };

    var updateGroupOffsets = function(that, items, path, offset, additionalGroupInfo) {
        let i;
        let item;

        if(!items) return;

        for(i = 0; i < items.length; i++) {
            item = items[i];
            if('key' in item && item.items !== undefined) {
                path.push(item.key);
                if(additionalGroupInfo && pathEquals(additionalGroupInfo.path, path) && !item.isContinuation) {
                    additionalGroupInfo.offset = offset;
                }
                const groupInfo = that.findGroupInfo(path);
                if(groupInfo && !item.isContinuation) {
                    groupInfo.offset = offset;
                }
                if(groupInfo && !groupInfo.isExpanded) {
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

    const removeGroupLoadOption = function(storeLoadOptions, loadOptions) {
        let groups;
        let sorts;

        if(loadOptions.group) {
            groups = normalizeSortingInfo(loadOptions.group);
            sorts = normalizeSortingInfo(storeLoadOptions.sort);
            storeLoadOptions.sort = arrangeSortingInfo(groups, sorts);
            delete loadOptions.group;
        }
    };

    const createNotGroupFilter = function(path, storeLoadOptions, group) {
        const groups = normalizeSortingInfo(group || storeLoadOptions.group);
        let i;
        let j;
        let filterElement;
        let filter = [];

        for(i = 0; i < path.length; i++) {
            filterElement = [];
            for(j = 0; j <= i; j++) {
                filterElement.push([groups[j].selector, i === j ? '<>' : '=', path[j]]);
            }
            filter.push(combineFilters(filterElement));
        }
        filter = combineFilters(filter, 'or');

        return combineFilters([filter, storeLoadOptions.filter]);
    };

    var getGroupCount = function(item, groupCount) {
        let count = item.count || item.items.length;
        let i;

        if(!item.count && groupCount > 1) {
            count = 0;
            for(i = 0; i < item.items.length; i++) {
                count += getGroupCount(item.items[i], groupCount - 1);
            }
        }

        return count;
    };

    return {
        handleDataLoading: function(options) {
            const that = this;
            const storeLoadOptions = options.storeLoadOptions;
            let loadOptions;
            const collapsedGroups = [];
            let collapsedItemsCount = 0;
            let skipFirstItem = false;
            let take;
            const group = options.loadOptions.group;
            let skipCorrection = 0;

            removeGroupLoadOption(storeLoadOptions, options.loadOptions);

            options.group = options.group || group;

            if(options.isCustomLoading) {
                return;
            }

            loadOptions = extend({}, storeLoadOptions);

            loadOptions.skip = correctSkipLoadOption(that, storeLoadOptions.skip);

            if(loadOptions.skip && loadOptions.take && group) {
                loadOptions.skip--;
                loadOptions.take++;
                skipFirstItem = true;
            }

            if(loadOptions.take && group) {
                take = loadOptions.take;
                loadOptions.take++;
            }

            foreachCollapsedGroups(that, function(groupInfo) {
                if(groupInfo.offset >= loadOptions.skip + loadOptions.take + skipCorrection) {
                    return false;
                } else if(groupInfo.offset >= loadOptions.skip + skipCorrection && groupInfo.count) {
                    skipCorrection += groupInfo.count - 1;
                    collapsedGroups.push(groupInfo);
                    collapsedItemsCount += groupInfo.count;
                }
            });

            each(collapsedGroups, function() {
                loadOptions.filter = createNotGroupFilter(this.path, loadOptions, group);
            });

            options.storeLoadOptions = loadOptions;
            options.collapsedGroups = collapsedGroups;
            options.collapsedItemsCount = collapsedItemsCount;
            options.skip = loadOptions.skip || 0;
            options.skipFirstItem = skipFirstItem;
            options.take = take;
        },
        handleDataLoaded: function(options, callBase) {
            const that = this;
            let data = options.data;
            let pathIndex;
            let query;
            const collapsedGroups = options.collapsedGroups;
            const groups = normalizeSortingInfo(options.group);
            const groupCount = groups.length;

            function appendCollapsedPath(data, path, groups, collapsedGroup, offset) {
                if(!data || !path.length || !groups.length) return;

                let i;
                let keyValue;
                const pathValue = toComparable(path[0], true);

                for(i = 0; i < data.length; i++) {
                    keyValue = toComparable(data[i].key, true);
                    if(offset >= collapsedGroup.offset || pathValue === keyValue) {
                        break;
                    } else {
                        offset += getGroupCount(data[i], groups.length);
                    }
                }

                if(!data.length || pathValue !== keyValue) {
                    data.splice(i, 0, { key: path[0], items: [], count: path.length === 1 ? collapsedGroup.count : undefined });
                }
                appendCollapsedPath(data[i].items, path.slice(1), groups.slice(1), collapsedGroup, offset);
            }

            if(options.collapsedItemsCount && options.extra && options.extra.totalCount >= 0) {
                options.extra.totalCount += options.collapsedItemsCount;
            }

            callBase(options);

            if(groupCount) {
                query = dataQuery(data);
                multiLevelGroup(query, groups).enumerate().done(function(groupedData) {
                    data = groupedData;
                });
                if(collapsedGroups) {
                    for(pathIndex = 0; pathIndex < collapsedGroups.length; pathIndex++) {
                        appendCollapsedPath(data, collapsedGroups[pathIndex].path, groups, collapsedGroups[pathIndex], options.skip);
                    }
                }
                if(!options.isCustomLoading) {
                    processGroupItems(that, data, [], options.skip, options.skipFirstItem, options.take);
                }
                options.data = data;
            }
        },
        isGroupItemCountable: function(item) {
            return item.items === null;
        },
        updateTotalItemsCount: function() {
            let itemsCountCorrection = 0;

            foreachCollapsedGroups(this, function(groupInfo) {
                if(groupInfo.count) {
                    itemsCountCorrection -= groupInfo.count - 1;
                }
            });
            this.callBase(itemsCountCorrection);
        },
        changeRowExpand: function(path) {
            const that = this;
            const dataSource = that._dataSource;
            const beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : dataSource.pageIndex();
            const dataSourceItems = dataSource.items();
            const offset = correctSkipLoadOption(that, beginPageIndex * dataSource.pageSize());
            let groupInfo = that.findGroupInfo(path);
            let groupCountQuery;

            if(groupInfo && !groupInfo.isExpanded) {
                groupCountQuery = new Deferred().resolve(groupInfo.count);
            } else {
                groupCountQuery = loadTotalCount(dataSource, {
                    filter: createGroupFilter(path, {
                        filter: dataSource.filter(),
                        group: dataSource.group()
                    })
                });
            }

            return when(groupCountQuery).done(function(count) {
                count = parseInt(count.length ? count[0] : count);
                if(groupInfo) {
                    updateGroupOffsets(that, dataSourceItems, [], offset);
                    groupInfo.isExpanded = !groupInfo.isExpanded;
                    groupInfo.count = count;
                } else {
                    groupInfo = {
                        offset: -1,
                        count: count,
                        path: path,
                        isExpanded: false
                    };
                    updateGroupOffsets(that, dataSourceItems, [], offset, groupInfo);
                    if(groupInfo.offset >= 0) {
                        that.addGroupInfo(groupInfo);
                    }
                }
                that.updateTotalItemsCount();
            }).fail(function() {
                dataSource._eventsStrategy.fireEvent('loadError', arguments);
            });
        },
        allowCollapseAll: function() {
            return false;
        },
        refresh: function(options, isReload, operationTypes) {
            const that = this;
            const storeLoadOptions = options.storeLoadOptions;
            const dataSource = that._dataSource;

            this.callBase.apply(this, arguments);

            if(isReload || operationTypes.reload) {
                return foreachCollapsedGroups(that, function(groupInfo) {
                    const groupCountQuery = loadTotalCount(dataSource, { filter: createGroupFilter(groupInfo.path, storeLoadOptions) });
                    const groupOffsetQuery = loadTotalCount(dataSource, { filter: createOffsetFilter(groupInfo.path, storeLoadOptions) });

                    return when(groupOffsetQuery, groupCountQuery).done(function(offset, count) {
                        offset = parseInt(offset.length ? offset[0] : offset);
                        count = parseInt(count.length ? count[0] : count);
                        groupInfo.offset = offset;
                        if(groupInfo.count !== count) {
                            groupInfo.count = count;
                            that.updateTotalItemsCount();
                        }
                    });
                }, true);
            }
        }
    };
})());
