import core from './ui.tree_list.core';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import focusModule from '../grid_core/ui.grid_core.focus';

function findIndex(items, callback) {
    var result = -1;

    items.forEach(function(node, index) {
        if(callback(node)) {
            result = index;
        }
    });

    return result;
}

core.registerModule('focus', extend(true, {}, focusModule, {
    extenders: {
        controllers: {
            data: {
                changeRowExpand: function(key) {
                    if(this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
                        if(this._isFocusedRowInside(key)) {
                            this.option('focusedRowKey', key);
                        }
                    }

                    return this.callBase.apply(this, arguments);
                },
                _isFocusedRowInside: function(parentKey) {
                    var focusedRowKey = this.option('focusedRowKey'),
                        rowIndex = this.getRowIndexByKey(focusedRowKey),
                        focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex],
                        parent = focusedRow && focusedRow.node.parent;

                    while(parent) {
                        if(parent.key === parentKey) {
                            return true;
                        }
                        parent = parent.parent;
                    }

                    return false;
                },
                getParentKey: function(key) {
                    var that = this,
                        dataSource = that._dataSource,
                        node = that.getNodeByKey(key),
                        d = new Deferred();

                    if(node) {
                        d.resolve(node.parent ? node.parent.key : undefined);
                    } else {
                        dataSource.load({
                            filter: [dataSource.getKeyExpr(), '=', key]
                        }).done(function(items) {
                            var parentData = items[0];

                            if(parentData) {
                                d.resolve(dataSource.parentKeyOf(parentData));
                            } else {
                                d.reject();
                            }
                        }).fail(d.reject);
                    }

                    return d.promise();
                },
                expandAscendants: function(key) {
                    var that = this,
                        dataSource = that._dataSource,
                        d = new Deferred();

                    that.getParentKey(key).done(function(parentKey) {
                        if(dataSource && parentKey !== undefined && parentKey !== that.option('rootValue')) {
                            dataSource._isNodesInitializing = true;
                            that.expandRow(parentKey);
                            dataSource._isNodesInitializing = false;
                            that.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
                        } else {
                            d.resolve();
                        }
                    }).fail(d.reject);

                    return d.promise();
                },
                getPageIndexByKey: function(key) {
                    var that = this,
                        dataSource = that._dataSource,
                        d = new Deferred();

                    that.expandAscendants(key).done(function() {
                        dataSource.load({
                            filter: that.getCombinedFilter(),
                            sort: that.getController('columns').getSortDataSourceParameters(!dataSource.remoteOperations().sorting),
                            parentIds: []
                        }).done(function(nodes) {
                            var offset = findIndex(nodes, function(node) {
                                return that.keyOf(node.data) === key;
                            });

                            var pageIndex = that.pageIndex();

                            if(offset >= 0) {
                                pageIndex = Math.floor(offset / that.pageSize());
                            }

                            d.resolve(pageIndex);
                        }).fail(d.reject);
                    }).fail(d.reject);

                    return d.promise();
                }
            }
        }
    }
}));
