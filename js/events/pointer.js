"use strict";

var support = require("../core/utils/support"),
    each = require("../core/utils/iterator").each,
    devices = require("../core/devices"),
    domAdapter = require("../core/dom_adapter"),
    registerEvent = require("./core/event_registrator"),
    TouchStrategy = require("./pointer/touch"),
    MsPointerStrategy = require("./pointer/mspointer"),
    MouseStrategy = require("./pointer/mouse"),
    eventsEngine = require("../events/core/events_engine"),
    MouseAndTouchStrategy = require("./pointer/mouse_and_touch");

/**
  * @name ui events.dxpointerdown
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointermove
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerup
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointercancel
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerover
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerout
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerenter
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events.dxpointerleave
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
    var eventStrategy = new EventStrategy(pointerEvent, originalEvents);

    if(pointerEvent === eventsEngine.passiveListenerEvents.eventName) {
        eventStrategy.setup = function(element, data, namespaces, handler) {
            domAdapter.listen(element, eventsEngine.passiveListenerEvents.nativeEventName, handler, { passive: false });

            return true;
        };
    }

    registerEvent(pointerEvent, eventStrategy);
});

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
