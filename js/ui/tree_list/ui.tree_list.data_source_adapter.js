import treeListCore from './ui.tree_list.core';
import errors from '../widget/ui.errors';
import { equalByValue } from '../../core/utils/common';
import typeUtils from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import dataCoreUtils from '../../core/utils/data';
import { extend } from '../../core/utils/extend';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import ArrayStore from '../../data/array_store';
import query from '../../data/query';
import DataSourceAdapter from '../grid_core/ui.grid_core.data_source_adapter';
import { Deferred, when } from '../../core/utils/deferred';
import { queryByOptions } from '../../data/store_helper';

var DEFAULT_KEY_EXPRESSION = "id";

var isFullBranchFilterMode = (that) => that.option("filterMode") === "fullBranch";

var DataSourceAdapterTreeList = DataSourceAdapter.inherit((function() {
    var getChildKeys = function(that, keys) {
        var childKeys = [];

        keys.forEach(function(key) {
            var node = that.getNodeByKey(key);

            node && node.children.forEach(function(child) {
                childKeys.push(child.key);
            });
        });

        return childKeys;
    };

    return {
        _createKeyGetter: function() {
            var keyExpr = this.getKeyExpr();

            return dataCoreUtils.compileGetter(keyExpr);
        },

        _createKeySetter: function() {
            var keyExpr = this.getKeyExpr();

            if(typeUtils.isFunction(keyExpr)) {
                return keyExpr;
            }

            return dataCoreUtils.compileSetter(keyExpr);
        },

        _createParentIdGetter: function() {
            return dataCoreUtils.compileGetter(this.option("parentIdExpr"));
        },

        createParentIdSetter: function() {
            var parentIdExpr = this.option("parentIdExpr");

            if(typeUtils.isFunction(parentIdExpr)) {
                return parentIdExpr;
            }

            return dataCoreUtils.compileSetter(parentIdExpr);
        },

        _createItemsGetter: function() {
            return dataCoreUtils.compileGetter(this.option("itemsExpr"));
        },

        _createHasItemsGetter: function() {
            var hasItemsExpr = this.option("hasItemsExpr");

            return hasItemsExpr && dataCoreUtils.compileGetter(hasItemsExpr);
        },

        _createHasItemsSetter: function() {
            var hasItemsExpr = this.option("hasItemsExpr");

            if(typeUtils.isFunction(hasItemsExpr)) {
                return hasItemsExpr;
            }

            return hasItemsExpr && dataCoreUtils.compileSetter(hasItemsExpr);
        },

        _updateIndexByKeyObject: function(items) {
            var that = this;

            that._indexByKey = {};

            each(items, function(index, item) {
                that._indexByKey[item.key] = index;
            });
        },

        _calculateHasItems: function(node, options) {
            var that = this,
                parentIds = options.storeLoadOptions.parentIds,
                hasItems,
                isFullBranch = isFullBranchFilterMode(that);

            if(that._hasItemsGetter && (parentIds || !options.storeLoadOptions.filter || isFullBranch)) {
                hasItems = that._hasItemsGetter(node.data);
            }

            if(hasItems === undefined) {
                if(!that._isChildrenLoaded[node.key] && options.remoteOperations.filtering && (parentIds || isFullBranch)) {
                    hasItems = true;
                } else if(options.loadOptions.filter && !options.remoteOperations.filtering && isFullBranch) {
                    hasItems = node.children.length;
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

                if((that.isRowExpanded(nodes[i].key, options) || !nodes[i].visible) && nodes[i].hasChildren && nodes[i].children.length) {
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

            parentId = typeUtils.isDefined(parentId) ? parentId : rootValue;
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
                nodeByKey = that._nodeByKey = {},
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

            if(this._itemsGetter && !data.isConverted) {
                result = result || [];

                for(var i = 0; i < data.length; i++) {
                    item = gridCoreUtils.createObjectWithChanges(data[i]);

                    key = this._keyGetter(item);
                    if(key === undefined) {
                        key = result.length + 1;
                        this._keySetter(item, key);
                    }

                    this._parentIdSetter(item, parentId === undefined ? this.option("rootValue") : parentId);

                    result.push(item);

                    childItems = this._itemsGetter(item);
                    if(childItems && childItems.length) {
                        this._convertDataToPlainStructure(childItems, key, result);

                        itemsExpr = this.option("itemsExpr");
                        if(!typeUtils.isFunction(itemsExpr)) {
                            delete item[itemsExpr];
                        }
                    }
                }

                result.isConverted = true;

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
                if((!this._lastLoadOptions || operationTypes.filtering && !options.storeLoadOptions.filter) && !options.isCustomLoading) {
                    expandVisibleNodes = true;
                }
            }

            if(!options.isCustomLoading) {
                this._isReload = this._isReload || isReload || operationTypes.reload;

                if(!options.cachedStoreData) {
                    this._isChildrenLoaded = {};
                }

                if(this.option("expandNodesOnFiltering") && (operationTypes.filtering || this._isReload && options.storeLoadOptions.filter)) {
                    if(options.storeLoadOptions.filter) {
                        expandVisibleNodes = true;
                    } else {
                        options.collapseVisibleNodes = true;
                    }
                }
            }

            options.expandVisibleNodes = expandVisibleNodes;
        },

        _getParentIdsToLoad: function(parentIds) {
            var parentIdsToLoad = [];

            for(var i = 0; i < parentIds.length; i++) {
                var node = this.getNodeByKey(parentIds[i]);

                if(node && node.hasChildren && !node.children.length) {
                    parentIdsToLoad.push(parentIds[i]);
                }
            }

            return parentIdsToLoad;
        },

        _handleDataLoading: function(options) {
            var parentIdsToLoad,
                expandedRowKeys,
                rootValue = this.option("rootValue"),
                parentIdExpr = this.option("parentIdExpr"),
                parentIds = options.storeLoadOptions.parentIds;

            if(parentIds) {
                options.isCustomLoading = false;
            }

            this.callBase.apply(this, arguments);

            if(options.remoteOperations.filtering && !options.isCustomLoading) {
                if(isFullBranchFilterMode(this) && options.cachedStoreData || !options.storeLoadOptions.filter) {
                    expandedRowKeys = options.collapseVisibleNodes ? [] : this.option("expandedRowKeys");
                    parentIds = [rootValue].concat(expandedRowKeys).concat(parentIds || []);
                    parentIdsToLoad = options.data ? this._getParentIdsToLoad(parentIds) : parentIds;

                    if(parentIdsToLoad.length) {
                        options.cachedPagingData = undefined;
                        options.data = undefined;
                        options.mergeStoreLoadData = true;
                    }

                    options.storeLoadOptions.parentIds = parentIdsToLoad;
                    options.storeLoadOptions.filter = this._createIdFilter(parentIdExpr, parentIdsToLoad);
                }
            }
        },

        _generateInfoToLoad: function(data, needChildren) {
            var that = this,
                key,
                keyMap = {},
                resultKeyMap = {},
                resultKeys = [],
                needToLoad,
                rootValue = that.option("rootValue"),
                i;

            for(i = 0; i < data.length; i++) {
                key = needChildren ? that._parentIdGetter(data[i]) : that._keyGetter(data[i]);
                keyMap[key] = true;
            }

            for(i = 0; i < data.length; i++) {
                key = needChildren ? that._keyGetter(data[i]) : that._parentIdGetter(data[i]);
                needToLoad = needChildren ? that.isRowExpanded(key) : key !== rootValue;

                if(!keyMap[key] && !resultKeyMap[key] && needToLoad) {
                    resultKeyMap[key] = true;
                    resultKeys.push(key);
                }
            }

            return {
                keyMap: resultKeyMap,
                keys: resultKeys
            };
        },

        _loadParentsOrChildren: function(data, options, needChildren) {
            var that = this,
                store,
                filter,
                keyExpr,
                filterLength,
                needLocalFiltering,
                { keys, keyMap } = that._generateInfoToLoad(data, needChildren),
                d = new Deferred(),
                isRemoteFiltering = options.remoteOperations.filtering,
                maxFilterLengthInRequest = that.option("maxFilterLengthInRequest"),
                loadOptions = isRemoteFiltering ? options.storeLoadOptions : options.loadOptions;

            function concatLoadedData(loadedData) {
                if(isRemoteFiltering) {
                    that._cachedStoreData = that._cachedStoreData.concat(loadedData);
                }
                return data.concat(loadedData);
            }

            if(!keys.length) {
                return d.resolve(data);
            }

            var cachedNodes = keys.map(id => this.getNodeByKey(id)).filter(node => node && node.data);

            if(cachedNodes.length === keys.length) {
                if(needChildren) {
                    cachedNodes = cachedNodes.reduce((result, node) => {
                        return result.concat(node.children);
                    }, []);
                }

                if(cachedNodes.length) {
                    return that._loadParentsOrChildren(concatLoadedData(cachedNodes.map(node => node.data)), options, needChildren);
                }
            }

            keyExpr = needChildren ? that.option("parentIdExpr") : that.getKeyExpr();
            filter = that._createIdFilter(keyExpr, keys);
            filterLength = encodeURI(JSON.stringify(filter)).length;

            if(filterLength > maxFilterLengthInRequest) {
                filter = function(itemData) {
                    return keyMap[that._keyGetter(itemData)];
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
                    that._loadParentsOrChildren(concatLoadedData(loadedData), options, needChildren).done(d.resolve).fail(d.reject);
                } else {
                    d.resolve(data);
                }
            }).fail(d.reject);

            return d;
        },

        _loadParents: function(data, options) {
            return this._loadParentsOrChildren(data, options);
        },

        _loadChildrenIfNeed: function(data, options) {
            if(isFullBranchFilterMode(this)) {
                return this._loadParentsOrChildren(data, options, true);
            }

            return when(data);
        },

        _updateHasItemsMap: function(options) {
            var parentIds = options.storeLoadOptions.parentIds;

            if(parentIds) {
                for(var i = 0; i < parentIds.length; i++) {
                    this._isChildrenLoaded[parentIds[i]] = true;
                }
            }
        },

        _getKeyInfo: function() {
            return {
                key: () => "key",
                keyOf: data => data.key
            };
        },

        _applyBatch: function(changes) {
            var baseChanges = [];

            changes.forEach(change => {
                if(change.type === "insert") {
                    baseChanges = baseChanges.concat(this._applyInsert(change));
                } else if(change.type === "remove") {
                    baseChanges = baseChanges.concat(this._applyRemove(change));
                } else if(change.type === "update") {
                    baseChanges.push({ type: change.type, key: change.key, data: { data: change.data } });
                }
            });

            this.callBase(baseChanges);
        },

        _setHasItems: function(node, value) {
            var hasItemsSetter = this._hasItemsSetter;
            node.hasChildren = value;
            if(hasItemsSetter && node.data) {
                hasItemsSetter(node.data, value);
            }
        },

        _applyInsert: function(change) {
            var that = this,
                baseChanges = [],
                parentId = that.parentKeyOf(change.data),
                parentNode = that.getNodeByKey(parentId);

            if(parentNode) {
                var rootValue = that.option("rootValue"),
                    node = that._convertItemToNode(change.data, rootValue, that._nodeByKey);

                node.hasChildren = false;
                node.level = parentNode.level + 1;
                node.visible = true;

                parentNode.children.push(node);

                that._isChildrenLoaded[node.key] = true;

                that._setHasItems(parentNode, true);

                if((!parentNode.parent || that.isRowExpanded(parentNode.key)) && change.index !== undefined) {
                    var index = that.items().indexOf(parentNode) + 1;

                    index += change.index >= 0 ? Math.min(change.index, parentNode.children.length) : parentNode.children.length;

                    baseChanges.push({ type: change.type, data: node, index: index });
                }
            }

            return baseChanges;
        },

        _applyRemove: function(change) {
            var baseChanges = [];
            var node = this.getNodeByKey(change.key);
            var parentNode = node.parent;

            if(parentNode) {
                var index = parentNode.children.indexOf(node);
                if(index >= 0) {
                    parentNode.children.splice(index, 1);

                    if(!parentNode.children.length) {
                        this._setHasItems(parentNode, false);
                    }

                    baseChanges.push(change);
                    baseChanges = baseChanges.concat(this.getChildNodeKeys(change.key).map(key => {
                        return { type: change.type, key: key };
                    }));
                }
            }

            return baseChanges;
        },

        _handleDataLoaded: function(options) {
            var data = options.data = this._convertDataToPlainStructure(options.data);
            if(!options.remoteOperations.filtering && options.loadOptions.filter) {
                options.fullData = queryByOptions(query(options.data), { sort: options.loadOptions && options.loadOptions.sort }).toArray();
            }
            this._updateHasItemsMap(options);
            this.callBase(options);

            if(data.isConverted && this._cachedStoreData) {
                this._cachedStoreData.isConverted = true;
            }
        },

        _fillNodes: function(nodes, options, expandedRowKeys, level) {
            var isFullBranch = isFullBranchFilterMode(this);

            level = level || 0;
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i],
                    needToExpand = false;

                // node.hasChildren = false;
                this._fillNodes(nodes[i].children, options, expandedRowKeys, level + 1);

                node.level = level;
                node.hasChildren = this._calculateHasItems(node, options);

                if(node.visible && node.hasChildren) {
                    if(isFullBranch) {
                        if(node.children.filter(node => node.visible).length) {
                            needToExpand = true;
                        } else if(node.children.length) {
                            treeListCore.foreachNodes(node.children, function(node) {
                                node.visible = true;
                            });
                        }
                    } else {
                        needToExpand = true;
                    }
                    if(options.expandVisibleNodes && needToExpand) {
                        expandedRowKeys.push(node.key);
                    }
                }

                if(node.visible || node.hasChildren) {
                    node.parent.hasChildren = true;
                }
            }
        },

        _processTreeStructure: function(options, visibleItems) {
            var data = options.data,
                parentIds = options.storeLoadOptions.parentIds,
                expandedRowKeys = [];

            if(parentIds && parentIds.length || this._isReload) {
                if(options.fullData && options.fullData.length > options.data.length) {
                    data = options.fullData;
                    visibleItems = visibleItems || options.data;
                }

                this._rootNode = this._createNodesByItems(data, visibleItems);
                if(!this._rootNode) {
                    options.data = new Deferred().reject(errors.Error("E1046", this.getKeyExpr()));
                    return;
                }
                this._fillNodes(this._rootNode.children, options, expandedRowKeys);

                this._isNodesInitializing = true;
                if(options.collapseVisibleNodes || expandedRowKeys.length) {
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
                visibleItems,
                parentIds = options.storeLoadOptions.parentIds,
                needLoadParents = filter && (!parentIds || !parentIds.length) && filterMode !== "standard";

            if(!options.isCustomLoading) {
                if(needLoadParents) {
                    var d = options.data = new Deferred();

                    if(filterMode === "matchOnly") {
                        visibleItems = data;
                    }
                    return that._loadParents(data, options).done(function(data) {
                        that._loadChildrenIfNeed(data, options).done((data) => {
                            options.data = data;
                            that._processTreeStructure(options, visibleItems);
                            callBase.call(that, options);
                            d.resolve(options.data);
                        });
                    }).fail(d.reject);
                } else {
                    that._processTreeStructure(options);
                }
            }

            that.callBase(options);
        },

        _handlePush: function(changes) {
            let reshapeOnPush = this._dataSource._reshapeOnPush,
                isNeedReshape = reshapeOnPush && !!changes.length;

            if(isNeedReshape) {
                this._isReload = true;
            }

            this.callBase.apply(this, arguments);
        },

        init: function(dataSource, remoteOperations) {
            this.callBase.apply(this, arguments);

            var dataStructure = this.option("dataStructure");

            this._keyGetter = this._createKeyGetter();
            this._parentIdGetter = this._createParentIdGetter();
            this._hasItemsGetter = this._createHasItemsGetter();
            this._hasItemsSetter = this._createHasItemsSetter();

            if(dataStructure === "tree") {
                this._itemsGetter = this._createItemsGetter();
                this._keySetter = this._createKeySetter();
                this._parentIdSetter = this.createParentIdSetter();
            }

            this._nodeByKey = {};
            this._isChildrenLoaded = {};
            this._totalItemsCount = 0;
            this.createAction("onNodesInitialized");
        },

        getKeyExpr: function() {
            var store = this.store(),
                key = store && store.key(),
                keyExpr = this.option("keyExpr");

            if(typeUtils.isDefined(key) && typeUtils.isDefined(keyExpr)) {
                if(!equalByValue(key, keyExpr)) {
                    throw errors.Error("E1044");
                }
            }

            return key || keyExpr || DEFAULT_KEY_EXPRESSION;
        },

        keyOf: function(data) {
            return this._keyGetter && this._keyGetter(data);
        },

        parentKeyOf: function(data) {
            return this._parentIdGetter && this._parentIdGetter(data);
        },

        getRootNode: function() {
            return this._rootNode;
        },

        totalItemsCount: function() {
            return this._totalItemsCount;
        },

        isRowExpanded: function(key, cache) {
            if(cache) {
                var isExpandedByKey = cache.isExpandedByKey;
                if(!isExpandedByKey) {
                    isExpandedByKey = cache.isExpandedByKey = {};
                    this.option("expandedRowKeys").forEach(function(key) {
                        isExpandedByKey[key] = true;
                    });
                }
                return !!isExpandedByKey[key];
            }

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
            return this._isNodesInitializing ? new Deferred().resolve() : this.load();
        },

        getNodeByKey: function(key) {
            if(this._nodeByKey) {
                return this._nodeByKey[key];
            }
        },

        getNodeLeafKeys: function() {
            var that = this,
                node,
                result = [],
                keys = that._rootNode ? [that._rootNode.key] : [];

            keys.forEach(function(key) {
                node = that.getNodeByKey(key);

                node && treeListCore.foreachNodes([node], function(childNode) {
                    !childNode.children.length && result.push(childNode.key);
                });
            });

            return result;
        },

        getChildNodeKeys: function(parentKey) {
            var node = this.getNodeByKey(parentKey),
                childrenKeys = [];

            node && treeListCore.foreachNodes(node.children, function(childNode) {
                childrenKeys.push(childNode.key);
            });

            return childrenKeys;
        },

        loadDescendants: function(keys, childrenOnly) {
            var that = this,
                loadOptions,
                d = new Deferred(),
                remoteOperations = that.remoteOperations();

            if(typeUtils.isDefined(keys)) {
                keys = Array.isArray(keys) ? keys : [keys];
            } else {
                keys = that.getNodeLeafKeys();
            }

            if(!remoteOperations.filtering || !keys.length) {
                return d.resolve();
            }

            loadOptions = that._dataSource._createStoreLoadOptions();
            loadOptions.parentIds = keys;

            that.load(loadOptions)
                .done(function() {
                    if(!childrenOnly) {
                        var childKeys = getChildKeys(that, keys);

                        if(childKeys.length) {
                            that.loadDescendants(childKeys, childrenOnly).done(d.resolve).fail(d.reject);
                            return;
                        }
                    }
                    d.resolve();
                })
                .fail(d.reject);

            return d.promise();
        },

        forEachNode: function() {
            var nodes = [],
                callback,
                rootNode;

            if(arguments.length === 1) {
                callback = arguments[0];

                rootNode = this.getRootNode();
                nodes = rootNode && rootNode.children || [];
            } else if(arguments.length === 2) {
                callback = arguments[1];

                nodes = arguments[0];
                nodes = Array.isArray(nodes) ? nodes : [nodes];
            }

            treeListCore.foreachNodes(nodes, callback);
        }
    };
})());


module.exports = {
    extend: function(extender) {
        DataSourceAdapterTreeList = DataSourceAdapterTreeList.inherit(extender);
    },
    create: function(component) {
        return new DataSourceAdapterTreeList(component);
    }
};
