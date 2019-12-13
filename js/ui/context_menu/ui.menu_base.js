import $ from "../../core/renderer";
import { noop, asyncNoop } from "../../core/utils/common";
import { isPlainObject, isObject, isDefined } from "../../core/utils/type";
import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import { render } from "../widget/utils.ink_ripple";
import HierarchicalCollectionWidget from "../hierarchical_collection/ui.hierarchical_collection_widget";
import MenuBaseEditStrategy from "./ui.menu_base.edit.strategy";
import devices from "../../core/devices";
import MenuItem from "../collection/item";

const DX_MENU_CLASS = "dx-menu";
const DX_MENU_NO_ICONS_CLASS = DX_MENU_CLASS + "-no-icons";
const DX_MENU_BASE_CLASS = "dx-menu-base";
const ITEM_CLASS = DX_MENU_CLASS + "-item";
const DX_ITEM_CONTENT_CLASS = ITEM_CLASS + "-content";
const DX_MENU_SELECTED_ITEM_CLASS = ITEM_CLASS + "-selected";
const DX_MENU_ITEM_WRAPPER_CLASS = ITEM_CLASS + "-wrapper";
const DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + "-items-container";
const DX_MENU_ITEM_EXPANDED_CLASS = ITEM_CLASS + "-expanded";
const DX_MENU_SEPARATOR_CLASS = DX_MENU_CLASS + "-separator";
const DX_MENU_ITEM_LAST_GROUP_ITEM = DX_MENU_CLASS + "-last-group-item";
const DX_ITEM_HAS_TEXT = ITEM_CLASS + "-has-text";
const DX_ITEM_HAS_ICON = ITEM_CLASS + "-has-icon";
const DX_ITEM_HAS_SUBMENU = ITEM_CLASS + "-has-submenu";
const DX_MENU_ITEM_POPOUT_CLASS = ITEM_CLASS + "-popout";
const DX_MENU_ITEM_POPOUT_CONTAINER_CLASS = DX_MENU_ITEM_POPOUT_CLASS + "-container";
const DX_MENU_ITEM_CAPTION_CLASS = ITEM_CLASS + "-text";
const SINGLE_SELECTION_MODE = "single";
const DEFAULT_DELAY = { "show": 50, "hide": 300 };

/**
* @name dxMenuBase
* @type object
* @inherits HierarchicalCollectionWidget
* @hidden
*/

