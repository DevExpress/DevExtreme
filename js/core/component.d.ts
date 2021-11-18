import {
  DxElement,
} from './element';

/** @namespace DevExpress */
export interface ComponentOptions<TComponent> {
  /**
   * @docid
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onDisposing?: ((e: { component: TComponent }) => void);
  /**
   * @docid
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onInitialized?: ((e: { component?: TComponent; element?: DxElement }) => void);
  /**
   * @docid
   * @type_function_param1_field1 component:this
   * @default null
   * @action
   * @public
   */
  onOptionChanged?: ((e: { component?: TComponent; name?: string; fullName?: string; value?: any }) => void);
}
/**
 * @docid Component
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
   option<TPropertyName extends string>(optionName: TPropertyName): TPropertyName extends (keyof TProperties) ? TProperties[TPropertyName] : unknown;
  /**
   * @docid
   * @publicName option(optionName, optionValue)
   * @param1 optionName:string
   * @public
   */
   option<TPropertyName extends string>(optionName: TPropertyName, optionValue: TPropertyName extends keyof TProperties ? TProperties[TPropertyName] : unknown): void;
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
