"use strict";

var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend,
    treeListCore = require("./ui.tree_list.core"),
    dataSourceAdapterProvider = require("./ui.tree_list.data_source_adapter"),
    dataControllerModule = require("../grid_core/ui.grid_core.data_controller");

exports.DataController = dataControllerModule.controllers.data.inherit((function() {
    return {
        _getSpecificDataSourceOption: function() {
            var dataSource = this.option("dataSource");

            if(Array.isArray(dataSource)) {
                return {
                    store: {
                        type: "array",
                        data: dataSource,
                        key: this.option("keyExpr")
                    }
                };
            }

            return dataSource;
        },

        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider;
        },

        _getNodeLevel: function(node) {
            var level = -1;
            while(node.parent) {
                if(node.visible) {
                    level++;
                }
                node = node.parent;
            }
            return level;
        },

        _generateDataItem: function(node) {
            return {
                rowType: "data",
                node: node,
                key: node.key,
                data: node.data,
                isExpanded: this.isRowExpanded(node.key),
                level: this._getNodeLevel(node)
            };
        },

        _setPagingOptions: function(dataSource) {
            var isVirtualScrolling = this.option("scrolling.mode") === "virtual";

            dataSource.paginate(isVirtualScrolling);
            dataSource.requireTotalCount(true);
        },

        init: function() {
            this.createAction("onRowExpanding");
            this.createAction("onRowExpanded");
            this.createAction("onRowCollapsing");
            this.createAction("onRowCollapsed");

            this.callBase.apply(this, arguments);
        },

        publicMethods: function() {
            return this.callBase().concat(["expandRow", "collapseRow", "isRowExpanded", "getRootNode"]);
        },

        changeRowExpand: function(key) {
            if(this._dataSource) {
                var that = this,
                    args = {
                        key: key
                    },
                    isExpanded = this.isRowExpanded(key);

                that.executeAction(isExpanded ? "onRowCollapsing" : "onRowExpanding", args);

                if(!args.cancel) {
                    return that._dataSource.changeRowExpand(key).done(function() {
                        that.executeAction(isExpanded ? "onRowCollapsed" : "onRowExpanded", args);
                    });
                }
            }

            return $.Deferred().resolve();
        },

        /**
         * @name dxTreeListMethods_isRowExpanded
         * @publicName isRowExpanded(key)
         * @param1 key:any
         * @return boolean
         */
        isRowExpanded: function(key) {
            return this._dataSource && this._dataSource.isRowExpanded(key);
        },

        /**
         * @name dxTreeListMethods_expandRow
         * @publicName expandRow(key)
         * @param1 key:any
         */
        expandRow: function(key) {
            if(!this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return $.Deferred().resolve();
        },

        /**
         * @name dxTreeListMethods_collapseRow
         * @publicName collapseRow(key)
         * @param1 key:any
         */
        collapseRow: function(key) {
            if(this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return $.Deferred().resolve();
        },

        /**
         * @name dxTreeListMethods_getRootNode
         * @publicName getRootNode()
         * @return dxTreeListNode
         */
        getRootNode: function() {
            return this._dataSource && this._dataSource.getRootNode();
        },

        optionChanged: function(args) {
            switch(args.name) {
                case "rootValue":
                case "keyExpr":
                case "parentIdExpr":
                case "itemsExpr":
                case "filterMode":
                case "expandNodesOnFiltering":
                case "autoExpandAll":
                case "hasItemsExpr":
                case "dataStructure":
                    this._columnsController.reset();
                    this._items = [];
                    this._refreshDataSource();
                    args.handled = true;
                    break;
                case "expandedRowKeys":
                case "onNodesInitialized":
                    this._dataSource && this._dataSource.load();
                    args.handled = true;
                    break;
                default:
                    this.callBase(args);
            }
        }
    };
})());

treeListCore.registerModule("data", {
    defaultOptions: function() {
        return extend({}, dataControllerModule.defaultOptions(), {
            /**
            * @name dxTreeListOptions_itemsExpr
            * @publicName itemsExpr
            * @type string|function
            * @default "items"
            */
            itemsExpr: "items",
            /**
            * @name dxTreeListOptions_keyExpr
            * @publicName keyExpr
            * @type string|function
            * @default "id"
            */
            /**
            * @name dxTreeListOptions_hasItemsExpr
            * @publicName hasItemsExpr
            * @type string|function
            */
            /**
            * @name dxTreeListOptions_parentIdExpr
            * @publicName parentIdExpr
            * @type string|function
            * @default "parentId"
            */
            parentIdExpr: "parentId",
            /**
            * @name dxTreeListOptions_rootValue
            * @type Object
            * @publicName rootValue
            * @default 0
            */
            rootValue: 0,
            /**
            * @name dxTreeListOptions_dataStructure
            * @publicName dataStructure
            * @type string
            * @acceptValues "plain" | "tree"
            * @default "plain"
            */
            dataStructure: "plain",
            /**
            * @name dxTreeListOptions_expandedRowKeys
            * @publicName expandedRowKeys
            * @type array
            * @default []
            */
            expandedRowKeys: [],
            filterMode: "extended",
            /**
            * @name dxTreeListOptions_expandNodesOnFiltering
            * @publicName expandNodesOnFiltering
            * @type boolean
            * @default true
            */
            expandNodesOnFiltering: true,
            /**
            * @name dxTreeListOptions_autoExpandAll
            * @publicName autoExpandAll
            * @type boolean
            * @default false
            */
            autoExpandAll: false,

            /**
            * @name dxTreeListOptions_onNodesInitialized
            * @publicName onNodesInitialized
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 root:dxTreeListNode
            * @extends Action
            * @action
            */
            onNodesInitialized: null
        });
    },
    controllers: {
        data: exports.DataController
    }
});

/**
 * @name dxTreeListNode_key
 * @publicName key
 * @type any
 */
/**
 * @name dxTreeListNode_data
 * @publicName data
 * @type object
 */
/**
 * @name dxTreeListNode_parent
 * @publicName parent
 * @type dxTreeListNode
 */
/**
 * @name dxTreeListNode_children
 * @publicName children
 * @type array
 */
/**
 * @name dxTreeListNode_hasChildren
 * @publicName hasChildren
 * @type boolean
 */
/**
 * @name dxTreeListNode_visible
 * @publicName visible
 * @type boolean
 */
/**
 * @name dxTreeListNode_level
 * @publicName level
 * @type number
 */
