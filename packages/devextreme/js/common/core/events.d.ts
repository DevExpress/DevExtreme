import { DxElement } from '../../core/element';
import {
  DxEvent,
  EventObject as EventObjectInternal,
} from '../../events/events.types';

/**
 * @section commonObjectStructures
 * @public
 * @namespace DevExpress.common.core.events
 */
export type EventObject = EventObjectInternal;

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type InitializedEventInfo<TComponent> = {
  /**
   * @docid
   * @type this
   */
  readonly component?: TComponent;
  /** @docid */
  readonly element?: DxElement;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type EventInfo<TComponent> = {
  /**
   * @docid
   * @type this
   */
  readonly component: TComponent;
  /** @docid */
  readonly element: DxElement;
  /**
   * @docid
   * @hidden
   */
  readonly model?: any;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type NativeEventInfo<TComponent, TNativeEvent = Event> = {
  /**
   * @docid
   * @type this
   */
  readonly component: TComponent;
  /** @docid */
  readonly element: DxElement;
  /**
   * @docid
   * @hidden
   */
  readonly model?: any;
  /**
   * @docid
   * @type event
   */
  readonly event?: DxEvent<TNativeEvent>;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type ChangedOptionInfo = {
  /** @docid */
  readonly name: string;
  /** @docid */
  readonly fullName: string;
  /** @docid */
  readonly value?: any;
  /** @docid */
  readonly previousValue?: any;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type ItemInfo<TItemData = any> = {
  /**
   * @docid
   * @type object
   */
  readonly itemData?: TItemData;
  /** @docid */
  readonly itemElement: DxElement;
  /** @docid */
  readonly itemIndex: number;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type Cancelable = {
  /** @docid */
  cancel?: boolean;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.core.events
 */
export type AsyncCancelable = {
  /**
   * @docid
   * @type boolean|Promise<boolean>
   */
  cancel: boolean | PromiseLike<boolean>;
};

/**
 * @docid eventsMethods.off
 * @publicName off(element)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function off(element: Element | Array<Element>): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, handler)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector, handler)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, data, handler)
 * @namespace DevExpress.common.core.events
 * @param3 data:object
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, handler)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, data, handler)
 * @namespace DevExpress.common.core.events
 * @param4 data:object
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, handler)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, data, handler)
 * @namespace DevExpress.common.core.events
 * @param3 data:object
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, handler)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, data, handler)
 * @namespace DevExpress.common.core.events
 * @param4 data:object
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, handler)
 * @namespace DevExpress.common.core.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event)
 * @namespace DevExpress.common.core.events
 * @param2 event:string|event
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event, extraParameters)
 * @namespace DevExpress.common.core.events
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;
