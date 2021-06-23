import { FilterDescriptor, GroupDescriptor, SelectDescriptor, SortDescriptor, SummaryDescriptor } from './index';
import { SearchOperation } from './data_source';

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
