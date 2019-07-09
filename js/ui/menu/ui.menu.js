var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    each = require("../../core/utils/iterator").each,
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    getElementMaxHeightByWindow = require("../overlay/utils").getElementMaxHeightByWindow,
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    hoverEvents = require("../../events/hover"),
    MenuBase = require("../context_menu/ui.menu_base"),
    Overlay = require("../overlay"),
    Submenu = require("./ui.submenu"),
    Button = require("../button"),
    TreeView = require("../tree_view");

var DX_MENU_CLASS = "dx-menu",
    DX_MENU_VERTICAL_CLASS = DX_MENU_CLASS + "-vertical",
    DX_MENU_HORIZONTAL_CLASS = DX_MENU_CLASS + "-horizontal",
    DX_MENU_ITEM_CLASS = DX_MENU_CLASS + "-item",
    DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + "-items-container",
    DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + "-expanded",
    DX_CONTEXT_MENU_CLASS = "dx-context-menu",
    DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = DX_CONTEXT_MENU_CLASS + "-container-border",
    DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = "dx-context-menu-content-delimiter",
    DX_SUBMENU_CLASS = "dx-submenu",

    DX_STATE_DISABLED_CLASS = "dx-state-disabled",
    DX_STATE_HOVER_CLASS = "dx-state-hover",
    DX_STATE_ACTIVE_CLASS = "dx-state-active",

    DX_ADAPTIVE_MODE_CLASS = DX_MENU_CLASS + "-adaptive-mode",
    DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = DX_MENU_CLASS + "-hamburger-button",
    DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = DX_ADAPTIVE_MODE_CLASS + "-overlay-wrapper",


    FOCUS_UP = "up",
    FOCUS_DOWN = "down",
    FOCUS_LEFT = "left",
    FOCUS_RIGHT = "right",

    SHOW_SUBMENU_OPERATION = "showSubmenu",
    NEXTITEM_OPERATION = "nextItem",
    PREVITEM_OPERATION = "prevItem",

    DEFAULT_DELAY = {
        "show": 50,
        "hide": 300
    },

    ACTIONS = ["onSubmenuShowing", "onSubmenuShown", "onSubmenuHiding", "onSubmenuHidden", "onItemContextMenu", "onItemClick", "onSelectionChanged"];

