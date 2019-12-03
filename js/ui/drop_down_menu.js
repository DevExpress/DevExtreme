var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    Widget = require("./widget/ui.widget"),
    Button = require("./button"),
    Popover = require("./popover"),
    DataHelperMixin = require("../data_helper"),
    List = require("./list"),
    themes = require("./themes"),
    ChildDefaultTemplate = require("../core/templates/child_default_template").ChildDefaultTemplate;

var DROP_DOWN_MENU_CLASS = "dx-dropdownmenu",
    DROP_DOWN_MENU_POPUP_CLASS = "dx-dropdownmenu-popup",
    DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = "dx-dropdownmenu-popup-wrapper",
    DROP_DOWN_MENU_LIST_CLASS = "dx-dropdownmenu-list",
    DROP_DOWN_MENU_BUTTON_CLASS = "dx-dropdownmenu-button";

var POPUP_OPTION_MAP = {
    "popupWidth": "width",
    "popupHeight": "height",
    "popupMaxHeight": "maxHeight",
    "popupAutoResizeEnabled": "autoResizeEnabled"
};

var BUTTON_OPTION_MAP = {
    "buttonIcon": "icon",
    "buttonText": "text",
    "buttonWidth": "width",
    "buttonHeight": "height",
    "buttonTemplate": "template"
};

/**
* @name dxDropDownMenu
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

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxDropDownMenuOptions.items
            * @type Array<Object>
            */
            items: [],

            /**
            * @name dxDropDownMenuOptions.onItemClick
            * @type function(e)|string
            * @extends Action
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 event:event
            * @action
            */
            onItemClick: null,

            /**
            * @name dxDropDownMenuOptions.dataSource
            * @type string|Array<Object>|DataSource|DataSourceOptions
            * @default null
            */
            dataSource: null,

            /**
            * @name dxDropDownMenuOptions.itemTemplate
            * @type template|function
            * @default "item"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            itemTemplate: "item",

            /**
            * @name dxDropDownMenuOptions.buttonText
            * @type string
            * @default ""
            */
            buttonText: "",

            /**
            * @name dxDropDownMenuOptions.buttonIcon
            * @type string
            * @default "overflow"
            */
            buttonIcon: "overflow",

            buttonWidth: undefined,
            buttonHeight: undefined,
            buttonTemplate: "content",

            /**
            * @name dxDropDownMenuOptions.onButtonClick
            * @type function(e)|string
            * @extends Action
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @action
            */
            onButtonClick: null,

            /**
            * @name dxDropDownMenuOptions.usePopover
            * @type boolean
            * @default false
            */
            usePopover: false,

            /**
             * @name dxDropDownMenuOptions.popupWidth
             * @type number|string|function
             * @default auto
             */
            popupWidth: "auto",

            /**
             * @name dxDropDownMenuOptions.popupHeight
             * @type number|string|function
             * @default auto
             */
            popupHeight: "auto",

            /**
             * @name dxDropDownMenuOptions.activeStateEnabled
             * @type boolean
             * @default true
             */
            activeStateEnabled: true,

            /**
             * @name dxDropDownMenuOptions.hoverStateEnabled
             * @type boolean
             * @default true
             */
            hoverStateEnabled: true,

            /**
            * @name dxDropDownMenuOptions.opened
            * @type boolean
            * @default false
            */
            opened: false,

            deferRendering: false,
            popupPosition: { my: "top center", at: "bottom center", collision: "fit flip", offset: { v: 1 } },
            popupAnimation: undefined,
            onItemRendered: null,
            menuWidget: List,
            popupMaxHeight: undefined,
            closeOnClick: true,
            useInkRipple: false,
            container: undefined,
            popupAutoResizeEnabled: false
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
            },
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    useInkRipple: true
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
        this._templateManager.addDefaultTemplates({
            content: new ChildDefaultTemplate("content")
        });
        this.callBase();
    },

    _initMarkup: function() {
        this._renderButton();
        this.callBase();
    },

    _render: function() {
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

    _toggleActiveState: function($element, value, e) {
        this._button._toggleActiveState($element, value, e);
    },

    _buttonOptions: function() {
        return {
            text: this.option("buttonText"),
            icon: this.option("buttonIcon"),
            width: this.option("buttonWidth"),
            height: this.option("buttonHeight"),
            useInkRipple: this.option("useInkRipple"),
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
            deferRendering: false,
            contentTemplate: (function(contentElement) {
                this._renderList(contentElement);
            }).bind(this),
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
            maxHeight: this.option("popupMaxHeight"),
            container: this.option("container"),
            autoResizeEnabled: this.option("popupAutoResizeEnabled")
        };
    },

    _renderList: function(contentElement) {
        var $content = $(contentElement),
            listConfig = this._listOptions();

        $content.addClass(DROP_DOWN_MENU_LIST_CLASS);

        this._list = this._createComponent($content, this.option("menuWidget"), listConfig);

        // todo: replace with option
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
            itemTemplate: this.option("itemTemplate"),
            onItemClick: (function(e) {
                if(this.option("closeOnClick")) {
                    this.option("opened", false);
                }
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
            case "popupAutoResizeEnabled":
                this._popup.option(POPUP_OPTION_MAP[name], value);
                break;
            case "usePopover":
            case "menuWidget":
            case "useInkRipple":
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
            case "closeOnClick":
                break;
            case "container":
                this._popup && this._popup.option(args.name, args.value);
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxDropDownMenuMethods.open
    * @publicName open()
    */
    open: function() {
        this.option("opened", true);
    },

    /**
    * @name dxDropDownMenuMethods.close
    * @publicName close()
    */
    close: function() {
        this.option("opened", false);
    }

}).include(DataHelperMixin);

registerComponent("dxDropDownMenu", DropDownMenu);

module.exports = DropDownMenu;
