type EventsEngineType = {
    on(element: any, eventName: any, handler: any, options?: any): void;
    off(element: any, eventName?: any, handler?: any): void;
    one(element: any, eventName: any, handler: any, options?: any): void;
    set(eventEngine: any): void;
    triggerHandler(element: any, opts: Record<string, unknown>): void;
};

declare const eventsEngine: EventsEngineType;
export function set(eventEngine: any): void;
export default eventsEngine;
