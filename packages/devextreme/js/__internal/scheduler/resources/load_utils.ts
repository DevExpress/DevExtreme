import type { DataSource as DataSourceType } from '@js/common/data';
import type { DataSourceLike } from '@js/data/data_source';
import { DataSource } from '@ts/data/data_source/m_data_source';
import { normalizeDataSourceOptions } from '@ts/data/data_source/m_utils';

import { getAppointmentResourceAccessor, getResourceIndex } from './appointment_resource_data_accessor';
import { ResourceDataAccessor } from './resource_data_accessor';
import type {
  RawResourceData,
  Resource,
  ResourceConfig,
  SafeResourceConfig,
} from './types';

type ResourceDataSource = DataSourceType<RawResourceData, string>;

const getWrappedDataSource = (dataSource: DataSourceLike<RawResourceData>): ResourceDataSource => {
  if (dataSource instanceof DataSource) {
    return dataSource as ResourceDataSource;
  }

  const result = {
    ...normalizeDataSourceOptions(dataSource, {}),
    pageSize: 0,
  };

  if (typeof dataSource !== 'string' && 'filter' in dataSource) {
    result.filter = dataSource.filter;
  }

  return new DataSource(result) as ResourceDataSource;
};

const loadResource = (dataSourceConfig: ResourceConfig['dataSource']): Promise<RawResourceData[]> => {
  if (!dataSourceConfig) {
    return Promise.resolve([]);
  }

  const dataSource = getWrappedDataSource(dataSourceConfig);
  if (dataSource.isLoaded()) {
    return Promise.resolve(dataSource.items() as RawResourceData[]);
  }

  return new Promise((resolve, reject) => {
    dataSource
      .load()
      .then(resolve, reject);
  });
};

const unwrapResourceValues = (
  config: SafeResourceConfig,
  items: RawResourceData[],
): Resource => {
  const resourceDataAccessor = new ResourceDataAccessor(config);

  return {
    allowMultiple: config.allowMultiple,
    useColorAsDefault: config.useColorAsDefault,
    resourceIndex: config.resourceIndex,
    idGetter: config.idGetter,
    idSetter: config.idSetter,
    resourceName: config.resourceName,
    items: items.map((item) => ({
      id: resourceDataAccessor.get('id', item),
      text: resourceDataAccessor.get('text', item),
      color: resourceDataAccessor.get('color', item),
    })),
  };
};

export const prepareResourcesConfig = (
  resourceConfig: ResourceConfig[],
): SafeResourceConfig[] => resourceConfig
  .filter(getResourceIndex)
  .map((config) => ({
    allowMultiple: Boolean(config.allowMultiple),
    useColorAsDefault: Boolean(config.useColorAsDefault),
    resourceIndex: String(getResourceIndex(config)),
    resourceName: config.label,
    ...getAppointmentResourceAccessor(config),
    dataSource: config.dataSource,
  }));

export const loadResources = (
  resourceConfig: SafeResourceConfig[] = [],
  groupsToLoad: string[] = [],
  promiseMap: Record<string, Promise<Resource>> = {},
): Promise<Resource[]> => {
  const resourcesToLoad = resourceConfig
    .filter((config) => groupsToLoad.includes(config.resourceIndex));
  const promises = resourcesToLoad.reduce<Promise<Resource>[]>((result, config) => {
    if (promiseMap[config.resourceIndex] === undefined) {
      promiseMap[config.resourceIndex] = loadResource(config.dataSource)
        .then((items) => unwrapResourceValues(config, items));
      result.push(promiseMap[config.resourceIndex]);
    }

    return result;
  }, []);

  return Promise.all(promises);
};
