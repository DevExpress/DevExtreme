
/**
 * @docid
 * @namespace DevExpress.data
 * @type object
 */
export interface LoadOptions {
    /**
     * @docid
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid
     * @public
     */
    expand?: any;
    /**
     * @docid
     * @public
     */
    filter?: any;
    /**
     * @docid
     * @public
     */
    group?: any;
    /**
     * @docid
     * @public
     */
    groupSummary?: any;
    /**
     * @docid
     * @public
     */
    parentIds?: Array<any>;
    /**
     * @docid
     * @public
     */
    requireGroupCount?: boolean;
    /**
     * @docid
     * @public
     */
    requireTotalCount?: boolean;
    /**
     * @docid
     * @type getter|Array<getter>
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @public
     */
    searchOperation?: string;
    /**
     * @docid
     * @public
     */
    searchValue?: any;
    /**
     * @docid
     * @public
     */
    select?: any;
    /**
     * @docid
     * @public
     */
    skip?: number;
    /**
     * @docid
     * @public
     */
    sort?: any;
    /**
     * @docid
     * @public
     */
    take?: number;
    /**
     * @docid
     * @public
     */
    totalSummary?: any;
    /**
     * @docid
     * @public
     */
    userData?: any;
}
