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
 export interface LoadOptions<TKey = any, TValue = any> {
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
    group?: GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>>;
    /**
     * @docid
     * @public
     * @type object
     */
    groupSummary?: SummaryDescriptor<TValue> | Array<SummaryDescriptor<TValue>>;
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
    select?: SelectDescriptor<TValue> | Array<SelectDescriptor<TValue>>;
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
    sort?: SortDescriptor<TValue> | Array<SortDescriptor<TValue>>;
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
    totalSummary?: SummaryDescriptor<TValue> | Array<SummaryDescriptor<TValue>>;
    /**
     * @docid
     * @public
     */
    userData?: any;
}