var Menu = MenuBase.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxMenuOptions.items
            * @type Array<dxMenuItem>
            */
            /**
            * @name dxMenuOptions.orientation
            * @type Enums.Orientation
            * @default "horizontal"
            */
            orientation: "horizontal",

            /**
            * @name dxMenuOptions.submenuDirection
            * @type Enums.SubmenuDirection
            * @default "auto"
            */
            submenuDirection: "auto",

            /**
            * @name dxMenuOptions.showFirstSubmenuMode
            * @type Object|Enums.ShowSubmenuMode
            * @default { name: "onClick", delay: { show: 50, hide: 300 } }
            */
            showFirstSubmenuMode: {
                /**
                * @name dxMenuOptions.showFirstSubmenuMode.name
                * @type Enums.ShowSubmenuMode
                * @default "onClick"
                */
                name: "onClick",

                /**
                * @name dxMenuOptions.showFirstSubmenuMode.delay
                * @type Object|number
                * @default { show: 50, hide: 300 }
                */
                delay: {
                    /**
                    * @name dxMenuOptions.showFirstSubmenuMode.delay.show
                    * @type number
                    * @default 50
                    */
                    show: 50,

                    /**
                    * @name dxMenuOptions.showFirstSubmenuMode.delay.hide
                    * @type number
                    * @default 300
                    */
                    hide: 300
                }
            },

            /**
            * @name dxMenuOptions.hideSubmenuOnMouseLeave
            * @type boolean
            * @default false
            */
            hideSubmenuOnMouseLeave: false,

            /**
            * @name dxMenuOptions.onSubmenuShowing
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 rootItem:dxElement
            * @action
            */
            onSubmenuShowing: null,

            /**
            * @name dxMenuOptions.onSubmenuShown
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 rootItem:dxElement
            * @action
            */
            onSubmenuShown: null,

            /**
            * @name dxMenuOptions.onSubmenuHiding
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 rootItem:dxElement
            * @type_function_param1_field5 cancel:boolean
            * @action
            */
            onSubmenuHiding: null,

            /**
            * @name dxMenuOptions.onSubmenuHidden
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 rootItem:dxElement
            * @action
            */
            onSubmenuHidden: null,

            /**
            * @name dxMenuOptions.adaptivityEnabled
            * @type boolean
            * @default false
            */
            adaptivityEnabled: false

            /**
            * @name dxMenuOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxMenuOptions.onSelectionChange
            * @hidden
            * @action
            */

            /**
            * @name dxMenuOptions.onItemReordered
            * @hidden
            */
            /**
            * @name dxMenuItem
            * @inherits dxMenuBaseItem
            * @type object
            */
            /**
            * @name dxMenuItem.items
            * @type Array<dxMenuItem>
            */
        });
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            animation: true,
            selectedItem: true
        });
    },

    _itemElements: function() {
        var rootMenuElements = this.callBase(),
            submenuElements = this._submenuItemElements();

        return rootMenuElements.add(submenuElements);
    },

    _submenuItemElements: function() {
        var elements = [],
            itemSelector = "." + DX_MENU_ITEM_CLASS,
            currentSubmenu = this._submenus.length && this._submenus[0];

        if(currentSubmenu && currentSubmenu.itemsContainer()) {
            elements = currentSubmenu.itemsContainer().find(itemSelector);
        }

        return elements;
    },

    _focusTarget: function() {
        return this.$element();
    },

    _isMenuHorizontal: function() {
        return this.option("orientation") === "horizontal";
    },

    _moveFocus: function(location) {
        var $items = this._getAvailableItems(),
            isMenuHorizontal = this._isMenuHorizontal(),
            argument,
            $activeItem = this._getActiveItem(true),
            operation,
            navigationAction,
            $newTarget;

        switch(location) {
            case FOCUS_UP:
                operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(PREVITEM_OPERATION);
                argument = isMenuHorizontal ? $activeItem : $items;
                navigationAction = this._getKeyboardNavigationAction(operation, argument);
                $newTarget = navigationAction();
                break;
            case FOCUS_DOWN:
                operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(NEXTITEM_OPERATION);
                argument = isMenuHorizontal ? $activeItem : $items;
                navigationAction = this._getKeyboardNavigationAction(operation, argument);
                $newTarget = navigationAction();
                break;
            case FOCUS_RIGHT:
                operation = isMenuHorizontal ? this._getItemsNavigationOperation(NEXTITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
                argument = isMenuHorizontal ? $items : $activeItem;
                navigationAction = this._getKeyboardNavigationAction(operation, argument);
                $newTarget = navigationAction();
                break;
            case FOCUS_LEFT:
                operation = isMenuHorizontal ? this._getItemsNavigationOperation(PREVITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
                argument = isMenuHorizontal ? $items : $activeItem;
                navigationAction = this._getKeyboardNavigationAction(operation, argument);
                $newTarget = navigationAction();
                break;
            default:
                return this.callBase(location);
        }

        if($newTarget && $newTarget.length !== 0) {
            this.option("focusedElement", getPublicElement($newTarget));
        }
    },

    _getItemsNavigationOperation: function(operation) {
        var navOperation = operation;

        if(this.option("rtlEnabled")) {
            navOperation = operation === PREVITEM_OPERATION ? NEXTITEM_OPERATION : PREVITEM_OPERATION;
        }

        return navOperation;
    },

    _getKeyboardNavigationAction: function(operation, argument) {
        var action = commonUtils.noop;

        switch(operation) {
            case SHOW_SUBMENU_OPERATION:
                if(!argument.hasClass(DX_STATE_DISABLED_CLASS)) {
                    action = this._showSubmenu.bind(this, argument);
                }
                break;
            case NEXTITEM_OPERATION:
                action = this._nextItem.bind(this, argument);
                break;
            case PREVITEM_OPERATION:
                action = this._prevItem.bind(this, argument);
                break;
        }

        return action;
    },

    _clean: function() {
        this.callBase();
        this.option("templatesRenderAsynchronously") && clearTimeout(this._resizeEventTimer);
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            if(!this._menuItemsWidth) {
                this._updateItemsWidthCache();
            }
            this._dimensionChanged();
        }
    },

    _isAdaptivityEnabled: function() {
        return this.option("adaptivityEnabled") && this.option("orientation") === "horizontal";
    },

    _updateItemsWidthCache: function() {
        var $menuItems = this.$element().find("ul").first().children("li").children("." + DX_MENU_ITEM_CLASS);
        this._menuItemsWidth = this._getSummaryItemsWidth($menuItems, true);
    },

    _dimensionChanged: function() {
        if(!this._isAdaptivityEnabled()) {
            return;
        }

        var containerWidth = this.$element().outerWidth();
        this._toggleAdaptiveMode(this._menuItemsWidth > containerWidth);
    },

    _init: function() {
        this.callBase();
        this._submenus = [];
    },

    _initActions: function() {
        this._actions = {};

        each(ACTIONS, (function(index, action) {
            this._actions[action] = this._createActionByOption(action);
        }).bind(this));
    },

    _initMarkup: function() {
        this._visibleSubmenu = null;
        this.$element().addClass(DX_MENU_CLASS);

        this.callBase();
        this.setAria("role", "menubar");
    },

    _render: function() {
        this.callBase();
        this._initAdaptivity();
    },

    _renderHamburgerButton: function() {
        this._hamburger = new Button($("<div>").addClass(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS), {
            icon: 'menu',
            activeStateEnabled: false,
            onClick: this._toggleTreeView.bind(this)
        });

        return this._hamburger.$element();
    },

    _toggleTreeView: function(state) {
        if(typeUtils.isPlainObject(state)) {
            state = !this._overlay.option("visible");
        }
        this._overlay.option("visible", state);
        this._toggleHamburgerActiveState(state);
    },

    _toggleHamburgerActiveState: function(state) {
        this._hamburger && this._hamburger.$element().toggleClass(DX_STATE_ACTIVE_CLASS, state);
    },

    _toggleAdaptiveMode: function(state) {
        var $menuItemsContainer = this.$element().find("." + DX_MENU_HORIZONTAL_CLASS),
            $adaptiveElements = this.$element().find("." + DX_ADAPTIVE_MODE_CLASS);

        if(state) {
            this._hideVisibleSubmenu();
        } else {
            this._treeView && this._treeView.collapseAll();
            this._overlay && this._toggleTreeView(state);
        }

        $menuItemsContainer.toggle(!state);
        $adaptiveElements.toggle(state);
    },

    _removeAdaptivity: function() {
        if(!this._$adaptiveContainer) {
            return;
        }
        this._toggleAdaptiveMode(false);
        this._$adaptiveContainer.remove();
        this._$adaptiveContainer = null;
        this._treeView = null;
        this._hamburger = null;
        this._overlay = null;
    },

    _treeviewItemClickHandler: function(e) {
        this._actions["onItemClick"](e);

        if(!e.node.children.length) {
            this._toggleTreeView(false);
        }
    },

    _getAdaptiveOverlayOptions: function() {
        var rtl = this.option("rtlEnabled"),
            position = rtl ? "right" : "left";

        return {
            maxHeight: function() {
                return getElementMaxHeightByWindow(this.$element());
            }.bind(this),
            deferRendering: false,
            shading: false,
            animation: false,
            closeOnTargetScroll: true,
            onHidden: (function() {
                this._toggleHamburgerActiveState(false);
            }).bind(this),
            height: "auto",
            closeOnOutsideClick: function(e) {
                return !($(e.target).closest("." + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).length);
            },
            position: {
                collision: "flipfit",
                at: "bottom " + position,
                my: "top " + position,
                of: this._hamburger.$element()
            }
        };
    },

    _getTreeViewOptions: function() {
        var menuOptions = {},
            that = this,
            optionsToTransfer = [
                "rtlEnabled", "width", "accessKey", "activeStateEnabled", "animation", "dataSource",
                "disabled", "displayExpr", "displayExpr", "focusStateEnabled", "hint", "hoverStateEnabled",
                "itemsExpr", "items", "itemTemplate", "selectedExpr",
                "selectionMode", "tabIndex", "visible"
            ],
            actionsToTransfer = ["onItemContextMenu", "onSelectionChanged"];

        each(optionsToTransfer, function(_, option) {
            menuOptions[option] = that.option(option);
        });

        each(actionsToTransfer, function(_, actionName) {
            menuOptions[actionName] = (function(e) {
                this._actions[actionName](e);
            }).bind(that);
        });

        return extend(menuOptions, {
            dataSource: that.getDataSource(),
            animationEnabled: !!this.option("animation"),
            onItemClick: that._treeviewItemClickHandler.bind(that),
            onItemExpanded: (function(e) {
                this._overlay.repaint();
                this._actions["onSubmenuShown"](e);
            }).bind(that),
            onItemCollapsed: (function(e) {
                this._overlay.repaint();
                this._actions["onSubmenuHidden"](e);
            }).bind(that),
            selectNodesRecursive: false,
            selectByClick: this.option("selectByClick"),
            expandEvent: "click"
        });
    },

    _initAdaptivity: function() {
        if(!this._isAdaptivityEnabled()) return;

        this._$adaptiveContainer = $("<div>").addClass(DX_ADAPTIVE_MODE_CLASS);

        var $hamburger = this._renderHamburgerButton();

        this._treeView = this._createComponent($("<div>"), TreeView, this._getTreeViewOptions());

        this._overlay = this._createComponent($("<div>"), Overlay, this._getAdaptiveOverlayOptions());

        this._overlay.$content()
            .append(this._treeView.$element())
            .addClass(DX_ADAPTIVE_MODE_CLASS)
            .addClass(this.option("cssClass"));

        this._overlay._wrapper().addClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS);

        this._$adaptiveContainer.append($hamburger);
        this._$adaptiveContainer.append(this._overlay.$element());

        this.$element().append(this._$adaptiveContainer);

        this._updateItemsWidthCache();
        this._dimensionChanged();
    },

    _getDelay: function(delayType) {
        var delay = this.option("showFirstSubmenuMode").delay;

        if(!typeUtils.isDefined(delay)) {
            return DEFAULT_DELAY[delayType];
        } else {
            return typeUtils.isObject(delay) ? delay[delayType] : delay;
        }
    },

    _keyboardHandler: function(e) {
        return this._visibleSubmenu ? true : this.callBase(e);
    },

    _renderContainer: function() {
        var $wrapper = $("<div>");

        $wrapper
            .appendTo(this.$element())
            .addClass(this._isMenuHorizontal() ? DX_MENU_HORIZONTAL_CLASS : DX_MENU_VERTICAL_CLASS);

        return this.callBase($wrapper);
    },

    _renderSubmenuItems: function(node, $itemFrame) {
        var submenu = this._createSubmenu(node, $itemFrame);

        this._submenus.push(submenu);
        this._renderBorderElement($itemFrame);
        return submenu;
    },

    _createSubmenu: function(node, $rootItem) {
        var $submenuContainer = $("<div>").addClass(DX_CONTEXT_MENU_CLASS)
            .appendTo($rootItem);

        var childKeyboardProcessor = this._keyboardProcessor && this._keyboardProcessor.attachChildProcessor(),
            items = this._getChildNodes(node),
            result = this._createComponent($submenuContainer, Submenu, extend(this._getSubmenuOptions(), {
                _keyboardProcessor: childKeyboardProcessor,
                _dataAdapter: this._dataAdapter,
                _parentKey: node.internalFields.key,
                items: items,
                onHoverStart: this._clearTimeouts.bind(this),
                position: this.getSubmenuPosition($rootItem)
            }));

        this._attachSubmenuHandlers($rootItem, result);

        return result;
    },

    _getSubmenuOptions: function() {
        var $submenuTarget = $("<div>"),
            isMenuHorizontal = this._isMenuHorizontal();

        return {
            itemTemplate: this.option("itemTemplate"),
            target: $submenuTarget,
            orientation: this.option("orientation"),
            selectionMode: this.option("selectionMode"),
            cssClass: this.option("cssClass"),
            selectByClick: this.option("selectByClick"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            activeStateEnabled: this.option("activeStateEnabled"),
            focusStateEnabled: this.option("focusStateEnabled"),
            animation: this.option("animation"),
            showSubmenuMode: this.option("showSubmenuMode"),
            displayExpr: this.option("displayExpr"),
            disabledExpr: this.option("disabledExpr"),
            selectedExpr: this.option("selectedExpr"),
            itemsExpr: this.option("itemsExpr"),
            onFocusedItemChanged: function(e) {
                if(!e.component.option("visible")) {
                    return;
                }
                this.option("focusedElement", e.component.option("focusedElement"));
            }.bind(this),
            onSelectionChanged: this._nestedItemOnSelectionChangedHandler.bind(this),
            onItemClick: this._nestedItemOnItemClickHandler.bind(this),
            onItemRendered: this.option("onItemRendered"),
            onLeftFirstItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, PREVITEM_OPERATION),
            onLeftLastItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION),
            onCloseRootSubmenu: this._moveMainMenuFocus.bind(this, isMenuHorizontal ? PREVITEM_OPERATION : null),
            onExpandLastSubmenu: isMenuHorizontal ? this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION) : null
        };
    },

    _getShowFirstSubmenuMode: function() {
        if(!this._isDesktopDevice()) {
            return "onClick";
        }

        var optionValue = this.option("showFirstSubmenuMode");

        return typeUtils.isObject(optionValue) ? optionValue.name : optionValue;
    },

    _moveMainMenuFocus: function(direction) {
        var $items = this._getAvailableItems(),
            itemCount = $items.length,
            $currentItem = $items.filter("." + DX_MENU_ITEM_EXPANDED_CLASS).eq(0),
            itemIndex = $items.index($currentItem);

        this._hideSubmenu(this._visibleSubmenu);

        itemIndex += direction === PREVITEM_OPERATION ? -1 : 1;

        if(itemIndex >= itemCount) {
            itemIndex = 0;
        } else if(itemIndex < 0) {
            itemIndex = itemCount - 1;
        }

        var $newItem = $items.eq(itemIndex);

        this.option("focusedElement", getPublicElement($newItem));
    },

    _nestedItemOnSelectionChangedHandler: function(args) {
        var selectedItem = args.addedItems.length && args.addedItems[0],
            submenu = Submenu.getInstance(args.element),
            onSelectionChanged = this._actions["onSelectionChanged"];

        onSelectionChanged(args);

        selectedItem && this._clearSelectionInSubmenus(selectedItem[0], submenu);
        this._clearRootSelection();
        this._setOptionSilent("selectedItem", selectedItem);
    },

    _clearSelectionInSubmenus: function(item, targetSubmenu) {
        var that = this,
            cleanAllSubmenus = !arguments.length;

        each(this._submenus, function(index, submenu) {
            var $submenu = submenu._itemContainer(),
                isOtherItem = !$submenu.is(targetSubmenu && targetSubmenu._itemContainer()),
                $selectedItem = $submenu.find("." + that._selectedItemClass());

            if((isOtherItem && $selectedItem.length) || cleanAllSubmenus) {
                var selectedItemData;

                $selectedItem.removeClass(that._selectedItemClass());
                selectedItemData = that._getItemData($selectedItem);

                if(selectedItemData) {
                    selectedItemData.selected = false;
                }

                submenu._clearSelectedItems();
            }
        });
    },

    _clearRootSelection: function() {
        var $prevSelectedItem = this.$element().find("." + DX_MENU_ITEMS_CONTAINER_CLASS).first().children().children().filter("." + this._selectedItemClass());

        if($prevSelectedItem.length) {
            var prevSelectedItemData;

            prevSelectedItemData = this._getItemData($prevSelectedItem);
            prevSelectedItemData.selected = false;
            $prevSelectedItem.removeClass(this._selectedItemClass());
        }

    },

    _nestedItemOnItemClickHandler: function(e) {
        this._actions["onItemClick"](e);
    },

    _attachSubmenuHandlers: function($rootItem, submenu) {
        var that = this,
            $submenuOverlayContent = submenu.getOverlayContent(),
            submenus = $submenuOverlayContent.find("." + DX_SUBMENU_CLASS),
            submenuMouseLeaveName = eventUtils.addNamespace(hoverEvents.end, this.NAME + "_submenu");

        submenu.option({
            onShowing: this._submenuOnShowingHandler.bind(this, $rootItem, submenu),
            onShown: this._submenuOnShownHandler.bind(this, $rootItem, submenu),
            onHiding: this._submenuOnHidingHandler.bind(this, $rootItem, submenu),
            onHidden: this._submenuOnHiddenHandler.bind(this, $rootItem, submenu)
        });

        each(submenus, function(index, submenu) {
            eventsEngine.off(submenu, submenuMouseLeaveName);
            eventsEngine.on(submenu, submenuMouseLeaveName, null, that._submenuMouseLeaveHandler.bind(that, $rootItem));
        });
    },

    _submenuOnShowingHandler: function($rootItem, submenu) {
        var $border = $rootItem.children("." + DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS);

        this._actions.onSubmenuShowing({
            rootItem: getPublicElement($rootItem),
            submenu: submenu
        });

        $border.show();

        $rootItem.addClass(DX_MENU_ITEM_EXPANDED_CLASS);
    },

    _submenuOnShownHandler: function($rootItem, submenu) {
        this._actions.onSubmenuShown({
            rootItem: getPublicElement($rootItem),
            submenu: submenu
        });
    },

    _submenuOnHidingHandler: function($rootItem, submenu, eventArgs) {
        var $border = $rootItem.children("." + DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS),
            args = eventArgs;

        args.rootItem = getPublicElement($rootItem);
        args.submenu = submenu;

        this._actions.onSubmenuHiding(args);
        eventArgs = args;

        if(!eventArgs.cancel) {
            if(this._visibleSubmenu === submenu) this._visibleSubmenu = null;
            $border.hide();
            $rootItem.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
        }
    },

    _submenuOnHiddenHandler: function($rootItem, submenu) {
        this._actions.onSubmenuHidden({
            rootItem: getPublicElement($rootItem),
            submenu: submenu
        });
    },

    _submenuMouseLeaveHandler: function($rootItem, eventArgs) {
        var that = this,
            target = $(eventArgs.relatedTarget).parents("." + DX_CONTEXT_MENU_CLASS)[0],
            contextMenu = that._getSubmenuByRootElement($rootItem).getOverlayContent()[0];

        if(that.option("hideSubmenuOnMouseLeave") && target !== contextMenu) {
            that._clearTimeouts();
            setTimeout(that._hideSubmenuAfterTimeout.bind(that), that._getDelay("hide"));
        }
    },

    _hideSubmenuAfterTimeout: function() {
        if(!this._visibleSubmenu) {
            return;
        }

        var isRootItemHovered = $(this._visibleSubmenu.$element().context).hasClass(DX_STATE_HOVER_CLASS),
            isSubmenuItemHovered = this._visibleSubmenu.getOverlayContent().find("." + DX_STATE_HOVER_CLASS).length;

        if(!isSubmenuItemHovered && !isRootItemHovered) {
            this._visibleSubmenu.hide();
        }
    },


    _getSubmenuByRootElement: function($rootItem) {
        if(!$rootItem) {
            return false;
        }

        var $submenu = $rootItem.children("." + DX_CONTEXT_MENU_CLASS);

        return $submenu.length && Submenu.getInstance($submenu);
    },

    getSubmenuPosition: function($rootItem) {
        var isHorizontalMenu = this._isMenuHorizontal(),
            submenuDirection = this.option("submenuDirection").toLowerCase(),
            rtlEnabled = this.option("rtlEnabled"),
            submenuPosition = {
                collision: "flip",
                of: $rootItem
            };

        switch(submenuDirection) {
            case "leftortop":
                submenuPosition.at = "left top";
                submenuPosition.my = isHorizontalMenu ? "left bottom" : "right top";
                break;
            case "rightorbottom":
                submenuPosition.at = isHorizontalMenu ? "left bottom" : "right top";
                submenuPosition.my = "left top";
                break;
            default:
                if(isHorizontalMenu) {
                    submenuPosition.at = rtlEnabled ? "right bottom" : "left bottom";
                    submenuPosition.my = rtlEnabled ? "right top" : "left top";
                } else {
                    submenuPosition.at = rtlEnabled ? "left top" : "right top";
                    submenuPosition.my = rtlEnabled ? "right top" : "left top";
                }
                break;
        }

        return submenuPosition;
    },

    _renderBorderElement: function($item) {
        $("<div>")
            .appendTo($item)
            .addClass(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS)
            .hide();
    },

    _itemPointerDownHandler: function(e) {
        var $target = $(e.target),
            $closestItem = $target.closest(this._itemElements());

        if($closestItem.hasClass("dx-menu-item-has-submenu")) {
            this.option("focusedElement", null);
            return;
        }

        this.callBase(e);
    },

    _hoverStartHandler: function(e) {
        var mouseMoveEventName = eventUtils.addNamespace(pointerEvents.move, this.NAME),
            $item = this._getItemElementByEventArgs(e),
            node = this._dataAdapter.getNodeByItem(this._getItemData($item)),
            isSelectionActive = typeUtils.isDefined(e.buttons) && e.buttons === 1 || !typeUtils.isDefined(e.buttons) && e.which === 1;

        if(this._isItemDisabled($item)) {
            return;
        }

        eventsEngine.off($item, mouseMoveEventName);

        if(!this._hasChildren(node)) {
            this._showSubmenuTimer = setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay("hide"));
            return;
        }

        if(this._getShowFirstSubmenuMode() === "onHover" && !isSelectionActive) {
            var submenu = this._getSubmenuByElement($item);

            this._clearTimeouts();

            if(!submenu.isOverlayVisible()) {
                eventsEngine.on($item, mouseMoveEventName, this._itemMouseMoveHandler.bind(this));
                this._showSubmenuTimer = this._getDelay("hide");
            }
        }
    },

    _hoverEndHandler: function(eventArg) {
        var that = this,
            $item = that._getItemElementByEventArgs(eventArg),
            relatedTarget = $(eventArg.relatedTarget);

        that.callBase(eventArg);
        that._clearTimeouts();

        if(that._isItemDisabled($item)) {
            return;
        }

        if(relatedTarget.hasClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)) {
            return;
        }

        if(that.option("hideSubmenuOnMouseLeave") && !relatedTarget.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS)) {
            that._hideSubmenuTimer = setTimeout(function() { that._hideSubmenuAfterTimeout(); }, that._getDelay("hide"));
        }
    },

    _hideVisibleSubmenu: function() {
        if(!this._visibleSubmenu) {
            return false;
        }

        this._hideSubmenu(this._visibleSubmenu);
        return true;
    },

    _showSubmenu: function($itemElement) {
        var submenu = this._getSubmenuByElement($itemElement);

        if(this._visibleSubmenu !== submenu) {
            this._hideVisibleSubmenu();
        }

        if(submenu) {
            submenu.show();
            this.option("focusedElement", submenu.option("focusedElement"));
        }

        this._visibleSubmenu = submenu;
        this._hoveredRootItem = $itemElement;
    },

    _hideSubmenu: function(submenu) {
        submenu && submenu.hide();

        if(this._visibleSubmenu === submenu) {
            this._visibleSubmenu = null;
        }

        this._hoveredRootItem = null;
    },

    _itemMouseMoveHandler: function(e) {
        // todo: replace mousemove with hover event
        if(e.pointers && e.pointers.length) {
            return;
        }

        var that = this,
            $item = $(e.currentTarget);

        if(!typeUtils.isDefined(that._showSubmenuTimer)) {
            return;
        }

        that._clearTimeouts();

        that._showSubmenuTimer = setTimeout(function() {
            var submenu = that._getSubmenuByElement($item);

            if(submenu && !submenu.isOverlayVisible()) {
                that._showSubmenu($item);
            }
        }, that._getDelay("show"));
    },

    _clearTimeouts: function() {
        clearTimeout(this._hideSubmenuTimer);
        clearTimeout(this._showSubmenuTimer);
    },

    _getSubmenuByElement: function($itemElement, itemData) {
        var submenu = this._getSubmenuByRootElement($itemElement);

        if(submenu) {
            return submenu;
        } else {
            itemData = itemData || this._getItemData($itemElement);
            var node = this._dataAdapter.getNodeByItem(itemData);
            return this._hasChildren(node) && this._renderSubmenuItems(node, $itemElement);
        }
    },

    _updateSubmenuVisibilityOnClick: function(actionArgs) {
        var args = actionArgs.args.length && actionArgs.args[0],
            currentSubmenu;

        if(!args || this._disabledGetter(args.itemData)) {
            return;
        }

        var $itemElement = $(args.itemElement);
        currentSubmenu = this._getSubmenuByElement($itemElement, args.itemData);

        this._updateSelectedItemOnClick(actionArgs);

        if(this._visibleSubmenu) {
            if(this._visibleSubmenu === currentSubmenu) {
                if(this.option("showFirstSubmenuMode") === "onClick") this._hideSubmenu(this._visibleSubmenu);
                return;
            } else {
                this._hideSubmenu(this._visibleSubmenu);
            }
        }

        if(!currentSubmenu) {
            return;
        }

        if(!currentSubmenu.isOverlayVisible()) {
            this._showSubmenu($itemElement);
            return;
        }

    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "orientation":
            case "submenuDirection":
                this._invalidate();
                break;
            case "showFirstSubmenuMode":
            case "hideSubmenuOnMouseLeave":
                break;
            case "showSubmenuMode":
                this._changeSubmenusOption(args.name, args.value);
                break;
            case "onSubmenuShowing":
            case "onSubmenuShown":
            case "onSubmenuHiding":
            case "onSubmenuHidden":
                this._initActions();
                break;
            case "adaptivityEnabled":
                args.value ? this._initAdaptivity() : this._removeAdaptivity();
                break;
            case "width":
                if(this._isAdaptivityEnabled()) {
                    this._treeView.option(args.name, args.value);
                    this._overlay.option(args.name, args.value);
                }
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "animation":
                if(this._isAdaptivityEnabled()) {
                    this._treeView.option("animationEnabled", !!args.value);
                }
                this.callBase(args);
                break;
            default:
                if(this._isAdaptivityEnabled()) {
                    this._treeView.option(args.name, args.value);
                }
                this.callBase(args);
        }
    },

    _changeSubmenusOption: function(name, value) {
        each(this._submenus, function(index, submenu) {
            submenu.option(name, value);
        });
    },

    selectItem: function(itemElement) {
        this._hideSubmenu(this._visibleSubmenu);
        this.callBase(itemElement);
    },

    unselectItem: function(itemElement) {
        this._hideSubmenu(this._visibleSubmenu);
        this.callBase(itemElement);
    }
});

registerComponent("dxMenu", Menu);

module.exports = Menu;
