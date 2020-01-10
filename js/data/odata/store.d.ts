import '../../jquery_augmentation';

import Store, {
    StoreOptions
} from '../abstract_store';

import {
    LoadOptions
} from '../load_options';

export interface ODataStoreOptions extends StoreOptions<ODataStore> {
    /**
     * @docid ODataStoreOptions.beforeSend
     * @type function
     * @type_function_param1 options:object
     * @type_function_param1_field1 url:string
     * @type_function_param1_field2 async:boolean
     * @type_function_param1_field3 method:string
     * @type_function_param1_field4 timeout:number
     * @type_function_param1_field5 params:object
     * @type_function_param1_field6 payload:object
     * @type_function_param1_field7 headers:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
    /**
     * @docid ODataStoreOptions.deserializeDates
     * @type boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid ODataStoreOptions.errorHandler
     * @type function
     * @type_function_param1 e:Error
     * @type_function_param1_field1 httpStatus:number
     * @type_function_param1_field2 errorDetails:object
     * @type_function_param1_field3 requestOptions:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
    /**
     * @docid ODataStoreOptions.fieldTypes
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.data
     * @public
     */
    fieldTypes?: any;
    /**
     * @docid ODataStoreOptions.filterToLower
     * @type boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid ODataStoreOptions.jsonp
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid ODataStoreOptions.keyType
     * @type string|object
     * @acceptValues "String"|"Int32"|"Int64"|"Guid"|"Boolean"|"Single"|"Decimal"
     * @prevFileNamespace DevExpress.data
     * @public
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * @docid ODataStoreOptions.onLoading
     * @action
     * @prevFileNamespace DevExpress.data
     * @public
     */
    onLoading?: ((loadOptions: LoadOptions) => any);
    /**
     * @docid ODataStoreOptions.url
     * @type string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    url?: string;
    /**
     * @docid ODataStoreOptions.version
     * @type number
     * @default 2
     * @acceptValues 2|3|4
     * @prevFileNamespace DevExpress.data
     * @public
     */
    version?: number;
    /**
     * @docid ODataStoreOptions.withCredentials
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    withCredentials?: boolean;
}
/**
 * @docid ODataStore
 * @inherits Store
 * @type object
 * @module data/odata/store
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class ODataStore extends Store {
    constructor(options?: ODataStoreOptions)
    byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
    /**
     * @docid ODataStoreMethods.byKey
     * @publicName byKey(key, extraOptions)
     * @param1 key:object|string|number
     * @param2 extraOptions:object
     * @param2_field1 expand:string|Array<string>
     * @param2_field2 select:string|Array<string>
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    byKey(key: any | string | number, extraOptions: { expand?: string | Array<string>, select?: string | Array<string> }): Promise<any> & JQueryPromise<any>;
    /**
     * @docid ODataStoreMethods.createQuery
     * @publicName createQuery(loadOptions)
     * @param1 loadOptions:object
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    createQuery(loadOptions: any): any;
}
