"use strict";

var $ = require("jquery"),
    compareVersion = require("../../core/utils/version").compare,
    each = require("../../core/utils/iterator").each,
    isNumeric = require("../../core/utils/type").isNumeric,
    registerEvent = require("../../events/core/event_registrator"),
    touchProps = require("./touch_props"),

    touchPropsToHook = touchProps.touchPropsToHook,
    touchPropHook = touchProps.touchPropHook;

if(compareVersion($.fn.jquery, [3]) < 0) {
    var POINTER_TYPE_MAP = {
        2: "touch",
        3: "pen",
        4: "mouse"
    };

    each([
        "MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel", "MSPointerOver", "MSPointerOut", "mouseenter", "mouseleave",
        "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout", "pointerenter", "pointerleave"
    ], function() {
        $.event.fixHooks[this] = {
            filter: function(event, originalEvent) {
                var pointerType = originalEvent.pointerType;

                if(isNumeric(pointerType)) {
                    event.pointerType = POINTER_TYPE_MAP[pointerType];
                }

                return event;
            },
            props: $.event.mouseHooks.props.concat([
                "pointerId",
                "pointerType",
                "originalTarget",
                "width",
                "height",
                "pressure",
                "result",
                "tiltX",
                "charCode",
                "tiltY",
                "detail",
                "isPrimary",
                "prevValue"
            ])
        };
    });

    each(["touchstart", "touchmove", "touchend", "touchcancel"], function() {
        $.event.fixHooks[this] = {
            filter: function(event, originalEvent) {
                each(touchPropsToHook, function(_, name) {
                    event[name] = touchPropHook(name, originalEvent);
                });

                return event;
            },

            props: $.event.mouseHooks.props.concat([
                "touches",
                "changedTouches",
                "targetTouches",
                "detail",
                "result",
                "originalTarget",
                "charCode",
                "prevValue"
            ])
        };
    });

    $.event.fixHooks["wheel"] = $.event.mouseHooks;

    var DX_EVENT_HOOKS = {
        props: $.event.mouseHooks.props.concat(["pointerType", "pointerId", "pointers"])
    };

    registerEvent.callbacks.add(function(name) {
        $.event.fixHooks[name] = DX_EVENT_HOOKS;
    });

    var fix = function(event, originalEvent) {
        var fixHook = $.event.fixHooks[originalEvent.type] || $.event.mouseHooks;

        var props = fixHook.props ? $.event.props.concat(fixHook.props) : $.event.props,
            propIndex = props.length;

        while(propIndex--) {
            var prop = props[propIndex];
            event[prop] = originalEvent[prop];
        }

        return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    };

    exports.copy = function(originalEvent) {
        return fix($.Event(originalEvent.type, originalEvent), originalEvent);
    };
} else {
    each(touchPropsToHook, function(_, name) {
        $.event.addProp(name, function(event) {
            return touchPropHook(name, event);
        });
    });

    exports.copy = function(originalEvent) {
        return $.Event(originalEvent, originalEvent);
    };
}
