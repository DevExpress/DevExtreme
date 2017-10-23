/// <reference path="vendor/jquery.d.ts" />

declare module DevExpress {

    /** @docid globalConfig */
    export interface GlobalConfguration {
        /** @docid globalConfig_rtlEnabled */
        rtlEnabled?: boolean;

        /** @docid globalConfig_defaultCurrency */
        defaultCurrency?: String;

        /** @docid globalConfig_serverDecimalSeparator */
        serverDecimalSeparator?: String;

        /** @docid globalConfig_decimalSeparator */
        decimalSeparator?: String;

        /** @docid globalConfig_thousandsSeparator */
        thousandsSeparator?: String;

        /** @docid globalConfig_forceIsoDateParsing */
        forceIsoDateParsing?: boolean;

        /** @docid globalConfig_useJQuery */
        useJQuery?: boolean;
    }

    /** @docid format */
    export interface Format {
        /** @docid format_type */
        type?: String;

        /** @docid format_currency */
        currency?: String;

        /** @docid format_precision */
        precision?: number;

        /** @docid format_parser */
        parser?: (value: any) => any;

        /** @docid format_formatter */
        formatter?: (value: any) => any;
    }

    /** @docid EventsMixin */
    export interface EventsMixin<T> {
        /** @docid EventsMixinMethods_on#on(eventName,eventHandler) */
        on(eventName: string, eventHandler: Function): T;

        /** @docid EventsMixinMethods_on#on(events) */
        on(events: { [eventName: string]: Function; }): T;

        /** @docid EventsMixinMethods_off#off(eventName) */
        off(eventName: string): Object;

        /** @docid EventsMixinMethods_off#off(eventName,eventHandler) */
        off(eventName: string, eventHandler: Function): T;
    }

    /** @docid validationEngine */
    export module validationEngine {
        export interface IValidator {
            validate(): ValidatorValidationResult;
            reset(): void;
        }

        /** @docid_ignore requiredRule */
        /** @docid_ignore requiredRule_type */
        /** @docid_ignore requiredRule_trim */
        /** @docid_ignore requiredRule_message */
        /** @docid_ignore numericRule */
        /** @docid_ignore numericRule_type */
        /** @docid_ignore numericRule_message */
        /** @docid_ignore rangeRule */
        /** @docid_ignore rangeRule_type */
        /** @docid_ignore rangeRule_min */
        /** @docid_ignore rangeRule_max */
        /** @docid_ignore rangeRule_message */
        /** @docid_ignore rangeRule_reevaluate */
        /** @docid_ignore stringLengthRule */
        /** @docid_ignore stringLengthRule_type */
        /** @docid_ignore stringLengthRule_min */
        /** @docid_ignore stringLengthRule_max */
        /** @docid_ignore stringLengthRule_trim */
        /** @docid_ignore stringLengthRule_message */
        /** @docid_ignore customRule */
        /** @docid_ignore customRule_type */
        /** @docid_ignore customRule_validationCallback */
        /** @docid_ignore customRule_message */
        /** @docid_ignore customRule_reevaluate */
        /** @docid_ignore compareRule */
        /** @docid_ignore compareRule_type */
        /** @docid_ignore compareRule_comparisonTarget */
        /** @docid_ignore compareRule_comparisonType */
        /** @docid_ignore compareRule_message */
        /** @docid_ignore compareRule_reevaluate */
        /** @docid_ignore patternRule */
        /** @docid_ignore patternRule_type */
        /** @docid_ignore patternRule_pattern */
        /** @docid_ignore patternRule_message */
        /** @docid_ignore emailRule */
        /** @docid_ignore emailRule_type */
        /** @docid_ignore emailRule_message */

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

        /** @docid validationEngineMethods_getGroupConfig#getGroupConfig(group) */
        export function getGroupConfig(group: any): GroupConfig
        /** @docid validationEngineMethods_getGroupConfig#getGroupConfig() */
        export function getGroupConfig(): GroupConfig

        /** @docid validationEngineMethods_validateGroup#validateGroup(group) */
        export function validateGroup(group: any): ValidationGroupValidationResult;

        /** @docid validationEngineMethods_validateGroup#validateGroup() */
        export function validateGroup(): ValidationGroupValidationResult;

        /** @docid validationEngineMethods_resetGroup#resetGroup(group) */
        export function resetGroup(group: any): void;

        /** @docid validationEngineMethods_resetGroup#resetGroup() */
        export function resetGroup(): void;

        /** @docid validationEngineMethods_validateModel */
        export function validateModel(model: Object): ValidationGroupValidationResult;

        /** @docid validationEngineMethods_registerModelForValidation */
        export function registerModelForValidation(model: Object): void;

        /** @docid validationEngineMethods_unregisterModelForValidation */
        export function unregisterModelForValidation(model: Object): void;
    }

    export var hardwareBackButton: JQueryCallback;

    /** @docid processHardwareBackButton */
    export function processHardwareBackButton(): void;

    /** @docid hideTopOverlay */
    export function hideTopOverlay(): boolean;

    /** @docid rtlEnabled */
    export var rtlEnabled: boolean;

    /** @docid config#config() */
    export function config(): Object;

    /** @docid config#config(config) */
    export function config(config: GlobalConfguration): void;

