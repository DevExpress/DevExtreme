"use strict";

var $ = require("../core/renderer"),
    noop = require("../core/utils/common").noop,
    isDefined = require("../core/utils/type").isDefined,
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    map = require("../core/utils/iterator").map,
    PlainEditStrategy = require("./collection/ui.collection_widget.edit.strategy.plain"),
    SlideOutView = require("./slide_out_view"),
    CollectionWidget = require("./collection/ui.collection_widget.edit"),
    List = require("./list"),
    ChildDefaultTemplate = require("./widget/child_default_template"),
    EmptyTemplate = require("./widget/empty_template");

var SLIDEOUT_CLASS = "dx-slideout",
    SLIDEOUT_ITEM_CONTAINER_CLASS = "dx-slideout-item-container",
    SLIDEOUT_MENU = "dx-slideout-menu",

    SLIDEOUT_ITEM_CLASS = "dx-slideout-item",
    SLIDEOUT_ITEM_DATA_KEY = "dxSlideoutItemData";

/**
* @name dxSlideout
* @publicName dxSlideOut
* @inherits CollectionWidget
* @groupName Navigation and Layouting
* @module ui/slide_out
* @export default
*/
var SlideOut = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        /**
        * @name dxSlideOutItemTemplate_menutemplate
        * @publicName menuTemplate
        * @type template
        * @type_function_return string|jQuery
        */

        return extend(this.callBase(), {
            /**
            * @name dxSlideOutOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @type boolean
            * @default false
            */
            activeStateEnabled: false,

            /**
            * @name dxSlideOutOptions_menuItemTemplate
            * @publicName menuItemTemplate
            * @type template
            * @default "menuItem"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:jQuery
            * @type_function_return string|Node|jQuery
            */
            menuItemTemplate: "menuItem",

            /**
            * @name dxSlideOutOptions_swipeEnabled
            * @publicName swipeEnabled
            * @type boolean
            * @default true
            */
            swipeEnabled: true,

            /**
            * @name dxSlideOutOptions_menuVisible
            * @publicName menuVisible
            * @type boolean
            * @default false
            */
            menuVisible: false,

            /**
            * @name dxSlideOutOptions_menuPosition
            * @publicName menuPosition
            * @type string
            * @default "normal"
            * @acceptValues 'normal' | 'inverted'
            */
            menuPosition: "normal",


            /**
            * @name dxSlideOutOptions_menuGrouped
            * @publicName menuGrouped
            * @type boolean
            * @default false
            */
            menuGrouped: false,

            /**
            * @name dxSlideOutOptions_menuGroupTemplate
            * @publicName menuGroupTemplate
            * @type template
            * @default "menuGroup"
            * @type_function_param1 groupData:object
            * @type_function_param2 groupIndex:number
            * @type_function_param3 groupElement:object
            * @type_function_return string|Node|jQuery
            */
            menuGroupTemplate: "menuGroup",

            /**
            * @name dxSlideOutOptions_onMenuItemRendered
            * @publicName onMenuItemRendered
            * @extends Action
            * @action
            */
            onMenuItemRendered: null,

            /**
            * @name dxSlideOutOptions_onMenuGroupRendered
            * @publicName onMenuGroupRendered
            * @extends Action
            * @action
            */
            onMenuGroupRendered: null,

            /**
            * @name dxSlideOutOptions_contentTemplate
            * @publicName contentTemplate
            * @type template
            * @default "content"
            * @type_function_param1 container:jQuery
            * @type_function_return string|Node|jQuery
            */
            contentTemplate: "content",

            selectionMode: "single",

            /**
             * @name dxSlideOutOptions_selectedIndex
             * @publicName selectedIndex
             * @type number
             * @default 0
             */
            selectedIndex: 0,

            selectionRequired: true

            /**
            * @name dxSlideOutOptions_selectedItems
            * @publicName selectedItems
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutOptions_selectedItemKeys
            * @publicName selectedItemKeys
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutOptions_keyExpr
            * @publicName keyExpr
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxSlideOutOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @extend_doc
            */
        });
    },

    _itemClass: function() {
        return SLIDEOUT_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return SLIDEOUT_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._slideOutView.content();
    },

    _init: function() {
        this._selectedItemContentRendered = false;
        this.callBase();
        this.$element().addClass(SLIDEOUT_CLASS);
        this._initSlideOutView();
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["menuItem"] = new ChildDefaultTemplate("item", this);
        this._defaultTemplates["menuGroup"] = new ChildDefaultTemplate("group", this);
        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _initEditStrategy: function() {
        if(this.option("menuGrouped")) {
            var strategy = PlainEditStrategy.inherit({

                _getPlainItems: function() {
                    return map(this.callBase(), function(group) {
                        return group.items;
                    });
                }

            });

            this._editStrategy = new strategy(this);
        } else {
            this.callBase();
        }
    },

    _initSlideOutView: function() {
        this._slideOutView = this._createComponent(this.$element(), SlideOutView, {
            integrationOptions: {},
            menuVisible: this.option("menuVisible"),
            swipeEnabled: this.option("swipeEnabled"),
            menuPosition: this.option("menuPosition"),
            onOptionChanged: this._slideOutViewOptionChanged.bind(this)
        });

        this._itemContainer().addClass(SLIDEOUT_ITEM_CONTAINER_CLASS);
    },

    _slideOutViewOptionChanged: function(args) {
        if(args.name === "menuVisible") {
            this.option(args.name, args.value);
        }
    },

    _render: function() {
        //TODO: remove this, needed for memory leak tests
        this._slideOutView._renderShield();
        this._renderList();
        this._renderContentTemplate();
        this.callBase();
    },

    _renderList: function() {
        var $list = this._list && this._list.$element() || $("<div>").addClass(SLIDEOUT_MENU).appendTo(this._slideOutView.menuContent());

        this._renderItemClickAction();

        this._list = this._createComponent($list, List, {
            itemTemplateProperty: "menuTemplate",
            selectionMode: this.option("selectionMode"),
            selectedIndex: this.option("selectedIndex"),
            selectionRequired: this.option("selectionRequired"),
            indicateLoading: false,
            onItemClick: this._listItemClickHandler.bind(this),
            items: this.option("items"),
            dataSource: this.option("dataSource"),
            itemTemplate: this._getTemplateByOption("menuItemTemplate"),
            grouped: this.option("menuGrouped"),
            groupTemplate: this._getTemplateByOption("menuGroupTemplate"),
            onItemRendered: this.option("onMenuItemRendered"),
            onGroupRendered: this.option("onMenuGroupRendered"),
            onContentReady: this._updateSlideOutView.bind(this)
        });
    },

    _updateSlideOutView: function() {
        this._slideOutView._dimensionChanged();
    },

    _renderItemClickAction: function() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _listItemClickHandler: function(e) {
        var selectedIndex = this._list.$element().find(".dx-list-item").index(e.itemElement);
        this.option("selectedIndex", selectedIndex);
        this._itemClickAction(e);
    },

    _renderContentTemplate: function() {
        if(isDefined(this._singleContent)) {
            return;
        }

        var itemsLength = this._itemContainer().html().length;
        this._getTemplateByOption("contentTemplate").render({
            container: this._itemContainer()
        });
        this._singleContent = this._itemContainer().html().length !== itemsLength;
    },

    _itemClickHandler: noop,

    _renderContentImpl: function() {
        if(this._singleContent) {
            return;
        }

        var items = this.option("items"),
            selectedIndex = this.option("selectedIndex");

        if(items.length && selectedIndex > -1) {
            this._selectedItemContentRendered = true;
            var selectedItem = this._list.getItemByIndex(selectedIndex);
            this._renderItems([selectedItem]);
        }
    },

    _renderItem: function(index, item) {
        this._itemContainer().find("." + SLIDEOUT_ITEM_CLASS).remove();
        this.callBase(index, item);
    },

    _selectedItemElement: function() {
        return this._itemElements().eq(0);
    },

    _renderSelection: function() {
        this._renderContent();
    },

    _getListWidth: function() {
        return this._slideOutView._getMenuWidth();
    },

    _changeMenuOption: function(name, value) {
        this._list.option(name, value);
        this._updateSlideOutView();
    },

    _cleanItemContainer: function() {
        if(this._singleContent) {
            return;
        }

        this.callBase();
    },

    beginUpdate: function() {
        this.callBase();
        this._list && this._list.beginUpdate();
    },

    endUpdate: function() {
        this._list && this._list.endUpdate();
        this.callBase();
    },

    _optionChanged: function(args) {
        var name = args.name;
        var value = args.value;

        switch(name) {
            case "menuVisible":
            case "swipeEnabled":
            case "rtlEnabled":
            case "menuPosition":
                this._slideOutView.option(name, value);
                break;
            case "width":
                this.callBase(args);
                this._updateSlideOutView();
                break;
            case "menuItemTemplate":
                this._changeMenuOption("itemTemplate", this._getTemplate(value));
                break;
            case "items":
                this._changeMenuOption("items", this.option("items"));
                if(!this._selectedItemContentRendered) {
                    this._renderSelection();
                }
                break;
            case "dataSource":
            case "selectedIndex":
            case "selectedItem":
                this._changeMenuOption(name, value);
                this.callBase(args);
                break;
            case "menuGrouped":
                this._initEditStrategy();
                this._changeMenuOption("grouped", value);
                break;
            case "menuGroupTemplate":
                this._changeMenuOption("groupTemplate", this._getTemplate(value));
                break;
            case "onMenuItemRendered":
                this._changeMenuOption("onItemRendered", value);
                break;
            case "onMenuGroupRendered":
                this._changeMenuOption("onGroupRendered", value);
                break;
            case "onItemClick":
                this._renderItemClickAction();
                break;
            case "contentTemplate":
                this._singleContent = null;
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxslideoutmethods_show
    * @publicName showMenu()
    * @return Promise<void>
    */
    showMenu: function() {
        return this._slideOutView.toggleMenuVisibility(true);
    },

    /**
    * @name dxslideoutmethods_hide
    * @publicName hideMenu()
    * @return Promise<void>
    */
    hideMenu: function() {
        return this._slideOutView.toggleMenuVisibility(false);
    },

    /**
    * @name dxslideoutmethods_toggleMenuVisibility
    * @publicName toggleMenuVisibility(showing)
    * @param1 showing:boolean
    * @return Promise<void>
    */
    toggleMenuVisibility: function(showing) {
        return this._slideOutView.toggleMenuVisibility(showing);
    }

    /**
    * @name dxslideoutmethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxslideoutmethods_focus
    * @publicName focus()
    * @hidden
    * @extend_doc
    */
});

registerComponent("dxSlideOut", SlideOut);

module.exports = SlideOut;
