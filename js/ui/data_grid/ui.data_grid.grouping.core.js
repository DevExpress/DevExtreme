import $ from '../../core/renderer';
import Class from '../../core/class';
import gridCore from './ui.data_grid.core';
import { normalizeSortingInfo } from '../../data/utils';
import { when } from '../../core/utils/deferred';

exports.createOffsetFilter = function(path, storeLoadOptions, lastLevelOnly) {
    const groups = normalizeSortingInfo(storeLoadOptions.group);
    let filter = [];

    for(let i = lastLevelOnly ? path.length - 1 : 0; i < path.length; i++) {
        const filterElement = [];
        for(let j = 0; j <= i; j++) {
            const selector = groups[j].selector;
            if(i === j && (path[j] === null || path[j] === false || path[j] === true)) {
                if(path[j] === false) {
                    filterElement.push([selector, '=', groups[j].desc ? true : null]);
                } else if(path[j] ? !groups[j].desc : groups[j].desc) {
                    filterElement.push([selector, '<>', path[j]]);
                } else {
                    filterElement.push([selector, '<>', null]);
                    filterElement.push([selector, '=', null]);
                }
            } else {
                const currentFilter = [selector, i === j ? (groups[j].desc ? '>' : '<') : '=', path[j]];
                if(currentFilter[1] === '<') {
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
};

exports.GroupingHelper = Class.inherit((function() {

    const findGroupInfoByKey = function(groupsInfo, key) {
        const hash = groupsInfo.hash;

        return hash && hash[JSON.stringify(key)];
    };

    const getGroupInfoIndexByOffset = function(groupsInfo, offset) {
        let leftIndex = 0;
        let rightIndex = groupsInfo.length - 1;

        if(!groupsInfo.length) {
            return 0;
        }

        do {
            const middleIndex = (rightIndex + leftIndex) >> 1;
            if(groupsInfo[middleIndex].offset > offset) {
                rightIndex = middleIndex;
            } else {
                leftIndex = middleIndex;
            }
        } while(rightIndex - leftIndex > 1);

        let index;
        for(index = leftIndex; index <= rightIndex; index++) {
            if(groupsInfo[index].offset > offset) {
                break;
            }
        }
        return index;
    };

    const cleanGroupsInfo = function(groupsInfo, groupIndex, groupsCount) {

        for(let i = 0; i < groupsInfo.length; i++) {
            if(groupIndex + 1 >= groupsCount) {
                groupsInfo[i].children = [];
            } else {
                cleanGroupsInfo(groupsInfo[i].children, groupIndex + 1, groupsCount);
            }
        }
    };

    const calculateItemsCount = function(that, items, groupsCount) {
        let result = 0;

        if(items) {
            if(!groupsCount) {
                result = items.length;
            } else {
                for(let i = 0; i < items.length; i++) {
                    if(that.isGroupItemCountable(items[i])) {
                        result++;
                    }
                    result += calculateItemsCount(that, items[i].items, groupsCount - 1);
                }
            }
        }
        return result;
    };

    return {
        ctor: function(dataSourceAdapter) {
            this._dataSource = dataSourceAdapter;
            this.reset();
        },
        reset: function() {
            this._groupsInfo = [];
            this._totalCountCorrection = 0;
        },
        totalCountCorrection: function() {
            return this._totalCountCorrection;
        },
        updateTotalItemsCount: function(totalCountCorrection) {
            this._totalCountCorrection = totalCountCorrection || 0;
        },
        isGroupItemCountable: function(item) {
            return !this._isVirtualPaging() || !item.isContinuation;
        },
        _isVirtualPaging: function() {
            const scrollingMode = this._dataSource.option('scrolling.mode');

            return scrollingMode === 'virtual' || scrollingMode === 'infinite';
        },
        itemsCount: function() {
            const dataSourceAdapter = this._dataSource;
            const dataSource = dataSourceAdapter._dataSource;
            const groupCount = gridCore.normalizeSortingInfo(dataSource.group() || []).length;
            const itemsCount = calculateItemsCount(this, dataSource.items(), groupCount);

            return itemsCount;
        },
        foreachGroups: function(callback, childrenAtFirst, foreachCollapsedGroups, updateOffsets, updateParentOffsets) {
            const that = this;

            function foreachGroupsCore(groupsInfo, callback, childrenAtFirst, parents) {
                const callbackResults = [];

                function executeCallback(callback, data, parents, callbackResults) {
                    const callbackResult = data && callback(data, parents);
                    callbackResult && callbackResults.push(callbackResult);
                    return callbackResult;
                }

                for(let i = 0; i < groupsInfo.length; i++) {
                    parents.push(groupsInfo[i].data);
                    if(!childrenAtFirst && executeCallback(callback, groupsInfo[i].data, parents, callbackResults) === false) {
                        return false;
                    }
                    if(!groupsInfo[i].data || groupsInfo[i].data.isExpanded || foreachCollapsedGroups) {
                        const children = groupsInfo[i].children;
                        const callbackResult = children.length && foreachGroupsCore(children, callback, childrenAtFirst, parents);
                        callbackResult && callbackResults.push(callbackResult);
                        if(callbackResult === false) {
                            return false;
                        }
                    }
                    if(childrenAtFirst && executeCallback(callback, groupsInfo[i].data, parents, callbackResults) === false) {
                        return false;
                    }
                    if(!groupsInfo[i].data || groupsInfo[i].data.offset !== groupsInfo[i].offset) {
                        updateOffsets = true;
                    }
                    parents.pop();
                }

                const currentParents = updateParentOffsets && parents.slice(0);
                return updateOffsets && when.apply($, callbackResults).always(function() {
                    that._updateGroupInfoOffsets(groupsInfo, currentParents);
                });
            }

            return foreachGroupsCore(that._groupsInfo, callback, childrenAtFirst, []);
        },
        _updateGroupInfoOffsets: function(groupsInfo, parents) {
            parents = parents || [];

            for(let index = 0; index < groupsInfo.length; index++) {
                const groupInfo = groupsInfo[index];

                if(groupInfo.data && groupInfo.data.offset !== groupInfo.offset) {
                    groupInfo.offset = groupInfo.data.offset;

                    for(let parentIndex = 0; parentIndex < parents.length; parentIndex++) {
                        parents[parentIndex].offset = groupInfo.offset;
                    }
                }
            }

            groupsInfo.sort(function(a, b) {
                return a.offset - b.offset;
            });
        },
        findGroupInfo: function(path) {
            const that = this;
            let groupInfo;
            let groupsInfo = that._groupsInfo;

            for(let pathIndex = 0; groupsInfo && pathIndex < path.length; pathIndex++) {
                groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
                groupsInfo = groupInfo && groupInfo.children;
            }

            return groupInfo && groupInfo.data;
        },
        addGroupInfo: function(groupInfoData) {
            const that = this;
            let groupInfo;
            const path = groupInfoData.path;
            let groupsInfo = that._groupsInfo;

            for(let pathIndex = 0; pathIndex < path.length; pathIndex++) {
                groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
                if(!groupInfo) {
                    groupInfo = {
                        key: path[pathIndex],
                        offset: groupInfoData.offset,
                        data: { offset: groupInfoData.offset, isExpanded: true, path: path.slice(0, pathIndex + 1) },
                        children: []
                    };
                    const index = getGroupInfoIndexByOffset(groupsInfo, groupInfoData.offset);
                    groupsInfo.splice(index, 0, groupInfo);
                    groupsInfo.hash = groupsInfo.hash || {};
                    groupsInfo.hash[JSON.stringify(groupInfo.key)] = groupInfo;
                }
                if(pathIndex === path.length - 1) {
                    groupInfo.data = groupInfoData;
                    if(groupInfo.offset !== groupInfoData.offset) {
                        that._updateGroupInfoOffsets(groupsInfo);
                    }
                }
                groupsInfo = groupInfo.children;
            }
        },
        allowCollapseAll: function() {
            return true;
        },
        refresh: function(options) {
            const that = this;
            const storeLoadOptions = options.storeLoadOptions;
            const groups = normalizeSortingInfo(storeLoadOptions.group || []);
            const oldGroups = '_group' in that ? normalizeSortingInfo(that._group || []) : groups;
            let groupsCount = Math.min(oldGroups.length, groups.length);

            that._group = storeLoadOptions.group;

            for(let groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
                if(oldGroups[groupIndex].selector !== groups[groupIndex].selector) {
                    groupsCount = groupIndex;
                    break;
                }
            }

            if(!groupsCount) {
                that.reset();
            } else {
                cleanGroupsInfo(that._groupsInfo, 0, groupsCount);
            }
        },
        handleDataLoading: function() {
        },
        handleDataLoaded: function(options, callBase) {
            callBase(options);
        },
        handleDataLoadedCore: function(options, callBase) {
            callBase(options);
        }
    };
})());