    /** @docid registerComponent#registerComponent(name,componentClass) */
    export function registerComponent(name: string, componentClass: Object): void;

    /** @docid registerComponent#registerComponent(name,namespace,componentClass) */
    export function registerComponent(name: string, namespace: Object, componentClass: Object): void;

    /** @docid_ignore requestAnimationFrame */
    export function requestAnimationFrame(callback: Function): number;

    /** @docid_ignore cancelAnimationFrame */
    export function cancelAnimationFrame(requestID: number): void;

    /** @docid dxaction */
    export class Action { }

    /** @docid EndpointSelector */
    export class EndpointSelector {
        constructor(options: {
            [key: string]: {
                local?: string;
                production?: string;
            }
        });

        /** @docid EndpointSelectorMethods_urlFor */
        urlFor(key: string): string;
    }

    /** @docid fx */
    export module fx {

        /** @docid animationConfig */
        export interface AnimationOptions {
            /** @docid animationConfig_complete */
            complete?: (element: JQuery, config: AnimationOptions) => void;

            /** @docid animationConfig_delay */
            delay?: number;

            /** @docid animationConfig_staggerDelay */
            staggerDelay?: number;

            /** @docid animationConfig_duration */
            duration?: number;

            /** @docid animationConfig_easing */
            easing?: string;

            /** @docid animationConfig_from */
            from?: any;

            /** @docid animationConfig_start */
            start?: (element: JQuery, config: AnimationOptions) => void;

            /** @docid animationConfig_to */
            to?: any;

            /** @docid animationConfig_type */
            type?: string;

            /** @docid animationConfig_direction */
            direction?: string;
        }

        /** @docid fxmethods_animate */
        export function animate(element: HTMLElement, config: AnimationOptions): JQueryPromise<void>;

        /** @docid fxmethods_isAnimating */
        export function isAnimating(element: HTMLElement): boolean;

        /** @docid fxmethods_stop */
        export function stop(element: HTMLElement, jumpToEnd: boolean): void;
    }

    /** @docid TransitionExecutor */
    export class TransitionExecutor {
        /** @docid TransitionExecutorMethods_reset */
        reset(): void;
        /** @docid TransitionExecutorMethods_enter */
        enter(elements: JQuery, animation: any): void;
        /** @docid TransitionExecutorMethods_leave */
        leave(elements: JQuery, animation: any): void;
        /** @docid TransitionExecutorMethods_start */
        start(config: Object): JQueryPromise<void>;
        /** @docid TransitionExecutorMethods_stop */
        stop(): void;
    }

    export class AnimationPresetCollection {
        /** @docid animationPresetsMethods_resetToDefaults */
        resetToDefaults(): void;
        /** @docid animationPresetsMethods_clear */
        clear(name: string): void;
        /** @docid animationPresetsMethods_registerPreset */
        registerPreset(name: string, config: any): void;
        /** @docid animationPresetsMethods_applyChanges */
        applyChanges(): void;
        /** @docid animationPresetsMethods_getPreset */
        getPreset(name: string): void;
        /** @docid animationPresetsMethods_registerDefaultPresets */
        registerDefaultPresets(): void;
    }

    /** @docid animationPresets */
    export var animationPresets: AnimationPresetCollection;

    /** @docid device */
    export interface Device {
        /** @docid device_android */
        android?: boolean;

        /** @docid device_devicetype */
        deviceType?: string;

        /** @docid device_generic */
        generic?: boolean;

        /** @docid device_ios */
        ios?: boolean;

        /** @docid device_phone */
        phone?: boolean;

        /** @docid device_platform */
        platform?: string;

        /** @docid device_tablet */
        tablet?: boolean;

        /** @docid device_version */
        version?: Array<number>;

        /** @docid device_win */
        win?: boolean;

        /** @docid device_grade */
        grade?: string;
    }

    export class Devices implements EventsMixin<Devices> {
        /** @docid DevicesMethods_ctor */
        constructor(options: { window: Window });

        /** @docid devicesmethods_current#current(deviceName) */
        current(deviceName: any): void;

        /** @docid devicesmethods_current#current() */
        current(): Device;

        /** @docid devicesevents_orientationChanged */
        orientationChanged: JQueryCallback;

        /** @docid devicesmethods_orientation */
        orientation(): string;

        /** @docid devicesmethods_real */
        real(): Device;

        on(eventName: "orientationChanged", eventHandler: (e: { orientation: string }) => void): Devices;
        on(eventName: string, eventHandler: Function): Devices;

        on(events: { [eventName: string]: Function; }): Devices;

        off(eventName: "orientationChanged"): Devices;
        off(eventName: string): Devices;

        off(eventName: "orientationChanged", eventHandler: (e: { orientation: string }) => void): Devices;
        off(eventName: string, eventHandler: Function): Devices;
    }

    /** @docid devices */
    export var devices: Devices;

    /** @docid positionConfig */
    export interface PositionOptions {
        /**
        * @docid_ignore positionConfig_at_x
        * @docid_ignore positionConfig_at_y
        * @docid_ignore positionConfig_boundaryOffset_x
        * @docid_ignore positionConfig_boundaryOffset_y
        * @docid_ignore positionConfig_collision_x
        * @docid_ignore positionConfig_collision_y
        * @docid_ignore positionConfig_my_x
        * @docid_ignore positionConfig_my_y
        * @docid_ignore positionConfig_offset_x
        * @docid_ignore positionConfig_offset_y
        */

