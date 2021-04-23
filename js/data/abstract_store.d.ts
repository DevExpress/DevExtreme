import {
    DxPromise
} from '../core/utils/deferred';

import {
    LoadOptions
} from './load_options';

export interface StoreOptions<T = Store> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    errorHandler?: Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    key?: string | Array<string>;
    /**
     * @docid
     * @type_function_param1 values:object
     * @type_function_param2 key:object|string|number
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onInserted?: ((values: any, key: any | string | number) => void);
    /**
     * @docid
     * @type_function_param1 values:object
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onInserting?: ((values: any) => void);
    /**
     * @docid
     * @type_function_param1 result:Array<any>
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoaded?: ((result: Array<any>) => void);
    /**
     * @docid
     * @type_function_param1 loadOptions:LoadOptions
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions) => void);
    /**
     * @docid
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onModified?: Function;
    /**
     * @docid
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onModifying?: Function;
    /**
     * @docid
     * @type_function_param1 changes:Array<any>
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onPush?: ((changes: Array<any>) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onRemoved?: ((key: any | string | number) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onRemoving?: ((key: any | string | number) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onUpdated?: ((key: any | string | number, values: any) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onUpdating?: ((key: any | string | number, values: any) => void);
}
/**
 * @docid
 * @hidden
 * @module data/abstract_store
 * @export default
 * @prevFileNamespace DevExpress.data
 */
export default class Store {
    constructor(options?: StoreOptions)
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    byKey(key: any | string | number): DxPromise<any>;
    /**
     * @docid
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    insert(values: any): DxPromise<any>;
    /**
     * @docid
     * @publicName key()
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    key(): any;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    keyOf(obj: any): any;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    load(): DxPromise<any>;
    /**
     * @docid
     * @publicName load(options)
     * @param1 options:LoadOptions
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    load(options: LoadOptions): DxPromise<any>;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @prevFileNamespace DevExpress.data
     * @public
     */
    on(events: any): this;
    /**
     * @docid
     * @publicName push(changes)
     * @param1 changes:Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    push(changes: Array<any>): void;
    /**
     * @docid
     * @publicName remove(key)
     * @param1 key:object|string|number
     * @return Promise<void>
     * @prevFileNamespace DevExpress.data
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
     * @prevFileNamespace DevExpress.data
     * @public
     */
    totalCount(obj: { filter?: any, group?: any }): DxPromise<number>;
    /**
     * @docid
     * @publicName update(key, values)
     * @param1 key:object|string|number
     * @param2 values:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    update(key: any | string | number, values: any): DxPromise<any>;
}
