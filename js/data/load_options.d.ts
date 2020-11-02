
/**
 * @docid
 * @namespace DevExpress.data
 * @type object
 */
export interface LoadOptions {
    /**
     * @docid
     * @type Object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    expand?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    filter?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    group?: any;
    /**
     * @docid
     * @type Object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    groupSummary?: any;
    /**
     * @docid
     * @type Array<any>
     * @prevFileNamespace DevExpress.data
     * @public
     */
    parentIds?: Array<any>;
    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.data
     * @public
     */
    requireGroupCount?: boolean;
    /**
     * @docid
     * @type boolean
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
     * @type string
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchOperation?: string;
    /**
     * @docid
     * @type any
     * @prevFileNamespace DevExpress.data
     * @public
     */
    searchValue?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    select?: any;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.data
     * @public
     */
    skip?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    sort?: any;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.data
     * @public
     */
    take?: number;
    /**
     * @docid
     * @type Object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    totalSummary?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.data
     * @public
     */
    userData?: any;
}
