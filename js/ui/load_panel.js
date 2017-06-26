"use strict";

var $ = require("../core/renderer"),
    noop = require("../core/utils/common").noop,
    messageLocalization = require("../localization/message"),
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    LoadIndicator = require("./load_indicator"),
    Overlay = require("./overlay");

var LOADPANEL_CLASS = "dx-loadpanel",
    LOADPANEL_WRAPPER_CLASS = "dx-loadpanel-wrapper",
    LOADPANEL_INDICATOR_CLASS = "dx-loadpanel-indicator",
    LOADPANEL_MESSAGE_CLASS = "dx-loadpanel-message",
    LOADPANEL_CONTENT_CLASS = "dx-loadpanel-content",
    LOADPANEL_CONTENT_WRAPPER_CLASS = "dx-loadpanel-content-wrapper",
    LOADPANEL_PANE_HIDDEN_CLASS = "dx-loadpanel-pane-hidden";

/**
* @name dxLoadPanel
* @publicName dxLoadPanel
* @inherits dxOverlay
* @groupName Overlays
* @module ui/load_panel
* @export default
*/
var LoadPanel = Overlay.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), {
            escape: noop
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxLoadPanelOptions_message
            * @publicName message
            * @type string
            * @default "Loading ..."
            */
            message: messageLocalization.format("Loading"),

            /**
            * @name dxLoadPanelOptions_width
            * @publicName width
            * @type number
            * @default 222
            */
            width: 222,

            /**
            * @name dxLoadPanelOptions_height
            * @publicName height
            * @type number
            * @default 90
            */
            height: 90,

            /**
            * @name dxLoadPanelOptions_animation
            * @publicName animation
            * @type object
            * @default null
            */
            /**
            * @name dxLoadPanelOptions_animation_show
            * @publicName show
            * @type animationConfig
            * @default null
            * @extend_doc
            */
            /**
            * @name dxLoadPanelOptions_animation_hide
            * @publicName hide
            * @type animationConfig
            * @default null
            * @extend_doc
            */
            animation: null,

            /**
            * @name dxLoadPanelOptions_disabled
            * @publicName disabled
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxLoadPanelOptions_showIndicator
            * @publicName showIndicator
            * @type boolean
            * @default true
            */
            showIndicator: true,

            /**
            * @name dxLoadPanelOptions_indicatorSrc
            * @publicName indicatorSrc
            * @type string
            * @default ""
            */
            indicatorSrc: "",

            /**
            * @name dxLoadPanelOptions_showPane
            * @publicName showPane
            * @type boolean
            * @default true
            */
            showPane: true,

            /**
            * @name dxLoadPanelOptions_delay
            * @publicName delay
            * @type Number
            * @default 0
            */
            delay: 0,

            /**
            * @name dxLoadPanelOptions_closeOnBackButton
            * @publicName closeOnBackButton
            * @default false
            * @hidden
            * @extend_doc
            */
            closeOnBackButton: false,

            /**
            * @name dxLoadPanelOptions_resizeEnabled
            * @publicName resizeEnabled
            * @hidden
            * @extend_doc
            */
            resizeEnabled: false,

            /**
            * @name dxLoadPanelOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @type boolean
            * @default false
            */
            focusStateEnabled: false

            /**
            * @name dxLoadPanelOptions_dragEnabled
            * @publicName dragEnabled
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxLoadPanelOptions_contentTemplate
            * @publicName contentTemplate
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxLoadPanelOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxLoadPanelOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                /**
                * @name dxLoadPanelOptions_shadingColor
                * @publicName shadingColor
                * @custom_default_for_generic "transparent",
                * @extend_doc
                */
                device: { platform: "generic" },
                options: {
                    shadingColor: "transparent"
                }
            }
        ]);
    },

    _init: function() {
        this.callBase.apply(this, arguments);
    },

    _initOptions: function() {
        this.callBase.apply(this, arguments);
        this.option("templatesRenderAsynchronously", false);
    },

    _render: function() {
        this.callBase();

        this.element().addClass(LOADPANEL_CLASS);
        this._wrapper().addClass(LOADPANEL_WRAPPER_CLASS);
    },

    _renderContentImpl: function() {
        this.callBase();

        this.content().addClass(LOADPANEL_CONTENT_CLASS);

        this._$contentWrapper = $("<div>").addClass(LOADPANEL_CONTENT_WRAPPER_CLASS);
        this._$contentWrapper.appendTo(this._$content);

        this._togglePaneVisible();

        this._cleanPreviousContent();
        this._renderLoadIndicator();
        this._renderMessage();
    },

    _show: function() {
        var delay = this.option("delay");

        if(!delay) {
            return this.callBase();
        }

        var deferred = $.Deferred();
        var callBase = this.callBase.bind(this);

        this._clearShowTimeout();
        this._showTimeout = setTimeout(function() {
            callBase().done(function() {
                deferred.resolve();
            });
        }, delay);

        return deferred.promise();
    },

    _hide: function() {
        this._clearShowTimeout();
        return this.callBase();
    },

    _clearShowTimeout: function() {
        clearTimeout(this._showTimeout);
    },

    _renderMessage: function() {
        if(!this._$contentWrapper) {
            return;
        }

        var message = this.option("message");

        if(!message) return;

        var $message = $("<div>").addClass(LOADPANEL_MESSAGE_CLASS)
            .text(message);

        this._$contentWrapper.append($message);
    },

    _renderLoadIndicator: function() {
        if(!this._$contentWrapper || !this.option("showIndicator")) {
            return;
        }

        this._$indicator = $("<div>").addClass(LOADPANEL_INDICATOR_CLASS)
            .appendTo(this._$contentWrapper);

        this._createComponent(this._$indicator, LoadIndicator, {
            indicatorSrc: this.option("indicatorSrc")
        });
    },

    _cleanPreviousContent: function() {
        this.content().find("." + LOADPANEL_MESSAGE_CLASS).remove();
        this.content().find("." + LOADPANEL_INDICATOR_CLASS).remove();
    },

    _togglePaneVisible: function() {
        this.content().toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option("showPane"));
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "delay":
                break;
            case "message":
            case "showIndicator":
                this._cleanPreviousContent();
                this._renderLoadIndicator();
                this._renderMessage();
                break;
            case "showPane":
                this._togglePaneVisible();
                break;
            case "indicatorSrc":
                if(this._$indicator) {
                    this._createComponent(this._$indicator, LoadIndicator, {
                        indicatorSrc: this.option("indicatorSrc")
                    });
                }
                break;
            default:
                this.callBase(args);
        }
    },

    _dispose: function() {
        this._clearShowTimeout();
        this.callBase();
    }

    /**
    * @name dxLoadPanelMethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxLoadPanelMethods_focus
    * @publicName focus()
    * @hidden
    * @extend_doc
    */
});

registerComponent("dxLoadPanel", LoadPanel);

module.exports = LoadPanel;
