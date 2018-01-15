/// <reference path="../vendor/jquery.d.ts" />

declare module DevExpress {

    /** Specifies settings that affect all DevExtreme widgets. */
    export interface GlobalConfguration {
        /** Specifies whether the widgets support a right-to-left representation. */
        rtlEnabled?: boolean;

        /** Specifies the default currency the widgets use. */
        defaultCurrency?: String;

        /** The decimal separator that is used when submitting a value to the server. */
        serverDecimalSeparator?: String;

        /** A decimal separator. Applies only if you do not use the Globalize or Intl library. */
        decimalSeparator?: String;

        /** A group separator. Applies only if you do not use the Globalize or Intl library. */
        thousandsSeparator?: String;

        /** Specifies whether dates are parsed and serialized according to the ISO 8601 standard in all browsers. */
        forceIsoDateParsing?: boolean;

        /** Specifies whether DevExtreme widgets use jQuery. */
        useJQuery?: boolean;
    }

    /** Formats values. */
    export interface Format {
        /** Specifies a predefined format. Does not apply if you have specified the formatter function. */
        type?: String;

        /** Specifies the currency code for the 'currency' format. */
        currency?: String;

        /** Specifies a precision for values of a numeric format. */
        precision?: number;

        /** Parses string values into numeric or date-time values. Always used with formatter. */
        parser?: (value: any) => any;

        /** Specifies a custom format. */
        formatter?: (value: any) => any;
    }

    /** A mixin that provides a capability to fire and subscribe to events. */
    export interface EventsMixin<T> {
        /** Subscribes to a specified event. */
        on(eventName: string, eventHandler: Function): T;

        /** Subscribes to the specified events. */
        on(events: { [eventName: string]: Function; }): T;

        /** Detaches all event handlers from the specified event. */
        off(eventName: string): Object;

        /** Detaches a particular event handler from the specified event. */
        off(eventName: string, eventHandler: Function): T;
    }

    /** An object that serves as a namespace for the methods required to perform validation. */
    export module validationEngine {
        export interface IValidator {
            validate(): ValidatorValidationResult;
            reset(): void;
        }
        
        export interface ValidatorValidationResult {
            isValid: boolean;
            name?: string;
            value: any;
            brokenRule: any;
            validationRules: any[];
        }

        export interface ValidationGroupValidationResult {
            isValid: boolean;
            brokenRules: any[];
            validators: IValidator[];
        }

        export interface GroupConfig extends EventsMixin<GroupConfig>  {
            group: any;
            validators: IValidator[];
            validate(): ValidationGroupValidationResult;
            reset(): void;
        }

        /** Provides access to the object that represents the specified validation group. */
        export function getGroupConfig(group: any): GroupConfig
        /** Provides access to the object that represents the default validation group. */
        export function getGroupConfig(): GroupConfig

        /** Validates rules of the validators that belong to the specified validation group. */
        export function validateGroup(group: any): ValidationGroupValidationResult;

        /** Validates rules of the validators that belong to the default validation group. */
        export function validateGroup(): ValidationGroupValidationResult;

        /** Resets the values and validation result of the editors that belong to the specified validation group. */
        export function resetGroup(group: any): void;

        /** Resets the values and validation result of the editors that belong to the default validation group. */
        export function resetGroup(): void;

        /** Validates the rules that are defined within the dxValidator objects that are registered for the specified ViewModel. */
        export function validateModel(model: Object): ValidationGroupValidationResult;

        /** Registers all the Validator objects extending fields of the specified ViewModel. */
        export function registerModelForValidation(model: Object): void;

        /** Unregisters all the Validator objects extending fields of the specified ViewModel. */
        export function unregisterModelForValidation(model: Object): void;
    }

    export var hardwareBackButton: JQueryCallback;

    /** Processes the hardware back button click. */
    export function processHardwareBackButton(): void;

    /** Hides the last displayed overlay widget. */
    export function hideTopOverlay(): boolean;

    /**
 * Specifies whether or not the entire application/site supports right-to-left representation.
 * @deprecated Use the config(config) method instead.
 */
    export var rtlEnabled: boolean;

    /** Gets the current global configuration object. */
    export function config(): Object;

    /** Sets the global configuration object. */
    export function config(config: GlobalConfguration): void;

    /** Registers a new component in the DevExpress.ui namespace. */
    export function registerComponent(name: string, componentClass: Object): void;

    /** Registers a new component in the specified namespace. */
    export function registerComponent(name: string, namespace: Object, componentClass: Object): void;

    
    export function requestAnimationFrame(callback: Function): number;

    
    export function cancelAnimationFrame(requestID: number): void;

    /** Custom Knockout binding that links an HTML element with a specific action. */
    export class Action { }

    /** An object used to manage OData endpoints in your application. */
    export class EndpointSelector {
        constructor(options: {
            [key: string]: {
                local?: string;
                production?: string;
            }
        });

        /** Returns an endpoint for the specified key. */
        urlFor(key: string): string;
    }

    /** An object that serves as a namespace for the methods that are used to animate UI elements. */
    export module fx {

        /** Defines animation options. */
        export interface AnimationOptions {
            /** A function called after animation is completed. */
            complete?: (element: JQuery, config: AnimationOptions) => void;

            /** A number specifying wait time before animation execution. */
            delay?: number;

            /** A number specifying the time period to wait before the animation of the next stagger item starts. */
            staggerDelay?: number;