        /** @docid positionConfig_at */
        at?: any;

        /** @docid positionConfig_boundary */
        boundary?: any;

        /** @docid positionConfig_boundaryOffset */
        boundaryOffset?: any;

        /** @docid positionConfig_collision */
        collision?: any;

        /** @docid positionConfig_my */
        my?: any;

        /** @docid positionConfig_of */
        of?: any;

        /** @docid positionConfig_offset */
        offset?: any;
    }

    export interface ComponentOptions {
        /** @docid componentOptions_onInitialized */
        onInitialized?: Function;

        /** @docid componentOptions_onOptionChanged */
        onOptionChanged?: Function;

        /** @docid componentOptions_onDisposing */
        onDisposing?: Function;
    }

    /** @docid component */
    export class Component implements EventsMixin<Component> {
        /** @docid ComponentMethods_ctor */
        constructor(options?: ComponentOptions)

        /** @docid componentmethods_beginupdate#beginUpdate() */
        beginUpdate(): void;

        /** @docid componentmethods_endupdate#endUpdate() */
        endUpdate(): void;

        /** @docid componentmethods_instance#instance() */
        instance(): Component;

        /** @docid componentmethods_option#option() */
        option(): {
            [optionKey: string]: any;
        };

        /** @docid componentmethods_option#option(options) */
        option(options: {
            [optionKey: string]: any;
        }): void;

        /** @docid componentmethods_option#option(optionName) */
        option(optionName: string): any;

        /** @docid componentmethods_option#option(optionName,optionValue) */
        option(optionName: string, optionValue: any): void;

        on(eventName: string, eventHandler: Function): Component;
        on(events: { [eventName: string]: Function; }): Component;

        off(eventName: string): Component;
        off(eventName: string, eventHandler: Function): Component;
    }

    export interface DOMComponentOptionsBase extends ComponentOptions {
        /** @docid_ignore domcomponentoptions_onOptionChanged */
        /** @docid_ignore domcomponentoptions_onDisposing */

        /** @docid domcomponentoptions_rtlEnabled */
        rtlEnabled?: boolean;

        /** @docid domcomponentoptions_elementAttr */
        elementAttr?: Object;

        /** A bag for holding any options that require two-way binding (Angular approach specific) */
        bindingOptions?: { [key: string]: any; };
    }

    export interface DOMComponentOptions extends DOMComponentOptionsBase {
        /** @docid domcomponentoptions_height */
        height?: any;

        /** @docid domcomponentoptions_width */
        width?: any;
    }

    /** @docid domcomponent */
    export class DOMComponent extends Component {
        /** @docid DOMComponentMethods_ctor */
        constructor(element: JQuery, options?: DOMComponentOptions);
        constructor(element: HTMLElement, options?: DOMComponentOptions);

        /** @docid domcomponentmethods_element */
        element(): JQuery;

        /** @docid domcomponentmethods_dispose */
        dispose(): void;

        /** @docid domcomponentmethods_defaultOptions */
        static defaultOptions(rule: {
            device?: any;
            options?: any;
        }): void;

        /** @docid domcomponentmethods_getInstance */
        static getInstance(element: JQuery): Object;
    }

    export module data {
        export interface ODataError extends Error {
            httpStatus?: number;
            errorDetails?: any;
        }

        export interface StoreOptions {
            /** @docid StoreOptions_onModified */
            onModified?: () => void;

            /** @docid StoreOptions_onModifying */
            onModifying?: () => void;

            /** @docid StoreOptions_onRemoved */
            onRemoved?: (key: any) => void;

            /** @docid StoreOptions_onRemoving */
            onRemoving?: (key: any) => void;

            /** @docid StoreOptions_onUpdated */
            onUpdated?: (key: any, values: Object) => void;

            /** @docid StoreOptions_onUpdating */
            onUpdating?: (key: any, values: Object) => void;

            /** @docid  StoreOptions_onLoaded */
            onLoaded?: (result: Array<any>) => void;

            /** @docid StoreOptions_onLoading */
            onLoading?: (loadOptions: LoadOptions) => void;

            /** @docid StoreOptions_onInserted */
            onInserted?: (values: Object, key: any) => void;

            /** @docid StoreOptions_onInserting */
            onInserting?: (values: Object) => void;

            /** @docid StoreOptions_errorHandler */
            errorHandler?: (e: Error) => void;

            /** @docid StoreOptions_key */
            key?: any;
        }

        export interface LoadOptions {
            searchValue?: any;
            searchExpr?: any;
            searchOperation?: string;
            filter?: Object;
            sort?: Object;
            select?: Object;
            expand?: Object;
            group?: Object;
            skip?: number;
            take?: number;
            userData?: Object;
            requireTotalCount?: boolean;
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

        /** @docid Store */
        export class Store implements EventsMixin<Store> {
            constructor(options?: StoreOptions);

            /** @docid StoreMethods_byKey */
            byKey(key: any): JQueryPromise<any>;

            /** @docid StoreMethods_insert */
            insert(values: Object): JQueryPromise<any>;

            /** @docid StoreMethods_key */
            key(): any;

