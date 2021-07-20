/**
 * @docid
 * @public
 */
export type SearchOperation = '='|'<>'|'>'|'>='|'<'|'<='|'startswith'|'endswith'|'contains'|'notcontains';

type KeySelector<T> = string | ((source: T) => string);

type BaseGroupDescriptor<T> = {
	selector: KeySelector<T>;	
};

/**
 * @docid
 * @public
 * @type object
 */
export type GroupDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
    desc?: boolean;
};

/**
 * @docid
 * @public
 * @type object
 */
export type SortDescriptor<T> = GroupDescriptor<T>;

/**
 * @docid
 * @public
 * @type object
 */
export type SelectDescriptor<T> = KeySelector<T>;
/**
 * @docid
 * @public
 */
 export type FilterDescriptor = any;

 /** 
 * @docid
 * @public
 * @type object
 */
export type SummaryDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
    summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

/**
 * @docid
 * @namespace DevExpress.data
 * @type object
 */
 export interface LoadOptions<T = any> {
    /**
     * @docid
     * @public
     */
    customQueryParams?: any;
    /**
     * @docid
     * @public
     */
    expand?: Array<string>;
    /**
     * @docid
     * @public
     * @type object
     */
    filter?: FilterDescriptor | Array<FilterDescriptor>;
    /**
     * @docid
     * @public
     * @type object
     */
    group?: GroupDescriptor<T> | Array<GroupDescriptor<T>>;
    /**
     * @docid
     * @public
     * @type object
     */
    groupSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
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
    searchOperation?: SearchOperation;
    /**
     * @docid
     * @public
     */
    searchValue?: any;
    /**
     * @docid
     * @public
     * @type object
     */
    select?: SelectDescriptor<T> | Array<SelectDescriptor<T>>;
    /**
     * @docid
     * @public
     */
    skip?: number;
    /**
     * @docid
     * @public
     * @type object
     */
    sort?: SortDescriptor<T> | Array<SortDescriptor<T>>;
    /**
     * @docid
     * @public
     */
    take?: number;
    /**
     * @docid
     * @public
     * @type object
     */
    totalSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
    /**
     * @docid
     * @public
     */
    userData?: any;
}