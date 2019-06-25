import $ from "../core/renderer";
import Component from "../core/component";
import Action from "../core/action";
import devices from "../core/devices";
import config from "../core/config";

import { resetActiveElement } from "../core/utils/dom";
import { Deferred } from "../core/utils/deferred";
import { isFunction } from "../core/utils/type";
import { each } from "../core/utils/iterator";
import { isPlainObject } from "../core/utils/type";
import { extend } from "../core/utils/extend";
import { getWindow } from "../core/utils/window";
import { trigger } from "../events/core/events_engine";
import { value as getViewport } from "../core/utils/view_port";

import messageLocalization from "../localization/message";
import errors from "./widget/ui.errors";
import Popup from "./popup";

import { ensureDefined } from "../core/utils/common";

const window = getWindow();

const DEFAULT_BUTTON = {
    text: "OK",
    onClick: function() { return true; }
};

const DX_DIALOG_CLASSNAME = "dx-dialog";
const DX_DIALOG_WRAPPER_CLASSNAME = `${DX_DIALOG_CLASSNAME}-wrapper`;
const DX_DIALOG_ROOT_CLASSNAME = `${DX_DIALOG_CLASSNAME}-root`;
const DX_DIALOG_CONTENT_CLASSNAME = `${DX_DIALOG_CLASSNAME}-content`;
const DX_DIALOG_MESSAGE_CLASSNAME = `${DX_DIALOG_CLASSNAME}-message`;
const DX_DIALOG_BUTTONS_CLASSNAME = `${DX_DIALOG_CLASSNAME}-buttons`;
const DX_DIALOG_BUTTON_CLASSNAME = `${DX_DIALOG_CLASSNAME}-button`;

const DX_BUTTON_CLASSNAME = "dx-button";

const FakeDialogComponent = Component.inherit({
    ctor: function(element, options) {
        this.callBase(options);
    },

    _defaultOptionsRules: function() {

        return this.callBase().concat([
            {
                device: { platform: "ios" },
                options: {
                    width: 276
                }
            },
            {
                device: { platform: "android" },
                options: {
                    lWidth: "60%",
                    pWidth: "80%"
                }
            }
        ]);
    }
});
exports.FakeDialogComponent = FakeDialogComponent;

exports.title = "";

/**
 * @name ui.dialog
 * @namespace DevExpress.ui
 */

/**
 * @name ui.dialogmethods.custom
 * @publicName custom(options)
 * @return Object
 * @param1 options:object
 * @param1_field1 title:String
 * @param1_field2 messageHtml:String
 * @param1_field3 buttons:Array<dxButtonOptions>
 * @param1_field4 showTitle:boolean
 * @param1_field5 message:String:deprecated(messageHtml)
 * @param1_field6 dragEnabled:boolean
 * @static
 * @module ui/dialog
 * @export custom
 */
