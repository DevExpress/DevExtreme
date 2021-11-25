/** @namespace DevExpress */
export interface ComponentOptions<TDisposingEvent = any, TInitializedEvent = any, TOptionChangedEvent = any> {
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onDisposing?: ((e: TDisposingEvent) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field2 element:DxElement
   * @default null
   * @action
   * @public
   */
  onInitialized?: ((e: TInitializedEvent) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field2 name:string
   * @type_function_param1_field3 fullName:string
   * @type_function_param1_field4 value:any
   * @default null
   * @action
   * @public
   */
  onOptionChanged?: ((e: TOptionChangedEvent) => void);
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
   * @return this
   * @public
   */
  off(eventName: string, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(eventName, eventHandler)
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
