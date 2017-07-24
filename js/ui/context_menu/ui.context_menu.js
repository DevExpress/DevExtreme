"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    inArray = require("../../core/utils/array").inArray,
    extend = require("../../core/utils/extend").extend,
    fx = require("../../animation/fx"),
    positionUtils = require("../../animation/position"),
    devices = require("../../core/devices"),
    eventUtils = require("../../events/utils"),
    Overlay = require("../overlay"),
    MenuBase = require("./ui.menu_base");

var DX_MENU_CLASS = "dx-menu",
    DX_MENU_ITEM_CLASS = DX_MENU_CLASS + "-item",
    DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + "-expanded",
    DX_MENU_PHONE_CLASS = "dx-menu-phone-overlay",
    DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + "-items-container",
    DX_MENU_ITEM_WRAPPER_CLASS = DX_MENU_ITEM_CLASS + "-wrapper",
    DX_SUBMENU_CLASS = "dx-submenu",
    DX_CONTEXT_MENU_CLASS = "dx-context-menu",
    DX_HAS_CONTEXT_MENU_CLASS = "dx-has-context-menu",
    DX_STATE_DISABLED_CLASS = "dx-state-disabled",

    FOCUS_UP = "up",
    FOCUS_DOWN = "down",
    FOCUS_LEFT = "left",
    FOCUS_RIGHT = "right",
    FOCUS_FIRST = "first",
    FOCUS_LAST = "last",

    ACTIONS = [
        "onShowing", "onShown", "onSubmenuCreated",
        "onHiding", "onHidden", "onPositioning", "onLeftFirstItem",
        "onLeftLastItem", "onCloseRootSubmenu", "onExpandLastSubmenu"
    ],
    LOCAL_SUBMENU_DIRECTIONS = [FOCUS_UP, FOCUS_DOWN, FOCUS_FIRST, FOCUS_LAST],
    DEFAULT_SHOW_EVENT = "dxcontextmenu";

