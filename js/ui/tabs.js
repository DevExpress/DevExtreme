"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    Button = require("./button"),
    inkRipple = require("./widget/utils.ink_ripple"),
    eventUtils = require("../events/utils"),
    extend = require("../core/utils/extend").extend,
    isPlainObject = require("../core/utils/type").isPlainObject,
    pointerEvents = require("../events/pointer"),
    TabsItem = require("./tabs/item"),
    themes = require("./themes"),
    holdEvent = require("../events/hold"),
    Scrollable = require("./scroll_view/ui.scrollable"),
    CollectionWidget = require("./collection/ui.collection_widget.edit"),
    iconUtils = require("../core/utils/icon"),
    BindableTemplate = require("./widget/bindable_template");

var TABS_CLASS = "dx-tabs",
    TABS_WRAPPER_CLASS = "dx-tabs-wrapper",
    TABS_EXPANDED_CLASS = "dx-tabs-expanded",
    TABS_SCROLLABLE_CLASS = "dx-tabs-scrollable",
    TABS_NAV_BUTTONS_CLASS = "dx-tabs-nav-buttons",

    TABS_ITEM_CLASS = "dx-tab",
    TABS_ITEM_SELECTED_CLASS = "dx-tab-selected",

    TABS_NAV_BUTTON_CLASS = "dx-tabs-nav-button",
    TABS_LEFT_NAV_BUTTON_CLASS = "dx-tabs-nav-button-left",
    TABS_RIGHT_NAV_BUTTON_CLASS = "dx-tabs-nav-button-right",

    TABS_ITEM_TEXT_CLASS = "dx-tab-text",

    TABS_ITEM_DATA_KEY = "dxTabData",

    FEEDBACK_HIDE_TIMEOUT = 100,
    FEEDBACK_DURATION_INTERVAL = 5,
    FEEDBACK_SCROLL_TIMEOUT = 300,

    TAB_OFFSET = 30;


/**
* @name dxTabs
* @publicName dxTabs
* @inherits CollectionWidget
* @groupName Navigation and Layouting
* @module ui/tabs
* @export default
*/

