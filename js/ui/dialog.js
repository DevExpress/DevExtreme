"use strict";

var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    eventsEngine = require("../events/core/events_engine"),
    Component = require("../core/component"),
    isFunction = require("../core/utils/type").isFunction,
    Action = require("../core/action"),
    domUtils = require("../core/utils/dom"),
    each = require("../core/utils/iterator").each,
    viewPortUtils = require("../core/utils/view_port"),
    extend = require("../core/utils/extend").extend,
    isPlainObject = require("../core/utils/type").isPlainObject,
    devices = require("../core/devices"),
    themes = require("./themes"),
    errors = require("./widget/ui.errors"),
    messageLocalization = require("../localization/message"),
    Popup = require("./popup"),
    config = require("../core/config"),
    Deferred = require("../core/utils/deferred").Deferred;

var DEFAULT_BUTTON = {
    text: "OK",
    onClick: function() { return true; }
};

var DX_DIALOG_CLASSNAME = "dx-dialog",
    DX_DIALOG_WRAPPER_CLASSNAME = DX_DIALOG_CLASSNAME + "-wrapper",
    DX_DIALOG_ROOT_CLASSNAME = DX_DIALOG_CLASSNAME + "-root",
    DX_DIALOG_CONTENT_CLASSNAME = DX_DIALOG_CLASSNAME + "-content",
    DX_DIALOG_MESSAGE_CLASSNAME = DX_DIALOG_CLASSNAME + "-message",
    DX_DIALOG_BUTTONS_CLASSNAME = DX_DIALOG_CLASSNAME + "-buttons",
    DX_DIALOG_BUTTON_CLASSNAME = DX_DIALOG_CLASSNAME + "-button";

var FakeDialogComponent = Component.inherit({
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
            },
            {
                device: function(device) {
                    return !device.phone && themes.isWin8();
                },
                options: {
                    width: function() {
                        return $(window).width();
                    }
                }
            },
            {
                device: function(device) {
                    return device.phone && themes.isWin8();
                },
                options: {
                    position: {
                        my: "top center",
                        at: "top center",
                        of: window,
                        offset: "0 0"
                    }
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
 * @param1_field2 message:String
 * @param1_field3 buttons:Array<dxButtonOptions>
 * @param1_field4 showTitle:boolean
 * @static
 * @module ui/dialog
 * @export custom
 */
exports.custom = function(options) {
    var deferred = new Deferred();

    var defaultOptions = new FakeDialogComponent().option();

    options = extend(defaultOptions, options);

    var $element = $("<div>").addClass(DX_DIALOG_CLASSNAME)
        .appendTo(viewPortUtils.value());

    var $message = $("<div>").addClass(DX_DIALOG_MESSAGE_CLASSNAME)
        .html(String(options.message));

    var popupToolbarItems = [];

    var toolbarItemsOption = options.toolbarItems;

    if(toolbarItemsOption) {
        errors.log("W0001", "DevExpress.ui.dialog", "toolbarItems", "16.2", "Use the 'buttons' option instead");
    } else {
        toolbarItemsOption = options.buttons;
    }

    each(toolbarItemsOption || [DEFAULT_BUTTON], function() {
        var action = new Action(this.onClick, {
            context: popupInstance
        });

        popupToolbarItems.push({
            toolbar: 'bottom',
            location: devices.current().android ? 'after' : 'center',
            widget: 'dxButton',
            options: extend({}, this, {
                onClick: function() {
                    var result = action.execute(arguments);
                    hide(result);
                }
            })
        });
    });

    var popupInstance = new Popup($element, {
        title: options.title || exports.title,
        showTitle: function() {
            var isTitle = options.showTitle === undefined ? true : options.showTitle;
            return isTitle;
        }(),
        height: "auto",
        width: function() {
            var isPortrait = $(window).height() > $(window).width(),
                key = (isPortrait ? "p" : "l") + "Width",
                widthOption = options.hasOwnProperty(key) ? options[key] : options["width"];

            return isFunction(widthOption) ? widthOption() : widthOption;
        },
        showCloseButton: options.showCloseButton || false,
        focusStateEnabled: false,
        onContentReady: function(args) {
            args.component.$content()
                .addClass(DX_DIALOG_CONTENT_CLASSNAME)
                .append($message);
        },
        onShowing: function(e) {
            e.component
                .bottomToolbar()
                .addClass(DX_DIALOG_BUTTONS_CLASSNAME)
                .find(".dx-button")
                .addClass(DX_DIALOG_BUTTON_CLASSNAME);

            domUtils.resetActiveElement();
        },
        onShown: function(e) {
            var $firstButton = e.component
                .bottomToolbar()
                .find(".dx-button")
                .first();

            eventsEngine.trigger($firstButton, "focus");
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
    });

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
 * @publicName alert(message,title)
 * @param1 message:string
 * @param2 title:string
 * @return Promise<void>
 * @static
 * @module ui/dialog
 * @export alert
 */
exports.alert = function(message, title, showTitle) {
    var options = isPlainObject(message)
            ? message
            : {
                title: title,
                message: message,
                showTitle: showTitle
            };

    return exports.custom(options).show();
};

/**
 * @name ui.dialogmethods.confirm
 * @publicName confirm(message,title)
 * @param1 message:string
 * @param2 title:string
 * @return Promise<boolean>
 * @static
 * @module ui/dialog
 * @export confirm
 */
exports.confirm = function(message, title, showTitle) {
    var options = isPlainObject(message)
            ? message
            : {
                title: title,
                message: message,
                showTitle: showTitle,
                buttons: [
                    { text: messageLocalization.format("Yes"), onClick: function() { return true; } },
                    { text: messageLocalization.format("No"), onClick: function() { return false; } }
                ]
            };

    return exports.custom(options).show();
};
