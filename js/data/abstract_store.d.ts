import {
    JQueryPromise
} from '../common';

import {
    LoadOptions
} from './load_options';

export interface StoreOptions<T = Store> {
    /**
     * @docid StoreOptions.errorHandler
     * @type function
     * @prevFileNamespace DevExpress.data
     * @public
     */
    errorHandler?: Function;
    /**
     * @docid StoreOptions.key
     * @type string|Array<string>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    key?: string | Array<string>;
    /**
     * @docid StoreOptions.onInserted
     * @type function
     * @type_function_param1 values:object
     * @type_function_param2 key:object|string|number
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onInserted?: ((values: any, key: any | string | number) => any);
    /**
     * @docid StoreOptions.onInserting
     * @type function
     * @type_function_param1 values:object
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onInserting?: ((values: any) => any);
    /**
     * @docid StoreOptions.onLoaded
     * @type function
     * @type_function_param1 result:Array<any>
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoaded?: ((result: Array<any>) => any);
    /**
     * @docid StoreOptions.onLoading
     * @type function
     * @type_function_param1 loadOptions:LoadOptions
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions) => any);
    /**
     * @docid StoreOptions.onModified
     * @type function
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onModified?: Function;
    /**
     * @docid StoreOptions.onModifying
     * @type function
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onModifying?: Function;
    /**
     * @docid StoreOptions.onPush
     * @type function
     * @type_function_param1 changes:Array<any>
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onPush?: ((changes: Array<any>) => any);
    /**
     * @docid StoreOptions.onRemoved
     * @type function
     * @type_function_param1 key:object|string|number
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onRemoved?: ((key: any | string | number) => any);
    /**
     * @docid StoreOptions.onRemoving
     * @type function
     * @type_function_param1 key:object|string|number
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onRemoving?: ((key: any | string | number) => any);
    /**
     * @docid StoreOptions.onUpdated
     * @type function
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onUpdated?: ((key: any | string | number, values: any) => any);
    /**
     * @docid StoreOptions.onUpdating
     * @type function
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onUpdating?: ((key: any | string | number, values: any) => any);
}
/**
 * @docid Store
 * @type object
 * @inherits EventsMixin
 * @hidden
 * @module data/abstract_store
 * @export default
 * @prevFileNamespace DevExpress.data
 */
export default class Store {
    constructor(options?: StoreOptions)
    /**
     * @docid StoreMethods.byKey
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
    /**
     * @docid StoreMethods.insert
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    insert(values: any): Promise<any> & JQueryPromise<any>;
    /**
     * @docid StoreMethods.key
     * @publicName key()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    key(): any;
    /**
     * @docid StoreMethods.keyOf
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    keyOf(obj: any): any;
    /**
     * @docid StoreMethods.load
     * @publicName load()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    load(): Promise<any> & JQueryPromise<any>;
    /**
     * @docid StoreMethods.load
     * @publicName load(options)
     * @param1 options:LoadOptions
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    load(options: LoadOptions): Promise<any> & JQueryPromise<any>;
    off(eventName: string): this;
    off(eventName: string, eventHandler: Function): this;
    on(eventName: string, eventHandler: Function): this;
    on(events: any): this;
    /**
     * @docid StoreMethods.push
     * @publicName push(changes)
     * @param1 changes:Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    push(changes: Array<any>): void;
    /**
     * @docid StoreMethods.remove
     * @publicName remove(key)
     * @param1 key:object|string|number
     * @return Promise<void>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    remove(key: any | string | number): Promise<void> & JQueryPromise<void>;
    /**
     * @docid StoreMethods.totalCount
     * @publicName totalCount(options)
     * @param1 obj:object
     * @param1_field1 filter:object
     * @param1_field2 group:object
     * @return Promise<number>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    totalCount(obj: { filter?: any, group?: any }): Promise<number> & JQueryPromise<number>;
    /**
     * @docid StoreMethods.update
     * @publicName update(key, values)
     * @param1 key:object|string|number
     * @param2 values:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    update(key: any | string | number, values: any): Promise<any> & JQueryPromise<any>;
}
