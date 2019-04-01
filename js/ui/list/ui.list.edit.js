import $ from "../../core/renderer";
import { isTouchEvent } from "../../events/utils";
import { extend } from "../../core/utils/extend";
import GroupedEditStrategy from "./ui.list.edit.strategy.grouped";
import { format as formatMessage } from "../../localization/message";
import EditProvider from "./ui.list.edit.provider";
import ListBase from "./ui.list.base";

const LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected";
const LIST_ITEM_RESPONSE_WAIT_CLASS = "dx-list-item-response-wait";

const ListEdit = ListBase.inherit({
    _supportedKeys() {
        const that = this;
        const parent = this.callBase();

        const deleteFocusedItem = e => {
            if(that.option("allowItemDeleting")) {
                e.preventDefault();
                that.deleteItem(that.option("focusedElement"));
            }
        };

        const moveFocusedItem = (e, moveUp) => {
            const moveDown = !moveUp;
            const editStrategy = this._editStrategy;
            const focusedElement = this.option("focusedElement");
            const focusedItemIndex = editStrategy.getNormalizedIndex(focusedElement);

            if(e.shiftKey && that.option("allowItemReordering")) {
                const nextItemIndex = focusedItemIndex + moveUp ? -1 : 1;
                const $nextItem = editStrategy.getItemElement(nextItemIndex);

                this.reorderItem(focusedElement, $nextItem);
                this.scrollToItem(focusedElement);
                e.preventDefault();
            } else {
                const isLastItemFocused = focusedItemIndex === this._getLastItemIndex();
                const isSelectAllCheckBoxFocused = focusedItemIndex === -1;
                const editProvider = this._editProvider;

                editProvider.handleKeyboardEvents(focusedItemIndex, moveUp);

                if(moveUp && focusedItemIndex > 0) {
                    parent.upArrow(e);
                }

                if(moveDown && !isLastItemFocused && !isSelectAllCheckBoxFocused) {
                    parent.downArrow(e);
                }
            }
        };

        const enter = function(e) {
            if(!this._editProvider.handleEnterPressing()) {
                parent.enter.apply(this, arguments);
            }
        };

        const space = function(e) {
            if(!this._editProvider.handleEnterPressing()) {
                parent.space.apply(this, arguments);
            }
        };

        return extend({}, parent, {
            del: deleteFocusedItem,
            upArrow: (e) => moveFocusedItem(e, true),
            downArrow: moveFocusedItem,
            enter,
            space
        });
    },

    _updateSelection() {
        this._editProvider.afterItemsRendered();
        this.callBase();
    },

    _getLastItemIndex() {
        return this._itemElements().length - 1;
    },

    _refreshItemElements() {
        this.callBase();

        const excludedSelectors = this._editProvider.getExcludedItemSelectors();

        if(excludedSelectors.length) {
            this._itemElementsCache = this._itemElementsCache.not(excludedSelectors);
        }
    },

    _getDefaultOptions() {
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
            selectAllText: formatMessage("dxList-selectAll"),

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

    _defaultOptionsRules() {
        return this.callBase().concat([
            {
                device: device => device.platform === "ios",
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

    _init() {
        this.callBase();
        this._initEditProvider();
    },

    _initDataSource() {
        this.callBase();

        if(!this._isPageSelectAll()) {
            this._dataSource && this._dataSource.requireTotalCount(true);
        }
    },

    _isPageSelectAll() {
        return this.option("selectAllMode") === "page";
    },

    _initEditProvider() {
        this._editProvider = new EditProvider(this);
    },

    _disposeEditProvider() {
        if(this._editProvider) {
            this._editProvider.dispose();
        }
    },

    _refreshEditProvider() {
        this._disposeEditProvider();
        this._initEditProvider();
    },

    _initEditStrategy() {
        if(this.option("grouped")) {
            this._editStrategy = new GroupedEditStrategy(this);
        } else {
            this.callBase();
        }
    },

    _initMarkup() {
        this._refreshEditProvider();
        this.callBase();
    },

    _renderItems(...args) {
        this.callBase(...args);
        this._editProvider.afterItemsRendered();
    },

    _selectedItemClass() {
        return LIST_ITEM_SELECTED_CLASS;
    },

    _itemResponseWaitClass() {
        return LIST_ITEM_RESPONSE_WAIT_CLASS;
    },

    _itemClickHandler(e) {
        const $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return;
        }

        const handledByEditProvider = this._editProvider.handleClick($itemElement, e);
        if(handledByEditProvider) {
            return;
        }

        this.callBase(...arguments);
    },

    _shouldFireContextMenuEvent(...args) {
        return this.callBase(...args) || this._editProvider.contextMenuHandlerExists();
    },

    _itemHoldHandler(e) {
        const $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return;
        }

        const handledByEditProvider = isTouchEvent(e) && this._editProvider.handleContextMenu($itemElement, e);
        if(handledByEditProvider) {
            e.handledByEditProvider = true;
            return;
        }

        this.callBase(...arguments);
    },

    _itemContextMenuHandler(e) {
        const $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            return;
        }

        const handledByEditProvider = !e.handledByEditProvider && this._editProvider.handleContextMenu($itemElement, e);
        if(handledByEditProvider) {
            e.preventDefault();
            return;
        }

        this.callBase(...arguments);
    },

    _postprocessRenderItem(args) {
        this.callBase(...arguments);
        this._editProvider.modifyItemElement(args);
    },

    _clean() {
        this._disposeEditProvider();
        this.callBase();
    },

    focusListItem(index) {
        const $item = this._editStrategy.getItemElement(index);

        this.option("focusedElement", $item);
        this.focus();
        this.scrollToItem(this.option("focusedElement"));
    },

    _optionChanged(args) {
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
    selectAll() {
        return this._selection.selectAll(this._isPageSelectAll());
    },

    /**
    * @name dxListMethods.unselectAll
    * @publicName unselectAll()
    */
    unselectAll() {
        return this._selection.deselectAll(this._isPageSelectAll());
    },

    isSelectAll() {
        return this._selection.getSelectAllState(this._isPageSelectAll());
    },

    /**
    * @name dxListMethods.getFlatIndexByItemElement
    * @publicName getFlatIndexByItemElement(itemElement)
    * @param1 itemElement:Node
    * @return object
    * @hidden
    */
    getFlatIndexByItemElement(itemElement) {
        return this._itemElements().index(itemElement);
    },

    /**
    * @name dxListMethods.getItemElementByFlatIndex
    * @publicName getItemElementByFlatIndex(flatIndex)
    * @param1 flatIndex:Number
    * @return Node
    * @hidden
    */
    getItemElementByFlatIndex(flatIndex) {
        const $itemElements = this._itemElements();

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
    getItemByIndex(index) {
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
