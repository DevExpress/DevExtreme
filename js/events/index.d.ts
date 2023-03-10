import {
    DxElement,
} from '../core/element';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface EventExtension { }
export interface EventType { }
/* eslint-enable @typescript-eslint/no-empty-interface */
/**
 * @docid
 * @type EventObject|jQuery.Event
 */
export type DxEvent<TNativeEvent = Event> = {} extends EventType ? (EventObject & TNativeEvent) : EventType;

/**
 * @docid
 * @public
 */
export interface InitializedEventInfo<TComponent> {
    readonly component?: TComponent;
    readonly element?: DxElement;
}

/**
 * @docid
 * @public
 */
export interface EventInfo<TComponent> {
    /**
     * @docid
     * @public
     */
    readonly component: TComponent;
    /**
     * @docid
     * @public
     */
    readonly element: DxElement;
    /**
     * @docid
     * @public
     */
    readonly model?: any;
}

/**
 * @docid
 * @public
 */
export interface NativeEventInfo<TComponent, TNativeEvent = Event> {
    /**
     * @docid
     * @public
     */
    readonly component: TComponent;
    /**
     * @docid
     * @public
     */
    readonly element: DxElement;
    /**
     * @docid
     * @public
     */
    readonly model?: any;
    /**
     * @docid
     * @public
     */
    readonly event?: DxEvent<TNativeEvent>;
}

/**
 * @docid
 * @public
 */
export interface ChangedOptionInfo {
    readonly name: string;
    readonly fullName: string;
    readonly value?: any;
    readonly previousValue?: any;
}

export interface ItemInfo<TItemData = any> {
    readonly itemData?: TItemData;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
}

/**
 * @docid
 * @public
 */
export interface Cancelable {
    cancel?: boolean;
}

/** @deprecated EventObject */
export type dxEvent = EventObject;

/**
 * @docid
 * @section commonObjectStructures
 * @public
 */
export type EventObject = {
    /**
     * @docid
     * @public
     */
    currentTarget: Element;

    /**
     * @docid
     * @public
     */
    data: any;

    /**
     * @docid
     * @public
     */
    delegateTarget: Element;

    /**
     * @docid
     * @public
     */
    target: Element;
    /**
     * @docid
     * @publicName isDefaultPrevented()
     * @public
     */
    isDefaultPrevented(): boolean;
    /**
     * @docid
     * @publicName isImmediatePropagationStopped()
     * @public
     */
    isImmediatePropagationStopped(): boolean;
    /**
     * @docid
     * @publicName isPropagationStopped()
     * @public
     */
    isPropagationStopped(): boolean;
    /**
     * @docid
     * @publicName preventDefault()
     * @public
     */
    preventDefault(): void;
    /**
     * @docid
     * @publicName stopImmediatePropagation()
     * @public
     */
    stopImmediatePropagation(): void;
    /**
     * @docid
     * @publicName stopPropagation()
     * @public
     */
    stopPropagation(): void;
};

/**
 * @docid
 * @type EventObject|jQuery.Event
 * @hidden
 * @deprecated DxEvent
 */
export type event = DxEvent;

/**
 * @docid
 * @publicName handler(event, extraParameters)
 * @param2 extraParameters:object
 * @hidden
 */
export function eventsHandler(event: DxEvent, extraParameters: any): boolean;

/**
 * @docid eventsMethods.off
 * @publicName off(element)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, handler)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param3 data:object
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, handler)
 * @namespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param4 data:object
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param3 data:object
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, handler)
 * @namespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param4 data:object
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event)
 * @namespace DevExpress.events
 * @param2 event:string|event
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;

/**
 * @docid eventsMethods.triggerHandler
 * @publicName triggerHandler(element, event)
 * @namespace DevExpress.events
 * @param2 event:string|event
 * @hidden
 */
export function triggerHandler(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * @docid eventsMethods.triggerHandler
 * @publicName triggerHandler(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @hidden
 */
export function triggerHandler(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;
