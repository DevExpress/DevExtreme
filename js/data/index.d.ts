import CustomStore, { Options as CustomStoreOptions } from './custom_store';
import ArrayStore, { Options as ArrayStoreOptions } from './array_store';
import LocalStore, { Options as LocalStoreOptions } from './local_store';
import ODataStore, { Options as ODataStoreOptions } from './odata/store';

/**
 * @docid
 * @public
 */
export type SearchOperation = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'startswith' | 'endswith' | 'contains' | 'notcontains';

type KeySelector<T> = string | ((source: T) => string | number | Date | Object);

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
export type SelectDescriptor<T> = string | Array<string> | ((source: T) => any);
/**
 * @docid
 * @public
 */
export type FilterDescriptor = any;
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
 /**
 * @docid
 * @public
 * @type object
 */
export type SummaryDescriptor<T> = KeySelector<T> | BaseGroupDescriptor<T> & {
    summaryType?: 'sum' | 'avg' | 'min' | 'max' | 'count';
};

/**
 * @public
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
     * @type object
     */
    totalSummary?: SummaryDescriptor<T> | Array<SummaryDescriptor<T>>;
    /**
     * @docid
     * @public
     */
    userData?: any;
}

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
 * @docid
 * @public
 * @namespace DevExpress.data.utils
 * @type object
 */
export type StoreOptions<TItem = any, TKey = any> =
    CustomStoreOptions<TItem, TKey> |
    ArrayStoreOptions<TItem, TKey> & { type: 'array' } |
    LocalStoreOptions<TItem, TKey> & { type: 'local' } |
    ODataStoreOptions<TItem, TKey> & { type: 'odata' };
