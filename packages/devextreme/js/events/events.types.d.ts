/**
 * @namespace DevExpress.events
 */
export type EventObject = {
  /**
   * @docid
   * @public
   */
  altKey: boolean;

  /**
   * @docid
   * @public
   */
  bubbles: boolean;

  /**
   * @docid
   * @public
   */
  button: number;

  /**
   * @docid
   * @public
   */
  buttons: number;

  /**
   * @docid
   * @public
   */
  cancelable: boolean;

  /**
   * @docid
   * @public
   * @type object
   */
  changedTouches: TouchList;

  /**
   * @docid
   * @public
   */
  char: any;

  /**
   * @docid
   * @public
   */
  charCode: number;

  /**
   * @docid
   * @public
   */
  clientX: number;

  /**
   * @docid
   * @public
   */
  clientY: number;

  /**
   * @docid
   * @public
   */
  code: string;

  /**
   * @docid
   * @public
   */
  ctrlKey: boolean;

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
  detail: number;

  /**
   * @docid
   * @public
   */
  eventPhase: number;

  /**
   * @docid
   * @public
   */
  guid: number;

  /**
   * @docid
   * @public
   */
  isTrusted: boolean;

  /**
   * @docid
   * @public
   */
  key: string;

  /**
   * @docid
   * @public
   */
  keyCode: number;

  /**
   * @docid
   * @public
   */
  metaKey: boolean;

  /**
   * @docid
   * @public
   */
  offsetX: number;

  /**
   * @docid
   * @public
   */
  offsetY: number;

  /**
   * @docid
   * @public
   */
  pageX: number;

  /**
   * @docid
   * @public
   */
  pageY: number;

  /**
   * @docid
   * @public
   */
  pointerId: number;

  /**
   * @docid
   * @public
   */
  pointerType: string;

  /**
   * @docid
   * @public
   */
  relatedTarget: Element;

  /**
   * @docid
   * @public
   */
  screenX: number;

  /**
   * @docid
   * @public
   */
  screenY: number;

  /**
   * @docid
   * @public
   */
  shiftKey: boolean;

  /**
   * @docid
   * @public
   */
  target: Element;

  /**
   * @docid
   * @public
   * @type object
   */
  targetTouches: TouchList;

  /**
   * @docid
   * @public
   */
  timeStamp: number;

  /**
   * @docid
   * @public
   */
  toElement: Element;

  /**
   * @docid
   * @public
   * @type object
   */
  touches: TouchList;

  /**
   * @docid
   * @public
   */
  type: string;

  /**
   * @docid
   * @public
   */
  view: Window | null;

  /**
   * @docid
   * @public
   */
  which: number;

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

export interface EventExtension { }
export interface EventType { }

/**
 * @docid
 * @type EventObject|jQuery.Event
 */
export type DxEvent<TNativeEvent extends Event = Event> = ({} extends EventType ? EventObject : EventType) & {
  /**
   * @docid
   * @public
   * @type event
   */
  originalEvent: TNativeEvent;
};

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
