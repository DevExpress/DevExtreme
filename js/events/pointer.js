"use strict";

var support = require("../core/utils/support"),
    each = require("../core/utils/iterator").each,
    devices = require("../core/devices"),
    registerEvent = require("./core/event_registrator"),
    TouchStrategy = require("./pointer/touch"),
    MsPointerStrategy = require("./pointer/mspointer"),
    MouseStrategy = require("./pointer/mouse"),
    MouseAndTouchStrategy = require("./pointer/mouse_and_touch");

/**
  * @name ui events_dxpointerdown
  * @publicName dxpointerdown
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointermove
  * @publicName dxpointermove
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerup
  * @publicName dxpointerup
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointercancel
  * @publicName dxpointercancel
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerover
  * @publicName dxpointerover
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerout
  * @publicName dxpointerout
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerenter
  * @publicName dxpointerenter
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
  * @type_function_param1_field1 pointerType:string
  * @module events/pointer
*/
/**
  * @name ui events_dxpointerleave
  * @publicName dxpointerleave
  * @type jQuery.Event
  * @type_function_param1 event:jQuery.Event
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
