"use strict";

var $ = require("../core/renderer"),
    themes = require("./themes"),
    registerComponent = require("../core/component_registrator"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    arrayUtils = require("../core/utils/array"),
    iteratorUtils = require("../core/utils/iterator"),
    ActionSheetStrategy = require("./toolbar/ui.toolbar.strategy.action_sheet"),
    DropDownMenuStrategy = require("./toolbar/ui.toolbar.strategy.drop_down_menu"),
    ListBottomStrategy = require("./toolbar/ui.toolbar.strategy.list_bottom"),
    ListTopStrategy = require("./toolbar/ui.toolbar.strategy.list_top"),
    ToolbarBase = require("./toolbar/ui.toolbar.base"),
    Button = require("./button"),
    ChildDefaultTemplate = require("./widget/child_default_template");

var STRATEGIES = {
    actionSheet: ActionSheetStrategy,
    dropDownMenu: DropDownMenuStrategy,
    listBottom: ListBottomStrategy,
    listTop: ListTopStrategy
};

var TOOLBAR_AUTO_HIDE_ITEM_CLASS = "dx-toolbar-item-auto-hide",
    TOOLBAR_AUTO_HIDE_TEXT_CLASS = "dx-toolbar-text-auto-hide",
    TOOLBAR_HIDDEN_ITEM = "dx-toolbar-item-invisible";

/**
* @name dxToolbar
* @publicName dxToolbar
* @inherits CollectionWidget
* @module ui/toolbar
* @export default
*/

var Toolbar = ToolbarBase.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
            * @name dxToolbarOptions_menuItemTemplate
            * @publicName menuItemTemplate
            * @type template|function
            * @default "menuItem"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            menuItemTemplate: "menuItem",

            /**
            * @name dxToolbarOptions_submenuType
            * @publicName submenuType
            * @type string
            * @default 'dropDownMenu'
            * @acceptValues 'actionSheet'|'listTop'|'listBottom'|'dropDownMenu'
            * @hidden
            */
            submenuType: "dropDownMenu"

            /**
            * @name dxToolbarItemTemplate_location
            * @publicName location
            * @type Enums.ToolbarItemLocation
            * @default 'center'
            */

            /**
            * @name dxToolbarItemTemplate_locateInMenu
            * @publicName locateInMenu
            * @type Enums.ToolbarItemLocateInMenuMode
            * @default 'never'
            */

            /**
            * @name dxToolbarItemTemplate_showText
            * @publicName showText
            * @type Enums.ToolbarItemShowTextMode
            * @default 'always'
            */

            /**
            * @name dxToolbarItemTemplate_menuItemTemplate
            * @publicName menuItemTemplate
            * @type template|function
            * @type_function_return string|Node|jQuery
            */

            /**
            * @name dxToolbarOptions_renderAs
            * @publicName renderAs
            * @type Enums.ToolbarRenderMode
            * @default 'topToolbar'
            */

            /**
            * @name dxToolbarOptions_selectedIndex
            * @publicName selectedIndex
            * @type number
            * @default -1
            * @hidden
            */

            /**
            * @name dxToolbarOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_selectedItems
            * @publicName selectedItems
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_selectedItemKeys
            * @publicName selectedItemKeys
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_keyExpr
            * @publicName keyExpr
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_selectedItem
            * @publicName selectedItem
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxToolbarOptions_onSelectionChanged
            * @publicName onSelectionChanged
            * @action
            * @hidden
            * @inheritdoc
            */
        });

    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return /ios7.*/.test(themes.current());
                },
                options: {
                    submenuType: "actionSheet"
                }
            },
            {
                device: function() {
                    return /android5.*/.test(themes.current());
                },
                options: {
                    submenuType: "dropDownMenu"
                }
            },
            {
                device: function() {
                    return /win8.*/.test(themes.current());
                },
                options: {
                    submenuType: "listBottom"
                }
            },
            {
                device: function() {
                    return /win10.*/.test(themes.current());
                },
                options: {
                    submenuType: "listTop"
                }
            }
        ]);
    },

    _dimensionChanged: function(dimension) {
        if(dimension === "height") {
            return;
        }

        this._menuStrategy.toggleMenuVisibility(false, true);
        this.callBase();
        this._menuStrategy.renderMenuItems();
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["actionSheetItem"] = new ChildDefaultTemplate("item", this);
    },

    _initMarkup: function() {
        this.callBase();
        this._renderMenu();
    },

    _render: function() {
        this._hideOverflowItems();
        this._menuStrategy._updateMenuVisibility();
        this.callBase();
        this._menuStrategy.renderMenuItems();
    },

    _renderItem: function(index, item, itemContainer, $after) {
        var itemElement = this.callBase(index, item, itemContainer, $after);

        if(item.locateInMenu === "auto") {
            itemElement.addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
        }

        if(item.widget === "dxButton" && item.showText === "inMenu") {
            itemElement.toggleClass(TOOLBAR_AUTO_HIDE_TEXT_CLASS);
        }

        return itemElement;
    },

    _setIconButtonAppearanceConfig: function(buttons, value) {
        iteratorUtils.each(buttons, function(index, buttonItem) {
            Button.getInstance(buttonItem).option("_forceIconButtonAppearance", value);
        });
    },

    _updateUseIconButtonStrategy: function() {
        var container = this.$element();

        this._setIconButtonAppearanceConfig(container.find("." + TOOLBAR_AUTO_HIDE_TEXT_CLASS + " .dx-button"), true);
        this._setIconButtonAppearanceConfig(container.find("." + TOOLBAR_HIDDEN_ITEM + " .dx-button"), false);
    },

    _hideOverflowItems: function(elementWidth) {
        var overflowItems = this.$element().find("." + TOOLBAR_AUTO_HIDE_ITEM_CLASS);

        if(!overflowItems.length) {
            return;
        }

        elementWidth = elementWidth || this.$element().width();
        $(overflowItems).removeClass(TOOLBAR_HIDDEN_ITEM);

        var beforeWidth = this._$beforeSection.outerWidth(),
            centerWidth = this._$centerSection.outerWidth(),
            afterWidth = this._$afterSection.outerWidth(),
            itemsWidth = beforeWidth + centerWidth + afterWidth;

        while(overflowItems.length && elementWidth < itemsWidth) {
            var $item = overflowItems.eq(-1);
            itemsWidth -= $item.outerWidth();
            $item.addClass(TOOLBAR_HIDDEN_ITEM);
            overflowItems.splice(-1, 1);
        }
    },

    _getMenuItems: function() {
        var that = this;
        var menuItems = grep(this.option("items") || [], function(item) {
            return that._isMenuItem(item);
        });

        var $hiddenItems = this._itemContainer()
            .children("." + TOOLBAR_AUTO_HIDE_ITEM_CLASS + "." + TOOLBAR_HIDDEN_ITEM)
            .not(".dx-state-invisible");
        this._restoreItems = this._restoreItems || [];

        var overflowItems = iteratorUtils.map($hiddenItems, function(item) {
            var itemData = that._getItemData(item),
                $itemContainer = $(item).children(),
                $itemMarkup = $itemContainer.children();

            return extend({
                menuItemTemplate: function() {
                    that._restoreItems.push({
                        container: $itemContainer,
                        item: $itemMarkup
                    });

                    var $container = $("<div>").addClass(TOOLBAR_AUTO_HIDE_ITEM_CLASS);
                    return $container.append($itemMarkup);
                }
            }, itemData);
        });

        return arrayUtils.merge(overflowItems, menuItems);
    },

    _getToolbarItems: function() {
        var that = this;

        return grep(this.option("items") || [], function(item) {
            return !that._isMenuItem(item);
        });
    },

    _renderMenu: function() {
        this._renderMenuStrategy();
        this._menuStrategy.render();
    },

    _renderMenuStrategy: function() {
        var strategyName = this.option("submenuType");

        if(this._requireDropDownStrategy()) {
            strategyName = "dropDownMenu";
        }

        var strategy = STRATEGIES[strategyName];

        if(!(this._menuStrategy && this._menuStrategy.NAME === strategyName)) {
            this._menuStrategy = new strategy(this);
        }
    },

    _requireDropDownStrategy: function() {
        var strategyName = this.option("submenuType");

        if((strategyName === "listBottom" || strategyName === "listTop") && this.option("renderAs") === "topToolbar") {
            return true;
        }

        var items = this.option("items") || [],
            result = false;

        iteratorUtils.each(items, function(index, item) {
            if(item.locateInMenu === "auto") {
                result = true;
            } else if(item.locateInMenu === "always" && item.widget) {
                result = true;
            }
        });

        return result;
    },

    _arrangeItems: function() {
        if(this.$element().is(":hidden")) {
            return;
        }

        this._$centerSection.css({
            margin: "0 auto",
            float: "none"
        });

        iteratorUtils.each(this._restoreItems || [], function(_, obj) {
            $(obj.container).append(obj.item);
        });
        this._restoreItems = [];

        var elementWidth = this.$element().width();

        this._hideOverflowItems(elementWidth);
        this.callBase(elementWidth);
    },

    _itemOptionChanged: function(item, property, value) {
        if(this._isMenuItem(item)) {
            this._menuStrategy.renderMenuItems();
        } else if(this._isToolbarItem(item)) {
            this.callBase(item, property, value);
        } else {
            this.callBase(item, property, value);
            this._menuStrategy.renderMenuItems();
        }
    },

    _isMenuItem: function(itemData) {
        return itemData.location === "menu" || itemData.locateInMenu === "always";
    },

    _isToolbarItem: function(itemData) {
        return itemData.location === undefined || itemData.locateInMenu === "never";
    },

    _optionChanged: function(args) {
        var name = args.name;
        var value = args.value;

        switch(name) {
            case "submenuType":
                this._invalidate();
                break;
            case "visible":
                this.callBase.apply(this, arguments);
                this._menuStrategy.handleToolbarVisibilityChange(value);
                break;
            case "menuItemTemplate":
                this._changeMenuOption("itemTemplate", this._getTemplate(value));
                break;
            case "onItemClick":
                this._changeMenuOption(name, value);
                this.callBase.apply(this, arguments);
                break;
            default:
                this.callBase.apply(this, arguments);
        }
    },

    _changeMenuOption: function(name, value) {
        this._menuStrategy.widgetOption(name, value);
    }

    /**
    * @name dxToolbarMethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxToolbarMethods_focus
    * @publicName focus()
    * @hidden
    * @inheritdoc
    */
});

registerComponent("dxToolbar", Toolbar);

module.exports = Toolbar;
