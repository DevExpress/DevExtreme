import DataSource, { DataSourceOptions } from './data_source';
import Store from './abstract_store';

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions
 * */
export type BaseMixinDataSource = Store | DataSource | DataSourceOptions;

/**
 * @docid
 * @type Store|DataSourceOptions|Array<any>
 * */
export type DataSourceMixinArray<T> = Array<T> | Store | DataSourceOptions;

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string
 * */
export type DataSourceMixinString = string | BaseMixinDataSource;

/**
 * @docid
 * @type Store|DataSource|DataSourceOptions|string|Array<any>
 * */
export type ComplexCollectionDataSource<T> = Array<T> | DataSourceMixinString;