var ContextMenu = MenuBase.inherit((function() {
    var getShowEvent = function(that) {
            var result = null,
                optionValue = that.option("showEvent");

            if(typeUtils.isObject(optionValue)) {
                if(optionValue.name !== null) {
                    result = optionValue.name || DEFAULT_SHOW_EVENT;
                }
            } else {
                result = optionValue;
            }

            return result;
        },
        getShowDelay = function(that) {
            var optionValue = that.option("showEvent");
            return typeUtils.isObject(optionValue) && optionValue.delay;
        };

    return {
        _getDefaultOptions: function() {
            return extend(this.callBase(), {
                /**
                * @name dxContextMenuOptions_showEvent
                * @publicName showEvent
                * @type Object|string
                * @default "dxcontextmenu"
                */
                /**
                * @name dxContextMenuOptions_showEvent_name
                * @publicName name
                * @type string
                * @default undefined
                */
                /**
                * @name dxContextMenuOptions_showEvent_delay
                * @publicName delay
                * @type number
                * @default undefined
                */
                showEvent: DEFAULT_SHOW_EVENT,

                /**
                * @name dxContextMenuOptions_closeOnOutsideClick
                * @publicName closeOnOutsideClick
                * @type boolean|function
                * @default true
                * @type_function_param1 event:jQueryEvent
                * @type_function_return Boolean
                */
                closeOnOutsideClick: true,

                /**
                * @name dxContextMenuOptions_position
                * @publicName position
                * @type positionConfig
                * @default { my: 'top left', at: 'top left' }
                * @ref
                */
                position: {
                    at: "top left",
                    my: "top left"
                },

                /**
                * @name dxContextMenuOptions_onShowing
                * @publicName onShowing
                * @extends Action
                * @type_function_param1_field4 cancel:boolean
                * @action
                */
                onShowing: null,

                /**
                * @name dxContextMenuOptions_onShown
                * @publicName onShown
                * @extends Action
                * @action
                */
                onShown: null,

                onSubmenuCreated: null,

                /**
                * @name dxContextMenuOptions_onHiding
                * @publicName onHiding
                * @extends Action
                * @type_function_param1_field4 cancel:boolean
                * @action
                */
                onHiding: null,

                /**
                * @name dxContextMenuOptions_onHidden
                * @publicName onHidden
                * @extends Action
                * @action
                */
                onHidden: null,

                /**
                * @name dxContextMenuOptions_onPositioning
                * @publicName onPositioning
                * @extends Action
                * @type_function_param1_field4 jQueryEvent:jQueryEvent
                * @type_function_param1_field5 position:position
                * @action
                */
                onPositioning: null,

                /**
                * @name dxContextMenuOptions_submenuDirection
                * @publicName submenuDirection
                * @type string
                * @default "auto"
                * @acceptValues "auto"|"right"|"left"
                */
                submenuDirection: "auto",

                /**
                * @name dxContextMenuOptions_visible
                * @publicName visible
                * @type boolean
                * @default false
                */
                visible: false,

                /**
                * @name dxContextMenuOptions_target
                * @publicName target
                * @type string|Node|jQuery
                * @default undefined
                */
                target: undefined,

                /**
                * @name dxContextMenuOptions_itemHoldAction
                * @publicName itemHoldAction
                * @hidden
                * @extend_doc
                */

                /**
                * @name dxContextMenuOptions_onItemReordered
                * @publicName onItemReordered
                * @hidden
                * @extend_doc
                */


                onLeftFirstItem: null,
                onLeftLastItem: null,
                onCloseRootSubmenu: null,
                onExpandLastSubmenu: null
            });
        },

        _initActions: function() {
            this._actions = {};

            each(ACTIONS, (function(index, action) {
                this._actions[action] = this._createActionByOption(action) || noop;
            }).bind(this));
        },

        _setOptionsByReference: function() {
            this.callBase();

            extend(this._optionsByReference, {
                animation: true,
                selectedItem: true
            });
        },

        _focusInHandler: noop,

        _itemContainer: function() {
            return this._overlay ? this._overlay.content() : $();
        },

        _eventBindingTarget: function() {
            return this._itemContainer();
        },

        itemsContainer: function() {
            return this._overlay ? this._overlay.content() : undefined;
        },

        _supportedKeys: function() {
            var selectItem = function() {
                var $item = this.option("focusedElement");

                this.hide();

                if(!$item || !this._isSelectionEnabled()) {
                    return;
                }

                this.selectItem($item[0]);
            };
            return extend(this.callBase(), {
                space: selectItem,
                esc: this.hide
            });
        },

        _getActiveItem: function() {
            var $items = this._getAvailableItems(),
                $focusedItem = $items.filter(".dx-state-focused"),
                $hoveredItem = $items.filter(".dx-state-hover"),
                $hoveredItemContainer = $hoveredItem.closest("." + DX_MENU_ITEMS_CONTAINER_CLASS);

            if($hoveredItemContainer.find("." + DX_MENU_ITEM_CLASS).index($focusedItem) >= 0) {
                return $focusedItem;
            }
            if($hoveredItem.length) return $hoveredItem;

            return this.callBase();
        },

        _moveFocus: function(location) {
            var $items = this._getItemsByLocation(location),
                $oldTarget = this._getActiveItem(true),
                $newTarget,
                $hoveredItem = this.itemsContainer().find(".dx-state-hover"),
                $focusedItem = this.option("focusedElement"),
                $activeItemHighlighted = !!($focusedItem || $hoveredItem.length);

            switch(location) {
                case FOCUS_UP:
                    $newTarget = $activeItemHighlighted ? this._prevItem($items) : $oldTarget;

                    if($oldTarget.is($items.first())) {
                        this._actions.onLeftFirstItem($oldTarget);
                    }
                    break;
                case FOCUS_DOWN:
                    $newTarget = $activeItemHighlighted ? this._nextItem($items) : $oldTarget;

                    if($oldTarget.is($items.last())) {
                        this._actions.onLeftLastItem($oldTarget);
                    }
                    break;
                case FOCUS_RIGHT:
                    $newTarget = this.option("rtlEnabled") ? this._hideSubmenuHandler() : this._expandSubmenuHandler($items, location);
                    break;
                case FOCUS_LEFT:
                    $newTarget = this.option("rtlEnabled") ? this._expandSubmenuHandler($items, location) : this._hideSubmenuHandler();
                    break;
                case FOCUS_FIRST:
                    $newTarget = $items.first();
                    break;
                case FOCUS_LAST:
                    $newTarget = $items.last();
                    break;
                default:
                    return this.callBase(location);
            }

            if($newTarget.length !== 0) {
                this.option("focusedElement", $newTarget);
            }
        },

        _getItemsByLocation: function(location) {
            var $items,
                $activeItem = this._getActiveItem(true);

            if(inArray(location, LOCAL_SUBMENU_DIRECTIONS) >= 0) {
                $items = $activeItem
                    .closest("." + DX_MENU_ITEMS_CONTAINER_CLASS)
                    .children()
                    .children();
            }

            $items = this._getAvailableItems($items);

            return $items;
        },

        _getAriaTarget: function() {
            return this.element();
        },

        _refreshActiveDescendant: function() {
            if(!this._overlay) {
                return;
            }

            var id = this.getFocusedItemId();

            this.setAria("activedescendant", "", this._overlay.content());
            this.setAria("activedescendant", id, this._overlay.content());
        },

        _hideSubmenuHandler: function() {
            var $curItem = this._getActiveItem(true),
                $parentItem = $curItem.parents("." + DX_MENU_ITEM_EXPANDED_CLASS).first();

            if($parentItem.length) {
                this._hideSubmenusOnSameLevel($parentItem);
                this._hideSubmenu($curItem.closest("." + DX_SUBMENU_CLASS));
                return $parentItem;
            }

            this._actions.onCloseRootSubmenu($curItem);
            return $curItem;
        },

        _expandSubmenuHandler: function($items, location) {
            var $curItem = this._getActiveItem(true),
                node = this._dataAdapter.getNodeByItem(this._getItemData($curItem)),
                isItemHasSubmenu = this._hasSubmenu(node),
                $submenu = $curItem.children("." + DX_SUBMENU_CLASS);

            if(isItemHasSubmenu && !$curItem.hasClass(DX_STATE_DISABLED_CLASS)) {
                if(!$submenu.length || $submenu.css("visibility") === "hidden") {
                    this._showSubmenu($curItem);
                }

                return this._nextItem(this._getItemsByLocation(location));
            }

            this._actions.onExpandLastSubmenu($curItem);
            return $curItem;
        },

        _clean: function() {
            if(this._overlay) {
                this._overlay.element().remove();
                this._overlay = null;
            }
            this._detachShowContextMenuEvents(this._getTarget());
            this.callBase();
        },

        _render: function() {
            this.element()
                .addClass(DX_HAS_CONTEXT_MENU_CLASS);

            this.callBase();

            this.setAria("role", "menu");
        },

        _renderContentImpl: function() {
            this._detachShowContextMenuEvents(this._getTarget());
            this._attachShowContextMenuEvents();
        },

        _renderContextMenuOverlay: function() {
            if(this._overlay) {
                return;
            }

            var overlayOptions = this._getOverlayOptions(),
                $overlayElement = $("<div>"),
                $overlayContent;

            this._overlay = this._createComponent($overlayElement.appendTo(this._$element), Overlay, overlayOptions);

            $overlayContent = this._overlay.content();
            $overlayContent.addClass(DX_CONTEXT_MENU_CLASS);

            this._addCustomCssClass($overlayContent);
            this._addPlatformDependentClass($overlayContent);
            this._attachContextMenuEvent();
        },

        _itemContextMenuHandler: function(e) {
            this.callBase(e);
            e.stopPropagation();
        },

        _addPlatformDependentClass: function($element) {
            if(devices.current().phone) {
                $element.addClass(DX_MENU_PHONE_CLASS);
            }
        },

        _detachShowContextMenuEvents: function(target) {
            var eventName,
                showEvent = getShowEvent(this);

            if(!showEvent) {
                return;
            }

            eventName = eventUtils.addNamespace(showEvent, this.NAME);

            if(this._showContextMenuEventHandler) {
                eventsEngine.off(document, eventName, target, this._showContextMenuEventHandler);
            } else {
                eventsEngine.off(target, eventName);
            }
        },

        _attachShowContextMenuEvents: function() {
            var that = this,
                delay,
                handler,
                eventName,
                contextMenuAction,
                target = that._getTarget(),
                showEvent = getShowEvent(that);

            if(!showEvent) {
                return;
            }

            eventName = eventUtils.addNamespace(showEvent, that.NAME);
            contextMenuAction = that._createAction((function(e) {
                delay = getShowDelay(that);

                if(delay) {
                    setTimeout(function() {
                        that._show(e.jQueryEvent);
                    }, delay);
                } else {
                    that._show(e.jQueryEvent);
                }
            }).bind(that), { validatingTargetName: "target" });

            handler = function(e) {
                contextMenuAction({ jQueryEvent: e, target: $(e.currentTarget) });
            };

            contextMenuAction = that._createAction(contextMenuAction);

            if(target.jquery || target.nodeType || typeUtils.isWindow(target)) {
                that._showContextMenuEventHandler = undefined;
                eventsEngine.on(target, eventName, handler);
            } else {
                that._showContextMenuEventHandler = handler;
                eventsEngine.on(document, eventName, target, that._showContextMenuEventHandler);
            }
        },

        _hoverEndHandler: function(e) {
            this.callBase(e);
            e.stopPropagation();
        },

        _renderDimensions: noop,

        _renderContainer: function($wrapper, submenuContainer) {
            var $itemsContainer,
                $holder = submenuContainer || this._itemContainer();

            $wrapper = $("<div>");

            $wrapper
                .appendTo($holder)
                .addClass(DX_SUBMENU_CLASS)
                .css("visibility", submenuContainer ? "hidden" : "visible");

            $itemsContainer = this.callBase($wrapper);

            if(submenuContainer) {
                return $itemsContainer;
            }

            if(this.option("width")) {
                return $itemsContainer.css("min-width", this.option("width"));
            }
            if(this.option("height")) {
                return $itemsContainer.css("min-height", this.option("height"));
            }

            return $itemsContainer;
        },

        _renderSubmenuItems: function(node, $itemFrame) {
            this._renderItems(this._getChildNodes(node), $itemFrame);
            this._actions.onSubmenuCreated({
                itemElement: $itemFrame,
                itemData: node.internalFields.item,
                submenuElement: $itemFrame.children("." + DX_SUBMENU_CLASS)
            });
        },

        _getOverlayOptions: function() {
            var position = this.option("position"),
                overlayAnimation = this.option("animation"),
                overlayOptions = {
                    focusStateEnabled: this.option("focusStateEnabled"),
                    animation: overlayAnimation,
                    closeOnOutsideClick: this._closeOnOutsideClickHandler.bind(this),
                    closeOnTargetScroll: true,
                    deferRendering: false,
                    position: {
                        at: position.at,
                        my: position.my,
                        of: this._getTarget(),
                        collision: "flipfit"
                    },
                    shading: false,
                    showTitle: false,
                    height: "auto",
                    width: "auto",
                    onShown: this._overlayShownActionHandler.bind(this),
                    onHiding: this._overlayHidingActionHandler.bind(this),
                    onHidden: this._overlayHiddenActionHandler.bind(this)
                };

            return overlayOptions;
        },

        _overlayShownActionHandler: function(arg) {
            this._actions.onShown(arg);
        },

        _overlayHidingActionHandler: function(arg) {
            this._actions.onHiding(arg);
            if(!arg.cancel) {
                this._hideAllShownSubmenus();
                this._setOptionSilent("visible", false);
            }
        },

        _overlayHiddenActionHandler: function(arg) {
            this._actions.onHidden(arg);
        },

        _closeOnOutsideClickHandler: function(e) {
            var $clickedItem,
                $activeItemContainer,
                $itemContainers,
                $rootItem,
                isRootItemClicked,
                isInnerOverlayClicked,
                closeOnOutsideClick = this.option("closeOnOutsideClick");

            if(typeUtils.isFunction(closeOnOutsideClick)) {
                return closeOnOutsideClick(e);
            }

            if(!closeOnOutsideClick) {
                return false;
            }

            if(e.target === document) {
                return true;
            }

            $activeItemContainer = this._getActiveItemsContainer(e.target);
            $itemContainers = this._getItemsContainers();
            $clickedItem = this._searchActiveItem(e.target);
            $rootItem = this.element().parents("." + DX_MENU_ITEM_CLASS);
            isRootItemClicked = $clickedItem[0] === $rootItem[0] && $clickedItem.length && $rootItem.length;
            isInnerOverlayClicked = this._isIncludeOverlay($activeItemContainer, $itemContainers) && $clickedItem.length;

            if(isInnerOverlayClicked || isRootItemClicked) {
                if(this._getShowSubmenuMode() === "onClick") {
                    this._hideAllShownChildSubmenus($clickedItem);
                }
                return false;
            }
            return true;
        },

        _getActiveItemsContainer: function(target) {
            return $(target).closest("." + DX_MENU_ITEMS_CONTAINER_CLASS);
        },

        _getItemsContainers: function() {
            return this._overlay._$content.find("." + DX_MENU_ITEMS_CONTAINER_CLASS);
        },

        _searchActiveItem: function(target) {
            return $(target).closest("." + DX_MENU_ITEM_CLASS).eq(0);
        },

        _isIncludeOverlay: function($activeOverlay, $allOverlays) {
            var isSame = false;

            each($allOverlays, function(index, $overlay) {
                if($activeOverlay.is($overlay) && !isSame) {
                    isSame = true;
                }
            });

            return isSame;
        },

        _hideAllShownChildSubmenus: function($clickedItem) {
            var that = this,
                $submenuElements = $clickedItem.find("." + DX_SUBMENU_CLASS),
                shownSubmenus = extend([], this._shownSubmenus),
                $context;

            if($submenuElements.length > 0) {
                each(shownSubmenus, function(index, $submenu) {
                    $context = that._searchActiveItem($submenu.context).parent();
                    if($context.parent().is($clickedItem.parent().parent()) && !$context.is($clickedItem.parent())) {
                        that._hideSubmenu($submenu);
                    }
                });
            }
        },

        _showSubmenu: function($item) {
            var node = this._dataAdapter.getNodeByItem(this._getItemData($item));

            this._hideSubmenusOnSameLevel($item);

            if(!this._hasSubmenu(node)) return;

            var $submenu = $item.children("." + DX_SUBMENU_CLASS),
                isSubmenuRendered = $submenu.length;

            this.callBase($item);

            if(!isSubmenuRendered) {
                this._renderSubmenuItems(node, $item);
            }

            if(!this._isSubmenuVisible($submenu)) {
                this._drawSubmenu($item);
            }
        },

        _hideSubmenusOnSameLevel: function($item) {
            var $expandedItems = $item
                    .parent("." + DX_MENU_ITEM_WRAPPER_CLASS).siblings()
                    .find("." + DX_MENU_ITEM_EXPANDED_CLASS);


            if($expandedItems.length) {
                $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
                this._hideSubmenu($expandedItems.find("." + DX_SUBMENU_CLASS));
            }
        },

        _hideSubmenuGroup: function($submenu) {
            if(this._isSubmenuVisible($submenu)) {
                this._hideSubmenuCore($submenu);
            }
        },

        _isSubmenuVisible: function($submenu) {
            return $submenu.css("visibility") === "visible";
        },

        _drawSubmenu: function($itemElement) {
            var animation = this.option("animation") ? this.option("animation").show : {},
                $submenu = $itemElement.children("." + DX_SUBMENU_CLASS),
                submenuPosition = this._getSubmenuPosition($itemElement);

            if(this._overlay && this._overlay.option("visible")) {
                if(!typeUtils.isDefined(this._shownSubmenus)) {
                    this._shownSubmenus = [];
                }

                if(inArray($submenu, this._shownSubmenus)) {
                    this._shownSubmenus.push($submenu);
                }

                if(animation) {
                    fx.stop($submenu);
                }

                positionUtils.setup($submenu, submenuPosition);

                if(animation) {
                    if(typeUtils.isPlainObject(animation.to)) {
                        animation.to.position = submenuPosition;
                    }
                    this._animate($submenu, animation);
                }
                $submenu.css("visibility", "visible");
            }
        },

        _animate: function($container, options) {
            fx.animate($container, options);
        },

        _getSubmenuPosition: function($rootItem) {
            var submenuDirection = this.option("submenuDirection").toLowerCase(),
                $rootItemWrapper = $rootItem.parent("." + DX_MENU_ITEM_WRAPPER_CLASS),
                position = {
                    collision: "flip",
                    of: $rootItemWrapper,
                    offset: { h: 0, v: -1 }
                };

            switch(submenuDirection) {
                case "left":
                    position.at = "left top";
                    position.my = "right top";
                    break;
                case "right":
                    position.at = "right top";
                    position.my = "left top";
                    break;
                default:
                    if(this.option("rtlEnabled")) {
                        position.at = "left top";
                        position.my = "right top";
                    } else {
                        position.at = "right top";
                        position.my = "left top";
                    }
                    break;
            }

            return position;
        },

        //TODO: try to simplify it
        _updateSubmenuVisibilityOnClick: function(actionArgs) {
            if(!actionArgs.args.length) return;

            actionArgs.args[0].jQueryEvent.stopPropagation();

            var $itemElement = actionArgs.args[0].itemElement,
                itemData = actionArgs.args[0].itemData,
                node = this._dataAdapter.getNodeByItem(itemData);

            if(!node) return;

            var $submenu = $itemElement.find("." + DX_SUBMENU_CLASS),
                shouldRenderSubmenu = this._hasSubmenu(node) && !$submenu.length;

            if(shouldRenderSubmenu) {
                this._renderSubmenuItems(node, $itemElement);
                $submenu = $itemElement.find("." + DX_SUBMENU_CLASS);
            }

            if($itemElement.context === $submenu.context && $submenu.css("visibility") === "visible") {
                return;
            }

            //T238943. Give the workaround with e.cancel and remove this hack
            var notCloseMenuOnItemClick = itemData && itemData.closeMenuOnClick === false;
            if(!itemData || itemData.disabled || notCloseMenuOnItemClick) {
                return;
            }

            this._updateSelectedItemOnClick(actionArgs);

            if($submenu.length === 0) {
                var $prevSubmenu = $($itemElement.parents("." + DX_SUBMENU_CLASS)[0]);
                this._hideSubmenu($prevSubmenu);
                if(!actionArgs.canceled && this._overlay && this._overlay.option("visible")) {
                    this.option("visible", false);
                }
            } else {
                if(this._shownSubmenus && this._shownSubmenus.length > 0) {
                    if(this._shownSubmenus[0].is($submenu)) {
                        this._hideSubmenu($submenu); // close to parent?
                    } else {
                        this._hideAllShownSubmenus();
                    }
                }
                this._showSubmenu($itemElement);
            }

        },

        _hideSubmenu: function($curSubmenu) {
            var that = this,
                shownSubmenus = extend([], that._shownSubmenus);

            each(shownSubmenus, function(index, $submenu) {
                if($curSubmenu.is($submenu) || $curSubmenu[0].contains($submenu[0])) {
                    $submenu.parent().removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
                    that._hideSubmenuCore($submenu);
                }
            });
        },

        _hideSubmenuCore: function($submenu) {
            var index = inArray($submenu, this._shownSubmenus),
                animation = this.option("animation") ? this.option("animation").hide : null;

            if(index >= 0) {
                this._shownSubmenus.splice(index, 1);
            }

            this._stopAnimate($submenu);
            animation && this._animate($submenu, animation);
            $submenu.css("visibility", "hidden");
        },

        _stopAnimate: function($container) {
            fx.stop($container, true);
        },

        _hideAllShownSubmenus: function() {
            var that = this,
                shownSubmenus = extend([], that._shownSubmenus),
                $expandedItems = this._overlay.content().find("." + DX_MENU_ITEM_EXPANDED_CLASS);

            $expandedItems.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);

            each(shownSubmenus, function(_, $submenu) {
                that._hideSubmenuCore($submenu);
            });
        },

        _visibilityChanged: function(visible) {
            if(visible) {
                this._renderContentImpl();
            }
        },

        _optionChanged: function(args) {
            if(this._cancelOptionChange === args.name) {
                return;
            }

            if(inArray(args.name, ACTIONS) > -1) {
                this._initActions();
                return;
            }

            switch(args.name) {
                case "visible":
                    this._toggleVisibility(args.value);
                    break;
                case "showEvent":
                case "position":
                case "submenuDirection":
                    this._invalidate();
                    break;
                case "target":
                    args.previousValue && this._detachShowContextMenuEvents(args.previousValue);
                    this.option("position").of = null;
                    this._invalidate();
                    break;
                case "closeOnOutsideClick":
                    break;

                default:
                    this.callBase(args);
            }
        },

        _toggleVisibility: function(showing) {
            showing ? this._show() : this._hide();
        },

        _show: function(jQEvent) {
            var args = { jQEvent: jQEvent },
                promise = $.Deferred().reject().promise();

            this._actions.onShowing(args);

            if(args.cancel) {
                return promise;
            }

            var position = this._positionContextMenu(jQEvent);

            if(position) {
                if(!this._overlay) {
                    this._renderContextMenuOverlay();
                    this._overlay.content().addClass(this._widgetClass());
                    this._renderFocusState();
                    this._attachHoverEvents();
                    this._attachClickEvent();
                    this._renderItems(this._dataAdapter.getRootNodes());
                }

                this._setOptionSilent("visible", true);
                this._overlay.option("position", position);
                promise = this._overlay.show();

                var id = "dx-" + new Guid();
                this._overlay.content().attr({ "id": id, role: "menu" });
                this.setAria("owns", id);
            }

            return promise;
        },

        _getTarget: function() {
            return this.option("target") || this.option("position").of || $(document);
        },

        _getContextMenuPosition: function() {
            return extend({}, this.option("position"), { of: this._getTarget() });
        },

        _positionContextMenu: function(jQEvent) {
            var position = this._getContextMenuPosition(),
                isInitialPosition = this._isInitialOptionValue("position"),
                positioningAction = this._createActionByOption("onPositioning", actionArgs),
                actionArgs;

            if(jQEvent && jQEvent.preventDefault && isInitialPosition) {
                position.of = jQEvent;
            }

            actionArgs = {
                position: position,
                jQueryEvent: jQEvent
            };

            positioningAction(actionArgs);

            if(actionArgs.cancel) {
                position = null;
            } else {
                if(actionArgs.jQueryEvent) {
                    actionArgs.jQueryEvent.cancel = true;
                    jQEvent.preventDefault();
                }
            }

            return position;
        },

        _hide: function() {
            var promise;

            if(this._overlay) {
                this._overlay.content().removeAttr("id");
                promise = this._overlay.hide();
                this._setOptionSilent("visible", false);
            }

            this.setAria("owns", undefined);

            return promise || $.Deferred().reject().promise();
        },

        /**
        * @name dxContextMenuMethods_toggle
        * @publicName toggle()
        * @param1 showing:boolean
        * @return Promise
        */
        toggle: function(showing) {
            var visible = this.option("visible");

            showing = showing === undefined ? !visible : showing;

            return this._toggleVisibility(showing);
        },

        /**
        * @name dxContextMenuMethods_show
        * @publicName show()
        * @return Promise
        */
        show: function() {
            return this.toggle(true);
        },

        /**
        * @name dxContextMenuMethods_hide
        * @publicName hide()
        * @return Promise
        */
        hide: function() {
            return this.toggle(false);
        }
    };
})());

registerComponent("dxContextMenu", ContextMenu);

module.exports = ContextMenu;
