import { DxElement } from '../../core/element';
import {
  DxEvent,
  EventObject as EventObjectInternal,
} from '../../events/events.types';

export type EventObject = EventObjectInternal;

/**
 * Specifies arguments of `initialized` event.
 */
export type InitializedEventInfo<TComponent> = {
  /**
   * The UI component&apos;s instance.
   */
  readonly component?: TComponent;
  /**
   * The UI component&apos;s container.
   */
  readonly element?: DxElement;
};

/**
 * A type that contains fields common for all events (`component`, `element`, `model`).
 */
export type EventInfo<TComponent> = {
  /**
   * The UI component&apos;s instance.
   */
  readonly component: TComponent;
  /**
   * The UI component&apos;s container.
   */
  readonly element: DxElement;
  /**
   * Model data. Available only if you use Knockout.
   */
  readonly model?: any;
};

/**
 * A type that contains fields common for all events (`component`, `element`, `model`) and the `event` field.
 */
export type NativeEventInfo<TComponent, TNativeEvent = Event> = {
  /**
   * The UI component&apos;s instance.
   */
  readonly component: TComponent;
  /**
   * The UI component&apos;s container.
   */
  readonly element: DxElement;
  /**
   * Model data. Available only if you use Knockout.
   */
  readonly model?: any;
  /**
   * A native browser event with additional fields from `EventObject`.
   */
  readonly event?: DxEvent<TNativeEvent>;
};

/**
 * Specifies arguments of `optionChanged` event.
 */
export type ChangedOptionInfo = {
  /**
   * The modified property if it belongs to the first level. Otherwise, the first-level property into which it is nested.
   */
  readonly name: string;
  /**
   * The path to the modified property that includes all parent properties.
   */
  readonly fullName: string;
  /**
   * The modified property&apos;s new value.
   */
  readonly value?: any;
  /**
   * The UI component&apos;s previous value.
   */
  readonly previousValue?: any;
};

/**
 * Specifies item information used in events related to a component&apos;s items.
 */
export type ItemInfo<TItemData = any> = {
  /**
   * The item&apos;s data.
   */
  readonly itemData?: TItemData;
  /**
   * The item&apos;s container.
   */
  readonly itemElement: DxElement;
  /**
   * The item&apos;s index.
   */
  readonly itemIndex: number;
};

/**
 * A type used in events. Specifies whether the event is cancelable.
 */
export type Cancelable = {
  /**
   * Specifies whether the event is cancelable.
   */
  cancel?: boolean;
};

/**
 * 
 */
export type AsyncCancelable = {
  /**
   * 
   */
  cancel: boolean | PromiseLike<boolean>;
};

/**
 * Detaches all handlers from the specified elements.
 */
export function off(element: Element | Array<Element>): void;

/**
 * Detaches all handlers of the specified event from the specified elements.
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * Detaches an event handler from the specified elements.
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * Detaches all event handlers of the specified type attached using the on(element, eventName, selector, data, handler) or on(element, eventName, selector, handler) method.
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * Detaches the specified event handler attached using the on(element, eventName, selector, data, handler) or on(element, eventName, selector, handler) method.
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * Attaches an event handler to the specified elements. Allows you to pass custom data to the handler.
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * Attaches an event handler to the specified elements.
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * Attaches an event handler to the specified elements&apos; descendants. Allows you to pass custom data to the handler.
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * Attaches an event handler to the specified elements&apos; descendants.
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements. Allows you to pass custom data to the handler.
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements.
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements&apos; descendants. Allows you to pass custom data to the handler.
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements&apos; descendants.
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * Triggers an event for the specified elements.
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * Triggers an event for the specified elements. Allows you to pass custom parameters to event handlers.
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;
