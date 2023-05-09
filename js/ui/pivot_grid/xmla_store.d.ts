/**
 * @namespace DevExpress.data
 * @docid
 */
export interface XmlaStoreOptions {
    /**
     * @docid
     * @type_function_param1_field headers:object
     * @type_function_param1_field xhrFields:object
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
 * @public
 */
 // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class XmlaStore {
    constructor(options?: XmlaStoreOptions);
}