            /** A number specifying the time in milliseconds spent on animation. */
            duration?: number;

            /** A string specifying the easing function for animation. */
            easing?: string;

            /** Specifies the initial animation state. */
            from?: any;

            /** A function called before animation is started. */
            start?: (element: JQuery, config: AnimationOptions) => void;

            /** Specifies a final animation state. */
            to?: any;

            /** A string value specifying the animation type. */
            type?: string;

            /** Specifies the animation direction for the "slideIn" and "slideOut" animation types. */
            direction?: string;
        }

        /** Animates the specified element. */
        export function animate(element: HTMLElement, config: AnimationOptions): JQueryPromise<void>;

        /** Returns a value indicating whether the specified element is being animated. */
        export function isAnimating(element: HTMLElement): boolean;

        /** Stops the animation. */
        export function stop(element: HTMLElement, jumpToEnd: boolean): void;
    }

    /** The manager that performs several specified animations at a time. */
    export class TransitionExecutor {
        /** Deletes all the animations registered in the Transition Executor by using the enter(elements, animation) and leave(elements, animation) methods. */
        reset(): void;
        /** Registers a set of elements that should be animated as "entering" using the specified animation configuration. */
        enter(elements: JQuery, animation: any): void;
        /** Registers a set of elements that should be animated as "leaving" using the specified animation configuration. */
        leave(elements: JQuery, animation: any): void;
        /** Starts all the animations registered using the enter(elements, animation) and leave(elements, animation) methods beforehand. */
        start(config: Object): JQueryPromise<void>;
        /** Stops all started animations. */
        stop(): void;
    }

    export class AnimationPresetCollection {
        /** Resets all the changes made in the animation repository. */
        resetToDefaults(): void;
        /** Deletes the specified animation or clears all the animation repository, if an animation name is not passed. */
        clear(name: string): void;
        /** Adds the specified animation preset to the animation repository by the specified name. */
        registerPreset(name: string, config: any): void;
        /** Applies the changes made in the animation repository. */
        applyChanges(): void;
        /** Returns the configuration of the animation found in the animation repository by the specified name for the current device. */
        getPreset(name: string): void;
        /** Registers predefined animations in the animation repository. */
        registerDefaultPresets(): void;
    }

    /** A repository of animations. */
    export var animationPresets: AnimationPresetCollection;

    /** The device object defines the device on which the application is running. */
    export interface Device {
        /** Indicates whether or not the device platform is Android. */
        android?: boolean;

        /** Specifies the type of the device on which the application is running. */
        deviceType?: string;

        /** Indicates whether or not the device platform is generic, which means that the application will look and behave according to a generic "light" or "dark" theme. */
        generic?: boolean;

        /** Indicates whether or not the device platform is iOS. */
        ios?: boolean;

        /** Indicates whether or not the device type is 'phone'. */
        phone?: boolean;

        /** Specifies the platform of the device on which the application is running. */
        platform?: string;

        /** Indicates whether or not the device type is 'tablet'. */
        tablet?: boolean;

        /** Specifies an array with the major and minor versions of the device platform. */
        version?: Array<number>;

        /** Indicates whether or not the device platform is Windows. */
        win?: boolean;

        /** Specifies a performance grade of the current device. */
        grade?: string;
    }


    /** An object that serves as a namespace for the methods and events specifying information on the current device. */
    export class Devices implements EventsMixin<Devices> {
        
        constructor(options: { window: Window });

        /** Overrides actual device information to force the application to operate as if it was running on a specified device. */
        current(deviceName: any): void;

        /** Returns information about the current device. */
        current(): Device;

        
        orientationChanged: JQueryCallback;

        /** Returns the current device orientation. */
        orientation(): string;

        /** Returns real information about the current device regardless of the value passed to the devices.current(deviceName) method. */
        real(): Device;

        on(eventName: "orientationChanged", eventHandler: (e: { orientation: string }) => void): Devices;
        on(eventName: string, eventHandler: Function): Devices;

        on(events: { [eventName: string]: Function; }): Devices;

        off(eventName: "orientationChanged"): Devices;
        off(eventName: string): Devices;

        off(eventName: "orientationChanged", eventHandler: (e: { orientation: string }) => void): Devices;
        off(eventName: string, eventHandler: Function): Devices;
    }

    
    export var devices: Devices;

    /** The position object specifies the widget positioning options. */
    export interface PositionOptions {

        /** The target element position that the widget is positioned against. */
        at?: any;

        /** The element within which the widget is positioned. */
        boundary?: any;

        /** Specifies the horizontal and vertical offset from the window's boundaries. */
        boundaryOffset?: any;

        /** Specifies how to move the widget if it overflows the screen. */
        collision?: any;

        /** The position of the widget to align against the target element. */
        my?: any;

        /** The target element that the widget is positioned against. */
        of?: any;

        /** Specifies horizontal and vertical offset in pixels. */
        offset?: any;
    }

    export interface ComponentOptions {
        /** A handler for the initialized event. Executed only once, after the widget is initialized. */
        onInitialized?: Function;

        /** A handler for the optionChanged event. Executed after an option of the widget is changed. */
        onOptionChanged?: Function;

        /** A handler for the disposing event. Executed when the widget is removed from the DOM using the remove(), empty(), or html() jQuery methods only. */
        onDisposing?: Function;
    }

