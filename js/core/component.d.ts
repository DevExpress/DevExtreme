import {
  TElement
} from './element';

export interface ComponentOptions<T = Component> {
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @prevFileNamespace DevExpress.core
   * @public
   */
  onDisposing?: ((e: { component?: T }) => any);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field2 element:dxElement
   * @default null
   * @action
   * @prevFileNamespace DevExpress.core
   * @public
   */
  onInitialized?: ((e: { component?: T, element?: TElement }) => any);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field4 name:string
   * @type_function_param1_field5 fullName:string
   * @type_function_param1_field6 value:any
   * @default null
   * @action
   * @prevFileNamespace DevExpress.core
   * @public
   */
  onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => any);
}
/**
* @docid
* @module core/component
* @export default
* @namespace DevExpress
* @hidden
* @wrappable
* @prevFileNamespace DevExpress.core
*/
export default class Component {
  constructor(options?: ComponentOptions);
  /**
   * @docid
   * @publicName beginUpdate()
   * @prevFileNamespace DevExpress.core
   * @public
   */
  beginUpdate(): void;
  /**
   * @docid
   * @publicName endUpdate()
   * @prevFileNamespace DevExpress.core
   * @public
   */
  endUpdate(): void;
  /**
   * @docid
   * @publicName instance()
   * @return this
   * @prevFileNamespace DevExpress.core
   * @public
   */
  instance(): this;
  /**
   * @docid
   * @publicName off(eventName)
   * @param1 eventName:string
   * @return this
   * @prevFileNamespace DevExpress.core
   * @public
   */
  off(eventName: string): this;
  /**
   * @docid
   * @publicName off(eventName, eventHandler)
   * @param1 eventName:string
   * @param2 eventHandler:function
   * @return this
   * @prevFileNamespace DevExpress.core
   * @public
   */
  off(eventName: string, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(eventName, eventHandler)
   * @param1 eventName:string
   * @param2 eventHandler:function
   * @return this
   * @prevFileNamespace DevExpress.core
   * @public
   */
  on(eventName: string, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(events)
   * @param1 events:object
   * @return this
   * @prevFileNamespace DevExpress.core
   * @public
   */
  on(events: any): this;
  /**
   * @docid
   * @publicName option()
   * @return object
   * @prevFileNamespace DevExpress.core
   * @public
   */
  option(): any;
  /**
   * @docid
   * @publicName option(optionName)
   * @param1 optionName:string
   * @return any
   * @prevFileNamespace DevExpress.core
   * @public
   */
  option(optionName: string): any;
  /**
   * @docid
   * @publicName option(optionName, optionValue)
   * @param1 optionName:string
   * @param2 optionValue:any
   * @prevFileNamespace DevExpress.core
   * @public
   */
  option(optionName: string, optionValue: any): void;
  /**
   * @docid
   * @publicName option(options)
   * @param1 options:object
   * @prevFileNamespace DevExpress.core
   * @public
   */
  option(options: any): void;
  /**
   * @docid
   * @publicName resetOption(optionName)
   * @param1 optionName:string
   * @prevFileNamespace DevExpress.core
   * @public
   */
  resetOption(optionName: string): void;

  _createActionByOption(optionName: string, config: object): Function;
  _dispose(): void;
  _getDefaultOptions(): object;
  _init(): void;
  _optionChanged(args: { name: string; value: unknown }): void;
}
