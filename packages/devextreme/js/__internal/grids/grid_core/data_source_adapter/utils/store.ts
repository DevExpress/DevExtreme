import { ArrayStore as ArrayStoreClass, CustomStore } from '@js/common/data';
import type { Store } from '@js/data';
import type { ArrayStore } from '@ts/data/types';

export function isLocalStore(store: Store | undefined): store is ArrayStore {
  return store instanceof ArrayStoreClass;
}

export function isCustomStore(store: Store): store is CustomStore {
  return store instanceof CustomStore;
}