var Tabs = CollectionWidget.inherit({

    _activeStateUnit: "." + TABS_ITEM_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxTabsOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxTabsOptions_showNavButtons
            * @publicName showNavButtons
            * @type boolean
            * @default false
            */
            showNavButtons: false,

            /**
            * @name dxTabsOptions_scrollByContent
            * @publicName scrollByContent
            * @type boolean
            * @default true
            */
            scrollByContent: true,

            /**
            * @name dxTabsOptions_scrollingEnabled
            * @publicName scrollingEnabled
            * @type boolean
            * @default true
            */
            scrollingEnabled: true,

            /**
            * @name dxTabsOptions_selectionMode
            * @publicName selectionMode
            * @type string
            * @default 'single'
            * @acceptValues 'multiple'|'single'
            */
            selectionMode: "single",

            /**
            * @name dxTabsOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTabsOptions_noDataText
            * @publicName noDataText
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTabsOptions_selectedItems
            * @publicName selectedItems
            * @type Array<string,number,Object>
            */

            /**
             * @name dxTabsOptions_activeStateEnabled
             * @publicName activeStateEnabled
             * @default true
             * @extend_doc
             */

            activeStateEnabled: true,
            selectionRequired: false,
            selectOnFocus: true,
            loopItemFocus: false,
            useInkRipple: false,
            badgeExpr: function(data) { return data ? data.badge : undefined; }

            /**
            * @name dxTabsItemTemplate_icon
            * @publicName icon
            * @type String
            */
            /**
            * @name dxTabsItemTemplate_iconSrc
            * @publicName iconSrc
            * @type String
            * @deprecated
            */
            /**
            * @name dxTabsItemTemplate_badge
            * @publicName badge
            * @type String
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "generic" },
                options: {
                    /**
                    * @name dxTabsOptions_showNavButtons
                    * @publicName showNavButtons
                    * @custom_default_for_desktop true
                    */
                    showNavButtons: true,
                    /**
                    * @name dxTabsOptions_scrollByContent
                    * @publicName scrollByContent
                    * @custom_default_for_desktop false
                    */
                    scrollByContent: false
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxTabsOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
                    * @custom_default_for_generic true
                    * @extend_doc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return /android5/.test(themes.current());
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.setAria("role", "tablist");

        this.$element().addClass(TABS_CLASS);

        this._renderMultiple();

        this._feedbackHideTimeout = FEEDBACK_HIDE_TIMEOUT;
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["item"] = new BindableTemplate(function($container, data) {
            if(isPlainObject(data)) {
                if(data.text) {
                    $container.text(data.text);
                }

                if(data.html) {
                    $container.html(data.html);
                }
            } else {
                $container.text(String(data));
            }

            var icon = data.icon,
                iconSrc = data.iconSrc,
                $iconElement = iconUtils.getImageContainer(icon || iconSrc);

            $container.wrapInner($("<span>").addClass(TABS_ITEM_TEXT_CLASS));
            $iconElement && $iconElement.prependTo($container);
        }, ["text", "html", "icon", "iconSrc"], this.option("integrationOptions.watchMethod"));
    },

    _itemClass: function() {
        return TABS_ITEM_CLASS;
    },

    _selectedItemClass: function() {
        return TABS_ITEM_SELECTED_CLASS;
    },

    _itemDataKey: function() {
        return TABS_ITEM_DATA_KEY;
    },

    _render: function() {
        this.callBase();
        this._renderWrapper();

        this._renderScrolling();

        this.setAria("role", "tab", this.itemElements());

        this.option("useInkRipple") && this._renderInkRipple();
    },

    _renderScrolling: function() {
        this.$element().removeClass(TABS_EXPANDED_CLASS);

        if(this._allowScrolling()) {
            if(!this._scrollable) {
                this._renderScrollable();
                this._renderNavButtons();
            }

            this._scrollable.update();
            this._updateNavButtonsVisibility();

            if(this.option("rtlEnabled")) {
                this._scrollable.scrollTo({ left: this._scrollable.scrollWidth() - this._scrollable.clientWidth() });
            }
            this._scrollToItem(this.option("selectedItem"));
        }

        if(!this._allowScrolling()) {
            this._cleanScrolling();

            this.$element()
                .removeClass(TABS_NAV_BUTTONS_CLASS)
                .addClass(TABS_EXPANDED_CLASS);
        }
    },

    _cleanNavButtons: function() {
        if(!this._leftButton || !this._rightButton) return;

        this._leftButton.$element().remove();
        this._rightButton.$element().remove();
        this._leftButton = null;
        this._rightButton = null;
    },

    _cleanScrolling: function() {
        if(!this._scrollable) return;

        this._scrollable.content().children("." + TABS_WRAPPER_CLASS)
            .appendTo(this._itemContainer());

        this._scrollable.$element().remove();
        this._scrollable = null;

        this._cleanNavButtons();
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
            jQueryEvent: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _renderMultiple: function() {
        if(this.option("selectionMode") === "multiple") {
            this.option("selectOnFocus", false);
        }
    },

    _renderWrapper: function() {
        this.$element().wrapInner($("<div>").addClass(TABS_WRAPPER_CLASS));
    },

    _renderScrollable: function() {
        var $itemContainer = this.$element().wrapInner($("<div>").addClass(TABS_SCROLLABLE_CLASS)).children();

        this._scrollable = this._createComponent($itemContainer, Scrollable, {
            direction: "horizontal",
            showScrollbar: false,
            useKeyboard: false,
            useNative: false,
            scrollByContent: this.option("scrollByContent"),
            onScroll: this._updateNavButtonsVisibility.bind(this)
        });

        this.$element().append(this._scrollable.$element());
    },

    _scrollToItem: function(itemData) {
        if(!this._scrollable) return;

        var $item = this._editStrategy.getItemElement(itemData);
        this._scrollable.scrollToElement($item);
    },

    _allowScrolling: function() {
        if(!this.option("scrollingEnabled")) {
            return false;
        }

        var tabItemsWidth = 0;
        this._getAvailableItems().each(function(_, tabItem) {
            tabItemsWidth += $(tabItem).outerWidth(true);
        });
        // NOTE: "-1" is a hack fix for IE (T190044)
        return tabItemsWidth - 1 > this.$element().width();
    },

    _renderNavButtons: function() {
        this.$element().toggleClass(TABS_NAV_BUTTONS_CLASS, this.option("showNavButtons"));

        if(!this.option("showNavButtons")) return;

        this._leftButton = this._createNavButton(-TAB_OFFSET, "chevronprev");

        var $leftButton = this._leftButton.$element();
        $leftButton.addClass(TABS_LEFT_NAV_BUTTON_CLASS);
        this.$element().prepend($leftButton);

        this._rightButton = this._createNavButton(TAB_OFFSET, "chevronnext");

        var $rightButton = this._rightButton.$element();
        $rightButton.addClass(TABS_RIGHT_NAV_BUTTON_CLASS);
        this.$element().append($rightButton);
    },

    _updateNavButtonsVisibility: function() {
        this._leftButton && this._leftButton.option("disabled", this._scrollable.scrollLeft() <= 0);
        this._rightButton && this._rightButton.option("disabled", this._scrollable.scrollLeft() >= Math.round(this._scrollable.scrollWidth() - this._scrollable.clientWidth()));
    },

    _updateScrollPosition: function(offset, duration) {
        this._scrollable.update();
        this._scrollable.scrollBy(offset / duration);
    },

    _createNavButton: function(offset, icon) {
        var that = this;

        var holdAction = that._createAction(function() {
                that._holdInterval = setInterval(function() {
                    that._updateScrollPosition(offset, FEEDBACK_DURATION_INTERVAL);
                }, FEEDBACK_DURATION_INTERVAL);
            }),

            holdEventName = eventUtils.addNamespace(holdEvent.name, "dxNavButton"),
            pointerUpEventName = eventUtils.addNamespace(pointerEvents.up, "dxNavButton"),
            pointerOutEventName = eventUtils.addNamespace(pointerEvents.out, "dxNavButton");

        var navButton = this._createComponent($("<div>").addClass(TABS_NAV_BUTTON_CLASS), Button, {
            focusStateEnabled: false,
            icon: icon,
            onClick: function() {
                that._updateScrollPosition(offset, 1);
            },
            integrationOptions: {}
        });

        var $navButton = navButton.$element();

        eventsEngine.on($navButton, holdEventName, { timeout: FEEDBACK_SCROLL_TIMEOUT }, (function(e) { holdAction({ jQueryEvent: e }); }).bind(this));
        eventsEngine.on($navButton, pointerUpEventName, function() {
            that._clearInterval();
        });
        eventsEngine.on($navButton, pointerOutEventName, function() {
            that._clearInterval();
        });

        return navButton;
    },

    _clearInterval: function() {
        if(this._holdInterval) clearInterval(this._holdInterval);
    },

    _renderSelection: function(addedSelection) {
        this._scrollable && this._scrollable.scrollToElement(this.itemElements().eq(addedSelection[0]), { left: 1, right: 1 });
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        if(this.option("scrollingEnabled")) {
            this._renderScrolling();
        }
    },

    _itemSelectHandler: function(e) {
        if(this.option("selectionMode") === "single" && this.isItemSelected(e.currentTarget)) {
            return;
        }

        this.callBase(e);
    },

    _clean: function() {
        this._scrollable = null;
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "useInkRipple":
            case "scrollingEnabled":
            case "showNavButtons":
                this._invalidate();
                break;
            case "scrollByContent":
                this._scrollable && this._scrollable.option(args.name, args.value);
                break;
            case "selectionMode":
                this._renderMultiple();
                this.callBase(args);
                break;
            case "badgeExpr":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }

});

Tabs.ItemClass = TabsItem;

registerComponent("dxTabs", Tabs);

module.exports = Tabs;
