import '../jquery_augmentation';

/**
 * @docid dxEvent
 * @section commonObjectStructures
 * @prevFileNamespace DevExpress.events
 * @public
 */
export class dxEvent {
    /**
     * @docid dxEventFields.currentTarget
     * @type Node
     * @prevFileNamespace DevExpress.events
     * @public
     */
    currentTarget: Element;
    /**
     * @docid dxEventFields.data
     * @type object
     * @prevFileNamespace DevExpress.events
     * @public
     */
    data: any;
    /**
     * @docid dxEventFields.delegateTarget
     * @type Node
     * @prevFileNamespace DevExpress.events
     * @public
     */
    delegateTarget: Element;
    /**
     * @docid dxEventFields.target
     * @type Node
     * @prevFileNamespace DevExpress.events
     * @public
     */
    target: Element;
    /**
     * @docid dxEventMethods.isDefaultPrevented
     * @publicName isDefaultPrevented()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress.events
     * @public
     */
    isDefaultPrevented(): boolean;
    /**
     * @docid dxEventMethods.isImmediatePropagationStopped
     * @publicName isImmediatePropagationStopped()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress.events
     * @public
     */
    isImmediatePropagationStopped(): boolean;
    /**
     * @docid dxEventMethods.isPropagationStopped
     * @publicName isPropagationStopped()
     * @type function
     * @return boolean
     * @prevFileNamespace DevExpress.events
     * @public
     */
    isPropagationStopped(): boolean;
    /**
     * @docid dxEventMethods.preventDefault
     * @publicName preventDefault()
     * @type function
     * @prevFileNamespace DevExpress.events
     * @public
     */
    preventDefault(): void;
    /**
     * @docid dxEventMethods.stopImmediatePropagation
     * @publicName stopImmediatePropagation()
     * @type function
     * @prevFileNamespace DevExpress.events
     * @public
     */
    stopImmediatePropagation(): void;
    /**
     * @docid dxEventMethods.stopPropagation
     * @publicName stopPropagation()
     * @type function
     * @prevFileNamespace DevExpress.events
     * @public
     */
    stopPropagation(): void;
}

/**
 * @docid event
 * @type dxEvent|jQuery.Event
 * @hidden
 * @prevFileNamespace DevExpress.events
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
 * @prevFileNamespace DevExpress.events
 */
export function eventsHandler(event: dxEvent, extraParameters: any): boolean;
