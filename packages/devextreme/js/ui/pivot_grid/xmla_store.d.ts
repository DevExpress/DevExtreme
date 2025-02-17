/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface XmlaStoreOptions {
    /**
     * Specifies a function that customizes the request before it is sent to the server.
     */
    beforeSend?: ((options: { url?: string; method?: string; headers?: any; xhrFields?: any; data?: string; dataType?: string }) => void);
    /**
     * Specifies the database (or initial catalog) that contains the OLAP cube to use.
     */
    catalog?: string;
    /**
     * Specifies the name of the OLAP cube to use from the catalog.
     */
    cube?: string;
    /**
     * Specifies the OLAP server&apos;s URL.
     */
    url?: string;
}
/**
                                                                     * The XmlaStore is a store that provides an interface for accessing an OLAP cube according to the XMLA standard.
                                                                     */
                                                                    export default class XmlaStore {
    constructor(options?: XmlaStoreOptions);
}