    /** A base class for all components and widgets. */
    export class Component implements EventsMixin<Component> {
        
        constructor(options?: ComponentOptions)

        /** Prevents the widget from refreshing until the endUpdate() method is called. */
        beginUpdate(): void;

        /** Refreshes the widget after a call of the beginUpdate() method. */
        endUpdate(): void;

        /** Returns this widget's instance. Use it to access other methods of the widget. */
        instance(): Component;

        /** Gets the widget's options. */
        option(): {
            [optionKey: string]: any;
        };

        /** Sets one or more options. */
        option(options: {
            [optionKey: string]: any;
        }): void;

        /** Gets a specific option value. */
        option(optionName: string): any;

        /** Assigns a new value to a specific option. */
        option(optionName: string, optionValue: any): void;

        on(eventName: string, eventHandler: Function): Component;
        on(events: { [eventName: string]: Function; }): Component;

        off(eventName: string): Component;
        off(eventName: string, eventHandler: Function): Component;
    }

    export interface DOMComponentOptionsBase extends ComponentOptions {
        
        

        /** Switches the widget to a right-to-left representation. */
        rtlEnabled?: boolean;

        /** Specifies the attributes to be attached to the widget's root element. */
        elementAttr?: Object;

        /** A bag for holding any options that require two-way binding (Angular approach specific) */
        bindingOptions?: { [key: string]: any; };
    }

    export interface DOMComponentOptions extends DOMComponentOptionsBase {
        /** Specifies the widget's height. */
        height?: any;

        /** Specifies the widget's width. */
        width?: any;
    }

    /** A base class for all components. */
    export class DOMComponent extends Component {
        
        constructor(element: JQuery, options?: DOMComponentOptions);
        constructor(element: HTMLElement, options?: DOMComponentOptions);

        /** Gets the root element of the widget. */
        element(): JQuery;

        /** Removes the widget from the DOM. */
        dispose(): void;

        /** Specifies the device-dependent default configuration options for this component. */
        static defaultOptions(rule: {
            device?: any;
            options?: any;
        }): void;

        /** Gets the widget's instance using a DOM element. */
        static getInstance(element: JQuery): DOMComponent;
    }

    export module data {
        export interface ODataError extends Error {
            httpStatus?: number;
            errorDetails?: any;
        }

        export interface StoreOptions {
            /** A handler for the modified event. */
            onModified?: () => void;

            /** A handler for the modifying event. */
            onModifying?: () => void;

            /** A handler for the removed event. */
            onRemoved?: (key: any) => void;

            /** A handler for the removing event. */
            onRemoving?: (key: any) => void;

            /** A handler for the updated event. */
            onUpdated?: (key: any, values: Object) => void;

            /** A handler for the updating event. */
            onUpdating?: (key: any, values: Object) => void;

            /** A handler for the loaded event. */
            onLoaded?: (result: Array<any>) => void;

            /** A handler for the loading event. */
            onLoading?: (loadOptions: LoadOptions) => void;

            /** A handler for the inserted event. */
            onInserted?: (values: Object, key: any) => void;

            /** A handler for the inserting event. */
            onInserting?: (values: Object) => void;

            /** Specifies the function called when the Store causes an error. */
            errorHandler?: (e: Error) => void;

            /** Specifies the key properties within the data associated with the Store. */
            key?: any;
        }

        /** This section describes the loadOptions object's fields. */
        export interface LoadOptions {
            /** The current search value. */
            searchValue?: any;
            /** A data field or an expression whose value is compared to the search value. */
            searchExpr?: any;
            /** A comparison operation. One of the following: "=", "<>", ">", ">=", "<", "<=", "startswith", "endswith", "contains", "notcontains", "isblank" and "isnotblank". */
            searchOperation?: string;
            /** A filter expression. */
            filter?: Object;
            /** A sort expression. */
            sort?: Object;
            /** A select expression. */
            select?: Object;
            /** An array of strings that represent the names of navigation properties to be loaded simultaneously with the ODataStore. */
            expand?: Object;
            /** A group expression. */
            group?: Object;
            /** The number of data objects to be skipped from the result set's start. In conjunction with take, used to implement paging. */
            skip?: number;
            /** The number of data objects to be loaded. In conjunction with skip, used to implement paging. */
            take?: number;
            /** An object for storing additional settings that should be sent to the server. */
            userData?: Object;
            /** Indicates whether the total count of data objects is needed. */
            requireTotalCount?: boolean;
            
            customQueryParams?: Object;
        }

        export interface DataGridLoadOptions extends LoadOptions {
            
            totalSummary?: Object;
            
            groupSummary?: Object;
            
            requireGroupCount?: boolean;
        }

        export interface PivotGridLoadOptions extends LoadOptions {
            totalSummary?: Object;
            groupSummary?: Object;
        }

        /** The base class for all Stores. */
        export class Store implements EventsMixin<Store> {
            constructor(options?: StoreOptions);

            /** Returns the data item specified by the key. */
            byKey(key: any): JQueryPromise<any>;

            /** Adds an item to the data associated with this Store. */
            insert(values: Object): JQueryPromise<any>;

            /** Returns the key expression specified via the key configuration option. */
            key(): any;

            /** Returns the key of the Store item that matches the specified object. */
            keyOf(obj: Object): any;

            /** Starts loading data. */
            load(): JQueryPromise<any[]>;

