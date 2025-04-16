import { wrapToArray } from '@js/core/utils/array';

import type { ResourceConfig, ResourcesConfig, SafeAppointment } from '../types';
import {
  getFieldExpr, getIdExpr, getTextExpr, getWrappedDataSource,
} from './m_utils';

type ResourceMap = Record<string, {
  label: string;
  texts: Map<unknown, string>;
}>;
export interface AppointmentResource {
  label: string;
  values: string[];
}

const loadResource = (dataSourceConfig: ResourceConfig['dataSource']): Promise<Record<string, unknown>[]> => {
  if (!dataSourceConfig) {
    return Promise.resolve([]);
  }

  const dataSource = getWrappedDataSource(dataSourceConfig);
  if (dataSource.isLoaded()) {
    return Promise.resolve(dataSource.items());
  }

  return new Promise((resolve, reject) => {
    dataSource
      .load()
      .done((list) => resolve(list))
      .fail(() => reject());
  });
};
const getAppointmentResources = (
  resourceMap: ResourceMap,
  rawAppointment: SafeAppointment,
): AppointmentResource[] => Object
  .entries(resourceMap)
  .reduce<AppointmentResource[]>((result, [fieldName, data]) => {
    const item: AppointmentResource = {
      label: data.label,
      values: [],
    };

    if (fieldName in rawAppointment) {
      wrapToArray(rawAppointment[fieldName])
        .forEach((value) => {
          item.values.push(data.texts.get(value) ?? '');
        });
    }

    if (item.values.length) {
      result.push(item);
    }

    return result;
  }, []);

export class ResourceProcessor {
  private loadingPromise?: Promise<ResourceMap>;

  constructor(
    public resourceConfig: ResourcesConfig = [],
    private readonly resourceMap: ResourceMap = {},
  ) {}

  public async getAppointmentResourcesValues(
    rawAppointment: SafeAppointment,
  ): Promise<AppointmentResource[]> {
    if (this.resourceConfig.length === 0) {
      return Promise.resolve([]);
    }

    return this.loadDataSource()
      .then((resourceMap) => getAppointmentResources(resourceMap, rawAppointment));
  }

  private loadDataSource(): Promise<ResourceMap> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = Promise.all(
      this.resourceConfig.map(
        (resource) => loadResource(resource.dataSource)
          .then((items) => this.onResourceLoaded(resource, items)),
      ),
    ).then(() => this.resourceMap);

    return this.loadingPromise;
  }

  private onResourceLoaded(resource: ResourceConfig, items: Record<string, unknown>[]): void {
    const idExpr = getIdExpr(resource);
    const textExpr = getTextExpr(resource);

    this.resourceMap[getFieldExpr(resource)] = {
      label: resource.label ?? '',
      texts: items.reduce<Map<unknown, string>>((result, item) => {
        result.set(item[idExpr], (item[textExpr] ?? '') as string);

        return result;
      }, new Map()),
    };
  }
}
