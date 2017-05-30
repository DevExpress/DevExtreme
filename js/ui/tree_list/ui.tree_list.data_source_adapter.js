"use strict";

var $ = require("../../core/renderer"),
    errors = require("../widget/ui.errors"),
    commonUtils = require("../../core/utils/common"),
    dataCoreUtils = require("../../core/utils/data"),
    extend = require("../../core/utils/extend").extend,
    gridCoreUtils = require("../grid_core/ui.grid_core.utils"),
    ArrayStore = require("../../data/array_store"),
    query = require("../../data/query"),
    DataSourceAdapter = require("../grid_core/ui.grid_core.data_source_adapter");

var DEFAULT_KEY_EXPRESSION = "id";

DataSourceAdapter = DataSourceAdapter.inherit((function() {
    return {
        _createKeyGetter: function() {
            var keyExpr = this.getKeyExpr();

            return dataCoreUtils.compileGetter(keyExpr);
        },

        _createKeySetter: function() {
            var keyExpr = this.getKeyExpr();

            return dataCoreUtils.compileSetter(keyExpr);
        },

        _createParentIdGetter: function() {
            return dataCoreUtils.compileGetter(this.option("parentIdExpr"));
        },

        createParentIdSetter: function() {
            return dataCoreUtils.compileSetter(this.option("parentIdExpr"));
        },

        _createItemsGetter: function() {
            return dataCoreUtils.compileGetter(this.option("itemsExpr"));
        },

        _createHasItemsGetter: function() {
            var hasItemsExpr = this.option("hasItemsExpr");

            return hasItemsExpr && dataCoreUtils.compileGetter(hasItemsExpr);
        },

        _updateIndexByKeyObject: function(items) {
            var that = this;

            that._indexByKey = {};

            $.each(items, function(index, item) {
                that._indexByKey[item.key] = index;
            });
        },

        _calculateHasItems: function(node, options) {
            var that = this,
                hasItems;

            if(that._hasItemsGetter) {
                hasItems = that._hasItemsGetter(node.data);
            }
            if(hasItems === undefined) {
                var hasItemsByMap = that._hasItemsMap[node.key];
                if(hasItemsByMap !== undefined) {
                    hasItems = hasItemsByMap;
                } else if(options.remoteOperations.filtering && options.storeLoadOptions.parentIds) {
                    hasItems = true;
                } else {
                    hasItems = node.hasChildren;
                }
            }
            return !!hasItems;
        },

        _createVisibleItemsByNodes: function(nodes, options) {
            var that = this,
                result = [];

            for(var i = 0; i < nodes.length; i++) {
                if(nodes[i].visible) {
                    result.push(nodes[i]);
                }

                if((that.isRowExpanded(nodes[i].key) || !nodes[i].visible) && nodes[i].hasChildren && nodes[i].children.length) {
                    result = result.concat(that._createVisibleItemsByNodes(nodes[i].children, options));
                }
            }

            return result;
        },

        _convertItemToNode: function(item, rootValue, nodeByKey) {
            var key = this._keyGetter(item),
                parentId = this._parentIdGetter(item),
                parentNode,
                node;

            parentId = commonUtils.isDefined(parentId) ? parentId : rootValue;
            parentNode = nodeByKey[parentId] = nodeByKey[parentId] || { key: parentId, children: [] };

            node = nodeByKey[key] = nodeByKey[key] || { key: key, children: [] };
            node.data = item;
            node.parent = parentNode;

            return node;
        },

        _createNodesByItems: function(items, visibleItems) {
            var that = this,
                rootValue = that.option("rootValue"),
                visibleByKey = {},
                nodeByKey = {},
                i;

            if(visibleItems) {
                for(i = 0; i < visibleItems.length; i++) {
                    visibleByKey[this._keyGetter(visibleItems[i])] = true;
                }
            }

            for(i = 0; i < items.length; i++) {
                var node = that._convertItemToNode(items[i], rootValue, nodeByKey);

                if(node.key === undefined) {
                    return;
                }

                node.visible = !visibleItems || !!visibleByKey[node.key];
                if(node.parent) {
                    node.parent.children.push(node);
                }
            }

            var rootNode = nodeByKey[rootValue] || { key: rootValue, children: [] };

            rootNode.level = -1;

            return rootNode;
        },

        _convertDataToPlainStructure: function(data, parentId, result) {
            var key,
                item,
                itemsExpr,
                childItems;

            if(this._itemsGetter) {
                result = result || [];

                for(var i = 0; i < data.length; i++) {
                    item = extend({}, data[i]);

                    key = this._keyGetter(item);
                    if(key === undefined) {
                        key = result.length + 1;
                        this._keySetter(item, key);
                    }

                    if(this._parentIdGetter(item) === undefined) {
                        this._parentIdSetter(item, parentId === undefined ? this.option("rootValue") : parentId);
                    }

                    result.push(item);

                    childItems = this._itemsGetter(item);
                    if(childItems && childItems.length) {
                        this._convertDataToPlainStructure(childItems, key, result);

                        itemsExpr = this.option("itemsExpr");
                        if(!commonUtils.isFunction(itemsExpr)) {
                            delete item[itemsExpr];
                        }
                    }
                }

                return result;
            }

            return data;
        },

        _createIdFilter: function(field, keys) {
            var parentIdFilters = [];

            for(var i = 0; i < keys.length; i++) {
                parentIdFilters.push([field, "=", keys[i]]);
            }
            return gridCoreUtils.combineFilters(parentIdFilters, "or");
        },

        _customizeRemoteOperations: function(options, isReload, operationTypes) {
            this.callBase.apply(this, arguments);

            options.remoteOperations.paging = false;

            var expandVisibleNodes = false;

            if(this.option("autoExpandAll")) {
                options.remoteOperations.sorting = false;
                options.remoteOperations.filtering = false;
                if(isReload && !options.isCustomLoading) {
                    expandVisibleNodes = true;
                }
            }

            this._isReload = this._isReload || isReload || operationTypes.reload;

            if((isReload || operationTypes.filtering) && !options.isCustomLoading) {
                this._hasItemsMap = {};

                if((options.storeLoadOptions.filter || (operationTypes.filtering && this.option("autoExpandAll"))) && this.option("expandNodesOnFiltering")) {
                    expandVisibleNodes = true;
                }
            }

            options.expandVisibleNodes = expandVisibleNodes;
        },

        _getParentIdsToLoad: function(parentIds) {
            var parentIdsToLoad = [];

            for(var i = 0; i < parentIds.length; i++) {
                if(!this._hasItemsMap[parentIds[i]]) {
                    parentIdsToLoad.push(parentIds[i]);
                }
            }

            return parentIdsToLoad;
        },

        _handleDataLoading: function(options) {
            var combinedParentIdFilter,
                rootValue = this.option("rootValue"),
                parentIdExpr = this.option("parentIdExpr"),
                expandedRowKeys = this.option("expandedRowKeys"),
                filterMode = this.option("filterMode");

            this.callBase.apply(this, arguments);

            if(options.remoteOperations.filtering && !options.isCustomLoading) {
                if(filterMode === "standard" || !options.storeLoadOptions.filter) {
                    var parentIds = [rootValue].concat(expandedRowKeys),
                        parentIdsToLoad = options.data ? this._getParentIdsToLoad(parentIds) : parentIds;

                    if(parentIdsToLoad.length) {
                        options.cachedPagingData = undefined;
                        options.data = undefined;
                        options.mergeStoreLoadData = true;
                    }
                    options.storeLoadOptions.parentIds = parentIdsToLoad;

                    combinedParentIdFilter = this._createIdFilter(parentIdExpr, parentIdsToLoad);
                    options.storeLoadOptions.filter = gridCoreUtils.combineFilters([combinedParentIdFilter, options.storeLoadOptions.filter]);
                }
            }
        },

        _generateParentInfoToLoad: function(data) {
            var that = this,
                keyMap = {},
                parentIdMap = {},
                parentIds = [],
                rootValue = that.option("rootValue"),
                i;

            for(i = 0; i < data.length; i++) {
                keyMap[that._keyGetter(data[i])] = true;
            }

            for(i = 0; i < data.length; i++) {
                var parentId = that._parentIdGetter(data[i]);
                if(!parentIdMap[parentId] && !keyMap[parentId] && parentId !== rootValue) {
                    parentIdMap[parentId] = true;
                    parentIds.push(parentId);
                }
            }

            return {
                parentIdMap: parentIdMap,
                parentIds: parentIds
            };
        },

        _loadParents: function(data, options) {
            var that = this,
                store,
                filter,
                filterLength,
                needLocalFiltering,
                parentInfo = that._generateParentInfoToLoad(data),
                parentIds = parentInfo.parentIds,
                parentIdMap = parentInfo.parentIdMap,
                d = $.Deferred(),
                isRemoteFiltering = options.remoteOperations.filtering,
                maxFilterLengthInRequest = that.option("maxFilterLengthInRequest"),
                loadOptions = isRemoteFiltering ? options.storeLoadOptions : options.loadOptions;

            if(!parentIds.length) {
                return d.resolve(data);
            }

            filter = that._createIdFilter(that.getKeyExpr(), parentIds);
            filterLength = encodeURI(JSON.stringify(filter)).length;

            if(filterLength > maxFilterLengthInRequest) {
                filter = function(itemData) {
                    return parentIdMap[that._keyGetter(itemData)];
                };

                needLocalFiltering = isRemoteFiltering;
            }

            loadOptions = extend({}, loadOptions, {
                filter: !needLocalFiltering ? filter : null
            });

            store = options.fullData ? new ArrayStore(options.fullData) : that._dataSource.store();

            store.load(loadOptions).done(function(loadedData) {
                if(loadedData.length) {
                    if(needLocalFiltering) {
                        loadedData = query(loadedData).filter(filter).toArray();
                    }
                    that._loadParents(data.concat(loadedData), options).done(d.resolve).fail(d.reject);
                } else {
                    d.resolve(data);
                }
            }).fail(d.reject);

            return d;
        },

        _updateHasItemsMap: function(options) {
            var data = options.data,
                parentIds = options.storeLoadOptions.parentIds;

            if(parentIds) {
                for(var i = 0; i < parentIds.length; i++) {
                    for(var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                        var parentId = this._parentIdGetter(data[dataIndex]);

                        if(parentId === parentIds[i]) {
                            this._hasItemsMap[parentIds[i]] = true;
                            break;
                        }
                    }

                    if(dataIndex === data.length) {
                        this._hasItemsMap[parentIds[i]] = false;
                    }
                }
            }
        },

        _handleDataLoaded: function(options) {
            options.data = this._convertDataToPlainStructure(options.data);
            if(!options.remoteOperations.filtering) {
                options.fullData = options.data;
            }
            this._updateHasItemsMap(options);
            this.callBase(options);
        },

        _fillNodes: function(nodes, options, expandedRowKeys, level) {
            level = level || 0;
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                //node.hasChildren = false;
                this._fillNodes(nodes[i].children, options, expandedRowKeys, level + 1);

                node.level = level;
                node.hasChildren = this._calculateHasItems(node, options);

                if(node.visible && node.hasChildren && options.expandVisibleNodes) {
                    expandedRowKeys.push(node.key);
                }

                if(node.visible || node.hasChildren) {
                    node.parent.hasChildren = true;
                }
            }
        },

        _processTreeStructure: function(options, visibleItems) {
            var data = options.data,
                expandedRowKeys = [];

            if(!options.fullData || this._isReload) {
                if(options.fullData && options.fullData.length > options.data.length) {
                    data = options.fullData;
                    visibleItems = visibleItems || options.data;
                }

                this._rootNode = this._createNodesByItems(data, visibleItems);
                if(!this._rootNode) {
                    options.data = $.Deferred().reject(errors.Error("E1046", this.getKeyExpr()));
                    return;
                }
                this._fillNodes(this._rootNode.children, options, expandedRowKeys);

                this._isNodesInitializing = true;
                if(expandedRowKeys.length) {
                    this.option("expandedRowKeys", expandedRowKeys);
                }
                this.executeAction("onNodesInitialized", { root: this._rootNode });
                this._isNodesInitializing = false;
                this._isReload = false;
            }

            data = this._createVisibleItemsByNodes(this._rootNode.children, options);

            options.data = data;
            this._totalItemsCount = data.length;
        },

        _handleDataLoadedCore: function(options) {
            var that = this,
                data = options.data,
                callBase = that.callBase,
                filter = options.storeLoadOptions.filter || options.loadOptions.filter,
                filterMode = that.option("filterMode"),
                visibleItems;

            if(!options.isCustomLoading) {
                if(filter && !options.storeLoadOptions.parentIds && filterMode !== "standard") {
                    var d = options.data = $.Deferred();
                    if(filterMode === "smart") {
                        visibleItems = data;
                    }
                    return that._loadParents(data, options).done(function(data) {
                        options.data = data;
                        that._processTreeStructure(options, visibleItems);
                        callBase.call(that, options);
                        d.resolve(options.data);
                    }).fail(d.reject);
                } else {
                    that._processTreeStructure(options);
                }
            }

            that.callBase(options);
        },

        init: function(dataSource, remoteOperations) {
            this.callBase.apply(this, arguments);

            var dataStructure = this.option("dataStructure");

            this._keyGetter = this._createKeyGetter();
            this._parentIdGetter = this._createParentIdGetter();
            this._hasItemsGetter = this._createHasItemsGetter();

            if(dataStructure === "tree") {
                this._itemsGetter = this._createItemsGetter();
                this._keySetter = this._createKeySetter();
                this._parentIdSetter = this.createParentIdSetter();
            }

            this._hasItemsMap = {};
            this._totalItemsCount = 0;
            this.createAction("onNodesInitialized");
        },

        getKeyExpr: function() {
            var store = this.store(),
                key = store && store.key(),
                keyExpr = this.option("keyExpr");

            if(commonUtils.isDefined(key) && commonUtils.isDefined(keyExpr)) {
                if(!commonUtils.equalByValue(key, keyExpr)) {
                    throw errors.Error("E1044");
                }
            }

            return key || keyExpr || DEFAULT_KEY_EXPRESSION;
        },

        keyOf: function(data) {
            return this._keyGetter && this._keyGetter(data);
        },

        getRootNode: function() {
            return this._rootNode;
        },

        totalItemsCount: function() {
            return this._totalItemsCount;
        },

        isRowExpanded: function(key) {
            var indexExpandedNodeKey = gridCoreUtils.getIndexByKey(key, this.option("expandedRowKeys"), null);

            return indexExpandedNodeKey >= 0;
        },

        _changeRowExpandCore: function(key) {
            var expandedRowKeys = this.option("expandedRowKeys"),
                indexExpandedNodeKey = gridCoreUtils.getIndexByKey(key, expandedRowKeys, null);

            if(indexExpandedNodeKey < 0) {
                expandedRowKeys.push(key);
            } else {
                expandedRowKeys.splice(indexExpandedNodeKey, 1);
            }

            this.option("expandedRowKeys", expandedRowKeys);
        },

        changeRowExpand: function(key) {
            this._changeRowExpandCore(key);
            return this._isNodesInitializing ? $.Deferred().resolve() : this.load();
        }
    };
})());


module.exports = {
    extend: function(extender) {
        DataSourceAdapter = DataSourceAdapter.inherit(extender);
    },
    create: function(component) {
        return new DataSourceAdapter(component);
    }
};