            /** Starts loading data. */
            load(options?: LoadOptions): JQueryPromise<any[]>;

            /** Removes the data item specified by the key. */
            remove(key: any): JQueryPromise<any>;

            /** Obtains the total count of items that will be returned by the load() function. */
            totalCount(options?: {
                filter?: Object;
                group?: Object;
            }): JQueryPromise<any>;

            /** Updates the data item specified by the key. */
            update(key: any, values: Object): JQueryPromise<any>;

            on(eventName: "removing", eventHandler: (key: any) => void): Store;
            on(eventName: "removed", eventHandler: (key: any) => void): Store;
            on(eventName: "updating", eventHandler: (key: any, values: Object) => void): Store;
            on(eventName: "updated", eventHandler: (key: any, values: Object) => void): Store;
            on(eventName: "inserting", eventHandler: (values: Object) => void): Store;
            on(eventName: "inserted", eventHandler: (values: Object, key: any) => void): Store;
            on(eventName: "modifying", eventHandler: () => void): Store;
            on(eventName: "modified", eventHandler: () => void): Store;
            on(eventName: "loading", eventHandler: (loadOptions: LoadOptions) => void): Store;
            on(eventName: "loaded", eventHandler: (result: Array<any>) => void): Store;
            on(eventName: string, eventHandler: Function): Store;

            on(events: { [eventName: string]: Function; }): Store;

            off(eventName: "removing"): Store;
            off(eventName: "removed"): Store;
            off(eventName: "updating"): Store;
            off(eventName: "updated"): Store;
            off(eventName: "inserting"): Store;
            off(eventName: "inserted"): Store;
            off(eventName: "modifying"): Store;
            off(eventName: "modified"): Store;
            off(eventName: "loading"): Store;
            off(eventName: "loaded"): Store;
            off(eventName: string): Store;

            off(eventName: "removing", eventHandler: (key: any) => void): Store;
            off(eventName: "removed", eventHandler: (key: any) => void): Store;
            off(eventName: "updating", eventHandler: (key: any, values: Object) => void): Store;
            off(eventName: "updated", eventHandler: (key: any, values: Object) => void): Store;
            off(eventName: "inserting", eventHandler: (values: Object) => void): Store;
            off(eventName: "inserted", eventHandler: (values: Object, key: any) => void): Store;
            off(eventName: "modifying", eventHandler: () => void): Store;
            off(eventName: "modified", eventHandler: () => void): Store;
            off(eventName: "loading", eventHandler: (loadOptions: LoadOptions) => void): Store;
            off(eventName: "loaded", eventHandler: (result: Array<any>) => void): Store;
            off(eventName: string, eventHandler: Function): Store;
        }

        export interface ArrayStoreOptions extends StoreOptions {
            /** Specifies the array associated with this Store. */
            data?: Array<any>;
        }

        /** A Store accessing an in-memory array. */
        export class ArrayStore extends Store {
            constructor(options?: ArrayStoreOptions);

            /** Clears all data associated with the current ArrayStore. */
            clear(): void;

            /** Creates the Query object for the underlying array. */
            createQuery(): Query;
        }

        //T184606
        interface Promise {
            then(doneFn?: any, failFn?: any, progressFn?: any): Promise;
        }

        export interface CustomStoreOptions extends StoreOptions {
            /** Specifies whether or not the store combines the search expression with the filter expression. */
            useDefaultSearch?: boolean;

            /** Specifies how data returned by the load function is treated. */
            loadMode?: string;

            /** Specifies whether raw data should be saved in the cache. Applies only if loadMode is "raw". */
            cacheRawData?: boolean;

            /** The user implementation of the byKey(key, extraOptions) method. */
            byKey?: (key: any) => Promise;

            /** The user implementation of the insert(values) method. */
            insert?: (values: Object) => Promise;

            /** The user implementation of the load(options) method. */
            load?: (options?: LoadOptions) => Promise;

            /** The user implementation of the remove(key) method. */
            remove?: (key: any) => Promise;

            /** The user implementation of the totalCount(options) method. */
            totalCount?: (options?: {
                filter?: Object;
                group?: Object;
            }) => Promise;

            /** The user implementation of the update(key, values) method. */
            update?: (key: any, values: Object) => Promise;
        }

        /** A Store object that enables you to implement your own data access logic. */
        export class CustomStore extends Store {
            constructor(options: CustomStoreOptions);

            /** Deletes data from the cache. Takes effect only if the cacheRawData option is true. */
            clearRawDataCache(): void;
        }

        export interface DataSourceOptions {
            

            /** Specifies data filtering conditions. */
            filter?: Object;

            /** Specifies data grouping conditions. */
            group?: Object;

            /** The item mapping function. */
            map?: (record: any) => any;

            /** Specifies the maximum number of items the page can contain. */
            pageSize?: number;

            /** Specifies whether a DataSource loads data by pages, or all items at once. */
            paginate?: boolean;

            /** The data post processing function. */
            postProcess?: (data: any[]) => any[];

            /** Specifies a value by which the required items are searched. */
            searchExpr?: any;

            /** Specifies the comparison operation used to search for the required items. One of "=", "<>", ">", ">=", "<", "<=", "startswith", "endswith", "contains", "notcontains". */
            searchOperation?: string;

            /** Specifies the value to which the search expression is compared. */
            searchValue?: any;

