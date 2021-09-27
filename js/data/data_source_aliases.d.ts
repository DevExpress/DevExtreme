import DataSource, { DataSourceOptions } from './data_source';
import Store from './abstract_store';

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string|Array<any>
 * */
export type CommonDataSource<T> = string | Array<T> | Store<T> | DataSourceOptions<T> | DataSource<T>;
