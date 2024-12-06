/**
 * @namespace DevExpress.events
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
 * @publicName handler(event, extraParameters)
 * @param2 extraParameters:object
 * @hidden
 */
export function eventsHandler(event: DxEvent, extraParameters: any): boolean;

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface EventExtension { }
export interface EventType { }
/* eslint-enable @typescript-eslint/no-empty-interface */

/**
 * @docid
 * @type EventObject|jQuery.Event
 *
 */
export type DxEvent<TNativeEvent = Event> = {} extends EventType ? (EventObject & TNativeEvent) : EventType;

/** @deprecated EventObject */
export type dxEvent = EventObject;

/**
 * @docid
 * @type EventObject|jQuery.Event
 * @hidden
 * @deprecated DxEvent
 */
export type event = DxEvent;

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
