
/**
 * @docid
 * @namespace DevExpress.data
 * @type object
 */
export interface LoadOptions {
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    expand?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    groupSummary?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    parentIds?: Array<any>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireGroupCount?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireTotalCount?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    skip?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    take?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    totalSummary?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.data
     * @public
     */
    userData?: any;
}
