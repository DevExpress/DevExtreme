import core from './ui.tree_list.core';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import focusModule from '../grid_core/ui.grid_core.focus';

function findIndex(items, callback) {
    let result = -1;

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
                    const focusedRowKey = this.option('focusedRowKey');
                    const rowIndex = this.getRowIndexByKey(focusedRowKey);
                    const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
                    let parent = focusedRow && focusedRow.node.parent;

                    while(parent) {
                        if(parent.key === parentKey) {
                            return true;
                        }
                        parent = parent.parent;
                    }

                    return false;
                },
                getParentKey: function(key) {
                    const that = this;
                    const dataSource = that._dataSource;
                    const node = that.getNodeByKey(key);
                    const d = new Deferred();

                    if(node) {
                        d.resolve(node.parent ? node.parent.key : undefined);
                    } else {
                        dataSource.load({
                            filter: [dataSource.getKeyExpr(), '=', key]
                        }).done(function(items) {
                            const parentData = items[0];

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
                    const that = this;
                    const dataSource = that._dataSource;
                    const d = new Deferred();

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
                    const that = this;
                    const dataSource = that._dataSource;
                    const d = new Deferred();

                    that.expandAscendants(key).done(function() {
                        dataSource.load({
                            filter: that.getCombinedFilter(),
                            sort: that.getController('columns').getSortDataSourceParameters(!dataSource.remoteOperations().sorting),
                            parentIds: []
                        }).done(function(nodes) {
                            const offset = findIndex(nodes, function(node) {
                                return that.keyOf(node.data) === key;
                            });

                            let pageIndex = that.pageIndex();

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
