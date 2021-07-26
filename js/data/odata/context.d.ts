import {
    DxPromise,
} from '../../core/utils/deferred';

export interface ODataRequestOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accepts: any;
    async: boolean;
    contentType: string | boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    dataType: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: any;
    jsonp?: boolean;
    method: string;
    timeout: number;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entities?: any;
    /**
     * @docid
     * @type_function_param1 e:Error
     * @type_function_param1_field1 httpStatus:number
     * @type_function_param1_field2 errorDetails:object
     * @type_function_param1_field3 requestOptions:object
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    invoke(operationName: string, params: any, httpMethod: HttpMethod): DxPromise<void>;
    /**
     * @docid
     * @publicName objectLink(entityAlias, key)
     * @param1 entityAlias:string
     * @param2 key:object|string|number
     * @return object
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectLink(entityAlias: string, key: any | string | number): any;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'MERGE';
