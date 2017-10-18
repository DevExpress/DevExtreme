"use strict";

var $ = require("../core/renderer"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    Widget = require("./widget/ui.widget"),
    Button = require("./button"),
    Popover = require("./popover"),
    DataHelperMixin = require("../data_helper"),
    List = require("./list"),
    ChildDefaultTemplate = require("./widget/child_default_template");

var DROP_DOWN_MENU_CLASS = "dx-dropdownmenu",
    DROP_DOWN_MENU_POPUP_CLASS = "dx-dropdownmenu-popup",
    DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = "dx-dropdownmenu-popup-wrapper",
    DROP_DOWN_MENU_LIST_CLASS = "dx-dropdownmenu-list",
    DROP_DOWN_MENU_BUTTON_CLASS = "dx-dropdownmenu-button";

var POPUP_OPTION_MAP = {
    "popupWidth": "width",
    "popupHeight": "height",
    "popupMaxHeight": "maxHeight"
};

var BUTTON_OPTION_MAP = {
    "buttonIcon": "icon",
    "buttonText": "text",
    "buttonWidth": "width",
    "buttonHeight": "height",
    "buttonTemplate": "template"
};

/**
* @name dxdropdownmenu
* @publicName dxDropDownMenu
* @inherits Widget
* @module ui/drop_down_menu
* @export default
* @hidden
*/
var DropDownMenu = Widget.inherit({
    _supportedKeys: function() {
        var extension = {};

        if(!this.option("opened") || !this._list.option("focusedElement")) {
            extension = this._button._supportedKeys();
        }

        return extend(this.callBase(), extension, {
            tab: function() {
                this._popup && this._popup.hide();
            }
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxDropDownMenuOptions_buttonIconSrc
            * @publicName buttonIconSrc
            * @deprecated dxDropDownMenuOptions_buttonIcon
            * @extend_doc
            */
            "buttonIconSrc": { since: "15.1", alias: "buttonIcon" }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxDropDownMenuOptions_items
            * @publicName items
            * @type Array<any>
            */
            items: [],

            /**
            * @name dxDropDownMenuOptions_onItemClick
            * @publicName onItemClick
            * @type function|string
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:Element
            * @type_function_param1_field6 itemIndex:number
            * @action
            */
            onItemClick: null,

            /**
            * @name dxDropDownMenuOptions_dataSource
            * @publicName dataSource
            * @type string|Array<any>|DataSource|DataSourceOptions
            * @default null
            */
            dataSource: null,

            /**
            * @name dxDropDownMenuOptions_itemTemplate
            * @publicName itemTemplate
            * @type template
            * @default "item"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:Element
            * @type_function_return string|Node|jQuery
            */
            itemTemplate: "item",

            /**
            * @name dxDropDownMenuOptions_buttontext
            * @publicName buttonText
            * @type string
            * @default ""
            */
            buttonText: "",

            /**
            * @name dxDropDownMenuOptions_buttonIcon
            * @publicName buttonIcon
            * @type string
            * @default "overflow"
            */
            buttonIcon: "overflow",

            buttonWidth: undefined,
            buttonHeight: undefined,
            buttonTemplate: "content",

            /**
            * @name dxDropDownMenuOptions_onButtonClick
            * @publicName onButtonClick
            * @type function|string
            * @extends Action
            * @type_function_param1_field4 jQueryEvent:jQuery.Event
            * @action
            */
            onButtonClick: null,

            /**
            * @name dxDropDownMenuOptions_usePopover
            * @publicName usePopover
            * @type boolean
            * @default false
            */
            usePopover: false,

            /**
             * @name dxDropDownMenuOptions_popupWidth
             * @publicName popupWidth
             * @type number|string|function
             * @default auto
             */
            popupWidth: "auto",

            /**
             * @name dxDropDownMenuOptions_popupHeight
             * @publicName popupHeight
             * @type number|string|function
             * @default auto
             */
            popupHeight: "auto",

            /**
            * @name dxDropDownMenuOptions_onContentReady
            * @publicName onContentReady
            * @hidden false
            * @action
            * @extend_doc
            */

            /**
             * @name dxDropDownMenuOptions_activeStateEnabled
             * @publicName activeStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            activeStateEnabled: true,

            /**
             * @name dxDropDownMenuOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxDropDownMenuOptions_opened
            * @publicName opened
            * @type boolean
            * @default false
            */
            opened: false,

            deferRendering: false,
            popupPosition: { my: "top center", at: "bottom center", collision: "fit flip", offset: { v: 1 } },
            popupAnimation: undefined,
            onItemRendered: null,
            menuWidget: List,
            popupMaxHeight: undefined
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "ios" },
                options: {
                    usePopover: true
                }
            },
            {
                device: { platform: "generic" },
                options: {
                    popupPosition: { offset: { v: 4 } }
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: { platform: "android" },

                options: {
                    popupPosition: {
                        my: "top " + (this.option("rtlEnabled") ? "left" : "right"),
                        at: "top " + (this.option("rtlEnabled") ? "left" : "right"),
                        collision: "flipfit"
                    },
                    popupAnimation: {
                        show: {
                            type: "pop",
                            duration: 200,
                            from: { scale: 0 },
                            to: { scale: 1 }
                        },
                        hide: {
                            type: "pop",
                            duration: 200,
                            from: { scale: 1 },
                            to: { scale: 0 }
                        }
                    }
                }
            }
        ]);
    },

    _initOptions: function(options) {
        if(devices.current().platform === "android") {
            if(!options.popupPosition) {
                options.popupPosition = {
                    at: (options.usePopover ? "bottom " : "top ") +
                        (options.rtlEnabled ? "left" : "right")
                };
            }
        }

        this.callBase(options);
    },

    _dataSourceOptions: function() {
        return {
            paginate: false
        };
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(DROP_DOWN_MENU_CLASS);
        this._initDataSource();
        this._initItemClickAction();
        this._initButtonClickAction();
    },

    _initItemClickAction: function() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _initButtonClickAction: function() {
        this._buttonClickAction = this._createActionByOption("onButtonClick");
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["item"] = new ChildDefaultTemplate("item", this);
        this._defaultTemplates["content"] = new ChildDefaultTemplate("content", this);
    },

    _render: function() {
        this._renderButton();
        this.callBase();

        this.setAria({
            "role": "menubar",
            "haspopup": true,
            "expanded": this.option("opened")
        });
    },

    _renderContentImpl: function() {
        if(this.option("opened")) {
            this._renderPopup();
        }
    },

    _clean: function() {
        this._cleanFocusState();

        if(this._popup) {
            this._popup.$element().remove();
            delete this._$popup;
        }
    },

    _renderButton: function() {
        var $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS),
            config = this._buttonOptions();

        this._button = this._createComponent($button, Button, config);
    },

    _buttonOptions: function() {
        return {
            text: this.option("buttonText"),
            icon: this.option("buttonIcon"),
            width: this.option("buttonWidth"),
            height: this.option("buttonHeight"),
            template: this.option("buttonTemplate"),
            focusStateEnabled: false,
            onClick: (function(e) {
                this.option("opened", !this.option("opened"));
                this._buttonClickAction(e);
            }).bind(this)
        };
    },

    _toggleMenuVisibility: function(opened) {
        var state = opened === undefined ? !this._popup.option("visible") : opened;

        if(opened) {
            this._renderPopup();
        }

        this._popup.toggle(state);
        this.setAria("expanded", state);
    },

    _renderPopup: function() {
        if(this._$popup) {
            return;
        }

        var $popup = this._$popup = $("<div>").appendTo(this.$element()),
            config = this._popupOptions();

        this._popup = this._createComponent($popup, Popover, config); // TODO: Circular dep
    },

    _popupOptions: function() {
        var usePopup = !this.option("usePopover");

        return {
            onInitialized: function(args) {
                args.component._wrapper()
                    .addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS)
                    .toggleClass(DROP_DOWN_MENU_POPUP_CLASS, usePopup);
            },
            visible: this.option("opened"),
            onContentReady: this._popupContentReadyHandler.bind(this),
            deferRendering: false,
            position: this.option("popupPosition"),
            animation: this.option("popupAnimation"),
            onOptionChanged: (function(args) {
                if(args.name === "visible") {
                    this.option("opened", args.value);
                }
            }).bind(this),
            target: this.$element(),
            height: this.option("popupHeight"),
            width: this.option("popupWidth"),
            maxHeight: this.option("popupMaxHeight")
        };
    },

    _popupContentReadyHandler: function() {
        var popup = Popover.getInstance(this._$popup);
        this._renderList(popup);
    },

    _renderList: function(instance) {
        var $content = instance.$content(),
            listConfig = this._listOptions();

        $content.addClass(DROP_DOWN_MENU_LIST_CLASS);

        this._list = this._createComponent($content, this.option("menuWidget"), listConfig);

        //todo: replace with option
        this._list._getAriaTarget = (function() {
            return this.$element();
        }).bind(this);

        this._setListDataSource();

        var listMaxHeight = $(window).height() * 0.5;
        if($content.height() > listMaxHeight) {
            $content.height(listMaxHeight);
        }
    },

    _listOptions: function() {
        return {
            _keyboardProcessor: this._listProcessor,
            pageLoadMode: "scrollBottom",
            indicateLoading: false,
            noDataText: "",
            itemTemplate: this._getTemplateByOption("itemTemplate"),
            onItemClick: (function(e) {
                this.option("opened", false);
                this._itemClickAction(e);
            }).bind(this),
            tabIndex: -1,
            focusStateEnabled: this.option("focusStateEnabled"),
            activeStateEnabled: this.option("activeStateEnabled"),
            onItemRendered: this.option("onItemRendered"),
            _itemAttributes: { role: "menuitem" }
        };
    },

    _setListDataSource: function() {
        if(this._list) {
            this._list.option("dataSource", this._dataSource || this.option("items"));
        }

        delete this._deferRendering;
    },

    _attachKeyboardEvents: function() {
        this.callBase.apply(this, arguments);

        this._listProcessor = this._keyboardProcessor && this._keyboardProcessor.attachChildProcessor();
        if(this._list) {
            this._list.option("_keyboardProcessor", this._listProcessor);
        }
    },

    _cleanFocusState: function() {
        this.callBase.apply(this, arguments);
        delete this._listProcessor;
    },

    _toggleVisibility: function(visible) {
        this.callBase(visible);
        this._button.option("visible", visible);
    },

    _optionChanged: function(args) {
        var name = args.name;
        var value = args.value;

        switch(name) {
            case "items":
            case "dataSource":
                if(this.option("deferRendering") && !this.option("opened")) {
                    this._deferRendering = true;
                } else {
                    this._refreshDataSource();
                    this._setListDataSource();
                }
                break;
            case "itemTemplate":
                if(this._list) {
                    this._list.option(name, this._getTemplate(value));
                }
                break;
            case "onItemClick":
                this._initItemClickAction();
                break;
            case "onButtonClick":
                this._buttonClickAction();
                break;
            case "buttonIcon":
            case "buttonText":
            case "buttonWidth":
            case "buttonHeight":
            case "buttonTemplate":
                this._button.option(BUTTON_OPTION_MAP[name], value);
                this._renderPopup();
                break;
            case "popupWidth":
            case "popupHeight":
            case "popupMaxHeight":
                this._popup.option(POPUP_OPTION_MAP[name], value);
                break;
            case "usePopover":
            case "menuWidget":
                this._invalidate();
                break;
            case "focusStateEnabled":
            case "activeStateEnabled":
                if(this._list) {
                    this._list.option(name, value);
                }
                this.callBase(args);
                break;
            case "onItemRendered":
                if(this._list) {
                    this._list.option(name, value);
                }
                break;
            case "opened":
                if(this._deferRendering) {
                    this._refreshDataSource();
                    this._setListDataSource();
                }
                this._toggleMenuVisibility(value);
                break;
            case "deferRendering":
            case "popupPosition":
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxDropDownMenuMethods_open
    * @publicName open()
    */
    open: function() {
        this.option("opened", true);
    },

    /**
    * @name dxDropDownMenuMethods_close
    * @publicName close()
    */
    close: function() {
        this.option("opened", false);
    }

}).include(DataHelperMixin);

registerComponent("dxDropDownMenu", DropDownMenu);

module.exports = DropDownMenu;
