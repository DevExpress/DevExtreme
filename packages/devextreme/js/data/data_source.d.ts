import {
  DataSource,
  DataSourceOptions,
  FilterDescriptor,
  GroupDescriptor,
  LangParams,
  SearchOperation,
  SelectDescriptor,
  SortDescriptor,
  Store,
  StoreOptions,
} from '../common/data';

export {
  DataSourceOptions,
} from '../common/data';
export type Options<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
    TKey = any,
> = DataSourceOptions<TStoreItem, TItem, TMappedItem, TKey>;

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
 */
export type DataSourceLike<TItem, TKey = any> =
    string |
    Array<TItem> |
    Store<TItem, TKey> |
    DataSourceOptionsStub<any, any, TItem> |
    DataSource<TItem, TKey>;

export interface DataSourceOptionsStub<
    TStoreItem = any,
    TMappedItem = TStoreItem,
    TItem = TMappedItem,
> {
    customQueryParams?: any;
    expand?: Array<string> | string;
    filter?: FilterDescriptor | Array<FilterDescriptor>;
    group?: GroupDescriptor<TItem> | Array<GroupDescriptor<TItem>>;
    langParams?: LangParams;
    map?: ((dataItem: TStoreItem) => TMappedItem);
    onChanged?: ((e: { readonly changes?: Array<TMappedItem> }) => void);
    onLoadError?: ((error: { readonly message?: string }) => void);
    onLoadingChanged?: ((isLoading: boolean) => void);
    pageSize?: number;
    paginate?: boolean;
    postProcess?: ((data: Array<TMappedItem>) => Array<TItem>);
    pushAggregationTimeout?: number;
    requireTotalCount?: boolean;
    reshapeOnPush?: boolean;
    searchExpr?: string | Function | Array<string | Function>;
    searchOperation?: SearchOperation;
    searchValue?: any;
    select?: SelectDescriptor<TItem>;
    sort?: SortDescriptor<TItem> | Array<SortDescriptor<TItem>>;
    store?: Array<TStoreItem> | Store<TStoreItem, any> | StoreOptions<TStoreItem, any>;
}

export default DataSource;
