import { isObject } from '@js/core/utils/type';
import type Store from '@ts/data/abstract_store';

import type { RemoteOperations, RemoteOperationsOptions } from '../types';
import { isCustomStore, isLocalStore } from './store';

export function normalizeRemoteOperations(
  remoteOperations: RemoteOperations,
  store: Store,
): RemoteOperationsOptions {
  const allExceptGroupPagingEnabled: RemoteOperationsOptions = {
    filtering: true,
    sorting: true,
    paging: true,
    grouping: true,
    summary: true,
  };

  // groupPaging only works when every operation runs remotely.
  if (isObject(remoteOperations) && remoteOperations.groupPaging) {
    return { ...allExceptGroupPagingEnabled, ...remoteOperations };
  }
  if (remoteOperations === 'auto') {
    return isLocalStore(store) || isCustomStore(store)
      ? {}
      : {
        filtering: true,
        sorting: true,
        paging: true,
      };
  }
  if (remoteOperations === true) {
    return allExceptGroupPagingEnabled;
  }

  if (!remoteOperations) {
    return {};
  }

  return remoteOperations;
}
