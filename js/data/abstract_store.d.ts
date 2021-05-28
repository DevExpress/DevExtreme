import {
    DxPromise
} from '../core/utils/deferred';

import {
    LoadOptions
} from './load_options';

/** @namespace DevExpress.data */
export interface StoreOptions<T = Store> {
    /**
     * @docid
     * @public
     */
    errorHandler?: Function;
    /**
     * @docid
     * @public
     */
    key?: string | Array<string>;
    /**
     * @docid
     * @type_function_param1 values:object
     * @type_function_param2 key:object|string|number
     * @action
     * @public
     */
    onInserted?: ((values: any, key: any | string | number) => void);
    /**
     * @docid
     * @type_function_param1 values:object
     * @action
     * @public
     */
    onInserting?: ((values: any) => void);
    /**
     * @docid
     * @type_function_param1 result:Array<any>
     * @action
     * @public
     */
    onLoaded?: ((result: Array<any>) => void);
    /**
     * @docid
     * @type_function_param1 loadOptions:LoadOptions
     * @action
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions) => void);
    /**
     * @docid
     * @action
     * @public
     */
    onModified?: Function;
    /**
     * @docid
     * @action
     * @public
     */
    onModifying?: Function;
    /**
     * @docid
     * @type_function_param1 changes:Array<any>
     * @action
     * @public
     */
    onPush?: ((changes: Array<any>) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoved?: ((key: any | string | number) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoving?: ((key: any | string | number) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdated?: ((key: any | string | number, values: any) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdating?: ((key: any | string | number, values: any) => void);
}
/**
 * @docid
 * @hidden
 * @module data/abstract_store
 * @export default
 * @namespace DevExpress.data
 */
export default class Store {
    constructor(options?: StoreOptions)
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @public
     */
    byKey(key: any | string | number): DxPromise<any>;
    /**
     * @docid
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @public
     */
    insert(values: any): DxPromise<any>;
    /**
     * @docid
     * @publicName key()
     * @return any
     * @public
     */
    key(): any;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any
     * @public
     */
    keyOf(obj: any): any;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @public
     */
    load(): DxPromise<any>;
    /**
     * @docid
     * @publicName load(options)
     * @param1 options:LoadOptions
     * @return Promise<any>
     * @public
     */
    load(options: LoadOptions): DxPromise<any>;
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
     * @publicName push(changes)
     * @param1 changes:Array<any>
     * @public
     */
    push(changes: Array<any>): void;
    /**
     * @docid
     * @publicName remove(key)
     * @param1 key:object|string|number
     * @return Promise<void>
     * @public
     */
    remove(key: any | string | number): DxPromise<void>;
    /**
     * @docid
     * @publicName totalCount(options)
     * @param1 obj:object
     * @param1_field1 filter:object
     * @param1_field2 group:object
     * @return Promise<number>
     * @public
     */
    totalCount(obj: { filter?: any, group?: any }): DxPromise<number>;
    /**
     * @docid
     * @publicName update(key, values)
     * @param1 key:object|string|number
     * @param2 values:object
     * @return Promise<any>
     * @public
     */
    update(key: any | string | number, values: any): DxPromise<any>;
}