            /** @docid StoreMethods_keyOf */
            keyOf(obj: Object): any;

            /** @docid StoreMethods_load#load() */
            load(): JQueryPromise<any[]>;

            /** @docid StoreMethods_load#load(options) */
            load(options?: LoadOptions): JQueryPromise<any[]>;

            /** @docid StoreMethods_remove */
            remove(key: any): JQueryPromise<any>;

            /** @docid StoreMethods_totalCount */
            totalCount(options?: {
                filter?: Object;
                group?: Object;
            }): JQueryPromise<any>;

            /** @docid StoreMethods_update */
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
            /** @docid ArrayStoreOptions_data */
            data?: Array<any>;
        }

        /** @docid ArrayStore */
        export class ArrayStore extends Store {
            constructor(options?: ArrayStoreOptions);

            /** @docid ArrayStoreMethods_clear */
            clear(): void;

            /** @docid ArrayStoreMethods_createQuery */
            createQuery(): Query;
        }

        //T184606
        interface Promise {
            then(doneFn?: any, failFn?: any, progressFn?: any): Promise;
        }

        export interface CustomStoreOptions extends StoreOptions {
            /** @docid CustomStoreOptions_useDefaultSearch */
            useDefaultSearch?: boolean;

            /** @docid CustomStoreOptions_loadMode */
            loadMode?: string;

            /** @docid CustomStoreOptions_cacheRawData */
            cacheRawData?: boolean;

            /** @docid CustomStoreOptions_byKey */
            byKey?: (key: any) => Promise;

            /** @docid CustomStoreOptions_insert */
            insert?: (values: Object) => Promise;

            /** @docid CustomStoreOptions_load */
            load?: (options?: LoadOptions) => Promise;

            /** @docid CustomStoreOptions_remove */
            remove?: (key: any) => Promise;

            /** @docid CustomStoreOptions_totalCount */
            totalCount?: (options?: {
                filter?: Object;
                group?: Object;
            }) => Promise;

            /** @docid CustomStoreOptions_update */
            update?: (key: any, values: Object) => Promise;
        }

        /** @docid CustomStore */
        export class CustomStore extends Store {
            constructor(options: CustomStoreOptions);

            /** @docid CustomStoreMethods_clearRawDataCache */
            clearRawDataCache(): void;
        }

        export interface DataSourceOptions {
            /** @docid_ignore DataSourceOptions_store_type */

            /** @docid DataSourceOptions_filter */
            filter?: Object;

            /** @docid DataSourceOptions_group */
            group?: Object;

            /** @docid DataSourceOptions_map */
            map?: (record: any) => any;

            /** @docid DataSourceOptions_pageSize */
            pageSize?: number;

            /** @docid DataSourceOptions_paginate */
            paginate?: boolean;

            /** @docid DataSourceOptions_postProcess */
            postProcess?: (data: any[]) => any[];

            /** @docid DataSourceOptions_searchExpr */
            searchExpr?: any;

            /** @docid DataSourceOptions_searchOperation */
            searchOperation?: string;

            /** @docid DataSourceOptions_searchValue */
            searchValue?: any;

            /** @docid DataSourceOptions_select */
            select?: Object;

            /** @docid DataSourceOptions_expand */
            expand?: Object;

            /** @docid DataSourceOptions_customQueryParams */
            customQueryParams?: Object;

            /** @docid DataSourceOptions_requireTotalCount */
            requireTotalCount?: boolean;

            /** @docid DataSourceOptions_sort */
            sort?: Object;

            /** @docid DataSourceOptions_store */
            store?: any;

            /** @docid DataSourceOptions_onChanged */
            onChanged?: () => void;

            /** @docid DataSourceOptions_onLoadingChanged */
            onLoadingChanged?: (isLoading: boolean) => void;

            /** @docid DataSourceOptions_onLoadError */
            onLoadError?: (e?: Error) => void;
        }

        export interface OperationPromise<T> extends JQueryPromise<T> {
            operationId: number;
        }

        /** @docid DataSource */
        export class DataSource implements EventsMixin<DataSource> {
            /** @docid DataSourceMethods_ctor#ctor(url) */
            constructor(url: string);
            /** @docid DataSourceMethods_ctor#ctor(data) */
            constructor(data: Array<any>);
            /** @docid DataSourceMethods_ctor#ctor(options) */
            constructor(options: CustomStoreOptions);
            constructor(options: DataSourceOptions);

            /** @docid DataSourceMethods_dispose */
            dispose(): void;

            /** @docid DataSourceMethods_filter#filter() */
            filter(): Object;

            /** @docid DataSourceMethods_filter#filter(filterExpr) */
            filter(filterExpr: Object): void;

            /** @docid DataSourceMethods_group#group() */
            group(): Object;

            /** @docid DataSourceMethods_group#group(groupExpr) */
            group(groupExpr: Object): void;

            /** @docid DataSourceMethods_isLastPage */
            isLastPage(): boolean;

            /** @docid DataSourceMethods_isLoaded */
            isLoaded(): boolean;

            /** @docid DataSourceMethods_isLoading */
            isLoading(): boolean;

            /** @docid DataSourceMethods_items */
            items(): Array<any>;

            /** @docid DataSourceMethods_key */
            key(): any;

