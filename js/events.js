"use strict";

var eventsEngine = require("./events/core/events_engine");

/**
* @name events
* @publicName events
*/

/**
* @name eventsHandler
* @publicName handler(event, extraParameters)
* @type function
* @param1 event:dxEvent
* @param2 extraParameters:object
* @return boolean
* @hidden
*/

/**
* @name eventsMethods.on
* @publicName on(element, eventName, selector, data, handler)
* @namespace DevExpress.events
* @param1 element:Node|Array<Node>
* @param2 eventName:string
* @param3 selector:string
* @param4 data:object
* @param5 handler:function
* @module events
* @export on
*/

exports.on = eventsEngine.on;

/**
* @name eventsMethods.one
* @publicName one(element, eventName, selector, data, handler)
* @namespace DevExpress.events
* @param1 element:Node|Array<Node>
* @param2 eventName:string
* @param3 selector:string
* @param4 data:object
* @param5 handler:function
* @module events
* @export one
*/

exports.one = eventsEngine.one;

/**
* @name eventsMethods.off
* @publicName off(element, eventName, selector, handler)
* @namespace DevExpress.events
* @param1 element:Node|Array<Node>
* @param2 eventName:string
* @param3 selector:string
* @param4 handler:function
* @module events
* @export off
*/

exports.off = eventsEngine.off;

/**
* @name eventsMethods.trigger
* @publicName trigger(element, event, extraParameters)
* @namespace DevExpress.events
* @param1 element:Node|Array<Node>
* @param2 event:string|event
* @param3 extraParameters:object
* @module events
* @export trigger
*/

exports.trigger = eventsEngine.trigger;

/**
* @name eventsMethods.triggerHandler
* @publicName triggerHandler(element, event, extraParameters)
* @namespace DevExpress.events
* @param1 element:Node|Array<Node>
* @param2 event:string|event
* @param3 extraParameters:object
* @module events
* @export triggerHandler
* @hidden
*/

exports.triggerHandler = eventsEngine.triggerHandler;

/**
* @name dxEvent
* @publicName dxEvent
* @section commonObjectStructures
*/

/**
* @name dxEventMethods.isPropagationStopped
* @publicName isPropagationStopped()
* @type function
* @return boolean
*/

/**
* @name dxEventMethods.stopPropagation
* @publicName stopPropagation()
* @type function
*/

/**
* @name dxEventMethods.isImmediatePropagationStopped
* @publicName isImmediatePropagationStopped()
* @type function
* @return boolean
*/

/**
* @name dxEventMethods.stopImmediatePropagation
* @publicName stopImmediatePropagation()
* @type function
*/

/**
* @name dxEventMethods.isDefaultPrevented
* @publicName isDefaultPrevented()
* @type function
* @return boolean
*/

/**
* @name dxEventMethods.preventDefault
* @publicName preventDefault()
* @type function
*/

/**
* @name dxEventFields.target
* @publicName target
* @type Node
*/

/**
* @name dxEventFields.currentTarget
* @publicName currentTarget
* @type Node
*/

/**
* @name dxEventFields.delegateTarget
* @publicName delegateTarget
* @type Node
*/

/**
* @name dxEventFields.data
* @publicName data
* @type object
*/

/**
* @name event
* @publicName event
* @type dxEvent|jQuery.Event
* @hidden
*/

/**
* @name events.Event
* @publicName Event
* @type function
* @param1 source:string|event
* @param2 config:object
* @return event
* @module events
* @export Event
* @hidden
*/

exports.Event = eventsEngine.Event;