            /** Specifies the initial select option value. */
            select?: Object;

            /** An array of the strings that represent the names of the navigation properties to be loaded simultaneously with the OData store's entity. */
            expand?: Object;

            /** The bag of custom parameters passed to the query executed when the DataSource load operation is invoked. */
            customQueryParams?: Object;

            /** Specifies whether or not the DataSource instance requests the total count of items available in the storage. */
            requireTotalCount?: boolean;

            /** Specifies the initial sort option value. */
            sort?: Object;

            /** Specifies the underlying Store instance used to access data. */
            store?: any;

            /** A handler for the changed event. */
            onChanged?: () => void;

            /** A handler for the loadingChanged event. */
            onLoadingChanged?: (isLoading: boolean) => void;

            /** A handler for the loadError event. */
            onLoadError?: (e?: Error) => void;
        }

        export interface OperationPromise<T> extends JQueryPromise<T> {
            operationId: number;
        }

        /** An object that provides access to a data web service or local data storage for collection container widgets. */
        export class DataSource implements EventsMixin<DataSource> {
            
            constructor(url: string);
            
            constructor(data: Array<any>);
            
            constructor(options: CustomStoreOptions);
            constructor(options: DataSourceOptions);

            /** Disposes all resources associated with this DataSource. */
            dispose(): void;

            /** Returns the current filter option value. */
            filter(): Object;

            /** Sets the filter option value. */
            filter(filterExpr: Object): void;

            /** Returns the current group option value. */
            group(): Object;

            /** Sets the group option value. */
            group(groupExpr: Object): void;

            /** Indicates whether or not the current page contains fewer items than the number of items specified by the pageSize configuration option. */
            isLastPage(): boolean;

            /** Indicates whether or not at least one load() method execution has successfully finished. */
            isLoaded(): boolean;

            /** Indicates whether or not the DataSource is currently being loaded. */
            isLoading(): boolean;

            /** Returns the array of items currently operated by the DataSource. */
            items(): Array<any>;

            /** Returns the key expression specified by the key configuration option of the underlying Store. */
            key(): any;

            /** Starts loading data. */
            load(): OperationPromise<Array<any>>;

            /** Clears currently loaded DataSource items and calls the load() method. */
            reload(): OperationPromise<Array<any>>;

            /** Returns an object that would be passed to the load() method of the underlying Store according to the current data shaping option values of the current DataSource instance. */
            loadOptions(): Object;

            /** Returns the current pageSize option value. */
            pageSize(): number;

            /** Sets the pageSize option value. */
            pageSize(value: number): void;

            /** Specifies the index of the currently loaded page. */
            pageIndex(): number;

            /** Specifies the index of the page to be loaded during the next load() method execution. */
            pageIndex(newIndex: number): void;

            /** Returns the current paginate option value. */
            paginate(): boolean;

            /** Sets the paginate option value. */
            paginate(value: boolean): void;

            /** Returns the searchExpr option value. */
            searchExpr(): any;

            /** Sets the searchExpr option value. */
            searchExpr(...expr: any[]): void;

            /** Returns the currently specified search operation. */
            searchOperation(): string;

            /** Sets the current search operation. */
            searchOperation(op: string): void;

            /** Returns the searchValue option value. */
            searchValue(): any;

            /** Sets the searchValue option value. */
            searchValue(value: any): void;

            /** Returns the current select option value. */
            select(): any;

            /** Sets the select option value. */
            select(expr: any): void;

            /** Returns the current requireTotalCount option value. */
            requireTotalCount(): boolean;

            /** Sets the requireTotalCount option value. */
            requireTotalCount(value: boolean): void;

            /** Returns the current sort option value. */
            sort(): any;

            /** Sets the sort option value. */
            sort(sortExpr: any): void;

            /** Returns the underlying Store instance. */
            store(): Store;

            /** Returns the number of data items available in an underlying Store after the last load() operation without paging. */
            totalCount(): number;

            /** Cancels the load operation associated with the specified identifier. */
            cancel(operationId: number): boolean;

            on(eventName: "loadingChanged", eventHandler: (isLoading: boolean) => void): DataSource;
            on(eventName: "loadError", eventHandler: (e?: Error) => void): DataSource;
            on(eventName: "changed", eventHandler: () => void): DataSource;
            on(eventName: string, eventHandler: Function): DataSource;
            on(events: { [eventName: string]: Function; }): DataSource;

            off(eventName: "loadingChanged"): DataSource;
            off(eventName: "loadError"): DataSource;
            off(eventName: "changed"): DataSource;
            off(eventName: string): DataSource;

            off(eventName: "loadingChanged", eventHandler: (isLoading: boolean) => void): DataSource;
            off(eventName: "loadError", eventHandler: (e?: Error) => void): DataSource;
            off(eventName: "changed", eventHandler: () => void): DataSource;
            off(eventName: string, eventHandler: Function): DataSource;
        }

        /** An object used to work with primitive data types not supported by JavaScript when accessing an OData web service. */
        export class EdmLiteral {
            /** Creates an EdmLiteral instance and assigns the specified value to it. */
            constructor(value: string);

            /** Returns a string representation of the value associated with this EdmLiteral object. */
            valueOf(): string;
        }

        /** An object used to generate and hold the GUID. */
        export class Guid {

            /** Creates a new Guid instance that holds the specified GUID. */
            constructor(value: string);

