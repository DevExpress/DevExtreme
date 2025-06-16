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
   */
  button: PickFromEvent<TNativeEvent, MouseEvent, 'button'>;

  /**
   * @docid
   * @public
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
   */
  charCode: PickFromEvent<TNativeEvent, KeyboardEvent, 'charCode'>;

  /**
   * @docid
   * @public
   */
  clientX: PickFromEvent<TNativeEvent, MouseEvent, 'clientX'>;

  /**
   * @docid
   * @public
   */
  clientY: PickFromEvent<TNativeEvent, MouseEvent, 'clientY'>;

  /**
   * @docid
   * @public
   */
  code: PickFromEvent<TNativeEvent, KeyboardEvent, 'code'>;

  /**
   * @docid
   * @public
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
   */
  key: PickFromEvent<TNativeEvent, KeyboardEvent, 'key'>;

  /**
   * @docid
   * @public
   */
  keyCode: PickFromEvent<TNativeEvent, KeyboardEvent, 'keyCode'>;

  /**
   * @docid
   * @public
   */
  metaKey: PickFromEvent<TNativeEvent, KeyboardEvent | TouchEvent | MouseEvent, 'metaKey'>;

  /**
   * @docid
   * @public
   */
  offsetX: PickFromEvent<TNativeEvent, MouseEvent, 'offsetX'>;

  /**
   * @docid
   * @public
   */
  offsetY: PickFromEvent<TNativeEvent, MouseEvent, 'offsetY'>;

  /**
   * @docid
   * @public
   */
  pageX: PickFromEvent<TNativeEvent, MouseEvent, 'pageX'>;

  /**
   * @docid
   * @public
   */
  pageY: PickFromEvent<TNativeEvent, MouseEvent, 'pageY'>;

  /**
   * @docid
   * @public
   */
  pointerId: PickFromEvent<TNativeEvent, PointerEvent, 'pointerId'>;

  /**
   * @docid
   * @public
   */
  pointerType: PickFromEvent<TNativeEvent, PointerEvent, 'pointerType'>;

  /**
   * @docid
   * @public
   */
  relatedTarget: PickFromEvent<TNativeEvent, FocusEvent | MouseEvent, 'relatedTarget'>;

  /**
   * @docid
   * @public
   */
  screenX: PickFromEvent<TNativeEvent, MouseEvent, 'screenX'>;

  /**
   * @docid
   * @public
   */
  screenY: PickFromEvent<TNativeEvent, MouseEvent, 'screenY'>;

  /**
   * @docid
   * @public
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
