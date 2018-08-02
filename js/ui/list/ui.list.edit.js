var $ = require("../../core/renderer"),
    eventUtils = require("../../events/utils"),
    extend = require("../../core/utils/extend").extend,
    GroupedEditStrategy = require("./ui.list.edit.strategy.grouped"),
    messageLocalization = require("../../localization/message"),
    EditProvider = require("./ui.list.edit.provider"),
    ListBase = require("./ui.list.base");

var LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
    LIST_ITEM_RESPONSE_WAIT_CLASS = "dx-list-item-response-wait";

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
            var focusedItemIndex = that._editStrategy.getNormalizedIndex(that.option("focusedElement"));

            if(e.shiftKey && that.option("allowItemReordering")) {
                e.preventDefault();

                var $prevItem = that._editStrategy.getItemElement(focusedItemIndex - 1);

                that.reorderItem(that.option("focusedElement"), $prevItem);
                that.scrollToItem(that.option("focusedElement"));
            } else {
                if(focusedItemIndex === 0 && this._editProvider.handleKeyboardEvents(focusedItemIndex, false)) {
                    return;
                } else {
                    this._editProvider.handleKeyboardEvents(focusedItemIndex, true);
                }
                parent.upArrow(e);
            }
        };

        var moveFocusedItemDown = function(e) {
            var focusedItemIndex = that._editStrategy.getNormalizedIndex(that.option("focusedElement"));

            if(e.shiftKey && that.option("allowItemReordering")) {
                e.preventDefault();

                var $nextItem = that._editStrategy.getItemElement(focusedItemIndex + 1);

                that.reorderItem(that.option("focusedElement"), $nextItem);
                that.scrollToItem(that.option("focusedElement"));
            } else {
                if(focusedItemIndex === this._getLastItemIndex() && this._editProvider.handleKeyboardEvents(focusedItemIndex, false)) {
                    return;
                } else {
                    this._editProvider.handleKeyboardEvents(focusedItemIndex, true);
                }
                parent.downArrow(e);
            }
        };

        var enter = function(e) {
            if(!this._editProvider.handleEnterPressing()) {
                parent.enter.apply(this, arguments);
            }
        };

        var space = function(e) {
            if(!this._editProvider.handleEnterPressing()) {
                parent.space.apply(this, arguments);
            }
        };

        return extend({}, parent, {
            del: deleteFocusedItem,
            upArrow: moveFocusedItemUp,
            downArrow: moveFocusedItemDown,
            enter: enter,
            space: space
        });
    },

    _updateSelection: function() {
        this._editProvider.afterItemsRendered();
        this.callBase();
    },

    _getLastItemIndex: function() {
        return this._itemElements().length - 1;
    },

    _refreshItemElements: function() {
        this.callBase();

        var excludedSelectors = this._editProvider.getExcludedItemSelectors();

        if(excludedSelectors.length) {
            this._itemElementsCache = this._itemElementsCache.not(excludedSelectors);
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxListOptions.showSelectionControls
            * @type boolean
            * @default false
            */
            showSelectionControls: false,

            /**
            * @name dxListOptions.selectionMode
            * @type Enums.ListSelectionMode
            * @default 'none'
            */
            selectionMode: 'none',

            /**
             * @name dxListOptions.selectAllMode
             * @type Enums.SelectAllMode
             * @default 'page'
             */
            selectAllMode: 'page',

            /**
            * @name dxListOptions.onSelectAllValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:boolean
            * @action
            */
            onSelectAllValueChanged: null,

            /**
            * @name dxListOptions.selectAllText
            * @type string
            * @default "Select All"
            * @hidden
            */
            selectAllText: messageLocalization.format("dxList-selectAll"),

            /**
            * @name dxListOptions.menuItems
            * @type Array<Object>
            * @default []
            */
            /**
            * @name dxListOptions.menuItems.text
            * @type string
            */
            /**
            * @name dxListOptions.menuItems.action
            * @type function
            * @type_function_param1 itemElement:dxElement
            * @type_function_param2 itemData:object
            */
            menuItems: [],

            /**
            * @name dxListOptions.menuMode
            * @type Enums.ListMenuMode
            * @default 'context'
            */
            menuMode: "context",

            /**
            * @name dxListOptions.allowItemDeleting
            * @type boolean
            * @default false
            */
            allowItemDeleting: false,

            /**
            * @name dxListOptions.itemDeleteMode
            * @type Enums.ListItemDeleteMode
             * @default 'static'
            */
            itemDeleteMode: "static",

            /**
            * @name dxListOptions.allowItemReordering
            * @type boolean
            * @default false
            */
            allowItemReordering: false

            /**
            * @name dxListOptions.onItemDeleting
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @type_function_param1_field7 cancel:boolean | Promise<void>
            * @action
            * @hidden false
            * @inheritdoc
            */

            /**
            * @name dxListOptions.onItemDeleted
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            * @hidden false
            */

            /**
            * @name dxListOptions.onItemReordered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
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
                    * @name dxListOptions.menuMode
                    * @default 'slide' @for iOS
                    */
                    menuMode: "slide",

                    /**
                    * @name dxListOptions.itemDeleteMode
                    * @default 'slideItem' @for iOS
                    */
                    itemDeleteMode: "slideItem"
                }
            },
            {
                device: { platform: "android" },
                options: {
                    /**
                    * @name dxListOptions.itemDeleteMode
                    * @default 'swipe' @for Android
                    */
                    itemDeleteMode: "swipe"
                }
            },
            {
                device: { platform: "win" },
                options: {
                    /**
                    * @name dxListOptions.itemDeleteMode
                    * @default 'context' @for Windows_Mobile
                    */
                    itemDeleteMode: "context"
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

    _initMarkup: function() {
        this._refreshEditProvider();
        this.callBase();
    },

    _renderItems: function() {
        this.callBase.apply(this, arguments);
        this._editProvider.afterItemsRendered();
    },

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

    focusListItem: function(index) {
        var $item = this._editStrategy.getItemElement(index);

        this.option("focusedElement", $item);
        this.focus();
        this.scrollToItem(this.option("focusedElement"));
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
    * @name dxListMethods.selectAll
    * @publicName selectAll()
    */
    selectAll: function() {
        return this._selection.selectAll(this._isPageSelectAll());
    },

    /**
    * @name dxListMethods.unselectAll
    * @publicName unselectAll()
    */
    unselectAll: function() {
        return this._selection.deselectAll(this._isPageSelectAll());
    },

    isSelectAll: function() {
        return this._selection.getSelectAllState(this._isPageSelectAll());
    },

    /**
    * @name dxListMethods.getFlatIndexByItemElement
    * @publicName getFlatIndexByItemElement(itemElement)
    * @param1 itemElement:Node
    * @return object
    * @hidden
    */
    getFlatIndexByItemElement: function(itemElement) {
        return this._itemElements().index(itemElement);
    },

    /**
    * @name dxListMethods.getItemElementByFlatIndex
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
    * @name dxListMethods.getItemByIndex
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
    * @name dxListMethods.deleteItem
    * @publicName deleteItem(itemElement)
    * @param1 itemElement:Node
    * @return Promise<void>
    */
    /**
    * @name dxListMethods.deleteItem
    * @publicName deleteItem(itemIndex)
    * @param1 itemIndex:Number|Object
    * @return Promise<void>
    */

    /**
    * @name dxListMethods.isItemSelected
    * @publicName isItemSelected(itemElement)
    * @param1 itemElement:Node
    * @return boolean
    */
    /**
    * @name dxListMethods.isItemSelected
    * @publicName isItemSelected(itemIndex)
    * @param1 itemIndex:Number|Object
    * @return boolean
    */

    /**
    * @name dxListMethods.selectItem
    * @publicName selectItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxListMethods.selectItem
    * @publicName selectItem(itemIndex)
    * @param1 itemIndex:Number|Object
    */

    /**
    * @name dxListMethods.unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxListMethods.unselectItem
    * @publicName unselectItem(itemIndex)
    * @param1 itemIndex:Number|Object
    */

    /**
    * @name dxListMethods.reorderItem
    * @publicName reorderItem(itemElement, toItemElement)
    * @param1 itemElement:Node
    * @param2 toItemElement:Node
    * @return Promise<void>
    */
    /**
    * @name dxListMethods.reorderItem
    * @publicName reorderItem(itemIndex, toItemIndex)
    * @param1 itemIndex:Number|Object
    * @param2 toItemIndex:Number|Object
    * @return Promise<void>
    */
});

module.exports = ListEdit;
