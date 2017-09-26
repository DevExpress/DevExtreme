"use strict";

var $ = require("../core/renderer"),
    support = require("../core/utils/support"),
    extend = require("../core/utils/extend").extend,
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    MultiView = require("./multi_view"),
    Tabs = require("./tabs"),
    iconUtils = require("../core/utils/icon"),
    BindableTemplate = require("./widget/bindable_template");

var TABPANEL_CLASS = "dx-tabpanel",
    TABPANEL_TABS_CLASS = "dx-tabpanel-tabs",
    TABPANEL_CONTAINER_CLASS = "dx-tabpanel-container",

    TABS_ITEM_TEXT_CLASS = "dx-tab-text";

/**
* @name dxTabPanel
* @publicName dxTabPanel
* @inherits dxMultiView
* @groupName Navigation and Layouting
* @module ui/tab_panel
* @export default
*/
var TabPanel = MultiView.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTabPanelOptions_itemTitleTemplate
            * @publicName itemTitleTemplate
            * @type template
            * @default "title"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:jQuery
            * @type_function_return string|Node|jQuery
            */
            itemTitleTemplate: "title",

            /**
             * @name dxTabPanelOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxTabPanelOptions_showNavButtons
            * @publicName showNavButtons
            * @type boolean
            * @default false
            */
            showNavButtons: false,

            /**
            * @name dxTabPanelOptions_scrollByContent
            * @publicName scrollByContent
            * @type boolean
            * @default true
            */
            scrollByContent: true,

            /**
            * @name dxTabPanelOptions_scrollingEnabled
            * @publicName scrollingEnabled
            * @type boolean
            * @default true
            */
            scrollingEnabled: true,

            /**
            * @name dxTabPanelOptions_onTitleClick
            * @publicName onTitleClick
            * @extends Action
            * @type function|string
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @action
            */
            onTitleClick: null,

            /**
            * @name dxTabPanelOptions_onTitleHold
            * @publicName onTitleHold
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @action
            */
            onTitleHold: null,

            /**
            * @name dxTabPanelOptions_onTitleRendered
            * @publicName onTitleRendered
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @action
            */
            onTitleRendered: null

            /**
            * @name dxTabPanelItemTemplate_tabtemplate
            * @publicName tabTemplate
            * @type template
            * @type_function_return string|jQuery
            */

            /**
            * @name dxTabPanelItemTemplate_visible
            * @publicName visible
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxTabPanelItemTemplate_title
            * @publicName title
            * @type String
            */
            /**
            * @name dxTabPanelItemTemplate_icon
            * @publicName icon
            * @type String
            */
            /**
            * @name dxTabPanelItemTemplate_iconSrc
            * @publicName iconSrc
            * @type String
            * @deprecated
            */
            /**
            * @name dxTabPanelItemTemplate_badge
            * @publicName badge
            * @type String
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxTabPanelOptions_focusStateEnabled
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
                    return !support.touch;
                },
                options: {
                    /**
                    * @name dxTabPanelOptions_swipeEnabled
                    * @publicName swipeEnabled
                    * @type boolean
                    * @custom_default_for_non-touch_devices false
                    * @extend_doc
                    */
                    swipeEnabled: false
                }
            },
            {
                device: { platform: "generic" },
                options: {
                    /**
                    * @name dxTabPanelOptions_animationEnabled
                    * @publicName animationEnabled
                    * @type boolean
                    * @custom_default_for_generic false
                    * @extend_doc
                    */
                    animationEnabled: false
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.element().addClass(TABPANEL_CLASS);

        this.setAria("role", "tabpanel");
    },

    _render: function() {
        this._createTitleActions();
        this._renderLayout();

        this.callBase();
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["title"] = new BindableTemplate(function($container, data) {
            $container.text(data.title || String(data));

            var icon = data.icon,
                iconSrc = data.iconSrc,
                $iconElement = iconUtils.getImageContainer(icon || iconSrc);

            $container.wrapInner($("<span>").addClass(TABS_ITEM_TEXT_CLASS));
            $iconElement && $iconElement.prependTo($container);
        }, ["title", "html", "icon", "iconSrc"], this.option("integrationOptions.watchMethod"));
    },

    _createTitleActions: function() {
        this._createTitleClickAction();
        this._createTitleHoldAction();
        this._createTitleRenderedAction();
    },

    _createTitleClickAction: function() {
        this._titleClickAction = this._createActionByOption("onTitleClick");
    },

    _createTitleHoldAction: function() {
        this._titleHoldAction = this._createActionByOption("onTitleHold");
    },

    _createTitleRenderedAction: function() {
        this._titleRenderedAction = this._createActionByOption("onTitleRendered");
    },

    _renderContent: function() {
        var that = this;

        this.callBase();
        if(this.option("templatesRenderAsynchronously")) {
            this._resizeEventTimer = setTimeout(function() {
                that._updateLayout();
            }, 0);
        }
    },

    _renderLayout: function() {
        if(this._tabs) {
            return;
        }

        var $element = this.element();

        this._$tabContainer = $("<div>")
            .addClass(TABPANEL_TABS_CLASS)
            .appendTo($element);

        var $tabs = $("<div>").appendTo(this._$tabContainer);

        this._tabs = this._createComponent($tabs, Tabs, this._tabConfig());

        this._$container = $("<div>")
            .addClass(TABPANEL_CONTAINER_CLASS)
            .appendTo($element);
        this._$container.append(this._$wrapper);

        this._updateLayout();
    },

    _updateLayout: function() {
        var tabsHeight = this._$tabContainer.outerHeight();
        this._$container.css({
            "marginTop": -tabsHeight,
            "paddingTop": tabsHeight
        });
    },

    _refreshActiveDescendant: function() {
        var tabs = this._tabs,
            tabItems = tabs.itemElements(),
            $activeTab = $(tabItems[tabs.option("selectedIndex")]),
            id = this.getFocusedItemId();

        this.setAria("controls", undefined, $(tabItems));
        this.setAria("controls", id, $activeTab);
    },

    _tabConfig: function() {
        return {
            selectOnFocus: true,
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            tabIndex: this.option("tabIndex"),
            selectedIndex: this.option("selectedIndex"),

            onItemClick: this._titleClickAction.bind(this),
            onItemHold: this._titleHoldAction.bind(this),
            itemHoldTimeout: this.option("itemHoldTimeout"),
            onSelectionChanged: (function(e) {
                this.option("selectedIndex", e.component.option("selectedIndex"));
                this._refreshActiveDescendant();
            }).bind(this),
            onItemRendered: this._titleRenderedAction.bind(this),
            itemTemplate: this._getTemplateByOption("itemTitleTemplate"),

            items: this.option("items"),
            noDataText: null,
            scrollingEnabled: this.option("scrollingEnabled"),
            scrollByContent: this.option("scrollByContent"),
            showNavButtons: this.option("showNavButtons"),
            itemTemplateProperty: "tabTemplate",
            loopItemFocus: this.option("loop"),
            selectionRequired: true,
            onOptionChanged: (function(args) {
                var name = args.name,
                    value = args.value;

                if(name === "focusedElement") {
                    var id = value ? value.index() : value;
                    var newItem = value ? this._itemElements().eq(id) : value;
                    this.option("focusedElement", newItem);
                }
            }).bind(this),
            onFocusIn: (function(args) { this._focusInHandler(args.jQueryEvent); }).bind(this),
            onFocusOut: (function(args) { this._focusOutHandler(args.jQueryEvent); }).bind(this)
        };
    },

    _renderFocusTarget: function() {
        this._focusTarget().attr("tabIndex", -1);
        this._refreshActiveDescendant();
    },

    _updateFocusState: function(e, isFocused) {
        this.callBase(e, isFocused);

        if(e.target === this._tabs._focusTarget().get(0)) {
            this._toggleFocusClass(isFocused, this._focusTarget());
        }
    },

    _setTabsOption: function(name, value) {
        if(this._tabs) {
            this._tabs.option(name, value);
        }
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._tabs._dimensionChanged();
            this._updateLayout();
        }
    },

    _optionChanged: function(args) {
        var name = args.name,
            value = args.value,
            fullName = args.fullName;

        switch(name) {
            case "dataSource":
                this.callBase(args);
                break;
            case "items":
                this._setTabsOption(fullName, value);
                this._updateLayout();
                this._tabs.repaint();
                this.callBase(args);
                break;
            case "selectedIndex":
            case "selectedItem":
            case "itemHoldTimeout":
            case "focusStateEnabled":
            case "hoverStateEnabled":
                this._setTabsOption(fullName, value);
                this.callBase(args);
                break;
            case "scrollingEnabled":
            case "scrollByContent":
            case "showNavButtons":
                this._setTabsOption(fullName, value);
                break;
            case "focusedElement":
                var id = value ? value.index() : value;
                var newItem = value ? this._tabs._itemElements().eq(id) : value;
                this._setTabsOption("focusedElement", newItem);
                this.callBase(args);
                this._tabs.focus();
                break;
            case "itemTitleTemplate":
                this._setTabsOption("itemTemplate", this._getTemplateByOption("itemTitleTemplate"));
                break;
            case "onTitleClick":
                this._createTitleClickAction();
                this._setTabsOption("onItemClick", this._titleClickAction.bind(this));
                break;
            case "onTitleHold":
                this._createTitleHoldAction();
                this._setTabsOption("onItemHold", this._titleHoldAction.bind(this));
                break;
            case "onTitleRendered":
                this._createTitleRenderedAction();
                this._setTabsOption("onItemRendered", this._titleRenderedAction.bind(this));
                break;
            case "loop":
                this._setTabsOption("loopItemFocus", value);
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        clearTimeout(this._resizeEventTimer);
        this.callBase();
    }

});

registerComponent("dxTabPanel", TabPanel);

module.exports = TabPanel;
