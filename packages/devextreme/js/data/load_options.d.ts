import {
  FilterDescriptor,
  GroupDescriptor,
  SearchOperation,
  SelectDescriptor,
  SortDescriptor,
  SummaryDescriptor
} from "../data";

/**
 * @public
 * @docid LoadOptions
 * @namespace DevExpress.data
 * @type object
 */
export interface BaseLoadOptions<T = any> {
  /**
   * @docid
   * @public
   */
  customQueryParams?: any;
  /**
   * @docid
   * @public
   */
  startDate?: Date;
  /**
   * @docid
   * @public
   */
  endDate?: Date;
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
   * @type SummaryDescriptor | Array<SummaryDescriptor>
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
  select?: SelectDescriptor<T>;
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
   * @type SummaryDescriptor | Array<SummaryDescriptor>
   */
  totalSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
  /**
   * @docid
   * @public
   */
  userData?: any;
}

/** @deprecated Use LoadOptions from 'devextreme/data' instead */
export interface LoadOptions extends BaseLoadOptions { }
