/** @namespace DevExpress */
export interface ComponentOptions<TDisposingEventArg, TInitializedEventArg, TOptionChangedEventArg> {
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onDisposing?: ((e: TDisposingEventArg) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field2 element:DxElement
   * @default null
   * @action
   * @public
   */
  onInitialized?: ((e: TInitializedEventArg) => void);
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
  onOptionChanged?: ((e: TOptionChangedEventArg) => void);
}
/**
 * @docid Component
 * @module core/component
 * @export Component
 * @namespace DevExpress
 * @hidden
 * @wrappable
 */
export class Component<TProperties> {
  constructor(options?: TProperties);
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
   * @return this
   * @public
   */
  on(events: { [key: string]: Function }): this;
  /**
   * @docid
   * @publicName option()
   * @return object
   * @public
   */
  option(): TProperties;
  /**
   * @docid
   * @publicName option(optionName)
   * @param1 optionName:string
   * @public
   */
   option<TPropertyName extends string, TValue = unknown>(optionName: TPropertyName): TPropertyName extends (keyof TProperties) ? TProperties[TPropertyName] : TValue;
  /**
   * @docid
   * @publicName option(optionName, optionValue)
   * @param1 optionName:string
   * @public
   */
   option<TPropertyName extends string, TValue = unknown>(optionName: TPropertyName, optionValue: TPropertyName extends keyof TProperties ? TProperties[TPropertyName] : TValue): void;
  /**
   * @docid
   * @publicName option(options)
   * @param1 options:object
   * @public
   */
   option(options: Partial<TProperties>): void;
  /**
   * @docid
   * @publicName resetOption(optionName)
   * @public
   */
  resetOption(optionName: string): void;
}
