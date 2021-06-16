import {
    DxPromise
} from '../core/utils/deferred';

import {
    LoadOptions
} from './load_options';

/** @namespace DevExpress.data */
export interface StoreOptions<TKey = any, TValue = any> {
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
    onInserted?: ((values: TValue, key: TKey) => void);
    /**
     * @docid
     * @type_function_param1 values:object
     * @action
     * @public
     */
    onInserting?: ((values: TValue) => void);
    /**
     * @docid
     * @type_function_param1 result:Array<any>
     * @type_function_param2 loadOptions:LoadOptions
     * @action
     * @public
     */
    onLoaded?: ((result: Array<TValue>, loadOptions: LoadOptions) => void);
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
    onPush?: ((changes: Array<TValue>) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoved?: ((key: TKey) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoving?: ((key: TKey) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdated?: ((key: TKey, values: TValue) => void);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdating?: ((key: TKey, values: TValue) => void);
}

type EventNames = 'loaded'|'loading'|'inserted'|'inserting'|'updated'|'updating'|'push'|'removed'|'removing'|'modified'|'modifying';

/**
 * @docid
 * @hidden
 * @module data/abstract_store
 * @export default
 * @namespace DevExpress.data
 */
export default class Store<TKey = any, TValue = any> {
    constructor(options?: StoreOptions<TKey, TValue>)
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @param2 extraOptions:LoadOptions
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey, extraOptions?: LoadOptions): DxPromise<TValue>;
    /**
     * @docid
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @public
     */
    insert(values: TValue): DxPromise<TValue>;
    /**
     * @docid
     * @publicName key()
     * @return string|Array<string>
     * @public
     */
    key(): string | Array<string>;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any|string|number
     * @public
     */
    keyOf(obj: TValue): TKey;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @public
     */
    load(): DxPromise<Array<TValue>>;
    /**
     * @docid
     * @publicName load(options)
     * @param1 options:LoadOptions
     * @return Promise<any>
     * @public
     */
    load(options: LoadOptions): DxPromise<Array<TValue>>;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: EventNames): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    off(eventName: EventNames, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    on(eventName: EventNames, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
     on(events: {[key in EventNames]?: Function}): this;
    /**
     * @docid
     * @publicName push(changes)
     * @param1 changes:Array<any>
     * @public
     */
    push(changes: Array<{type: 'insert' | 'update' | 'remove', data?: TValue, key?: TKey, index?: number}>): void;
    /**
     * @docid
     * @publicName remove(key)
     * @param1 key:object|string|number
     * @return Promise<void>
     * @public
     */
    remove(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName totalCount(options)
     * @param1 obj:object
     * @param1_field1 filter:object
     * @param1_field2 group:object
     * @return Promise<number>
     * @public
     */
    totalCount(obj: { filter?: Array<any>, group?: Array<any> }): DxPromise<number>;
    /**
     * @docid
     * @publicName update(key, values)
     * @param1 key:object|string|number
     * @param2 values:object
     * @return Promise<any>
     * @public
     */
    update(key: TKey, values: TValue): DxPromise<TValue>;
}
