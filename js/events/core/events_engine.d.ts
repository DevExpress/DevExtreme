interface EventsEngineType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(element: any, eventName: any, handler: any, options?: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off(element: any, eventName: any, handler: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(eventEngine: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    triggerHandler(element: any, opts: Record<string, unknown>): void;
}

declare const eventsEngine: EventsEngineType;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function set(eventEngine: any): void;
export default eventsEngine;
