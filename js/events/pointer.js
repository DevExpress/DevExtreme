"use strict";

var support = require("../core/utils/support"),
    each = require("../core/utils/iterator").each,
    devices = require("../core/devices"),
    registerEvent = require("./core/event_registrator"),
    TouchStrategy = require("./pointer/touch"),
    MsPointerStrategy = require("./pointer/mspointer"),
    MouseStrategy = require("./pointer/mouse"),
    MouseAndTouchStrategy = require("./pointer/mouse_and_touch"),
    jQuery = require("jquery"),
    useJQuery = require("../integration/jquery/use_jquery")();

/**
  * @name ui events_dxpointerdown
  * @publicName dxpointerdown
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointermove
  * @publicName dxpointermove
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerup
  * @publicName dxpointerup
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointercancel
  * @publicName dxpointercancel
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerover
  * @publicName dxpointerover
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerout
  * @publicName dxpointerout
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerenter
  * @publicName dxpointerenter
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerleave
  * @publicName dxpointerleave
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/

var EventStrategy = (function() {
    if(support.pointerEvents) {
        return MsPointerStrategy;
    }

    var device = devices.real();
    if(support.touch && !(device.tablet || device.phone)) {
        return MouseAndTouchStrategy;
    }

    if(support.touch) {
        return TouchStrategy;
    }

    return MouseStrategy;
})();

each(EventStrategy.map, function(pointerEvent, originalEvents) {
    registerEvent(pointerEvent, new EventStrategy(pointerEvent, originalEvents));
});

if(useJQuery && support.touch) {
    each([TouchStrategy.map["dxpointerdown"], TouchStrategy.map["dxpointermove"]], function(_, eventName) {
        jQuery.event.special[eventName] = {
            setup: function(_, namespaces, handler) {
                if(namespaces.indexOf(TouchStrategy.POINTER_EVENTS_NAMESPACE) > -1) {
                    this.addEventListener(eventName, handler, { passive: false });
                } else {
                    return false;
                }
            }
        };
    });
}

module.exports = {
    down: "dxpointerdown",
    up: "dxpointerup",
    move: "dxpointermove",
    cancel: "dxpointercancel",
    enter: "dxpointerenter",
    leave: "dxpointerleave",
    over: "dxpointerover",
    out: "dxpointerout"
};
