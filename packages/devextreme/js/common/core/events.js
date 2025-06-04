import eventsEngine from './events/core/events_engine';

const on = eventsEngine.on;
const one = eventsEngine.one;
const off = eventsEngine.off;
const trigger = eventsEngine.trigger;
const _Event = eventsEngine.Event;

export {
    /**
    * @name events
    */
    on,
    one,
    off,
    trigger,

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
    _Event as Event,
};
