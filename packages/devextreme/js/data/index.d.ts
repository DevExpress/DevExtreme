/**
 * @public
 */
export type SearchOperation = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'startswith' | 'endswith' | 'contains' | 'notcontains';

/**
 * @public
 */
export type GroupingInterval = 'year' | 'quarter' | 'month' | 'day' | 'dayOfWeek' | 'hour' | 'minute' | 'second';

export type KeySelector<T> = string | ((source: T) => string | number | Date | Object);

export type SelectionDescriptor<T> = {
    selector: KeySelector<T>;
};

type OrderingDescriptor<T> = SelectionDescriptor<T> & {
    desc?: boolean;
};

/**
 * @docid
 * @public
 * @type object
 * @skip
 */
export type SortDescriptor<T> = KeySelector<T> | OrderingDescriptor<T>;

/**
 * @docid
 * @public
 * @type object
 * @skip
 */
export type GroupDescriptor<T> = KeySelector<T> | (OrderingDescriptor<T> & {
  groupInterval?: number | GroupingInterval;
  isExpanded?: boolean;
});

/**
 * @docid
 * @public
 * @type object
 * @skip
 */
export type SelectDescriptor<T> = string | Array<string> | ((source: T) => any);

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
export type SummaryDescriptor<T> = KeySelector<T> | SelectionDescriptor<T> & {
  summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
};

export {
  /**
   * @deprecated Use LangParams from /common/data instead
   */
  LangParams,
  /**
   * @deprecated Use Store from /common/data instead
   */
  Store,
  /**
   * @deprecated Use StoreOptions from /common/data instead
   */
  StoreOptions,
} from '../common/data';
