/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ComponentOptions<TDisposingEvent, TInitializedEvent, TOptionChangedEvent> {
  /**
   * A function that is executed before the UI component is disposed of.
   */
  onDisposing?: ((e: TDisposingEvent) => void);
  /**
   * A function used in JavaScript frameworks to save the UI component instance.
   */
  onInitialized?: ((e: TInitializedEvent) => void);
  /**
   * A function that is executed after a UI component property is changed.
   */
  onOptionChanged?: ((e: TOptionChangedEvent) => void);
}
/**
 * A base class for all components and UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export class Component<TProperties> {
  constructor(options?: TProperties);
  /**
   * Postpones rendering that can negatively affect performance until the endUpdate() method is called.
   */
  beginUpdate(): void;
  /**
   * Refreshes the UI component after a call of the beginUpdate() method.
   */
  endUpdate(): void;
  /**
   * Gets the UI component&apos;s instance. Use it to access other methods of the UI component.
   */
  instance(): this;
  /**
   * Detaches all event handlers from a single event.
   */
  off(eventName: string): this;
  /**
   * Detaches a particular event handler from a single event.
   */
  off(eventName: string, eventHandler: Function): this;
  /**
   * Subscribes to an event.
   */
  on(eventName: string, eventHandler: Function): this;
  /**
   * Subscribes to events.
   */
  on(events: { [key: string]: Function }): this;
  /**
   * Gets all UI component properties.
   */
  option(): TProperties;
  /**
    * Gets the value of a single property.
    */
   option<TPropertyName extends string>(optionName: TPropertyName): TPropertyName extends (keyof TProperties) ? TProperties[TPropertyName] : unknown;
  /**
    * Updates the value of a single property.
    */
   option<TPropertyName extends string>(optionName: TPropertyName, optionValue: TPropertyName extends keyof TProperties ? TProperties[TPropertyName] : unknown): void;
  /**
    * Updates the values of several properties.
    */
   option(options: Partial<TProperties>): void;
  /**
   * Resets a property to its default value.
   */
  resetOption(optionName: string): void;
}
