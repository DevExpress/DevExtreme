/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayStore, CustomStore } from '@js/common/data';
import type { Store } from '@js/data';
import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';
import { normalizeDataSourceOptions } from '@js/data/data_source/utils';
import { applyBatch } from '@ts/data/m_array_utils';

import type {
  DataObject,
  InternalLoadOptions,
  InternalOperationOptions,
  OperationOptions,
  RemoteOperations,
} from './types';

export function normalizeDataSource(
  dataSourceLike: DataSourceLike<unknown, unknown> | null | undefined,
  keyExpr: string | string[] | undefined,
): DataSource<unknown, unknown> {
  if (dataSourceLike instanceof DataSource) {
    return dataSourceLike;
  }

  if (Array.isArray(dataSourceLike)) {
    // eslint-disable-next-line no-param-reassign
    dataSourceLike = {
      store: {
        type: 'array',
        data: dataSourceLike,
        key: keyExpr,
      },
    };
  }

  // TODO: research making second param not required
  return new DataSource(normalizeDataSourceOptions(dataSourceLike, undefined));
}

export function isLocalStore(store: Store): boolean {
  return store instanceof ArrayStore;
}

export function isCustomStore(store: Store): boolean {
  return store instanceof CustomStore;
}

export function normalizeRemoteOptions(
  remoteOperations: RemoteOperations,
  localStore: boolean,
  customStore: boolean,
): OperationOptions {
  const allOperationsEnabled = {
    filtering: true,
    sorting: true,
    paging: true,
    grouping: true,
  };
  const allOperationDisabled = {
    filtering: false,
    sorting: false,
    paging: false,
    grouping: false,
  };

  switch (true) {
    case remoteOperations === 'auto':
      return localStore || customStore
        ? allOperationDisabled
        : allOperationsEnabled;
    case remoteOperations === false:
      return allOperationDisabled;
    case remoteOperations === true:
      return allOperationsEnabled;
    default:
      return remoteOperations as OperationOptions;
  }
}

export function normalizeLocalOptions(
  normalizedRemoteOperations: OperationOptions,
): OperationOptions {
  return {
    filtering: !normalizedRemoteOperations.filtering,
    sorting: !normalizedRemoteOperations.sorting,
    paging: !normalizedRemoteOperations.paging,
    grouping: !normalizedRemoteOperations.grouping,
  };
}

export function getLocalLoadOptions(
  originOptions: InternalLoadOptions,
  localOperations: InternalOperationOptions,
): InternalLoadOptions {
  const localLoadOptions: InternalLoadOptions = {};

  if (localOperations.sorting) {
    localLoadOptions.sort = originOptions.sort;
  }

  if (localOperations.filtering) {
    localLoadOptions.filter = originOptions.filter;
  }

  if (localOperations.paging) {
    localLoadOptions.skip = originOptions.skip;
    localLoadOptions.take = originOptions.take;
  }

  if (localOperations.summary) {
    localLoadOptions.summary = originOptions.summary;
  }

  if (localOperations.grouping) {
    localLoadOptions.group = originOptions.group;
  }

  return localLoadOptions;
}

export function getStoreLoadOptions(
  originOptions: InternalLoadOptions,
  localOperations: InternalOperationOptions,
): InternalLoadOptions {
  const storeLoadOptions = { ...originOptions };

  if (localOperations.sorting) {
    delete storeLoadOptions.sort;
  }

  if (localOperations.filtering) {
    delete storeLoadOptions.filter;
  }

  if (localOperations.paging) {
    delete storeLoadOptions.skip;
    delete storeLoadOptions.take;
  }

  if (localOperations.summary) {
    delete storeLoadOptions.summary;
  }

  if (localOperations.grouping) {
    delete storeLoadOptions.group;
  }

  return storeLoadOptions;
}

export function updateItemsImmutable(
  data: DataObject[],
  changes: any[],
  keyInfo: any,
): DataObject[] {
  // @ts-expect-error
  return applyBatch({
    keyInfo,
    data,
    changes,
    immutable: true,
  });
}
