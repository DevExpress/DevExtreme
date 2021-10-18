import DataSource, { Options } from './data_source';
import Store from './abstract_store';

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string|Array<any>
 * */
export type CommonDataSource<TItem, TKey = any> = string | Array<TItem> | Store<TItem, any, TKey> | Options<any, TItem, any, any, TKey> | DataSource<TItem, any, TKey>;