            /** @docid DataSourceMethods_load */
            load(): OperationPromise<Array<any>>;

            /** @docid DataSourceMethods_reload */
            reload(): OperationPromise<Array<any>>;

            /** @docid DataSourceMethods_loadOptions */
            loadOptions(): Object;

            /** @docid DataSourceMethods_pageSize#pageSize() */
            pageSize(): number;

            /** @docid DataSourceMethods_pageSize#pageSize(value) */
            pageSize(value: number): void;

            /** @docid DataSourceMethods_pageIndex#pageIndex() */
            pageIndex(): number;

            /** @docid DataSourceMethods_pageIndex#pageIndex(newIndex) */
            pageIndex(newIndex: number): void;

            /** @docid DataSourceMethods_paginate#paginate() */
            paginate(): boolean;

            /** @docid DataSourceMethods_paginate#paginate(value) */
            paginate(value: boolean): void;

            /** @docid DataSourceMethods_searchExpr#searchExpr() */
            searchExpr(): any;

            /** @docid DataSourceMethods_searchExpr#searchExpr(expr) */
            searchExpr(...expr: any[]): void;

            /** @docid DataSourceMethods_searchOperation#searchOperation() */
            searchOperation(): string;

            /** @docid DataSourceMethods_searchOperation#searchOperation(op) */
            searchOperation(op: string): void;

            /** @docid DataSourceMethods_searchValue#searchValue() */
            searchValue(): any;

            /** @docid DataSourceMethods_searchValue#searchValue(value) */
            searchValue(value: any): void;

            /** @docid DataSourceMethods_select#select() */
            select(): any;

            /** @docid DataSourceMethods_select#select(expr) */
            select(expr: any): void;

            /** @docid DataSourceMethods_requireTotalCount#requireTotalCount() */
            requireTotalCount(): boolean;

            /** @docid DataSourceMethods_requireTotalCount#requireTotalCount(value) */
            requireTotalCount(value: boolean): void;

            /** @docid DataSourceMethods_sort#sort() */
            sort(): any;

            /** @docid DataSourceMethods_sort#sort(sortExpr) */
            sort(sortExpr: any): void;

            /** @docid DataSourceMethods_store */
            store(): Store;

            /** @docid DataSourceMethods_totalCount */
            totalCount(): number;

            /** @docid DataSourceMethods_cancel */
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

        /** @docid EdmLiteral */
        export class EdmLiteral {
            /** @docid EdmLiteralMethods_ctor */
            constructor(value: string);

            /** @docid EdmLiteralMethods_valueOf */
            valueOf(): string;
        }

        /** @docid Guid */
        export class Guid {

            /** @docid Guidmethods_ctor#ctor(value) */
            constructor(value: string);

            /** @docid Guidmethods_ctor#ctor() */
            constructor();

            /** @docid Guidmethods_toString */
            toString(): string;

            /** @docid Guidmethods_valueOf */
            valueOf(): string;
        }

        export interface LocalStoreOptions extends ArrayStoreOptions {
            /** @docid LocalStoreOptions_flushInterval */
            flushInterval?: number;

            /** @docid LocalStoreOptions_immediate */
            immediate?: boolean;

            /** @docid LocalStoreOptions_name */
            name?: string;
        }

        /** @docid LocalStore */
        export class LocalStore extends ArrayStore {
            constructor(options?: LocalStoreOptions);

            /** @docid LocalStoreMethods_clear */
            clear(): void;
        }

        export interface ODataContextOptions extends ODataStoreOptions {
            /** @docid ODataContextOptions_entities */
            entities?: Object;

            /** @docid ODataContextOptions_errorHandler */
            errorHandler?: (e: Error) => void;
        }

        /** @docid ODataContext */
        export class ODataContext {
            constructor(options?: ODataContextOptions);

            /** @docid ODataContextmethods_get */
            get(operationName: string, params: Object): JQueryPromise<any>;

            /** @docid ODataContextmethods_invoke */
            invoke(operationName: string, params: Object, httpMethod: Object): JQueryPromise<any>;

            /** @docid ODataContextmethods_objectLink */
            objectLink(entityAlias: string, key: any): Object;
        }

        export interface ODataStoreOptions extends StoreOptions {
            /** @docid_ignore ODataStoreOptions_onLoading */

            /**
              * @docid ODataStoreOptions_beforeSend
              * @docid ODataContextOptions_beforeSend
              */
            beforeSend?: (request: {
                url: string;
                async: boolean;
                method: string;
                timeout: number;
                params: Object;
                payload: Object;
                headers: Object;
            }) => void;

            /**
              * @docid ODataStoreOptions_jsonp
              * @docid ODataContextOptions_jsonp
              */
            jsonp?: boolean;

            /**
              * @docid ODataStoreOptions_keyType
              */
            keyType?: any;

            /**
              * @docid ODataStoreOptions_fieldTypes
              */
            fieldTypes?: Object;

            /**
              * @docid ODataStoreOptions_deserializeDates
              * @docid ODataContextOptions_deserializeDates
              */
            deserializeDates?: boolean;

            /**
              * @docid ODataStoreOptions_url
              * @docid ODataContextOptions_url
              */
            url?: string;

            /**
              * @docid ODataStoreOptions_version
              * @docid ODataContextOptions_version
              */
            version?: number;

