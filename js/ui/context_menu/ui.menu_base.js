var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    inkRipple = require("../widget/utils.ink_ripple"),
    HierarchicalCollectionWidget = require("../hierarchical_collection/ui.hierarchical_collection_widget"),
    MenuBaseEditStrategy = require("./ui.menu_base.edit.strategy"),
    devices = require("../../core/devices");

var DX_MENU_CLASS = "dx-menu",
    DX_MENU_NO_ICONS_CLASS = DX_MENU_CLASS + "-no-icons",
    DX_MENU_BASE_CLASS = "dx-menu-base",
    ITEM_CLASS = DX_MENU_CLASS + "-item",
    DX_ITEM_CONTENT_CLASS = ITEM_CLASS + "-content",
    DX_MENU_SELECTED_ITEM_CLASS = ITEM_CLASS + "-selected",
    DX_MENU_ITEM_WRAPPER_CLASS = ITEM_CLASS + "-wrapper",
    DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + "-items-container",
    DX_MENU_ITEM_EXPANDED_CLASS = ITEM_CLASS + "-expanded",
    DX_MENU_SEPARATOR_CLASS = DX_MENU_CLASS + "-separator",
    DX_MENU_ITEM_LAST_GROUP_ITEM = DX_MENU_CLASS + "-last-group-item",
    DX_ITEM_HAS_TEXT = ITEM_CLASS + "-has-text",
    DX_ITEM_HAS_ICON = ITEM_CLASS + "-has-icon",
    DX_ITEM_HAS_SUBMENU = ITEM_CLASS + "-has-submenu",
    DX_MENU_ITEM_POPOUT_CLASS = ITEM_CLASS + "-popout",
    DX_MENU_ITEM_POPOUT_CONTAINER_CLASS = DX_MENU_ITEM_POPOUT_CLASS + "-container",
    DX_MENU_ITEM_CAPTION_CLASS = ITEM_CLASS + "-text",
    SINGLE_SELECTION_MODE = "single",
    DEFAULT_DELAY = { "show": 50, "hide": 300 };

/**
* @name dxMenuBase
* @type object
* @inherits HierarchicalCollectionWidget
* @hidden
*/

