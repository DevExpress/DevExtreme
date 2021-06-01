import {
  DxElement
} from './element';

/** @namespace DevExpress */
export interface ComponentOptions<T = Component> {
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onDisposing?: ((e: { component: T }) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field2 element:DxElement
   * @default null
   * @public
   */
  onInitialized?: ((e: { component?: T, element?: DxElement }) => void);
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
  onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => void);
}
/**
 * @docid
 * @module core/component
 * @export default
 * @namespace DevExpress
 * @hidden
 * @wrappable
 */
export default class Component {
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
   * @param1 eventName:string
   * @return this
   * @public
   */
  off(eventName: string): this;
  /**
   * @docid
   * @publicName off(eventName, eventHandler)
   * @param1 eventName:string
   * @param2 eventHandler:function
   * @return this
   * @public
   */
  off(eventName: string, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(eventName, eventHandler)
   * @param1 eventName:string
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
   * @param1 optionName:string
   * @return any
   * @public
   */
  option(optionName: string): any;
  /**
   * @docid
   * @publicName option(optionName, optionValue)
   * @param1 optionName:string
   * @param2 optionValue:any
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
   * @param1 optionName:string
   * @public
   */
  resetOption(optionName: string): void;

  _options: { silent(path: any, value: any): void };
  _createActionByOption(optionName: string, config: object): Function;
  _dispose(): void;
  _getDefaultOptions(): object;
  _init(): void;
  _initializeComponent(): void;
  _optionChanging(name: string, value: unknown, prevValue: unknown): void;
  _optionChanged(args: { name: string; value: unknown }): void;
  _setOptionsByReference(): void;
  _optionsByReference: object;
  _setDeprecatedOptions(): void;
  _deprecatedOptions: object;
}
