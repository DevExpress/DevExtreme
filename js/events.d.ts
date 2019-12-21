import {
    JQueryEventObject
} from './common';

/**
 * @docid dxEvent
 * @section commonObjectStructures
 * @prevFileNamespace DevExpress
 * @public
 */
export type dxEvent = Event;
export class Event {
    /**
     * @docid dxEventFields.currentTarget
     * @type Node
     * @prevFileNamespace DevExpress
     * @public
     */
    currentTarget: Element;
    /**
     * @docid dxEventFields.data
     * @type object
     * @prevFileNamespace DevExpress
     * @public
     */
    data: any;
    /**
     * @docid dxEventFields.delegateTarget
     * @type Node
     * @prevFileNamespace DevExpress
     * @public
     */
    delegateTarget: Element;
    /**
     * @docid dxEventFields.target
     * @type Node
     * @prevFileNamespace DevExpress
     * @public
     */
    target: Element;
    /**
     * @docid dxEventMethods.isDefaultPrevented
     * @publicName isDefaultPrevented()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress
     * @public
     */
    isDefaultPrevented(): boolean;
    /**
     * @docid dxEventMethods.isImmediatePropagationStopped
     * @publicName isImmediatePropagationStopped()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress
     * @public
     */
    isImmediatePropagationStopped(): boolean;
    /**
     * @docid dxEventMethods.isPropagationStopped
     * @publicName isPropagationStopped()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress
     * @public
     */
    isPropagationStopped(): boolean;
    /**
     * @docid dxEventMethods.preventDefault
     * @publicName preventDefault()
     * @type function
     * @prevFileNamespace DevExpress
     * @public
     */
    preventDefault(): void;
    /**
     * @docid dxEventMethods.stopImmediatePropagation
     * @publicName stopImmediatePropagation()
     * @type function
     * @prevFileNamespace DevExpress
     * @public
     */
    stopImmediatePropagation(): void;
    /**
     * @docid dxEventMethods.stopPropagation
     * @publicName stopPropagation()
     * @type function
     * @prevFileNamespace DevExpress
     * @public
     */
    stopPropagation(): void;
}

/**
 * @docid event
 * @type dxEvent|jQuery.Event
 * @hidden
 * @prevFileNamespace DevExpress
 */
export type event = dxEvent | JQueryEventObject;


/**
 * @docid eventsHandler
 * @publicName handler(event, extraParameters)
 * @type function
 * @param1 event:dxEvent
 * @param2 extraParameters:object
 * @return boolean
 * @hidden
 * @prevFileNamespace DevExpress
 */
export function eventsHandler(event: dxEvent, extraParameters: any): boolean;

/**
 * @docid eventsMethods.off
 * @publicName off(element)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @module events
 * @export off
 * @prevFileNamespace DevExpress
 * @public
 */
export function off(element: Element | Array<Element>): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @module events
 * @export off
 * @prevFileNamespace DevExpress
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 handler:function
 * @module events
 * @export off
 * @prevFileNamespace DevExpress
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 selector:string
 * @module events
 * @export off
 * @prevFileNamespace DevExpress
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 handler:function
 * @module events
 * @export off
 * @prevFileNamespace DevExpress
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 data:object
 * @param4 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 data:object
 * @param5 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 data:object
 * @param4 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 data:object
 * @param5 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 event:string|event
 * @module events
 * @export trigger
 * @prevFileNamespace DevExpress
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | event): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @module events
 * @export trigger
 * @prevFileNamespace DevExpress
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | event, extraParameters: any): void;

/**
 * @docid eventsMethods.triggerHandler
 * @publicName triggerHandler(element, event)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 event:string|event
 * @module events
 * @export triggerHandler
 * @hidden
 * @prevFileNamespace DevExpress
 */
export function triggerHandler(element: Element | Array<Element>, event: string | event): void;

/**
 * @docid eventsMethods.triggerHandler
 * @publicName triggerHandler(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param1 element:Node|Array<Node>
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @module events
 * @export triggerHandler
 * @hidden
 * @prevFileNamespace DevExpress
 */
export function triggerHandler(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
