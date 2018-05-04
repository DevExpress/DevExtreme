"use strict";

var support = require("../core/utils/support"),
    each = require("../core/utils/iterator").each,
    devices = require("../core/devices"),
    registerEvent = require("./core/event_registrator"),
    domAdapter = require("../core/dom_adapter"),
    TouchStrategy = require("./pointer/touch"),
    MsPointerStrategy = require("./pointer/mspointer"),
    MouseStrategy = require("./pointer/mouse"),
    MouseAndTouchStrategy = require("./pointer/mouse_and_touch");

/**
  * @name ui events.dxpointerdown
  * @publicName dxpointerdown
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointermove
  * @publicName dxpointermove
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerup
  * @publicName dxpointerup
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointercancel
  * @publicName dxpointercancel
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerover
  * @publicName dxpointerover
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerout
  * @publicName dxpointerout
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerenter
  * @publicName dxpointerenter
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerleave
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

if(support.touch) {
    each([TouchStrategy.map["dxpointerdown"], TouchStrategy.map["dxpointermove"]], function(_, eventName) {
        registerEvent(eventName, {
            setup: function(element, data, namespaces, handler) {
                if(namespaces.indexOf(TouchStrategy.POINTER_EVENTS_NAMESPACE) > -1) {
                    domAdapter.listen(element, eventName, handler, { passive: false });
                    return true;
                }
                return false;
            }
        });
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
