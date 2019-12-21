var eventsEngine = require('./events/core/events_engine');

/**
* @name events
*/


exports.on = eventsEngine.on;


exports.one = eventsEngine.one;


exports.off = eventsEngine.off;


exports.trigger = eventsEngine.trigger;


exports.triggerHandler = eventsEngine.triggerHandler;


/**
* @name events.Event
* @type function
* @param1 source:string|event
* @param2 config:object
* @return event
* @module events
* @export Event
* @hidden
*/

exports.Event = eventsEngine.Event;
