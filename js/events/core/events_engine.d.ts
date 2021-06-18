type EventsEngineType = {
    on: (element: any, eventName: any, handler: any, options?: any) => void;
    off: (element: any, eventName: any, handler: any) => void;
    set: (eventEngine: any) => void;
}

declare const eventsEngine: EventsEngineType;
export declare function set(eventEngine: any): void;
export default eventsEngine;
