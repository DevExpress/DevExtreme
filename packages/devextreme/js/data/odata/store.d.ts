import { DxPromise } from '../../core/utils/deferred';
import AbstractStore, { AbstractStoreOptions } from '../abstract_store';
import { Query } from '../query';
import { ODataRequestOptions } from './context';

/**
 * @docid
 * @public
 * @namespace DevExpress.data
 */
export interface ODataStoreOptions<
    TItem = any,
    TKey = any,
> extends AbstractStoreOptions<TItem, TKey> {
    /**
     * @docid
     * @type_function_param1_field params:object
     * @type_function_param1_field payload:object
     * @type_function_param1_field headers:object
     * @public
     */
    beforeSend?: ((options: { url: string; async: boolean; method: string; timeout: number; params: any; payload: any; headers: any }) => void);
    /**
     * @docid
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field errorDetails:object
     * @type_function_param1_field requestOptions:object
     * @public
     */
    errorHandler?: ((e: { httpStatus: number; errorDetails: any; requestOptions: ODataRequestOptions }) => void);
    /**
     * @docid
     * @default {}
     * @public
     */
    fieldTypes?: any;
    /**
     * @docid
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid
     * @type string|object
     * @acceptValues "String"|"Int32"|"Int64"|"Guid"|"Boolean"|"Single"|"Decimal"
     * @public
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * @docid
     * @public
     */
    url?: string;
    /**
     * @docid
     * @default 4
     * @acceptValues 2|3|4
     * @public
     */
    version?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    withCredentials?: boolean;
}

/**
 * @docid
 * @inherits Store
 * @public
 * @options ODataStoreOptions
 */
export class ODataStore<
    TItem = any,
    TKey = any,
> extends AbstractStore<TItem, TKey> {
    constructor(options?: ODataStoreOptions<TItem, TKey>);
    /**
     * @docid
     * @publicName byKey(key, extraOptions)
     * @param1 key:object|string|number
     * @return Promise<any>
     * @public
     */
    byKey(key: TKey, extraOptions?: { expand?: string | Array<string>; select?: string | Array<string> }): DxPromise<TItem>;
    /**
     * @docid
     * @publicName createQuery(loadOptions)
     * @return object
     * @public
     */
    createQuery(loadOptions?: { expand?: string | Array<string>; requireTotalCount?: boolean; customQueryParams?: any }): Query;
}

/**
 * @deprecated Use ODataStoreOptions from /common/data instead
 * @namespace DevExpress.data.ODataStore
 */
export type Options<
    TItem = any,
    TKey = any,
> = ODataStoreOptions<TItem, TKey>;

export default ODataStore;
