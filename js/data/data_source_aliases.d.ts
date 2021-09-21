import DataSource, { DataSourceOptions } from './data_source';
import Store from './abstract_store';

/**
 * @docid
 * @type string|Store|DataSourceOptions|Array<any>
 * */
export type DataSourceFactory<T> = string | Array<T> | Store | DataSourceOptions;

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string|Array<any>
 * */
export type DataSourceDefinition<T> = DataSourceFactory<T> | DataSource;
