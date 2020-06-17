type EventsEngineType = {
    on: (element, eventName, handler) => void;
    off: (element, eventName, handler) => void;
};
declare const eventsEngine: EventsEngineType;
export default eventsEngine;
