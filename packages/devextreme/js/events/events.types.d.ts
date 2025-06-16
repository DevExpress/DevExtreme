type PickFromEvent<TNativeEvent extends Event, TTargetEvents extends Event, EventName extends keyof TTargetEvents> =
  TNativeEvent extends Pick<TTargetEvents, EventName>
    ? TTargetEvents[EventName]
    : undefined;

/**
 * @namespace DevExpress.events
 */
export type EventObject<TNativeEvent extends Event = Event> = {
  /**
   * @docid
   * @public
   * @type boolean
   */
  altKey: PickFromEvent<TNativeEvent, MouseEvent | TouchEvent | KeyboardEvent, 'altKey'>;

  /**
   * @docid
   * @public
   */
  bubbles: boolean;

  /**
   * @docid
   * @public
   * @type number
   */
  button: PickFromEvent<TNativeEvent, MouseEvent, 'button'>;

  /**
   * @docid
   * @public
   * @type number
   */
  buttons: PickFromEvent<TNativeEvent, MouseEvent, 'buttons'>;

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
  changedTouches: PickFromEvent<TNativeEvent, TouchEvent, 'changedTouches'>;
  /**
   * @docid
   * @public
   */
  char: any;

  /**
   * @docid
   * @public
   * @type number
   */
  charCode: PickFromEvent<TNativeEvent, KeyboardEvent, 'charCode'>;

  /**
   * @docid
   * @public
   * @type number
   */
  clientX: PickFromEvent<TNativeEvent, MouseEvent, 'clientX'>;

  /**
   * @docid
   * @public
   * @type number
   */
  clientY: PickFromEvent<TNativeEvent, MouseEvent, 'clientY'>;

  /**
   * @docid
   * @public
   * @type string
   */
  code: PickFromEvent<TNativeEvent, KeyboardEvent, 'code'>;

  /**
   * @docid
   * @public
   * @type boolean
   */
  ctrlKey: PickFromEvent<TNativeEvent, KeyboardEvent | MouseEvent | TouchEvent, 'ctrlKey'>;

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
   * @type number
   */
  detail: PickFromEvent<TNativeEvent, UIEvent, 'detail'>;

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
   * @type string
   */
  key: PickFromEvent<TNativeEvent, KeyboardEvent, 'key'>;

  /**
   * @docid
   * @public
   * @type number
   */
  keyCode: PickFromEvent<TNativeEvent, KeyboardEvent, 'keyCode'>;

  /**
   * @docid
   * @public
   * @type boolean
   */
  metaKey: PickFromEvent<TNativeEvent, KeyboardEvent | TouchEvent | MouseEvent, 'metaKey'>;

  /**
   * @docid
   * @public
   * @type number
   */
  offsetX: PickFromEvent<TNativeEvent, MouseEvent, 'offsetX'>;

  /**
   * @docid
   * @public
   * @type number
   */
  offsetY: PickFromEvent<TNativeEvent, MouseEvent, 'offsetY'>;

  /**
   * @docid
   * @public
   * @type number
   */
  pageX: PickFromEvent<TNativeEvent, MouseEvent, 'pageX'>;

  /**
   * @docid
   * @public
   * @type number
   */
  pageY: PickFromEvent<TNativeEvent, MouseEvent, 'pageY'>;

  /**
   * @docid
   * @public
   * @type number
   */
  pointerId: PickFromEvent<TNativeEvent, PointerEvent, 'pointerId'>;

  /**
   * @docid
   * @public
   * @type string
   */
  pointerType: PickFromEvent<TNativeEvent, PointerEvent, 'pointerType'>;

  /**
   * @docid
   * @public
   * @type Element
   */
  relatedTarget: PickFromEvent<TNativeEvent, FocusEvent | MouseEvent, 'relatedTarget'>;

  /**
   * @docid
   * @public
   * @type number
   */
  screenX: PickFromEvent<TNativeEvent, MouseEvent, 'screenX'>;

  /**
   * @docid
   * @public
   * @type number
   */
  screenY: PickFromEvent<TNativeEvent, MouseEvent, 'screenY'>;

  /**
   * @docid
   * @public
   * @type boolean
   */
  shiftKey: PickFromEvent<TNativeEvent, MouseEvent | KeyboardEvent | TouchEvent, 'shiftKey'>;

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
  targetTouches: PickFromEvent<TNativeEvent, TouchEvent, 'targetTouches'>;

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
  touches: PickFromEvent<TNativeEvent, TouchEvent, 'touches'>;

  /**
   * @docid
   * @public
   */
  type: string;

  /**
   * @docid
   * @public
   * @type object
   */
  view: PickFromEvent<TNativeEvent, UIEvent, 'view'>;

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
export type DxEvent<TNativeEvent extends Event = Event> = ({} extends EventType ? EventObject<TNativeEvent> : EventType) & {
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