            /**
              * @docid ODataStoreOptions_withCredentials
              * @docid ODataContextOptions_withCredentials
              */
            withCredentials?: boolean;
        }

        /** @docid ODataStore */
        export class ODataStore extends Store {
            /** @docid_ignore ODataStoreMethods_load */

            constructor(options?: ODataStoreOptions);

            /** @docid ODataStoreMethods_createQuery */
            createQuery(loadOptions: Object): Object;

            /** @docid ODataStoreMethods_byKey */
            byKey(key: any, extraOptions?: { expand?: Object }): JQueryPromise<any>;
        }

        /** @docid Query */
        export interface Query {

            /** @docid QueryMethods_aggregate#aggregate(step) */
            aggregate(step: (accumulator: any, value: any) => any): JQueryPromise<any>;

            /** @docid QueryMethods_aggregate#aggregate(seed,step,finalize) */
            aggregate(seed: any, step: (accumulator: any, value: any) => any, finalize: (result: any) => any): JQueryPromise<any>;

            /** @docid QueryMethods_avg#avg(getter) */
            avg(getter: Object): JQueryPromise<any>;

            /** @docid QueryMethods_max#max(getter) */
            max(getter: Object): JQueryPromise<any>;

            /** @docid QueryMethods_max#max() */
            max(): JQueryPromise<any>;

            /** @docid QueryMethods_min#min() */
            min(): JQueryPromise<any>;

            /** @docid QueryMethods_min#min(getter) */
            min(getter: Object): JQueryPromise<any>;

            /** @docid QueryMethods_avg#avg() */
            avg(): JQueryPromise<any>;

            /** @docid QueryMethods_count */
            count(): JQueryPromise<any>;

            /** @docid QueryMethods_enumerate */
            enumerate(): JQueryPromise<any>;

            /** @docid QueryMethods_filter#filter(criteria) */
            filter(criteria: Array<any>): Query;

            /** @docid QueryMethods_filter#filter(predicate) */
            filter(predicate: (item: any) => boolean): Query;

            /** @docid QueryMethods_groupBy */
            groupBy(getter: Object): Query;

            /** @docid QueryMethods_select */
            select(getter: Object): Query;

            /** @docid QueryMethods_slice */
            slice(skip: number, take?: number): Query;

            /** @docid QueryMethods_sortBy#sortBy(getter,desc) */
            sortBy(getter: Object, desc: boolean): Query;

            /** @docid QueryMethods_sortBy#sortBy(getter) */
            sortBy(getter: Object): Query;

            /** @docid QueryMethods_sum#sum(getter) */
            sum(getter: Object): JQueryPromise<any>;

            /** @docid QueryMethods_sum#sum() */
            sum(): JQueryPromise<any>;

            /** @docid QueryMethods_thenBy#thenBy(getter) */
            thenBy(getter: Object): Query;

            /** @docid QueryMethods_thenBy#thenBy(getter,desc) */
            thenBy(getter: Object, desc: boolean): Query;

            /** @docid QueryMethods_toArray */
            toArray(): Array<any>;
        }

        /** @docid Utils_errorHandler */
        export var errorHandler: (e: Error) => void;

        /** @docid Utils_base64encode */
        export function base64_encode(input: any): string;

        /** @docid Utils_query#query(array) */
        export function query(array: Array<any>): Query;

        /** @docid Utils_query#query(url,queryOptions) */
        export function query(url: string, queryOptions: Object): Query;

        /** @docid Utils */
        export module utils {
            /** @docid Utils_compileGetter */
            export function compileGetter(expr: any): Function;

            /** @docid Utils_compileSetter */
            export function compileSetter(expr: any): Function;

            export module odata {
                /** @docid Utils_odatakeyConverters */
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

    /** @docid localization */
    export module localization {
        /** @docid localization_locale#locale() */
        export function locale(): string;

        /** @docid localization_locale#locale(locale) */
        export function locale(locale: string): void;

        /** @docid localization_loadMessages */
        export function loadMessages(messages: any): void;
    }

    /** @docid_ignore events */
    /** @docid_ignore events_on */
    /** @docid_ignore events_one */
    /** @docid_ignore events_off */
    /** @docid_ignore events_trigger */
    /** @docid_ignore events_triggerHandler */
    /** @docid_ignore eventsHandler */
    /** @docid_ignore dxEvent */
    /** @docid_ignore dxEventFields_isPropagationStopped */
    /** @docid_ignore dxEventFields_stopPropagation */
    /** @docid_ignore dxEventFields_isImmediatePropagationStopped */
    /** @docid_ignore dxEventFields_stopImmediatePropagation */
    /** @docid_ignore dxEventFields_isDefaultPrevented */
    /** @docid_ignore dxEventFields_preventDefault */
    /** @docid_ignore dxEventFields_target */
    /** @docid_ignore dxEventFields_currentTarget */
    /** @docid_ignore dxEventFields_delegateTarget */
    /** @docid_ignore dxEventFields_data */
    /** @docid_ignore event */

    /** @docid_ignore Element */

    /** @docid ui */
    export module ui {
        /** @docid_ignore dxTemplate */
        /** @docid_ignore dxTemplateOptions_name */

