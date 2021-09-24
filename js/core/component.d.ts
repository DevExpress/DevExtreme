import {
  DxElement,
} from './element';

/** @namespace DevExpress */
export interface ComponentOptions<T = Component> {
  /**
   * @docid
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onDisposing?: ((e: { component: T }) => void);
  /**
   * @docid
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onInitialized?: ((e: { component?: T; element?: DxElement }) => void);
  /**
   * @docid
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onOptionChanged?: ((e: { component?: T; name?: string; fullName?: string; value?: any }) => void);
}
/**
 * @docid Component
 * @module core/component
 * @export Component
 * @namespace DevExpress
 * @hidden
 * @wrappable
 */
export class Component {
  constructor(options?: ComponentOptions);
  /**
   * @docid
   * @publicName beginUpdate()
   * @public
   */
  beginUpdate(): void;
  /**
   * @docid
   * @publicName endUpdate()
   * @public
   */
  endUpdate(): void;
  /**
   * @docid
   * @publicName instance()
   * @return this
   * @public
   */
  instance(): this;
  /**
   * @docid
   * @publicName off(eventName)
   * @return this
   * @public
   */
  off(eventName: string): this;
  /**
   * @docid
   * @publicName off(eventName, eventHandler)
   * @param2 eventHandler:function
   * @return this
   * @public
   */
  off(eventName: string, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(eventName, eventHandler)
   * @param2 eventHandler:function
   * @return this
   * @public
   */
  on(eventName: string, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(events)
   * @param1 events:object
   * @return this
   * @public
   */
  on(events: any): this;
  /**
   * @docid
   * @publicName option()
   * @return object
   * @public
   */
  option(): any;
  /**
   * @docid
   * @publicName option(optionName)
   * @public
   */
  option(optionName: string): any;
  /**
   * @docid
   * @publicName option(optionName, optionValue)
   * @public
   */
  option(optionName: string, optionValue: any): void;
  /**
   * @docid
   * @publicName option(options)
   * @param1 options:object
   * @public
   */
  option(options: any): void;
  /**
   * @docid
   * @publicName resetOption(optionName)
   * @public
   */
  resetOption(optionName: string): void;
}
