import {
  KeySelector,
  OrderingDescriptor,
  SelectionDescriptor,
} from '../data/data.types';

/**
 * @namespace DevExpress.data
 */
export type SearchOperation = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'startswith' | 'endswith' | 'contains' | 'notcontains';

/**
 * @namespace DevExpress.data
 */
export type GroupingInterval = 'year' | 'quarter' | 'month' | 'day' | 'dayOfWeek' | 'hour' | 'minute' | 'second';

/**
 * @namespace DevExpress.data
 */
export type SortDescriptor<T> = KeySelector<T> | OrderingDescriptor<T>;

/**
 * @namespace DevExpress.data
 */
export type GroupDescriptor<T> = KeySelector<T> | (OrderingDescriptor<T> & {
  groupInterval?: number | GroupingInterval;
  isExpanded?: boolean;
});

/**
 * @namespace DevExpress.data
 */
export type SelectDescriptor<T> = string | Array<string> | ((source: T) => any);

/**
 * @namespace DevExpress.data
 */
export type FilterDescriptor = any;

/**
 * @namespace DevExpress.data
 */
export type SummaryDescriptor<T> = KeySelector<T> | SelectionDescriptor<T> & {
  summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
};

/**
 * @namespace DevExpress.data
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
