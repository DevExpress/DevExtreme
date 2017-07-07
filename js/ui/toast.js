"use strict";

// TODOs
// 1. animation

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    commonUtils = require("../core/utils/common"),
    typeUtils = require("../core/utils/type"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    pointerEvents = require("../events/pointer"),
    registerComponent = require("../core/component_registrator"),
    Overlay = require("./overlay");

var TOAST_CLASS = "dx-toast",
    TOAST_CLASS_PREFIX = TOAST_CLASS + "-",
    TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + "wrapper",
    TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + "content",
    TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + "message",
    TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + "icon",

    WIDGET_NAME = "dxToast",
    toastTypes = ["info", "warning", "error", "success"],

    TOAST_STACK = [],
    FIRST_Z_INDEX_OFFSET = 8000,

    visibleToastInstance = null,

    POSITION_ALIASES = {
        "top": { my: "top", at: "top", of: null, offset: "0 0" },
        "bottom": { my: "bottom", at: "bottom", of: null, offset: "0 -20" },
        "center": { my: "center", at: "center", of: null, offset: "0 0" },
        "right": { my: "center right", at: "center right", of: null, offset: "0 0" },
        "left": { my: "center left", at: "center left", of: null, offset: "0 0" }
    };

eventsEngine.on($(document), pointerEvents.down, function(e) {
    for(var i = TOAST_STACK.length - 1; i >= 0; i--) {
        if(!TOAST_STACK[i]._proxiedDocumentDownHandler(e)) {
            return;
        }
    }
});

/**
* @name dxToast
* @publicName dxToast
* @inherits dxOverlay
* @groupName Overlays
* @module ui/toast
* @export default
*/
var Toast = Overlay.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxToastOptions_message
            * @publicName message
            * @type string
            * @default ""
            */
            message: "",

            /**
            * @name dxToastOptions_type
            * @publicName type
            * @type string
            * @default 'info'
            * @acceptValues 'info'|'warning'|'error'|'success'|'custom'
            */
            type: "info",

            /**
            * @name dxToastOptions_displaytime
            * @publicName displayTime
            * @type number
            * @default 2000
            */
            displayTime: 2000,

            /**
            * @name dxToastOptions_position
            * @publicName position
            * @type positionConfig|string
            * @default: "bottom center"
            * @extend_doc
            */
            position: "bottom center",

            /**
            * @name dxToastOptions_animation
            * @publicName animation
            * @type object
            * @default { show: { type: "fade", duration: 400, from: 0, to: 1 }, hide: { type: "fade", duration: 400, to: 0 } }
            * @extend_doc
            */
            animation: {
                /**
                * @name dxToastOptions_animation_show
                * @publicName show
                * @type animationConfig
                * @default { type: "fade", duration: 400, from: 0, to: 1 }
                */
                show: {
                    type: "fade",
                    duration: 400,
                    from: 0,
                    to: 1
                },
                /**
                * @name dxToastOptions_animation_hide
                * @publicName hide
                * @type animationConfig
                * @default { type: "fade", duration: 400, to: 0 }
                */
                hide: {
                    type: "fade",
                    duration: 400,
                    to: 0
                }
            },

            /**
            * @name dxToastOptions_shading
            * @publicName shading
            * @type boolean
            * @default false
            * @extend_doc
            */
            shading: false,

            /**
            * @name dxToastOptions_disabled
            * @publicName disabled
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxToastOptions_width
            * @publicName width
            * @type number|string|function
            * @default function() {return $(window).width() * 0.8 }
            * @extend_doc
            */

            /**
            * @name dxToastOptions_height
            * @publicName height
            * @type number|string|function
            * @default 'auto'
            * @extend_doc
            */
            height: "auto",

            /**
            * @name dxToastOptions_closeOnBackButton
            * @publicName closeOnBackButton
            * @type boolean
            * @default false
            * @extend_doc
            */
            closeOnBackButton: false,

            /**
            * @name dxToastOptions_closeOnSwipe
            * @publicName closeOnSwipe
            * @type boolean
            * @default true
            */
            closeOnSwipe: true,

            /**
            * @name dxToastOptions_closeOnClick
            * @publicName closeOnClick
            * @type boolean
            * @default false
            */
            closeOnClick: false,

            /**
            * @name dxToastOptions_resizeEnabled
            * @publicName resizeEnabled
            * @hidden
            * @extend_doc
            */
            resizeEnabled: false

            /**
            * @name dxToastOptions_dragEnabled
            * @publicName dragEnabled
            * @hidden
            * @extend_doc
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    return device.platform === "win" && device.version && device.version[0] === 8;
                },
                options: {
                    /**
                    * @name dxToastOptions_position
                    * @publicName position
                    * @custom_default_for_windows_8 "top center"
                    * @extend_doc
                    */
                    position: "top center",

                    /**
                    * @name dxToastOptions_width
                    * @publicName width
                    * @custom_default_for_windows_8 function() { return $(window).width(); }
                    * @extend_doc
                    */
                    width: function() { return $(window).width(); }
                }
            },
            {
                device: function(device) {
                    return device.platform === "win" && device.version && device.version[0] === 10;
                },
                options: {
                   /**
                   * @name dxToastOptions_position
                   * @publicName position
                   * @custom_default_for_windows_10 "bottom right"
                   * @extend_doc
                   */
                    position: "bottom right",

                    /**
                    * @name dxToastOptions_width
                    * @publicName width
                    * @custom_default_for_windows_10 "auto"
                    * @extend_doc
                    */
                    width: "auto"
                }
            },
            {
                device: { platform: "android" },
                options: {
                    /**
                    * @name dxToastOptions_closeOnOutsideClick
                    * @publicName closeOnOutsideClick
                    * @custom_default_for_android true
                    * @extend_doc
                    */
                    closeOnOutsideClick: true,

                    /**
                    * @name dxToastOptions_width
                    * @publicName width
                    * @custom_default_for_android "auto"
                    * @extend_doc
                    */
                    width: "auto",

                    /**
                    * @name dxToastOptions_position
                    * @publicName position
                    * @custom_default_for_android { at: "bottom left", my: "bottom left", offset: "20 -20" }
                    * @extend_doc
                    */
                    position: {
                        at: "bottom left",
                        my: "bottom left",
                        offset: "20 -20"
                    },

                    /**
                    * @name dxToastOptions_animation
                    * @publicName animation
                    * @custom_default_for_android {show: {type: "slide", duration: 200, from: { top: $(window).height() }}, hide: { type: "slide", duration: 200, to: { top: $(window).height() }}}
                    * @extend_doc
                    */
                    animation: {
                        show: {
                            type: "slide",
                            duration: 200,
                            from: { top: $(window).height() }
                        },
                        hide: {
                            type: "slide",
                            duration: 200,
                            to: { top: $(window).height() }
                        }
                    }
                }
            },
            {
                device: function(device) {
                    var isPhone = device.deviceType === "phone",
                        isAndroid = device.platform === "android",
                        isWin10 = device.platform === "win" && device.version && device.version[0] === 10;

                    return isPhone && (isAndroid || isWin10);
                },
                options: {
                    /**
                    * @name dxToastOptions_width
                    * @publicName width
                    * @custom_default_for_android_phone function() { return $(window).width(); }
                    * @extend_doc
                    */
                    /**
                    * @name dxToastOptions_width
                    * @publicName width
                    * @custom_default_for_windows_phone_10 function() { return $(window).width(); }
                    * @extend_doc
                    */
                    width: function() { return $(window).width(); },

                    /**
                    * @name dxToastOptions_position
                    * @publicName position
                    * @custom_default_for_android_phone { at: "bottom center", my: "bottom center", offset: "0 0" }
                    * @extend_doc
                    */
                    /**
                    * @name dxToastOptions_position
                    * @publicName position
                    * @custom_default_for_windows_phone_10 { at: "bottom center", my: "bottom center", offset: "0 0" }
                    * @extend_doc
                    */
                    position: {
                        at: "bottom center",
                        my: "bottom center",
                        offset: "0 0"
                    }
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this._posStringToObject();
    },

    _renderContentImpl: function() {
        if(this.option("message")) {
            this._message = $("<div>")
                .addClass(TOAST_MESSAGE_CLASS)
                .text(this.option("message"))
                .appendTo(this.content());
        }

        this.setAria("role", "alert", this._message);

        if(inArray(this.option("type").toLowerCase(), toastTypes) > -1) {
            this.content().prepend($("<div>").addClass(TOAST_ICON_CLASS));
        }

        this.callBase();
    },

    _render: function() {
        this.callBase();

        this.element().addClass(TOAST_CLASS);
        this._wrapper().addClass(TOAST_WRAPPER_CLASS);
        this._$content.addClass(TOAST_CLASS_PREFIX + String(this.option("type")).toLowerCase());
        this.content().addClass(TOAST_CONTENT_CLASS);

        this._toggleCloseEvents("Swipe");
        this._toggleCloseEvents("Click");
    },

    _renderScrollTerminator: commonUtils.noop,

    _toggleCloseEvents: function(event) {
        var dxEvent = "dx" + event.toLowerCase();

        this._$content.off(dxEvent);
        this.option("closeOn" + event) && eventsEngine.on(this._$content, dxEvent, this.hide.bind(this));
    },

    _posStringToObject: function() {
        if(!typeUtils.isString(this.option("position"))) return;

        var verticalPosition = this.option("position").split(" ")[0],
            horizontalPosition = this.option("position").split(" ")[1];

        this.option("position", extend({}, POSITION_ALIASES[verticalPosition]));

        switch(horizontalPosition) {
            case "center":
            case "left":
            case "right":
                this.option("position").at += " " + horizontalPosition;
                this.option("position").my += " " + horizontalPosition;
                break;
        }
    },

    _show: function() {
        if(visibleToastInstance) {
            clearTimeout(visibleToastInstance._hideTimeout);
            visibleToastInstance.hide();
        }

        visibleToastInstance = this;

        return this.callBase.apply(this, arguments).done((function() {
            clearTimeout(this._hideTimeout);

            this._hideTimeout = setTimeout(this.hide.bind(this), this.option("displayTime"));
        }).bind(this));
    },

    _hide: function() {
        visibleToastInstance = null;
        return this.callBase.apply(this, arguments);
    },

    _overlayStack: function() {
        return TOAST_STACK;
    },

    _zIndexInitValue: function() {
        return this.callBase() + FIRST_Z_INDEX_OFFSET;
    },

    _dispose: function() {
        clearTimeout(this._hideTimeout);
        visibleToastInstance = null;
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "type":
                this._$content.removeClass(TOAST_CLASS_PREFIX + args.previousValue);
                this._$content.addClass(TOAST_CLASS_PREFIX + String(args.value).toLowerCase());
                break;
            case "message":
                if(this._message) {
                    this._message.text(args.value);
                }
                break;
            case "closeOnSwipe":
                this._toggleCloseEvents("Swipe");
                break;
            case "closeOnClick":
                this._toggleCloseEvents("Click");
                break;
            case "displayTime":
            case "position":
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent(WIDGET_NAME, Toast);

module.exports = Toast;
