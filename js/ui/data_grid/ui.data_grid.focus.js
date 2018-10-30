var gridCore = require("./ui.data_grid.core"),
    focusModule = require("../grid_core/ui.grid_core.focus"),
    Deferred = require("../../core/utils/deferred").Deferred,
    isDefined = require("../../core/utils/type").isDefined,
    equalByValue = require("../../core/utils/common").equalByValue,
    createGroupFilter = require("./ui.data_grid.utils").createGroupFilter,
    extend = require("../../core/utils/extend").extend;

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991/* IE11 */;

gridCore.registerModule("focus", extend(true, {}, focusModule, {
    extenders: {
        controllers: {
            data: {
                _getGroupPath: function(group) {
                    var groupPath = [group.key],
                        items = group.items;

                    while(items && items[0]) {
                        var item = items[0];
                        if(item.key !== undefined) {
                            groupPath.push(item.key);
                        }
                        items = item.items;
                    }
                    return groupPath;
                },
                _expandGroupByPath: function(that, groupPath, level) {
                    var d = new Deferred();

                    level++;

                    that.expandRow(groupPath.slice(0, level)).done(function() {
                        if(level === groupPath.length) {
                            d.resolve();
                        } else {
                            that._expandGroupByPath(that, groupPath, level)
                                .done(d.resolve)
                                .fail(d.reject);
                        }
                    }).fail(d.reject);

                    return d.promise();
                },
                _calculateGlobalRowIndexByGroupedData: function(key) {
                    var that = this,
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key),
                        deferred = new Deferred(),
                        groupPath,
                        group = dataSource.group();

                    if(!dataSource._grouping._updatePagingOptions) {
                        that._calculateGlobalRowIndexByFlatData(key, null, true)
                            .done(deferred.resolve)
                            .fail(deferred.reject);
                        return deferred;
                    }

                    dataSource.load({
                        filter: that._concatWithCombinedFilter(filter),
                        group: group,
                    }).done(function(data) {

                        if(!data || data.length === 0 || !isDefined(data[0].key) || data[0].key === -1) {
                            return deferred.promise();
                        }

                        groupPath = that._getGroupPath(data[0]);

                        that._expandGroupByPath(that, groupPath, 0).done(function() {

                            that._calculateExpandedRowGlobalIndex(deferred, key, groupPath, group);

                        }).fail(deferred.reject);
                    }).fail(deferred.reject);

                    return deferred.promise();
                },
                _calculateExpandedRowGlobalIndex: function(deferred, key, groupPath, group) {
                    var groupFilter = createGroupFilter(groupPath, { group: group }),
                        dataSource = this._dataSource,
                        scrollingMode = this.option("scrolling.mode"),
                        isVirtualScrolling = scrollingMode === "virtual" || scrollingMode === "infinite",
                        pageSize = dataSource.pageSize(),
                        groupOffset;

                    dataSource._grouping._updatePagingOptions({ skip: 0, take: MAX_SAFE_INTEGER }, function(groupInfo, totalOffset) {
                        if(equalByValue(groupInfo.path, groupPath)) {
                            groupOffset = totalOffset;
                        }
                    });

                    this._calculateGlobalRowIndexByFlatData(key, groupFilter).done(function(dataOffset) {
                        var count,
                            currentPageOffset,
                            groupContinuationCount;

                        currentPageOffset = (groupOffset % pageSize) || pageSize;

                        count = currentPageOffset + dataOffset - groupPath.length;

                        if(isVirtualScrolling) {
                            groupContinuationCount = 0;
                        } else {
                            groupContinuationCount = Math.floor(count / (pageSize - groupPath.length)) * groupPath.length;
                        }

                        count = groupOffset + dataOffset + groupContinuationCount;

                        deferred.resolve(count);

                    }).fail(deferred.reject);
                }
            }
        }
    }
}));
