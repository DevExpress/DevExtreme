/** @namespace DevExpress.data */
export interface XmlaStoreOptions {
    /**
     * @docid
     * @type_function_param1 options:object
     * @type_function_param1_field1 url:string
     * @type_function_param1_field2 method:string
     * @type_function_param1_field3 headers:object
     * @type_function_param1_field4 xhrFields:object
     * @type_function_param1_field5 data:string
     * @type_function_param1_field6 dataType:string
     * @public
     */
    beforeSend?: ((options: { url?: string; method?: string; headers?: any; xhrFields?: any; data?: string; dataType?: string }) => void);
    /**
     * @docid
     * @public
     */
    catalog?: string;
    /**
     * @docid
     * @public
     */
    cube?: string;
    /**
     * @docid
     * @public
     */
    url?: string;
}
/**
 * @docid
 * @namespace DevExpress.data
 * @module ui/pivot_grid/xmla_store
 * @export default
 * @public
 */
 // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class XmlaStore {
    constructor(options?: XmlaStoreOptions)
}
