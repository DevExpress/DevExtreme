import { DxPromise, DxExtendedPromise } from '../core/utils/deferred';
import { DeepPartial } from '../core';
import { FilterDescriptor, GroupDescriptor, LoadOptions } from '../common/data';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type StoreOptions<
    TItem = any,
    TKey = any,
> = {
    /**
     * Specifies the function that is executed when the store throws an error.
     */
    errorHandler?: Function;
    /**
     * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique.
     */
    key?: string | Array<string>;
    /**
     * A function that is executed after a data item is added to the store.
     */
    onInserted?: ((values: TItem, key: TKey) => void);
    /**
     * A function that is executed before a data item is added to the store.
     */
    onInserting?: ((values: TItem) => void);
    /**
     * A function that is executed before data is loaded to the store.
     */
    onLoading?: ((loadOptions: LoadOptions<TItem>) => void);
    /**
     * A function that is executed after a data item is added, updated, or removed from the store.
     */
    onModified?: Function;
    /**
     * A function that is executed before a data item is added, updated, or removed from the store.
     */
    onModifying?: Function;
    /**
     * The function executed before changes are pushed to the store.
     */
    onPush?: ((changes: Array<TItem>) => void);
    /**
     * A function that is executed after a data item is removed from the store.
     */
    onRemoved?: ((key: TKey) => void);
    /**
     * A function that is executed before a data item is removed from the store.
     */
    onRemoving?: ((key: TKey) => void);
    /**
     * A function that is executed after a data item is updated in the store.
     */
    onUpdated?: ((key: TKey, values: TItem) => void);
    /**
     * A function that is executed before a data item is updated in the store.
     */
    onUpdating?: ((key: TKey, values: TItem) => void);
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type StoreEventName = 'loaded' | 'loading' | 'inserted' | 'inserting' | 'updated' | 'updating' | 'push' | 'removed' | 'removing' | 'modified' | 'modifying';

/**
 * The base class for all Stores.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export class Store<
    TItem = any,
    TKey = any,
> {
    constructor(options?: StoreOptions<TItem, TKey>);
    /**
     * Adds a data item to the store.
     */
    insert(values: TItem): DxExtendedPromise<TItem>;
    /**
     * Gets the key property (or properties) as specified in the key property.
     */
    key(): string | Array<string>;
    /**
     * Gets a data item&apos;s key value.
     */
    keyOf(obj: TItem): TKey;
    /**
     * Detaches all event handlers from a single event.
     */
    off(eventName: StoreEventName): this;
    /**
     * Detaches a particular event handler from a single event.
     */
    off(eventName: StoreEventName, eventHandler: Function): this;
    /**
     * Subscribes to an event.
     */
    on(eventName: StoreEventName, eventHandler: Function): this;
    /**
     * Subscribes to events.
     */
    on(events: { [key in StoreEventName]?: Function }): this;
    /**
     * Pushes data changes to the store and notifies the DataSource.
     */
    push(changes: Array<{ type: 'insert' | 'update' | 'remove'; data?: DeepPartial<TItem>; key?: TKey; index?: number }>): void;
    /**
     * Removes a data item with a specific key from the store.
     */
    remove(key: TKey): DxPromise<void>;
    /**
     * Gets the total count of items the load() function returns.
     */
    totalCount(obj: { filter?: FilterDescriptor | Array<FilterDescriptor>; group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>> }): DxPromise<number>;
    /**
     * Updates a data item with a specific key.
     */
    update(key: TKey, values: DeepPartial<TItem>): DxExtendedPromise<TItem>;
}
