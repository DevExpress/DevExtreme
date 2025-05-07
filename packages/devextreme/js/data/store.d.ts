import { DxPromise, DxExtendedPromise } from '../core/utils/deferred';
import { DeepPartial } from '../core';
import { FilterDescriptor, GroupDescriptor, LoadOptions } from '../common/data';

/**
 * @docid StoreOptions
 * @namespace DevExpress.common.data
 * @hidden
 */
export type StoreOptions<
    TItem = any,
    TKey = any,
> = {
    /**
     * @docid StoreOptions.errorHandler
     * @public
     */
    errorHandler?: Function;
    /**
     * @docid StoreOptions.key
     * @public
     */
    key?: string | Array<string>;
    /**
     * @docid StoreOptions.onInserted
     * @type_function_param1 values:object
     * @type_function_param2 key:object|string|number
     * @action
     * @public
     */
    onInserted?: ((values: TItem, key: TKey) => void);
    /**
     * @docid StoreOptions.onInserting
     * @type_function_param1 values:object
     * @action
     * @public
     */
    onInserting?: ((values: TItem) => void);
    /**
     * @docid StoreOptions.onLoading
     * @type_function_param1 loadOptions:LoadOptions
     * @action
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions<TItem>) => void);
    /**
     * @docid StoreOptions.onModified
     * @action
     * @public
     */
    onModified?: Function;
    /**
     * @docid StoreOptions.onModifying
     * @action
     * @public
     */
    onModifying?: Function;
    /**
     * @docid StoreOptions.onPush
     * @action
     * @public
     */
    onPush?: ((changes: Array<TItem>) => void);
    /**
     * @docid StoreOptions.onRemoved
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoved?: ((key: TKey) => void);
    /**
     * @docid StoreOptions.onRemoving
     * @type_function_param1 key:object|string|number
     * @action
     * @public
     */
    onRemoving?: ((key: TKey) => void);
    /**
     * @docid StoreOptions.onUpdated
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdated?: ((key: TKey, values: TItem) => void);
    /**
     * @docid StoreOptions.onUpdating
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @action
     * @public
     */
    onUpdating?: ((key: TKey, values: TItem) => void);
};

type StoreEventName = 'loaded' | 'loading' | 'inserted' | 'inserting' | 'updated' | 'updating' | 'push' | 'removed' | 'removing' | 'modified' | 'modifying';

/**
 * @docid Store
 * @namespace DevExpress.common.data
 * @hidden
 * @options StoreOptions
 */
export class Store<
    TItem = any,
    TKey = any,
> {
    constructor(options?: StoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName insert(values)
     * @param1 values:object
     * @return Promise<any>
     * @public
     */
    insert(values: TItem): DxExtendedPromise<TItem>;
    /**
     * @docid
     * @publicName key()
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
    keyOf(obj: TItem): TKey;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: StoreEventName): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: StoreEventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @return this
     * @public
     */
    on(eventName: StoreEventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: { [key in StoreEventName]?: Function }): this;
    /**
     * @docid
     * @publicName push(changes)
     * @param1 changes:Array<any>
     * @public
     */
    push(changes: Array<{ type: 'insert' | 'update' | 'remove'; data?: DeepPartial<TItem>; key?: TKey; index?: number }>): void;
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
     * @param1_field filter:object
     * @param1_field group:object
     * @return Promise<number>
     * @public
     */
    totalCount(obj: { filter?: FilterDescriptor | Array<FilterDescriptor>; group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>> }): DxPromise<number>;
    /**
     * @docid
     * @publicName update(key, values)
     * @param1 key:object|string|number
     * @param2 values:object
     * @return Promise<any>
     * @public
     */
    update(key: TKey, values: DeepPartial<TItem>): DxExtendedPromise<TItem>;
}