class MenuBase extends HierarchicalCollectionWidget {

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
             * @name dxMenuBaseOptions.dataSource
             * @type string|Array<dxMenuBaseItem>|DataSource|DataSourceOptions
             * @default null
             */
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
    }

    _itemDataKey() {
        return "dxMenuItemDataKey";
    }

    _itemClass() {
        return ITEM_CLASS;
    }

    _setAriaSelected() {}

    _selectedItemClass() {
        return DX_MENU_SELECTED_ITEM_CLASS;
    }

    _widgetClass() {
        return DX_MENU_BASE_CLASS;
    }

    _focusTarget() {
        return this._itemContainer();
    }

    _clean() {
        this.option("focusedElement", null);

        super._clean();
    }

    _supportedKeys() {
        const selectItem = () => {
            const $item = $(this.option("focusedElement"));

            if(!$item.length || !this._isSelectionEnabled()) {
                return;
            }

            this.selectItem($item[0]);
        };
        return extend(super._supportedKeys(), {
            space: selectItem,
            pageUp: noop,
            pageDown: noop
        });
    }

    _isSelectionEnabled() {
        return this.option("selectionMode") === SINGLE_SELECTION_MODE;
    }

    _init() {
        this._activeStateUnit = `.${ITEM_CLASS}`;
        super._init();
        this._renderSelectedItem();
        this._initActions();
    }

    _getTextContainer(itemData) {
        const itemText = itemData.text;
        const $itemContainer = $('<span>').addClass(DX_MENU_ITEM_CAPTION_CLASS);
        const itemContent = isPlainObject(itemData) ? itemText : String(itemData);

        return itemText && $itemContainer.text(itemContent);
    }

    _getPopoutContainer(itemData) {
        const items = itemData.items;
        let $popOutContainer;

        if(items && items.length) {
            const $popOutImage = $('<div>').addClass(DX_MENU_ITEM_POPOUT_CLASS);
            $popOutContainer = $('<span>').addClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS).append($popOutImage);
        }

        return $popOutContainer;
    }

    _getDataAdapterOptions() {
        return {
            rootValue: 0,
            multipleSelection: false,
            recursiveSelection: false,
            recursiveExpansion: false,
            searchValue: ""
        };
    }

    _selectByItem(selectedItem) {
        if(!selectedItem) return;

        const nodeToSelect = this._dataAdapter.getNodeByItem(selectedItem);
        this._dataAdapter.toggleSelection(nodeToSelect.internalFields.key, true);
    }

    _renderSelectedItem() {
        const selectedKeys = this._dataAdapter.getSelectedNodesKeys();
        const selectedKey = selectedKeys.length && selectedKeys[0];
        const selectedItem = this.option("selectedItem");

        if(!selectedKey) {
            this._selectByItem(selectedItem);
            return;
        }

        const node = this._dataAdapter.getNodeByKey(selectedKey);

        if(node.selectable === false) return;

        if(!selectedItem) {
            this.option("selectedItem", node.internalFields.item);
            return;
        }

        if(selectedItem !== node.internalFields.item) {
            this._dataAdapter.toggleSelection(selectedKey, false);
            this._selectByItem(selectedItem);
        }
    }

    _initActions() {}

    _initMarkup() {
        super._initMarkup();
        this._addCustomCssClass(this.$element());
        this.option("useInkRipple") && this._renderInkRipple();
    }

    _renderInkRipple() {
        this._inkRipple = render();
    }

    _toggleActiveState($element, value, e) {
        super._toggleActiveState.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: $element,
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    }

    _getShowSubmenuMode() {
        const defaultValue = "onClick";
        let optionValue = this.option("showSubmenuMode");

        optionValue = isObject(optionValue) ? optionValue.name : optionValue;

        return this._isDesktopDevice() ? optionValue : defaultValue;
    }

    _initSelectedItems() {}

    _isDesktopDevice() {
        return devices.real().deviceType === "desktop";
    }

    _initEditStrategy() {
        let Strategy = MenuBaseEditStrategy;
        this._editStrategy = new Strategy(this);
    }

    _addCustomCssClass($element) {
        $element.addClass(this.option("cssClass"));
    }

    _itemWrapperSelector() {
        return `.${DX_MENU_ITEM_WRAPPER_CLASS}`;
    }

    _hoverStartHandler(e) {
        const $itemElement = this._getItemElementByEventArgs(e);

        if(!$itemElement || this._isItemDisabled($itemElement)) return;

        e.stopPropagation();

        if(this._getShowSubmenuMode() === "onHover") {
            clearTimeout(this._showSubmenusTimeout);
            this._showSubmenusTimeout = setTimeout(this._showSubmenu.bind(this, $itemElement), this._getSubmenuDelay("show"));
        }
    }

    _getAvailableItems($itemElements) {
        return super._getAvailableItems($itemElements).filter(function() {
            return $(this).css("visibility") !== "hidden";
        });
    }

    _isItemDisabled($item) {
        return this._disabledGetter($item.data(this._itemDataKey()));
    }

    _showSubmenu($itemElement) {
        this._addExpandedClass($itemElement);
    }

    _addExpandedClass(itemElement) {
        $(itemElement).addClass(DX_MENU_ITEM_EXPANDED_CLASS);
    }

    _getSubmenuDelay(action) {
        const { delay } = this.option("showSubmenuMode");
        if(!isDefined(delay)) {
            return DEFAULT_DELAY[action];
        }

        return isObject(delay) ? delay[action] : delay;
    }

    // TODO: try to simplify
    _getItemElementByEventArgs(eventArgs) {
        let $target = $(eventArgs.target);

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
    }

    _hoverEndHandler() {
        clearTimeout(this._showSubmenusTimeout);
    }

    _hasSubmenu(node) {
        return node.internalFields.childrenKeys.length;
    }

    _renderContentImpl() {
        this._renderItems(this._dataAdapter.getRootNodes());
    }

    _renderItems(nodes, submenuContainer) {
        if(nodes.length) {
            this.hasIcons = false;

            let $nodeContainer = this._renderContainer(this.$element(), submenuContainer);
            let firstVisibleIndex = -1;
            let nextGroupFirstIndex = -1;

            each(nodes, (index, node) => {
                const isVisibleNode = node.visible !== false;

                if(isVisibleNode && firstVisibleIndex < 0) {
                    firstVisibleIndex = index;
                }

                const isBeginGroup = firstVisibleIndex < index && (node.beginGroup || index === nextGroupFirstIndex);

                if(isBeginGroup) {
                    nextGroupFirstIndex = isVisibleNode ? index : index + 1;
                }

                if(index === nextGroupFirstIndex && firstVisibleIndex < index) {
                    this._renderSeparator($nodeContainer);
                }

                this._renderItem(index, node, $nodeContainer);
            });

            if(!this.hasIcons) $nodeContainer.addClass(DX_MENU_NO_ICONS_CLASS);
        }

    }

    _renderContainer($wrapper) {
        return $("<ul>")
            .appendTo($wrapper)
            .addClass(DX_MENU_ITEMS_CONTAINER_CLASS);
    }

    _createDOMElement($nodeContainer) {
        const $node = $("<li>")
            .appendTo($nodeContainer)
            .addClass(DX_MENU_ITEM_WRAPPER_CLASS);

        return $node;
    }

    _renderItem(index, node, $nodeContainer, $nodeElement) {
        const items = this.option("items");
        let $itemFrame;

        if(node.internalFields.item.visible === false) return;
        const $node = $nodeElement || this._createDOMElement($nodeContainer);

        if(items[index + 1] && items[index + 1].beginGroup) {
            $node.addClass(DX_MENU_ITEM_LAST_GROUP_ITEM);
        }

        $itemFrame = super._renderItem(index, node.internalFields.item, $node);

        if(node.internalFields.item === this.option("selectedItem")) {
            $itemFrame.addClass(DX_MENU_SELECTED_ITEM_CLASS);
        }

        $itemFrame.attr("tabIndex", -1);

        if(this._hasSubmenu(node)) this.setAria("haspopup", "true", $itemFrame);
    }

    _renderItemFrame(index, itemData, $itemContainer) {
        const $itemFrame = $itemContainer.children(`.${ITEM_CLASS}`);

        return $itemFrame.length ? $itemFrame : super._renderItemFrame.apply(this, arguments);
    }

    _refreshItem($item, item) {
        const node = this._dataAdapter.getNodeByItem(item);
        const index = $item.data(this._itemIndexKey());
        const $nodeContainer = $item.closest("ul");
        const $nodeElement = $item.closest("li");

        this._renderItem(index, node, $nodeContainer, $nodeElement);
    }

    _addContentClasses(itemData, $itemFrame) {
        const hasText = itemData.text ? !!itemData.text.length : false;
        const hasIcon = !!itemData.icon;
        const hasSubmenu = itemData.items ? !!itemData.items.length : false;

        $itemFrame.toggleClass(DX_ITEM_HAS_TEXT, hasText);
        $itemFrame.toggleClass(DX_ITEM_HAS_ICON, hasIcon);

        if(!this.hasIcons) {
            this.hasIcons = hasIcon;
        }

        $itemFrame.toggleClass(DX_ITEM_HAS_SUBMENU, hasSubmenu);
    }

    _getItemContent($itemFrame) {
        let $itemContent = super._getItemContent($itemFrame);

        if(!$itemContent.length) {
            $itemContent = $itemFrame.children(`.${DX_ITEM_CONTENT_CLASS}`);
        }
        return $itemContent;
    }

    _postprocessRenderItem(args) {
        const $itemElement = $(args.itemElement);
        const selectedIndex = this._dataAdapter.getSelectedNodesKeys();

        if(!selectedIndex.length || !this._selectedGetter(args.itemData) || !this._isItemSelectable(args.itemData)) {
            this._setAriaSelected($itemElement, "false");
            return;
        }

        const node = this._dataAdapter.getNodeByItem(args.itemData);

        if(node.internalFields.key === selectedIndex[0]) {
            $itemElement.addClass(this._selectedItemClass());
            this._setAriaSelected($itemElement, "true");
        } else {
            this._setAriaSelected($itemElement, "false");
        }
    }

    _isItemSelectable(item) {
        return item.selectable !== false;
    }

    _renderSeparator($itemsContainer) {
        $("<li>")
            .appendTo($itemsContainer)
            .addClass(DX_MENU_SEPARATOR_CLASS);
    }

    _itemClickHandler(e) {
        if(e._skipHandling) return;

        const itemClickActionHandler = this._createAction(this._updateSubmenuVisibilityOnClick.bind(this));
        this._itemDXEventHandler(e, "onItemClick", {}, { afterExecute: itemClickActionHandler.bind(this) });
        e._skipHandling = true;
    }

    _updateSubmenuVisibilityOnClick(actionArgs) {
        this._updateSelectedItemOnClick(actionArgs);

        if(this._getShowSubmenuMode() === "onClick") {
            this._addExpandedClass(actionArgs.args[0].itemElement);
        }
    }

    _updateSelectedItemOnClick(actionArgs) {
        const args = actionArgs.args ? actionArgs.args[0] : actionArgs;

        if(!this._isItemSelectionAllowed(args.itemData)) {
            return;
        }

        const selectedItemKey = this._dataAdapter.getSelectedNodesKeys();
        const selectedNode = selectedItemKey.length && this._dataAdapter.getNodeByKey(selectedItemKey[0]);

        if(selectedNode) {
            this._toggleItemSelection(selectedNode, false);
        }

        if(!selectedNode || (selectedNode.internalFields.item !== args.itemData)) {
            this.selectItem(args.itemData);
        } else {
            this._fireSelectionChangeEvent(null, this.option("selectedItem"));
            this._setOptionSilent("selectedItem", null);
        }

    }

    _isItemSelectionAllowed(item) {
        const isSelectionByClickEnabled = this._isSelectionEnabled() && this.option("selectByClick");
        return !this._isContainerEmpty() && isSelectionByClickEnabled && this._isItemSelectable(item) && !this._itemsGetter(item);
    }

    _isContainerEmpty() {
        return this._itemContainer().is(':empty');
    }

    _syncSelectionOptions() {
        return asyncNoop();
    }

    _optionChanged(args) {
        switch(args.name) {
            case "showSubmenuMode":
                break;
            case "selectedItem":
                var node = this._dataAdapter.getNodeByItem(args.value);
                var selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];

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
                super._optionChanged(args);
        }
    }

    _toggleItemSelection(node, value) {
        const itemElement = this._getElementByItem(node.internalFields.item);
        itemElement && $(itemElement).toggleClass(DX_MENU_SELECTED_ITEM_CLASS);
        this._dataAdapter.toggleSelection(node.internalFields.key, value);
    }

    _getElementByItem(itemData) {
        let result;

        each(this._itemElements(), (_, itemElement) => {
            if($(itemElement).data(this._itemDataKey()) !== itemData) {
                return true;
            }

            result = itemElement;
            return false;
        });
        return result;
    }

    _updateSelectedItems(oldSelection, newSelection) {
        if(oldSelection || newSelection) {
            this._fireSelectionChangeEvent(newSelection, oldSelection);
        }
    }

    _fireSelectionChangeEvent(addedSelection, removedSelection) {
        this._createActionByOption("onSelectionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })({
            addedItems: [addedSelection],
            removedItems: [removedSelection]
        });
    }

    /**
        * @name dxMenuBaseMethods.selectItem
        * @publicName selectItem(itemElement)
        * @param1 itemElement:Node
    */
    selectItem(itemElement) {
        const itemData = (itemElement.nodeType) ? this._getItemData(itemElement) : itemElement;
        const selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];
        const selectedItem = this.option("selectedItem");
        const node = this._dataAdapter.getNodeByItem(itemData);

        if(node.internalFields.key !== selectedKey) {
            if(selectedKey) {
                this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false);
            }
            this._toggleItemSelection(node, true);
            this._updateSelectedItems(selectedItem, itemData);
            this._setOptionSilent("selectedItem", itemData);
        }
    }

    /**
    * @name dxMenuBaseMethods.unselectItem
    * @publicName unselectItem(itemElement)
    * @param1 itemElement:Node
    */
    unselectItem(itemElement) {
        const itemData = (itemElement.nodeType) ? this._getItemData(itemElement) : itemElement;
        const node = this._dataAdapter.getNodeByItem(itemData);
        const selectedItem = this.option("selectedItem");

        if(node.internalFields.selected) {
            this._toggleItemSelection(node, false);
            this._updateSelectedItems(selectedItem, null);
            this._setOptionSilent("selectedItem", null);
        }

    }
}

MenuBase.ItemClass = MenuItem;
module.exports = MenuBase;