            /** Creates a new Guid instance holding the generated GUID. */
            constructor();

            /** Returns a string representation of the Guid instance. */
            toString(): string;

            /** Returns a string representation of the Guid instance. */
            valueOf(): string;
        }

        export interface LocalStoreOptions extends ArrayStoreOptions {
            /** Specifies the time (in miliseconds) after the change operation, before the data is flushed. */
            flushInterval?: number;

            /** Specifies whether the data is flushed immediatelly after each change operation, or after the delay specified via the flushInterval option. */
            immediate?: boolean;

            /** The unique identifier used to distinguish the data within the HTML5 Web Storage. */
            name?: string;
        }

        /** A Store providing access to the HTML5 Web Storage. */
        export class LocalStore extends ArrayStore {
            constructor(options?: LocalStoreOptions);

            /** Removes all data associated with this Store. */
            clear(): void;
        }

        export interface ODataContextOptions extends ODataStoreOptions {
            /** Specifies the list of entities to be accessed with the ODataContext. */
            entities?: Object;

            /** Specifies the function called if the ODataContext causes an error. */
            errorHandler?: (e: Error) => void;
        }

        /** Provides access to the entire OData service. */
        export class ODataContext {
            constructor(options?: ODataContextOptions);

            /** Initiates the specified WebGet service operation that returns a value. For the information on service operations, refer to the OData documentation. */
            get(operationName: string, params: Object): JQueryPromise<any>;

            /** Initiates the specified WebGet service operation that returns nothing. For the information on service operations, refer to the OData documentation. */
            invoke(operationName: string, params: Object, httpMethod: Object): JQueryPromise<any>;

            /** Return a special proxy object to describe the entity link. */
            objectLink(entityAlias: string, key: any): Object;
        }

        export interface ODataStoreOptions extends StoreOptions {
            

            /** A function used to customize a web request before it is sent. */
            beforeSend?: (request: {
                url: string;
                async: boolean;
                method: string;
                timeout: number;
                params: Object;
                payload: Object;
                headers: Object;
            }) => void;

            /** Specifies whether the ODataStore uses the JSONP approach to access non-CORS-compatible remote services. */
            jsonp?: boolean;

            /** Specifies the type of the ODataStore key property. The following key types are supported out of the box: String, Int32, Int64, Boolean, Single, Decimal and Guid. */
            keyType?: any;

            /** Specifies the types of data fields. Accepts the following types: "String", "Int32", "Int64", "Boolean", "Single", "Decimal" and "Guid". */
            fieldTypes?: Object;

            /** Specifies whether or not dates in a response are deserialized. */
            deserializeDates?: boolean;

            /** Specifies the URL of the data service being accessed via the current ODataContext. */
            url?: string;

            /** Specifies the version of the OData protocol used to interact with the data service. */
            version?: number;

            /** Specifies the value of the withCredentials field of the underlying jqXHR object. */
            withCredentials?: boolean;
        }

        /** A Store providing access to a separate OData web service entity. */
        export class ODataStore extends Store {
            

            constructor(options?: ODataStoreOptions);

            /** Creates the Query object for the OData endpoint. */
            createQuery(loadOptions: Object): Object;

            /** Returns the data item specified by the key. */
            byKey(key: any, extraOptions?: { expand?: Object }): JQueryPromise<any>;
        }

        /** An universal chainable data query interface object. */
        export interface Query {

            /** Calculates a custom summary for the items in the current Query. */
            aggregate(step: (accumulator: any, value: any) => any): JQueryPromise<any>;

            /** Calculates a custom summary for the items in the current Query. */
            aggregate(seed: any, step: (accumulator: any, value: any) => any, finalize: (result: any) => any): JQueryPromise<any>;

            /** Calculates the average item value for the current Query. */
            avg(getter: Object): JQueryPromise<any>;

            /** Finds the item with the maximum getter value. */
            max(getter: Object): JQueryPromise<any>;

            /** Finds the item with the maximum value in the Query. */
            max(): JQueryPromise<any>;

            /** Finds the item with the minimum value in the Query. */
            min(): JQueryPromise<any>;

            /** Finds the item with the minimum getter value. */
            min(getter: Object): JQueryPromise<any>;

            /** Calculates the average item value for the current Query, if each Query item has a numeric type. */
            avg(): JQueryPromise<any>;

            /** Returns the total count of items in the current Query. */
            count(): JQueryPromise<any>;

            /** Executes the Query. */
            enumerate(): JQueryPromise<any>;

            /** Filters the current Query data. */
            filter(criteria: Array<any>): Query;

            /** Filters the current Query data. */
            filter(predicate: (item: any) => boolean): Query;

            /** Groups the current Query data. */
            groupBy(getter: Object): Query;

            /** Applies the specified transformation to each item. */
            select(getter: Object): Query;

            /** Limits the data item count. */
            slice(skip: number, take?: number): Query;

            /** Sorts current Query data. */
            sortBy(getter: Object, desc: boolean): Query;

            /** Sorts current Query data. */
            sortBy(getter: Object): Query;

            /** Calculates the sum of item getter values in the current Query. */
            sum(getter: Object): JQueryPromise<any>;

            /** Calculates the sum of item values in the current Query. */
            sum(): JQueryPromise<any>;

            /** Adds one more sorting condition to the current Query. */
            thenBy(getter: Object): Query;