exports.custom = function(options) {
    const deferred = new Deferred();

    const defaultOptions = new FakeDialogComponent().option();

    options = extend(defaultOptions, options);

    const $element = $("<div>")
        .addClass(DX_DIALOG_CLASSNAME)
        .appendTo(getViewport());

    const isMessageDefined = "message" in options;
    const isMessageHtmlDefined = "messageHtml" in options;

    if(isMessageDefined) {
        errors.log("W1013");
    }

    const messageHtml = String(isMessageHtmlDefined ? options.messageHtml : options.message);

    const $message = $("<div>").addClass(DX_DIALOG_MESSAGE_CLASSNAME)
        .html(messageHtml);

    const popupToolbarItems = [];

    let toolbarItemsOption = options.toolbarItems;

    if(toolbarItemsOption) {
        errors.log("W0001", "DevExpress.ui.dialog", "toolbarItems", "16.2", "Use the 'buttons' option instead");
    } else {
        toolbarItemsOption = options.buttons;
    }

    each(toolbarItemsOption || [DEFAULT_BUTTON], function() {
        const action = new Action(this.onClick, {
            context: popupInstance
        });

        popupToolbarItems.push({
            toolbar: "bottom",
            location: devices.current().android ? "after" : "center",
            widget: "dxButton",
            options: extend({}, this, {
                onClick: function() {
                    const result = action.execute(...arguments);
                    hide(result);
                }
            })
        });
    });

    const popupInstance = new Popup($element, extend({
        title: options.title || exports.title,
        showTitle: ensureDefined(options.showTitle, true),
        dragEnabled: ensureDefined(options.dragEnabled, true),
        height: "auto",
        width: function() {
            const isPortrait = $(window).height() > $(window).width(),
                key = (isPortrait ? "p" : "l") + "Width",
                widthOption = Object.prototype.hasOwnProperty.call(options, key) ? options[key] : options["width"];

            return isFunction(widthOption) ? widthOption() : widthOption;
        },
        showCloseButton: options.showCloseButton || false,
        ignoreChildEvents: false,
        onContentReady: function(args) {
            args.component.$content()
                .addClass(DX_DIALOG_CONTENT_CLASSNAME)
                .append($message);
        },
        onShowing: function(e) {
            e.component
                .bottomToolbar()
                .addClass(DX_DIALOG_BUTTONS_CLASSNAME)
                .find(`.${DX_BUTTON_CLASSNAME}`)
                .addClass(DX_DIALOG_BUTTON_CLASSNAME);

            resetActiveElement();
        },
        onShown: function(e) {
            const $firstButton = e.component
                .bottomToolbar()
                .find(`.${DX_BUTTON_CLASSNAME}`)
                .first();

            trigger($firstButton, "focus");
        },
        onHiding: function() {
            deferred.reject();
        },
        toolbarItems: popupToolbarItems,
        animation: {
            show: {
                type: "pop",
                duration: 400
            },
            hide: {
                type: "pop",
                duration: 400,
                to: {
                    opacity: 0,
                    scale: 0
                },
                from: {
                    opacity: 1,
                    scale: 1
                }
            }
        },
        rtlEnabled: config().rtlEnabled,
        boundaryOffset: { h: 10, v: 0 }
    }, options.popupOptions));

    popupInstance._wrapper().addClass(DX_DIALOG_WRAPPER_CLASSNAME);

    if(options.position) {
        popupInstance.option("position", options.position);
    }

    popupInstance._wrapper()
        .addClass(DX_DIALOG_ROOT_CLASSNAME);

    function show() {
        popupInstance.show();
        return deferred.promise();
    }

    function hide(value) {
        deferred.resolve(value);
        popupInstance.hide().done(function() {
            popupInstance.$element().remove();
        });
    }

    return {
        show: show,
        hide: hide
    };
};


/**
 * @name ui.dialogmethods.alert
 * @publicName alert(messageHtml,title)
 * @param1 messageHtml:string
 * @param2 title:string
 * @return Promise<void>
 * @static
 * @module ui/dialog
 * @export alert
 */
exports.alert = function(messageHtml, title, showTitle) {
    const options = isPlainObject(messageHtml) ? messageHtml : { title, messageHtml, showTitle, dragEnabled: showTitle };

    return exports.custom(options).show();
};

/**
 * @name ui.dialogmethods.confirm
 * @publicName confirm(messageHtml,title)
 * @param1 messageHtml:string
 * @param2 title:string
 * @return Promise<boolean>
 * @static
 * @module ui/dialog
 * @export confirm
 */
exports.confirm = function(messageHtml, title, showTitle) {
    const options = isPlainObject(messageHtml)
        ? messageHtml
        : {
            title,
            messageHtml,
            showTitle,
            buttons: [
                { text: messageLocalization.format("Yes"), onClick: function() { return true; } },
                { text: messageLocalization.format("No"), onClick: function() { return false; } }
            ],
            dragEnabled: showTitle
        };

    return exports.custom(options).show();
};
