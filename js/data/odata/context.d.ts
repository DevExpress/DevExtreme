import {
    DxPromise,
} from '../../core/utils/deferred';

export interface ODataRequestOptions {
    accepts: any;
    async: boolean;
    contentType: string | boolean;
    data: any;
    dataType: string;
    headers: any;
    jsonp?: boolean;
    method: string;
    timeout: number;
    url: string;
    xhrFields: any;
}

/**
 * @docid
 * @namespace DevExpress.data
 * @type object
 */
export interface ODataContextOptions {
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
     * @public
     */
    entities?: any;
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
 * @public
 * @options ODataContextOptions
 */
export default class ODataContext {
    constructor(options?: ODataContextOptions);
    /**
     * @docid
     * @publicName get(operationName, params)
     * @param2 params:object
     * @return Promise<any>
     * @public
     */
    get(operationName: string, params: any): DxPromise<any>;
    /**
     * @docid
     * @publicName invoke(operationName, params, httpMethod)
     * @param2 params:object
     * @param3 httpMethod:string
     * @return Promise<void>
     * @public
     */
    invoke(operationName: string, params: any, httpMethod: HttpMethod): DxPromise<void>;
    /**
     * @docid
     * @publicName objectLink(entityAlias, key)
     * @param2 key:object|string|number
     * @return object
     * @public
     */
    objectLink(entityAlias: string, key: any | string | number): any;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'MERGE';
