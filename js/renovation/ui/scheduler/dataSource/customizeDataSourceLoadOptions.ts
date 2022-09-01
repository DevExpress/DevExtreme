import { Options } from './types';
import DataSource from '../../../../data/data_source';

/**
 * Adds additional parameters to load options in data source load function
 *
 * @param dataSource
 * @param options
 */
export const customizeDataSourceLoadOptions = (dataSource: DataSource, options: Options): void => {
  // @ts-expect-error disable non ts parameter EventName
  dataSource.on('customizeStoreLoadOptions', (loadOptions) => {
    const { storeLoadOptions } = loadOptions;
    Object.entries(options).forEach(([key, value]) => {
      storeLoadOptions[key] = typeof value === 'function' ? value() : value;
    });
  });
};
