import {
    DxPromise,
} from '../core/utils/deferred';

import {
    LoadOptions,
} from './index';

export type Options = StoreOptions;

/** @namespace DevExpress.data */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
     * @action
     * @public
     */
    onLoaded?: ((result: Array<any>) => void);
    /**
     * @docid
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
 * @namespace DevExpress.data
 */
export default class Store {
    constructor(options?: Options)
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
     * @public
     */
    key(): any;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
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
     * @return Promise<any>
     * @public
     */
    load(options: LoadOptions): DxPromise<any>;
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
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: any): this;
    /**
     * @docid
     * @publicName push(changes)
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
     * @param1_field1 filter:object
     * @param1_field2 group:object
     * @return Promise<number>
     * @public
     */
    totalCount(obj: { filter?: any; group?: any }): DxPromise<number>;
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