var MenuBase = HierarchicalCollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
            * @name dxMenuBaseOptions.items
            * @type Array<dxMenuBaseItem>
            */
            items: [],

            /**
            * @name dxMenuBaseOptions.cssClass
            * @type string
            * @default ""
            */
            cssClass: "",

            /**
             * @name dxMenuBaseOptions.activeStateEnabled
             * @type Boolean
             * @default true
             */
            activeStateEnabled: true,

            /**
            * @name dxMenuBaseOptions.showSubmenuMode
            * @type Object|Enums.ShowSubmenuMode
            * @default { name: "onHover", delay: { show: 0, hide: 0 } }
            */
            showSubmenuMode: {
                /**
                * @name dxMenuBaseOptions.showSubmenuMode.name
                * @type Enums.ShowSubmenuMode
                * @default "onHover"
                */
                name: "onHover",

                /**
                * @name dxMenuBaseOptions.showSubmenuMode.delay
                * @type Object|number
                * @default { show: 50, hide: 300 }
                */
                delay: {
                    /**
                    * @name dxMenuBaseOptions.showSubmenuMode.delay.show
                    * @type number
                    * @default 50
                    */
                    show: 50,

                    /**
                    * @name dxMenuBaseOptions.showSubmenuMode.delay.hide
                    * @type number
                    * @default 300
                    */
                    hide: 300
                }
            },

            /**
            * @name dxMenuBaseOptions.animation
            * @type object
            * @default { show: { type: "fade", from: 0, to: 1, duration: 100 }, hide: { type: "fade", from: 1, to: 0, duration: 100 } }
            * @ref
            */
            animation: {
                /**
                * @name dxMenuBaseOptions.animation.show
                * @type animationConfig
                * @default { type: "fade", from: 0, to: 1, duration: 100 }
                */
                show: {
                    type: "fade",
                    from: 0,
                    to: 1,
                    duration: 100
                },
                /**
                * @name dxMenuBaseOptions.animation.hide
                * @type animationConfig
                * @default { type: "fade", from: 1, to: 0, duration: 100 }
                */
                hide: {
                    type: "fade",
                    from: 1,
                    to: 0,
                    duration: 100
                }
            },

            /**
            * @name dxMenuBaseOptions.selectByClick
            * @type boolean
            * @default false
            */
            selectByClick: false,

            focusOnSelectedItem: false,

            /**
            * @name dxMenuBaseOptions.onItemHold
            * @hidden
            * @action
            */

            /**
            * @name dxMenuBaseOptions.itemHoldTimeout
            * @hidden
            */

            /**
            * @name dxMenuBaseOptions.noDataText
            * @hidden
            */

            /**
            * @name dxMenuBaseOptions.selectedIndex
            * @hidden
            */

            /**
            * @name dxMenuBaseOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxMenuBaseOptions.keyExpr
            * @hidden
            */
            keyExpr: null,

            /**
            * @name dxMenuBaseOptions.parentIdExpr
            * @hidden
            */

            /**
            * @name dxMenuBaseOptions.expandedExpr
            * @hidden
            */

            /**
            * @name dxMenuBaseItem
            * @inherits CollectionWidgetItem
            * @type object
            */

            /**
            * @name dxMenuBaseItem.beginGroup
            * @type Boolean
            */

            /**
            * @name dxMenuBaseOptions.selectionMode
            * @type Enums.MenuSelectionMode
            * @default none
             */

            _itemAttributes: { role: "menuitem" },

            useInkRipple: false

            /**
            * @name dxMenuBaseItem.html
            * @type String
            * @hidden
            */
            /**
            * @name dxMenuBaseItem.disabled
            * @type boolean
            * @default false
            */
            /**
            * @name dxMenuBaseItem.visible
            * @type boolean
            * @default true
            */
            /**
            * @name dxMenuBaseItem.icon
            * @type String
            */
            /**
            * @name dxMenuBaseItem.text
            * @type String
            */
            /**
             * @name dxMenuBaseItem.html
             * @type String
             */
            /**
            * @name dxMenuBaseItem.items
            * @type Array<dxMenuBaseItem>
            */
            /**
            * @name dxMenuBaseItem.selectable
            * @type boolean
            * @default false
            */
            /**
            * @name dxMenuBaseItem.selected
            * @type boolean
            * @default false
            */
            /**
            * @name dxMenuBaseItem.closeMenuOnClick
            * @type boolean
            * @default true
            */
        });
    },

    _activeStateUnit: "." + ITEM_CLASS,

    _itemDataKey: function() {
        return "dxMenuItemDataKey";
    },

    _itemClass: function() {
        return ITEM_CLASS;
    },

    _setAriaSelected: commonUtils.noop,

    _selectedItemClass: function() {
        return DX_MENU_SELECTED_ITEM_CLASS;
    },

    _widgetClass: function() {
        return DX_MENU_BASE_CLASS;
    },

    _focusTarget: function() {
        return this._itemContainer();
    },

    _clean: function() {
        this.option("focusedElement", null);

        this.callBase();
    },

    _supportedKeys: function() {
        var selectItem = function() {
            var $item = $(this.option("focusedElement"));

            if(!$item.length || !this._isSelectionEnabled()) {
                return;
            }

            this.selectItem($item[0]);
        };
        return extend(this.callBase(), {
            space: selectItem,
            pageUp: commonUtils.noop,
            pageDown: commonUtils.noop
        });
    },

    _isSelectionEnabled: function() {
        return this.option("selectionMode") === SINGLE_SELECTION_MODE;
    },

    _init: function() {
        this.callBase();
        this._renderSelectedItem();
        this._initActions();
    },

    _getTextContainer: function(itemData) {
        var itemText = itemData.text,
            $itemContainer = $('<span>').addClass(DX_MENU_ITEM_CAPTION_CLASS),
            itemContent = typeUtils.isPlainObject(itemData) ? itemText : String(itemData);

        return itemText && $itemContainer.text(itemContent);
    },

    _getPopoutContainer: function(itemData) {
        var items = itemData.items,
            $popOutContainer;

        if(items && items.length) {
            var $popOutImage = $('<div>').addClass(DX_MENU_ITEM_POPOUT_CLASS);
            $popOutContainer = $('<span>').addClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS).append($popOutImage);
        }

        return $popOutContainer;
    },

    _getDataAdapterOptions: function() {
        return {
            rootValue: 0,
            multipleSelection: false,
            recursiveSelection: false,
            recursiveExpansion: false,
            searchValue: ""
        };
    },

    _selectByItem: function(selectedItem) {
        if(!selectedItem) return;

        var nodeToSelect = this._dataAdapter.getNodeByItem(selectedItem);
        this._dataAdapter.toggleSelection(nodeToSelect.internalFields.key, true);
    },

    _renderSelectedItem: function() {
        var selectedKeys = this._dataAdapter.getSelectedNodesKeys(),
            selectedKey = selectedKeys.length && selectedKeys[0],
            selectedItem = this.option("selectedItem");

        if(!selectedKey) {
            this._selectByItem(selectedItem);
            return;
        }

        var node = this._dataAdapter.getNodeByKey(selectedKey);

        if(node.selectable === false) return;

        if(!selectedItem) {
            this.option("selectedItem", node.internalFields.item);
            return;
        }

        if(selectedItem !== node.internalFields.item) {
            this._dataAdapter.toggleSelection(selectedKey, false);
            this._selectByItem(selectedItem);
        }
    },

    _initActions: commonUtils.noop,

    _initMarkup: function() {
        this.callBase();
        this._addCustomCssClass(this.$element());
        this.option("useInkRipple") && this._renderInkRipple();
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render();
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        var config = {
            element: $element,
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _getShowSubmenuMode: function() {
        var defaultValue = "onClick",
            optionValue = this.option("showSubmenuMode");

        optionValue = typeUtils.isObject(optionValue) ? optionValue.name : optionValue;

        return this._isDesktopDevice() ? optionValue : defaultValue;
    },

    _initSelectedItems: commonUtils.noop,

    _isDesktopDevice: function() {
        return devices.real().deviceType === "desktop";
    },

    _initEditStrategy: function() {
        var Strategy = MenuBaseEditStrategy;
        this._editStrategy = new Strategy(this);
    },

    _addCustomCssClass: function($element) {
        $element.addClass(this.option("cssClass"));
    },

    _itemWrapperSelector: function() {
        return "." + DX_MENU_ITEM_WRAPPER_CLASS;
    },

    _hoverStartHandler: function(e) {
        var that = this,
            $itemElement = that._getItemElementByEventArgs(e);

        if(!$itemElement || that._isItemDisabled($itemElement)) return;

        e.stopPropagation();

        if(that._getShowSubmenuMode() === "onHover") {
            clearTimeout(this._showSubmenusTimeout);
            this._showSubmenusTimeout = setTimeout(that._showSubmenu.bind(that, $itemElement), that._getSubmenuDelay("show"));
        }
    },

    _getAvailableItems: function($itemElements) {
        return this.callBase($itemElements).filter(function() {
            return $(this).css("visibility") !== "hidden";
        });
    },

    _isItemDisabled: function($item) {
        return this._disabledGetter($item.data(this._itemDataKey()));
    },

    _showSubmenu: function($itemElement) {
        this._addExpandedClass($itemElement);
    },

    _addExpandedClass: function(itemElement) {
        $(itemElement).addClass(DX_MENU_ITEM_EXPANDED_CLASS);
    },

    _getSubmenuDelay: function(action) {
        var delay = this.option("showSubmenuMode").delay;
        if(!typeUtils.isDefined(delay)) {
            return DEFAULT_DELAY[action];
        }

        return typeUtils.isObject(delay) ? delay[action] : delay;
    },

    // TODO: try to simplify
    _getItemElementByEventArgs: function(eventArgs) {
        var $target = $(eventArgs.target);

        if($target.hasClass(this._itemClass()) || $target.get(0) === eventArgs.currentTarget) {
            return $target;
        }

        // TODO: move it to inheritors, menuBase don't know about dx-submenu
        while(!$target.hasClass(this._itemClass())) {
            $target = $target.parent();
            if($target.hasClass("dx-submenu")) {
                return null;
            }
        }

        return $target;
    },

    _hoverEndHandler: function() {
        clearTimeout(this._showSubmenusTimeout);
    },

    _hasSubmenu: function(node) {
        return node.internalFields.childrenKeys.length;
    },

    _renderContentImpl: function() {
        this._renderItems(this._dataAdapter.getRootNodes());
    },

    _renderItems: function(nodes, submenuContainer) {
        var that = this,
            $nodeContainer;

        if(nodes.length) {
            this.hasIcons = false;

            $nodeContainer = this._renderContainer(this.$element(), submenuContainer);

            var firstVisibleIndex = -1,
                nextGroupFirstIndex = -1;

            each(nodes, function(index, node) {
                var isVisibleNode = node.visible !== false;

                if(isVisibleNode && firstVisibleIndex < 0) {
                    firstVisibleIndex = index;
                }

                var isBeginGroup = firstVisibleIndex < index && (node.beginGroup || index === nextGroupFirstIndex);

                if(isBeginGroup) {
                    nextGroupFirstIndex = isVisibleNode ? index : index + 1;
                }

                if(index === nextGroupFirstIndex && firstVisibleIndex < index) {
                    that._renderSeparator($nodeContainer);
                }

                that._renderItem(index, node, $nodeContainer);
            });

            if(!this.hasIcons) $nodeContainer.addClass(DX_MENU_NO_ICONS_CLASS);
        }

    },

    _renderContainer: function($wrapper) {
        return $("<ul>")
            .appendTo($wrapper)
            .addClass(DX_MENU_ITEMS_CONTAINER_CLASS);
    },

    _createDOMElement: function($nodeContainer) {
        var $node = $("<li>")
            .appendTo($nodeContainer)
            .addClass(DX_MENU_ITEM_WRAPPER_CLASS);

        return $node;
    },

    _renderItem: function(index, node, $nodeContainer, $nodeElement) {
        var items = this.option("items"),
            $itemFrame;

        if(node.internalFields.item.visible === false) return;
        var $node = $nodeElement || this._createDOMElement($nodeContainer);

        if(items[index + 1] && items[index + 1].beginGroup) {
            $node.addClass(DX_MENU_ITEM_LAST_GROUP_ITEM);
        }

        $itemFrame = this.callBase(index, node.internalFields.item, $node);

        if(node.internalFields.item === this.option("selectedItem")) {
            $itemFrame.addClass(DX_MENU_SELECTED_ITEM_CLASS);
        }

        $itemFrame.attr("tabIndex", -1);

        if(this._hasSubmenu(node)) this.setAria("haspopup", "true", $itemFrame);
    },

    _renderItemFrame: function(index, itemData, $itemContainer) {
        var $itemFrame = $itemContainer.children("." + ITEM_CLASS);

        return $itemFrame.length ? $itemFrame : this.callBase.apply(this, arguments);
    },

    _refreshItem: function($item, item) {
        var node = this._dataAdapter.getNodeByItem(item),
            index = $item.data(this._itemIndexKey()),
            $nodeContainer = $item.closest("ul"),
            $nodeElement = $item.closest("li");
        this._renderItem(index, node, $nodeContainer, $nodeElement);
    },

    _addContentClasses: function(itemData, $itemFrame) {
        var hasText = itemData.text ? !!itemData.text.length : false,
            hasIcon = !!itemData.icon,
            hasSubmenu = itemData.items ? !!itemData.items.length : false;

        $itemFrame.toggleClass(DX_ITEM_HAS_TEXT, hasText);
        $itemFrame.toggleClass(DX_ITEM_HAS_ICON, hasIcon);

        if(!this.hasIcons) {
            this.hasIcons = hasIcon;
        }

        $itemFrame.toggleClass(DX_ITEM_HAS_SUBMENU, hasSubmenu);
    },

    _getItemContent: function($itemFrame) {
        var $itemContent = this.callBase($itemFrame);
        if(!$itemContent.length) {
            $itemContent = $itemFrame.children("." + DX_ITEM_CONTENT_CLASS);
        }
        return $itemContent;
    },

    _postprocessRenderItem: function(args) {
        var $itemElement = $(args.itemElement),
            selectedIndex = this._dataAdapter.getSelectedNodesKeys(),
            node;

        if(!selectedIndex.length || !this._selectedGetter(args.itemData) || !this._isItemSelectable(args.itemData)) {
            this._setAriaSelected($itemElement, "false");
            return;
        }

        node = this._dataAdapter.getNodeByItem(args.itemData);

        if(node.internalFields.key === selectedIndex[0]) {
            $itemElement.addClass(this._selectedItemClass());
            this._setAriaSelected($itemElement, "true");
        } else {
            this._setAriaSelected($itemElement, "false");
        }
    },

    _isItemSelectable: function(item) {
        return item.selectable !== false;
    },

    _renderSeparator: function($itemsContainer) {
        $("<li>")
            .appendTo($itemsContainer)
            .addClass(DX_MENU_SEPARATOR_CLASS);
    },

    _itemClickHandler: function(e) {
        if(e._skipHandling) return;
        var itemClickActionHandler = this._createAction(this._updateSubmenuVisibilityOnClick.bind(this));
        this._itemDXEventHandler(e, "onItemClick", {}, { afterExecute: itemClickActionHandler.bind(this) });
        e._skipHandling = true;
    },

    _updateSubmenuVisibilityOnClick: function(actionArgs) {
        this._updateSelectedItemOnClick(actionArgs);

        if(this._getShowSubmenuMode() === "onClick") {
            this._addExpandedClass(actionArgs.args[0].itemElement);
        }
    },

    _updateSelectedItemOnClick: function(actionArgs) {
        var args = actionArgs.args ? actionArgs.args[0] : actionArgs,
            selectedItemKey;

        if(!this._isItemSelectionAllowed(args.itemData)) {
            return;
        }

        selectedItemKey = this._dataAdapter.getSelectedNodesKeys();
        var selectedNode = selectedItemKey.length && this._dataAdapter.getNodeByKey(selectedItemKey[0]);

        if(selectedNode) {
            this._toggleItemSelection(selectedNode, false);
        }

        if(!selectedNode || (selectedNode.internalFields.item !== args.itemData)) {
            this.selectItem(args.itemData);
        } else {
            this._fireSelectionChangeEvent(null, this.option("selectedItem"));
            this._setOptionSilent("selectedItem", null);
        }

    },

    _isItemSelectionAllowed: function(item) {
        var isSelectionByClickEnabled = this._isSelectionEnabled() && this.option("selectByClick");
        return !this._isContainerEmpty() && isSelectionByClickEnabled && this._isItemSelectable(item) && !this._itemsGetter(item);
    },

    _isContainerEmpty: function() {
        return this._itemContainer().is(':empty');
    },

    _syncSelectionOptions: commonUtils.asyncNoop,

    _optionChanged: function(args) {
        switch(args.name) {
            case "showSubmenuMode":
                break;
            case "selectedItem":
                var itemData = args.value,
                    node = this._dataAdapter.getNodeByItem(itemData),
                    selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];

                if(node && node.internalFields.key !== selectedKey) {
                    if(node.selectable === false) break;

                    if(selectedKey) {
                        this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
                    }
                    this._toggleItemSelection(node, true);
                    this._updateSelectedItems();
                }
                break;
            case "cssClass":
            case "position":
            case "selectByClick":
            case "animation":
            case "useInkRipple":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _toggleItemSelection: function(node, value) {
        var itemElement = this._getElementByItem(node.internalFields.item);
        itemElement && $(itemElement).toggleClass(DX_MENU_SELECTED_ITEM_CLASS);
        this._dataAdapter.toggleSelection(node.internalFields.key, value);
    },

    _getElementByItem: function(itemData) {
        var that = this,
            result;

        each(this._itemElements(), function(_, itemElement) {
            if($(itemElement).data(that._itemDataKey()) !== itemData) {
                return true;
            }

            result = itemElement;
            return false;
        });
        return result;
    },

    _updateSelectedItems: function(oldSelection, newSelection) {
        if(oldSelection || newSelection) {
            this._updateSelection(newSelection, oldSelection);
            this._fireSelectionChangeEvent(newSelection, oldSelection);
        }
    },

    _fireSelectionChangeEvent: function(addedSelection, removedSelection) {
        this._createActionByOption("onSelectionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })({
            addedItems: [addedSelection],
            removedItems: [removedSelection]
        });
    },

    /**
        * @name dxMenuBaseMethods.selectItem
        * @publicName selectItem(itemElement)
        * @param1 itemElement:Node
    */
    selectItem: function(itemElement) {
        var itemData = (itemElement.nodeType) ? this._getItemData(itemElement) : itemElement,
            node = this._dataAdapter.getNodeByItem(itemData),
            selectedKey = this._dataAdapter.getSelectedNodesKeys()[0],
            selectedItem = this.option("selectedItem");

        if(node.internalFields.key !== selectedKey) {
            if(selectedKey) {
                this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
            }
            this._toggleItemSelection(node, true);
            this._updateSelectedItems(selectedItem, itemData);
            this._setOptionSilent("selectedItem", itemData);
        }
    },

    /**
    * @name dxMenuBaseMethods.unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Node
    */
    unselectItem: function(itemElement) {
        var itemData = (itemElement.nodeType) ? this._getItemData(itemElement) : itemElement,
            node = this._dataAdapter.getNodeByItem(itemData),
            selectedItem = this.option("selectedItem");

        if(node.internalFields.selected) {
            this._toggleItemSelection(node, false);
            this._updateSelectedItems(selectedItem, null);
            this._setOptionSilent("selectedItem", null);
        }

    }
});

module.exports = MenuBase;
