type EventsEngineType = {
    on: (element, eventName, handler) => void;
    off: (element, eventName, handler) => void;
    set: (eventEngine) => void;
};
declare const eventsEngine: EventsEngineType;
export declare function set(eventEngine): void;
export default eventsEngine;
