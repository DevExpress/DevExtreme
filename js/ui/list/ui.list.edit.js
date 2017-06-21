"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    eventUtils = require("../../events/utils"),
    extend = require("../../core/utils/extend").extend,
    GroupedEditStrategy = require("./ui.list.edit.strategy.grouped"),
    messageLocalization = require("../../localization/message"),
    EditProvider = require("./ui.list.edit.provider"),
    ListBase = require("./ui.list.base");

var LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
    LIST_ITEM_RESPONSE_WAIT_CLASS = "dx-list-item-response-wait";

/**
* @name dxList
* @publicName dxList
* @type object
* @inherits CollectionWidget
* @groupName Collection Widgets
*/

var ListEdit = ListBase.inherit({
    _supportedKeys: function() {
        var that = this,
            parent = this.callBase();

        var deleteFocusedItem = function(e) {
            if(that.option("allowItemDeleting")) {
                e.preventDefault();
                that.deleteItem(that.option("focusedElement"));
            }
        };

        var moveFocusedItemUp = function(e) {
            if(e.shiftKey && that.option("allowItemReordering")) {
                e.preventDefault();

                var focusedItemIndex = that._editStrategy.getNormalizedIndex(that.option("focusedElement")),
                    $prevItem = that._editStrategy.getItemElement(focusedItemIndex - 1);

                that.reorderItem(that.option("focusedElement"), $prevItem);
                that.scrollToItem(that.option("focusedElement"));
            } else {
                parent.upArrow(e);
            }
        };

        var moveFocusedItemDown = function(e) {
            if(e.shiftKey && that.option("allowItemReordering")) {
                e.preventDefault();

                var focusedItemIndex = that._editStrategy.getNormalizedIndex(that.option("focusedElement")),
                    $nextItem = that._editStrategy.getItemElement(focusedItemIndex + 1);

                that.reorderItem(that.option("focusedElement"), $nextItem);
                that.scrollToItem(that.option("focusedElement"));
            } else {
                parent.downArrow(e);
            }
        };

        return extend({}, parent, {
            del: deleteFocusedItem,
            upArrow: moveFocusedItemUp,
            downArrow: moveFocusedItemDown
        });
    },

    _renderSelection: function() {
        this._editProvider.afterItemsRendered();
        this.callBase();
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxListOptions_showSelectionControls
            * @publicName showSelectionControls
            * @type boolean
            * @default false
            */
            showSelectionControls: false,

            /**
            * @name dxListOptions_selectionMode
            * @publicName selectionMode
            * @type string
            * @default 'none'
            * @acceptValues 'none'|'multiple'|'single'|'all'
            */
            selectionMode: 'none',

            /**
             * @name dxListOptions_selectAllMode
             * @publicName selectAllMode
             * @type string
             * @default 'page'
             * @acceptValues 'page'|'allPages'
             */
            selectAllMode: 'page',

            /**
            * @name dxListOptions_onSelectAllValueChanged
            * @publicName onSelectAllValueChanged
            * @extends Action
            * @type_function_param1_field4 value:boolean
            * @action
            */
            onSelectAllValueChanged: null,

            /**
            * @name dxListOptions_selectAllText
            * @publicName selectAllText
            * @type string
            * @default "Select All"
            * @hidden
            */
            selectAllText: messageLocalization.format("dxList-selectAll"),

            /**
            * @name dxListOptions_menuItems
            * @publicName menuItems
            * @type Array
            * @default []
            */
            /**
            * @name dxListOptions_menuItems_text
            * @publicName text
            * @type string
            */
            /**
            * @name dxListOptions_menuItems_action
            * @publicName action
            * @type function
            * @type_function_param1 itemElement:jQuery
            * @type_function_param2 itemData:object
            */
            menuItems: [],

            /**
            * @name dxListOptions_menuMode
            * @publicName menuMode
            * @type string
            * @default 'context'
            * @acceptValues 'context'|'slide'
            */
            menuMode: "context",

            /**
            * @name dxListOptions_allowItemDeleting
            * @publicName allowItemDeleting
            * @type boolean
            * @default false
            */
            allowItemDeleting: false,

            /**
            * @name dxListOptions_itemDeleteMode
            * @publicName itemDeleteMode
            * @type string
            * @default 'toggle'
            * @acceptValues 'static'|'toggle'|'slideButton'|'slideItem'|'swipe'|'context'
            */
            itemDeleteMode: "toggle",

            /**
            * @name dxListOptions_allowItemReordering
            * @publicName allowItemReordering
            * @type boolean
            * @default false
            */
            allowItemReordering: false

            /**
            * @name dxListOptions_onItemDeleting
            * @publicName onItemDeleting
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 cancel:boolean | Promise
            * @action
            * @hidden false
            * @extend_doc
            */

            /**
            * @name dxListOptions_onItemDeleted
            * @publicName onItemDeleted
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            * @hidden false
            */

            /**
            * @name dxListOptions_onItemReordered
            * @publicName onItemReordered
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 fromIndex:number
            * @type_function_param1_field8 toIndex:number
            * @action
            * @hidden false
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    return device.platform === "ios";
                },
                options: {
                    /**
                    * @name dxListOptions_menuMode
                    * @publicName menuMode
                    * @custom_default_for_ios 'slide'
                    */
                    menuMode: "slide",

                    /**
                    * @name dxListOptions_itemDeleteMode
                    * @publicName itemDeleteMode
                    * @custom_default_for_ios 'slideItem'
                    */
                    itemDeleteMode: "slideItem"
                }
            },
            {
                device: { platform: "android" },
                options: {
                    /**
                    * @name dxListOptions_itemDeleteMode
                    * @publicName itemDeleteMode
                    * @custom_default_for_android 'swipe'
                    */
                    itemDeleteMode: "swipe"
                }
            },
            {
                device: { platform: "win" },
                options: {
                    /**
                    * @name dxListOptions_itemDeleteMode
                    * @publicName itemDeleteMode
                    * @custom_default_for_windows 'context'
                    */
                    itemDeleteMode: "context"
                }
            },
            {
                device: { platform: "generic" },
                options: {
                    /**
                    * @name dxListOptions_itemDeleteMode
                    * @publicName itemDeleteMode
                    * @custom_default_for_generic 'static'
                    */
                    itemDeleteMode: "static"
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();
        this._initEditProvider();
    },

    _initDataSource: function() {
        this.callBase();

        if(!this._isPageSelectAll()) {
            this._dataSource && this._dataSource.requireTotalCount(true);
        }
    },

    _isPageSelectAll: function() {
        return this.option("selectAllMode") === "page";
    },

    _initEditProvider: function() {
        this._editProvider = new EditProvider(this);
    },

    _disposeEditProvider: function() {
        if(this._editProvider) {
            this._editProvider.dispose();
        }
    },

    _refreshEditProvider: function() {
        this._disposeEditProvider();
        this._initEditProvider();
    },

    _initEditStrategy: function() {
        if(this.option("grouped")) {
            this._editStrategy = new GroupedEditStrategy(this);
        } else {
            this.callBase();
        }
    },

    _render: function() {
        this._refreshEditProvider();
        this.callBase();
    },

    _renderItems: function() {
        this.callBase.apply(this, arguments);
        this._editProvider.afterItemsRendered();
    },

    _renderSelectedItems: commonUtils.noop,

    _selectedItemClass: function() {
        return LIST_ITEM_SELECTED_CLASS;
    },

    _itemResponseWaitClass: function() {
        return LIST_ITEM_RESPONSE_WAIT_CLASS;
    },

    _itemClickHandler: function(e) {
        var $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return;
        }

        var handledByEditProvider = this._editProvider.handleClick($itemElement, e);
        if(handledByEditProvider) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _shouldFireContextMenuEvent: function() {
        return this.callBase.apply(this, arguments) || this._editProvider.contextMenuHandlerExists();
    },

    _itemHoldHandler: function(e) {
        var $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return;
        }

        var isTouchEvent = eventUtils.isTouchEvent(e),
            handledByEditProvider = isTouchEvent && this._editProvider.handleContextMenu($itemElement, e);
        if(handledByEditProvider) {
            e.handledByEditProvider = true;
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _itemContextMenuHandler: function(e) {
        var $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return;
        }

        var handledByEditProvider = !e.handledByEditProvider && this._editProvider.handleContextMenu($itemElement, e);
        if(handledByEditProvider) {
            e.preventDefault();
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _postprocessRenderItem: function(args) {
        this.callBase.apply(this, arguments);
        this._editProvider.modifyItemElement(args);
    },

    _clean: function() {
        this._disposeEditProvider();
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "selectAllMode":
                this._initDataSource();
                this._dataSource.pageIndex(0);
                this._dataSource.load();
                break;
            case "grouped":
                this._clearSelectedItems();
                delete this._renderingGroupIndex;
                this._initEditStrategy();
                this.callBase(args);
                break;
            case "showSelectionControls":
            case "menuItems":
            case "menuMode":
            case "allowItemDeleting":
            case "itemDeleteMode":
            case "allowItemReordering":
            case "selectAllText":
                this._invalidate();
                break;
            case "onSelectAllValueChanged":
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxListMethods_selectAll
    * @publicName selectAll()
    */
    selectAll: function() {
        return this._selection.selectAll(this._isPageSelectAll());
    },

    /**
    * @name dxListMethods_unselectAll
    * @publicName unselectAll()
    */
    unselectAll: function() {
        return this._selection.deselectAll(this._isPageSelectAll());
    },

    isSelectAll: function() {
        return this._selection.getSelectAllState(this._isPageSelectAll());
    },

    /**
    * @name dxListMethods_getFlatIndexByItemElement
    * @publicName getFlatIndexByItemElement(itemElement)
    * @param1 itemElement:Node
    * @return object
    * @hidden
    */
    getFlatIndexByItemElement: function(itemElement) {
        return this._itemElements().index(itemElement);
    },

    /**
    * @name dxListMethods_getItemElementByFlatIndex
    * @publicName getItemElementByFlatIndex(flatIndex)
    * @param1 flatIndex:Number
    * @return Node
    * @hidden
    */
    getItemElementByFlatIndex: function(flatIndex) {
        var $itemElements = this._itemElements();

        if(flatIndex < 0 || flatIndex >= $itemElements.length) {
            return $();
        }

        return $itemElements.eq(flatIndex);
    },

    /**
    * @name dxListMethods_getItemByIndex
    * @publicName getItemByIndex(index)
    * @param1 index:Number
    * @return object
    * @hidden
    */
    // TODO: rename & rework because method return itemData but named as itemElement
    getItemByIndex: function(index) {
        return this._editStrategy.getItemDataByIndex(index);
    }

    /**
    * @name dxListMethods_deleteItem
    * @publicName deleteItem(itemElement)
    * @param1 itemElement:Node
    * @return Promise
    */
    /**
    * @name dxListMethods_deleteItem
    * @publicName deleteItem(itemIndex)
    * @param1 itemIndex:Number|Object
    * @return Promise
    */

    /**
    * @name dxListMethods_isItemSelected
    * @publicName isItemSelected(itemElement)
    * @param1 itemElement:Node
    * @return boolean
    */
    /**
    * @name dxListMethods_isItemSelected
    * @publicName isItemSelected(itemIndex)
    * @param1 itemIndex:Number|Object
    * @return boolean
    */

    /**
    * @name dxListMethods_selectItem
    * @publicName selectItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxListMethods_selectItem
    * @publicName selectItem(itemIndex)
    * @param1 itemIndex:Number|Object
    */

    /**
    * @name dxListMethods_unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxListMethods_unselectItem
    * @publicName unselectItem(itemIndex)
    * @param1 itemIndex:Number|Object
    */

    /**
    * @name dxListMethods_reorderItem
    * @publicName reorderItem(itemElement, toItemElement)
    * @param1 itemElement:Node
    * @param2 toItemElement:Node
    * @return Promise
    */
    /**
    * @name dxListMethods_reorderItem
    * @publicName reorderItem(itemIndex, toItemIndex)
    * @param1 itemIndex:Number|Object
    * @param2 toItemIndex:Number|Object
    * @return Promise
    */
});

module.exports = ListEdit;
