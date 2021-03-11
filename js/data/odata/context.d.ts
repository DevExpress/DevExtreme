import {
    TPromise
} from '../../core/utils/deferred';

export interface ODataContextOptions {
    /**
     * @docid
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
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    entities?: any;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field1 httpStatus:number
     * @type_function_param1_field2 errorDetails:object
     * @type_function_param1_field3 requestOptions:object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    url?: string;
    /**
     * @docid
     * @default 2
     * @acceptValues 2|3|4
     * @prevFileNamespace DevExpress.data
     * @public
     */
    version?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    withCredentials?: boolean;
}
/**
 * @docid
 * @module data/odata/context
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class ODataContext {
    constructor(options?: ODataContextOptions)
    /**
     * @docid
     * @publicName get(operationName, params)
     * @param1 operationName:string
     * @param2 params:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    get(operationName: string, params: any): TPromise<any>;
    /**
     * @docid
     * @publicName invoke(operationName, params, httpMethod)
     * @param1 operationName:string
     * @param2 params:object
     * @param3 httpMethod:object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    invoke(operationName: string, params: any, httpMethod: any): TPromise<void>;
    /**
     * @docid
     * @publicName objectLink(entityAlias, key)
     * @param1 entityAlias:string
     * @param2 key:object|string|number
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    objectLink(entityAlias: string, key: any | string | number): any;
}