        export interface WidgetOptions extends DOMComponentOptions {
            /** @docid_ignore WidgetOptions_onContentReady */
            /** @docid_ignore WidgetOptions_onFocusIn */
            /** @docid_ignore WidgetOptions_onFocusOut */

            /** @docid WidgetOptions_activeStateEnabled */
            activeStateEnabled?: boolean;

            /** @docid WidgetOptions_disabled */
            disabled?: boolean;

            /** @docid WidgetOptions_hoverStateEnabled */
            hoverStateEnabled?: boolean;

            /** @docid WidgetOptions_focusStateEnabled */
            focusStateEnabled?: boolean;

            /** @docid WidgetOptions_accessKey */
            accessKey?: string;

            /** @docid WidgetOptions_visible */
            visible?: boolean;

            /** @docid WidgetOptions_tabIndex */
            tabIndex?: number;

            /** @docid WidgetOptions_hint */
            hint?: string;
        }

        /** @docid Widget */
        export class Widget extends DOMComponent {
            /** @docid_ignore dxItem */

            constructor(options?: WidgetOptions);

            /** @docid WidgetMethods_repaint */
            repaint(): void;

            /** @docid WidgetMethods_focus */
            focus(): void;

            /** @docid WidgetMethods_registerKeyHandler */
            registerKeyHandler(key: string, handler: Function): void;
        }

        export interface CollectionWidgetOptions extends WidgetOptions {
            /** @docid_ignore CollectionWidgetOptions_selectOnFocus */
            /** @docid_ignore CollectionWidgetOptions_selectionMode */
            /** @docid_ignore CollectionWidgetOptions_selectionByClick */
            /** @docid_ignore CollectionWidgetOptions_selectionRequired */
            /** @docid_ignore CollectionWidgetOptions_focusedElement */

            /** @docid CollectionWidgetOptions_datasource */
            dataSource?: any;

            /** @docid CollectionWidgetOptions_itemHoldTimeout */
            itemHoldTimeout?: number;

            /** @docid CollectionWidgetOptions_items */
            items?: Array<any>;

            /** @docid CollectionWidgetOptions_itemTemplate */
            itemTemplate?: any;

            /** @docid CollectionWidgetOptions_loopItemFocus */
            loopItemFocus?: boolean;

            /** @docid CollectionWidgetOptions_noDataText */
            noDataText?: string;

            /** @docid CollectionWidgetOptions_onContentReady */
            onContentReady?: any;

            /** @docid CollectionWidgetOptions_onItemClick */
            onItemClick?: any;

            /** @docid CollectionWidgetOptions_onItemContextMenu */
            onItemContextMenu?: Function;

            /** @docid CollectionWidgetOptions_onItemHold */
            onItemHold?: Function;

            /** @docid CollectionWidgetOptions_onItemRendered */
            onItemRendered?: Function;

            /** @docid CollectionWidgetOptions_onSelectionChanged */
            onSelectionChanged?: Function;

            /** @docid CollectionWidgetOptions_selectedIndex */
            selectedIndex?: number;

            /** @docid CollectionWidgetOptions_selectedItem */
            selectedItem?: Object;

            /** @docid CollectionWidgetOptions_selectedItems */
            selectedItems?: Array<any>;

            /** @docid CollectionWidgetOptions_selectedItemKeys */
            selectedItemKeys?: Array<any>;

            /** @docid CollectionWidgetOptions_keyExpr */
            keyExpr?: any;

            /** @docid CollectionWidgetOptions_onItemDeleting */
            onItemDeleting?: Function;

            /** @docid CollectionWidgetOptions_onItemDeleted */
            onItemDeleted?: Function;

            /** @docid CollectionWidgetOptions_onItemReordered */
            onItemReordered?: Function;
        }

        /** @docid DataHelperMixin */
        export interface DataHelperMixin {
            /** @docid DataHelperMixinMethods_getDataSource */
            getDataSource(): DevExpress.data.DataSource;
        }

        /** @docid CollectionWidget */
        export class CollectionWidget extends Widget implements DataHelperMixin
        {
            constructor(element: JQuery, options?: CollectionWidgetOptions);
            constructor(element: HTMLElement, options?: CollectionWidgetOptions);

            /** @docid_ignore CollectionWidgetItemTemplate_disabled */
            /** @docid_ignore CollectionWidgetItemTemplate_html */
            /** @docid_ignore CollectionWidgetItemTemplate_text */
            /** @docid_ignore CollectionWidgetItemTemplate_visible */
            /** @docid_ignore CollectionWidgetItemTemplate_template */
            /** @docid_ignore CollectionWidgetmethods_itemElements */
            /** @docid_ignore CollectionWidgetmethods_itemsContainer */
            /** @docid_ignore CollectionWidgetmethods_getFocusedItemId */

            /** @docid CollectionWidgetMethods_selectItem */
            selectItem(itemElement: any): void;

            /** @docid CollectionWidgetMethods_unselectItem */
            unselectItem(itemElement: any): void;

            /** @docid CollectionWidgetMethods_deleteItem */
            deleteItem(itemElement: any): JQueryPromise<void>;

            /** @docid CollectionWidgetMethods_isItemSelected */
            isItemSelected(itemElement: any): boolean;

            /** @docid CollectionWidgetMethods_reorderItem */
            reorderItem(itemElement: any, toItemElement: any): JQueryPromise<void>;

