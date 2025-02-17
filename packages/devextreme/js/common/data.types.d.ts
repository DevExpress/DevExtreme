import {
  KeySelector,
  OrderingDescriptor,
  SelectionDescriptor,
} from '../data/data.types';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SearchOperation = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'startswith' | 'endswith' | 'contains' | 'notcontains';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GroupingInterval = 'year' | 'quarter' | 'month' | 'day' | 'dayOfWeek' | 'hour' | 'minute' | 'second';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SortDescriptor<T> = KeySelector<T> | OrderingDescriptor<T>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GroupDescriptor<T> = KeySelector<T> | (OrderingDescriptor<T> & {
  groupInterval?: number | GroupingInterval;
  isExpanded?: boolean;
});

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SelectDescriptor<T> = string | Array<string> | ((source: T) => any);

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FilterDescriptor = any;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SummaryDescriptor<T> = KeySelector<T> | SelectionDescriptor<T> & {
  summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface LoadOptions<T = any> {
  /**
   * An object for storing additional settings that should be sent to the server. Relevant to the ODataStore only.
   */
  customQueryParams?: any;
  /**
   * Specifies the start date of the date navigator range. Relevant to the Scheduler only.
   */
  startDate?: Date;
  /**
   * Specifies the end date of the date navigator range. Relevant to the Scheduler only.
   */
  endDate?: Date;
  /**
   * An array of strings that represent the names of navigation properties to be loaded simultaneously with the ODataStore.
   */
  expand?: Array<string>;
  /**
   * A filter expression.
   */
  filter?: FilterDescriptor | Array<FilterDescriptor>;
  /**
   * A group expression.
   */
  group?: GroupDescriptor<T> | Array<GroupDescriptor<T>>;
  /**
   * A group summary expression. Used with the group setting.
   */
  groupSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
  /**
   * The IDs of the rows being expanded. Relevant only when the CustomStore is used in the TreeList UI component.
   */
  parentIds?: Array<any>;
  /**
   * Indicates whether a top-level group count is required. Used in conjunction with the filter, take, skip, requireTotalCount, and group settings.
   */
  requireGroupCount?: boolean;
  /**
   * Indicates whether the total count of data objects is needed.
   */
  requireTotalCount?: boolean;
  /**
   * A data field or expression whose value is compared to the search value.
   */
  searchExpr?: string | Function | Array<string | Function>;
  /**
   * A comparison operation.
   */
  searchOperation?: SearchOperation;
  /**
   * The current search value.
   */
  searchValue?: any;
  /**
   * A select expression.
   */
  select?: SelectDescriptor<T>;
  /**
   * The number of data objects to be skipped from the result set&apos;s start. In conjunction with take, used to implement paging.
   */
  skip?: number;
  /**
   * A sort expression.
   */
  sort?: SortDescriptor<T> | Array<SortDescriptor<T>>;
  /**
   * The number of data objects to be loaded. In conjunction with skip, used to implement paging.
   */
  take?: number;
  /**
   * A total summary expression.
   */
  totalSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
  /**
   * An object for storing additional settings that should be sent to the server.
   */
  userData?: any;
}
