import DataSource, { DataSourceOptions } from './data_source';
import Store from './abstract_store';

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string|Array<any>
 * */
export type DataSourceDefinition<T> = string | Array<T> | Store<any, T> | DataSourceOptions<any, T> | DataSource<any, T>;
