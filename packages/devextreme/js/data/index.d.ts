import ArrayStore, { ArrayStoreOptions } from './array_store';
import CustomStore, { CustomStoreOptions } from './custom_store';
import LocalStore, { LocalStoreOptions } from './local_store';
import ODataStore, { ODataStoreOptions } from './odata/store';

/**
 * @public
 * @namespace DevExpress.data.utils
 */
export type Store<TItem = any, TKey = any> =
    CustomStore<TItem, TKey> |
    ArrayStore<TItem, TKey> |
    LocalStore<TItem, TKey> |
    ODataStore<TItem, TKey>;

/**
 * @public
 * @namespace DevExpress.data.utils
 * @type object
 */
export type StoreOptions<TItem = any, TKey = any> =
    CustomStoreOptions<TItem, TKey> |
    ArrayStoreOptions<TItem, TKey> & { type: 'array' } |
    LocalStoreOptions<TItem, TKey> & { type: 'local' } |
    ODataStoreOptions<TItem, TKey> & { type: 'odata' };

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

/**
 * @docid
 * @public
 */
export type LangParams = {
  /**
   * @docid
   * @public
   */
  locale: string;
  /**
   * @docid
   * @public
   * @type object
   */
  collatorOptions?: Intl.CollatorOptions;
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

/**
 * @public
 * @docid LoadOptions
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
