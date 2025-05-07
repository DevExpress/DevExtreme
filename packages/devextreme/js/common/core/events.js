import eventsEngine from './events/core/events_engine';

/**
* @name events
*/


export const on = eventsEngine.on;

export const one = eventsEngine.one;
export const off = eventsEngine.off;
export const trigger = eventsEngine.trigger;

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

export const Event = eventsEngine.Event;