            /** Adds one more sorting condition to the current Query. */
            thenBy(getter: Object, desc: boolean): Query;

            /** Returns the array of current Query items. */
            toArray(): Array<any>;
        }

        /** The global data layer error handler. */
        export var errorHandler: (e: Error) => void;

        /** Encodes the specified string or array of bytes to base64 encoding. */
        export function base64_encode(input: any): string;

        /** Creates a Query instance. */
        export function query(array: Array<any>): Query;

        /** Creates a Query instance for accessing the remote service specified by a URL. */
        export function query(url: string, queryOptions: Object): Query;

        /** This section describes the utility objects provided by the DevExtreme data layer. */
        export module utils {
            /** Compiles a getter function from the getter expression. */
            export function compileGetter(expr: any): Function;

            /** Compiles a setter function from the setter expression. */
            export function compileSetter(expr: any): Function;

            export module odata {
                /** Holds key value converters for OData. */
                export module keyConverters {
                    export function String(value: any): string;
                    export function Int32(value: any): number;
                    export function Int64(value: any): EdmLiteral;
                    export function Guid(value: any): Guid;
                    export function Boolean(value: any): boolean;
                    export function Single(value: any): EdmLiteral;
                    export function Decimal(value: any): EdmLiteral;
                }
            }
        }
    }

    /** An object that serves as a namespace for the methods that are used to localize an application. */
    export module localization {
        /** Gets the current locale identifier. */
        export function locale(): string;

        /** Sets the current locale identifier. */
        export function locale(locale: string): void;

        /** Loads DevExtreme messages. */
        export function loadMessages(messages: any): void;
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    

    /** An object that serves as a namespace for DevExtreme UI widgets as well as for methods implementing UI logic in DevExtreme sites/applications. */
    export module ui {
        
        

        export interface WidgetOptions extends DOMComponentOptions {
            
            
            

            /** Specifies whether or not the widget changes its state when interacting with a user. */
            activeStateEnabled?: boolean;

            /** Specifies whether the widget responds to user interaction. */
            disabled?: boolean;

            /** Specifies whether the widget changes its state when a user pauses on it. */
            hoverStateEnabled?: boolean;

            /** Specifies whether the widget can be focused using keyboard navigation. */
            focusStateEnabled?: boolean;

            /** Specifies the shortcut key that sets focus on the widget. */
            accessKey?: string;

            /** Specifies whether the widget is visible. */
            visible?: boolean;

            /** Specifies the number of the element when the Tab key is used for navigating. */
            tabIndex?: number;

            /** Specifies text for a hint that appears when a user pauses on the widget. */
            hint?: string;
        }

        /** The base class for widgets. */
        export class Widget extends DOMComponent {
            

            constructor(options?: WidgetOptions);

            /** Repaints the widget. Call it if you made modifications that changed the widget's state to invalid. */
            repaint(): void;

            /** Sets focus on the widget. */
            focus(): void;

            /** Registers a handler to be executed when a user presses a specific key. */
            registerKeyHandler(key: string, handler: Function): void;
        }

        export interface CollectionWidgetOptions extends WidgetOptions {
            
            
            
            
            

            /** A data source used to fetch data to be displayed by the widget. */
            dataSource?: any;

            /** The time period in milliseconds before the onItemHold event is raised. */
            itemHoldTimeout?: number;

            /** An array of items displayed by the widget. */
            items?: Array<any>;

            /** Specifies a custom template for an item. */
            itemTemplate?: any;

            
            loopItemFocus?: boolean;

            /** The text or HTML markup displayed by the widget if the item collection is empty. */
            noDataText?: string;

            
            onContentReady?: any;

            /** A handler for the itemClick event. */
            onItemClick?: any;

            /** A handler for the itemContextMenu event. */
            onItemContextMenu?: Function;

            /** A handler for the itemHold event. */
            onItemHold?: Function;

            /** A handler for the itemRendered event. */
            onItemRendered?: Function;

            /** A handler for the selectionChanged event. Raised after an item is selected or unselected. */
            onSelectionChanged?: Function;

            /** The index of the currently selected widget item. */
            selectedIndex?: number;

            /** The selected item object. */
            selectedItem?: Object;

            /** An array of currently selected item objects. */
            selectedItems?: Array<any>;

            /** Specifies an array of currently selected item keys. */
            selectedItemKeys?: Array<any>;

            /** Specifies which data field provides keys for widget items. */
            keyExpr?: any;

            /** A handler for the itemDeleting event. Executed before an item is deleted from the data source. */
            onItemDeleting?: Function;

            /** A handler for the itemDeleted event. */
            onItemDeleted?: Function;

            /** A handler for the itemReordered event. */
            onItemReordered?: Function;
        }

        
        export interface DataHelperMixin {
            /** Gets the DataSource instance. */
            getDataSource(): DevExpress.data.DataSource;
        }

        /** The base class for widgets containing an item collection. */
        export class CollectionWidget extends Widget implements DataHelperMixin
        {
            constructor(element: JQuery, options?: CollectionWidgetOptions);
            constructor(element: HTMLElement, options?: CollectionWidgetOptions);

            
            
            
            
            
            
            
            

            
            selectItem(itemElement: any): void;

            
            unselectItem(itemElement: any): void;

            
            deleteItem(itemElement: any): JQueryPromise<void>;

            
            isItemSelected(itemElement: any): boolean;

            
            reorderItem(itemElement: any, toItemElement: any): JQueryPromise<void>;

