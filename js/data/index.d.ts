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
 */
export type GroupDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
    desc?: boolean;
};

/**
 * @docid
 * @public
 */
export type SortDescriptor<T> = GroupDescriptor<T>;

/**
 * @docid
 * @public
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
 */
type SummaryDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
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
     */
    filter?: FilterDescriptor | Array<FilterDescriptor>;
    /**
     * @docid
     * @public
     */
    group?: GroupDescriptor<TValue> | Array<GroupDescriptor<TValue>>;
    /**
     * @docid
     * @public
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
     */
    totalSummary?: SummaryDescriptor<TValue> | Array<SummaryDescriptor<TValue>>;
    /**
     * @docid
     * @public
     */
    userData?: any;
}