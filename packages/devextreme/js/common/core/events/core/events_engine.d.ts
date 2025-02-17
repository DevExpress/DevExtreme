type EventsEngineType = {
    on(element: any, eventName: any, handler: any, options?: any): void;
    off(element: any, eventName?: any, handler?: any): void;
    one(element: any, eventName: any, handler: any, options?: any): void;
    set(eventEngine: any): void;
    triggerHandler(element: any, opts: Record<string, unknown>): void;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare const eventsEngine: EventsEngineType;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function set(eventEngine: any): void;
export default eventsEngine;
