import Store, {
    StoreOptions
} from './abstract_store';

import {
    LoadOptions
} from './load_options';

/** @namespace DevExpress.data */
export interface CustomStoreOptions extends StoreOptions<CustomStore> {
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_return Promise<any>
     * @public
     */
    byKey?: ((key: any | string | number) => PromiseLike<any>);
    /**
     * @docid
     * @default true
     * @public
     */
    cacheRawData?: boolean;
    /**
     * @docid
     * @type_function_param1 values:object
     * @type_function_return Promise<any>
     * @public
     */
    insert?: ((values: any) => PromiseLike<any>);
    /**
     * @docid
     * @type_function_param1 options:LoadOptions
     * @type_function_return Promise<any>|Array<any>
     * @public
     */
    load?: ((options: LoadOptions) => PromiseLike<any> | Array<any>);
    /**
     * @docid
     * @type string
     * @default 'processed'
     * @acceptValues 'processed'|'raw'
     * @public
     */
    loadMode?: 'processed' | 'raw';
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_return Promise<void>
     * @public
     */
    remove?: ((key: any | string | number) => PromiseLike<void>);
    /**
     * @docid
     * @type_function_param1 loadOptions:object
     * @type_function_param1_field1 filter:object
     * @type_function_param1_field2 group:object
     * @type_function_return Promise<number>
     * @public
     */
    totalCount?: ((loadOptions: { filter?: any, group?: any }) => PromiseLike<number>);
    /**
     * @docid
     * @type_function_param1 key:object|string|number
     * @type_function_param2 values:object
     * @type_function_return Promise<any>
     * @public
     */
    update?: ((key: any | string | number, values: any) => PromiseLike<any>);
    /**
     * @docid
     * @default undefined
     * @public
     */
    useDefaultSearch?: boolean;
}
/**
 * @docid
 * @inherits Store
 * @module data/custom_store
 * @export default
 * @public
 */
export default class CustomStore extends Store {
    constructor(options?: CustomStoreOptions)
    /**
     * @docid
     * @publicName clearRawDataCache()
     * @public
     */
    clearRawDataCache(): void;
}
