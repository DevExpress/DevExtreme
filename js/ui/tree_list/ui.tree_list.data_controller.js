import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import treeListCore from './ui.tree_list.core';
import { equalByValue } from '../../core/utils/common';
import dataSourceAdapterProvider from './ui.tree_list.data_source_adapter';
import dataControllerModule from '../grid_core/ui.grid_core.data_controller';

exports.DataController = dataControllerModule.controllers.data.inherit((function() {
    return {
        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider;
        },

        _getNodeLevel: function(node) {
            let level = -1;
            while(node.parent) {
                if(node.visible) {
                    level++;
                }
                node = node.parent;
            }
            return level;
        },

        _generateDataItem: function(node, options) {
            return {
                rowType: 'data',
                node: node,
                key: node.key,
                data: node.data,
                isExpanded: this.isRowExpanded(node.key, options),
                level: this._getNodeLevel(node)
            };
        },

        _loadOnOptionChange: function() {
            this._dataSource.load();
        },

        init: function() {
            this.createAction('onRowExpanding');
            this.createAction('onRowExpanded');
            this.createAction('onRowCollapsing');
            this.createAction('onRowCollapsed');

            this.callBase.apply(this, arguments);
        },

        keyOf: function(data) {
            const dataSource = this._dataSource;

            if(dataSource) {
                return dataSource.keyOf(data);
            }
        },

        key: function() {
            const dataSource = this._dataSource;

            if(dataSource) {
                return dataSource.getKeyExpr();
            }
        },

        publicMethods: function() {
            return this.callBase().concat(['expandRow', 'collapseRow', 'isRowExpanded', 'getRootNode', 'getNodeByKey', 'loadDescendants', 'forEachNode']);
        },

        changeRowExpand: function(key) {
            if(this._dataSource) {
                const that = this;
                const args = {
                    key: key
                };
                const isExpanded = this.isRowExpanded(key);

                that.executeAction(isExpanded ? 'onRowCollapsing' : 'onRowExpanding', args);

                if(!args.cancel) {
                    return that._dataSource.changeRowExpand(key).done(function() {
                        that.executeAction(isExpanded ? 'onRowCollapsed' : 'onRowExpanded', args);
                    });
                }
            }

            return new Deferred().resolve();
        },

        /**
         * @name dxTreeListMethods.isRowExpanded
         * @publicName isRowExpanded(key)
         * @param1 key:any
         * @return boolean
         */
        isRowExpanded: function(key, cache) {
            return this._dataSource && this._dataSource.isRowExpanded(key, cache);
        },

        /**
         * @name dxTreeListMethods.expandRow
         * @publicName expandRow(key)
         * @param1 key:any
         * @return Promise<void>
         */
        expandRow: function(key) {
            if(!this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return new Deferred().resolve();
        },

        /**
         * @name dxTreeListMethods.collapseRow
         * @publicName collapseRow(key)
         * @param1 key:any
         * @return Promise<void>
         */
        collapseRow: function(key) {
            if(this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return new Deferred().resolve();
        },

        /**
         * @name dxTreeListMethods.getRootNode
         * @publicName getRootNode()
         * @return dxTreeListNode
         */
        getRootNode: function() {
            return this._dataSource && this._dataSource.getRootNode();
        },

        optionChanged: function(args) {
            switch(args.name) {
                case 'rootValue':
                case 'parentIdExpr':
                case 'itemsExpr':
                case 'filterMode':
                case 'expandNodesOnFiltering':
                case 'autoExpandAll':
                case 'hasItemsExpr':
                case 'dataStructure':
                    this._columnsController.reset();
                    this._items = [];
                    this._refreshDataSource();
                    args.handled = true;
                    break;
                case 'expandedRowKeys':
                case 'onNodesInitialized':
                    if(this._dataSource && !this._dataSource._isNodesInitializing && !equalByValue(args.value, args.previousValue)) {
                        this._loadOnOptionChange();
                    }
                    args.handled = true;
                    break;
                case 'maxFilterLengthInRequest':
                    args.handled = true;
                    break;
                default:
                    this.callBase(args);
            }
        },

        /**
         * @name dxTreeListMethods.getNodeByKey
         * @publicName getNodeByKey(key)
         * @param1 key:object|string|number
         * @return dxTreeListNode
         */
        getNodeByKey: function(key) {
            if(!this._dataSource) {
                return;
            }

            return this._dataSource.getNodeByKey(key);
        },

        getChildNodeKeys: function(parentKey) {
            if(!this._dataSource) {
                return;
            }

            return this._dataSource.getChildNodeKeys(parentKey);
        },

        /**
         * @name dxTreeListMethods.loadDescendants
         * @publicName loadDescendants()
         * @return Promise<void>
         */
        /**
         * @name dxTreeListMethods.loadDescendants
         * @publicName loadDescendants(keys)
         * @param1 keys:Array<any>
         * @return Promise<void>
         */
        /**
         * @name dxTreeListMethods.loadDescendants
         * @publicName loadDescendants(keys, childrenOnly)
         * @param1 keys:Array<any>
         * @param2 childrenOnly:boolean
         * @return Promise<void>
         */
        loadDescendants: function(keys, childrenOnly) {
            if(!this._dataSource) {
                return;
            }

            return this._dataSource.loadDescendants(keys, childrenOnly);
        },

        /**
         * @name dxTreeListMethods.forEachNode
         * @publicName forEachNode(nodes, callback)
         * @param1 nodes:Array<dxTreeListNode>
         * @param2 callback:function
         */
        /**
         * @name dxTreeListMethods.forEachNode
         * @publicName forEachNode(callback)
         * @param1 callback:function
         */
        forEachNode: function() {
            this._dataSource.forEachNode.apply(this, arguments);
        }
    };
})());

treeListCore.registerModule('data', {
    defaultOptions: function() {
        return extend({}, dataControllerModule.defaultOptions(), {
            /**
            * @name dxTreeListOptions.itemsExpr
            * @type string|function
            * @default "items"
            */
            itemsExpr: 'items',
            /**
            * @name dxTreeListOptions.keyExpr
            * @type string|function
            * @default "id"
            */
            /**
            * @name dxTreeListOptions.hasItemsExpr
            * @type string|function
            */
            /**
            * @name dxTreeListOptions.parentIdExpr
            * @type string|function
            * @default "parentId"
            */
            parentIdExpr: 'parentId',
            /**
            * @name dxTreeListOptions.rootValue
            * @type any
            * @default 0
            */
            rootValue: 0,
            /**
            * @name dxTreeListOptions.dataStructure
            * @type Enums.TreeListDataStructure
            * @default "plain"
            */
            dataStructure: 'plain',
            /**
            * @name dxTreeListOptions.expandedRowKeys
            * @type Array<any>
            * @default []
            * @fires dxTreeListOptions.onOptionChanged
            */
            expandedRowKeys: [],
            /**
            * @name dxTreeListOptions.filterMode
            * @type Enums.TreeListFilterMode
            * @default "withAncestors"
            */
            filterMode: 'withAncestors',
            /**
            * @name dxTreeListOptions.expandNodesOnFiltering
            * @type boolean
            * @default true
            */
            expandNodesOnFiltering: true,
            /**
            * @name dxTreeListOptions.autoExpandAll
            * @type boolean
            * @default false
            */
            autoExpandAll: false,

            /**
            * @name dxTreeListOptions.onNodesInitialized
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 root:dxTreeListNode
            * @extends Action
            * @action
            */
            onNodesInitialized: null,
            maxFilterLengthInRequest: 1500,
            /**
             * @name dxTreeListOptions.paging
             * @type object
             */
            paging: {
                /**
                 * @name dxTreeListOptions.paging.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false
            }
        });
    },
    controllers: {
        data: exports.DataController
    }
});
/**
 * @name dxTreeListNode
 * @type object
 */
/**
 * @name dxTreeListNode.key
 * @type any
 */
/**
 * @name dxTreeListNode.data
 * @type object
 */
/**
 * @name dxTreeListNode.parent
 * @type dxTreeListNode
 */
/**
 * @name dxTreeListNode.children
 * @type Array<dxTreeListNode>
 */
/**
 * @name dxTreeListNode.hasChildren
 * @type boolean
 */
/**
 * @name dxTreeListNode.visible
 * @type boolean
 */
/**
 * @name dxTreeListNode.level
 * @type number
 */
