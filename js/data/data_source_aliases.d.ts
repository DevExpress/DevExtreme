import DataSource, { DataSourceOptions } from './data_source';
import Store from './abstract_store';

export type BaseMixinDataSource = Store | DataSource | DataSourceOptions;
export type DataSourceMixinArray<T> = Array<T> | Store | DataSourceOptions;
export type DataSourceMixinString = string | BaseMixinDataSource;
export type ComplexCollectionDataSource<T> = Array<T> | DataSourceMixinString;
