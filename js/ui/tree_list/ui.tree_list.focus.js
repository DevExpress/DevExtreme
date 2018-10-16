var core = require("./ui.tree_list.core"),
    extend = require("../../core/utils/extend").extend,
    Deferred = require("../../core/utils/deferred").Deferred,
    focusModule = require("../grid_core/ui.grid_core.focus");

function findIndex(items, callback) {
    var result = -1;

    items.forEach(function(node, index) {
        if(callback(node)) {
            result = index;
        }
    });

    return result;
}

core.registerModule("focus", extend(true, {}, focusModule, {
    extenders: {
        controllers: {
            data: {
                getParentKey: function(key) {
                    var that = this,
                        dataSource = that._dataSource,
                        node = that.getNodeByKey(key),
                        d = new Deferred();

                    if(node) {
                        d.resolve(node.parent ? node.parent.key : undefined);
                    } else {
                        dataSource.load({
                            filter: [dataSource.getKeyExpr(), "=", key]
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
                        d = new Deferred();

                    that.getParentKey(key).done(function(parentKey) {
                        if(parentKey !== undefined && parentKey !== that.option("rootValue")) {
                            that.expandRow(parentKey);
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
                            sort: that.getController("columns").getSortDataSourceParameters(!dataSource.remoteOperations().sorting),
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
