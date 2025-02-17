/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type EventObject = {
  /**
   * The DOM element within the current event propagation stage.
   */
  currentTarget: Element;

  /**
   * Data passed to the event handler.
   */
  data: any;

  /**
   * The DOM element to which the currently-called event handler was attached.
   */
  delegateTarget: Element;

  /**
   * The DOM element that initiated the event.
   */
  target: Element;
  /**
   * Checks if the preventDefault() method was called on this event object.
   */
  isDefaultPrevented(): boolean;
  /**
   * Checks if the stopImmediatePropagation() method was called on this event object.
   */
  isImmediatePropagationStopped(): boolean;
  /**
   * Checks if the stopPropagation() method was called on this event object.
   */
  isPropagationStopped(): boolean;
  /**
   * Prevents the event&apos;s default action from triggering.
   */
  preventDefault(): void;
  /**
   * Stops the event&apos;s propagation up the DOM tree, preventing the rest of the handlers from being executed.
   */
  stopImmediatePropagation(): void;
  /**
   * Stops the event&apos;s propagation up the DOM tree, keeping parent handlers unnotified of the event.
   */
  stopPropagation(): void;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function eventsHandler(event: DxEvent, extraParameters: any): boolean;

/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface EventExtension { }
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface EventType { }
/* eslint-enable @typescript-eslint/no-empty-interface */

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DxEvent<TNativeEvent = Event> = {} extends EventType ? (EventObject & TNativeEvent) : EventType;

/**
 * @deprecated EventObject
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxEvent = EventObject;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type event = DxEvent;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function triggerHandler(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function triggerHandler(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;