            getDataSource(): DevExpress.data.DataSource;
        }

        
        export interface DataExpressionMixinOptions {

            
            
            
            
            

            /** A data source used to fetch data to be displayed by the widget. */
            dataSource?: any;

            /** Specifies the name of the data source item field whose value is displayed by the widget. */
            displayExpr?: any;

            /** Specifies which data field provides the widget value. */
            valueExpr?: any;

            /** An array of items displayed by the widget. */
            items?: Array<any>;

            /** Specifies a custom template for an item. */
            itemTemplate?: any;

            /** Specifies the currently selected value. */
            value?: any;
        }

        
        export interface SearchBoxMixinOptions {
            /** Specifies whether searching is enabled. */
            searchEnabled?: boolean;

            /** Specifies the current search string. */
            searchValue?: string;

            /** Specifies a data object's field name or an expression whose value is compared to the search string. */
            searchExpr?: any;

            /** Specifies whether the widget finds entries that contain your search string or entries that only start with it. */
            searchMode?: string;

            /** Configures the search panel. */
            searchEditorOptions?: DevExpress.ui.dxTextBoxOptions;

            /** Specifies the time delay, in milliseconds, after the last character has been typed in, before a search is executed. */
            searchTimeout?: number;
        }

        export interface EditorOptions extends WidgetOptions {
            /** Specifies the currently selected value. */
            value?: any;

            /** The value to be assigned to the `name` attribute of the underlying HTML element. */
            name?: string;

            /** A handler for the valueChanged event. */
            onValueChanged?: Function;

            /** A Boolean value specifying whether or not the widget is read-only. */
            readOnly?: boolean;

            /** Holds the object that defines the error that occurred during validation. */
            validationError?: Object;

            /** Specifies whether the editor's value is valid. */
            isValid?: boolean;

            /** Specifies how the message about the validation rules that are not satisfied by this editor's value is displayed. */
            validationMessageMode?: string;
        }

        /** A base class for editors. */
        export class Editor extends Widget {

            /** Resets the editor's value to undefined. */
            reset(): void;
        }

        /** An object that serves as a namespace for methods displaying a message in an application/site. */
        export var dialog: {
            /** Creates an alert dialog message containing a single "OK" button. */
            alert(message: string, title: string): JQueryPromise<void>;

            /** Creates a confirm dialog that contains "Yes" and "No" buttons. */
            confirm(message: string, title: string): JQueryPromise<boolean>;

            /** Creates a custom dialog using the options specified by the passed configuration object. */
            custom(options: { title?: string; message?: string; buttons?: Array<Object>; }): {
                show(): JQueryPromise<any>;
                hide(): void;
                hide(value: any): void;
            };
        };

        /** Creates a toast message. */
        export function notify(message: string, type?: string, displayTime?: number): void;

        /** Creates a toast message. */
        export function notify(options: Object, type?: string, displayTime?: number): void;

        /** An object that serves as a namespace for the methods that work with DevExtreme CSS Themes. */
        export var themes: {
            /** Returns the name of the currently applied theme. */
            current(): string;

            /** Changes the current theme to the specified one. */
            current(themeName: string): void;
            
            /** Specifies a function to execute when the theme is loaded. */
            ready(callback: Function): void;
        };

        /** Sets a specified template engine. */
        export function setTemplateEngine(name: string): void;

        /** Sets a custom template engine defined via custom compile and render functions. */
        export function setTemplateEngine(options: Object): void;
    }

    /** An object that serves as a namespace for utility methods that can be helpful when working with the DevExtreme framework and UI widgets. */
    export module utils {
        /** Sets parameters for the viewport meta tag. */
        export function initMobileViewport(options: { allowZoom?: boolean; allowPan?: boolean; allowSelection?: boolean }): void;

        /** Requests that the browser call a specified function to update animation before the next repaint. */
        export function requestAnimationFrame(callback: Function): number;

        /** Cancels an animation frame request scheduled with the requestAnimationFrame method. */
        export function cancelAnimationFrame(requestID: number): void;
    }

    /** An object that serves as a namespace for DevExtreme Data Visualization Widgets. */
    export module viz {
        /** Changes the current theme for all data visualization widgets on the page. */
        export function currentTheme(theme: string): void;

        /** Changes the current theme for all data visualization widgets on the page. The color scheme is defined separately. */
        export function currentTheme(platform: string, colorScheme: string): void;

        /** Registers a new theme based on the existing one. */
        export function registerTheme(customTheme: Object, baseTheme: string): void;

        /** Refreshes the current theme and palette in all data visualization widgets on the page. */
        export function refreshTheme(): void;

        /** Allows you to export widgets using their SVG markup. */
        export function exportFromMarkup(markup: string, options: Object): void;

        /** Gets the SVG markup of specific widgets for their subsequent export. */
        export function getMarkup(widgetInstances: Array<Object>): string;

        /** Changes the current palette for all data visualization widgets on the page. */
        export function currentPalette(paletteName: string): void;

        /** Obtains the color sets of a predefined or registered palette. */
        export function getPalette(paletteName: string): Object;

        /** Registers a new palette. */
        export function registerPalette(paletteName: string, palette: Object): void;

        /** The method to be called every time the active entry in the browser history is modified without reloading the current page. */
        export function refreshPaths(): void;
    }
}
