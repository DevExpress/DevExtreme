import '../jquery_augmentation';

/**
 * @docid
 * @section commonObjectStructures
 * @prevFileNamespace DevExpress.events
 * @public
 */
export class dxEvent {
    /**
     * @docid
     * @type Element
     * @prevFileNamespace DevExpress.events
     * @public
     */
    currentTarget: Element;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.events
     * @public
     */
    data: any;
    /**
     * @docid
     * @type Element
     * @prevFileNamespace DevExpress.events
     * @public
     */
    delegateTarget: Element;
    /**
     * @docid
     * @type Element
     * @prevFileNamespace DevExpress.events
     * @public
     */
    target: Element;
    /**
     * @docid
     * @publicName isDefaultPrevented()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress.events
     * @public
     */
    isDefaultPrevented(): boolean;
    /**
     * @docid
     * @publicName isImmediatePropagationStopped()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress.events
     * @public
     */
    isImmediatePropagationStopped(): boolean;
    /**
     * @docid
     * @publicName isPropagationStopped()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress.events
     * @public
     */
    isPropagationStopped(): boolean;
    /**
     * @docid
     * @publicName preventDefault()
     * @type function
     * @prevFileNamespace DevExpress.events
     * @public
     */
    preventDefault(): void;
    /**
     * @docid
     * @publicName stopImmediatePropagation()
     * @type function
     * @prevFileNamespace DevExpress.events
     * @public
     */
    stopImmediatePropagation(): void;
    /**
     * @docid
     * @publicName stopPropagation()
     * @type function
     * @prevFileNamespace DevExpress.events
     * @public
     */
    stopPropagation(): void;
}

/**
 * @docid
 * @type dxEvent|jQuery.Event
 * @hidden
 * @prevFileNamespace DevExpress.events
 */
export type event = dxEvent | JQueryEventObject;

/**
 * @docid
 * @publicName handler(event, extraParameters)
 * @type function
 * @param1 event:dxEvent
 * @param2 extraParameters:object
 * @return boolean
 * @hidden
 * @prevFileNamespace DevExpress.events
 */
export function eventsHandler(event: dxEvent, extraParameters: any): boolean;

/**
 * @docid eventsMethods.off
 * @publicName off(element)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @module events
 * @export off
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @module events
 * @export off
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 handler:function
 * @module events
 * @export off
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 selector:string
 * @module events
 * @export off
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 handler:function
 * @module events
 * @export off
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 data:object
 * @param4 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 data:object
 * @param5 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 handler:function
 * @module events
 * @export on
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 data:object
 * @param4 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 data:object
 * @param5 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 eventName:string
 * @param3 selector:string
 * @param4 handler:function
 * @module events
 * @export one
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 event:string|event
 * @module events
 * @export trigger
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | event): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @module events
 * @export trigger
 * @prevFileNamespace DevExpress.events
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | event, extraParameters: any): void;

/**
 * @docid eventsMethods.triggerHandler
 * @publicName triggerHandler(element, event)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 event:string|event
 * @module events
 * @export triggerHandler
 * @hidden
 * @prevFileNamespace DevExpress.events
 */
export function triggerHandler(element: Element | Array<Element>, event: string | event): void;

/**
 * @docid eventsMethods.triggerHandler
 * @publicName triggerHandler(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param1 element:Element|Array<Element>
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @module events
 * @export triggerHandler
 * @hidden
 * @prevFileNamespace DevExpress.events
 */
export function triggerHandler(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
