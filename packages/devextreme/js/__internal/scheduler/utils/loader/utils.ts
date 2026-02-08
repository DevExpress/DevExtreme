import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';
import { normalizeDataSourceOptions } from '@ts/data/data_source/m_utils';

export const normalizeDataSource = <T>(
  dataSourceOptions: DataSourceLike<T> | null | undefined,
  options: object = {},
): DataSource<T, unknown> | undefined => {
  if (!dataSourceOptions) {
    return undefined;
  }

  if (dataSourceOptions instanceof DataSource) {
    return dataSourceOptions;
  }

  const result = {
    ...normalizeDataSourceOptions(dataSourceOptions, {}),
    ...options,
  };

  return new DataSource(result);
};

export const loadResource = async <T>(
  dataSource: DataSource<T, unknown>,
  forceReload = false,
): Promise<T[]> => {
  if (!dataSource) {
    return [];
  }

  if (forceReload) {
    return new Promise((resolve, reject) => {
      dataSource
        .reload()
        .then(resolve, reject);
    });
  }

  if (dataSource.isLoaded()) {
    return dataSource.items() as T[];
  }

  return new Promise((resolve, reject) => {
    dataSource
      .load()
      .then(resolve, reject);
  });
};
