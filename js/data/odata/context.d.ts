import {
    JQueryPromise
} from '../../common';

export interface ODataContextOptions {
    /**
     * @docid ODataContextOptions.beforeSend
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
     * @docid ODataContextOptions.deserializeDates
     * @type boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    deserializeDates?: boolean;
    /**
     * @docid ODataContextOptions.entities
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    entities?: any;
    /**
     * @docid ODataContextOptions.errorHandler
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
     * @docid ODataContextOptions.filterToLower
     * @type boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filterToLower?: boolean;
    /**
     * @docid ODataContextOptions.jsonp
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    jsonp?: boolean;
    /**
     * @docid ODataContextOptions.url
     * @type string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    url?: string;
    /**
     * @docid ODataContextOptions.version
     * @type number
     * @default 2
     * @acceptValues 2|3|4
     * @prevFileNamespace DevExpress.data
     * @public
     */
    version?: number;
    /**
     * @docid ODataContextOptions.withCredentials
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.data
     * @public
     */
    withCredentials?: boolean;
}
/**
 * @docid ODataContext
 * @type object
 * @module data/odata/context
 * @export default
 * @prevFileNamespace DevExpress.data
 * @public
 */
export default class ODataContext {
    constructor(options?: ODataContextOptions)
    /**
     * @docid ODataContextmethods.get
     * @publicName get(operationName, params)
     * @param1 operationName:string
     * @param2 params:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    get(operationName: string, params: any): Promise<any> & JQueryPromise<any>;
    /**
     * @docid ODataContextmethods.invoke
     * @publicName invoke(operationName, params, httpMethod)
     * @param1 operationName:string
     * @param2 params:object
     * @param3 httpMethod:object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    invoke(operationName: string, params: any, httpMethod: any): Promise<void> & JQueryPromise<void>;
    /**
     * @docid ODataContextmethods.objectLink
     * @publicName objectLink(entityAlias, key)
     * @param1 entityAlias:string
     * @param2 key:object|string|number
     * @return object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    objectLink(entityAlias: string, key: any | string | number): any;
}
