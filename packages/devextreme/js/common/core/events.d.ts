import { DxElement } from '../../core/element';
import { DxEvent } from '../../events/events.types';
import { EventObject } from './events.types';

/**
 * @docid
 * @public
 */
export interface InitializedEventInfo<TComponent> {
  /**
   * @docid
   * @type this
   */
  readonly component?: TComponent;
  /** @docid */
  readonly element?: DxElement;
}

/**
 * @docid
 * @public
 */
export interface EventInfo<TComponent> {
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
}

/**
* @docid
* @public
*/
export interface NativeEventInfo<TComponent, TNativeEvent = Event> {
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
}

/**
 * @docid
 * @public
 */
export interface ChangedOptionInfo {
  /** @docid */
  readonly name: string;
  /** @docid */
  readonly fullName: string;
  /** @docid */
  readonly value?: any;
  /** @docid */
  readonly previousValue?: any;
}

/**
* @docid
* @public
*/
export interface ItemInfo<TItemData = any> {
  /**
   * @docid
   * @type object
   */
  readonly itemData?: TItemData;
  /** @docid */
  readonly itemElement: DxElement;
  /** @docid */
  readonly itemIndex: number;
}

/**
 * @docid
 * @public
 */
export interface Cancelable {
  /** @docid */
  cancel?: boolean;
}

/**
* @docid
* @public
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
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, handler)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * @docid eventsMethods.off
 * @publicName off(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @public
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param3 data:object
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, handler)
 * @namespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param4 data:object
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.on
 * @publicName on(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @public
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, data, handler)
 * @namespace DevExpress.events
 * @param3 data:object
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, handler)
 * @namespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, data, handler)
 * @namespace DevExpress.events
 * @param4 data:object
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * @docid eventsMethods.one
 * @publicName one(element, eventName, selector, handler)
 * @namespace DevExpress.events
 * @public
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event)
 * @namespace DevExpress.events
 * @param2 event:string|event
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * @docid eventsMethods.trigger
 * @publicName trigger(element, event, extraParameters)
 * @namespace DevExpress.events
 * @param2 event:string|event
 * @param3 extraParameters:object
 * @public
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;

export {
  EventObject,
};
