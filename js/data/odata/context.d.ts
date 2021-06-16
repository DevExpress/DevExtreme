import {
    DxPromise
} from '../../core/utils/deferred';

export interface ODataRequestOptions {
    accepts: any;
    async: boolean;
    contentType: string | false;
    data: any;
    dataType: string;
    headers: any;
    jsonp?: boolean;
    method: Lowercase<HttpMethod>;
    timeout: number;
    url: string;
    xhrFields: any;
}

/** @namespace DevExpress.data */
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
     * @public
     */
    beforeSend?: ((options: { url: string, async: boolean, method: string, timeout: number, params: any, payload: any, headers: any }) => void);
    /**
     * @docid
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid
     * @public
     */
    entities?: any;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field1 httpStatus:number
     * @type_function_param1_field2 errorDetails:object
     * @type_function_param1_field3 requestOptions:object
     * @public
     */
    errorHandler?: ((e: { httpStatus: number, errorDetails: any, requestOptions: ODataRequestOptions }) => void);
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
     * @public
     */
    url?: string;
    /**
     * @docid
     * @default 2
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
 * @module data/odata/context
 * @export default
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
     * @public
     */
    get(operationName: string, params: any): DxPromise<any>;
    /**
     * @docid
     * @publicName invoke(operationName, params, httpMethod)
     * @param1 operationName:string
     * @param2 params:object
     * @param3 httpMethod:string
     * @return Promise<void>
     * @public
     */
    invoke(operationName: string, params: any, httpMethod: HttpMethod): DxPromise<void>;
    /**
     * @docid
     * @publicName objectLink(entityAlias, key)
     * @param1 entityAlias:string
     * @param2 key:object|string|number
     * @return object
     * @public
     */
    objectLink(entityAlias: string, key: any | string | number): any;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'MERGE';