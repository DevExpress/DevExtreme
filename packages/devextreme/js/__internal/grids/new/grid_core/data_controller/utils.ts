/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayStore, CustomStore } from '@js/common/data';
import type { Store } from '@js/data';
import type { DataSourceLike } from '@js/data/data_source';
import DataSource from '@js/data/data_source';
import { normalizeDataSourceOptions } from '@js/data/data_source/utils';
import { applyBatch } from '@ts/data/m_array_utils';

import type { DataObject, OperationOptions } from './types';

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
  remoteOperations: boolean | object | string,
  localStore: boolean,
  customStore: boolean,
): OperationOptions {
  if (remoteOperations instanceof String && remoteOperations !== 'auto') {
    throw new Error('Remote operations do not support any string values except \'auto\'');
  }

  const disabledAllRemoteOperations = {
    filtering: false,
    sorting: false,
    paging: false,
    summary: false,
  };
  if (remoteOperations === false) {
    return disabledAllRemoteOperations;
  }

  if (remoteOperations === 'auto') {
    if (localStore || customStore) {
      return disabledAllRemoteOperations;
    }
    return {
      filtering: true,
      sorting: true,
      paging: true,
      summary: false,
    };
  }

  const enabledAllRemoteOperations = {
    filtering: true,
    sorting: true,
    paging: true,
    summary: true,
  };
  if (remoteOperations === true) {
    return enabledAllRemoteOperations;
  }

  return remoteOperations as object;
}

export function normalizeLocalOptions(
  normalizedRemoteOperations: OperationOptions,
): OperationOptions {
  return {
    filtering: !normalizedRemoteOperations.filtering,
    sorting: !normalizedRemoteOperations.sorting,
    paging: !normalizedRemoteOperations.paging,
    summary: !normalizedRemoteOperations.summary,
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getLocalLoadOptions(originOptions, localOperations) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localLoadOptions = {} as any;
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return localLoadOptions;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getStoreLoadOptions(originOptions, localOperations) {
  const storeLoadOptions = originOptions;
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
