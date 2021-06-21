import { FilterDescriptor, GroupDescriptor, SelectDescriptor, SortDescriptor } from ".";
import { SearchOperation } from "./data_source";

type SummaryDescriptor = {
    selector: string | Function;
    summaryType: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
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
    group?: GroupDescriptor | Array<GroupDescriptor>;
    /**
     * @docid
     * @public
     */
    groupSummary?: SummaryDescriptor | Array<SummaryDescriptor>;
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
    select?: SelectDescriptor | Array<SelectDescriptor>;
    /**
     * @docid
     * @public
     */
    skip?: number;
    /**
     * @docid
     * @public
     */
    sort?: SortDescriptor | Array<SortDescriptor>;
    /**
     * @docid
     * @public
     */
    take?: number;
    /**
     * @docid
     * @public
     */
    totalSummary?: SummaryDescriptor | Array<SummaryDescriptor>;
    /**
     * @docid
     * @public
     */
    userData?: any;
}