            getDataSource(): DevExpress.data.DataSource;
        }

        /** @docid DataExpressionMixin */
        export interface DataExpressionMixinOptions {

            /** @docid_ignore DataExpressionMixinItemTemplate_disabled */
            /** @docid_ignore DataExpressionMixinItemTemplate_html */
            /** @docid_ignore DataExpressionMixinItemTemplate_text */
            /** @docid_ignore DataExpressionMixinItemTemplate_visible */
            /** @docid_ignore DataExpressionMixinItemTemplate_template */

            /** @docid DataExpressionMixinOptions_dataSource */
            dataSource?: any;

            /** @docid DataExpressionMixinOptions_displayExpr  */
            displayExpr?: any;

            /** @docid DataExpressionMixinOptions_valueExpr  */
            valueExpr?: any;

            /** @docid DataExpressionMixinOptions_items */
            items?: Array<any>;

            /** @docid DataExpressionMixinOptions_itemTemplate  */
            itemTemplate?: any;

            /** @docid DataExpressionMixinOptions_value */
            value?: any;
        }

        /** @docid SearchBoxMixin */
        export interface SearchBoxMixinOptions {
            /** @docid SearchBoxMixinOptions_searchEnabled */
            searchEnabled?: boolean;

            /** @docid SearchBoxMixinOptions_searchValue */
            searchValue?: string;

            /** @docid SearchBoxMixinOptions_searchExpr */
            searchExpr?: any;

            /** @docid SearchBoxMixinOptions_searchMode */
            searchMode?: string;

            /** @docid SearchBoxMixinOptions_searchEditorOptions */
            searchEditorOptions?: DevExpress.ui.dxTextBoxOptions;
        }

        export interface EditorOptions extends WidgetOptions {
            /** @docid EditorOptions_value */
            value?: any;

            /** @docid EditorOptions_name */
            name?: string;

            /** @docid EditorOptions_onValueChanged */
            onValueChanged?: Function;

            /** @docid EditorOptions_readOnly */
            readOnly?: boolean;

            /** @docid EditorOptions_validationError */
            validationError?: Object;

            /** @docid EditorOptions_isValid */
            isValid?: boolean;

            /** @docid EditorOptions_validationMessageMode */
            validationMessageMode?: string;
        }

        /** @docid Editor */
        export class Editor extends Widget {

            /** @docid EditorMethods_reset */
            reset(): void;
        }

        /** @docid ui_dialog */
        export var dialog: {
            /** @docid ui_dialogmethods_alert */
            alert(message: string, title: string): JQueryPromise<void>;

            /** @docid ui_dialogmethods_confirm */
            confirm(message: string, title: string): JQueryPromise<boolean>;

            /** @docid ui_dialogmethods_custom */
            custom(options: { title?: string; message?: string; buttons?: Array<Object>; }): {
                show(): JQueryPromise<any>;
                hide(): void;
                hide(value: any): void;
            };
        };

        /** @docid ui_notify#notify(message,type,displayTime) */
        export function notify(message: string, type?: string, displayTime?: number): void;

        /** @docid ui_notify#notify(options,type,displayTime) */
        export function notify(options: Object, type?: string, displayTime?: number): void;

        /** @docid ui_themes */
        export var themes: {
            /** @docid ui_themesmethods_current#current() */
            current(): string;

            /** @docid ui_themesmethods_current#current(themeName) */
            current(themeName: string): void;
        };

        /** @docid ui_setTemplateEngine#setTemplateEngine(name) */
        export function setTemplateEngine(name: string): void;

        /** @docid ui_setTemplateEngine#setTemplateEngine(options) */
        export function setTemplateEngine(options: Object): void;
    }

    /** @docid utils */
    export module utils {
        /** @docid utils_initMobileViewport */
        export function initMobileViewport(options: { allowZoom?: boolean; allowPan?: boolean; allowSelection?: boolean }): void;

        /** @docid utils_requestAnimationFrame */
        export function requestAnimationFrame(callback: Function): number;

        /** @docid utils_cancelAnimationFrame */
        export function cancelAnimationFrame(requestID: number): void;
    }

    /** @docid viz */
    export module viz {
        /** @docid vizmethods_currentTheme#currentTheme(theme) */
        export function currentTheme(theme: string): void;

        /** @docid vizmethods_currentTheme#currentTheme(platform, colorScheme) */
        export function currentTheme(platform: string, colorScheme: string): void;

        /** @docid vizmethods_registerTheme */
        export function registerTheme(customTheme: Object, baseTheme: string): void;

        /** @docid vizmethods_refreshTheme */
        export function refreshTheme(): void;

        /** @docid vizmethods_exportFromMarkup */
        export function exportFromMarkup(markup: string, options: Object): void;

        /** @docid vizmethods_getMarkup */
        export function getMarkup(widgetInstances: Array<Object>): string;

        /** @docid vizmethods_currentPalette */
        export function currentPalette(paletteName: string): void;

        /** @docid vizmethods_getPalette */
        export function getPalette(paletteName: string): Object;

        /** @docid vizmethods_registerPalette */
        export function registerPalette(paletteName: string, palette: Object): void;

        /** @docid vizmethods_refreshPaths */
        export function refreshPaths(): void;
    }
}
